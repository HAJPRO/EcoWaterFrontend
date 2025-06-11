import { defineStore } from 'pinia';
import socket from '../../../socket.js';

export const MonitoringSocketStore = defineStore('MonitoringSocketStore', {
  state: () => ({
    drivers: [], // Real-time haydovchilar ro'yxati
  }),

  actions: {
    connectSocket(driverData) {
      if (!socket.connected) socket.connect();

      // Haydovchi tizimga kirgani haqida serverga ma'lumot yuborish
      socket.emit("driver:connected", driverData);

      // Eski 'drivers:online' listenerni olib tashlash
      socket.off("drivers:online");

      // Barcha haydovchilar ro'yxatini olish va yangilash
      socket.on("drivers:online", (allDrivers) => {
        this.drivers = allDrivers;
        console.log("📦 Barcha haydovchilar:", this.drivers);
      });

      // Qo'shimcha hodisalarni tinglash (agar kerak bo'lsa)
      this.listenEvents();
    },

    listenEvents() {
      // Masalan, haydovchi koordinatasi yangilansa
      socket.off('driver:location:update');
      socket.on('driver:location:update', (updatedDriver) => {
        const index = this.drivers.findIndex(d => d.id === updatedDriver.id);
        if (index !== -1) {
          this.drivers[index] = updatedDriver;
        } else {
          this.drivers.push(updatedDriver);
        }
      });
    },

    // Haydovchi joylashuvini serverga yuborish (agar kerak bo'lsa)
    sendDriverLocation(locationData) {
      if (socket.connected) {
        socket.emit('driver:location', locationData);
      }
    },
  },
});
