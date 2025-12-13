<script setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Faqat xabarlar uchun

// --- STORES ---
import { PermissionStore } from "../../../../stores/Admin/permission.store";

// --- CUSTOM UI COMPONENTS ---
import BaseModal from "../../../../UI/Modal.vue";
import Button from "../../../../UI/Button.vue";

const store_permission = PermissionStore();
const { permission_modal, model } = storeToRefs(store_permission);

// --- STATE ---
const errors = reactive({});

// --- LOGIC ---

const handleClose = () => {
  store_permission.permission_modal = false;
  errors.value = {};
  // Modelni tozalash kerak bo'lsa:
  // model.value = { name: '', value: '', description: '' };
};

const savePermission = () => {
  // Oddiy validatsiya
  errors.name = !model.value.name;
  errors.value = !model.value.value;

  if (errors.name || errors.value) {
    ElMessage.warning("Majburiy maydonlarni to'ldiring!");
    return;
  }

  store_permission.CreatePermission(model.value);
  handleClose();
};
</script>

<template>
  <BaseModal
    v-model="permission_modal"
    title="Ruxsat qo'shish"
    subtitle="Tizimga yangi ruxsat (permission) kiritish"
    icon="fa-solid fa-shield-halved"
    width="max-w-2xl"
    @close="handleClose"
  >
    
    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div class="grid grid-cols-12 gap-5">
        
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Ruxsat nomi</label>
          <input 
            v-model="model.name" 
            type="text" 
            class="form-input" 
            :class="{'!border-rose-500': errors.name}"
            placeholder="Masalan: Foydalanuvchilarni ko'rish" 
          />
          <span v-if="errors.name" class="text-[10px] text-rose-500 mt-1">Nom kiritilishi shart</span>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Qiymat (Key)</label>
          <input 
            v-model="model.value" 
            type="text" 
            class="form-input font-mono text-indigo-600" 
            :class="{'!border-rose-500': errors.value}"
            placeholder="user:read" 
          />
          <span v-if="errors.value" class="text-[10px] text-rose-500 mt-1">Qiymat kiritilishi shart</span>
        </div>

        <div class="col-span-12">
          <label class="form-label">Qo'shimcha ma'lumot</label>
          <textarea 
            v-model="model.description" 
            rows="4" 
            class="form-input resize-none" 
            placeholder="Ushbu ruxsat nima uchun kerakligini yozing..."
          ></textarea>
        </div>

      </div>
    </div>

    <template #footer>
       <div class="flex justify-end gap-3 w-full">
          <Button variant="danger" left-icon="fas fa-xmark" @click="handleClose">Bekor qilish</Button>
          <Button 
            variant="primary" 
            left-icon="fa-solid fa-check" 
            @click="savePermission"
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
</style>