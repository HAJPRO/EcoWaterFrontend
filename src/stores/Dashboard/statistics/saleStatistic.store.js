import { SaleStatisticsService } from "../../../ApiServices/Dashboard/statistics/salestatistics.service.js";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
import { defineStore } from "pinia";

const loading = Loading();
export const SaleStatisticsStore = defineStore('saleStatistic', {
  state: () => ({
    metrics: [],
    charLineOptions: {
      labels: [],
      series: []
    },
    topDrivers: [],
    topSellers: [],
    topCustomers: [],
    loading: false
  }),
  actions: {
    /**
     * @param {Object} params - { period: 'day'|'week'|'month'|'custom', start?: string, end?: string }
     */
    async GetSaleStatistics(params = { period: 'day' }) {
      this.loading = true;
      try {
        // Backend API manzilingiz
const {data} = await SaleStatisticsService.GetAllDayStatistics({params});

        // Backenddan kelgan ma'lumotlarni statega o'zlashtirish
        // Backend quyidagi strukturada ma'lumot qaytarishi kerak:
        this.metrics = data.statistics.metrics;           // [ {title, value, change, icon}, ... ]
        this.charLineOptions = data.statistics.chart;     // { labels: [], series: [{name, data}, ...] }
        this.topDrivers = data.statistics.topDrivers;     // [ {info: {fullname}, count, totalSales}, ... ]
        this.topSellers = data.statistics.topSellers;     // [ {info: {fullname}, count, totalSales}, ... ]
        this.topCustomers = data.statistics.topCustomers; // [ {info: {fullname}, totalSales, rank}, ... ]

      } catch (error) {
        console.error("Statistika yuklashda xatolik:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});