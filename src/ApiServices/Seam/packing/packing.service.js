import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInPackingService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/packing/all_packing";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/packing/create";
    return api.post(url, data);
  },
  ConfirmAndCreteProcess(id) {
    let url = "seam/packing/confirm_and_create";
    return api.post(url, id);
  },
  CreateDayReport(data) {
    let url = "seam/packing/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/packing/get_one_report";
    return api.post(url, { id });
  },
  AcceptReportItem(data) {
    let url = "seam/packing/accept_report_item";
    return api.post(url, data);
  },
};
