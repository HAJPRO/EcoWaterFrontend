import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInPatoksService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/patoks/all_patoks";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/patoks/create";
    return api.post(url, data);
  },
  ConfirmAndCreteProcess(id) {
    let url = "seam/patoks/confirm_and_create";
    return api.post(url, id);
  },
  CreateDayReport(data) {
    let url = "seam/patoks/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/patoks/get_one_report";
    return api.post(url, { id });
  },
  AcceptReportItem(data) {
    let url = "seam/patoks/accept_report_item";
    return api.post(url, data);
  },
};
