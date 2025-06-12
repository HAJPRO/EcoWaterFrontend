
import { CustomerManagmentService } from "../../../ApiServices/Customers/c-managment/customer.service";
import { OrderManagmentService } from "../../../ApiServices/Sale/orders/order.service";
import { DriverManagmentService } from "../../../ApiServices/Drivers/driver/driver.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
const loading = Loading()
import { defineStore } from "pinia";

export const OrderManagmentStore = defineStore("OrderManagmentStore", {
  state: () => {
    return {
      ImagesList: [],
      isActive: "",
      page: null,
      action: 1,
      order_modal: false,
      order_detail_modal: false,
      driver_binding_modal: false,
      orders: [],
      drivers: [],
      order: null,
      all_length: {},
      model: {
        fullname: "",
        product: {
          pro_name: "",
          pro_type: "",
          pro_quantity: "",
          pro_unit: "",
          pro_price: "",
          pro_total_price: "",
          packingType: "",

        }
      },

    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddOrderModal() {
      this.order_modal = true;
    },
    async DetailOrderModal(id) {
      this.OrderGetById(id)
    },
    async DriverBindingModal(id) {
      const drivers = await OrderManagmentService.GetAllDrivers({ status: 0 })
      this.drivers = drivers.data.drivers
      this.driver_binding_modal = true

    },
    async Create(payload) {
      const loader = loading.show()
      const data = await OrderManagmentService.Create(payload);
      this.custom_modal = false;
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async UpdateById(payload) {
      const loader = loading.show()
      const data = await OrderManagmentService.UpdateById({ ...payload, orderId: this.order._id });
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      this.driver_binding_modal = false
      this.order_detail_modal = false

      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetAll(payload) {
      const loader = loading.show()
      const data = await OrderManagmentService.GetAll(payload)
      this.page = payload?.page ? payload?.page : 1
      this.orders = data.data.orders
      this.all_length = data.data.all_length
      loader.hide()
    },
    async GetAllCustomers(payload) {
      const loader = loading.show()
      const data = await CustomerManagmentService.GetAll(payload)
      this.customers = data.data.customers
      loader.hide()
    },
    async DeleteById(id) {
      const loader = loading.show()
      const data = await OrderManagmentService.DeleteById(id)
      this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
      loader.hide()
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },

    async GetByIdCustomer(id) {
      const loader = loading.show()
      const data = await CustomerManagmentService.GetById(id)
      this.model = data.data.customer
      this.custom_modal = true;
      loader.hide()

    },
    async OrderGetById(id) {
      const loader = loading.show()
      const data = await OrderManagmentService.OrderGetById(id)
      this.order = data.data.order
      this.order_detail_modal = true;
      loader.hide()

    },
  },
});
