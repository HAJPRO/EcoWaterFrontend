<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">🚚 Haydovchilarni boshqarish</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2">
        <MapView />
      </div>
      <div class="col-span-1">
        <div class="space-y-4">
          <div v-for="driver in socketStore.drivers" :key="driver.id" class="bg-white p-4 rounded-xl shadow">
            <h2 class="text-xl font-semibold">{{ driver.name }}</h2>
            <p class="text-gray-500">Location: ({{ driver.lat.toFixed(4) }}, {{ driver.lng.toFixed(4) }})</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapView from './Map.vue'
import { MonitoringSocketStore } from '../../../socket/store/drivers/monitoring/monitoring.store'
const socketStore = MonitoringSocketStore()
import { storeToRefs } from 'pinia'
import { watch, onMounted } from 'vue'

const monitoringStore = MonitoringSocketStore()
const { drivers } = storeToRefs(monitoringStore)
console.log(drivers.value);

</script>
