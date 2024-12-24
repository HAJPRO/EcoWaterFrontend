import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInFormService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    let url = "seam/all_form";
    return api.post(url, { status });
  },
  CreaetInfoToForm(data) {
    let url = "seam/form_create";
    return api.post(url, data);
  },
  CreateDayReport(data) {
    let url = "seam/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = "seam/get_one_report";
    return api.post(url, { id });
  },
};
