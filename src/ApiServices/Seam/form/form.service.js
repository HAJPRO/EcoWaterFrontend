import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SeamInFormService = {
  GetModel() {
    let url = "seam/responsibles_model";
    return api.get(url);
  },

  GetAll(status) {
    console.log(status);
    let url = "seam/all_form";
    return api.post(url, { status });
  },
};
