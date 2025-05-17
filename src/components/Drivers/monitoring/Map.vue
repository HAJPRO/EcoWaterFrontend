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
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import Cookies from "js-cookie";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MonitoringSocketStore } from "../../../socket/store/drivers/monitoring/monitoring.store";

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

// Foydalanuvchi koordinatalarini saqlash (oldingi)
let prevLat = null;
let prevLng = null;

onMounted(() => {
  map = L.map("map").setView([40.1006, 64.6834], 13);
  osmLayer.addTo(map);

  // Foydalanuvchi geolokatsiyasini kuzatish
  if (navigator.geolocation && user && token) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Agar koordinata o'zgargan bo'lsa yangilash
        if (lat !== prevLat || lng !== prevLng) {
          prevLat = lat;
          prevLng = lng;

          socket_driver.connectSocket({ ...user, lat, lng });

          if (!currentMarker.value) {
            const icon = L.icon({
              iconUrl:
                "https://cdn3.iconfinder.com/data/icons/map-and-navigation-25/50/49-512.png",
              iconSize: [70, 70], // kattaroq icon o'lchami
              iconAnchor: [35, 70], // markazni iconning pastki o‘rtasiga sozlash
              popupAnchor: [0, -70], // pop-up uchun mos joylashuv
            });

            currentMarker.value = L.marker([lat, lng], { icon }).addTo(map);
            currentTrajectory.value = L.polyline([[lat, lng]], {
              color: "red",
              weight: 4,
            }).addTo(map);

            map.setView([lat, lng], 16); // Foydalanuvchi joylashgan joyga xaritani markazlashtirish
          } else {
            currentMarker.value.setLatLng([lat, lng]);
            currentTrajectory.value.addLatLng([lat, lng]);
          }
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

  // Haydovchilar o'zgarishini kuzatish va markerlarni boshqarish
  watch(
    drivers,
    (newDrivers) => {
      // Yangi haydovchilar IDlari ro'yxati
      const newDriverIds = newDrivers.map((d) => d.id);

      // Xaritada bor, lekin endi yo'q bo'lgan markerlarni olib tashlash
      Object.keys(driverMarkers).forEach((id) => {
        if (!newDriverIds.includes(id)) {
          map.removeLayer(driverMarkers[id]);
          delete driverMarkers[id];
          if (driverTrajectories[id]) {
            map.removeLayer(driverTrajectories[id]);
            delete driverTrajectories[id];
          }
        }
      });

      // Har bir haydovchi uchun marker va trayektoriya yaratish yoki yangilash
      newDrivers.forEach((driver) => {
        if (!driver.lat || !driver.lng) return;

        if (driverMarkers[driver.id]) {
          // Marker mavjud bo'lsa, faqat joylashuvini yangilash
          driverMarkers[driver.id].setLatLng([driver.lat, driver.lng]);
          driverTrajectories[driver.id]?.addLatLng([driver.lat, driver.lng]);
        } else {
          // Marker yo'q bo'lsa, yaratish
          // const icon = L.icon({
          //   iconUrl:
          //     driver.avatar ||
          //     "https://cdn3.iconfinder.com/data/icons/map-and-navigation-25/50/49-512.png",
          //   iconSize: [40, 40],
          //   iconAnchor: [20, 40],
          //   popupAnchor: [0, -40],
          //   className: "rounded-full",
          // });

          const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(
            map
          );

          marker.bindPopup(
            `<div class="custom-popup p-4 rounded-lg shadow-lg bg-white text-gray-800" style="width: 250px; font-family: Arial, sans-serif;">
    <div class="flex justify-center mb-3">
      <img src="${
        driver.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #4a90e2;" />
    </div>
    <h3 class="text-center font-bold text-lg mb-1">${driver.fullname}</h3>
    <p class="text-center text-sm text-gray-600 mb-3">Yoshi: <span class="font-medium">${
      driver.age
    }</span> | Jinsi: <span class="font-medium">${
              driver.gender
            }</span> | Zakazlar: <span class="font-medium">${
              driver.orders
            }</span></p>
    <hr class="border-gray-300 mb-3" />
    <div class="text-sm space-y-1">
      <p><strong>Mashina:</strong> ${driver.car_name}</p>
      <p><strong>Raqami:</strong> ${driver.car_number}</p>
      <p><strong>Rangi:</strong> ${driver.car_color}</p>
      <p><strong>Manzili:</strong> ${driver.address}</p>
      <p><strong>Koordinatalar:</strong> ${driver.lat.toFixed(
        6
      )}, ${driver.lng.toFixed(6)}</p>
    </div>
  </div>`,
            {
              closeButton: false,
              autoClose: false,
              className: "custom-popup",
            }
          );

          driverMarkers[driver.id] = marker;
          driverTrajectories[driver.id] = L.polyline(
            [[driver.lat, driver.lng]],
            {
              color: "green",
              weight: 4,
            }
          ).addTo(map);
        }
      });
    },
    { immediate: true, deep: true }
  );

  // Haydovchilarning trayektoriyasini har 5 soniyada yangilash simulyatsiyasi (kerak bo'lsa olib tashlang)
  // setInterval(() => {
  //   drivers.value.forEach((driver) => {
  //     const deltaLat = (Math.random() - 0.5) * 0.001;
  //     const deltaLng = (Math.random() - 0.5) * 0.001;
  //     driver.lat += deltaLat;
  //     driver.lng += deltaLng;

  //     driverMarkers[driver.id]?.setLatLng([driver.lat, driver.lng]);
  //     driverTrajectories[driver.id]?.addLatLng([driver.lat, driver.lng]);
  //   });
  // }, 5000);
});

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
.custom-popup {
  max-width: 220px;
}
</style>
