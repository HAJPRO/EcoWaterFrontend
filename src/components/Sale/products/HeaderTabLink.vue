<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store"; 
import BaseTabs from "../../../UI/BaseTabs.vue"; 

// Store
const store = ProductsManagmentStore();
const { pagination } = storeToRefs(store);

// --- 1. TABLAR KONFIGURATSIYASI ---
const productTabs = [
  { id: 1, label: "Barchasi", key: "all", icon: "fa-solid fa-list-ul" },
  { id: 2, label: "Yangi", key: "new", icon: "fa-solid fa-clock" }, // Yangi qo'shilganlar
  { id: 3, label: "Gazli", key: "carbonated", icon: "fa-solid fa-bottle-water" },
  { id: 5, label: "Gazsiz", key: "still", icon: "fa-solid fa-glass-water" },
  { id: 4, label: "Sharbatlar", key: "juices", icon: "fa-solid fa-wine-glass" },
  { id: 7, label: "Arxiv", key: "deleted", icon: "fa-solid fa-trash-can" }, // "O'chirilgan" -> Arxiv
];

// --- 2. STATE ---
const savedTab = localStorage.getItem("ProductActiveTab");
const activeTabId = ref(savedTab ? Number(savedTab) : 1);

// --- 3. FILTER LOGIKASI (Tab ID -> API Params) ---
const getFilterByTab = (id) => {
    switch (id) {
        case 1: return { status: 'active' }; // Hamma aktivlar
        case 2: return { sort: 'newest', status: 'active' }; // Eng yangilar
        case 3: return { category: 'Gazli', status: 'active' };
        case 5: return { category: 'Gazsiz', status: 'active' };
        case 4: return { category: 'Sharbatlar', status: 'active' };
        case 7: return { status: 'archived' }; // O'chirilganlar (Arxiv)
        default: return { status: 'active' };
    }
};

// --- 4. DATA FETCHING ---
const fetchData = async () => {
  const filters = getFilterByTab(activeTabId.value);
  
  // Store-ga so'rov yuborish
  await store.GetAll({
    ...filters,
    page: 1, // Tab almashganda 1-betga qaytish
    limit: 10,
  });
};

// --- 5. HANDLER ---
const handleTabChange = (newId) => {
  activeTabId.value = newId;
  localStorage.setItem("ProductActiveTab", newId);
  fetchData();
};

// Counts obyekti (BaseTabs uchun moslash)
// Hozirgi backend faqat active tabning totalini qaytaradi
const tabCounts = ref({});

// Pagination o'zgarganda countni yangilash
watch(() => pagination.value.total, (newTotal) => {
    tabCounts.value = {
        ...tabCounts.value,
        [activeTabId.value]: newTotal
    };
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="mb-4">
    <BaseTabs
      v-model="activeTabId" 
      :tabs="productTabs"
      :counts="tabCounts"
      @change="handleTabChange"
    />
  </div>
</template>