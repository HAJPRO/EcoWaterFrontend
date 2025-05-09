import { defineStore } from 'pinia'
import socket from '../../../socket.js'

export const MonitoringSocketStore = defineStore('MonitoringSocketStore', {
  state: () => ({
    drivers: [], // real-time haydovchilar ro'yxati
  }),
  actions: {
    connectSocket() {
      if (!socket.connected) {
        socket.connect();
        this.listenEvents();
      }
    },
    listenEvents() {
      socket.on('driverLocationUpdate', (driverData) => {
        this.updateDriver(driverData);
      });
    },
    updateDriver(driverData) {
      console.log('Driver data received:', driverData);
      
      const index = this.drivers.findIndex(d => d.id === driverData.id);
      if (index !== -1) {
        this.drivers[index] = driverData;
      } else {
        this.drivers.push(driverData);
      }
    }
  }
})
