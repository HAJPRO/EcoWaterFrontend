<script setup>
import AddCustomerModal from "../../Customers/customerManagment/AddCustomModal.vue";
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";

import { AddressStore } from "../../../stores/Helpers/address/address.store";
const store_address = AddressStore();
const store_customers = CustomerManagmentStore();
const store_orders = OrderManagmentStore();
const store_products = ProductsManagmentStore();

import { storeToRefs } from "pinia";
const { regions, districts, neighborhoods } = storeToRefs(store_address);
const { custom_modal, modal, action, customers } = storeToRefs(store_customers);
const { order_modal, model } = storeToRefs(store_orders);
const { products: productsOptions } = storeToRefs(store_products);
const dialogWidth = ref("");
window.addEventListener("devicemotion", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1300"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
window.addEventListener("resize", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1500"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
};
const packingTypes = ref([
  { id: 1, name: "0.5 l" },
  { id: 2, name: "1 l" },
  { id: 3, name: "1.5 l" },
  { id: 4, name: "2 l" },
  { id: 6, name: "5 l" },
  { id: 7, name: "10 l" },
  { id: 8, name: "20 l" },
]);
const AddCustomeModal = () => {
  store_customers.AddCustomModal();
};
const ChangeCustomerFullname = async (id) => {
  model.value.fullname = id;
  store_customers.GetById({ id, status: "order" });
};
const ChangeProductType = async (e) => {
  model.value.product.pro_type = e;
};
// const ChangeProductName = async (e) => {
//   model.value.product.pro_name = e;
// };

const units = ref([
  // { id: 1, name: "Litr" },
  { id: 2, name: "Dona" },
  // { id: 3, name: "Blok" },
]);

const productsType = ref([
  // { id: 1, name: "Gazli" },
  { id: 2, name: "Gazsiz" },
  // { id: 3, name: "Sharbatlar" },
]);

const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_orders.Create({
        products: products.value,
        customerId: modal.value.model._id,
        totalAmount: pro_total_price.value,
      });
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};

