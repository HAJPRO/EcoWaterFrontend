import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamFormWarehouseService = {
  GetAll(status) {
    let url = "seam/form_warehouse/all";
    return api.post(url, { status });
  },
  AcceptAndCreate(id) {
    let url = "seam/form_warehouse/accept_and_create";
    return api.post(url, { id });
  },
  GetOne(id) {
    let url = "seam/form_warehouse/get_one";
    return api.post(url, { id });
  },
  CreateOutput(data) {
    let url = "seam/form_warehouse/create_output";
    return api.post(url, data);
  },
};
