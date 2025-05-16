<template>
  <div>
    <div
      class="mb-1 mt-2 col-span-3 w-auto fixed top-36 z-30 text-center text-white font-semibold rounded-[4px] px-4 py-[5px] cursor-pointer"
      @click="toggleSatellite"
      :class="{
        'bg-green-500 hover:bg-green-600': !isSatellite,
        'bg-purple-500 hover:bg-purple-600': isSatellite,
      }"
    >
      <i v-if="!isSatellite" class="fa-solid fa-earth-africa fa-lg"></i>
      <i v-else class="fa-solid fa-map fa-lg"></i>
    </div>
    <div id="map" class="h-screen w-full rounded-xl shadow-xl z-20"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Cookies from "js-cookie";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { UserSocketStore } from "../../../socket/store/user/user.store";
import { MonitoringSocketStore } from "../../../socket/store/drivers/monitoring/monitoring.store";

const socketStore = UserSocketStore();
const socket_driver = MonitoringSocketStore();

const { drivers } = storeToRefs(socket_driver);

const user = Cookies.get("account") ? JSON.parse(Cookies.get("account")) : null;
const token = Cookies.get("token") || null;

const isSatellite = ref(false);
const currentMarker = ref(null);
const currentTrajectory = ref(null);

let map = null;
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

let driverMarkers = {};
let driverTrajectories = {};

onMounted(() => {
  map = L.map("map").setView([40.1006, 64.6834], 13);
  osmLayer.addTo(map);

  // Geolokatsiyani kuzatish
  if (navigator.geolocation && user && token) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        socket_driver.connectSocket({ ...user, lat, lng });

        if (!currentMarker.value) {
          const icon = L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          currentMarker.value = L.marker([lat, lng], { icon }).addTo(map);
          currentTrajectory.value = L.polyline([[lat, lng]], {
            color: "red",
            weight: 4,
          }).addTo(map);
        } else {
          currentMarker.value.setLatLng([lat, lng]);
          currentTrajectory.value.addLatLng([lat, lng]);
        }
      },
      (err) => console.error("Geolokatsiya xatosi:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    );
  }

  // Haydovchilarni xaritada chiqarish
  drivers.value.forEach((driver) => {
    const icon = L.icon({
      iconUrl: driver.avatar,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: "rounded-full",
    });

    const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map);
    marker.bindPopup(
      `
      <div class="custom-popup">
        <img src="${driver.avatar}" alt="Avatar" style="width: 100%; height: 200px; border-radius: 10%; object-fit: cover; margin-bottom: 10px;">
        <p class="text-center font-semibold text-[16px]">${driver.fullname}</p>
        <p class="text-[12px]">Yoshi: ${driver.age} | Jinsi: ${driver.gender} | Zakazlar: ${driver.orders}</p>
        <hr />
        <p>Mashina: ${driver.car_name}</p>
        <p>Raqami: ${driver.car_number}</p>
        <p>Rangi: ${driver.car_color}</p>
        <p>Manzili: ${driver.address}</p>
      </div>
    `,
      {
        closeButton: false,
        autoClose: false,
        className: "custom-popup",
      }
    );

    driverMarkers[driver.id] = marker;
    driverTrajectories[driver.id] = L.polyline([[driver.lat, driver.lng]], {
      color: "green",
      weight: 4,
    }).addTo(map);
  });

  // Har 5 soniyada harakat simulyatsiyasi
  setInterval(() => {
    drivers.value.forEach((driver) => {
      const deltaLat = (Math.random() - 0.5) * 0.001;
      const deltaLng = (Math.random() - 0.5) * 0.001;
      driver.lat += deltaLat;
      driver.lng += deltaLng;

      driverMarkers[driver.id]?.setLatLng([driver.lat, driver.lng]);
      driverTrajectories[driver.id]?.addLatLng([driver.lat, driver.lng]);
    });
  }, 5000);
});

// Xarita fonini almashtirish
function toggleSatellite() {
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
.leaflet-marker-icon {
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}
</style>
