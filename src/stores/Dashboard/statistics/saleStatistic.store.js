import { SaleStatisticsService } from "../../../ApiServices/Dashboard/statistics/salestatistics.service.js";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
const loading = Loading()
import { defineStore } from "pinia";

export const SaleStatisticsStore = defineStore('SaleStatisticsStore', {
    state: () => ({
        barSeries: [],
        lineSeries: [],
        metrics: [],
        TopDrivers: [],
        TopCustomers: [],

    }),
    actions: {
        async GetSaleStatistics() {
            const loader = loading.show()
            const data = await SaleStatisticsService.GetAllDayStatistics()
            this.metrics = data.data.statistics.metrics
            this.barSeries = data.data.statistics.charBarOptions
            this.lineSeries = data.data.statistics.charLineOptions
            this.TopDrivers = data.data.statistics.TopDriversWithFullInfo
            this.TopCustomers = data.data.statistics.TopCustomersWithFullInfo


            loader.hide()
        },


    }
})
