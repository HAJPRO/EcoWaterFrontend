import { EmployeeManagmentService } from "../../../ApiServices/HR/employee/employee.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
import {CustomerManagmentService} from "../../../ApiServices/Customers/c-managment/customer.service";
const loading = Loading()
import { defineStore } from "pinia";

export const EmployeeManagmentStore = defineStore("EmployeeManagmentStore", {
    state: () => {
        return {
            ImagesList: [],
            isActive: "",
            page: null,
            action: 1,
            employee_modal: false,
            detail_employee_modal: false,
            cardId: "",
            employees: [],
            orders: [],
            modal_action: {
                action: "",
                title: ""
            },
            all_length: {},
            modal: {
                model: {
                    username: "",
                    password: "",
                    fullname: "",
                    department: "",
                    gender: "",
                    position: "",
                    roles: [],
                    action: "",
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

                    carNumber: "",
                    carColor: "",
                    carType: "",
                    driverLicenseNumber: "",
                    driverLicenseDate: "",

                },
            },
        };
    },
    actions: {
        GetIsActive(payload) {
            this.isActive = payload;
        },
        async AddEmployeeModal() {
            this.employee_modal = true;
            this.modal_action = {
                title: `Xodim kartasini shakillantirish`,
                action: "create"
            }
        },
        async DetailInfoEmployeeModal(id) {
            this.GetOrdersByDriverId(id)
            this.detail_employee_modal = true;

        },
        async Create(payload) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.Create(payload);
            this.custom_modal = false;
            loader.hide()
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
            this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
        },
        async GetAll(payload) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.GetAll(payload)
            this.page = payload?.page ? payload?.page : 1
            this.employees = data.data.employees
            this.all_length = data.data.all_length


            loader.hide()
        },
        async UpdateByIds(id) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.DeleteById(id)
            this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
            loader.hide()
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
        },

        async DeleteById(id) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.DeleteById(id)
            this.GetAll({ status: this.isActive, page: this.page, limit: 10 })
            loader.hide()
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
        },
        async GetById(id) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.GetById(id)
            if (id.status == "order") {
                this.modal.model = data.data.customer
            } if (id.status === 'undefind') {
                this.modal.model = data.data.customer
                this.action = 3
                this.custom_modal = true;
            }
            if (id.status === 'update') {
                this.employee_modal = true
                this.modal.model = data.data.customer
                this.cardId = id.id
                this.modal_action = {
                    title: `Xodim kartasini o'zgartirish`,
                    action: "update"
                }
                console.log(this.modal.model);

            }
            loader.hide()

        },
        async GetOrdersByDriverId(id) {
            const loader = loading.show()
            const data = await EmployeeManagmentService.GetOrdersByDriverId(id)
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
