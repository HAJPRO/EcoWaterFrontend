<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Faqat xabarlar uchun

// --- STORES ---
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";
import { RoleStore } from "../../../stores/Admin/role.store.js";
import { AddressStore } from "../../../stores/Helpers/address/address.store";
import { AuthStore } from "../../../stores/Auth/auth.js";

// --- CUSTOM UI COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Select from "../../../UI/Select.vue";
import Button from "../../../UI/Button.vue";
import MapView from "../../Customers/customerManagment/MapView.vue";

const store_address = AddressStore();
const store_employee = EmployeeManagmentStore();
const store_auth = AuthStore();
const store_role = RoleStore();

const { regions, districts, neighborhoods } = storeToRefs(store_address);
const { employee_modal, modal_action, cardId, modal } = storeToRefs(store_employee);
const { roles } = storeToRefs(store_role);

// --- STATE ---
const isMapOpen = ref(false);
const errors = reactive({});

// Static Options
const departments = ref([
  { id: 1, name: "Adminstratsiya" },
  { id: 2, name: "Sotuv" },
  { id: 3, name: "Buhgalterya" },
  { id: 4, name: "Kadrlar" },
  { id: 5, name: "Ombor" },
  { id: 6, name: "Logistika" },
  { id: 7, name: "Ishlab chiqarish" },
]);

const positions = ref([
  { id: 1, name: "Direktor" },
  { id: 2, name: "Buhgalter" },
  { id: 3, name: "Menejer" },
  { id: 4, name: "Sotuvchi" },
  { id: 5, name: "Omborchi" },
  { id: 6, name: "Haydovchi" },
  { id: 7, name: "Admin" },
]);

const carTypes = ref([
  { id: 1, name: "Damas" },
  { id: 2, name: "Labo" },
  { id: 3, name: "Cobalt" },
]);

const carColors = ref([
  { id: 1, name: "Oq" },
  { id: 2, name: "Qora" },
  { id: 3, name: "Metalika" },
]);

// --- LOGIC ---

const handleClose = () => {
  store_employee.employee_modal = false;
  errors.value = {};
};

// Manzil o'zgarishi
const handleRegionChange = async (regionObj) => {
  if (regionObj) {
    modal.value.model.address.region = regionObj.name;
    await store_address.Districts(regionObj.id);
    modal.value.model.address.district = ""; 
    modal.value.model.address.neighborhood = "";
  }
};

const handleDistrictChange = async (districtObj) => {
  if (districtObj) {
    modal.value.model.address.district = districtObj.name;
    await store_address.Neighborhoods(districtObj.id);
    modal.value.model.address.neighborhood = "";
  }
};

const handleNeighborhoodChange = (neighborhoodObj) => {
  if (neighborhoodObj) {
    modal.value.model.address.neighborhood = neighborhoodObj.name;
  }
};

// Xarita
const openMap = () => { isMapOpen.value = true; };
const closeMap = () => { isMapOpen.value = false; };

const handleLocation = (coords) => {
  modal.value.model.location.lat = coords.lat;
  modal.value.model.location.long = coords.long;
  modal.value.model.is_location = true;
  ElMessage.success("Manzil belgilandi!");
  closeMap();
};

// Validatsiya va Saqlash
const saveEmployee = async () => {
  // // Oddiy validatsiya
  // errors.fullname = !modal.value.model.fullname;
  // errors.department = !modal.value.model.department;
  // errors.position = !modal.value.model.position;
  // errors.username = !modal.value.model.username;
  // errors.password = !modal.value.model.password;
  // errors.roles = !modal.value.model.roles || modal.value.model.roles.length === 0;

  // if (Object.values(errors).some(Boolean)) {
  //   ElMessage.error("Majburiy maydonlarni to'ldiring!");
  //   return;
  // }

  if (modal_action.value.action === "create") {
    await store_auth.register(modal.value.model);
  } else {
    await store_auth.update({ id: cardId.value, model: modal.value.model });
  }
  handleClose();
};

// Mock Add Option
const handleAddOption = (type) => ElMessage.info(`${type} qo'shish...`);

onMounted(() => {
  store_role.GetAll();
  store_address.Regions();
});
</script>

