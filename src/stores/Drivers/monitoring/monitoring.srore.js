import { defineStore } from 'pinia'

// Socket importi olib tashlandi

export const MonitoringSocketStore = defineStore('MonitoringSocketStore', {
  state: () => ({
    // Lokal yoki API dan keladigan ma'lumotlar uchun asosiy ro'yxat
    drivers: [
      // Test/Mock ma'lumotlari: Bu ma'lumotlar endi API chaqiruvi orqali to'ldirilishi kerak
      { id: 1, fullname: 'Alijon Sobirov', lat: 41.2825, lng: 69.2163, status: 'online' },
      { id: 2, fullname: 'Vali Qodirov', lat: 41.3394, lng: 69.3496, status: 'online' },
    ], 
  }),
  actions: {
    
    // API orqali haydovchilarning boshlang'ich ro'yxatini yuklash uchun funksiya
    async fetchDrivers() {
      // Eslatma: Bu yerga ma'lumotlarni REST API orqali yuklash mantiqi qo'yiladi.
      
      // const response = await fetch('/api/drivers');
      // this.drivers = await response.json();

      console.log("API orqali haydovchilar ro'yxati yuklanmoqda...");
    },

    // Lokal ma'lumotni yangilash yoki qo'shish (Endi real-time emas, API javobi kelsa yoki ma'lumotni o'zgartirish kerak bo'lsa ishlaydi)
    updateDriver(driverData) {
      const index = this.drivers.findIndex(d => d.id === driverData.id);
      if (index !== -1) {
        // Ma'lumotni yangilash
        this.drivers[index] = { ...this.drivers[index], ...driverData };
      } else {
        // Yangi haydovchini qo'shish
        this.drivers.push(driverData);
      }
    }
  }
})