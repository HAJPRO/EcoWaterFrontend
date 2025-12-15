<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, useSlots, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Object],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' }, // Label bor bo'lsa, placeholder shart emas
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
  error: { type: Boolean, default: false },
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

// Label qachon tepaga chiqishi kerak? (Fokus bo'lganda yoki qiymat bo'lganda)
const isFloating = computed(() => isOpen.value || hasValue.value);

const selectedLabel = computed(() => {
  if (!hasValue.value) return null;
  const item = props.options.find(opt => opt[props.valueKey] === props.modelValue);
  return item ? item[props.labelKey] : props.modelValue;
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options;
  return props.options.filter(opt => 
    String(opt[props.labelKey]).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- SIZE CONFIG ---
const sizeConfig = computed(() => {
  const configs = {
    small: {
      height: 'h-[38px]',
      padding: 'px-2.5',
      fontSize: 'text-xs',
      iconSize: 'text-xs',
      labelActive: '-top-2 left-2 text-[9px]',
      labelInactive: 'top-1/2 -translate-y-1/2 text-xs',
      radius: 'rounded-lg'
    },
    middle: { 
      height: 'h-[48px]',
      padding: 'px-3.5',
      fontSize: 'text-[14px]',
      iconSize: 'text-sm',
      labelActive: '-top-2.5 left-3 text-[11px]',
      labelInactive: 'top-1/2 -translate-y-1/2 text-[14px]',
      radius: 'rounded-xl'
    },
    large: {
      height: 'h-[56px]',
      padding: 'px-4',
      fontSize: 'text-base',
      iconSize: 'text-lg',
      labelActive: '-top-3 left-4 text-xs',
      labelInactive: 'top-1/2 -translate-y-1/2 text-base',
      radius: 'rounded-2xl'
    }
  };
  return configs[props.size] || configs.middle;
});

// --- STYLES ---

// Trigger (Input qutisi)
const triggerClasses = computed(() => [
  'relative flex items-center justify-between w-full transition-all duration-200 ease-out border cursor-pointer select-none outline-none group/trigger',
  'bg-white dark:bg-[#0f172a]', // Background muhim
  
  sizeConfig.value.radius,
  sizeConfig.value.height,
  sizeConfig.value.padding,
  
  props.error 
    ? 'border-rose-300 dark:border-rose-500/50 text-rose-600' 
    : props.disabled
      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
      : isOpen.value
        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
]);

// Label (Suzuvchi)
const labelClasses = computed(() => {
  const base = 'absolute px-1 font-medium transition-all duration-200 pointer-events-none z-10 truncate max-w-[80%]';
  
  // Agar tepaga chiqsa, orqa foni oq bo'lishi kerak (chiziqni yopish uchun)
  const activeStyle = `bg-white dark:bg-[#0f172a] ${sizeConfig.value.labelActive}`;
  
  // Agar pastda tursa
  const leftPos = (slots.prefix || props.iconPre) 
    ? (props.size === 'small' ? 'left-8' : props.size === 'large' ? 'left-11' : 'left-9') 
    : 'left-3';
  const inactiveStyle = `${sizeConfig.value.labelInactive} ${leftPos} text-slate-400`;

  // Ranglar
  const color = props.error 
    ? 'text-rose-500' 
    : isOpen.value 
      ? 'text-indigo-600 dark:text-indigo-400' 
      : hasValue.value ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400';

  return [
    base,
    color,
    isFloating.value ? activeStyle : inactiveStyle
  ];
});

// --- ACTIONS --- (O'zgarishsiz)
const updatePosition = () => {
  if (!triggerRef.value || !isOpen.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  dropdownStyle.value = { position: 'fixed', top: `${rect.bottom + 6}px`, left: `${rect.left}px`, width: `${rect.width}px`, zIndex: 9999 };
};

const handleSelect = (option) => { emit('update:modelValue', option[props.valueKey]); emit('change', option); close(); };
const handleClear = () => { emit('update:modelValue', null); emit('change', null); emit('clear'); };
const handleAdd = () => { if (searchQuery.value.trim()) { emit('add', searchQuery.value); close(); searchQuery.value = ''; } };

const open = () => { if (props.disabled || props.loading) return; isOpen.value = true; searchQuery.value = ''; activeIndex.value = -1; updatePosition(); window.addEventListener('scroll', updatePosition, true); window.addEventListener('resize', updatePosition); if (props.searchable) nextTick(() => searchInputRef.value?.focus()); };
const close = () => { isOpen.value = false; window.removeEventListener('scroll', updatePosition, true); window.removeEventListener('resize', updatePosition); };
const toggle = () => isOpen.value ? close() : open();

const onKeydown = (e) => {
  if (props.disabled) return;
  if (!isOpen.value && ['Enter','ArrowDown',' '].includes(e.key)) { e.preventDefault(); open(); return; }
  if (isOpen.value) {
    const len = filteredOptions.value.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); if (activeIndex.value < len - 1) activeIndex.value++; scrollToItem(activeIndex.value); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (activeIndex.value > 0) activeIndex.value--; scrollToItem(activeIndex.value); }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIndex.value >= 0) handleSelect(filteredOptions.value[activeIndex.value]); else if (props.allowAdd && searchQuery.value) handleAdd(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') close();
  }
};

const scrollToItem = (index) => { if (!listRef.value) return; const items = listRef.value.children; if (items[index]) items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
const handleClickOutside = (e) => { if (triggerRef.value && triggerRef.value.contains(e.target)) return; if (dropdownRef.value && dropdownRef.value.contains(e.target)) return; close(); };

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => { document.removeEventListener('mousedown', handleClickOutside); window.removeEventListener('scroll', updatePosition, true); });
</script>

<template>
  <div class="relative w-full" ref="containerRef" @keydown="onKeydown">
    
    <div 
      ref="triggerRef"
      @click="toggle"
      :class="triggerClasses"
      tabindex="0" 
    >
      <label v-if="label" :class="labelClasses">
        {{ label }} <span v-if="required" class="text-rose-500 ml-0.5">*</span>
      </label>

      <div v-if="slots.prefix || iconPre" class="mr-2 text-slate-400">
         <slot name="prefix"><i :class="iconPre"></i></slot>
      </div>

      <div class="flex-1 truncate pr-2 transition-opacity duration-200" :class="hasValue ? 'opacity-100' : 'opacity-0'">
        <span class="font-medium text-slate-900 dark:text-white" :class="sizeConfig.fontSize">
          {{ selectedLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-slate-400">
        <i v-if="loading" :class="sizeConfig.iconSize" class="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>

        <transition name="scale">
          <button 
            v-if="clearable && hasValue && !disabled"
            @click.stop="handleClear"
            type="button"
            class="flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-all w-5 h-5 z-20"
            tabindex="-1"
          >
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </transition>

        <i 
          class="fa-solid fa-chevron-down transition-transform duration-300"
          :class="[
            sizeConfig.iconSize,
            isOpen ? 'rotate-180 text-indigo-500' : '',
            (clearable && hasValue && !disabled) ? 'hidden' : ''
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
          class="fixed bg-white dark:bg-[#18181b] border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col max-h-60"
        >
          <div v-if="searchable" class="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
             <div class="relative">
               <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
               <input 
                 ref="searchInputRef"
                 v-model="searchQuery"
                 type="text" 
                 class="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200 transition-colors placeholder-slate-400"
                 placeholder="Qidirish..."
                 @click.stop
               />
             </div>
          </div>

          <ul ref="listRef" class="overflow-y-auto custom-scrollbar p-1.5 flex-1">
             <li v-if="filteredOptions.length === 0" class="py-4 px-2 text-center flex flex-col items-center gap-2">
                <span class="text-xs text-slate-400">Ma'lumot topilmadi</span>
                <button 
                  v-if="allowAdd && searchQuery"
                  @click.stop="handleAdd"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  <i class="fa-solid fa-plus"></i> "{{ searchQuery }}" qo'shish
                </button>
             </li>

             <li 
               v-else
               v-for="(option, index) in filteredOptions" 
               :key="option[valueKey]"
               @click="handleSelect(option)"
               @mouseenter="activeIndex = index"
               class="px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
               :class="[
                 modelValue === option[valueKey] ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300',
                 activeIndex === index && modelValue !== option[valueKey] ? 'bg-slate-50 dark:bg-slate-800' : ''
               ]"
             >
               <span>{{ option[labelKey] }}</span>
               <i v-if="modelValue === option[valueKey]" class="fa-solid fa-check text-xs"></i>
             </li>
          </ul>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300 dark:bg-slate-600 rounded-full; }

.zoom-enter-active, .zoom-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.zoom-enter-from, .zoom-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }
.scale-enter-active, .scale-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.5); }
</style>