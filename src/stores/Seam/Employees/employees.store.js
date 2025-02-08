import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamEmployeesService } from "../../../ApiServices/Seam/employees/employees.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamEmployeesStore = defineStore("SeamEmployeesStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      all_length: {},
      reports: [],
      employee: "",
      total_report: "",
      limit: "",
      current_page: "",
      is_report_modal: false,
      user_id: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async getAll(payload) {
      const loader = loading.show();
      const data = await SeamEmployeesService.GetAll({
        status: this.isActive,
        page: payload,
        limit: 10,
      });
      this.items = data.data.items;
      this.all_length = data.data.all_length;
      loader.hide();
    },
    async getOneEployeeReport(payload) {
      if (payload.id && payload.page) {
        const loader = loading.show();
        const data = await SeamEmployeesService.getOneEployeeReport(payload);
        this.reports = data.data.reports;
        this.employee = data.data.employee;
        this.total_report = data.data.total;
        this.is_report_modal = true;
        loader.hide();
      } else {
        const loader = loading.show();
        const data = await SeamEmployeesService.getOneEployeeReport({
          id: payload,
          page: 1,
          limit: 5,
        });
        this.reports = data.data.reports;
        this.employee = data.data.employee;
        this.total_report = data.data.total;
        this.is_report_modal = true;
        this.user_id = payload;
        loader.hide();
      }
    },
    async getOneEployeeReportPagenation(page) {
      const loader = loading.show();
      this.current_page = page;
      this.getOneEployeeReport({
        id: this.user_id,
        page,
        limit: 5,
      });
      loader.hide();
    },
    async ConfirmReportAndSendReply(id) {
      const loader = loading.show();
      const data = await SeamEmployeesService.ConfirmReportAndSendReply({
        user_id: this.user_id,
        report_id: id,
      });
      this.getOneEployeeReport({
        id: this.user_id,
        page: this.current_page ? this.current_page : 1,
        limit: 5,
      });
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      loader.hide();
    },
  },
});
