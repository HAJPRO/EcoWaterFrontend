
import axios from "axios";
import Cookies from "js-cookie";
const bodyParameters = {
  key: "value",
};
let config = {
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
};
const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1/",
  baseURL: "https://eco.company-erp.uz/api/v1/",
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
  bodyParameters,
});

export default api;
