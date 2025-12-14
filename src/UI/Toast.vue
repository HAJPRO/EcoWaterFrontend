<script setup>
import { useToast } from './utils/useToast.js'; // Yo'lni to'g'rilang

const { toasts, remove } = useToast();

// Professional Ranglar Palitrasi (Subtle & Clean)
const variants = {
  success: {
    icon: 'fa-solid fa-circle-check',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-emerald-500/20', // Yumshoq border
    iconBox: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    progress: 'bg-emerald-500',
    title: 'text-slate-800 dark:text-white'
  },
  danger: {
    icon: 'fa-solid fa-triangle-exclamation',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-rose-500/20',
    iconBox: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
    progress: 'bg-rose-500',
    title: 'text-slate-800 dark:text-white'
  },
  info: {
    icon: 'fa-solid fa-circle-info',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-blue-500/20',
    iconBox: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    progress: 'bg-blue-500',
    title: 'text-slate-800 dark:text-white'
  },
  warning: {
    icon: 'fa-solid fa-bolt',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-amber-500/20',
    iconBox: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    progress: 'bg-amber-500',
    title: 'text-slate-800 dark:text-white'
  }
};
</script>

<template>
  <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none sm:px-0 px-4">
    
    <TransitionGroup name="toast-anim">
      <div 
        v-for="item in toasts" 
        :key="item.id"
        class="pointer-events-auto group relative flex overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl border transition-all duration-300 select-none"
        :class="[
           variants[item.type]?.bg || 'bg-white', 
           variants[item.type]?.border || 'border-slate-200'
        ]"
      >
        
        <div class="flex items-start p-4 pr-0">
           <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110 duration-300"
                :class="variants[item.type]?.iconBox">
              <i :class="variants[item.type]?.icon"></i>
           </div>
        </div>

        <div class="flex-1 flex flex-col justify-center p-4 min-w-0">
           <h4 class="text-sm font-bold leading-tight mb-0.5" :class="variants[item.type]?.title">
             {{ item.title }}
           </h4>
           <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug break-words">
             {{ item.message }}
           </p>
        </div>

        <div class="flex items-start p-2">
           <button 
             @click="remove(item.id)" 
             class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
           >
             <i class="fa-solid fa-xmark text-sm"></i>
           </button>
        </div>

        <div class="absolute bottom-0 left-0 h-[3px] w-full bg-slate-100 dark:bg-slate-800">
           <div 
             class="h-full w-full origin-left animate-progress group-hover:paused"
             :class="variants[item.type]?.progress"
             :style="{ animationDuration: `${item.duration}ms` }"
           ></div>
        </div>

      </div>
    </TransitionGroup>

  </div>
</template>

<style scoped>
/* 1. Progress Bar Animatsiyasi */
@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
.animate-progress {
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
/* Sichqoncha borganda to'xtatish */
.group:hover .group-hover\:paused {
  animation-play-state: paused;
}

/* 2. Kirish/Chiqish Animatsiyasi (Apple Style) */
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-anim-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95) rotate(2deg);
}

.toast-anim-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(1);
}

/* Ro'yxat o'zgarganda elementlarning silliq joylashishi */
.toast-anim-move {
  transition: all 0.4s ease;
}

/* Element chiqib ketayotganda joyini bo'shatishi uchun */
.toast-anim-leave-active {
  position: absolute;
  width: 100%;
}
</style>