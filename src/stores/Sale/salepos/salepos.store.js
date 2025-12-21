import { defineStore } from "pinia";
import { SaleposManagmentService } from "../../../ApiServices/Sale/salepos/salepos.service"; 
import { useToast } from "../../../UI/utils/useToast";
import { Loading } from "../../../utils/Loading";
import { downloadExcelFile } from "../../../utils/ExcelExport";

const { toast } = useToast();
const loading = Loading();

export const SaleposManagmentStore = defineStore("SaleposManagmentStore", {
  state: () => ({
    sales: [],
    customerSalesById: [],
    sessions: [
      { 
        id: 1, 
        name: "Chek #1", 
        cart: [], // Har bir element: { id, name, price, qty, stock, unit }
        customerId: null, 
        supplierId: null,
      },
    ],
    activeSessionId: 1,
    customers: [], 
    suppliers: [], 
    discountPercent: 0,
    taxEnabled: false,
    paymentType: "naqd", 
    detail_modal: false, 
    order: null, 
    pagination: {},
  }),

  getters: {
    activeSessionData(state) {
      return state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0];
    },

    subtotal() {
      // activeSessionData orqali hisoblash
      const session = this.activeSessionData;
      if (!session || !session.cart) return 0;
      return session.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
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
      if (this.sessions.length <= 1) {
        // Oxirgi seansni o'chira olmaymiz, faqat tozalaymiz
        const session = this.sessions[0];
        session.cart = [];
        session.customerId = null;
        session.supplierId = null;
        return;
      }
      const idx = this.sessions.findIndex((s) => s.id === id);
      this.sessions = this.sessions.filter((s) => s.id !== id);
      if (this.activeSessionId === id) {
        this.activeSessionId = this.sessions[Math.max(0, idx - 1)].id;
      }
    },

    async GetByCustomerId(id) {
      const loader = loading.show();
      try {
        const res = await SaleposManagmentService.GetByCustomerId(id);
        this.customerSalesById = res.data.data.orders; 
        this.pagination = res.data.data.pagination;
        this.detail_modal = true;
      } catch (e) {
        console.error(e);
        toast.error("Mijoz ma'lumotlarini yuklashda xatolik");
      } finally {
        loader.hide();
      }
    },

    async CreateSaleTransaction(payload) {
      const loader = loading.show();
      try {
        // 1. Validatsiya
        if (!payload.customerId) {
          toast.error("To'lovni yakunlash uchun mijozni tanlang!");
          return false;
        }
        if (!payload.items || payload.items.length === 0) {
          toast.error("Savat bo'sh, mahsulot qo'shing!");
          return false;
        }

        // 2. API orqali sotuvni saqlash
        const response = await SaleposManagmentService.CreateSale(payload);

        toast.success(response.data.msg || "Sotuv muvaffaqiyatli yakunlandi!");

        // 3. Seansni tozalash
        const currentActiveId = this.activeSessionId;
        this.removeSession(currentActiveId);
        
        // Agar hamma seans o'chib ketsa yangi ochish (removeSession ichida bor mantiq)
        if (this.sessions.length === 0) this.addSession();

        // Umumiy holatlarni tiklash
        this.discountPercent = 0;
        this.taxEnabled = false;
        this.paymentType = "naqd";
        
        return true;
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.message || "Xatolik yuz berdi";
        toast.error(errorMsg);
        return false;
      } finally {
        loader.hide();
      }
    },

    async GetAll(payload) {
      const loader = loading.show();
      try {
        const res = await SaleposManagmentService.GetAll(payload);
        this.sales = res.data.data;
      } catch (e) {
        toast.error("Sotuvlar ro'yxatini yuklab bo'lmadi");
      } finally {
        loader.hide();
      }
    },

    async handleExcelExport({ payload, fileName = 'Sotuvlar' }) {
      const loader = loading.show();
      try {
        const res = await SaleposManagmentService.handleExcelExport(payload);
        downloadExcelFile(res, fileName);
        toast.success("Fayl yuklab olindi");
      } catch (error) {
        toast.error("Eksportda xatolik: " + error.message);
      } finally {
        loader.hide();
      }
    },
  },
});