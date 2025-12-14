<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Object],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Tanlang...' },
  labelKey: { type: String, default: 'name' },
  valueKey: { type: String, default: 'name' },
  allowAdd: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
});

// 🟢 O'ZGARISH: 'change' eventi qo'shildi
const emit = defineEmits(['update:modelValue', 'add', 'change']);

const isOpen = ref(false);
const containerRef = ref(null);
const searchInputRef = ref(null);
const searchQuery = ref('');
const activeIndex = ref(-1);

// --- COMPUTED ---
const selectedLabel = computed(() => {
  if (!props.options) return null;
  const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue);
  return selected ? selected[props.labelKey] : null;
});

const filteredOptions = computed(() => {
  if (!props.options) return [];
  if (!searchQuery.value) return props.options;
  
  return props.options.filter(opt => {
    const text = opt[props.labelKey] ? String(opt[props.labelKey]) : "";
    return text.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const highlightMatch = (text) => {
  if (!text) return "";
  const safeText = String(text);
  if (!searchQuery.value) return safeText;
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return safeText.replace(regex, '<span class="text-indigo-600 font-bold bg-indigo-50 rounded-sm px-0.5">$1</span>');
};

// --- ACTIONS ---
const toggle = () => {
  if (isOpen.value) close();
  else open();
};

const open = () => {
  if (props.loading) return;
  isOpen.value = true;
  searchQuery.value = '';
  activeIndex.value = -1;
  
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
  activeIndex.value = -1;
  searchQuery.value = '';
};

// 🟢 O'ZGARISH: Qiymat tanlanganda 'change' eventi ham yuboriladi
const selectOption = (option) => {
  const newValue = option[props.valueKey];
  
  // Modelni yangilash
  emit('update:modelValue', newValue);
  
  // Change eventini yuborish (Parent komponent eshita olishi uchun)
  emit('change', newValue);
  
  close();
};

// 🟢 O'ZGARISH: Tozalash funksiyasi alohida olindi
const handleClear = () => {
  emit('update:modelValue', null);
  emit('change', null); // Tozalanganda ham change ishlaydi
};

const handleAdd = () => {
  if (searchQuery.value.trim()) {
    emit('add', searchQuery.value);
    close();
  }
};

// --- KEYBOARD NAVIGATION ---
const onKeydown = (e) => {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      open();
    }
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (activeIndex.value < filteredOptions.value.length - 1) {
        activeIndex.value++;
        scrollIntoView(activeIndex.value);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (activeIndex.value > 0) {
        activeIndex.value--;
        scrollIntoView(activeIndex.value);
      }
      break;
    case 'Enter':
      e.preventDefault();
      if (activeIndex.value >= 0 && filteredOptions.value[activeIndex.value]) {
        selectOption(filteredOptions.value[activeIndex.value]);
      } else if (props.allowAdd && searchQuery.value) {
        handleAdd();
      }
      break;
    case 'Escape':
      e.preventDefault();
      close();
      break;
    case 'Tab':
      close();
      break;
  }
};

const scrollIntoView = (index) => {
  const list = document.getElementById('options-list');
  const element = list?.children[index];
  if (element) {
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
};

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    close();
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="relative w-full text-sm z-50" ref="containerRef" @keydown="onKeydown">
    
    <div 
      @click="toggle"
      class="group relative w-full bg-white dark:bg-slate-800 border rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all duration-200 select-none shadow-sm"
      :class="[
        isOpen 
          ? 'border-indigo-500 ring-4 ring-indigo-500/10' 
          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500',
        error ? '!border-rose-500' : ''
      ]"
      tabindex="0"
    >
      <div class="flex-1 truncate pr-2">
        <span v-if="selectedLabel" class="font-medium text-slate-700 dark:text-slate-200">
          {{ selectedLabel }}
        </span>
        <span v-else class="text-slate-400">
          {{ placeholder }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button 
          v-if="modelValue && !isOpen && !loading"
          @click.stop="handleClear"
          class="hidden group-hover:flex w-5 h-5 items-center justify-center text-slate-300 hover:text-rose-500 rounded-full transition-all"
        >
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>

        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>
        <i 
          v-else
          class="fa-solid fa-chevron-down text-slate-400 text-[10px] transition-transform duration-300"
          :class="{'rotate-180 text-indigo-500': isOpen}"
        ></i>
      </div>
    </div>

    <transition name="dropdown-scale">
      <div 
        v-if="isOpen"
        class="absolute left-0 top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xl shadow-slate-300/50 dark:shadow-black/50 z-[100] overflow-hidden flex flex-col origin-top"
      >
        
        <div class="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="Qidirish..."
              @click.stop
            />
          </div>
        </div>

        <ul id="options-list" class="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
          <li v-if="loading" class="py-4 text-center text-slate-400">
             <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Yuklanmoqda...
          </li>

          <li v-else-if="filteredOptions.length === 0" class="flex flex-col items-center justify-center py-6 px-4 text-center">
            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <i class="fa-solid fa-box-open text-xl"></i>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              "<span class="font-bold text-slate-800 dark:text-slate-200">{{ searchQuery }}</span>" bo'yicha ma'lumot yo'q.
            </p>
            <button 
              v-if="allowAdd && searchQuery"
              @click.stop="handleAdd"
              class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-500/30 transition-all active:scale-95"
            >
              <i class="fa-solid fa-plus"></i> Qo'shish
            </button>
          </li>

          <li 
            v-else
            v-for="(option, index) in filteredOptions" 
            :key="option[valueKey] || index"
            @click="selectOption(option)"
            @mouseenter="activeIndex = index"
            class="group px-3 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between border border-transparent"
            :class="{
              'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300': modelValue === option[valueKey],
              'bg-slate-50 dark:bg-slate-800': activeIndex === index && modelValue !== option[valueKey]
            }"
          >
            <div class="flex items-center gap-3">
               <div 
                 class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold uppercase transition-colors shrink-0"
                 :class="modelValue === option[valueKey] ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
               >
                 {{ String(option[labelKey] || '?').charAt(0) }}
               </div>
               
               <span class="font-medium" v-html="highlightMatch(option[labelKey])"></span>
            </div>

            <i v-if="modelValue === option[valueKey]" class="fa-solid fa-check text-indigo-600 text-sm"></i>
          </li>
        </ul>

        <div v-if="allowAdd && !loading && filteredOptions.length > 0" class="border-t border-slate-100 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-900">
           <button 
              @click.stop="emit('add')"
              class="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-all"
           >
              <i class="fa-solid fa-plus"></i> Yangi element qo'shish
           </button>
        </div>

      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-scale-enter-active,
.dropdown-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-scale-enter-from,
.dropdown-scale-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300 dark:bg-slate-600 rounded-full; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
</style>