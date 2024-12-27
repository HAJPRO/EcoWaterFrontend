import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInClassificationService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/all_classification";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/form_create";
    return api.post(url, data);
  },
  ConfirmAndCreteProcess(id) {
    let url = "seam/confim_and_create";
    return api.post(url, id);
  },
  CreateDayReport(data) {
    let url = "seam/create_day_report_classification";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/classification_get_one_report";
    return api.post(url, { id });
  },
  AcceptReportItem(data) {
    let url = "seam/accept_report_item";
    return api.post(url, data);
  },
};
