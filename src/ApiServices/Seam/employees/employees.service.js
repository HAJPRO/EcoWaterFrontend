import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamEmployeesService = {
  GetAll(status) {
    let url = "seam/employees/all";
    return api.post(url, { status });
  },
  getOneEployeeReport(id) {
    let url = "seam/employees/get_one_employee_reports";
    return api.post(url, { id });
  },
  ConfirmReportAndSendReply(id) {
    let url = "seam/employees/confirm_and_reply";
    return api.post(url, id);
  },
};
