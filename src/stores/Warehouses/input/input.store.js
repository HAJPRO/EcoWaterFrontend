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
     sessions: [
        { 
            id: 1, 
            name: "Chek #1", 
            
        },
      ],
      activeSessionId: 1,
    document: {
      partyNumber: "", // Umumiy faktura raqami (agar kiritilsa)
      supplierId: null,
      date: new Date(),
      items: [], // Kirim qilinayotgan tovarlar ro'yxati
      note: "",
      branchId: null
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
    async clearDocumentAll() {
      try {
      const data = await InputWarehouseService.clearDocumentAll();
      toast.success(data.data.msg);
      } catch (error) {
        toast.error(error.msg); 
      }
    
    },
    // --- 1. LOCAL CART OPERATIONS ---
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
        const mainPartyPrefix = this.document.partyNumber || `FKT-${new Date().toISOString().substring(0, 10)}`; 
        
        // 1. Kirim tovarlarini bitta yagona arrayga yig'ish (Arrayni serverga yuborish uchun tayyorlash)
        const itemsPayload = this.document.items.map((item, index) => {
          
            // Har bir partiyaga (tovarga) unikal raqam berish muhim
            const uniquePartyNumber = `${mainPartyPrefix}-${index}-${Math.floor(Math.random() * 10000)}`;
          
            return {
                product: item.productId,
                supplier: this.document.supplierId, // Barcha partiyalar uchun umumiy
                initialQuantity: item.qty,
                currentQuantity: item.qty,
                unit: item.unit,
                costPrice: item.costPrice,
                salePrice: item.salePrice,
                partyNumber: uniquePartyNumber, // Unikal bo'lib qolishi shart
                status: 'active',
            };
        });

        // 2. Yagona asosiy so'rov obyektini yaratish
        const bulkRequestPayload = {
            supplierId: this.document.supplierId,
            branchId: this.document.branchId,
            partyNumber: mainPartyPrefix, // Umumiy kirim raqami
            note: this.document.note,
            items: itemsPayload,
            action: 1 // <--- Barcha tovarlar arrayi shu yerda
        }

        // 3. Bitta API chaqiruvini bajarish (InputWarehouseService ichida CreateBulk bo'lishi kerak)
        const result = await InputWarehouseService.Create(bulkRequestPayload); // Bitta so'rov

        // 4. Natijani tekshirish
        if (result.success === false || (result.status && result.status >= 400)) {
            console.error("Backend xatosi:", result.msg);
            toast.error(`Kirim saqlanmadi: ${result.msg || "Noma'lum xato"}`);
        } else {
            toast.success(`Kirim muvaffaqiyatli! Jami: ${this.document.items.length} xil tovar.`);
            this.clearDocument();
            
            // Katalogni yangilash
            const productStore = ProductsManagmentStore();
            productStore.GetAll();
        }

      } catch (error) {
        console.error("Input Network Error:", error);
        toast.error("Server bilan aloqa uzildi yoki jiddiy xatolik yuz berdi.");
      } finally {
        this.isSubmitting = false;
        loader.hide();
      }
    },


async GetAllInputHistory(){
  try {
   const data = await InputWarehouseService.GetAll() 
  } catch (error) {
    console.log(error.msg)
    toast.error(error.msg)
  }
}
  }
});