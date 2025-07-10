
import { ProductManagmentService } from "../../../ApiServices/Sale/products/product.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
const loading = Loading()
import { defineStore } from "pinia";

export const ProductsManagmentStore = defineStore("ProductsManagmentStore", {
  state: () => {
    return {
      TitleAction: {},
      ImagesList: [],
      isActive: "",
      page: null,
      action: 1,
      product_modal: false,
      product_detail_modal: false,
      products: [],
      product: null,
      all_length: {},
      model: {
        code: "", // Kodi
        pro_name: "", // Mahsulot nomi
        pro_category: "", // Kategoriya
        // pro_quality: "", // Sifat darajasi
        sale_type: "", // Sotuv turi
        packingType: "", // Qadoq turi
        // pro_image_url: "", // Rasm URL (upload qilinadi)
        // productionStarteddAt: "", // Ishlab chiqarish boshlangan sana
        // cost_price: "", // Tannarxi
        buying_price: "", // Sotuv narxi
        // block_cost_price: "", // Tannarxi
        block_buying_price: "", // Sotuv narxi
        packingType: "", // Qadoq turi
        products: [],
      }
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddProductModal(payload) {
      this.TitleAction = {
        title: payload.title,
        action: payload.action
      }
      if (payload.id && payload.action === 'update') {
        this.GetOne({ id: payload.id })
      }
      this.product_modal = true;
    },
    async DetailOrderModal(id) {
      this.GetOne(id)
      this.product_detail_modal = true;
    },

    async Create(payload) {
      const loader = loading.show()
      const data = await ProductManagmentService.Create(payload);
      this.GetAll({ status: this.isActive, page: 1, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async UpdateById(payload) {
      const loader = loading.show()
      const data = await OrderManagmentService.UpdateById({ ...payload, orderId: this.order._id });
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetAll(payload) {
      const loader = loading.show()
      const data = await ProductManagmentService.GetAll(payload)

      this.page = payload?.page ? payload?.page : 1
      this.products = data.data.products
      this.all_length = data.data.all_length
      loader.hide()
    },

    async DeleteById(id) {
      const loader = loading.show()
      const data = await ProductManagmentService.DeleteById(id)
      this.GetAll({ status: this.isActive, page: 1, limit: 5 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },


    async GetOne(id) {
      const loader = loading.show()
      const data = await ProductManagmentService.GetOne(id)
      this.model = data.data.product
      loader.hide()

    },
  },
});
