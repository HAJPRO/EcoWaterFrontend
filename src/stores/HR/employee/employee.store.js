import { EmployeeManagmentService } from "../../../ApiServices/HR/employee/employee.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
import {CustomerManagmentService} from "../../../ApiServices/Customers/c-managment/customer.service";
const loading = Loading()
import { defineStore } from "pinia";
import { SaleposManagmentService } from "../../../ApiServices/Sale/salepos/salepos.service";

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
             const loader = loading.show();
              try {
                const res = await SaleposManagmentService.GetByEmployeeId(id);
                this.orders = res.data.data.orders; 
                this.pagination = res.data.data.pagination; // Paginationni ham saqlab qo'yamiz
                this.detail_modal = true
              } catch (e) {
                console.error(e);
              } finally {
                loader.hide();
              }
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

      async ExcelExportOrdersByCustomer(payload) {
  const loader = loading.show();
  try {
    const res = await CustomerManagmentService.ExcelExportOrdersByCustomer(payload);

    // 1. Ma'lumot kelganini tekshirish
    if (!res || !res.data) {
      throw new Error("Serverdan ma'lumot kelmadi");
    }

    // 2. Blob yaratish (Aniq Excel tipi bilan)
    const blob = new Blob([res.data], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });

    // 3. Fayl nomini generatsiya qilish
    const contentDisposition = res.headers["content-disposition"];
    let filename = `Hisobot_${new Date().getTime()}.xlsx`;

    if (contentDisposition && contentDisposition.includes("filename=")) {
      filename = contentDisposition
        .split("filename=")[1]
        .replace(/["']/g, "")
        .trim();
    }

    // 4. Brauzer xotirasida vaqtinchalik URL yaratish
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    
    // 5. Yuklab olishni boshlash
    document.body.appendChild(link);
    link.click();

    // 6. Tozalash
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("Fayl muvaffaqiyatli yuklab olindi");
  } catch (error) {
    console.error("Excel Export Error:", error);
    ElMessage.error("Faylni tayyorlashda xatolik yuz berdi. Backend loglarini tekshiring.");
  } finally {
    loader.hide();
  }
}
    },
});
