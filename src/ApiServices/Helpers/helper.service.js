import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const HelpersService = {
  CreateMaterialName(data) {
    let url = "helpers//create_material_name";
    return api.post(url, data);
  },
  GetAllMaterialNames(data) {
    let url = "helpers/all";
    return api.post(url, data);
  },
};
