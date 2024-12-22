import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamWarehouseService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GenerateQRCode(data) {
    let url = "seam/generate_qrcode";
    return api.post(url, data);
  },
  getQRImage(id) {
    let url = "seam/image_qrcode";
    return api.post(url, id);
  },
  GetAllForm() {
    let url = "seam/warehouse_all_from";
    return api.post(url);
  },
  CreaetToForm(data) {
    let url = "seam/warehouse_create_from";
    return api.post(url, data);
  },
  GetFormMode() {
    let url = "seam/warehouse_model_form";
    return api.post(url);
  },
};
