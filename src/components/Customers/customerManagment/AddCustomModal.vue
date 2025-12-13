<script setup>
import { onMounted, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Faqat xabarlar uchun

// --- STORES ---
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { AddressStore } from "../../../stores/Helpers/address/address.store";

// --- CUSTOM UI COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Select from "../../../UI/Select.vue";
import Button from "../../../UI/Button.vue";
import MapView from "../../../components/Customers/customerManagment/MapView.vue"; // Xarita komponenti

const store_address = AddressStore();
const store_customers = CustomerManagmentStore();

const { regions, districts, neighborhoods } = storeToRefs(store_address);
const { custom_modal, modal, TitleAction } = storeToRefs(store_customers);

// --- STATE ---
const isMapOpen = ref(false); // Xarita modali uchun state
const errors = reactive({});

// Static Options
const positions = ref([
  { _id: 1, name: "Bronza" },
  { _id: 2, name: "Kumush" },
  { _id: 3, name: "Tilla" },
]);

// --- LOGIC ---

// Modalni yopish
const handleClose = () => {
  store_customers.custom_modal = false;
  errors.value = {};
  // Formani tozalash logikasi (agar store'da reset metodi bo'lmasa, qo'lda tozalash kerak bo'lishi mumkin)
};

// Validatsiya va Saqlash
const saveCustomer = async () => {
  // Oddiy validatsiya
  errors.fullname = !modal.value.model.fullname;
  errors.phoneNumber = !modal.value.model.phoneNumber || modal.value.model.phoneNumber.length < 9;
  errors.region = !modal.value.model.address.region;
  errors.district = !modal.value.model.address.district;

  if (errors.fullname || errors.phoneNumber || errors.region || errors.district) {
    ElMessage.error("Majburiy maydonlarni to'ldiring!");
    return;
  }

  // Saqlash
  await store_customers.Create(modal.value.model);
  handleClose();
};

// Manzil o'zgarishi (Cascading Select)
const handleRegionChange = async (regionObj) => {
  if (regionObj) {
    modal.value.model.address.region = regionObj.name;
    // Tumanlarni yuklash
    await store_address.Districts(regionObj.id); 
    // Keyingi selectlarni tozalash
    modal.value.model.address.district = "";
    modal.value.model.address.neighborhood = "";
  }
};

const handleDistrictChange = async (districtObj) => {
  if (districtObj) {
    modal.value.model.address.district = districtObj.name;
    // Mahallalarni yuklash
    await store_address.Neighborhoods(districtObj.id);
    modal.value.model.address.neighborhood = "";
  }
};

const handleNeighborhoodChange = (neighborhoodObj) => {
  if (neighborhoodObj) {
    modal.value.model.address.neighborhood = neighborhoodObj.name;
  }
};

// Xarita logikasi
const openMap = () => { isMapOpen.value = true; };
const closeMap = () => { isMapOpen.value = false; };

const handleLocationSelected = (coords) => {
  modal.value.model.location.lat = coords.lat;
  modal.value.model.location.long = coords.long;
  modal.value.model.is_location = true; // Checkboxni belgilash
  ElMessage.success("Manzil belgilandi!");
  closeMap();
};

// Input formatter (Faqat raqam)
const formatArtikul = (e) => {
  modal.value.model.artikul = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
};

// Yangi option qo'shish (Mock)
const handleAddOption = (type) => {
  ElMessage.info(`${type} qo'shish funksiyasi...`);
};

onMounted(() => {
  store_address.Regions(); // Regionlarni yuklash
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
       <MapView @locationSelected="handleLocationSelected" />
    </div>
    <template #footer>
       <Button variant="secondary" @click="closeMap">Yopish</Button>
    </template>
  </Modal>

  <Modal
    v-model="custom_modal"
    :title="TitleAction.title || 'Mijoz ma\'lumotlari'"
    subtitle="Yangi mijoz qo'shish yoki tahrirlash"
    icon="fa-solid fa-user-plus"
    width="max-w-5xl"
    @close="handleClose"
  >
    
    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 z-50 relative">
      <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Asosiy Ma'lumotlar
      </h4>
      <div class="grid grid-cols-12 gap-5">
        
        <div class="col-span-12 sm:col-span-8">
          <label class="form-label required">F.I.O / Korxona nomi</label>
          <input 
            v-model="modal.model.fullname" 
            type="text" 
            class="form-input" 
            :class="{'!border-rose-500': errors.fullname}"
            placeholder="Ism Familiya" 
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label required">Telefon</label>
          <div class="relative">
             <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+998</span>
             <input 
               v-model="modal.model.phoneNumber" 
               type="text" 
               class="form-input pl-14" 
               :class="{'!border-rose-500': errors.phoneNumber}"
               placeholder="90 123 45 67" 
               maxlength="9"
             />
          </div>
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Artikul (ID)</label>
          <input 
            v-model="modal.model.artikul" 
            @input="formatArtikul"
            type="text" 
            class="form-input" 
            placeholder="0001" 
            maxlength="4"
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Mijoz Darajasi</label>
          <Select
            v-model="modal.model.position"
            :options="positions"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            allowAdd
            @add="handleAddOption('position')"
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Registratsiya sanasi</label>
          <input 
            v-model="modal.model.registeredAt" 
            type="date" 
            class="form-input" 
          />
        </div>
      </div>
    </div>

    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6 z-40 relative">
      <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
        Manzil va Joylashuv
      </h4>
      <div class="grid grid-cols-12 gap-5">
        
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label required">Viloyat</label>
          <Select
            :modelValue="modal.model.address.region"
            :options="regions"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            @update:modelValue="(val) => handleRegionChange(regions.find(r => r.name === val))"
            :error="!!errors.region"
          />
        </div>

        <div class="col-span-12 sm:col-span-4">
          <label class="form-label required">Tuman</label>
          <Select
            :modelValue="modal.model.address.district"
            :options="districts"
            labelKey="name"
            valueKey="name"
            placeholder="Tanlang..."
            @update:modelValue="(val) => handleDistrictChange(districts.find(d => d.name === val))"
            :error="!!errors.district"
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
          <input v-model="modal.model.address.street" type="text" class="form-input" placeholder="Navoiy ko'chasi..." />
        </div>
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Uy raqami</label>
          <input v-model="modal.model.address.house" type="text" class="form-input" placeholder="7-uy" />
        </div>

        <div class="col-span-12 pt-2 border-t border-slate-200 dark:border-slate-600 mt-2">
           <div class="flex flex-wrap items-center gap-4">
              <Button @click="openMap" variant="secondary" left-icon="fa-solid fa-map-location-dot" class="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100">
                 Xaritadan belgilash
              </Button>

              <div v-if="modal.model.location.lat" class="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500">
                 <span>Lat: <b class="text-slate-700 dark:text-slate-300">{{ modal.model.location.lat }}</b></span>
                 <span class="w-px h-3 bg-slate-300"></span>
                 <span>Long: <b class="text-slate-700 dark:text-slate-300">{{ modal.model.location.long }}</b></span>
              </div>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                 <input type="checkbox" v-model="modal.model.is_location" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300">
                 <span class="text-sm text-slate-600 dark:text-slate-400 font-medium">Manzil aniqlandi</span>
              </label>
           </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm z-30 relative">
      <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Qo'shimcha
      </h4>
      <div>
        <label class="form-label">Izoh</label>
        <textarea 
          v-model="modal.model.discription" 
          rows="3" 
          class="form-input" 
          placeholder="Mijoz haqida qo'shimcha ma'lumotlar..."
        ></textarea>
      </div>
    </div>

    <div class="h-20"></div>

    <template #footer>
       <Button variant="secondary" @click="handleClose">Bekor qilish</Button>
       <Button 
         :variant="TitleAction.action === 'create' ? 'primary' : 'success'" 
         left-icon="fa-solid fa-check" 
         @click="saveCustomer"
       >
         {{ TitleAction.action === 'create' ? "Saqlash" : "Yangilash" }}
       </Button>
    </template>

  </Modal>
</template>

<style scoped>
.required::after { content: " *"; @apply text-rose-500; }
.form-label { @apply block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none; }
textarea.form-input { @apply resize-none; }
</style>