const ProductRef = ref();
const PlusProductValidate = async (formRef) => {
  await ProductRef.validate((valid) => {
    if (valid === true) {
      PlusProduct();
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};
const products = ref([]);
const PlusProduct = () => {
  if (
    model.value.product.pro_quantity === "" ||
    model.value.product.pro_price === "" ||
    model.value.product.pro_name === "" ||
    model.value.product.pro_type === "" ||
    model.value.product.pro_unit === "" ||
    model.value.product.packingType === ""
  ) {
    ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
    return (products.value = []);
  } else {
    products.value.push({ id: uuidv4(), ...model.value.product });
  }
};
model.value.product.pro_total_price = computed(() => {
  const quantity = model.value.product.pro_quantity;
  const unitPrice = model.value.product.pro_price;
  return unitPrice ? quantity * unitPrice : 0;
});
const pro_total_price = computed(() => {
  const initialValue = ref(0);
  if (products.value?.length > 0) {
    initialValue.value = products.value?.reduce(
      (a, b) => a + Number(b.pro_total_price),
      0
    );
    return initialValue.value;
  } else {
    return 0;
  }
});
const DeleteById = (id) => {
  const filterLoad = products.value.filter((item) => {
    return item.id !== id;
  });
  products.value = filterLoad;
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});

const pakings = ref();
const SelectedProduct = ref();
const ChangeProductName = (value) => {
  const selectedProduct = productsOptions.value.find(
    (item) => item.pro_name === value
  );
  if (selectedProduct) {
    model.value.category = selectedProduct.pro_category;
    // model.value.code = selectedProduct.code;
    pakings.value = selectedProduct.products;
    SelectedProduct.value = selectedProduct;

    model.value.product.pro_name = value;
  }
};
const changedProduct = ref();
const ChangePackingType = (value) => {
  if (SelectedProduct.value) {
    const selectedPacking = SelectedProduct.value.products.find(
      (item) => item.packingType === value
    );
    changedProduct.value = selectedPacking;
  }
};
const ChangeUnitType = (value) => {
  if (changedProduct.value) {
    if (value === "Blok") {
      model.value.product.pro_price = changedProduct.value.block_buying_price;
    }
    if (value === "Dona") {
      model.value.product.pro_price = changedProduct.value.buying_price;
    }
  }
};
// Faqat fullname boshlanishi bo‘yicha filter
const filter = ref({
  fullname: "",
});
const filteredCustomers = computed(() => {
  if (!filter.value.fullname) return customers.value;
  const query = filter.value.fullname.toLowerCase();
  return customers.value.filter((customer) => {
    const name = customer.fullname.toLowerCase();
    return name.startsWith(query) || name === query;
  });
});
onMounted(async () => {
  store_products.GetAll({ status: 0 });
  try {
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <AddCustomerModal v-if="custom_modal === true" />
  <div>
    <el-dialog v-model="order_modal" :width="dialogWidth" class="mt-2">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-cart-plus fa-md mr-3"></i> Buyurtma
          shakillantirish
        </div>
        <el-form
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <!-- //  Asosiy ma'lumotlar -->
          <div
            class="mb-1 col-span-6 p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="font-semibold bg-slate-100 text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Buyurtmachi ma'lumotlari
            </h1>

            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-12">
                <el-form-item
                  label="F.I.O / Korxona nomi"
                  prop="fullname"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.fullname"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @change="ChangeCustomerFullname($event)"
                    :no-data-text="'Mijoz topilmadi'"
                  >
                    <template #header>
                      <div class="p-1 w-full bg-white">
                        <el-input
                          v-model="filter.fullname"
                          placeholder="F.I.O bo‘yicha izlash..."
                          size="smal"
                          clearable
                          class="w-full"
                          @input="FilterByFullname"
                        />
                      </div>
                    </template>
                    <template #prefix>
                      <i
                        @click.stop="AddCustomeModal()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in filteredCustomers"
                      :key="item._id"
                      :label="item.fullname"
                      :value="item._id"
                    >
                      <template #default>
                        <div
                          class="flex justify-between items-center w-full text-[12px]"
                        >
                          <!-- Fullname -->
                          <span
                            class="text-[14px] font-semibold flex items-center"
                          >
                            <i
                              class="fa-solid fa-user mr-1 text-gray-600 mr-2"
                            ></i>
                            {{ item.fullname }}
                          </span>

                          <!-- Address -->
                          <span class="ml-4 text-green-700 flex items-center">
                            <i
                              class="fa-solid fa-location-dot text-green-500 fa-lg mr-2"
                            ></i>
                            {{
                              item.address.region ? item.address.region : "-"
                            }},
                            {{
                              item.address.district
                                ? item.address.district
                                : "-"
                            }},
                            {{
                              item.address.neighborhoods
                                ? item.address.neighborhoods
                                : "-"
                            }},
                            {{
                              item.address.street ? item.address.street : "-"
                            }}
                          </span>

                          <!-- Phone -->
                          <span
                            class="ml-4 text-blue-500 font-semibold flex items-center"
                          >
                            <i class="fa-solid fa-phone text-blue-500 mr-2"></i>
                            {{ item.phoneNumber ? item.phoneNumber : "-" }}
                          </span>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- <div class="mb-1 col-span-6">
                <el-form-item label="Kategoryasi" prop="customer.category">
                  <el-select
                    disabled
                    v-model="modal.model.category"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `category` })"
                    @change="ChangeOrderDirection($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `category`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in categoryes"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item label="Artikul" prop="customer.artikul">
                  <el-input
                    disabled
                    required
                    v-model="modal.model.artikul"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-4">
                <el-form-item label="Darajasi" prop="customer.position">
                  <el-select
                    disabled
                    v-model="modal.model.position"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `position` })"
                    @change="ChangeCustomerPosition($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi darajasini qo'shish`,
                            state: `position`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in positions"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Registratsiya vaqti"
                  prop="customer.registeredAt"
                >
                  <el-date-picker
                    disabled
                    v-model="modal.model.registeredAt"
                    type="date"
                    placeholder="..."
                    size="smal"
                    class="w-full"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="INN" prop="customer.inn">
                  <el-input
                    disabled
                    required
                    v-model="modal.model.inn"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    maxlength="9"
                    placeholder="546789878"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Pasport serya"
                  prop="customer.passportNumber"
                >
                  <el-input
                    disabled
                    required
                    v-model="modal.model.passportNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="AB4567898"
                  />
                </el-form-item>
              </div> -->
              <div class="mb-1 col-span-4">
                <el-form-item label="Telefon" prop="customer.phoneNumber">
                  <el-input
                    disabled
                    v-model="modal.model.phoneNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    placeholder="93 _____ __ __"
                    maxlength="17"
                  >
                    <template #prefix>
                      <span>+998</span>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="Viloyat" prop="customer.address.region">
                  <el-select
                    disabled
                    v-model="modal.model.address.region"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @change="ChangeRegion($event)"
                    @click="Type()"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in regions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="Tuman" prop="customer.address.district">
                  <el-select
                    disabled
                    v-model="modal.model.address.district"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeNeighborhood($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in districts"
                      :key="item._id"
                      :label="item.name"
                      :value="item.id"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Mahalla"
                  prop="customer.address.neighborhood"
                >
                  <el-select
                    disabled
                    v-model="modal.model.address.neighborhood"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeNeighborhood($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in neighborhoods"
                      :key="item.districtId"
                      :label="item.name"
                      :value="item.districtId"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="Ko'cha" prop="customer.address.street">
                  <el-select
                    disabled
                    v-model="modal.model.address.street"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeRegion($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in neighborhoods"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="mb-1 col-span-4">
                <el-form-item label="Uy" prop="customer.address.house">
                  <el-input
                    required
                    disabled
                    v-model="modal.model.address.house"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-12">
                <el-form-item label="Qo'shimcha ma'lumot" prop="discription">
                  <el-input
                    disabled
                    type="textarea"
                    v-model="modal.model.discription"
                    placeholder="Bu yerga yozing..."
                    :rows="4"
                    clearable
                  />
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- //  Buyurtma ma’lumotlari -->
          <div
            class="mb-1 col-span-6 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Buyurtma ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Mahsulot nomi"
                  prop="product.pro_name"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.product.pro_name"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeProductName($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="AddCustomeModall()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in productsOptions"
                      :key="item._id"
                      :label="item.pro_name"
                      :value="item.pro_name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.pro_name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item.id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Mahsulot turi"
                  prop="product.pro_type"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.product.pro_type"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeProductType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="AddCustomeModall()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in productsType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item.id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="mb-1 col-span-2">
                <el-form-item
                  label="Qadoq turi"
                  prop="product.packingType"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.product.packingType"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `packingType` })"
                    @change="ChangePackingType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `packingType`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in pakings"
                      :key="item.id"
                      :label="item.packingType"
                      :value="item.packingType"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.packingType }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-2">
                <el-form-item
                  label="Birligi"
                  prop="product.pro_unit"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.product.pro_unit"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeUnitType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="AddCustomeModall()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in units"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Miqdori"
                  prop="product.pro_quantity"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="model.product.pro_quantity"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="number"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Narxi (sum)"
                  prop="product.pro_price"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="model.product.pro_price"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="number"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Jami (sum)"
                  prop="product.pro_total_price"
                  :rules="rules"
                >
                  <el-input
                    disabled
                    required
                    v-model="model.product.pro_total_price"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="number"
                    placeholder="...."
                  />
                </el-form-item>
              </div>
            </div>
            <div
              class="col-span-12 cursor-pointer flex justify-end text-[12px] font-semibold border-b-[1px] border-purple-600"
            >
              <div
                class="mb-1 col-span-3 w-auto text-center text-white font-semibold bg-purple-600 rounded-sm px-5 py-1 hover:bg-purple-700"
                @click="PlusProduct()"
              >
                <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
              </div>
            </div>
            <el-table
              :header-cell-style="{
                background: '#e8ed90',
                border: '0.2px solid #e1e1e3',
              }"
              border
              stripe
              highlight-current-row
              class="gradient-header-table rounded-none"
              load
              style="font-size: 12px"
              size="small"
              header-align="center"
              empty-text="Mahsulot qo'shilmagan... "
              height="160"
              :data="products"
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
                prop="pro_type"
                label="Turi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-500">
                    {{ row.pro_type }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="pro_name"
                label="Nomi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="packingType"
                label="Qadoq"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              />

              <el-table-column
                prop="pro_quantity"
                label="Miqdori"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-green-600">
                    {{ formatPrice(row.pro_quantity) }} {{ row.pro_unit }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="pro_price"
                label="Narxi (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-600">
                    {{ formatPrice(row.pro_price) }} sum
                  </div></template
                ></el-table-column
              >

              <el-table-column
                prop="pro_total_price"
                label="Jami (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="{ row }"
                  ><div class="text-purple-600">
                    {{ formatPrice(row.pro_total_price) }} sum
                  </div></template
                ></el-table-column
              >

              <el-table-column
                fixed="right"
                prop="id"
                label=""
                :min-width="60"
                :max-width="100"
                header-align="center"
                align="center"
              >
                <template #default="scope">
                  <router-link
                    to=""
                    @click="DeleteById(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <div class="bg-white p-2 rounded-md flex justify-end">
              <div
                class="mb-1 col-span-12 w-full flex justify-end text-purple-600 font-semibold bg-purple-100 rounded-md p-2"
              >
                Jami :
                {{ formatPrice(pro_total_price) }} sum
              </div>
            </div>
          </div>
        </el-form>

        <div class="flex justify-end bg-[#e8eded] p-2 rounded">
          <el-button
            @click="PlusValidate(formRef)"
            style="
              width: 190px;
              background-color: #36d887;
              color: white;
              border: none;
              cursor: pointer;
              padding: 15px;
            "
          >
            <i class="fa-solid fa-check mr-2 fa-md"></i>Saqlash
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.image-uploader-card {
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.image-uploader {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 10px;
}
#map {
  height: 300px;
  width: 100%;
}
.gradient-header-table ::v-deep .el-table__header {
  background-image: linear-gradient(
    to right,
    #3b82f6,
    #6366f1
  ); /* from-blue-500 to-indigo-500 */
  color: white;
}
</style>
