<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store"; // Store
import BaseTabs from "../../../UI/BaseTabs.vue"; // UI Component

// Store-ni chaqirish
const store_products = ProductsManagmentStore();
const { all_length } = storeToRefs(store_products);

// --- 1. TABLAR KONFIGURATSIYASI ---
const productTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-list-ul" },
  { id: 2, label: "Yangi mahsulot", key: "new", icon: "fa-solid fa-cart-plus" },
  { id: 3, label: "Gazli", key: "carbonated", icon: "fa-solid fa-bottle-water" },
  { id: 5, label: "Gazsiz", key: "still", icon: "fa-solid fa-glass-water" }, // ID 5 (Tartib bo'yicha)
  { id: 4, label: "Sharbatlar", key: "juices", icon: "fa-solid fa-wine-glass" },
  { id: 6, label: "Bekor qilingan", key: "cancelled", icon: "fa-solid fa-xmark" },
  { id: 7, label: "O'chirilgan", key: "deleted", icon: "fa-solid fa-trash" },
];

// --- 2. ACTIVE STATE ---
const savedTab = localStorage.getItem("ProductActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 1);

// --- 3. DATA FETCHING ---
const fetchData = async () => {
  // Storega aktiv statusni bildirish
  store_products.GetIsActive(activeTabId.value);
  
  // Ma'lumotlarni yuklash
  await store_products.GetAll({
    status: activeTabId.value,
    page: 1,
    limit: 10,
  });
};

// --- 4. HANDLER ---
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("ProductActiveTab", newId);
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
      :tabs="productTabs"
      :counts="all_length"
      @change="handleTabChange"
    />
  </div>
</template>