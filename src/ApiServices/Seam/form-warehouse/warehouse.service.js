import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamFormWarehouseService = {
  GetAll(status) {
    let url = "seam/form_warehouse/all";
    return api.post(url, { status });
  },
  Create(data) {
    let url = "seam/form_warehouse/create";
    return api.post(url, data);
  },
};
