<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store"; // Store yo'li
import BaseTabs from "../../../UI/BaseTabs.vue"; // Component yo'li

// Store-ni chaqirish
const store_order = OrderManagmentStore();
const { all_length } = storeToRefs(store_order);

// --- CONFIG ---
// 1. Tablar ro'yxatini shu yerda shakllantirasiz
const orderTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-layer-group" },
  { id: 2, label: "Yangi", key: "newdocs", icon: "fa-solid fa-bolt" },
  { id: 6, label: "Bekor qilingan", key: "cancelled", icon: "fa-solid fa-ban" },
];

// 2. Active Tab State (LocalStorage logikasini shu yerda saqlash ma'qul)
const savedTab = localStorage.getItem("OrderActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 2);

// 3. Data Fetching
const fetchData = async () => {
  // Loading yoqish mumkin...
  await store_order.GetAll({
    status: activeTabId.value,
    page: 1,
    limit: 10,
  });
  // Storega active statusni bildirish
  store_order.GetIsActive(activeTabId.value);
};

// 4. Tab o'zgarganda ishlaydigan funksiya
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("OrderActiveTab", newId);
  fetchData();
};

// Mount bo'lganda
onMounted(fetchData);
</script>

<template>
  <div class="">
    <BaseTabs
      v-model="activeTabId" 
      :tabs="orderTabs"
      :counts="all_length"
      @change="handleTabChange"
    />

   

  </div>
</template>