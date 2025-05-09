<script setup>
import { ref, onMounted } from "vue";
import { loading } from "../../../utils/Loader";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";
const store_order = OrderManagmentStore();
import { storeToRefs } from "pinia";
const { all_length, orders } = storeToRefs(store_order);
const IsActive = (is_active) => {
  store_order.GetIsActive(is_active);
};

const getAll =  () => {
   store_order.GetAll({status : isActive.value, page : 1, limit : 5});
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
  } if (num === 7) {
    isActive.value = 7;
    return getAll();
  }
};
onMounted(async () => {
  try {
    // await getAll();
  } catch (err) {
    console.log(err);
  }
});
</script>
<template>
  <div
    class="grid grid-cols-12 grid-flow-col justify-between bg-white rounded-md shadow-md p-3 mb-2"
  >
    <div class="col-span-12 grid-flow-col flex-wrap">
     <router-link
  @click="ActiveTabLink(1)"
  to=""
  :class="{ activeTab: isActive === 1 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-boxes-stacked mr-2"></i> Barchasi
</router-link>

<router-link
  @click="ActiveTabLink(2)"
  to=""
  :class="{ activeTab: isActive === 2 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-truck-ramp-box mr-2"></i> Yangi kelganlar
</router-link>

<router-link
  @click="ActiveTabLink(3)"
  to=""
  :class="{ activeTab: isActive === 3 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-warehouse mr-2"></i> Zaxirada
</router-link>

<router-link
  @click="ActiveTabLink(4)"
  to=""
  :class="{ activeTab: isActive === 4 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-box-open mr-2"></i> Tayyor jo‘natmaga
</router-link>

<router-link
  @click="ActiveTabLink(5)"
  to=""
  :class="{ activeTab: isActive === 5 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-truck-fast mr-2"></i> Jo‘natilgan
</router-link>

<router-link
  @click="ActiveTabLink(6)"
  to=""
  :class="{ activeTab: isActive === 6 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-arrow-rotate-left mr-2"></i> Qaytgan
</router-link>

<router-link
  @click="ActiveTabLink(7)"
  to=""
  :class="{ activeTab: isActive === 7 }"
  class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
>
  <i class="fa-solid fa-ban mr-2"></i> Brak / Yaroqsiz
</router-link>


      <router-link
        @click="ActiveTabLink(5)"
        to=""
        :class="{ activeTab: isActive ===5 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-store mr-2 fa-xm"></i> Yetkazilgan
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 5 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.raw : 0) || 0 }}</span
          >
        </div>
      </router-link>
   
     
      <router-link
        @click="ActiveTabLink(6)"
        to=""
        :class="{ activeTab: isActive === 6 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilingan
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 6 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.raw : 0) || 0 }}</span
          >
        </div>
      </router-link>
       <router-link
        @click="ActiveTabLink(7)"
        to=""
        :class="{ activeTab: isActive === 7 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-trash mr-2 fa-sm"></i> O'chirilgan
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 7 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.raw : 0) || 0 }}</span
          >
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