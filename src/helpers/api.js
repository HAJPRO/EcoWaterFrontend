
import axios from "axios";
import Cookies from "js-cookie";
const bodyParameters = {
  key: "value",
};
let config = {
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
};
const isProd = window.location.hostname !== 'localhost';
const api = axios.create({
  baseURL: isProd
    ? 'https://eco.company-erp.uz/api/v1'
    : 'http://localhost:5000/api/v1',
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
  bodyParameters,
});

export default api;
