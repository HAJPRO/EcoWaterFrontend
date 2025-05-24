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
  map = L.map("map").setView([40.1006, 64.6834], 14);
  osmLayer.addTo(map);

  // Foydalanuvchi geolokatsiyasini kuzatish
  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // // Xarita markazini foydalanuvchi joylashuviga o'rnatish
      // if (map) {
      //   map.setView([lat, lng], 13);
      // }

      socket_driver.connectSocket({ ...user, lat, lng });
    },
    (err) => console.error("Geolokatsiya xatosi:", err),
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
  );

  // Haydovchilar o'zgarishini kuzatish va markerlarni boshqarish
  watch(
    drivers,
    (newDrivers) => {
      console.log("Backenddan kelayotgan haydovchilar:", newDrivers);

      // Eski marker va trayektoriyalarni olib tashlash
      Object.values(driverMarkers).forEach((marker) => map.removeLayer(marker));
      Object.values(driverTrajectories).forEach((polyline) =>
        map.removeLayer(polyline)
      );

      driverMarkers = {};
      driverTrajectories = {};

      newDrivers.forEach((driver) => {
        if (!driver.lat || !driver.lng) return;

        const icon = L.icon({
          iconUrl:
            "https://cdn3.iconfinder.com/data/icons/map-and-navigation-25/50/49-512.png",
          iconSize: [80, 80], // kattaroq icon o'lchami
          iconAnchor: [40, 80], // markazni iconning pastki o‘rtasiga sozlash
          popupAnchor: [0, -80], // pop-up uchun mos joylashuv
          className: "rounded-full",
        });

        const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map);

        marker.bindPopup(
          `
        <div class="custom-popup">
          <img src="${
            driver.avatar
              ? driver.avatar
              : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
          }" alt="Avatar" style="width: 100%; height: 220px; border-radius: 10%; object-fit: cover; margin-bottom: 10px;">
          <p class="text-center font-semibold text-[16px]">${
            driver.fullname
          }</p>
          <p class="text-[12px]">Yoshi: ${
            driver.age ? driver.age : 0
          } | Jinsi: ${driver.gender ? driver.gender : "-"} | Zakazlar: ${
            driver.orders ? driver.orders : "0"
          }</p>
          <hr />
          <p>Mashina: ${driver.car_name ? driver.car_name : "-"}</p>
          <p>Raqami: ${driver.car_number ? driver.car_number : "-"}</p>
          <p>Rangi: ${driver.car_color ? driver.car_color : "-"}</p>
          <p>Manzili: ${driver.address.region},  ${driver.address.district}</p>
          <p>Koordinatalar: ${driver.lat}, ${driver.lng}</p>
        </div>`,
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
      // Xarita hududini barcha haydovchilar joylashgan joyga markazlashtirish
      // if (newDrivers.length > 0) {
      //   const latitudes = newDrivers.map((d) => d.lat);
      //   const longitudes = newDrivers.map((d) => d.lng);

      //   const southWest = [Math.min(...latitudes), Math.min(...longitudes)];
      //   const northEast = [Math.max(...latitudes), Math.max(...longitudes)];
      //   const bounds = L.latLngBounds(southWest, northEast);

      //   map.fitBounds(bounds.pad(0.1));
      // }
    },
    { immediate: true, deep: true }
  );
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
