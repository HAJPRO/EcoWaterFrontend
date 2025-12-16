<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, useSlots } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Object],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  labelKey: { type: String, default: 'label' },
  valueKey: { type: String, default: 'value' },
  
  // 🟢 SIZE
  size: { 
    type: String, 
    default: 'middle',
    validator: (v) => ['small', 'middle', 'large'].includes(v)
  },

  // Content
  label: { type: String, default: '' },
  
  // Features
  clearable: { type: Boolean, default: false },
  allowAdd: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  
  // States
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type : Boolean, default: false },
  required: { type: Boolean, default: false },
  
  // Icons
  iconPre: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'change', 'add', 'clear']);
const slots = useSlots();

// Refs
const isOpen = ref(false);
const triggerRef = ref(null);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const listRef = ref(null);
const dropdownStyle = ref({});
const searchQuery = ref('');
const activeIndex = ref(-1);

// --- LOGIC ---
const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '');

// Label qachon tepaga chiqishi kerak? (Fokus, qiymat yoki Label/Placeholder mavjud bo'lsa)
const isFloating = computed(() => isOpen.value || hasValue.value || (props.label && !props.placeholder) || (!props.label && props.placeholder));

const selectedOption = computed(() => {
  if (!hasValue.value) return null;
  // Qiymatlarni taqqoslashda type casting (qattiq tur tekshiruvidan qochish)
  const modelValueStr = String(props.modelValue); 
  return props.options.find(opt => String(opt[props.valueKey]) === modelValueStr);
});

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value[props.labelKey] : null;
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.options;

  return props.options.filter(opt => 
    String(opt[props.labelKey]).toLowerCase().includes(query)
  );
});

// Yangi: Qo'shish uchun shartni aniqlash
const canAdd = computed(() => 
  props.allowAdd && 
  searchQuery.value.trim() !== '' && 
  filteredOptions.value.length === 0
);

// --- SIZE CONFIG (Optimallashtirilgan) ---
const sizeConfig = computed(() => {
  const configs = {
    small: {
      height: 'h-[38px]',
      padding: 'px-2.5',
      fontSize: 'text-xs',
      iconSize: 'text-xs',
      labelActive: '-top-2 left-2 text-[9px]',
      labelInactive: 'top-1/2 -translate-y-1/2 text-xs',
      radius: 'rounded-lg',
      // Prefix/Icon joylashuvini label uchun aniqlash
      prefixLeft: 'left-8', 
    },
    middle: { 
      height: 'h-[48px]',
      padding: 'px-3.5',
      fontSize: 'text-[14px]',
      iconSize: 'text-sm',
      labelActive: '-top-2.5 left-3 text-[11px]',
      labelInactive: 'top-1/2 -translate-y-1/2 text-[14px]',
      radius: 'rounded-xl',
      prefixLeft: 'left-10',
    },
    large: {
      height: 'h-[56px]',
      padding: 'px-4',
      fontSize: 'text-base',
      iconSize: 'text-lg',
      labelActive: '-top-3 left-4 text-xs',
      labelInactive: 'top-1/2 -translate-y-1/2 text-base',
      radius: 'rounded-2xl',
      prefixLeft: 'left-12',
    }
  };
  return configs[props.size] || configs.middle;
});

// --- STYLES ---

// Trigger (Input qutisi)
const triggerClasses = computed(() => [
  'relative flex items-center justify-between w-full transition-all duration-200 ease-out border cursor-pointer select-none outline-none group/trigger',
  'bg-white dark:bg-slate-900', // Tozalangan dark foni
  
  sizeConfig.value.radius,
  sizeConfig.value.height,
  sizeConfig.value.padding,
  
  props.error 
    ? 'border-rose-400 dark:border-rose-500/70 text-rose-600' 
    : props.disabled
      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
      : isOpen.value
        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-100/50 dark:shadow-indigo-900/10'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
]);

