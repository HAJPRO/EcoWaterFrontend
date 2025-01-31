<script setup>
import { ref, onMounted } from "vue";
import { loading } from "../../utils/Loader";
import { ProvidePlanStore } from "../../stores/Provide/provideStore.js";
const store_provide = ProvidePlanStore();
import { storeToRefs } from "pinia";
const { all_length } = storeToRefs(store_provide);
const getAll = async () => {
  const loader = loading.show();
  await store_provide.getAll({ status: isActive.value });
  loader.hide();
};
const is_Active = () => {
  store_provide.IsActive({ is_active: isActive.value });
};
const isActive = ref(1);
const ActiveTabLink = (num) => {
  if (num === 1) {
    isActive.value = 1;
    getAll();
    is_Active();
  }
  if (num === 2) {
    isActive.value = 2;
    getAll();
    is_Active();
  }
  if (num === 3) {
    isActive.value = 3;
    getAll();
    is_Active();
  }
};
onMounted(async () => {
  try {
    await getAll();
    is_Active();
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <div
    class="grid grid-cols-13 grid-flow-col justify-between bg-white rounded-md shadow-md p-2 mb-2"
  >
    <div class="col-span-9 grid-flow-col">
      <!-- <router-link
        @click="ActiveTabLink(1)"
        to=""
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 font-medium mb-1 text-center hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i> Jarayonda
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">1</span>/{{
              (all_length ? all_length.process_length : 0) || 0
            }}</span
          >
        </div>
      </router-link> -->
      <router-link
        to=""
        @click="ActiveTabLink(1)"
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 mb-1 font-medium text-center hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i> Bo'yoq
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] text-white bg-[#36d887] px-3 py-2 rounded"
          >
            <span class=" ">0</span>/{{
              (all_length ? all_length.paint_length : 0) || 0
            }}</span
          >
        </div>
      </router-link>
      <router-link
        to=""
        @click="ActiveTabLink(2)"
        :class="{ activeTab: isActive === 2 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 mb-1 font-medium text-center hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i> To'quv
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 2 }"
            class="inline-flex items-center justify-center h-5 text-[11px] text-white bg-[#36d887] px-3 py-2 rounded"
            ><span class=" ">0</span>/{{
              (all_length ? all_length.weaving_length : 0) || 0
            }}</span
          >
        </div>
      </router-link>
      <router-link
        to=""
        @click="ActiveTabLink(3)"
        :class="{ activeTab: isActive === 3 }"
        class="inline-flex text-[13px] items-center mr-1 px-4 py-1 font-medium mb-1 text-center hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] rounded"
      >
        <i class="fa-solid fa-info mr-2 fa-xm"></i> Yigiruv
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 3 }"
            class="inline-flex items-center justify-center h-5 text-[11px] text-white bg-[#36d887] px-3 py-2 rounded"
            ><span class=" ">0</span>/{{
              (all_length ? all_length.spinning_length : 0) || 0
            }}</span
          >
        </div>
      </router-link>
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
