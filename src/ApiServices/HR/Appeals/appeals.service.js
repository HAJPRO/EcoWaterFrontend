import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const HRAppealsService = {
  GetAll(status) {
    let url = "hr/appeals/all";
    return api.post(url, { status });
  },
  ReplyMessageCreate(data) {
    console.log(data);
    let url = "hr/appeals/reply_message";
    return api.post(url, data);
  },
  Delete(id) {
    let url = "hr/appeals/delete";
    return api.post(url, { id });
  },
};