// Label (Suzuvchi)
const labelClasses = computed(() => {
  const base = 'absolute px-1 font-medium transition-all duration-200 pointer-events-none z-10 truncate max-w-[calc(100%-4rem)]';
  
  // Ranglar
  const color = props.error 
    ? 'text-rose-500' 
    : props.disabled
      ? 'text-slate-400'
      : isOpen.value 
        ? 'text-indigo-600 dark:text-indigo-400' 
        : hasValue.value ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400';

  // Positionni sizeConfig'dan olish
  const leftPos = (slots.prefix || props.iconPre) ? sizeConfig.value.prefixLeft : 'left-3.5';

  const inactiveStyle = `${sizeConfig.value.labelInactive} ${leftPos} text-slate-400`;
  const activeStyle = `bg-white dark:bg-slate-900 ${sizeConfig.value.labelActive}`;
  
  // Final style
  const finalStyle = isFloating.value ? activeStyle : inactiveStyle;

  return [ base, color, finalStyle ];
});

// --- ACTIONS --- 
const updatePosition = () => {
  if (!triggerRef.value || !isOpen.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  dropdownStyle.value = { 
    position: 'fixed', 
    top: `${rect.bottom + 6}px`, // Bir oz pastroqqa tushirish
    left: `${rect.left}px`, 
    width: `${rect.width}px`, 
    zIndex: 9999 
  };
};

const handleSelect = (option) => { 
  emit('update:modelValue', option[props.valueKey]); 
  emit('change', option); 
  close(); 
};

const handleClear = () => { 
  emit('update:modelValue', null); 
  emit('change', null); 
  emit('clear'); 
  nextTick(() => triggerRef.value?.focus()); // Tozalangandan so'ng fokusni qaytarish
};

const handleAdd = () => { 
  if (canAdd.value) { 
    emit('add', searchQuery.value.trim()); 
    close(); 
    searchQuery.value = ''; 
  } 
};

const open = () => { 
  if (props.disabled || props.loading) return; 
  isOpen.value = true; 
  searchQuery.value = ''; 
  activeIndex.value = -1; 
  
  nextTick(() => {
    updatePosition(); 
    // Scroll va resize event listenerlarini faqat dropdown ochiq bo'lsa qo'shamiz
    window.addEventListener('scroll', updatePosition, true); 
    window.addEventListener('resize', updatePosition); 
    if (props.searchable) searchInputRef.value?.focus(); 
  });
};

const close = () => { 
  if (!isOpen.value) return;
  isOpen.value = false; 
  window.removeEventListener('scroll', updatePosition, true); 
  window.removeEventListener('resize', updatePosition); 
  triggerRef.value?.focus(); // Fokusni trigger'ga qaytarish
};

const toggle = () => isOpen.value ? close() : open();

const onKeydown = (e) => {
  if (props.disabled) return;
  
  if (!isOpen.value && ['Enter', 'ArrowDown', ' '].includes(e.key)) { 
    e.preventDefault(); 
    open(); 
    return; 
  }
  
  if (isOpen.value) {
    const len = filteredOptions.value.length;
    
    if (e.key === 'ArrowDown') { 
      e.preventDefault(); 
      activeIndex.value = (activeIndex.value < len - 1) ? activeIndex.value + 1 : len - 1; 
      scrollToItem(activeIndex.value); 
    }
    else if (e.key === 'ArrowUp') { 
      e.preventDefault(); 
      activeIndex.value = (activeIndex.value > 0) ? activeIndex.value - 1 : 0; 
      scrollToItem(activeIndex.value); 
    }
    else if (e.key === 'Enter') { 
      e.preventDefault(); 
      if (activeIndex.value >= 0) handleSelect(filteredOptions.value[activeIndex.value]); 
      else if (canAdd.value) handleAdd(); 
    }
    else if (e.key === 'Escape' || e.key === 'Tab') { 
      e.preventDefault(); // Escape'da form submit bo'lishini oldini oladi
      close(); 
    }
  }
};

const scrollToItem = (index) => { 
  if (!listRef.value) return; 
  const items = listRef.value.children; 
  if (items[index]) {
    items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); 
  }
};

const handleClickOutside = (e) => { 
  if (triggerRef.value && triggerRef.value.contains(e.target)) return; 
  if (dropdownRef.value && dropdownRef.value.contains(e.target)) return; 
  close(); 
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => { 
  document.removeEventListener('mousedown', handleClickOutside); 
  // O'chirilgan event listenerlarni tozalash ham onUnmounted'da muhim
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
});
</script>

