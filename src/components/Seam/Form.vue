<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref, onMounted } from "vue";
import AddToFormModal from "../../components/Seam/AddToFormModal.vue";
import { SeamStore } from "../../stores/Seam/seam.store";
const store_seam = SeamStore();
import { HelpersStore } from "../../stores/Helpers/helper.store";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { form_modal, model, items } = storeToRefs(store_seam);

const AddForm = async () => {
  await store_seam.AddFormModal();
};
onMounted(async () => {
  await store_seam.GetAllForm();
});
</script>
<template>
  <AddToFormModal />
  <div class="">
    <div class="">
      <div
        v-if="
          role === 1000 ||
          (role === 5 && permissions.includes('seam raw warehouse'))
        "
        class="flex justify-end bg-white p-2 rounded"
      >
        <div></div>
        <el-button
          @click="AddForm()"
          size="small"
          style="background-color: #36d887; color: white; border: none"
        >
          <i class="mr-2 fa-solid fa-plus fa-sm"></i>Bichuvga
          chiqarish</el-button
        >
      </div>

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
            width="300"
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
            prop="material_name"
            label="Mato nomi"
            width="200"
          />
          <el-table-column
            prop="color"
            label="Rangi"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="quantity"
            label="Miqdori"
            width="200"
            header-align="center"
            align="center"
          />

          <el-table-column
            align="center"
            prop="unit"
            label="Birligi"
            width="180"
            header-align="center"
          />
          <el-table-column
            align="center"
            prop="sort"
            label="Sorti"
            width="180"
            header-align="center"
          />
          <el-table-column
            prop="createdAt"
            label="Vaqti"
            width="190"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              String(scope.row.createdAt).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            width="150"
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
            <template #default="">
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
                class="inline-flex items-center ml-2 text-red hover:bg-red-600 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
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
<style scoped>
.col_span {
  display: grid;
  grid-column: 7;
}
</style>
