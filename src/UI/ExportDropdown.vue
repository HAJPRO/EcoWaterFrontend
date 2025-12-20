<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- EMITS ---
// Ota komponentga qaysi format tanlanganini bildirish uchun
const emit = defineEmits(['select']);

// --- STATE ---
const isOpen = ref(false);
const containerRef = ref(null);

// --- DATA (Variantlar) ---
// Yangi format qo'shish uchun shu yerni o'zgartirish kifoya
const exportOptions = [
  { 
    id: 'excel', 
    label: 'Excel Report', 
    description: "To'liq jadval (.xlsx)", 
    icon: 'fa-solid fa-file-excel', 
    theme: 'emerald', // Rang temasi
    badge: 'PRO'
  },
  { 
    id: 'pdf', 
    label: 'PDF Document', 
    description: "Chop etish uchun (.pdf)", 
    icon: 'fa-solid fa-file-pdf', 
    theme: 'rose',
    badge: null
  },
  { 
    id: 'word', 
    label: 'Word Document', 
    description: "Hujjat shaklida (.docx)", 
    icon: 'fa-solid fa-file-word', 
    theme: 'blue',
    badge: null
  }
];

// --- ACTIONS ---
const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (id) => {
  emit('select', id);
  isOpen.value = false; // Tanlagandan keyin yopish
};

// --- CLICK OUTSIDE LOGIC ---
const handleClickOutside = (event) => {
  if (isOpen.value && containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// --- HELPER: Dynamic Color Classes ---
const getThemeClasses = (theme) => {
  const themes = {
    emerald: {
      item: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-100 dark:hover:border-emerald-500/20',
      iconBox: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600',
      text: 'group-hover/item:text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    rose: {
      item: 'hover:bg-rose-50/50 dark:hover:bg-rose-900/10 hover:border-rose-100 dark:hover:border-rose-500/20',
      iconBox: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600',
      text: 'group-hover/item:text-rose-700',
      badge: 'bg-rose-100 text-rose-700'
    },
    blue: {
      item: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-100 dark:hover:border-blue-500/20',
      iconBox: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600',
      text: 'group-hover/item:text-blue-700',
      badge: 'bg-blue-100 text-blue-700'
    }
  };
  return themes[theme] || themes.emerald;
};
</script>

<template>
  <div class="relative inline-block text-left" ref="containerRef">
    
    <button 
      @click.stop="toggle" 
      class="group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-[4px] rounded-lg text-[13px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center active:scale-95 shadow-sm w-full sm:w-auto outline-none"
      :class="{'border-indigo-500 ring-1 ring-indigo-500/20': isOpen}"
    >
      <span class="relative z-60 flex items-center gap-2.5">
        <i class="fa-solid fa-cloud-arrow-down text-lg text-slate-400 group-hover:text-indigo-600 transition-colors"></i> 
        <span class="group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">Export</span>
        <i 
          class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300" 
          :class="{'rotate-180 text-indigo-600': isOpen}"
        ></i>
      </span>
    </button>
    
    <transition name="dropdown-zoom">
      <div 
        v-if="isOpen" 
        class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 z-[9999] overflow-hidden origin-top-right p-2 select-none"
      >
        <div class="px-2 pb-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
          <span class="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Formatni tanlang</span>
          <button @click="isOpen = false" class="text-slate-300 hover:text-rose-500 transition-colors">
             <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <button 
          v-for="opt in exportOptions" 
          :key="opt.id"
          @click="handleSelect(opt.id)"
          class="w-full text-left p-3 rounded-xl flex items-start gap-4 transition-all group/item mb-1 border border-transparent outline-none focus:bg-slate-50 dark:focus:bg-slate-700"
          :class="getThemeClasses(opt.theme).item"
        >
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover/item:scale-110 transition-transform duration-300"
            :class="[getThemeClasses(opt.theme).iconBox, opt.theme === 'rose' ? 'group-hover/item:-rotate-3' : 'group-hover/item:rotate-3']"
          >
            <i :class="opt.icon"></i>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-2">
               <span 
                 class="font-bold text-slate-700 dark:text-slate-200 text-sm transition-colors"
                 :class="getThemeClasses(opt.theme).text"
               >
                 {{ opt.label }}
               </span>
               <span 
                 v-if="opt.badge" 
                 class="text-[9px] font-bold px-1.5 py-0.5 rounded"
                 :class="getThemeClasses(opt.theme).badge"
               >
                 {{ opt.badge }}
               </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 font-medium">{{ opt.description }}</div>
          </div>
        </button>

      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Animation */
.dropdown-zoom-enter-active,
.dropdown-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-zoom-enter-from,
.dropdown-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>