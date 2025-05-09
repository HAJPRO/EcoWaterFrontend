<template>
<div>
   <div
    class="mb-1 mt-2 col-span-3 w-auto fixed top-36  z-30  text-center text-white font-semibold  rounded-[4px] px-4 py-[5px]  cursor-pointer"
    @click="toggleSatellite"
   :class="{
      'bg-green-500 hover:bg-green-600': !isSatellite,
      'bg-purple-500 hover:bg-purple-600-600': isSatellite
    }"
  >
    <i v-if="isSatellite === false" class="fa-solid fa-earth-africa  fa-lg"></i>   <i v-if="isSatellite === true"  class="fa-solid fa-map  fa-lg"></i>
  </div>
  <div id="map" class="h-screen w-full  rounded-xl shadow-xl z-20"></div>
  </div>
 
</template>

<script setup>
import { UserSocketStore } from '../../../socket/store/user/user.store'
const socketStore = UserSocketStore()
import { storeToRefs } from 'pinia'
const monitoringStore = UserSocketStore()
const { onlineUsers } = storeToRefs(monitoringStore)
console.log(onlineUsers.value);
import { onMounted, ref,watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
const currentDriverId = 999; // ⬅️ Har bir haydovchi uchun unik ID (auth orqali bo'lishi mumkin)
const currentTrajectory = ref(null);
const currentMarker = ref(null);
const drivers = ref([
  { id: 1, avatar: 'https://www.shutterstock.com/image-photo/mid-adult-man-smiling-while-600nw-2237515123.jpg', fullname: 'Vali Jo‘rayev', age : '28', gender : "Erkak", position : "2", orders : '34', car_name : "Damas", car_number: '80 S 936 AW', car_color: 'oq', lat: 40.1006, lng: 64.6834, address: 'G‘ijduvon, Buxoro viloyati' },
  { id: 2, avatar: 'https://img.freepik.com/premium-photo/happy-female-driving-car-smiling-camera-posing-auto_116547-25551.jpg?semt=ais_hybrid&w=740', fullname: 'Alina Karimova',  age : '34', orders : '456', gender : "Erkak", position : "4",car_name : "Labo", car_number: '10 A 123 BC', car_color: 'qora', lat: 40.1100, lng: 64.6900, address: 'Buxoro shahar' },
   { id: 3, avatar: 'https://www.shutterstock.com/image-photo/mid-adult-man-smiling-while-600nw-2237515123.jpg', fullname: 'Vali Jo‘rayev', age : '28', gender : "Erkak", position : "2", orders : '34', car_name : "Damas", car_number: '80 S 936 AW', car_color: 'oq', lat: 30.1006, lng: 64.6834, address: 'G‘ijduvon, Buxoro viloyati' },
  { id: 4, avatar: 'https://img.freepik.com/premium-photo/happy-female-driving-car-smiling-camera-posing-auto_116547-25551.jpg?semt=ais_hybrid&w=740', fullname: 'Alina Karimova',  age : '34', orders : '456', gender : "Erkak", position : "4",car_name : "Labo", car_number: '10 A 123 BC', car_color: 'qora', lat: 20.1100, lng: 64.6900, address: 'Buxoro shahar' }
])

let map = null
let driverMarkers = {}
let driverTrajectories = {}
const osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors",
  }
);

const satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles © Esri",
  }
);
onMounted(() => {
 
  map = L.map('map').setView([40.1006, 64.6834], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
 // Real haydovchi joylashuvi
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Socket orqali backendga jo‘natamiz
        // socket.emit('driverLocation', {
        //   driverId: currentDriverId,
        //   lat,
        //   lng
        // });

        // Marker va trayektoriya frontendda chiziladi
        if (!currentMarker.value) {
          const icon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
            className: 'rounded-full'
          });

          currentMarker.value = L.marker([lat, lng], { icon }).addTo(map);
          currentTrajectory.value = L.polyline([[lat, lng]], {
            color: 'red',
            weight: 4
          }).addTo(map);
        } else {
          currentMarker.value.setLatLng([lat, lng]);
          currentTrajectory.value.addLatLng([lat, lng]);
        }
      },
      (err) => console.error('Geolokatsiya xatosi:', err),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );
  }
  // Har bir driver uchun marker va trayektoriya yaratamiz
  drivers.value.forEach(driver => {
    const icon = L.icon({
      iconUrl: driver.avatar,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: 'rounded-full'
    })

    const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map)
  marker.bindPopup(`
  <div class="custom-popup">
  
    <img src="${driver.avatar}" alt="Avatar" style=""width: 100%; height: 200px; border-radius: 10%; object-fit: cover; margin-bottom: 10px;">
    <div class=" mt-2">
    <p class="text-center text-[16px] font-semibold ">${driver.fullname}</p> 
    <div class=" text-[12px] flex gap-2 ">
     <p class="">Yoshi: ${driver.age}</p>
     <p class="">Jinsi: ${driver.gender}</p>
     <p class="">Zakazlar: ${driver.orders}</p>
     </div>
     </div>
  <div class="mt-3">
    <p class="text-center items-center font-semibold text-[13px] 
    ">Mashina ma'lumotlari:</p>
     <p>Mashina nomi: ${driver.car_name}</p>
     <p> Mashina raqami: ${driver.car_number}</p>
    <p> Mashina rangi: ${driver.car_color} </p>
  
 <p>Joriy manzili :  ${driver.address}</p>
   
  </div>
  </div>
`, {
  closeButton: false,
  autoClose: false,
  className: 'custom-popup'
});

    driverMarkers[driver.id] = marker

    // Trayektoriya uchun polyline yaratamiz
    driverTrajectories[driver.id] = L.polyline([[driver.lat, driver.lng]], {
      color: 'green',
      weight: 4
    }).addTo(map)
  })

  // Simulyatsiya qilyapmiz: 5 soniyada bir oz harakat qilsin
  setInterval(updateDriverPositions, 5000)
})

function updateDriverPositions() {
  drivers.value.forEach(driver => {
    // Har bir driver uchun tasodifiy ozgarish kiritamiz
    const deltaLat = (Math.random() - 0.5) * 0.001
    const deltaLng = (Math.random() - 0.5) * 0.001

    driver.lat += deltaLat
    driver.lng += deltaLng

    // Marker pozitsiyasini update qilamiz
    const marker = driverMarkers[driver.id]
    marker.setLatLng([driver.lat, driver.lng])

    // Trayektoriyaga yangi nuqta qo‘shamiz
    const trajectory = driverTrajectories[driver.id]
    trajectory.addLatLng([driver.lat, driver.lng])
  })
}
const isSatellite = ref(false);

async function toggleSatellite() {
  if (!map) return;

  if (isSatellite.value) {
    map.removeLayer(satelliteLayer);
    map.addLayer(osmLayer);
  } else {
    map.removeLayer(osmLayer);
    map.addLayer(satelliteLayer);
  }

  isSatellite.value = !isSatellite.value;
}
</script>

<style scoped>
/* Marker ichidagi rasmni yaxshilash uchun */
.leaflet-marker-icon {
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}
</style>
