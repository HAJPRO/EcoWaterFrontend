<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">🚚 Haydovchilarni boshqarish</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2">
        <MapView />
      </div>

      <div class="col-span-1">
        <div class="space-y-4">
          <div v-for="driver in drivers" :key="driver.id" class="bg-white p-4 rounded-xl shadow">
            <h2 class="text-xl font-semibold">{{ driver.name }}</h2>
            <p class="text-gray-500">
              Location: 
              ({{ driver.lat.toFixed(4) }}, {{ driver.lng.toFixed(4) }})
            </p>
            <p v-if="driver.status" :class="driver.status === 'online' ? 'text-green-500' : 'text-red-500'">
                Status: {{ driver.status }}
            </p>
          </div>
          
          <div v-if="!drivers || drivers.length === 0" class="bg-white p-4 rounded-xl shadow text-center text-gray-500">
              Haydovchilar topilmadi.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapView from './Map.vue'
import { ref, onMounted } from 'vue'


// Haydovchilar ma'lumotini lokal ref'ga o'tkazish (masalan, API orqali olish uchun)
const drivers = ref([
    { id: 1, name: 'Alijon Sobirov', lat: 41.2825, lng: 69.2163, status: 'online' }, // Toshkent
    { id: 2, name: 'Vali Qodirov', lat: 41.3394, lng: 69.3496, status: 'offline' }, // Toshkent shahri
    { id: 3, name: 'Sardor Azimov', lat: 39.6542, lng: 66.9744, status: 'online' }, // Samarqand
]);

onMounted(() => {
    // Endi bu yerga ma'lumotlarni API orqali olish mantiqini qo'yishingiz mumkin.
    console.log("Haydovchi monitoringi komponenti ishga tushdi. Ma'lumot lokal holatda ko'rsatilmoqda.");
});

</script>