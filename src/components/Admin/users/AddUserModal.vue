<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { UserStore } from "../../../stores/Admin/user.store";

// --- CUSTOM UI COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Button from "../../../UI/Button.vue";
import Select from "../../../UI/Select.vue";
import Input from "../../../UI/Input.vue"; // Agar Input komponenti bo'lsa

const store_user = UserStore();
const { is_modal, is_update, model, departments, permissions, roles } = storeToRefs(store_user);

const actionsOptions = [
  { label: "Create", value: 1 },
  { label: "Read", value: 2 },
  { label: "Update", value: 3 },
  { label: "Delete", value: 4 },
];

const handleSave = async () => {
  // Custom validatsiya mantiqi (oddiy tekshiruv)
  if (!model.value.username || (!is_update.value && !model.value.password)) {
    alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
    return;
  }

  if (is_update.value) {
    store_user.UpdateUser(model.value);
  } else {
    store_user.CreateUser(model.value);
  }
};

const modalTitle = computed(() => 
  is_update.value ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"
);
</script>

<template>
  <Modal 
    v-model="is_modal" 
    :title="modalTitle" 
     width="max-w-[85vw]"
  >
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 p-2">
      
      <div class="col-span-12 md:col-span-6">
        <label class="form-label">Username <span class="text-rose-500">*</span></label>
        <Input 
          v-model="model.username"
          placeholder="Username kiriting..."
          class="w-full"
        />
      </div>

      <div v-if="!is_update" class="col-span-12 md:col-span-6">
        <label class="form-label">Password <span class="text-rose-500">*</span></label>
        <Input 
          v-model="model.password"
          type="password"
          placeholder="Parol yarating..."
          class="w-full"
        />
      </div>

      <div class="col-span-12 md:col-span-6">
        <label class="form-label">Department</label>
        <Select 
          v-model="model.department"
          :options="departments"
          option-label="name"
          option-value="name"
          placeholder="Bo'limni tanlang"
          class="w-full"
        />
      </div>

      <div class="col-span-12 md:col-span-6">
        <label class="form-label">Role</label>
        <Select 
          v-model="model.role"
          :options="roles"
          option-label="role_name"
          option-value="value"
          placeholder="Rolni belgilang"
          class="w-full"
        />
      </div>

      <!-- <div class="col-span-12 md:col-span-6">
        <label class="form-label">Permissions</label>
        <Select 
          v-model="model.permissions"
          :options="permissions"
          option-label="permission_name"
          option-value="permission_name"
          multiple
          placeholder="Ruxsatlarni tanlang"
          class="w-full"
        />
      </div>

      <div class="col-span-12 md:col-span-6">
        <label class="form-label">Actions</label>
        <Select 
          v-model="model.actions"
          :options="actionsOptions"
          multiple
          placeholder="Amallarni tanlang"
          class="w-full"
        />
      </div> -->

    </div>

    <template #footer>
      <div class="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
        <Button 
          variant="secondary" 
          @click="is_modal = false"
        >
          Bekor qilish
        </Button>
        <Button 
          variant="primary" 
          left-icon="fa-solid fa-cloud-arrow-up"
          @click="handleSave"
        >
          {{ is_update ? 'O\'zgarishlarni saqlash' : 'Foydalanuvchini yaratish' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.form-label {
  @apply block text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1;
}

/* Modal ichidagi grid masofalari uchun */
:deep(.custom-modal-content) {
  @apply overflow-visible;
}
</style>