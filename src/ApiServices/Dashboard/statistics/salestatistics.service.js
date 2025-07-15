import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const SaleStatisticsService = {

    GetAllDayStatistics(state) {
        let url = "dashboard/statistics/sale/all";
        return api.post(url, state);
    },

};