<script setup>
import { computed, ref, useAttrs, useSlots, nextTick } from 'vue'; // 🟢 useSlots qo'shildi

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number, Object], default: '' },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
  
  // Size
  size: { 
    type: String, 
    default: 'middle',
    validator: (v) => ['small', 'middle', 'large'].includes(v)
  },

  // Content
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  help: { type: String, default: '' },
  
  // States
  error: { type: [String, Boolean], default: false },
  success: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  
  // Icons
  iconPre: { type: String, default: '' },
  iconPost: { type: String, default: '' },
  rows: { type: [String, Number], default: 3 }
});

const emit = defineEmits(['update:modelValue', 'clear', 'focus', 'blur', 'enter', 'change']);
const attrs = useAttrs();
const slots = useSlots(); // 🟢 slots o'zgaruvchisi aniqlandi

const inputRef = ref(null);
const fileInputRef = ref(null);
const isFocused = ref(false);
const showPassword = ref(false);
const fileName = ref('');

// --- SIZE CONFIG ---
const sizeConfig = computed(() => {
  const configs = {
    small: {
      height: 'h-[38px]',
      padding: 'px-3',
      fontSize: 'text-xs',
      iconSize: 'text-xs',
      labelPos: '-top-2 left-2.5',
      labelSize: 'text-[10px]',
      radius: 'rounded-lg'
    },
    middle: { 
      height: 'h-[48px]',
      padding: 'px-3.5',
      fontSize: 'text-[14px]',
      iconSize: 'text-sm',
      labelPos: '-top-2.5 left-3',
      labelSize: 'text-[11px]',
      radius: 'rounded-xl'
    },
    large: {
      height: 'h-[56px]',
      padding: 'px-4',
      fontSize: 'text-base',
      iconSize: 'text-lg',
      labelPos: '-top-3 left-4',
      labelSize: 'text-xs',
      radius: 'rounded-2xl'
    }
  };
  return configs[props.size] || configs.middle;
});

// --- LOGIC ---

const hasContent = computed(() => {
  if (props.type === 'file') return !!fileName.value;
  if (['date', 'time', 'datetime-local', 'color'].includes(props.type)) return true;
  return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined;
});

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password';
  return props.type;
});

const getIconForType = () => {
  const map = { email: 'fa-regular fa-envelope', tel: 'fa-solid fa-phone', date: 'fa-regular fa-calendar', time: 'fa-regular fa-clock', search: 'fa-solid fa-magnifying-glass', url: 'fa-solid fa-link', password: 'fa-solid fa-lock' };
  return map[props.type] || null;
};

// Wrapper Classes
const wrapperClasses = computed(() => [
  'relative flex items-center w-full transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] border group/wrapper',
  'bg-white dark:bg-[#0f172a]', 
  
  sizeConfig.value.radius,
  props.type === 'textarea' ? 'items-start' : 'items-center',
  
  props.error 
    ? 'border-rose-300 dark:border-rose-500/50 text-rose-600' 
    : props.success 
      ? 'border-emerald-400 dark:border-emerald-500/50 text-emerald-700'
      : props.disabled
        ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
        : props.readonly
          ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-default'
          : isFocused.value
            ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' 
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
]);

// Label Classes
const labelClasses = computed(() => {
  // Label chapda turishi kerak bo'lgan masofani hisoblash
  // Bu yerda `slots` ishlatiladi
  const hasPrefixIcon = !!slots.prefix || !!props.iconPre || !!getIconForType();
  const leftPos = hasPrefixIcon 
    ? (props.size === 'small' ? 'left-8' : props.size === 'large' ? 'left-11' : 'left-9') 
    : 'left-3';

  return [
    'absolute px-1 font-medium transition-all duration-200 select-none z-10 pointer-events-none',
    'bg-white dark:bg-[#0f172a]', // Background mask
    
    // Dynamic positioning
    (isFocused.value || hasContent.value) 
      ? `${sizeConfig.value.labelPos} ${sizeConfig.value.labelSize} text-indigo-600 dark:text-indigo-400`
      : `top-1/2 -translate-y-1/2 text-slate-400 ${sizeConfig.value.fontSize} ${leftPos}`,
    
    props.error ? '!text-rose-500' : ''
  ];
});

// Input Element Classes
const inputElementClasses = computed(() => [
  'w-full bg-transparent border-none outline-none font-medium text-slate-900 dark:text-white placeholder-slate-400/50 transition-colors',
  sizeConfig.value.fontSize,
  sizeConfig.value.padding,
  
  props.type === 'textarea' ? 'py-3 leading-relaxed' : sizeConfig.value.height,
  props.type === 'color' ? `p-1 ${sizeConfig.value.height} w-[60px] cursor-pointer` : '',
  props.type === 'file' ? 'hidden' : '', 
  (props.disabled || props.readonly) ? 'cursor-not-allowed' : ''
]);

// --- HANDLERS ---
const handleInput = (event) => { if (props.type !== 'file') emit('update:modelValue', event.target.value); };
const handleFileChange = (event) => { const file = event.target.files[0]; if (file) { fileName.value = file.name; emit('update:modelValue', file); emit('change', file); } };
const triggerFileUpload = () => { if (!props.disabled && !props.readonly) fileInputRef.value?.click(); };
const handleClear = () => { emit('update:modelValue', ''); if (props.type === 'file') { fileName.value = ''; if (fileInputRef.value) fileInputRef.value.value = ''; } emit('clear'); nextTick(() => { if(inputRef.value && props.type !== 'file') inputRef.value.focus(); }); };

