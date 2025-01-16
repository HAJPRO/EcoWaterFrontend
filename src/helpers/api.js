// import axios from "axios";
// const api = axios.create({
//   withCredentials: true,
//   baseURL: `http://localhost:3000/api/v1/`,
// });
// export default api;

import axios from "axios";
import Cookies from "js-cookie";
const bodyParameters = {
  key: "value",
};
let config = {
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
};
const api = axios.create({
  baseURL: "https://dev.company-erp.uz/api/v1/",
  // baseURL: "http://localhost:3000/api/v1/"
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },

  bodyParameters,
});

export default api;
