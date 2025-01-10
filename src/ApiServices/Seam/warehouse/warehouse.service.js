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
  GetAll() {
    let url = "seam/warehouse/all";
    return api.post(url);
  },
  Create(data) {
    let url = "seam/warehouse/create";
    return api.post(url, data);
  },
  // CreateOutput(data) {
  //   let url = "seam/warehouse/create_output";
  //   return api.post(url, data);
  // },
  GetOne(id) {
    let url = "seam/warehouse/get_one";
    return api.post(url, { id });
  },
  GetModel() {
    let url = "seam/warehouse/get_model";
    return api.post(url);
  },
};
