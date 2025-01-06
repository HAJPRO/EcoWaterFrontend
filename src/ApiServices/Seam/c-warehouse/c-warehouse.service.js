import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInCWarehouseService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/c_warehouse/all";
    return api.post(url, { status });
  },

  ConfirmAndCreateInProcess(id) {
    let url = "seam/c_warehouse/confirm_and_create";
    return api.post(url, { id });
  },
  //   CreateDayReport(data) {
  //     let url = "seam/c_warehouse/create_day_report";
  //     return api.post(url, data);
  //   },
  GetOneReport(id) {
    let url = "seam/c_warehouse/get_one_report";
    return api.post(url, { id });
  },
  AcceptReportItem(data) {
    let url = "seam/c_warehouse/accept_report_item";
    return api.post(url, data);
  },
};
