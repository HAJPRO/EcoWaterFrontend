<script setup>
import { ref, computed } from "vue";
import { useScreen } from "@/utils/TableOptions/useTableOptions"; // Yo'lni loyihangizga moslang

// --- PROPS ---
const props = defineProps({
  // Tablar ro'yxati: { id, label, key, icon }
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  // Aktiv tab IDsi (v-model orqali keladi)
  modelValue: {
    type: [Number, String],
    required: true
  },
  // Sonlar obyekti: { 'all': 10, 'newdocs': 5 }
  counts: {
    type: Object,
    default: () => ({})
  },
  // Mobile search placeholder
  searchPlaceholder: {
    type: String,
    default: "Qidirish..."
  }
});

// --- EMITS ---
const emit = defineEmits(['update:modelValue', 'change']);

const { isMobile } = useScreen();
const search = ref("");

// --- ACTIONS ---
const handleTabClick = (id) => {
  if (props.modelValue !== id) {
    emit('update:modelValue', id); // v-model ni yangilash
    emit('change', id); // Qo'shimcha hodisa (masalan, API chaqirish uchun)
  }
};

// --- COMPUTED (Mobile Filter) ---
const filteredTabs = computed(() =>
  props.tabs.filter((t) =>
    t.label.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<template>
  <div class="w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 px-2 transition-colors duration-300">
    
    <div v-if="!isMobile" class="w-full">
      <div class="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 px-1 relative">
        <button
          v-for="tab in props.tabs"
          :key="tab.id"
          @click="handleTabClick(tab.id)"
          class="group relative flex items-center gap-2 py-3 px-1 text-[13px] font-medium transition-all duration-300 outline-none"
          :class="[
            modelValue === tab.id
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          ]"
        >
          <i 
            v-if="tab.icon"
            :class="[tab.icon, modelValue === tab.id ? 'transform scale-110' : 'opacity-70 group-hover:opacity-100']"
            class="text-md mb-0.5 transition-transform duration-300"
          ></i>

          <span>{{ tab.label }}</span>

          <span
            v-if="counts && counts[tab.key] > 0"
            class="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors"
            :class="[
              modelValue === tab.id
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
            ]"
          >
            {{ counts[tab.key] }}
          </span>

          <span 
            class="absolute bottom-0 left-0 w-full h-[2px] rounded-t-sm transition-all duration-300 ease-in-out"
            :class="modelValue === tab.id ? 'bg-indigo-600 dark:bg-indigo-500 scale-x-100 opacity-100' : 'bg-transparent scale-x-0 opacity-0'"
          ></span>
        </button>
      </div>
    </div>

    <div v-else class="p-2">
      <el-select
        :model-value="modelValue"
        @update:model-value="handleTabClick"
        :placeholder="props.searchPlaceholder"
        class="w-full underline-mobile-select"
        size="large"
      >
        <template #header>
            <div class="p-2">
                <el-input v-model="search" size="small" :placeholder="props.searchPlaceholder" class="w-full">
                    <template #prefix><i class="fa-solid fa-search text-slate-400"></i></template>
                </el-input>
            </div>
        </template>
        
        <el-option
          v-for="tab in filteredTabs"
          :key="tab.id"
          :label="tab.label"
          :value="tab.id"
        >
           <div class="flex items-center justify-between w-full">
               <span class="font-medium">{{ tab.label }}</span>
               <span v-if="counts && counts[tab.key]" class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md text-slate-500">
                  {{ counts[tab.key] }}
               </span>
           </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<style scoped>
/* Mobile Select Styling overrides */
:deep(.underline-mobile-select .el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
}
:deep(.underline-mobile-select .el-input__wrapper.is-focus) {
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5 !important;
}
.dark :deep(.underline-mobile-select .el-input__wrapper) {
    border-color: #334155;
}
/* Scrollbar removal if needed for extensive tabs */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>