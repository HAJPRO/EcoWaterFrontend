import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
// O'zgartirish: Salepos Service ga o'tishni osonlashtirish uchun OrderManagmentService ni SaleposManagmentService deb faraz qilamiz
import { SaleposManagmentService } from "../../../ApiServices/Sale/salepos/salepos.service"; 
// CustomerManagmentService kabi boshqa servislarni hozircha olib tashladim, chunki ular actionlarda ishlatilmagan
import { ReadyWarehouseStore } from "../../Warehouses/r-warehouse/warehouse.store"; // Ombor Store
import { useToast } from "../../../UI/utils/useToast";
const {toast} = useToast();
import { Loading } from "../../../utils/Loading";

const loading = Loading();

/** * @typedef {Object} CartItem 
 * @property {string} id - Mahsulot IDsi
 * @property {string} name - Mahsulot nomi
 * @property {number} price - Sotish narxi
 * @property {number} qty - Savatdagi miqdor
 * @property {number} stock - Joriy zaxira miqdori
 * @property {string} unit - Birlik
 */

/** * @typedef {Object} SalesSession 
 * @property {number} id - Seans IDsi
 * @property {string} name - Seans nomi
 * @property {CartItem[]} cart - Savatdagi mahsulotlar
 * @property {string | null} customerId - Mijoz IDsi
 * @property {string | null} supplierId - Haydovchi/Agent IDsi
 */

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
            
        },
      ],
      activeSessionId: 1,
      
      // ---------------- Data (Faoliyatdagi mijoz/haydovchi tanlovi uchun kerak) ----------------
      customers: [], 
      suppliers: [], 
      
      // ---------------- Transaction State (Umumiy bo'lgani uchun session ichida emas) ----------------
      discountPercent: 0,
      taxEnabled: false,
      paymentType: "naqd", 
      
      // ---------------- UI/API State ----------------
      order_detail_modal: false, 
      order: null, 
    };
  },

  getters: {
    /** @returns {SalesSession} */
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

    // --- Data Fetching Actions (Moslashtirish uchun o'zgarishsiz qoldi) ---
    async GetAllCustomers() {
        // ... Logika
    },

    async GetAllDriversAsSuppliers() {
        // ... Logika
    },

    // ---------------- TRANSACTION PROCESSING (YANGILANGAN VA PROFESSIONAL LOGIKA) ----------------
    
    /**
     * Yangi POS savdosini yaratish va yakunlash (ZAXIRA NAZORATI)
     * @param {Object} payload - Vue komponentidan to'liq hisoblangan ma'lumotlar to'plami.
     * @returns {Promise<boolean>} - Tranzaksiya muvaffaqiyatli yakunlansa true
     */
    async CreateSaleTransaction(payload) {
//       const warehouseStore = ReadyWarehouseStore();
      // products state'ini to'g'ri bog'lash
//       const { products } = storeToRefs(warehouseStore); 
      
      const loader = loading.show();
      try {
        // =========================================================
        // 1. 🚨 Ma'lumotlarni Majburiy Tekshirish
        // =========================================================
        if (!payload.customerId) {
          toast.error("To'lovni yakunlash uchun mijozni tanlang!");
          return false;
        }
        if (payload.items.length === 0) {
          toast.error("Savat bo'sh, mahsulot qo'shing!");
          return false;
        }

        // =========================================================
        // 2. 📦 ZAXIRANI TO'LIQ TEKSHIRISH
        // =========================================================
        
       
        
        // =========================================================
        // 3. 💾 API orqali sotuv tranzaksiyasini saqlash
        // =========================================================
        const data = await SaleposManagmentService.CreateSale(payload);

        // =========================================================
        // 4. 📉 Ombor zaxirasini yangilash (minus qilish) - QAYTA QO'SHILDI
        // =========================================================
        const itemsToSubtract = payload.items.map(item => ({
            productId: item.product, // Backendga yuboriladigan ID
            quantity: item.quantity, 
        }));
        
        
        
        toast.success(data.data.msg || "Sotuv muvaffaqiyatli yakunlandi!" );

        // =========================================================
        // 5. ✅ Seansni tozalash (UI State'ni tiklash)
        // =========================================================
        const activeIdBeforeCleanup = this.activeSessionId;
        this.removeSession(activeIdBeforeCleanup); // Aktiv seansni yopish
        this.addSession(); // Yangi toza seans ochish

        // Barcha umumiy holatlarni tiklash
        this.discountPercent = 0;
        this.taxEnabled = false;
        this.paymentType = "naqd";
        
        return true; // Muvaffaqiyat
      } catch (error) {
        // Xatolikni to'g'ri qayta ishlash
        const errorMsg = error.response?.data?.msg || error.message || "To'lov jarayonida kutilmagan xatolik yuz berdi.";
        toast.error(errorMsg);
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