<template>
  <Modal 
    v-model="isMapOpen" 
    title="Manzilni xaritadan tanlang" 
    width="max-w-7xl" 
    icon="fa-solid fa-map-location-dot"
    @close="closeMap"
  >
    <div class="h-[600px] w-full bg-slate-100 rounded-xl overflow-hidden">
       <MapView @locationSelected="handleLocation" />
    </div>
    <template #footer>
       <Button variant="secondary" @click="closeMap">Yopish</Button>
    </template>
  </Modal>

  <Modal
    v-model="employee_modal"
    :title="modal_action.title || 'Xodim ma\'lumotlari'"
    subtitle="Yangi xodim qo'shish yoki tahrirlash"
    icon="fa-solid fa-user-plus"
    width="max-w-5xl"
    @close="handleClose"
  >
    
    <div class="relative z-50 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Asosiy Ma'lumotlar
      </h4>
      <div class="grid grid-cols-12 gap-5">
        
        <div class="col-span-12 sm:col-span-12">
          <label class="form-label required">F.I.O (To'liq)</label>
          <input 
            v-model="modal.model.fullname" 
            type="text" 
            class="form-input" 
            :class="{'!border-rose-500': errors.fullname}"
            placeholder="Familiya Ism Sharif" 
          />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Bo'lim</label>
          <Select
            v-model="modal.model.department"
            :options="departments"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            allowAdd
            :error="!!errors.department"
            @add="handleAddOption('department')"
          />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Lavozim</label>
          <Select
            v-model="modal.model.position"
            :options="positions"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            allowAdd
            :error="!!errors.position"
            @add="handleAddOption('position')"
          />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Tizim roli</label>
          <Select
            v-model="modal.model.roles" 
            :options="roles"
            labelKey="name"
            valueKey="_id"
            placeholder="Tanlang..."
            :error="!!errors.roles"
          />
          </div>

        <div class="col-span-12 sm:col-span-6">
          <label class="form-label">Ishga kirish sanasi</label>
          <input 
            v-model="modal.model.registeredAt" 
            type="date" 
            class="form-input" 
          />
        </div>
      </div>
    </div>

    <div class="relative z-40 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
      <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
        Kirish Ma'lumotlari
      </h4>
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Login</label>
          <input 
            v-model="modal.model.username" 
            type="text" 
            class="form-input" 
            :class="{'!border-rose-500': errors.username}"
            placeholder="user123" 
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Parol</label>
          <input 
            v-model="modal.model.password" 
            type="text" 
            class="form-input" 
            :class="{'!border-rose-500': errors.password}"
            placeholder="********" 
          />
        </div>
      </div>
    </div>

    <div class="relative z-30 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Manzil va Joylashuv
      </h4>
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Viloyat</label>
          <Select
            :modelValue="modal.model.address.region"
            :options="regions"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            @update:modelValue="(val) => handleRegionChange(regions.find(r => r.name === val))"
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Tuman</label>
          <Select
            :modelValue="modal.model.address.district"
            :options="districts"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            @update:modelValue="(val) => handleDistrictChange(districts.find(d => d.name === val))"
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Mahalla</label>
          <Select
            :modelValue="modal.model.address.neighborhood"
            :options="neighborhoods"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            @update:modelValue="(val) => handleNeighborhoodChange(neighborhoods.find(n => n.name === val))"
          />
        </div>

        <div class="col-span-12 sm:col-span-8">
          <label class="form-label">Ko'cha</label>
          <input v-model="modal.model.address.street" type="text" class="form-input" />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Uy raqami</label>
          <input v-model="modal.model.address.house" type="number" class="form-input" />
        </div>

        <div class="col-span-12 pt-2 border-t border-slate-200 dark:border-slate-600 mt-2">
           <div class="flex flex-wrap items-center gap-4">
              <Button @click="openMap" variant="secondary" left-icon="fa-solid fa-map-location-dot" class="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100">
                 Xaritadan belgilash
              </Button>

              <div v-if="modal.model.location.lat" class="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-slate-500">
                 <span>{{ modal.model.location.lat }}</span> / <span>{{ modal.model.location.long }}</span>
              </div>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                 <input type="checkbox" v-model="modal.model.is_location" class="w-4 h-4 rounded text-indigo-600 border-gray-300">
                 <span class="text-sm text-slate-600 font-medium">Manzil aniqlandi</span>
              </label>
           </div>
        </div>
      </div>
    </div>

    <div v-if="modal.model.position === 'Haydovchi'" class="relative z-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
      <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
        Haydovchi ma'lumotlari
      </h4>
      <div class="grid grid-cols-12 gap-5">
         <div class="col-span-12 sm:col-span-4">
            <label class="form-label">Mashina rusumi</label>
            <Select v-model="modal.model.carType" :options="carTypes" labelKey="name" valueKey="name" allowAdd @add="handleAddOption('carType')" />
         </div>
         <div class="col-span-12 sm:col-span-4">
            <label class="form-label">Mashina rangi</label>
            <Select v-model="modal.model.carColor" :options="carColors" labelKey="name" valueKey="name" allowAdd @add="handleAddOption('carColor')" />
         </div>
         <div class="col-span-12 sm:col-span-4">
            <label class="form-label">Davlat raqami</label>
            <input v-model="modal.model.carNumber" type="text" class="form-input uppercase" placeholder="80 A 777 AA" />
         </div>
      </div>
    </div>

    <div class="h-20"></div>

    <template #footer>
       <Button variant="danger" left-icon="fas fa-xmark" @click="handleClose">Bekor qilish</Button>
       <Button 
         :variant="modal_action.action === 'create' ? 'primary' : 'success'" 
         left-icon="fa-solid fa-check" 
         @click="saveEmployee"
       >
         {{ modal_action.action === 'create' ? "Saqlash" : "Yangilash" }}
       </Button>
    </template>

  </Modal>
</template>

<style scoped>
.required::after { content: " *"; @apply text-rose-500; }
.form-label { @apply block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none; }
</style>