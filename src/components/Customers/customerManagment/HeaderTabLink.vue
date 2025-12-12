<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store"; // Store
import BaseTabs from "../../../UI/BaseTabs.vue"; // UI Component

// Store-ni chaqirish
const store_managment = CustomerManagmentStore();
const { all_length } = storeToRefs(store_managment);

// --- 1. TABLAR KONFIGURATSIYASI ---
const customerTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-list" },
  { id: 2, label: "Kreditorlar", key: "creditors", icon: "fa-solid fa-user-tag" }, // Key moslanishi kerak
  { id: 3, label: "Debitorlar", key: "debtors", icon: "fa-solid fa-user-clock" }, // Key moslanishi kerak
  { id: 4, label: "Bekor qilingan", key: "cancelled", icon: "fa-solid fa-ban" },
];

// --- 2. ACTIVE STATE ---
const savedTab = localStorage.getItem("CustomerActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 2); // Default 2 (Kreditorlar)

// --- 3. DATA FETCHING ---
const fetchData = async () => {
  // Storega aktiv statusni bildirish
  store_managment.GetIsActive(activeTabId.value);
  
  // Ma'lumotlarni yuklash
  await store_managment.GetAll({
    status: activeTabId.value,
    page: 1,
    limit: 10,
  });
};

// --- 4. HANDLER ---
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("CustomerActiveTab", newId);
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
      :tabs="customerTabs"
      :counts="all_length"
      @change="handleTabChange"
    />
  </div>
</template>