<script setup>
import { ref, onMounted } from "vue";

// --- STATE ---
const activeTab = ref("Aloqalar");
const isDark = ref(false); // Boshlang'ich holat

// --- THEME LOGIC ---
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Tizim sozlamasini tekshirish (ixtiyoriy)
onMounted(() => {
  // Agar foydalanuvchi tizimi dark mode bo'lsa, avtomatik yoqish
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});

// --- DATA ---
const tabs = ["Aloqalar", "Jurnal", "Xavfsizlik", "Integratsiya"];

// Bento Grid uchun ma'lumotlar
const connections = [
  {
    title: "Profil & Bio",
    desc: "Shaxsiy ma'lumotlarni boshqarish",
    items: ["Kontaktlar", "Chat Profil", "Bio Tahrirlash"],
    icon: "fa-id-card",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "group-hover:border-indigo-500/50",
    cols: "col-span-1 md:col-span-2", // Katta karta
  },
  {
    title: "Faoliyat",
    desc: "Kundalik hisobot",
    items: ["Muloqotlar", "Vazifalar"],
    icon: "fa-chart-pie",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "group-hover:border-emerald-500/50",
    cols: "col-span-1",
  },
  {
    title: "Tarix",
    desc: "Tizimga kirishlar",
    items: ["Kirish tarixi", "Loginlar", "IP Manzillar"],
    icon: "fa-clock-rotate-left",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "group-hover:border-amber-500/50",
    cols: "col-span-1",
  },
  {
    title: "API & Webhook",
    desc: "Tashqi tizimlar",
    items: ["Tokenlar", "Kalitlar", "Hujjatlar"],
    icon: "fa-bolt",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "group-hover:border-purple-500/50",
    cols: "col-span-1 md:col-span-2",
  },
];
</script>

<template>
  <div class="min-h-screen transition-colors duration-500 font-sans p-4 md:p-8 relative overflow-hidden bg-white rounded-xl dark:bg-slate-700 text-slate-800 dark:text-slate-200">
    
    <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-500/20 pointer-events-none"></div>
    <div class="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

  

    <div class="max-w-6xl mx-auto relative z-10">
      
      <div class="rounded-3xl shadow-xl overflow-hidden mb-10 transition-all duration-300
                  bg-white/70 border border-white/50 backdrop-blur-xl
                  dark:bg-slate-900/60 dark:border-slate-800">
        
        <div class="h-32 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
           <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>

        <div class="px-8 pb-8">
          <div class="flex flex-col md:flex-row items-center md:items-end -mt-16 gap-6">
            
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
              <div class="relative w-32 h-32 rounded-full p-1 
                          bg-white dark:bg-slate-900">
                <img
                  src="https://img.freepik.com/free-photo/medium-shot-smiley-man-sitting-desk_23-2149927603.jpg"
                  class="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-900"
                />
                <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
              </div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <h1 class="text-3xl font-black tracking-tight mb-1 text-slate-900 dark:text-white">
                Sanjar Aliyev
              </h1>
              <p class="text-sm font-medium mb-4 text-slate-500 dark:text-slate-400">
                Senior Product Designer • Buxoro, UZ
              </p>
              
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                 <div class="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider
                             bg-slate-100 text-slate-600 
                             dark:bg-slate-800 dark:text-slate-300">
                    <i class="fas fa-briefcase text-indigo-500"></i> 5 Yil Tajriba
                 </div>
                 <div class="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider
                             bg-slate-100 text-slate-600 
                             dark:bg-slate-800 dark:text-slate-300">
                    <i class="fas fa-star text-amber-500"></i> 4.9 Reyting
                 </div>
              </div>
            </div>

            <button class="mb-4 md:mb-0 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95
                           bg-indigo-600 hover:bg-indigo-700">
               <i class="fas fa-pen mr-2"></i> Tahrirlash
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-8">
        <div class="flex p-1.5 rounded-2xl border shadow-sm
                    bg-white border-slate-200 
                    dark:bg-slate-900 dark:border-slate-800">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 relative z-10"
            :class="activeTab === tab 
              ? 'text-white shadow-md bg-slate-900 dark:bg-slate-700' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        
        <div v-if="activeTab === 'Aloqalar'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div
            v-for="(card, index) in connections"
            :key="index"
            :class="card.cols"
            class="group relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                   bg-white border-slate-100 shadow-sm
                   dark:bg-slate-900 dark:border-slate-800"
          >
            <div class="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 pointer-events-none" 
                 :class="card.border"></div>

            <div class="flex justify-between items-start mb-6">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner transition-transform group-hover:scale-110 duration-300"
                       :class="[card.bg, card.color]">
                     <i class="fas" :class="card.icon"></i>
                  </div>
                  <div>
                     <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ card.title }}</h3>
                     <p class="text-xs font-medium text-slate-400 dark:text-slate-500">{{ card.desc }}</p>
                  </div>
               </div>
               
               <button class="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
                  <i class="fas fa-ellipsis-vertical text-lg"></i>
               </button>
            </div>

            <div class="flex flex-wrap gap-2">
               <span 
                  v-for="item in card.items" :key="item"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer select-none
                         bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300
                         dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-slate-600"
               >
                  {{ item }}
               </span>
               <button class="px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed transition-colors
                              text-slate-400 border-slate-300 hover:text-indigo-500 hover:border-indigo-500
                              dark:text-slate-500 dark:border-slate-700 dark:hover:text-indigo-400 dark:hover:border-indigo-400">
                  + Qo'shish
               </button>
            </div>

          </div>

        </div>

        <div v-else class="h-64 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed
                           bg-slate-50 border-slate-200 text-slate-400
                           dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-600">
           <i class="fas fa-rocket text-4xl mb-4 opacity-50 animate-bounce"></i>
           <p class="font-bold">Tez orada...</p>
        </div>

      </transition>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>