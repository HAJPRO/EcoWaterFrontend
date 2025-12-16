import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
// O'zgartirish: Salepos Service ga o'tishni osonlashtirish uchun OrderManagmentService ni SaleposManagmentService deb faraz qilamiz
import { SaleposManagmentService } from "../../../ApiServices/Sale/salepos/salepos.service"; 
import { CustomerManagmentService } from "../../../ApiServices/Customers/c-managment/customer.service";
import { ReadyWarehouseStore } from "../../Warehouses/r-warehouse/warehouse.store"; // Ombor Store
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";

const loading = Loading();

/** @typedef {Object} CartItem ... */
/** @typedef {Object} SalesSession ... */

export const SaleposManagmentStore = defineStore("SaleposManagmentStore", {
  state: () => {
    return {
      // ---------------- POS Session Management ----------------
      /** @type {SalesSession[]} */
      sessions: [
        { 
            id: 1, 
            name: "Chek #1", 
            cart: [], 
            customerId: null, 
            supplierId: null,
            // discountPercent, taxEnabled, paymentType'lar endi session ichida bo'lishi kerak
            // Lekin mavjud koddagi state bilan birlashtirish uchun:
            // discountPercent: 0,
            // taxEnabled: false,
            // paymentType: "naqd",
        },
      ],
      activeSessionId: 1,
      
      // ---------------- Data ----------------
      customers: [], 
      suppliers: [], 
      
      // ---------------- Transaction Data (Majburiy bo'lsa, sessions ichiga o'tkazish afzal) ----------------
      discountPercent: 0,
      taxEnabled: false,
      paymentType: "naqd", 
      
      // ---------------- UI/API State ----------------
      order_detail_modal: false, 
      order: null, 
    };
  },

  getters: {
    activeSessionData(state) {
      return state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0];
    },

    activeCustomer(state) {
      if (!this.activeSessionData.customerId) return null;
      return state.customers.find((c) => c._id === this.activeSessionData.customerId);
    },

    activeSupplier(state) {
      if (!this.activeSessionData.supplierId) return null;
      return state.suppliers.find((s) => s._id === this.activeSessionData.supplierId);
    },
    
    subtotal() {
      return this.activeSessionData.cart.reduce((s, i) => s + i.price * i.qty, 0);
    },
    // Eslatma: discountPercent va taxEnabled state.discountPercent dan olinadi, session ichidan emas
    discountAmount() {
      return this.subtotal * (this.discountPercent / 100);
    },
    taxAmount() {
      return this.taxEnabled ? (this.subtotal - this.discountAmount) * 0.12 : 0;
    },
    grandTotal() {
      return Math.max(0, this.subtotal - this.discountAmount + this.taxAmount);
    },
  },

  actions: {
    // --- Session Actions (o'zgarishsiz) ---
    addSession() {
        const id = Date.now();
        this.sessions.push({ 
            id, 
            name: `Chek #${this.sessions.length + 1}`, 
            cart: [], 
            customerId: null, 
            supplierId: null 
        });
        this.activeSessionId = id;
    },

    removeSession(id) {
        if (this.sessions.length <= 1) return;
        const idx = this.sessions.findIndex((s) => s.id === id);
        this.sessions = this.sessions.filter((s) => s.id !== id);
        if (this.activeSessionId === id) {
            this.activeSessionId = this.sessions[Math.max(0, idx - 1)].id;
        }
    },

    // --- Data Fetching Actions (o'zgarishsiz qoldi) ---
    async GetAllCustomers() {
        // ... Logika
    },

    async GetAllDriversAsSuppliers() {
        // ... Logika
    },

    // ---------------- TRANSACTION PROCESSING (YANGILANGAN LOGIKA) ----------------
    
    /**
     * Yangi POS savdosini yaratish va yakunlash (ZAXIRA NAZORATI)
     * @returns {boolean} - Tranzaksiya muvaffaqiyatli yakunlansa true
     */
    async CreateSaleTransaction(type = 'process') {
      const sessionData = this.activeSessionData;
      const warehouseStore = ReadyWarehouseStore();
      
      if (!sessionData.customerId) {
        ToastifyService.ToastError({ msg: "To'lovni yakunlash uchun mijozni tanlang!" });
        return false;
      }
      if (sessionData.cart.length === 0) {
        ToastifyService.ToastError({ msg: "Savat bo'sh, mahsulot qo'shing!" });
        return false;
      }

      const loader = loading.show();
      
      try {
        // =========================================================
        // 1. 🚨 ZAXIRANI BIRDANIGA TO'LIQ TEKSHIRISH
        // =========================================================
        
        // ReadyWarehouseStore'dan mahsulotlar ro'yxatini olish
        const { products } = storeToRefs(warehouseStore); 

        // Zaxirani tekshirish jarayoni
        for (const cartItem of sessionData.cart) {
            // Frontend'dagi mahsulot ID'si bilan ombordagi mahsulotni topish
            const productInStock = products.value.find(p => p._id === cartItem.id || p.id === cartItem.id); 
            const currentStock = productInStock?.stock || 0;

            if (currentStock < cartItem.qty) {
                loader.hide();
                ToastifyService.ToastError({ 
                    msg: `${cartItem.name} uchun zaxira yetarli emas! Omborda: ${currentStock} dona.`, 
                    duration: 5000 
                });
                return false; // Tranzaksiyani bekor qilish
            }
        }
        
        // Zaxira tekshiruvidan muvaffaqiyatli o'tdi.
        
        // --- 2. Payloadni tayyorlash ---
        const itemsToUpdateStock = sessionData.cart.map(item => ({
          productId: item.id, // Mahsulot IDsi
          quantity: item.qty, // Sotilgan miqdor
        }));
        
        const payload = {
          customerId: sessionData.customerId,
          driverId: sessionData.supplierId, 
          paymentType: this.paymentType, // Asosiy state'dan olinadi
          discountPercent: this.discountPercent, // Asosiy state'dan olinadi
          taxEnabled: this.taxEnabled, // Asosiy state'dan olinadi
          items: itemsToUpdateStock.map(item => ({
            productId: item.productId, 
            quantity: item.quantity, 
            salePrice: sessionData.cart.find(c => c.id === item.productId).price,
          })),
          totalAmount: this.grandTotal,
          subTotal: this.subtotal,
          status: type === 'process' ? "Yakunlangan" : "Qoralama", 
        };
        
        // --- 3. API orqali sotuv tranzaksiyasini saqlash ---
        const data = await SaleposManagmentService.CreateSale(payload); // O'zgartirish

        // --- 4. Ombor zaxirasini yangilash (minus qilish) ---
        // Bu bosqich faqat sotuv muvaffaqiyatli saqlangandan keyin bajariladi
        if (warehouseStore.UpdateStock) {
            // Zaxirani yangilash uchun alohida API call service ichida bo'lishi kerak.
            await warehouseStore.UpdateStock({ items: itemsToUpdateStock, action: 'subtract' }); 
            ToastifyService.ToastSuccess({ msg: "Ombor zaxirasi yangilandi." });
        }

        ToastifyService.ToastSuccess({ msg: data.data.msg || "Sotuv muvaffaqiyatli yakunlandi!" });
        
        // --- 5. Seansni tozalash ---
        sessionData.cart = [];
        sessionData.customerId = null;
        sessionData.supplierId = null;
        this.discountPercent = 0;
        this.taxEnabled = false;
        this.paymentType = "naqd";
        
        return true; // Muvaffaqiyat
      } catch (error) {
        // Xatolikni Pinia'dan to'g'ri qayta ishlash
        const errorMsg = error.response?.data?.msg || error.message || "To'lov jarayonida xatolik yuz berdi.";
        ToastifyService.ToastError({ msg: errorMsg });
        return false; // Xato
      } finally {
        loader.hide();
      }
    },
    
    // --- Legacy Actions for Modals/Details (o'zgarishsiz qoldi) ---
    async OrderGetById(id) {
        // ... Logika
    },
  },
});