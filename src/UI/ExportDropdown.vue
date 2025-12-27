<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- PROPS ---
const props = defineProps({
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

// --- EMITS ---
const emit = defineEmits(['select']);

// --- STATE ---
const isOpen = ref(false);
const containerRef = ref(null);

// --- DATA ---
const exportOptions = [
  { 
    id: 'excel', 
    label: 'Excel Report', 
    description: "To'liq jadval (.xlsx)", 
    icon: 'fa-solid fa-file-excel', 
    theme: 'emerald',
    badge: 'PRO'
  },
  { 
    id: 'pdf', 
    label: 'PDF Document', 
    description: "Chop etish uchun (.pdf)", 
    icon: 'fa-solid fa-file-pdf', 
    theme: 'rose'
  }
];

// --- SIZE CONFIGURATION ---
const sizeClasses = {
  sm: {
    btn: 'px-3 py-1 text-[11px] h-8',
    icon: 'text-sm',
    chevron: 'text-[8px]'
  },
  md: {
    btn: 'px-4 py-1.5 text-[13px] h-10',
    icon: 'text-base',
    chevron: 'text-[10px]'
  },
  lg: {
    btn: 'px-6 py-2 text-[15px] h-12',
    icon: 'text-xl',
    chevron: 'text-[12px]'
  }
};

// --- ACTIONS ---
const toggle = () => isOpen.value = !isOpen.value;
const handleSelect = (id) => {
  emit('select', id);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (isOpen.value && containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const getThemeClasses = (theme) => {
  const themes = {
    emerald: {
      item: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-100',
      iconBox: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600',
      text: 'group-hover/item:text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    rose: {
      item: 'hover:bg-rose-50/50 dark:hover:bg-rose-900/10 hover:border-rose-100',
      iconBox: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600',
      text: 'group-hover/item:text-rose-700',
      badge: 'bg-rose-100 text-rose-700'
    }
  };
  return themes[theme] || themes.emerald;
};
</script>

<template>
  <div class="relative inline-block text-left" ref="containerRef">
    
    <button 
      @click.stop="toggle" 
      :class="[
        sizeClasses[props.size].btn,
        isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-300 dark:border-slate-600'
      ]"
      class="group relative bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center active:scale-95 shadow-sm outline-none"
    >
      <div class="flex items-center gap-2.5">
        <i 
          class="fa-solid fa-file-export transition-colors" 
          :class="[sizeClasses[props.size].icon, isOpen ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500']"
        ></i> 
        <span class="tracking-wide">Export</span>
        <i 
          class="fa-solid fa-chevron-down transition-transform duration-300" 
          :class="[sizeClasses[props.size].chevron, isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400']"
        ></i>
      </div>
    </button>
    
    <Teleport to="body">
      <transition name="dropdown-pop">
        <div 
          v-if="isOpen" 
          :style="isOpen ? { 
            position: 'fixed', 
            top: containerRef?.getBoundingClientRect().bottom + 8 + 'px', 
            left: containerRef?.getBoundingClientRect().left + 'px',
            zIndex: 9999
          } : {}"
          class="w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 p-2 select-none"
        >
          <div class="px-4 py-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
            <span class="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Eksport Formati</span>
          </div>

          <button 
            v-for="opt in exportOptions" 
            :key="opt.id"
            @click="handleSelect(opt.id)"
            class="w-full text-left p-3 rounded-2xl flex items-center gap-4 transition-all group/item mb-1 border border-transparent outline-none"
            :class="getThemeClasses(opt.theme).item"
          >
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-transform duration-300 group-hover/item:scale-110"
              :class="getThemeClasses(opt.theme).iconBox"
            >
              <i :class="opt.icon"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                 <span class="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" :class="getThemeClasses(opt.theme).text">
                   {{ opt.label }}
                 </span>
                 <span v-if="opt.badge" class="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase" :class="getThemeClasses(opt.theme).badge">
                   {{ opt.badge }}
                 </span>
              </div>
              <div class="text-[10px] text-slate-400 font-medium truncate">{{ opt.description }}</div>
            </div>
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dropdown-pop-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.dropdown-pop-leave-active { transition: all 0.2s ease-in; }
.dropdown-pop-enter-from { opacity: 0; transform: scale(0.9) translateY(-10px); }
</style>