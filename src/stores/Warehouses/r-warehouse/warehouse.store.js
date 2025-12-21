import { defineStore } from "pinia";
import { ReadyWarehouseService } from "../../../ApiServices/Warehouses/r-warehouse/warehouse.service";
import { InputWarehouseService } from "../../../ApiServices/Warehouses/input/input.service";
import { useToast } from "../../../UI/utils/useToast";
const {toast} = useToast();
import { Loading } from "../../../utils/Loading";
const loading = Loading()
import {WarehouseInputStore} from "../../../stores/Warehouses/input/input.store"
export const ReadyWarehouseStore = defineStore("ReadyWarehouseStore", {
  state: () => ({
    ModalAction: {

    },
    partyId: "",
    detail_modal: false,
    transfer_modal: false,
    isActive: "",
    product_modal: false,
    model: {},
    products: [],
    product: {},
    page: null,
    action: 1,
    all_length: {},
  }),
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    DetailModal(id) {
      this.partyId = id
      this.GetOne(id);
      this.detail_modal = true;
    },
    async Create(payload) {
      const loader = loading.show();
      const data = await ReadyWarehouseService.Create(payload);
      this.GetModel()
      this.GetOne(this.partyId)
      this.GetAll({ status: this.isActive, page: 1, limit: 10 })
      loader.hide();
      if (data.data.status === 404) {
        ToastifyService.ToastError({
          msg: data.data.msg,
        });
      }
      if (data.data.status === 200) {
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
      }
      this.product_modal = false;

    },
    async GetAll(payload) {
  const loader = loading.show();
  try {
    
    // 3. Payloadni servisga uzatish (filtrlar, sahifalash uchun)
    const response = await InputWarehouseService.GetAll(payload);
    
    // 4. Kelgan ma'lumotni state-ga yuklash
    if (response) {
      this.products = response.data.data;
      this.paganation = response.data.paganation;
    }else{
      toast.error("Ma'lumotni yuklashda xatolik!")
    }
  } catch (error) {
    // 5. Xatolikni boshqarish
    console.error("GetAll Error:", error.message);
    ElMessage.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
  } finally {
    // 6. Har qanday holatda ham loader-ni yopish
    loader.hide();
  }
},
   async GetOne(id) {
    console.log(id);
    
  // 1. Loader-ni ko'rsatamiz (foydalanuvchi jarayon ketayotganini sezishi uchun)
  const loader = loading.show();

  try {
    // 2. find() metodi orqali massiv ichidan aynan shu ID-li obyektni qidiramiz
    const foundProduct = this.products.find(item => item._id === id);

    if (foundProduct) {
      // 3. Topilgan ma'lumotni state-ga yuklaymiz (detal modal ko'rsatishi uchun)
      this.product = { ...foundProduct }; 
      
      // Ixtiyoriy: Agar ma'lumotlarni tahrirlash uchun 'model' o'zgaruvchisi bo'lsa
      
      console.log("Mahsulot topildi:", this.product);
    } else {
      toast.warning("Mahsulot ro'yxatdan topilmadi");
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  } finally {
    // 4. Loader-ni yopamiz
    loader.hide();
  }
}


    
  },
});
