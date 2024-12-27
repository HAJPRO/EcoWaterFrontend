import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInFormService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/form/all";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/form/create";
    return api.post(url, data);
  },
  CreateDayReport(data) {
    let url = "seam/form/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/form/get_one_report";
    return api.post(url, { id });
  },
};
