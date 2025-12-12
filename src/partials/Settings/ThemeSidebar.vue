<template>
  <div>
    <div
      v-if="visible"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
    ></div>

    <div
      class="fixed top-0 right-0 h-full w-[380px] z-50 flex flex-col shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="visible ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="absolute inset-0 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl z-0"></div>
      
      <div class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div class="relative z-10 flex flex-col h-full">
        
        <div class="px-8 py-6 flex justify-between items-center border-b border-gray-100/50 dark:border-gray-800/50">
          <div>
            <h2 class="text-2xl font-black bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Sozlamalar
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-1">
              INTERFACE & PREFERENCES
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <i class="fa-solid fa-xmark text-xl group-hover:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          
          <section>
            <h3 class="section-title"><i class="fa-solid fa-palette mr-2"></i> Mavzu Rangi</h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="theme in themeOptions"
                :key="theme.value"
                @click="changeTheme(theme.value)"
                class="relative h-14 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all duration-200 overflow-hidden group"
                :class="selectedTheme === theme.value 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'"
              >
                <div class="w-4 h-4 rounded-full shadow-sm" :style="{ backgroundColor: theme.color }"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">{{ theme.label }}</span>
                
                <div v-if="selectedTheme === theme.value" class="absolute top-1 right-1 text-indigo-500 text-[10px]">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
              </button>
            </div>
          </section>

          <section class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm text-lg">
                  <i class="fa-solid" :class="autoDarkMode ? 'fa-moon text-indigo-400' : 'fa-sun text-amber-500'"></i>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-800 dark:text-gray-100">Tungi Rejim</div>
                  <div class="text-[11px] text-gray-500">Qorong'u muhit uchun</div>
                </div>
              </div>
              <el-switch v-model="autoDarkMode" @change="toggleDarkMode" style="--el-switch-on-color: #6366f1;" />
            </div>
          </section>

          <section>
            <h3 class="section-title"><i class="fa-solid fa-wind mr-2"></i> Fasl Effekti</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="anim in animationThemes"
                :key="anim.value"
                @click="selectedAnimationTheme = anim.value"
                class="relative p-3 rounded-xl border flex items-center gap-3 transition-all duration-300"
                :class="selectedAnimationTheme === anim.value
                  ? 'border-indigo-500 bg-white dark:bg-gray-800 shadow-lg shadow-indigo-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-transparent opacity-60 hover:opacity-100'"
              >
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gray-50 dark:bg-gray-700" :style="{ color: anim.color }">
                  <i :class="anim.icon"></i>
                </div>
                <div class="text-left">
                  <div class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ anim.label }}</div>
                  <div class="text-[10px] text-gray-500">Animatsiya</div>
                </div>
              </button>
            </div>
          </section>

          <section class="space-y-4">
            <h3 class="section-title"><i class="fa-solid fa-sliders mr-2"></i> Tizim</h3>
            
            <div class="setting-row">
              <label class="text-sm text-gray-600 dark:text-gray-300 font-medium">Til (Language)</label>
              <el-select v-model="selectedLang" placeholder="Til" class="w-32 custom-select" size="default">
                <el-option v-for="lang in languageOptions" :key="lang.value" :value="lang.value" :label="lang.label">
                  <div class="flex items-center gap-2">
                    <img :src="lang.flag" class="w-4 h-3 rounded shadow-sm" />
                    <span>{{ lang.label }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>

            <div class="setting-row">
              <label class="text-sm text-gray-600 dark:text-gray-300 font-medium">Shrift Hajmi</label>
              <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button 
                  v-for="size in fontSizes" 
                  :key="size.value"
                  @click="fontSize = size.value"
                  class="px-3 py-1 text-xs rounded-md transition-all font-medium"
                  :class="fontSize === size.value ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
                >
                  {{ size.icon_text }}
                </button>
              </div>
            </div>

            <div class="setting-row">
              <label class="text-sm text-gray-600 dark:text-gray-300 font-medium">Menu Joylashuvi</label>
              <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                 <button 
                  @click="sidebarPosition = 'left'"
                  class="w-8 h-7 rounded flex items-center justify-center transition-all"
                  :class="sidebarPosition === 'left' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600' : 'text-gray-400'"
                 >
                   <i class="fa-solid fa-align-left"></i>
                 </button>
                 <button 
                  @click="sidebarPosition = 'right'"
                  class="w-8 h-7 rounded flex items-center justify-center transition-all"
                  :class="sidebarPosition === 'right' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600' : 'text-gray-400'"
                 >
                   <i class="fa-solid fa-align-right"></i>
                 </button>
              </div>
            </div>

             <div class="setting-row">
              <label class="text-sm text-gray-600 dark:text-gray-300 font-medium">Pastki Panel (Footer)</label>
              <el-switch v-model="footerVisible" size="small" />
            </div>
          </section>

        </div>

        <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="resetSettings"
              class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              <i class="fa-solid fa-rotate-left"></i> Tiklash
            </button>
            <button
              @click="saveSettings"
              class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <i class="fa-solid fa-floppy-disk"></i> Saqlash
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// Props va emits
const props = defineProps({ visible: Boolean });
const emit = defineEmits(["close"]);

// State
const selectedTheme = ref(localStorage.getItem("theme") || "light");
const selectedLang = ref(localStorage.getItem("lang") || "uz");
const fontSize = ref(localStorage.getItem("fontSize") || "medium");
const footerVisible = ref(JSON.parse(localStorage.getItem("footerVisible")) ?? true);
const autoDarkMode = ref(localStorage.getItem("theme") === "dark");
const sidebarPosition = ref(localStorage.getItem("sidebarPosition") || "right");
const selectedAnimationTheme = ref(localStorage.getItem("animation") || "1");

// Options Data
const themeOptions = [
  { value: "light", label: "Classic", color: "#f3f4f6" },
  { value: "dark", label: "Dark", color: "#1f2937" },
  { value: "blue", label: "Ocean", color: "#3b82f6" },
  { value: "green", label: "Forest", color: "#10b981" },
  { value: "purple", label: "Royal", color: "#8b5cf6" },
  { value: "solarized", label: "Sunset", color: "#f59e0b" },
];

const animationThemes = [
  { value: "1", label: "Bahor", icon: "fa-solid fa-seedling", color: "#10b981" },
  { value: "2", label: "Yoz", icon: "fa-solid fa-sun", color: "#facc15" },
  { value: "3", label: "Kuz", icon: "fa-solid fa-leaf", color: "#f97316" },
  { value: "4", label: "Qish", icon: "fa-solid fa-snowflake", color: "#60a5fa" },
];

const languageOptions = [
  { value: "uz", label: "UZB", flag: "https://flagcdn.com/w20/uz.png" },
  { value: "ru", label: "RUS", flag: "https://flagcdn.com/w20/ru.png" },
  { value: "en", label: "ENG", flag: "https://flagcdn.com/w20/gb.png" },
];

const fontSizes = [
  { value: "small", icon_text: "Aa" },
  { value: "medium", icon_text: "Aa+" },
  { value: "large", icon_text: "Aa++" },
];

// Logic
function changeTheme(val) {
  selectedTheme.value = val;
  autoDarkMode.value = val === 'dark';
}

watch(selectedTheme, (val) => {
  localStorage.setItem("theme", val);
  document.documentElement.classList.toggle("dark", val === 'dark');
});

watch(selectedAnimationTheme, (val) => localStorage.setItem("animation", val));

function toggleDarkMode() {
  selectedTheme.value = autoDarkMode.value ? "dark" : "light";
}

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    selectedTheme.value = savedTheme;
    autoDarkMode.value = savedTheme === "dark";
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }
});

function saveSettings() {
  localStorage.setItem("lang", selectedLang.value);
  localStorage.setItem("fontSize", fontSize.value);
  localStorage.setItem("footerVisible", JSON.stringify(footerVisible.value));
  localStorage.setItem("sidebarPosition", sidebarPosition.value);
  emit('close');
  // Bu yerda Toast xabarnoma chiqarish mumkin
}

function resetSettings() {
  selectedTheme.value = "light";
  selectedLang.value = "uz";
  fontSize.value = "medium";
  footerVisible.value = true;
  autoDarkMode.value = false;
  sidebarPosition.value = "right";
  selectedAnimationTheme.value = "1";
  localStorage.clear();
  document.documentElement.classList.remove("dark");
}
</script>

<style scoped>
/* Custom Scrollbar for sleek look */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}

.section-title {
  @apply text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center;
}

.setting-row {
  @apply flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50;
}

/* Element Plus override for clean look */
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  background-color: transparent !important;
}
:deep(.el-input__inner) {
  text-align: right;
  font-weight: 600;
  color: #4b5563;
}
:deep(.dark .el-input__inner) {
  color: #e5e7eb;
}
</style>