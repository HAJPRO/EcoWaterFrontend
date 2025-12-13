<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";

// --- STORES ---
import { PermissionStore } from "../../../../stores/Admin/permission.store";
import { RoleStore } from "../../../../stores/Admin/role.store";

// --- UI COMPONENTS ---
import BaseTabs from "../../../../UI/BaseTabs.vue"; // Yo'lni to'g'irlang

const store_role = RoleStore();
const store_permission = PermissionStore();
const { all_length } = storeToRefs(store_role); // all_length qaysi storeda ekanligini tekshiring (odatda role storeda bo'ladi)

// --- STATE ---
const activeTab = ref(1); // 1: Rollar, 2: Ruxsatlar

// --- COMPUTED (Tablar konfiguratsiyasi) ---
// Bu yerda store dagi countlarni tablar bilan bog'laymiz
const tabsConfig = computed(() => [
  { 
    id: 1, 
    label: "Rollar", 
    icon: "fa-solid fa-shield-halved", 
    // count: all_length.value?.roles || 0 
  },
  { 
    id: 2, 
    label: "Ruxsatlar", 
    icon: "fa-solid fa-key", 
    // count: all_length.value?.permissions || 0 
  }
]);

// --- ACTIONS ---
const fetchData = async () => {
  if (activeTab.value === 1) {
    await store_role.GetAll();
  } else {
    await store_permission.GetAll();
  }
  // IsActive funksiyasi nima qilishini bilmayman, lekin kerak bo'lsa:
  store_permission.IsActive(activeTab.value);
};

// Tab o'zgarganda avtomatik ma'lumot yuklash
watch(activeTab, () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <BaseTabs 
    v-model="activeTab" 
    :tabs="tabsConfig" 
  />
</template>