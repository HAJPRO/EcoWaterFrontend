<script setup>
import Cookies from "js-cookie";
const author = ref(JSON.parse(Cookies.get("account")).id);
const department = ref(JSON.parse(Cookies.get("account")).department);
const role = ref(JSON.parse(Cookies.get("account")).role);
import { ref, onMounted } from "vue";
import { SaleStore } from "../../stores/Sale/sale.store";
const store = SaleStore();
import { storeToRefs } from "pinia";
const { length } = storeToRefs(store);
const SaleCreateCardModal = async () => {
  await store.SaleCreateCardModal();
};
const getAll = async () => {
  await store.getAll({ status: isActive.value });
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
    class="grid grid-cols-12 grid-flow-col justify-between bg-white rounded-md shadow-md p-2 mb-2"
  >
    <div class="col-span-9 grid-flow-col">
      <router-link
        @click="ActiveTabLink(1)"
        to=""
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i> Sotuv
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{ 0 || 0 }}</span
          >
        </div>
      </router-link>
      <router-link
        to=""
        @click="ActiveTabLink(2)"
        :class="{ activeTab: isActive === 2 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i>
        Bo'yoq
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 2 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{ 0 || 0 }}</span
          >
        </div>
      </router-link>
    </div>
    <div class="row-span-1 flex justify-end flex-wrap col-span-3 grid-flow-col">
      <div class="col-span-2"></div>
      <div class="col-span-1">
        <router-link
          @click="SaleCreateCardModal()"
          to=""
          class="inline-flex items-center px-3 py-1 mb-1 text-[13px] font-medium text-center text-white bg-[#36d887] text-bold rounded"
        >
          <i class="fa-solid fa-plus mr-2 fa-sm"></i> Karta qo'shish
        </router-link>
      </div>
    </div>
  </div>
</template>
<style>
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
