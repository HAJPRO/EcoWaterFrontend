import { defineStore } from 'pinia'

export const DriverMonitoingStore = defineStore('DriverMonitoingStore', {
  state: () => ({
    drivers: [], // real-time haydovchilar ro'yxati
  }),
  actions: {
  async  GetAll() {
     
    }
  }
})
