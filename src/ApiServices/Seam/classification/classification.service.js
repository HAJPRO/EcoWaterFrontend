import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInClassificationService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },
  GetAll(status) {
    let url = "seam/classification/all";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/classification/create";
    return api.post(url, data);
  },
  ConfirmAndCreteProcess(id) {
    let url = "seam/classification/confirm_and_create";
    return api.post(url, id);
  },
  CreateDayReport(data) {
    let url = "seam/classification/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/classification/get_one_report";
    return api.post(url, { id });
  },
  AcceptReportItem(data) {
    let url = "seam/classification/accept_report_item";
    return api.post(url, data);
  },
};
