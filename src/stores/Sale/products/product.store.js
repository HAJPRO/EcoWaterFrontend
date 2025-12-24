import { defineStore } from "pinia";
import { ProductManagmentService } from "../../../ApiServices/Sale/products/product.service"; // Service yo'lini tekshiring
import { ToastifyService } from "../../../utils/Toastify";
import { useToast } from "../../../UI/utils/useToast";
const { toast } = useToast();

import { Loading } from "../../../utils/Loading";
import { downloadExcelFile } from "../../../utils/ExcelExport";

const loading = Loading();

export const ProductsManagmentStore = defineStore("ProductsManagmentStore", {
  state: () => ({
    // UI holatlari
    product_modal: false,
    product_detail_modal: false,
    isActive: "active", // Filter uchun status
    TitleAction: { title: "", action: "" }, // Modal sarlavhasi va turi

    // Ma'lumotlar
    products: [],
    product: null,
    
    // Pagination va Qidiruv
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    searchQuery: "",
    filterCategory: "Barchasi",

    // Forma Modeli (Yangi Product Schema bo'yicha)
    model: {
      _id: null,
      name: "",
      code: "",
      category: "",
      image: "",
      unit: "dona",
      salePrice: 0,
      costPrice: 0,
      packSize: 1,
      minStockAlert: 10,
      description: "",
      status: "active"
    }
  }),

  actions: {
    // --- 1. MODAL BOSHQARUVI ---
    
    openAddModal() {
      this.resetModel();
      this.TitleAction = { title: "Yangi Mahsulot Qo'shish", action: "create" };
      this.product_modal = true;
    },

    async openEditModal(id) {
      this.TitleAction = { title: "Mahsulotni Tahrirlash", action: "update" };
      await this.GetOne(id); // Ma'lumotni yuklab olamiz
      this.product_modal = true;
    },

    closeModal() {
      this.product_modal = false;
      this.resetModel();
    },

    // --- 2. API ACTIONS ---

    // Barcha mahsulotlarni olish
    async GetAll() {
      const loader = loading.show();
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.searchQuery,
          // category: this.filterCategory !== "Barchasi" ? this.filterCategory : undefined
        };

        const response = await ProductManagmentService.GetAll(params);
        
        // Backenddan kelgan javobni o'qish (response.data.data yoki response.data.products ga qarab)
        this.products = response.data.products || [];
        // Pagination ma'lumotlarini yangilash
        if (response.data.pagination) {
          this.pagination = response.data.pagination;
        } else {
          // Fallback agar backend pagination qaytarmasa
          this.pagination.total = response.data.all_length?.all || 0; 
        }

      } catch (error) {
        console.error("GetAll Error:", error);
        ToastifyService.ToastError(error.response?.data?.msg || "Ma'lumot olishda xatolik!");
      } finally {
        loader.hide();
      }
    },

    // Bitta mahsulotni olish
    async GetOne(id) {
      const loader = loading.show();
      try {
        const response = await ProductManagmentService.GetOne(id);
        const data = response.data.data || response.data.product; // Backend strukturasiga qarab
        
        // Modelni to'ldiramiz (Forma uchun)
        this.model = { ...data }; 
        this.product = data; // Detal ko'rish uchun
      } catch (error) {
        ToastifyService.ToastError("Mahsulot topilmadi");
      } finally {
        loader.hide();
      }
    },

    // Yaratish yoki Yangilash (Bitta funksiya orqali)
    async SaveProduct() {
      if (this.TitleAction.action === 'create') {
        await this.Create();
      } else {
        await this.UpdateById();
      }
    },

  async Create() {
      const loader = loading.show();
      try {
        // ID ni olib tashlaymiz
        const { _id, ...payload } = this.model;
        
        const response = await ProductManagmentService.Create(payload);
        this.closeModal();
        this.pagination.page = 1; 
        this.searchQuery = ""; // Ixtiyoriy: Qidiruvni ham tozalash
        await this.GetAll(); 

        toast.success(response.data.msg || "Mahsulot yaratildi");
      } catch (error) {
        toast.error(error.response?.data?.msg || "Yaratishda xatolik");
      } finally {
        loader.hide();
      }
    },

    async UpdateById() {
      const loader = loading.show();
      try {
        const id = this.model._id || this.model.id; // ID ni aniqlash
        if (!id) throw new Error("ID topilmadi");

        const response = await ProductManagmentService.UpdateById(id, this.model);
        
        this.closeModal();
        this.GetAll(); // Ro'yxatni yangilash
        
        ToastifyService.ToastSuccess(response.data.msg || "Mahsulot yangilandi");
      } catch (error) {
        ToastifyService.ToastError(error.response?.data?.msg || "Yangilashda xatolik");
      } finally {
        loader.hide();
      }
    },

    async DeleteById(id) {
      if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;

      const loader = loading.show();
      try {
        const response = await ProductManagmentService.DeleteById(id);
        this.GetAll(); // Ro'yxatni yangilash
        ToastifyService.ToastSuccess(response.data.msg || "O'chirildi");
      } catch (error) {
        ToastifyService.ToastError("O'chirishda xatolik");
      } finally {
        loader.hide();
      }
    },

    // --- 3. HELPER FUNCTIONS ---
    resetModel() {
      this.model = {
        _id: null,
        name: "",
        code: "",
        category: "",
        image: "",
        unit: "dona",
        salePrice: 0,
        costPrice: 0,
        packSize: 1,
        minStockAlert: 10,
        description: "",
        status: "active"
      };
    },

    setPage(page) {
      this.pagination.page = page;
      this.GetAll();
    },

    setSearch(query) {
      this.searchQuery = query;
      this.pagination.page = 1; // Qidirganda 1-betga qaytish
      this.GetAll();
    },

     async handleExcelExport({ payload, fileName = 'Sotuvlar' }) {
          const loader = loading.show();
          try {
            const res = await ProductManagmentService.handleExcelExport(payload);
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