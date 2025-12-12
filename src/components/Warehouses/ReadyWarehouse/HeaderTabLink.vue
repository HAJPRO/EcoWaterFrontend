<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store"; // Store
import BaseTabs from "../../../UI/BaseTabs.vue"; // UI Component

// Store-ni chaqirish
const store_rw = ReadyWarehouseStore();
const { all_length } = storeToRefs(store_rw);

// --- 1. TABLAR KONFIGURATSIYASI ---
const warehouseTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-list" },
  { id: 2, label: "Tasdiqlangan", key: "confirmed", icon: "fa-solid fa-check-double" }, // Odatda aktiv mahsulotlar
  { id: 3, label: "Jarayonda", key: "process", icon: "fa-solid fa-spinner" }, // Sizda commented out edi, lekin qo'shib qo'ydim
  { id: 4, label: "Bekor qilingan", key: "cancelled", icon: "fa-solid fa-ban" },
];

// --- 2. ACTIVE STATE ---
const savedTab = localStorage.getItem("ReadyWarehouseActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 1);

// --- 3. DATA FETCHING ---
const fetchData = async () => {
  // Storega aktiv statusni bildirish
  store_rw.GetIsActive(activeTabId.value);
  
  // Ma'lumotlarni yuklash
  await store_rw.GetAll({
    status: activeTabId.value,
    page: 1,
    limit: 10,
  });
};

// --- 4. HANDLER ---
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("ReadyWarehouseActiveTab", newId);
  fetchData();
};

onMounted(() => {
  try {
    fetchData();
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="">
    <BaseTabs
      v-model="activeTabId" 
      :tabs="warehouseTabs"
      :counts="all_length"
      @change="handleTabChange"
    />
  </div>
</template>