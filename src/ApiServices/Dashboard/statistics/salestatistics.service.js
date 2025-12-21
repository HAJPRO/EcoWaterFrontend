import api from "@/helpers/api";
const RESOURCE = "dashboard/statistics/sale"; 

export const SaleStatisticsService = {

    GetAllDayStatistics(params) {
        let url = `${RESOURCE}/all`;
        return api.get(url, params);
    },

};