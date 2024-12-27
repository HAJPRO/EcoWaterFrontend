import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamWarehouseService = {
  GetModel() {
    let url = "seam/warehouse/responsibles_model";
    return api.get(url);
  },

  GenerateQRCode(data) {
    let url = "seam/warehouse/generate_qrcode";
    return api.post(url, data);
  },
  getQRImage(id) {
    let url = "seam/warehouse/image_qrcode";
    return api.post(url, id);
  },
  GetAllForm() {
    let url = "seam/warehouse/all_from";
    return api.post(url);
  },
  CreaetToForm(data) {
    let url = "seam/warehouse/create_from";
    return api.post(url, data);
  },
  GetFormMode() {
    let url = "seam/warehouse/model_form";
    return api.post(url);
  },
};
