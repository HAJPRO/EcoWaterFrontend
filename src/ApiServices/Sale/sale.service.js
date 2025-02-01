import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SaleService = {
  CreateProName(data) {
    let url = "sale/add_pro_name";
    return api.post(url, data);
  },
  CreateProType(data) {
    let url = "sale/add_pro_type";
    return api.post(url, data);
  },
  GetProType() {
    let url = "sale/pro_type";
    return api.post(url);
  },
  GetProName() {
    let url = "sale/pro_name";
    return api.post(url);
  },
  GetCardModel() {
    let url = "sale/get_card_model";
    return api.get(url);
  },
  create(data) {
    let url = "sale/create";
    return api.post(url, data);
  },
  GetOne(data) {
    let url = "sale/get_one";
    return api.post(url, data);
  },
  export_excel(id) {
    let url = "sale/legal_export_excel";
    return api.post(url, id);
  },
  confirm(id) {
    let url = "sale/confirm";
    return api.post(url, { id });
  },
  AllOrderProccessById(data) {
    let url = `sale/get_proccess_status`;
    return api.post(url, data);
  },
  getAllLength() {
    let url = "sale/legal_all_length";
    return api.post(url);
  },
  getAll(status) {
    let url = "sale/all";
    return api.post(url, status);
  },
  getAllWeaving() {
    let url = "sale/weaving_all";
    return api.post(url);
  },
  FinishParty(data) {
    let url = "sale/finish_party";
    return api.post(url, data);
  },
  Edit(id, data) {
    let url = `sale/legal_edit/${id}`;
    return api.put(url, data);
  },

  Delete(id) {
    let url = `sale/legal_delete/${id}`;
    return api.delete(url);
  },
};
