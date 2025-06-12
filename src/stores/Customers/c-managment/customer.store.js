import { CustomerManagmentService } from "../../../ApiServices/Customers/c-managment/customer.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
import { ElMessage } from "element-plus";
const loading = Loading()
import { defineStore } from "pinia";

export const CustomerManagmentStore = defineStore("CustomerManagmentStore", {
  state: () => {
    return {
      TitleAction: {
        title: "",
        action: ""
      },
      isActive: "",
      page: null,
      action: 1,
      custom_modal: false,
      detail_modal: false,
      customers: [],
      all_length: {},
      orders: [],
      modal: {
        model: {
          fullname: "",
          discription: "",
          phoneNumber: "",
          is_location: "",
          address: {
            region: "",
            district: "",
            neighborhood: "",
            street: "",
            house: "",
          },
          location: {
            lat: "",
            long: "",
          },
          // category: "",
          // artikul: "",
          // position: "",
          // registeredAt: "",
          // imageUrl: "",

          // inn: "",
          // passportNumber: "",
          // phoneNumber: "",
          // email: "",
          // telegram: "",

        },
      },
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddCustomModal(data) {
      this.TitleAction = {
        title: data.title,
        action: data.action
      }
      if (data.action === 'update') {
        this.GetById(data)
      }
      this.custom_modal = true;

    },

    async AddDetailModal(id) {
      this.GetOrdersByCustomerId(id)
      this.detail_modal = true;
    },
    async Create(model) {
      const loader = loading.show()
      const data = await CustomerManagmentService.Create({ model, action: this.TitleAction.action });
      this.custom_modal = false;
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetAll(payload) {
      const loader = loading.show()
      const data = await CustomerManagmentService.GetAll(payload)
      this.page = payload?.page ? payload?.page : 1
      this.customers = data.data.customers
      this.all_length = data.data.all_length
      if(data.data.status == 404){
        ElMessage.error(data.data.msg);
      }
      loader.hide()
    },
    async UpdateById(id) {
      const loader = loading.show()
      const data = await CustomerManagmentService.DeleteById(id)
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async DeleteById(id) {
      const loader = loading.show()
      const data = await CustomerManagmentService.DeleteById(id)
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetById(id) {
      const loader = loading.show()
      const data = await CustomerManagmentService.GetById(id)
      if (id.status == "order") {
        this.modal.model = data.data.customer
      } else {
        this.modal.model = data.data.customer
        this.action = 3
        this.custom_modal = true;
      }
      loader.hide()

    },
    async GetOrdersByCustomerId(id) {
      const loader = loading.show()
      const data = await CustomerManagmentService.GetOrdersByCustomerId(id)
      this.orders = data.data.orders

      loader.hide()

    },
    async ExcelExportOrdersByCustomer(data) {
      const loader = loading.show();
      try {
        const res = await CustomerManagmentService.ExcelExportOrdersByCustomer(data);
    
        // ✅ Fayl blob formatida res.data da
        const blob = res.data;
    
        // Fayl nomini headers orqali olish (ixtiyoriy)
        const contentDisposition = res.headers["content-disposition"];
        const now = new Date();
  const timestamp = now.toISOString().replace(/[:.-]/g, "");
  let filename = `buyurtmalar_${timestamp}.xlsx`;
    
        if (contentDisposition && contentDisposition.includes("filename=")) {
          filename = contentDisposition
            .split("filename=")[1]
            .replace(/"/g, "")
            .trim();
        }
    
        // Faylni brauzer orqali yuklab olish
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        ElMessage.success(`Fayl muvaffaqiyatli yuklandi. ${filename}`);

      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        loader.hide();
       
      }
    }
    
  },
});
