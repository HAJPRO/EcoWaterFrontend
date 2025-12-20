import { SaleStatisticsService } from "../../../ApiServices/Dashboard/statistics/salestatistics.service.js";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
import { defineStore } from "pinia";

const loading = Loading();

export const SaleStatisticsStore = defineStore('SaleStatisticsStore', {
    state: () => ({
        // Metrikalar (KPI kartalari uchun)
        metrics: [],
        
        // Grafik ma'lumotlari
        charBarOptions: [], // Backenddagi nom bilan bir xil saqlash tavsiya etiladi
        charLineOptions: [],
        
        // Jadvallar (Leaderboard)
        topDrivers: [],
        topCustomers: [],
        
        // Qo'shimcha holatlar
        isProcessing: false,
    }),

    getters: {
        // Agar komponentda nomlar boshqacha kerak bo'lsa, getter ishlatish professionalroq
        barSeries: (state) => state.charBarOptions,
        lineSeries: (state) => state.charLineOptions
    },

    actions: {
        async GetSaleStatistics() {
            this.isProcessing = true;
            const loader = loading.show();
            
            try {
                const res = await SaleStatisticsService.GetAllDayStatistics();
                
                // Backenddan kelayotgan "statistics" obyektini tekshirish
                if (res?.data?.success && res?.data?.statistics) {
                    const stats = res.data.statistics;

                    // Ma'lumotlarni state-ga o'zlashtirish
                    this.metrics = stats.metrics || [];
                    this.charBarOptions = stats.charBarOptions || [];
                    this.charLineOptions = stats.charLineOptions || [];
                    
                    // Backenddagi nomlarga aniq moslash (TopDriversWithFullInfo -> topDrivers)
                    this.topDrivers = stats.topDrivers || [];
                    this.topCustomers = stats.topCustomers || [];

                } else {
                    throw new Error("Ma'lumotlar formati noto'g'ri yoki muvaffaqiyatsiz so'rov.");
                }

            } catch (error) {
                console.error("SaleStatisticsStore Error:", error);
                ToastifyService.error("Statistikalarni yuklashda xatolik yuz berdi");
            } finally {
                this.isProcessing = false;
                loader.hide();
            }
        },
    }
});