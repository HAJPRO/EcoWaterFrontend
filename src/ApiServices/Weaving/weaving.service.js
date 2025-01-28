import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const WeavingService = {
  getModel() {
    let url = "weaving/weaving_model";
    return api.get(url);
  },

  create(data) {
    let url = "weaving/weaving_create";
    return api.post(url, data);
  },
  getAll(status) {
    let url = "weaving/weaving_all";
    return api.post(url, status);
  },
  GetOneFromPaint(data) {
    let url = `weaving/get_one_from_paint`;
    return api.post(url, data);
  },
  getOneFromInProcess(id) {
    let url = "weaving/weaving_get_inprocess";
    return api.post(url, id);
  },
  AcceptAndCreate(data) {
    let url = "weaving/accept_and_create";
    return api.post(url, data);
  },
};
