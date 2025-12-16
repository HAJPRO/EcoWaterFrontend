import { defineStore } from "pinia";
// Modelga bog'liq service
import { InputWarehouseService } from "../../../ApiServices/Warehouses/input/input.service"; 
// Katalog uchun store
import { ProductsManagmentStore } from "../../Sale/products/product.store"; 
// Utils
import { useToast } from "../../../UI/utils/useToast";
const { toast } = useToast();
import { Loading } from "../../../utils/Loading"; 

const loading = Loading();

export const WarehouseInputStore = defineStore("WarehouseInputStore", {
  state: () => ({
    // Kirim hujjati (Faktura)
    document: {
      partyNumber: "", // Umumiy faktura raqami (agar kiritilsa)
      supplierId: null,
      date: new Date(),
      items: [], // Kirim qilinayotgan tovarlar ro'yxati
      note: ""
    },
    
    // Yordamchi
    isSubmitting: false,
  }),

  getters: {
    // Jami summa
    totalSum: (state) => {
      return state.document.items.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);
    },
    // Validatsiya
    isValid: (state) => {
      return state.document.items.length > 0 && state.document.supplierId;
    }
  },

  actions: {
    // --- 1. LOCAL CART OPERATIONS ---

    // Katalogni yuklash
    async fetchCatalog() {
      try {
        const productStore = ProductsManagmentStore();
        await productStore.GetAll({ limit: 1000 });
      } catch (error) {
        console.error("Katalog yuklashda xatolik:", error);
        toast.error("Katalog ma'lumotlarini olishda xatolik yuz berdi!");
      }
    },

    // Tovarni kirim ro'yxatiga qo'shish
    addItem(product) {
      const existing = this.document.items.find(i => i.productId === product._id);

      if (existing) {
        toast.warning("Bu mahsulot ro'yxatda bor!");
        return;
      }

      this.document.items.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        unit: product.unit || 'dona',
        
        qty: 1, 
        costPrice: product.costPrice || 0,
        salePrice: product.salePrice || 0,
        currentStock: product.totalStock
      });
    },

    removeItem(productId) {
      this.document.items = this.document.items.filter(i => i._id !== _id);
    },

    updateItem(productId, payload) {
      const item = this.document.items.find(i => i.productId === productId);
      if (item) {
        Object.assign(item, payload);
      }
    },

    clearDocument() {
      this.document.items = [];
      this.document.supplierId = null;
      this.document.note = "";
      this.document.partyNumber = "";
    },

    // --- 2. API OPERATIONS (SAVE) ---

    async saveInput() {
      if (!this.isValid) {
        toast.error("Yetkazib beruvchi va mahsulotlarni tanlang!");
        return;
      }

      const loader = loading.show();
      this.isSubmitting = true;

      try {
        // Asosiy faktura prefiksi
        const mainPartyPrefix = this.document.partyNumber || `FKT-${new Date().toISOString().substring(0, 10)}`; 
        let hasError = false;

        // Har bir item uchun Promise qurish
        const promises = this.document.items.map((item, index) => {
          
          // 💡 E11000 XATOSINI YECHIMI: Har bir database yozuvi uchun unikal partyNumber
          const uniquePartyNumber = `${mainPartyPrefix}-${index}-${Math.floor(Math.random() * 10000)}`;
          
          const payload = {
            product: item.productId,
            supplier: this.document.supplierId,
            initialQuantity: item.qty,
            currentQuantity: item.qty,
            unit: item.unit,
            costPrice: item.costPrice,
            salePrice: item.salePrice,
            partyNumber: uniquePartyNumber, // <--- UNIQUE ID YUBORISH
            status: 'active',
            action: 'create' // Backendda yaratish amali
          };
          
          return InputWarehouseService.Create(payload);
        });

        // Hamma so'rovlarni parallel yuborish
        const results = await Promise.all(promises);

        // Natijalarni tekshirish
        for (const result of results) {
            // Service faqat 201/200 status yoki error qaytarishi kerak.
            // Agar result.success bo'lmasa yoki status 400 dan yuqori bo'lsa
            if (result.success === false || (result.status && result.status >= 400)) {
                console.error("Backend xatosi:", result.msg);
                toast.error(`Kirimlarning bir qismi saqlanmadi: ${result.msg || "Noma'lum xato"}`);
                hasError = true;
                break;
            }
        }
        
        if (!hasError) {
             toast.success(`Kirim muvaffaqiyatli! Jami: ${this.document.items.length} xil tovar.`);
             this.clearDocument();
             
             // Katalogni yangilash (Qoldiqlar o'zgarishi uchun)
             const productStore = ProductsManagmentStore();
             productStore.GetAll();
        }

      } catch (error) {
        // Asosiy network xatosi
        console.error("Input Network Error:", error);
        toast.error("Server bilan aloqa uzildi yoki jiddiy xatolik yuz berdi.");
      } finally {
        this.isSubmitting = false;
        loader.hide();
      }
    }
  }
});