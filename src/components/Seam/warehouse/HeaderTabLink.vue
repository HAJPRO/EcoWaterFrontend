<script setup>
import { ref, onMounted } from "vue";
import { loading } from "../../../utils/Loader";
import { SeamWarehouseStore } from "../../../stores/Seam/Warehouse/warehouse.store";
const store_warehouse = SeamWarehouseStore();
import { storeToRefs } from "pinia";
const { all_length } = storeToRefs(store_warehouse);
const IsActive = (is_active) => {
  store_warehouse.GetIsActive(is_active);
};

const getAll = async () => {
  const loader = loading.show();
  await store_warehouse.GetAll(isActive.value);
  IsActive(isActive.value);
  loader.hide();
};
const isActive = ref(1);
const ActiveTabLink = (num) => {
  if (num === 0) {
    isActive.value = 0;
    return getAll();
  }
  if (num === 1) {
    isActive.value = 1;
    return getAll();
  }
  if (num === 2) {
    isActive.value = 2;
    return getAll();
  }
  if (num === 3) {
    isActive.value = 3;
    return getAll();
  }
  if (num === 4) {
    isActive.value = 4;
    return getAll();
  }
  if (num === 5) {
    isActive.value = 5;
    return getAll();
  }
};
onMounted(async () => {
  try {
    await getAll();
  } catch (err) {
    console.log(err);
  }
});
</script>
<template>
  <div
    class="grid grid-cols-12 grid-flow-col justify-between bg-white rounded-md shadow-md p-3 mb-2"
  >
    <div class="col-span-9 grid-flow-col flex-wrap">
      <router-link
        to=""
        @click="ActiveTabLink(1)"
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-boxes-stacked mr-2 fa-xm"></i> Tavarlar
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{
              (all_length ? all_length.sale_length : 0) || 0
            }}</span
          >
        </div>
      </router-link>

      <!-- <router-link
        @click="ActiveTabLink(4)"
        to=""
        :class="{ activeTab: isActive === 4 }"
        class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-shirt mr-2 fa-xm"></i> Bichuv
        <div class="flex flex-shrink-0 ml-2">
          <span
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{
              (all_length ? all_length : 0) || 0
            }}</span
          >
        </div>
      </router-link> -->
      <router-link
        @click="ActiveTabLink(2)"
        to=""
        :class="{ activeTab: isActive === 2 }"
        class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-truck mr-2 fa-xm"></i> Yuk xati
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 2 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{
              (all_length ? all_length : 0) || 0
            }}</span
          >
        </div>
      </router-link>
      <router-link
        @click="ActiveTabLink(3)"
        to=""
        :class="{ activeTab: isActive === 3 }"
        class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-qrcode mr-2 fa-xm"></i> Scanner
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 3 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-2 py-2 rounded"
          >
            <span class=" "> <i class="fa-solid fa-qrcode fa-md"></i></span
          ></span>
        </div>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.activeTab {
  transition-duration: 0.6s;
  background: #36d887;
  color: whitesmoke;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
}
.activeTabIcon {
  background: whitesmoke;
  color: black;
}
</style>
