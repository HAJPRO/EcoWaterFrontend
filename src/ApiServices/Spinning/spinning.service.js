import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SpinningService = {
  getModel() {
    let url = "spinning/spinning_model";
    return api.get(url);
  },
  cancelReason(data) {
    let url = "spinning/cancel_reason";
    return api.post(url, data);
  },
  create(data) {
    let url = "spinning/spinning_create";
    return api.post(url, data);
  },
  getAll(status) {
    let url = "spinning/spinning_all";
    return api.post(url, status);
  },
  GetOneFromWeaving(data) {
    let url = `spinning/get_one_from_weaving`;
    return api.post(url, data);
  },
  AcceptAndCreate(data) {
    let url = `spinning/accept_and_create`;
    return api.post(url, data);
  },
  CreateDayReport(data) {
    let url = "spinning/create_day_report";
    return api.post(url, data);
  },
  GetDayReport(data) {
    let url = "spinning/get_day_report";
    return api.post(url, data);
  },
  GetOneFromSpinningCard(data) {
    let url = "spinning/get_one_from_spinning";
    return api.post(url, data);
  },
};
