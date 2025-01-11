<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref, onMounted } from "vue";
import { SeamFormWarehouseStore } from "../../../stores/Seam/FormWarehouse/warehouse.store";
const store_form_warehouse = SeamFormWarehouseStore();
// import { HelpersStore } from "../../../stores/Helpers/helper.store";
// const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_form_warehouse);
const GetOne = (id) => {
  store_form_warehouse.GetOne(id);
};
const dropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);
</script>
<template>
  <div class="">
    <div class="">
      <div class="rounded text-[11px]">
        <el-table
          style="font-size: 12px"
          load
          class="w-full"
          header-align="right"
          header-hight="1"
          max-height="400"
          empty-text="Mahsulot qo'shilmagan... "
          :data="items"
          border
        >
          <el-table-column
            header-align="center"
            align="center"
            type="index"
            prop="index"
            fixed="left"
            label="№"
            width="50"
          />
          <el-table-column
            prop="party_number"
            label="Partya nomeri"
            width="150"
            header-align="center"
            align="center"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="customer_name"
            label="Buyurtmachi"
            width="200"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="artikul"
            label="Artikul"
            width="100"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="material_name"
            label="Mato nomi"
            width="200"
          />
          <el-table-column
            prop="color"
            label="Rangi"
            width="150"
            header-align="center"
            align="center"
          />
          <el-table-column
            fixed="right"
            prop="quantity"
            label="Miqdori"
            width="150"
            header-align="center"
            align="center"
            ><template #default="scope"
              ><div class="text-red-500">
                {{ scope.row.quantity }}
              </div></template
            ></el-table-column
          >

          <el-table-column
            align="center"
            prop="unit"
            label="Birligi"
            width="100"
            header-align="center"
          />
          <el-table-column
            align="center"
            prop="sort"
            label="Sorti"
            width="100"
            header-align="center"
          />
          <el-table-column
            label="Vaqti"
            width="150"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              String(scope.row.createdAt).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            width="200"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                to=""
                class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.status }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="id"
            label=""
            width="200"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <div class="relative inline-flex">
                <button
                  ref="trigger"
                  class="inline-flex justify-center items-center group"
                  aria-haspopup="true"
                  @click.prevent="dropdownOpen = !dropdownOpen"
                  :aria-expanded="dropdownOpen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="#000000" stroke-width="2">
                      <circle
                        cx="12"
                        cy="4"
                        r="1"
                        transform="rotate(90 12 4)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="1"
                        transform="rotate(90 12 12)"
                      />
                      <circle
                        cx="12"
                        cy="20"
                        r="1"
                        transform="rotate(90 12 20)"
                      />
                    </g>
                  </svg>
                </button>
                <transition
                  enter-active-class="transition ease-out duration-200 transform"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-out duration-200"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div
                    v-show="dropdownOpen"
                    class="origin-top-right z-10000 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                    :class="align === 'right' ? 'right-0' : 'left-0'"
                  >
                    <ul
                      ref="dropdown"
                      @focusin="dropdownOpen = true"
                      @focusout="dropdownOpen = false"
                    >
                      <li>
                        <router-link
                          class="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                          :to="{ name: 'profile_card' }"
                          >My profile</router-link
                        >
                      </li>
                      <li>
                        <router-link
                          class="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                          :to="{ name: 'profile_card' }"
                          >My profile</router-link
                        >
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <router-link
                @click="GetOne(scope.row._id)"
                v-if="
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4)) ||
                  (role === 5 &&
                    permissions.includes('seam raw warehouse') &&
                    actions.includes(4)) ||
                  role === 1000
                "
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-solid fa-plus fa-sm"></i>
              </router-link>
              <router-link
                v-if="
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4)) ||
                  (role === 5 &&
                    permissions.includes('seam raw warehouse') &&
                    actions.includes(4)) ||
                  role === 1000
                "
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-trash fa-solid fa-trash fa-sm"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
