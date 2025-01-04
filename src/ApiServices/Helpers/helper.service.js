import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const HelpersService = {
  CreateOption(data) {
    let url = "helpers/create_option";
    return api.post(url, data);
  },

  GetOptionsByType(type) {
    let url = "helpers/options";
    return api.post(url, type);
  },

};
