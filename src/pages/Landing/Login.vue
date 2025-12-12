<template>
  <div class="min-h-screen w-full flex font-sans transition-colors duration-700 selection:bg-indigo-500 selection:text-white overflow-hidden custom-scrolls"
       :class="isDarkMode ? 'bg-[#050811] text-slate-200' : 'bg-[#FFFFFF] text-slate-900'">
    
    <button 
      @click="toggleDarkMode" 
      class="absolute top-5 left-6 z-50 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:rotate-180"
      :class="isDarkMode ? 'bg-slate-900/50 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'"
    >
      <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
    </button>

   <div class="w-full lg:w-[35%] flex flex-col justify-center items-center px-6 sm:px-12 relative z-20 transition-colors duration-500 border-r"
       :class="isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-100'">
    
    <div class="w-full max-w-[380px] animate-fade-in-up">
      
      <div class="text-center mb-10">
         <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20 mb-5 p-[2px]">
            <div class="w-full h-full bg-white dark:bg-[#0B0F19] rounded-[14px] overflow-hidden flex items-center justify-center">
               <img  src="../../../public/eco_logo.jpg" alt="Eco" class="w-full h-full object-cover opacity-90" />
            </div>
         </div>
         <h1 class="text-3xl font-black tracking-tight mb-1" 
             :class="isDarkMode ? 'text-white' : 'text-indigo-500'">
           Eco Water
         </h1>
         <p class="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
           Biznesingiz Avtopilotda
         </p>
      </div>

      <el-form 
        ref="formRef" 
        :model="user" 
        :rules="rules" 
        label-position="top"
        class="space-y-5"
        @keyup.enter="LoginValidate(formRef)"
      >
        
        <el-form-item prop="username" class="!mb-0 w-full">
           <template #label>
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block pl-1">Login </span>
           </template>
           <div class="relative group w-full">
              <el-input 
                 v-model="user.username" 
                 placeholder="loginingizni kiriting" 
                 class="professional-input w-full h-12" 
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none">
                 <i class="fas fa-user text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
              </div>
              <span v-if="user.username.length > 0" class="absolute right-10 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
           </div>
        </el-form-item>

        <el-form-item prop="password" class="!mb-2 w-full">
           <template #label>
              <div class="flex justify-between items-center w-full pl-1 mb-1">
                 <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parol</span>
              </div>
           </template>
           <div class="relative group w-full">
              <el-input 
                 v-model="user.password" 
                 type="password" 
                 placeholder="parolingizni kiriting" 
                 show-password 
                 class="professional-input w-full h-12" 
              />
              <div class="absolute right-10 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none">
                 <i class="fas fa-lock text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
              </div>
           </div>
        </el-form-item>

        <div class="flex items-center justify-between px-1">
           <label class="flex items-center gap-2 cursor-pointer group select-none">
              <div class="relative flex items-center justify-center w-4 h-4 rounded border border-slate-300 dark:border-slate-600 transition-colors group-hover:border-indigo-500">
                 <input type="checkbox" class="peer appearance-none w-full h-full cursor-pointer absolute z-10" />
                 <i class="fas fa-check text-[10px] text-indigo-500 opacity-0 peer-checked:opacity-100 transition-opacity"></i>
              </div>
              <span class="text-xs font-semibold text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Eslab qolish</span>
           </label>
           
           <router-link to="/forgot" class="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
              Parolni unutdingizmi?
           </router-link>
        </div>

        <button 
          @click.prevent="LoginValidate(formRef)"
          class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden mt-6"
        >
          <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
          <span>Tizimga Kirish</span>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform text-xs"></i>
        </button>

      </el-form>

   

    </div>
  </div>
    <div class="hidden lg:flex lg:w-[65%] relative overflow-hidden items-center justify-center transition-colors duration-500 perspective-container"
         :class="isDarkMode ? 'bg-[#02040A]' : 'bg-[#F1F5F9]'">
       
       <div class="absolute inset-0 opacity-[0.04]" 
            style="background-image: linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px); background-size: 60px 60px;">
       </div>

       <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>

       <div class="relative w-[800px] h-[800px] flex items-center justify-center scale-90 xl:scale-100 transform-style-3d rotate-x-12">
          
          <div class="absolute w-[700px] h-[700px] border border-dashed border-slate-400/20 rounded-full animate-spin-very-slow">
             <div class="absolute top-1/2 -right-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-700 animate-counter-spin">
                <i class="fas fa-truck-fast text-indigo-500 text-xl mb-1"></i>
                <span class="text-[8px] font-bold uppercase">Logistika</span>
             </div>
             <div class="absolute bottom-20 left-20 w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-700 animate-counter-spin">
                <i class="fas fa-network-wired text-cyan-500 text-lg"></i>
             </div>
          </div>

          <div class="absolute w-[500px] h-[500px] border border-indigo-500/20 rounded-full animate-spin-slow">
             <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-xl border border-indigo-100 dark:border-slate-700 animate-counter-spin">
                <i class="fas fa-coins text-amber-500 text-xl mb-1"></i>
                <span class="text-[8px] font-bold uppercase">Moliya</span>
             </div>
             <div class="absolute bottom-14 right-14 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-xl border border-indigo-100 dark:border-slate-700 animate-counter-spin">
                <i class="fas fa-industry text-rose-500 text-xl mb-1"></i>
                <span class="text-[8px] font-bold uppercase">Ishlab Ch.</span>
             </div>
             <div class="absolute top-1/2 -left-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-xl border border-indigo-100 dark:border-slate-700 animate-counter-spin">
                <i class="fas fa-boxes-stacked text-emerald-500 text-xl mb-1"></i>
                <span class="text-[8px] font-bold uppercase">Ombor</span>
             </div>
             
          </div>

          <div class="absolute w-[300px] h-[300px] border border-dashed border-indigo-400/30 rounded-full animate-spin-medium">
             <div class="absolute top-4 right-8 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_currentColor]"></div>
             <div class="absolute bottom-4 left-8 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_currentColor]"></div>
          </div>

          <div class="relative z-10 w-40 h-40 bg-white dark:bg-[#0B0F19] rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-indigo-50 dark:border-slate-800 animate-float">
             <div class="absolute -inset-6 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
             
             <div class="w-16 h-16 mb-2 overflow-hidden rounded-xl">
               <img  src="../../../public/eco_logo.jpg" alt="Core" class="w-full h-full object-cover" />
             </div>
             <span class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Eco Water</span>
             <span class="text-[8px] text-green-500 font-bold mt-1 animate-pulse">● SYSTEM ONLINE</span>
          </div>

          <div class="absolute top-20 right-20 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-48 animate-float-delay-1 z-20">
             <div class="text-[10px] text-slate-400 font-bold uppercase mb-2">Oylik O'sish</div>
             <div class="flex items-end gap-1 h-12">
                <div class="w-1/5 bg-indigo-200 dark:bg-indigo-900 rounded-t-sm h-[40%]"></div>
                <div class="w-1/5 bg-indigo-300 dark:bg-indigo-800 rounded-t-sm h-[60%]"></div>
                <div class="w-1/5 bg-indigo-400 dark:bg-indigo-700 rounded-t-sm h-[50%]"></div>
                <div class="w-1/5 bg-indigo-500 dark:bg-indigo-600 rounded-t-sm h-[80%]"></div>
                <div class="w-1/5 bg-indigo-600 dark:bg-indigo-500 rounded-t-sm h-[100%] animate-pulse"></div>
             </div>
             <div class="text-right text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2">+24% 📈</div>
          </div>

          <div class="absolute bottom-20 left-10 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-52 animate-float-delay-2 z-20">
             <div class="flex justify-between mb-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Resurslar</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-white">85%</span>
             </div>
             <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%] animate-slide-right"></div>
             </div>
             <div class="flex justify-between mt-3 mb-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Energiya</span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-white">42%</span>
             </div>
             <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[42%] animate-slide-right delay-100"></div>
             </div>
          </div>

       </div>

     

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { AuthStore } from "../../stores/Auth/auth.js";