</script>

<template>
  <div class="flex flex-col w-full relative group/input">
    
    <div :class="wrapperClasses" @click="type === 'file' ? triggerFileUpload() : null">
      
      <label v-if="label && type !== 'file'" :for="id" :class="labelClasses">
        {{ label }} <span v-if="required" class="text-rose-500 ml-0.5">*</span>
      </label>

      <div 
        v-if="$slots.prefix || iconPre || getIconForType()" 
        class="flex items-center justify-center shrink-0 transition-colors duration-200" 
        :class="[
           size === 'small' ? 'pl-2.5 pr-1' : size === 'large' ? 'pl-4 pr-2' : 'pl-3.5 pr-1.5',
           (isFocused) ? 'text-indigo-500' : 'text-slate-400',
           sizeConfig.iconSize,
           {'pt-3': type === 'textarea'}
        ]"
      >
        <slot name="prefix">
          <i :class="iconPre || getIconForType()"></i>
        </slot>
      </div>

      <div v-if="type === 'file'" :class="[sizeConfig.height, sizeConfig.padding]" class="w-full flex items-center cursor-pointer select-none relative">
         <span class="absolute -top-2.5 left-3 bg-white dark:bg-[#0f172a] px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{{ label }}</span>
         <div class="flex-1 flex flex-col justify-center overflow-hidden mr-2">
            <span v-if="fileName" :class="sizeConfig.fontSize" class="font-bold text-slate-700 dark:text-slate-200 truncate">{{ fileName }}</span>
            <span v-else :class="sizeConfig.fontSize" class="text-slate-400 truncate opacity-60">{{ placeholder || 'Fayl tanlang...' }}</span>
         </div>
         <span 
           class="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 group-hover/wrapper:bg-white group-hover/wrapper:text-indigo-600 group-hover/wrapper:border-indigo-200 transition-all shadow-sm"
         >
            Yuklash
         </span>
      </div>

      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        ref="inputRef"
        :id="id"
        :type="inputType"
        :value="type !== 'file' ? modelValue : undefined"
        :placeholder="isFocused ? placeholder : ''"
        :disabled="disabled || loading"
        :readonly="readonly"
        :rows="type === 'textarea' ? rows : undefined"
        :class="inputElementClasses"
        v-bind="attrs"
        @input="handleInput"
        @change="type === 'file' ? handleFileChange($event) : emit('change', $event.target.value)"
        @focus="isFocused = true; emit('focus')"
        @blur="isFocused = false; emit('blur')"
        @keydown.enter="emit('enter')"
      />
      
      <input v-if="type === 'file'" ref="fileInputRef" type="file" class="hidden" @change="handleFileChange" v-bind="attrs" />

      <div class="flex items-center gap-2 shrink-0 text-slate-400" 
           :class="[
             size === 'small' ? 'pr-2 pl-1' : size === 'large' ? 'pr-4 pl-2' : 'pr-3 pl-1',
             {'pt-3': type === 'textarea'}
           ]">
        
        <i v-if="loading" :class="sizeConfig.iconSize" class="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>

        <transition name="scale">
          <button 
            v-if="clearable && (modelValue || fileName) && !disabled && !readonly && !loading" 
            @click.stop="handleClear" 
            type="button"
            class="flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-300 hover:text-rose-500 transition-all cursor-pointer"
            :class="[
               size === 'small' ? 'w-4 h-4' : 'w-6 h-6'
            ]"
            tabindex="-1"
          >
            <i class="fa-solid fa-xmark" :class="size === 'small' ? 'text-[9px]' : 'text-[11px]'"></i>
          </button>
        </transition>

        <button 
          v-if="type === 'password' && !disabled" 
          @click.stop="showPassword = !showPassword" 
          type="button"
          class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          tabindex="-1"
        >
          <i :class="[showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye', sizeConfig.iconSize]"></i>
        </button>

        <div v-if="$slots.suffix || iconPost" class="flex items-center">
          <slot name="suffix">
            <i :class="[iconPost, sizeConfig.iconSize]"></i>
          </slot>
        </div>

        <i v-if="error && !loading" :class="sizeConfig.iconSize" class="fa-solid fa-circle-exclamation text-rose-500 animate-pulse"></i>
        <i v-if="success && !loading" :class="sizeConfig.iconSize" class="fa-solid fa-circle-check text-emerald-500"></i>

      </div>
    </div>

    <div v-if="error || help" class="px-1 mt-1 min-h-[16px]">
      <transition name="slide-fade">
        <p v-if="error" class="font-semibold text-rose-500 flex items-center gap-1" :class="size === 'small' ? 'text-[10px]' : 'text-[11px]'">
           {{ typeof error === 'string' ? error : '' }}
        </p>
        <p v-else-if="help" class="font-medium text-slate-400 dark:text-slate-500" :class="size === 'small' ? 'text-[10px]' : 'text-[11px]'">
          {{ help }}
        </p>
      </transition>
    </div>

  </div>
</template>

<style scoped>
/* Browser Defautlarni O'chirish */
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.5); opacity: 0.6; transition: 0.2s; }
input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; filter: invert(0.3) sepia(1) saturate(3) hue-rotate(220deg); }
.dark input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
input:-webkit-autofill, textarea:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px transparent inset; transition: background-color 5000s ease-in-out 0s; }

/* Animatsiyalar */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-3px); }
.scale-enter-active, .scale-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.5); }
</style>