<template>
  <div class="relative w-full" @keydown="onKeydown">
    <div 
      ref="triggerRef"
      @click="toggle"
      :class="triggerClasses"
      tabindex="0" 
    >
      <label v-if="label || placeholder" :class="labelClasses">
        {{ label || placeholder }} <span v-if="required" class="text-rose-500 ml-0.5">*</span>
      </label>

      <div v-if="slots.prefix || iconPre" class="mr-2 text-slate-400" :class="sizeConfig.iconSize">
          <slot name="prefix"><i :class="iconPre"></i></slot>
      </div>

      <div 
          class="flex-1 truncate transition-opacity duration-200" 
          :class="[
              sizeConfig.fontSize,
              hasValue ? 'opacity-100' : 'opacity-0',
              (slots.prefix || iconPre) ? 'pr-2' : 'pr-0' 
          ]"
      >
        <span v-if="selectedLabel" class="font-medium text-slate-900 dark:text-white">
          {{ selectedLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-slate-400">
        <i v-if="loading" :class="sizeConfig.iconSize" class="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>

        <transition name="scale">
          <button 
            v-if="clearable && hasValue && !disabled && !loading"
            @click.stop="handleClear"
            type="button"
            class="flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-all w-5 h-5 z-20"
            tabindex="-1"
          >
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </transition>

        <i 
          class="fa-solid fa-chevron-down transition-transform duration-300 ml-1"
          :class="[
            sizeConfig.iconSize,
            isOpen ? 'rotate-180 text-indigo-500' : '',
            (clearable && hasValue && !disabled && !loading) ? 'hidden' : ''
          ]"
        ></i>
      </div>
    </div>

    <Teleport to="body">
      <transition name="zoom">
        <div 
          v-if="isOpen"
          ref="dropdownRef"
          :style="dropdownStyle"
          class="fixed bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-black/70 overflow-hidden flex flex-col max-h-64 z-[9999]"
        >
          <div v-if="searchable" class="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 sticky top-0 z-10">
              <div class="relative">
                 <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                 <input 
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text" 
                    class="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200 transition-colors placeholder-slate-400"
                    placeholder="Qidirish..."
                    @click.stop
                 />
              </div>
          </div>

          <ul ref="listRef" class="overflow-y-auto custom-scrollbar p-1.5 flex-1">
            <li v-if="filteredOptions.length === 0" class="py-4 px-2 text-center flex flex-col items-center gap-2">
                <span class="text-sm text-slate-400">{{ searchable ? "Qidiruv bo'yicha ma'lumot topilmadi." : "Hech qanday ma'lumot yo'q." }}</span>
                
                <button 
                  v-if="canAdd"
                  @click.stop="handleAdd"
                  class="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  <i class="fa-solid fa-plus"></i> "{{ searchQuery.trim() }}" ni qo'shish
                </button>
                <span v-else-if="props.searchable && searchQuery.trim() !== '' && props.allowAdd" class="text-xs text-slate-500 dark:text-slate-400 mt-1">Qo'shish funksiyasi yoqilmagan.</span>
            </li>

            <li 
              v-else
              v-for="(option, index) in filteredOptions" 
              :key="option[valueKey]"
              @click="handleSelect(option)"
              @mouseenter="activeIndex = index"
              class="px-3 py-2 text-sm rounded-lg cursor-pointer transition-all flex items-center justify-between group"
              :class="[
                modelValue === option[valueKey] 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                activeIndex === index && modelValue !== option[valueKey] ? 'bg-slate-100 dark:bg-slate-800' : ''
              ]"
            >
              <span>{{ option[labelKey] }}</span>
              <i v-if="modelValue === option[valueKey]" class="fa-solid fa-check text-xs ml-2"></i>
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* Scrollbar uchun premium ko'rinish */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300/80 dark:bg-slate-600/80 rounded-full; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }

/* Animatsiyalar */
.zoom-enter-active, .zoom-leave-active { 
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); 
}
.zoom-enter-from, .zoom-leave-to { 
  opacity: 0; 
  transform: translateY(-8px) scale(0.95); 
}
.scale-enter-active, .scale-leave-active { 
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); 
}
.scale-enter-from, .scale-leave-to { 
  opacity: 0; 
  transform: scale(0.5); 
}
</style>