import { SaleStatisticsService } from "../../../ApiServices/Dashboard/statistics/salestatistics.service.js";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";

export const SaleStatisticsStore = defineStore('SaleStatisticsStore', {
    state: () => ({
        statistics: {}, // real-time haydovchilar ro'yxati
        metrics: [],

    }),
    actions: {
        async GetSaleStatistics() {
            const loader = loading.show()
            const data = await SaleStatisticsService.GetAllDayStatistics()
            this.metrics = data.data.statistics
            loader.hide()
        },


    }
})
