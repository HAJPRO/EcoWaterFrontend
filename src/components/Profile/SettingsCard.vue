<script setup>
import { ref } from "vue";

const activeTab = ref("Aloqalar");
const tabs = ["Aloqalar", "Jurnal", "Sozlamalar"];
const connections = ref({
  Profil: ["Kontakt", "Chat Profil", "Blogger"],
  Faoliyat: ["Muloqot", "Vazifa"],
  Jurnallar: [
    "Kirish jurnali",
    "Faoliyat jurnali",
    "Energiya punkti jurnali",
    "Marshrut tarixi",
  ],
  Integratsiya: ["Token Kesh"],
  Sozlamalar: ["Foydalanuvchi ruxsati", "Hujjatlarni kuzatish"],
});
</script>

<template>
  <div class="max-w-screen mx-auto bg-white rounded-2xl shadow-lg p-6">
    <!-- Profil qismi -->
    <div class="flex gap-4 items-center relative">
      <div class="relative">
        <img
          src="https://img.freepik.com/free-photo/medium-shot-smiley-man-sitting-desk_23-2149927603.jpg?t=st=1740713731~exp=1740717331~hmac=80f32fa460a7158c9731adc0cf8a12d6a79dd1630f0fe4cbb25e12fe7e6e4e19&w=1060"
          alt="Profil rasmi"
          class="w-20 h-20 rounded-full border-4 border-white shadow-lg"
        />
        <button
          class="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full shadow"
        >
          <i class="fas fa-camera text-gray-600"></i>
        </button>
      </div>
      <div>
        <h2 class="text-lg font-semibold">Sanjar Aliyev Nazarovich</h2>
        <p class="text-sm text-gray-500">UI/UX Dizayner</p>
        <p class="text-xs text-gray-400">O‘zbekiston, Buxoro</p>
      </div>
      <button
        class="ml-auto bg-green-600 text-white p-2 rounded shadow flex items-center gap-2"
      >
        <i class="fas fa-user-edit"></i> O‘zgartirish
      </button>
    </div>

    <!-- Aloqalar qismi -->
    <div class="mt-6">
      <nav class="flex border-b">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="py-2 px-4 text-sm font-medium border-b-2"
          :class="
            activeTab === tab
              ? 'border-green-600 text-greeborder-green-600'
              : 'border-transparent text-gray-600'
          "
        >
          {{ tab }}
        </button>
      </nav>

      <div v-if="activeTab === 'Aloqalar'" class="mt-4 grid grid-cols-3 gap-6">
        <div
          v-for="(items, category) in connections"
          :key="category"
          class="bg-gray-100 p-4 rounded-lg shadow"
        >
          <h3 class="text-md font-semibold text-gray-700 flex justify-between">
            {{ category }}
            <i class="fas fa-plus text-green-600 cursor-pointer"></i>
          </h3>
          <div class="mt-2 space-y-2">
            <span
              v-for="item in items"
              :key="item"
              class="block bg-white p-2 rounded shadow text-sm"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
button {
  transition: all 0.3s ease;
}
</style>
