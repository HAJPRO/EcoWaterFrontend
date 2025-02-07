import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamEmployeesService = {
  GetAll(data) {
    let url = "seam/employees/all";
    return api.post(url, data);
  },
  getOneEployeeReport(data) {
    let url = "seam/employees/get_one_employee_reports";
    return api.post(url, data);
  },
  ConfirmReportAndSendReply(id) {
    let url = "seam/employees/confirm_and_reply";
    return api.post(url, id);
  },
};
