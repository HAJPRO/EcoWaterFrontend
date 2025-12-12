<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store"; // To'g'ri store
import BaseTabs from "../../../UI/BaseTabs.vue"; // Yangi UI komponent

// Store-ni chaqirish
const store_employees = EmployeeManagmentStore();
const { all_length } = storeToRefs(store_employees);

// --- 1. TABLAR KONFIGURATSIYASI ---
// Eski koddagi barcha kategoriyalarni shu yerga yozdik
const employeeTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-list-ul" },
  { id: 2, label: "Adminstratsiya", key: "admin", icon: "fa-solid fa-user-tie" },
  { id: 3, label: "Haydovchilar", key: "drivers", icon: "fa-solid fa-car" },
  { id: 4, label: "Agentlar", key: "agents", icon: "fa-solid fa-users" },
  { id: 5, label: "Ishchi xodimlar", key: "workers", icon: "fa-solid fa-users-rectangle" },
];

// --- 2. ACTIVE STATE (LocalStorage bilan) ---
// Oxirgi tanlangan bo'limni eslab qolish uchun
const savedTab = localStorage.getItem("EmployeeActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 1);

// --- 3. DATA FETCHING (Ma'lumot olish) ---
const fetchData = async () => {
  // Storega qaysi tab aktivligini bildiramiz (eski koddagi IsActive funksiyasi)
  store_employees.GetIsActive(activeTabId.value);

  // Ma'lumotlarni yuklaymiz
  await store_employees.GetAll({
    status: activeTabId.value,
    page: 1,
    limit: 10,
  });
};

// --- 4. HANDLER (Tab o'zgarganda) ---
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("EmployeeActiveTab", newId); // Tanlovni saqlash
  fetchData(); // Yangi ma'lumotni tortish
};

// Sahifa yuklanganda ishga tushadi
onMounted(() => {
  try {
    fetchData();
  } catch (err) {
    console.error("Xatolik:", err);
  }
});
</script>

<template>
  <div class="">
    <BaseTabs
      v-model="activeTabId" 
      :tabs="employeeTabs"
      :counts="all_length"
      @change="handleTabChange"
    />
  </div>
</template>