<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Faqat xabar (Toast) uchun

// --- STORES ---
import { RoleStore } from "../../../../stores/Admin/role.store";
import { PermissionStore } from "../../../../stores/Admin/permission.store";

// --- CUSTOM UI COMPONENTS ---
import BaseModal from "../../../../UI/Modal.vue"; // Modal.vue
import Button from "../../../../UI/Button.vue";   // Button.vue
// Select.vue bu yerda shart emas, chunki Permissionlar uchun maxsus ro'yxat qildik

const store_role = RoleStore();
const store_permission = PermissionStore();

const { role_modal, model } = storeToRefs(store_role);
const { permissions } = storeToRefs(store_permission);

// --- STATE ---
const errors = reactive({});
const searchQuery = ref(""); // Permission qidirish uchun

// --- COMPUTED ---
// Ruxsatlarni qidirish filteri
const filteredPermissions = computed(() => {
  if (!searchQuery.value) return permissions.value;
  const query = searchQuery.value.toLowerCase();
  return permissions.value.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.value.toLowerCase().includes(query)
  );
});

// Tanlangan ruxsatlar soni
const selectedCount = computed(() => model.value.permissions?.length || 0);

// --- LOGIC ---

// Permission tanlash/o'chirish (Toggle)
const togglePermission = (id) => {
  if (!model.value.permissions) model.value.permissions = [];
  
  const index = model.value.permissions.indexOf(id);
  if (index === -1) {
    model.value.permissions.push(id);
  } else {
    model.value.permissions.splice(index, 1);
  }
};

// Ruxsat tanlanganmi tekshirish
const isSelected = (id) => {
  return model.value.permissions?.includes(id);
};

// Modalni yopish
const handleClose = () => {
  store_role.role_modal = false;
  errors.value = {};
  searchQuery.value = "";
  // Agar storeda reset metodi bo'lmasa, shu yerda tozalash kerak:
  // model.value = { name: '', value: '', description: '', permissions: [] }; 
};

// Saqlash
const saveRole = () => {
  // Validatsiya
  errors.name = !model.value.name;
  errors.value = !model.value.value;
  
  if (errors.name || errors.value) {
    ElMessage.warning("Majburiy maydonlarni to'ldiring!");
    return;
  }

  if (!model.value.permissions || model.value.permissions.length === 0) {
    ElMessage.warning("Kamida bitta ruxsat biriktirilishi kerak!");
    return;
  }

  store_role.Create(model.value);
  handleClose();
};

// Component yuklanganda ruxsatlarni olib kelish
onMounted(() => {
  store_permission.GetAll(); 
});
</script>

<template>
  <BaseModal
    v-model="role_modal"
    title="Rol yaratish"
    subtitle="Yangi foydalanuvchi roli va huquqlari"
    icon="fa-solid fa-shield-halved"
    width="max-w-5xl"
    @close="handleClose"
  >
    
    <div class="grid grid-cols-12 gap-6 h-[500px]">
      
      <div class="col-span-12 md:col-span-4 flex flex-col gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
            Asosiy Ma'lumotlar
          </h4>
          
          <div class="space-y-4">
            <div>
              <label class="form-label required">Rol nomi</label>
              <input 
                v-model="model.name" 
                type="text" 
                class="form-input" 
                :class="{'!border-rose-500': errors.name}"
                placeholder="Masalan: Admin" 
              />
              <span v-if="errors.name" class="form-error">Nom kiritilishi shart</span>
            </div>

            <div>
              <label class="form-label required">Kalit (Value)</label>
              <input 
                v-model="model.value" 
                type="text" 
                class="form-input font-mono text-indigo-600" 
                :class="{'!border-rose-500': errors.value}"
                placeholder="admin_full" 
              />
              <span v-if="errors.value" class="form-error">Kalit kiritilishi shart</span>
            </div>

            <div>
              <label class="form-label">Izoh</label>
              <textarea 
                v-model="model.description" 
                rows="6" 
                class="form-input resize-none" 
                placeholder="Bu rol qanday vazifalarni bajarishi haqida qisqacha..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-8 flex flex-col h-full">
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden shadow-inner">
          
          <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
             <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                   <i class="fa-solid fa-key"></i>
                </div>
                <div>
                   <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200">Ruxsatlar</h4>
                   <p class="text-[10px] text-slate-400 font-medium">Tanlangan: <span class="text-emerald-600 font-bold">{{ selectedCount }}</span> ta</p>
                </div>
             </div>

             <div class="relative w-48">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Qidirish..." 
                  class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                <i class="fa-solid fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
             </div>
          </div>

          <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
             
             <div v-if="filteredPermissions.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
                <i class="fa-solid fa-filter-circle-xmark text-3xl mb-2 opacity-50"></i>
                <span class="text-sm">Ruxsatlar topilmadi</span>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <div 
                 v-for="perm in filteredPermissions" 
                 :key="perm._id"
                 @click="togglePermission(perm._id)"
                 class="group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none bg-white dark:bg-slate-800"
                 :class="isSelected(perm._id) 
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-sm ring-1 ring-emerald-500/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50'"
               >
                  <div 
                     class="mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0"
                     :class="isSelected(perm._id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white dark:bg-slate-700'"
                  >
                     <i v-if="isSelected(perm._id)" class="fa-solid fa-check text-white text-[10px]"></i>
                  </div>
                  
                  <div class="flex-1 overflow-hidden">
                     <div class="text-xs font-bold truncate" :class="isSelected(perm._id) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'">
                        {{ perm.name }}
                     </div>
                     <div class="text-[10px] font-mono mt-0.5 truncate" :class="isSelected(perm._id) ? 'text-emerald-600/70' : 'text-slate-400'">
                        {{ perm.value }}
                     </div>
                  </div>
               </div>
             </div>

          </div>
          <div class="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 text-center">
             Jami {{ permissions.length }} ta ruxsatdan {{ filteredPermissions.length }} tasi ko'rsatilmoqda
          </div>

        </div>
      </div>

    </div>

    <template #footer>
       <div class="flex justify-end gap-3 w-full">
          <Button variant="secondary" @click="handleClose">Bekor qilish</Button>
          <Button 
            variant="primary" 
            left-icon="fa-solid fa-check" 
            @click="saveRole"
          >
            Saqlash
          </Button>
       </div>
    </template>

  </BaseModal>
</template>

<style scoped>
/* Utility Classes */
.required::after { content: " *"; @apply text-rose-500; }
.form-label { @apply block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none; }
.form-error { @apply text-[10px] text-rose-500 mt-1 block font-medium; }

/* Custom Scrollbar for Permission List */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300 dark:bg-slate-600 rounded-full; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { @apply bg-slate-400; }
</style>