const store = AuthStore();
const user = ref({ username: "", password: "" });
const formRef = ref();
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const LoginValidate = async (formRef) => {
  if (!formRef) return;
  await formRef.validate((valid) => {
    if (valid) store.login(user.value);
  });
};

const rules = {
  username: [{ required: true, message: "Majburiy", trigger: "blur" }],
  password: [{ required: true, message: "Majburiy", trigger: "blur" }],
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>

<style scoped>
/* 🎨 INPUT STYLES (Solid & Strict) */
:deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1.5px solid #E2E8F0; 
  border-radius: 0.75rem; 
  padding-left: 1rem;
  transition: all 0.2s ease-in-out;
}

:deep(.dark .el-input__wrapper) {
  border-color: #334155;
  background-color: #0F172A !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #4F46E5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
  background-color: #fff !important;
}
:deep(.dark .el-input__wrapper.is-focus) {
  background-color: #1E293B !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2) !important;
}

:deep(.el-input__inner) {
  font-weight: 600;
  color: inherit;
  height: 100%;
}

/* 🌀 ORBIT & CHART ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin 25s linear infinite; }
.animate-spin-medium { animation: spin 12s linear infinite; }
.animate-spin-very-slow { animation: spin 60s linear infinite; }

/* Counter Spin (Icons stay upright) */
@keyframes counterSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
.animate-counter-spin { animation: counterSpin 25s linear infinite; }

/* Charts */
@keyframes slideRight {
  from { width: 0; }
  to { width: var(--w); }
}
.animate-slide-right { animation: slideRight 1.5s ease-out forwards; }

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delay-1 { animation: float 7s ease-in-out infinite 1s; }
.animate-float-delay-2 { animation: float 8s ease-in-out infinite 2s; }

.perspective-container { perspective: 1500px; }
.transform-style-3d { transform-style: preserve-3d; }

</style>