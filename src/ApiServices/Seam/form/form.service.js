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
  AcceptAndCreate(id) {
    let url = "seam/form/accept_and_create";
    return api.post(url, { id });
  },
  CreateDayReport(data) {
    let url = "seam/form/create_day_report";
    return api.post(url, data);
  },
  GetOneReport(id) {
    let url = `seam/form/get_one_report`;
    return api.post(url, { id });
  },
  GetOneReportPastal(data) {
    let url = `seam/form/get_one_report_products`;
    return api.post(url, data);
  },
  GetOneForUpdate(id) {
    let url = `seam/form/get_for_update`;
    return api.post(url, { id });
  },
  Update(data) {
    let url = `seam/form/update`;
    return api.post(url, data);
  },
};
