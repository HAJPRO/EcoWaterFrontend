<script setup>
import jspdf from "jspdf";
import { utils, writeFileXLSX } from "xlsx";

const ExportExcel = () => {
  const heading = [["№", "Miqdori", "Birligi ", "Vaqt"]];
  const ws = utils.json_to_sheet(proccess_data.paint);
  const wb = utils.book_new();
  utils.sheet_add_aoa(ws, heading);
  utils.book_append_sheet(wb, ws, "proccess");
  writeFileXLSX(wb, `${Date.now()}.xlsx`);
};

const PdfDownload = () => {
  const doc = new jspdf();
  const opt = {
    orientation: "p",
    unit: "px",
    format: "letter",
    putOnlyUsedFonts: true,
  };

  const html = document.getElementById("tabel");
  doc.html(html, {
    callback: function (doc) {
      doc.save("report.pdf", opt);
    },
    x: 5,
    y: 15,
    html2canvas: { scale: 0.23 },
  });
};
import { ref } from "vue";
import { SaleStore } from "../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { proccess_modal, proccess_data, DonePaint, DoneWeaving, DoneSpinning } =
  storeToRefs(store_sale);
const FinishParty = () => {
  store_sale.FinishParty();
};
const isDepInfo = ref(false);
const active = ref(2);
</script>

