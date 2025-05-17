import { defineStore } from 'pinia'
import socket from '../../../socket.js'

export const MonitoringSocketStore = defineStore('MonitoringSocketStore', {
  state: () => ({
    drivers: [], // Real-time haydovchilar ro'yxati
  }),

  actions: {
    // 🔌 Soketga ulanadi
    connectSocket(driverData) {
      console.log(driverData);

      if (!socket.connected) {
        socket.connect();
        console.log("🔌 Soketga ulanildi");
      }
      // 🟢 O‘zingizni backendga ro‘yxatdan o‘tkazing
      socket.emit("register", driverData);
      socket.on("OnlineDrivers", (drivers) => {
        drivers.forEach((driver) => this.updateDriver(driver));
      });

      this.listenEvents(); // 🔁 Real-time yangilanishlar
      // 🔍 Konsolga chiqaramiz
      console.log("📦 Haydovchilar (boshlang‘ich):", this.drivers);
    },


    listenEvents() {
      socket.off('driverLocationUpdate'); // takroriy ulanishni oldini olish
      socket.on('driverLocationUpdate', (driverData) => {
        this.updateDriver(driverData);
      });
    },
    // 📥 Haydovchi ma'lumotlarini yangilash yoki qo‘shish
    updateDriver(driverData) {
      const index = this.drivers.findIndex(d => d.id === driverData.id);

      if (index !== -1) {
        const driver = this.drivers[index];
        driver.lat = driverData.lat;
        driver.lng = driverData.lng;

        if (!driver.trajectory) {
          driver.trajectory = [];
        }

        driver.trajectory.push([driverData.lat, driverData.lng]);
      } else {
        this.drivers.push({
          ...driverData,
          trajectory: [[driverData.lat, driverData.lng]]
        });
      }
    },

    // 📤 Haydovchi lokatsiyasini serverga yuborish
    driverLocation(driverData) {
      if (socket && socket.connected) {
        socket.emit('driver:location', driverData);
      } else {
        console.warn('⚠️ Socket ulanmagan');
      }
    }
  }
})
