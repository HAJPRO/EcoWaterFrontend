<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true }, // v-model uchun
  title: { type: String, default: 'Ma\'lumot oynasi' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'fa-solid fa-layer-group' }, // FontAwesome icon
  width: { type: String, default: 'max-w-4xl' }, // Modal kengligi
  showClose: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close();
};

// "Escape" tugmasi bosilganda yopish
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) close();
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog">
      
      <div 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        @click="handleBackdropClick"
      ></div>

      <div 
        class="relative w-full bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all border border-slate-200 dark:border-slate-700"
        :class="width"
      >
        
        <div class="px-6 py-4 border-b border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-between items-center z-10 shrink-0">
          <slot name="header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shadow-sm">
                <i :class="[icon, 'text-lg']"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="text-xs text-slate-500 font-medium">{{ subtitle }}</p>
              </div>
            </div>
          </slot>
          
          <button 
            v-if="showClose"
            @click="close" 
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <slot name="footer" :close="close" />
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animation: Scale & Fade */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active div[class*="relative"], .modal-fade-leave-active div[class*="relative"] { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-enter-from div[class*="relative"], .modal-fade-leave-to div[class*="relative"] { transform: scale(0.95) translateY(10px); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300 dark:bg-slate-600 rounded-full; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
</style>