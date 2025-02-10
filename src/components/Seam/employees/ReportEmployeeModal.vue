<script setup>
import { format } from "date-fns";
import { ref, onMounted } from "vue";
import { loading } from "../../../utils/Loader";
import { SeamEmployeesStore } from "../../../stores/Seam/Employees/employees.store";
const store_employees = SeamEmployeesStore();
import { storeToRefs } from "pinia";
const { reports, is_report_modal, employee, total_report } =
  storeToRefs(store_employees);
const ConfirmReportAndSendReply = (id) => {
  store_employees.ConfirmReportAndSendReply(id);
};
const currentPage = ref(1);
const handleCurrentChange = (page) => {
  store_employees.getOneEployeeReportPagenation(page);
  currentPage.value = page;
};
</script>
<template>
  <el-dialog v-model="is_report_modal" width="1200">
    <span>
      <div class="text-[15px] bg-white rounded shadow hover:shadow-md mt-2">
        <div
          class="bg-slate-100 font-semibold p-1 mt-1 mb-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          {{ employee ? employee : "Xodimning" }}ning hisobotlari
        </div>

        <div class="shadow-md rounded">
          <el-table
            :data="reports"
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            border
            style="width: 100%; font-size: 12px"
            :min-height="200"
            :max-height="400"
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
              header-align="center"
              prop="party_number"
              label="Partya nomeri"
              :min:width="150"
              :max:width="200"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="product"
              label="Mahsulot turi"
              :min:width="150"
              :max:width="200"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="work"
              label="Ish turi"
              :min:width="150"
              :max:width="200"
              align="center"
            />
            <el-table-column
              fixed="right"
              header-align="center"
              prop="quantity"
              label="Miqdori"
              :min:width="150"
              :max:width="200"
              align="center"
              ><template #default="scope"
                ><div class="text-red-500 font-semibold">
                  {{ scope.row.quantity }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              header-align="center"
              label="Yuborilgan vaqt"
              :min:width="300"
              :max:width="400"
              align="center"
              ><template #default="scope">
                {{
                  scope.row.createdAt
                    ? format(scope.row.createdAt, "dd.MM.yyyy HH:mm")
                    : "-"
                }}</template
              ></el-table-column
            >
            <el-table-column
              header-align="center"
              label="Qabul qilingan vaqt"
              :min:width="300"
              :max:width="400"
              align="center"
              ><template #default="scope">
                {{
                  scope.row.received_time
                    ? format(scope.row.received_time, "dd.MM.yyyy HH:mm")
                    : "-"
                }}</template
              ></el-table-column
            >
            <el-table-column
              fixed="right"
              label="Holati"
              :min:width="150"
              :max:width="200"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  {{ scope.row.status }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label=""
              width="100"
              header-align="center"
              align="center"
            >
              <template #default="{ row }">
                <!-- Dropdown -->
                <el-dropdown
                  trigger="click"
                  class="relative"
                  :popper-options="{
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: { boundary: 'window' },
                      },
                    ],
                  }"
                >
                  <el-button type="text" class="text-sm; text-gray-500">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu
                      slot="dropdown"
                      append-to-body
                      class="z-50"
                    >
                      <el-dropdown-item
                        class="text-[13px]"
                        v-if="row.status === `Tasdiqlanmagan`"
                        @click="ConfirmReportAndSendReply(row)"
                        ><template #default="scope"
                          ><div>
                            <i
                              class="text-black fa-solid fa-check fa-md mr-2"
                            ></i
                            >Tasdiqlash
                          </div>
                        </template></el-dropdown-item
                      >
                      <el-dropdown-item
                        class="text-[13px]"
                        @click="updateRow(row)"
                        ><template #default="{ row }"
                          ><div>
                            <i
                              class="text-black fa-solid fa-pen fa-sm mr-1"
                            ></i>
                            Yangilash
                          </div>
                        </template></el-dropdown-item
                      >

                      <el-dropdown-item
                        @click="deleteRow(row)"
                        class="text-red-500 text-[13px]"
                      >
                        <template #default=""
                          ><div>
                            <i
                              class="text-black fa-solid fa-trash fa-sm mr-1"
                            ></i>
                            O'chirish
                          </div>
                        </template>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="flex justify-between flex-wrap font-semibold text-[12px] p-1 shadow border-b-[1px] border-[#36d887]"
          >
            <div
              class="sticky flex justify-between bg-white pr-2 pl-2 w-full mx-auto"
            >
              <div class="flex gap-2">
                <div
                  class="my-2 text-[11px] items-center font-medium text-center text-white"
                >
                  <el-input
                    clearable
                    size="smal"
                    type="String"
                    placeholder="Partya nomer bo'yicha..."
                    style="width: 150px; font-size: 12px"
                  />
                </div>

                <div
                  class="my-2 text-[11px] items-center font-medium text-center text-white"
                >
                  <el-input
                    clearable
                    size="smal"
                    type="String"
                    placeholder="Yil bo'yicha..."
                    style="width: 150px; font-size: 12px"
                  />
                </div>

                <router-link
                  @click="ExportExcel()"
                  to=""
                  class="py-[7px] my-2 px-5 rounded text-[11px] items-center text-center font-bold bg-gray-700 text-white"
                >
                  <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
                  Excel
                </router-link>
              </div>

              <div class="block pt-3">
                <el-pagination
                  small
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="total_report"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
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
    <template #footer> </template>
  </el-dialog>
</template>
