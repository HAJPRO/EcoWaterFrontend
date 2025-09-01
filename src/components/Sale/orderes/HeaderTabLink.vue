<script setup>
import { ref, onMounted,computed } from "vue";
import { loading } from "../../../utils/Loader";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";
const store_order = OrderManagmentStore();
import { storeToRefs } from "pinia";
const { all_length, orders } = storeToRefs(store_order);
import { useScreen } from "../../../utils/TableOptions/useTableOptions";
const IsActive = (is_active) => {
  store_order.GetIsActive(is_active);
};
const tabs = ref([
  {
    id: 1,
    label: "Barchasi",
    key: "all",
    icon: "fa-solid fa-list", // umumiy ro‘yxat
    color: "#2563eb",
  },
  {
    id: 2,
    label: "Yangi",
    key: "newdocs",
    icon: "fa-solid fa-file-circle-plus", // yangi hujjat
    color: "#2563eb",
  },

  {
    id: 6,
    label: "Bekor qilingan",
    key: "cancelled",
    icon: "fa-solid fa-circle-xmark", // bekor qilingan
    color: "#dc2626",
  },
]);


// 🔹 LocalStorage bilan sinxronlash
const savedActive = localStorage.getItem("HeaderActiveTab");
const isActive = ref(savedActive ? Number(savedActive) : 2);

// 🔹 Hujjatlarni olish
const getAll = async () => {
  await store_order.GetAll({
    status: isActive.value,
    page: 1,
    limit: 10,
  });
  store_order.GetIsActive(isActive.value);
};

// 🔹 Tab almashtirish
const ActiveTabLink = (num) => {
  isActive.value = num;
  localStorage.setItem("HeaderActiveTab", num);
  getAll();
};

// 🔹 Mobile breakpoint
const { isMobile } = useScreen();

// 🔹 Izlash
const search = ref("");
const filteredTabs = computed(() =>
  tabs.value.filter((t) =>
    t.label.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(getAll);
</script>
<template>
 <div>
    <!-- ✅ Desktop Tabs -->
    <div
      v-if="!isMobile"
     class="grid grid-cols-12 grid-flow-col justify-between bg-white dark:bg-slate-600 rounded-[4px] shadow-md px-1 p-1 mb-1 items-center text-center"
    >
      <div class="col-span-12 flex flex-wrap">
        <router-link
          v-for="tab in tabs"
          :key="tab.id"
          to=""
          @click.prevent="ActiveTabLink(tab.id)"
          class="tab-item"
          :class="{ 'active-tab': isActive === tab.id }"
          :data-color="tab.color"
        >
          <i :class="[tab.icon, 'mr-2 fa-md']"></i>
          {{ tab.label }}
          <span class="tab-badge">
            {{ all_length ? all_length[tab.key] : 0 }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- ✅ Mobile Dropdown (Element Plus) -->
    <div
      v-else
      class="bg-white dark:bg-slate-600 rounded-[4px] shadow-md px-1 pt-1 mb-1"
    >
      <el-select
        v-model="isActive"
        placeholder="Tab tanlang..."
        size="smal"
        clearable
        style="width: 100%"
        :no-data-text="'Topilmadi !'"
        @change="ActiveTabLink"
      >
        <!-- Header (izlash input) -->
        <template #header>
          <div class="p-1 w-full bg-white">
            <el-input
              v-model="search"
              placeholder="Izlash..."
              size="smal"
              clearable
              class="w-full"
            />
          </div>
        </template>

        <!-- Optionlar -->
        <el-option
          v-for="tab in filteredTabs"
          :key="tab.id"
          :label="tab.label"
          :value="tab.id"
        >
          <template #default>
            <div
              class="flex justify-between items-center w-full text-[12px] gap-4"
            >
              <span class="font-semibold flex items-center">
                <i
                  :class="[tab.icon, 'mr-2']"
                  :style="{ color: tab.color }"
                ></i>
                {{ tab.label }}
              </span>

              <!-- ✅ Badge son uchun -->
              <span
                class="ml-2 inline-flex items-center justify-center px-2 py-[2px] text-[11px] font-semibold rounded-full"
                :style="{ color: tab.color }"
              >
                {{ all_length.tab.key ? all_length.tab.key : 0 }}
              </span>
            </div>
          </template>
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<style scoped>
.tab-item {
  @apply inline-flex items-center mr-2 px-4 p-1 text-[13px] font-medium transition-all duration-300 ease-in-out rounded-[4px];
}
.tab-item:not(.active-tab) {
  @apply bg-slate-50 text-green-600 border;
}
.dark .tab-item:not(.active-tab) {
  @apply bg-slate-600 text-white border-[1px];
}
.active-tab {
  @apply shadow-md scale-[1.05] font-semibold;
  background: linear-gradient(135deg, #22c55e, #15803d);
  color: white !important;
  border-radius: 4px;
  transform: translateY(-2px);
}
.active-tab i {
  color: white !important;
}
.tab-badge {
  @apply ml-2 inline-flex items-center justify-center h-5 text-[11px] bg-green-600 font-semibold px-3 py-1 rounded-[4px] transition-all duration-200;
  color: white;
  opacity: 0.9;
}
.active-tab .tab-badge {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