<template>
  <div>
    <Report v-show="report" id="report" />
    <el-dialog id="content" v-model="proccess_modal" width="1000">
      <div
        class="font-semibold rounded text-[14px] p-1 mb-2 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-1"
      >
        <h3>Buyurtmani ishlab chiqarish jarayoni bo'yicha ma'lumotlari</h3>
      </div>
      <div class="">
        <section class="lg:py-1 xl:py-2">
          <div class="mx-auto max-w-7xl">
            <ul
              class="mx-auto grid w-full grid-cols-8 gap-1 lg:mt-2 lg:max-w-5xl"
            >
              <li
                v-for="item in proccess_data.SaleCard.process_status"
                :key="item.index"
                class="flex-start group relative"
              >
                <span
                  class="absolute top-14 w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[20px] lg:h-px lg:w-[calc(100%_-_40px)]"
                  aria-hidden="true"
                ></span>
                <div
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-[#36d887] transition-all duration-200 group-hover:bg-[#36d887]"
                >
                  <i class="fa-solid fa-check text-white"></i>
                </div>
                <div class="lg:ml-0">
                  <h4 class="mt-1 text-[11px] text-gray-700">
                    {{ item.status }}
                  </h4>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <div
          id="tabel"
          class="Main bg-white dark:bg-gray-800 shadow-sm rounded-xl"
        >
          <div
            class="Header flex justify-between gap-1 border-t-[1.5px] border-solid border-[#36d887]"
          >
            <header
              class="py-2 border-b border-gray-100 dark:border-gray-700/60"
            >
              <h5
                class="font-semibold text-[12px] text-gray-800 dark:text-gray-100"
              >
                Buyurtmachi nomi : {{ proccess_data.SaleCard.customer_name }}
              </h5>
            </header>
            <header
              class="py-2 border-b border-gray-100 dark:border-gray-700/60"
            >
              <h5
                class="font-semibold text-[12px] text-gray-800 dark:text-gray-100"
              >
                Buyurtma raqami : {{ proccess_data.SaleCard.order_number }}
              </h5>
            </header>
            <header
              class="py-2 border-b border-gray-100 dark:border-gray-700/60"
            >
              <h5
                class="font-semibold text-[12px] text-gray-800 dark:text-gray-100"
              >
                Buyurtmachi miqdori :
                {{ proccess_data.SaleCard.order_quantity }}
                {{ proccess_data.SaleCard.unit }}
              </h5>
            </header>
          </div>
          <div class="Department">
            <div>
              <header
                @click="isDepInfo = !isDepInfo"
                class="text-[12px] uppercase text-center cursor-pointer text-white dark:text-gray-500 bg-[#36d887] dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2"
              >
                Bo'limlar bo'yicha ma'lumotini ko'rish
                <span class="hidden sm:inline"> -&gt;</span>
              </header>
              <div v-show="isDepInfo" class="mt-2">
                <!-- Item -->
                <div class="Paint">
                  <div class="flex justify-between rounded bg-slate-100 p-2">
                    <div class="mt-1 mr-3 text-[15px] font-semibold">
                      <i class="fa-solid fa-landmark mr-2"></i>Bo'yoq
                    </div>
                    <div class="flex gap-2">
                      <div
                        :class="{
                          activeStatus:
                            proccess_data.PaintCard &&
                            proccess_data.PaintCard.status ===
                              `Bo'yoq yakunladi`,
                        }"
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        {{
                          proccess_data.PaintCard
                            ? proccess_data.PaintCard.status
                            : `Jarayonda`
                        }}
                      </div>
                      <div
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        Muddati:
                        {{
                          proccess_data.PaintCard
                            ? String(
                                proccess_data.PaintCard.delivery_time_sale
                              ).substring(0, 10)
                            : `Ma'lumot yo'q`
                        }}
                      </div>

                      <div>
                        <router-link
                          @click="ExportExcel()"
                          to=""
                          class="py-[5px] px-2 rounded text-[12px] items-center text-center font-bold bg-gray-700 text-white"
                        >
                          <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
                          Excel
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-span-full xl:col-span-6 bg-white dark:bg-gray-700 shadow-sm rounded-xl"
                  >
                    <div class="">
                      <div class="overflow-x-auto">
                        <div class="shadow-md rounded min-h-[15px]">
                          <el-table
                            :data="proccess_data.ReportPaint"
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
                            min-height="200"
                            max-height="200"
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
                              prop="material_name"
                              label="Mato nomi"
                              width="180"
                              align="center"
                            />
                            <el-table-column
                              header-align="center"
                              prop="material_type"
                              label="Mato turi"
                              width="150"
                              align="center"
                            />
                            <el-table-column
                              fixed="right"
                              header-align="center"
                              prop="quantity"
                              label="Miqdori"
                              width="150"
                              align="center"
                              ><template #default="scope"
                                ><div class="text-red-500 font-semibold">
                                  {{ scope.row.quantity }} {{ scope.row.unit }}
                                </div></template
                              ></el-table-column
                            >

                            <el-table-column
                              header-align="center"
                              label="Vaqt"
                              width="150"
                              align="center"
                              ><template #default="scope">{{
                                String(scope.row.createdAt).substring(0, 10)
                              }}</template></el-table-column
                            >
                            <el-table-column
                              fixed="right"
                              label="Holati"
                              width="180"
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
                              <template #default="">
                                <router-link
                                  to=""
                                  class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                                >
                                  <i
                                    class="text-red fa-solid fa-pen fa-xs fa- fa-xs"
                                  ></i>
                                </router-link>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div
                            class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
                          >
                            <div>
                              Buyurtma:
                              {{ proccess_data.SaleCard.order_quantity }}
                            </div>
                            <div>
                              Bajarildi:
                              {{ DonePaint }}
                            </div>
                            <div>
                              Qoldi:
                              {{
                                proccess_data.SaleCard.order_quantity -
                                DonePaint
                              }}
                            </div>
                          </div>
                          <!-- // -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="To'quv mt-2">
                  <div class="flex justify-between rounded bg-slate-100 p-2">
                    <div class="mt-1 mr-3 text-[15px] font-semibold">
                      <i class="fa-solid fa-landmark mr-2"></i>To'quv
                    </div>
                    <div class="flex gap-2">
                      <div
                        :class="{
                          activeStatus:
                            proccess_data.WeavingCard &&
                            proccess_data.WeavingCard.status ===
                              `To'quv yakunladi`,
                        }"
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        {{
                          proccess_data.WeavingCard
                            ? proccess_data.WeavingCard.status
                            : `Jarayonda`
                        }}
                      </div>
                      <div
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        Muddati:
                        {{
                          proccess_data.WeavingCard
                            ? String(
                                proccess_data.WeavingCard.delivery_time_paint
                              ).substring(0, 10)
                            : `Ma'lumot yo'q`
                        }}
                      </div>

                      <div>
                        <router-link
                          @click="ExportExcel()"
                          to=""
                          class="py-[5px] px-2 rounded text-[12px] items-center text-center font-bold bg-gray-700 text-white"
                        >
                          <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
                          Excel
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl"
                  >
                    <div class="">
                      <div class="overflow-x-auto">
                        <div class="shadow-md rounded min-h-[15px]">
                          <el-table
                            :data="proccess_data.ReportWeaving"
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
                            min-height="200"
                            max-height="200"
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
                              prop="material_name"
                              label="Mato nomi"
                              width="180"
                              align="center"
                            />
                            <el-table-column
                              header-align="center"
                              prop="material_type"
                              label="Mato turi"
                              width="150"
                              align="center"
                            />
                            <el-table-column
                              header-align="center"
                              prop="quantity"
                              label="Miqdori"
                              width="150"
                              align="center"
                              ><template #default="scope"
                                ><div class="text-red-500 font-semibold">
                                  {{ scope.row.quantity }} {{ scope.row.unit }}
                                </div></template
                              ></el-table-column
                            >

                            <el-table-column
                              header-align="center"
                              label="Sana"
                              width="150"
                              align="center"
                              ><template #default="scope">{{
                                String(scope.row.createdAt).substring(0, 10)
                              }}</template></el-table-column
                            >
                            <el-table-column
                              fixed="right"
                              label="Holati"
                              width="180"
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
                              <template #default="">
                                <router-link
                                  to=""
                                  class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                                >
                                  <i
                                    class="text-red fa-solid fa-pen fa-xs fa- fa-xs"
                                  ></i>
                                </router-link>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div
                            class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
                          >
                            <div>
                              Buyurtma:
                              {{
                                proccess_data.WeavingCard
                                  ? proccess_data.WeavingCard.weaving_quantity
                                  : 0
                              }}
                            </div>
                            <div>Bajarildi: {{ DoneWeaving }}</div>
                            <div>
                              Qoldi:
                              {{
                                proccess_data.WeavingCard
                                  ? proccess_data.WeavingCard.weaving_quantity -
                                    DoneWeaving
                                  : 0
                              }}
                            </div>
                          </div>
                          <!-- // -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="Yigiruv mt-2">
                  <div class="flex justify-between rounded bg-slate-100 p-2">
                    <div class="mt-1 mr-3 text-[15px] font-semibold">
                      <i class="fa-solid fa-landmark mr-2"></i>Yigiruv
                    </div>
                    <div class="flex gap-2">
                      <div
                        :class="{
                          activeStatus:
                            proccess_data.SpinningCard &&
                            proccess_data.SpinningCard.status ===
                              `Yigiruv yakunladi`,
                        }"
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        {{
                          proccess_data.SpinningCard
                            ? proccess_data.SpinningCard.status
                            : `Jarayonda`
                        }}
                      </div>
                      <div
                        class="bg-red-50 p-1 rounded text-[11px] items-center text-center font-bold border-[1px] border-red-500"
                      >
                        Muddati:
                        {{
                          proccess_data.SpinningCard
                            ? String(
                                proccess_data.SpinningCard.delivery_time_weaving
                              ).substring(0, 10)
                            : `Ma'lumot yo'q`
                        }}
                      </div>

                      <div>
                        <router-link
                          @click="ExportExcel()"
                          to=""
                          class="py-[5px] px-2 rounded text-[12px] items-center text-center font-bold bg-gray-800 text-white"
                        >
                          <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
                          Excel
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl"
                  >
                    <div class="">
                      <!-- Table -->
                      <div class="overflow-x-auto">
                        <div class="shadow-md rounded min-h-[15px]">
                          <el-table
                            :data="proccess_data.ReportSpinning"
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
                            min-height="200"
                            max-height="200"
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
                              prop="yarn_name"
                              label="Ip nomi"
                              width="180"
                              align="center"
                            />
                            <el-table-column
                              header-align="center"
                              prop="yarn_type"
                              label="Ip turi"
                              width="150"
                              align="center"
                            />
                            <el-table-column
                              fixed="right"
                              header-align="center"
                              prop="quantity"
                              label="Miqdori"
                              width="150"
                              align="center"
                              ><template #default="scope"
                                ><div class="text-red-500 font-semibold">
                                  {{ scope.row.quantity }} {{ scope.row.unit }}
                                </div></template
                              ></el-table-column
                            >

                            <el-table-column
                              header-align="center"
                              label="Vaqt"
                              width="150"
                              align="center"
                              ><template #default="scope">{{
                                String(scope.row.createdAt).substring(0, 10)
                              }}</template></el-table-column
                            >
                            <el-table-column
                              fixed="right"
                              label="Holati"
                              width="180"
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
                              <template #default="">
                                <router-link
                                  to=""
                                  class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                                >
                                  <i
                                    class="text-red fa-solid fa-pen fa-xs fa- fa-xs"
                                  ></i>
                                </router-link>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div
                            class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
                          >
                            <div>
                              Buyurtma:
                              {{
                                proccess_data.SpinningCard
                                  ? proccess_data.SpinningCard.weaving_quantity
                                  : 0
                              }}
                            </div>
                            <div>Bajarildi: {{ DoneSpinning }}</div>
                            <div>
                              Qoldi:
                              {{
                                proccess_data.SpinningCard
                                  ? proccess_data.SpinningCard
                                      .weaving_quantity - DoneSpinning
                                  : 0
                              }}
                            </div>
                          </div>
                          <!-- // -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog
        v-model="innerVisible"
        width="500"
        title="Inner Dialog"
        append-to-body
      >
        <span>This is the inner Dialog</span>
      </el-dialog>
      <template #footer>
        <div
          v-if="
            proccess_data.PaintCard &&
            proccess_data.WeavingCard &&
            proccess_data.SpinningCard &&
            proccess_data.PaintCard.status === `Bo'yoq yakunladi` &&
            proccess_data.WeavingCard.status === `To'quv yakunladi` &&
            proccess_data.SpinningCard.status === `Yigiruv yakunladi` &&
            isDepInfo
          "
          class="dialog-footer"
        >
          <div class="">
            <router-link
              @click="FinishParty()"
              to=""
              class="py-[7px] px-2 rounded text-[12px] items-center text-center font-bold bg-[#36d887] text-white"
            >
              <i class="fa-solid fa-file-check mr-2 fa-xm"></i>
              Partyani yakunlash
            </router-link>

            <!-- <router-link
              to=""
              @click="PdfDownload()"
              class="inline-flex text-[11px] items-center ml-2 px-2 py-1 mb-1 font-medium text-center text-white bg-yellow-500 text-bold rounded"
            >
              <i class="fa-solid fa-file-pdf mr-2 fa-xm"></i> Pdf
            </router-link> -->
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.activeStatus {
  transition-duration: 0.6s;
  background: linear-gradient(
    90deg,
    rgba(200, 200, 200, 1) 0%,
    rgba(54, 216, 135, 1) 35%,
    rgba(200, 200, 200, 1) 100%
  );
  /* background: #36d887; */
  color: rgb(80, 79, 79);
  box-sizing: border-box;
  width: 150px;
  font-size: 11px;
  font-weight: semibold;
  border: none;
  cursor: pointer;
}
.activeTabIcon {
  background: whitesmoke;
  color: black;
}
</style>
