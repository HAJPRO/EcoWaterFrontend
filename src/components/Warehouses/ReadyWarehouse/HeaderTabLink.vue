<script setup>
import { ref, onMounted } from "vue";
import { loading } from "../../../utils/Loader";
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
const store_rw = ReadyWarehouseStore();
import { storeToRefs } from "pinia";
const { products, all_length } = storeToRefs(store_rw);
const IsActive = (is_active) => {
  store_rw.GetIsActive(is_active);
};

const getAll = () => {
  store_rw.GetAll({ status: isActive.value, page: 1, limit: 10 });
  IsActive(isActive.value);
};
const isActive = ref(1);
const ActiveTabLink = (num) => {
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
  if (num === 6) {
    isActive.value = 6;
    return getAll();
  }
  if (num === 7) {
    isActive.value = 7;
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
      <!-- Barchasi -->
      <router-link
        to=""
        @click="ActiveTabLink(1)"
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-black hover:border-b-2 border-solid border-[#36d887] bg-gray-200 rounded"
      >
        <i class="fa-solid fa-list mr-2 fa-lg"></i>
        Barchasi
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.all : 0) || 0 }}
          </span>
        </div>
      </router-link>

      <!-- Jarayonda -->
      <!-- <router-link
        to=""
        @click="ActiveTabLink(3)"
        :class="{ activeTab: isActive === 3 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-black hover:border-b-2 border-solid border-[#36d887] bg-yellow-200 rounded"
      >
        <i class="fa-solid fa-spinner mr-2 fa-sm"></i>
        Jarayonda
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 3 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.warehouse : 0) || 0 }}
          </span>
        </div>
      </router-link> -->

      <!-- Bekor qilinganlar -->
      <router-link
        to=""
        @click="ActiveTabLink(4)"
        :class="{ activeTab: isActive === 4 }"
        class="inline-flex text-[12px] items-center px-4 py-1 font-medium text-center text-black hover:border-b-2 border-solid border-[#36d887] bg-red-200 rounded"
      >
        <i class="fa-solid fa-xmark mr-2 fa-md"></i>
        Bekor qilinganlar
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 4 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ 0 }}
          </span>
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
