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
      const data = await SeamEmployeesService.GetAll(payload);
      this.items = data.data.items;
      this.all_length = data.data.all_length;
      loader.hide();
    },
    async getOneEployeeReport(id) {
      const loader = loading.show();
      const data = await SeamEmployeesService.getOneEployeeReport(id);
      this.reports = data.data.reports;
      this.employee = data.data.employee;
      this.is_report_modal = true;
      this.user_id = id;
      loader.hide();
    },
    async ConfirmReportAndSendReply(id) {
      const loader = loading.show();
      const data = await SeamEmployeesService.ConfirmReportAndSendReply({
        user_id: this.user_id,
        report_id: id,
      });
      this.getOneEployeeReport(this.user_id);
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      loader.hide();
    },
  },
});
