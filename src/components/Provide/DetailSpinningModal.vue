<script setup>
import { ref } from "vue";
import { ProvidePlanStore } from "../../stores/Provide/provideStore";
const store_provide = ProvidePlanStore();
import { storeToRefs } from "pinia";
const { detail_spinning_modal, detail } = storeToRefs(store_provide);

const is_cancel = ref(false);
const Cancel = () => {
  is_cancel.value = !is_cancel.value;
};
const confirm = () => {
  store_provide.Confirm({ department: 4, delivered: false });
};
const delivered = () => {
  store_provide.Confirm({ department: 4, delivered: true });
};
const cancel_reason = ref();
const sendReason = async () => {
  await store_provide.cancelSendReason({
    reason: cancel_reason.value,
  });
};
</script>
<template>
  <div>
    <el-dialog v-model="detail_spinning_modal" width="1000">
      <span>
        <div class="shadow-md rounded">
          <div
            class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
          >
            Buyurtma ma'lumotlari!
          </div>
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            size="small"
            show-header="true"
            load
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="detail.delivery_product_box"
            border="true"
            style="width: 100%; font-size: 12px"
            height="150"
          >
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              prop="index"
              fixed="left"
              label="№"
              :max-width="80"
              :min-width="60"
            />
            <el-table-column
              header-align="center"
              prop="begunok_name"
              label="Begunok nomi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="begunok_type"
              label="Begunok turi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="begunok_quantity"
              label="Begunok miqdori(kg)"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_name"
              label="Latun nomi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_type"
              label="Latun turi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_quantity"
              label="Latun miqdori(kg)"
              :max-width="200"
              :min-width="150"
              align="center"
            />

            <el-table-column
              fixed="right"
              label="Muddati"
              :max-width="300"
              :min-width="150"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div class="text-red-500">
                  {{ String(scope.row.delivery_time_provide).substring(0, 10) }}
                </div>
              </template></el-table-column
            >

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              :max-width="200"
              :min-width="100"
              header-align="center"
              align="center"
            >
              <template #default="">
                <router-link
                  to=""
                  class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
                >
                  <i class="text-black fa-check fa-solid fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </span>

      <el-dialog
        v-model="innerVisible"
        width="600"
        title="Inner Dialog"
        append-to-body
      >
        <span>Cancel And Of Reason</span>
      </el-dialog>
      <template #footer>
        <div>
          <router-link
            v-if="detail.status === `Jarayonda`"
            type=""
            to=""
            @click="delivered()"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-check fa-sm"></i>Yakunlash</router-link
          >
        </div>
        <div v-if="detail.status === `Tasdiqlanmagan`" class="dialog-footer">
          <router-link
            v-if="!is_cancel"
            to=""
            @click="Cancel()"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-red-500 text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-xmark fa-sm"></i>Bekor
            qilish</router-link
          >
          <router-link
            v-if="!is_cancel"
            type=""
            to=""
            @click="confirm()"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-check fa-sm"></i>Qabul
            qilish</router-link
          >
          <router-link
            v-if="is_cancel"
            type=""
            @click="is_cancel = false"
            to=""
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-red-500 text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-arrow-left fa-sm"></i>Orqaga</router-link
          >
          <router-link
            v-if="is_cancel"
            type=""
            to=""
            @click="sendReason()"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
          >
          <router-link
            v-if="detail.status === `Jarayonda`"
            type=""
            to=""
            @click="confirm()"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-check fa-sm"></i>Yakunlash</router-link
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
