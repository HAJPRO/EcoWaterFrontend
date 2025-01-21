<script setup>
import { onMounted, ref } from "vue";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { SaleStore } from "../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { detail, is_detail_modal } = storeToRefs(store_sale);
const confirm = () => {
  store_sale.Confirm();
};
onMounted(async () => {
  try {
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
});
</script>

<template>
  <el-dialog v-model="is_detail_modal" width="1000">
    <span>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div
          v-if="detail.card.order_number"
          class="col-span-3 h-[200px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[13px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
        >
          <div class="bg-[#e8eded] p-2 rounded">
            Buyurtma nomeri: {{ detail.card.order_number }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Buyurtmachi: {{ detail.card.customer_name }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Artikul: {{ detail.card.artikul }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Muddati: {{ String(detail.card.delivery_time).substring(0, 10) }}
          </div>
        </div>
        <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :header-cell-style="{ background: '#e8eded' }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="detail.products"
            border
            height="150"
          >
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              prop="index"
              fixed="left"
              label="№"
              width="60"
            />
            <el-table-column
              prop="product_name"
              label="Nomi"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="product_type"
              label="Turi"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="color"
              label="Rangi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="width"
              label="Eni"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="grammage"
              label="Grammage"
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
                  {{ scope.row.quantity }} {{ scope.row.unit }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              prop="unit"
              label="Birligi"
              width="100"
              header-align="center"
              align="center"
            />

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              width="120"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  @click="deleteById(scope.row.id)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-show="detail.card.status === `Tasdiqlanmagan`"
            class="flex justify-end col-span-10 p-1 bg-white"
          >
            <el-button
              size="smal"
              @click="confirm()"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i> Tasdiqlash
            </el-button>
            <el-button
              size="smal"
              @click="Cancel()"
              style="
                background-color: red;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </el-button>
          </div>
        </div>
      </div>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>
