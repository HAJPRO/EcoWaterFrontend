import { CustomerManagmentService } from "../../../ApiServices/Customers/c-managment/customer.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";

export const CustomerManagmentStore = defineStore("CustomerManagmentStore", {
  state: () => {
    return {
      ImagesList: [],
      isActive: "",
      page : null,
      action : 1,
      custom_modal: false,
      customers : [],
      all_length : {},
      modal: {
        model: {
          fullname: "",
          category: "",
          artikul: "",
          position: "",
          registeredAt: "",
          imageUrl: "",
          discription: "",
          inn: "",
          passportNumber: "",
          phoneNumber: "",
          email: "",
          telegram: "",
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
        },
      },
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddCustomModal() {
      this.custom_modal = true;
    },
    async Create(payload) {
      const loader = loading.show()  
      const data = await CustomerManagmentService.Create(payload);
      this.custom_modal = false;
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
    
    
      loader.hide()
    },
    
    async DeleteById(id) {
      const loader = loading.show()  
      const data = await CustomerManagmentService.DeleteById(id)
      this.GetAll({status: this.isActive, page : this.page, limit :5})
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetById(id) {
      const loader = loading.show()  
      const data = await CustomerManagmentService.GetById(id)
      if(id.status == "order"){
        this.modal.model = data.data.customer 
      }else{
        this.modal.model = data.data.customer
        this.action = 3
        this.custom_modal = true;
      }
      loader.hide()
     
    },
  },
});
