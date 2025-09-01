<template>
  <div
    v-show="visible"
    class="border-l border-slate-200 dark:border-slate-400 fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-700 shadow-lg z-50 transition-transform duration-300 flex flex-col"
    :class="{ 'translate-x-0': visible, 'translate-x-full': !visible }"
  >
    <!-- Header -->
    <div
      class="flex justify-between items-center p-4 border-b dark:border-slate-600"
    >
      <h2 class="text-lg font-semibold text-slate-600 dark:text-white">
        Sozlamalar
      </h2>
      <button
        @click="$emit('close')"
        class="text-slate-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
      >
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 space-y-5 flex-1 overflow-y-auto">
      <!-- Mavzu -->
      <div>
        <label class="label">Mavzu</label>
        <el-select
          v-model="selectedTheme"
          placeholder="Mavzu tanlang"
          class="w-full"
        >
          <el-option
            v-for="theme in themeOptions"
            :key="theme.value"
            :value="theme.value"
          >
            <span class="inline-flex items-center">
              <span
                class="w-4 h-4 rounded-full mr-2 border border-black/20"
                :style="{ backgroundColor: theme.color }"
              ></span>
              {{ theme.label }}
            </span>
          </el-option>
        </el-select>
      </div>

      <!-- Til -->
      <div>
        <label class="label">Tillar</label>
        <el-select
          v-model="selectedLang"
          placeholder="Tilni tanlang"
          class="w-full"
        >
          <el-option
            v-for="lang in languageOptions"
            :key="lang.value"
            :value="lang.value"
          >
            <img :src="lang.flag" class="inline w-5 h-4 mr-2 rounded-sm" />
            {{ lang.label }}
          </el-option>
        </el-select>
      </div>

      <!-- Shrift -->
      <div>
        <label class="label">Shrift hajmi</label>
        <el-select
          v-model="fontSize"
          placeholder="Shriftni tanlang"
          class="w-full"
        >
          <el-option
            v-for="size in fontSizes"
            :key="size.value"
            :value="size.value"
          >
            <span class="inline-flex items-center">
              <i :class="size.icon" class="mr-2"></i>
              <span>{{ size.label }}</span>
            </span>
          </el-option>
        </el-select>
      </div>

      <!-- Yon panel joylashuvi -->
      <div>
        <label class="label">Yon panel joylashuvi</label>
        <el-select
          v-model="sidebarPosition"
          placeholder="Joylashuvni tanlang"
          class="w-full"
        >
          <el-option label="Chapda" value="left" />
          <el-option label="O‘ngda" value="right" />
        </el-select>
      </div>

      <!-- Animatsiyalar -->
      <div>
        <label class="label">Animatsiyalar</label>
        <el-select
          v-model="selectedAnimationTheme"
          placeholder="Faslni tanlang"
          class="w-full"
        >
          <el-option
            v-for="anim in animationThemes"
            :key="anim.value"
            :value="anim.value"
            :label="anim.label"
          >
            <span class="inline-flex items-center">
              <i
                :class="anim.icon"
                :style="{ color: anim.color }"
                class="mr-2"
              ></i>
              <span>{{ anim.label }}</span>
            </span>
          </el-option>
        </el-select>
      </div>

      <!-- Switchlar -->
      <div class="flex items-center justify-between">
        <span class="label">Pastki panel</span>
        <el-switch v-model="footerVisible" @change="toggleFooter" />
      </div>

      <div class="flex items-center justify-between">
        <span
          class="text-[13px] font-semibold text-slate-600 dark:text-gray-300"
          >Tungi rejim</span
        >
        <el-switch v-model="autoDarkMode" @change="toggleDarkMode" />
      </div>
    </div>

    <!-- Footer Buttons -->
    <div
      class="flex justify-end items-center p-4 border-t dark:border-slate-600 bg-white dark:bg-slate-700"
    >
      <div class="flex gap-2 w-full justify-end">
        <button
          @click="saveSettings"
          class="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition"
        >
          <i class="fa-solid fa-check text-xs"></i>
          Saqlash
        </button>
        <button
          @click="resetSettings"
          class="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition"
        >
          <i class="fa-solid fa-arrows-rotate text-xs"></i>
          Restart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// Props va emits
const props = defineProps({ visible: Boolean });
const emit = defineEmits(["close", "update:animationTheme"]);

// Reaktiv o‘zgaruvchilar
const selectedTheme = ref(localStorage.getItem("theme") || "light");
const selectedLang = ref("uz");
const fontSize = ref("medium");
const footerVisible = ref(true);
const autoDarkMode = ref(false);
const autoFooterMode = ref(true);
const sidebarPosition = ref("right");
const selectedAnimationTheme = ref(localStorage.getItem("animation") || "1");

// Watchers
watch(selectedTheme, (val) => {
  localStorage.setItem("theme", val);
});
watch(selectedAnimationTheme, (val) => {
  localStorage.setItem("animation", val);
});

// Dark rejimni almashtirish
function toggleDarkMode() {
  if (autoDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}
function toggleFooter() {
  if (autoFooterMode.value) {
    document.documentElement.classList.add("visabel");
    localStorage.setItem("footer", "visabel");
  } else {
    document.documentElement.classList.remove("hiddin");
    localStorage.setItem("footer", "hiddin");
  }
}

// Dastlabki holat
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const savedFooter = localStorage.getItem("footer");
  autoDarkMode.value = savedTheme === "dark";
  autoFooterMode.value = savedFooter === "hiddin";

  if (autoDarkMode.value) {
    document.documentElement.classList.add("dark");
  }
  if (autoFooterMode.value) {
    document.documentElement.classList.add("visible");
  }
});

// Sozlamalarni saqlash
function saveSettings() {
  localStorage.setItem("theme", selectedTheme.value);
  localStorage.setItem("lang", selectedLang.value);
  localStorage.setItem("fontSize", fontSize.value);
  localStorage.setItem("footerVisible", JSON.stringify(footerVisible.value));
  localStorage.setItem("sidebarPosition", sidebarPosition.value);
  localStorage.setItem("animation", selectedAnimationTheme.value);
  console.log("Sozlamalar saqlandi");
}

// Default holatga qaytarish
function resetSettings() {
  selectedTheme.value = "light";
  selectedLang.value = "uz";
  fontSize.value = "medium";
  footerVisible.value = true;
  autoDarkMode.value = false;
  sidebarPosition.value = "right";
  selectedAnimationTheme.value = "1";
  document.documentElement.classList.remove("dark");
  localStorage.clear();
}

// Variantlar ro‘yxati
const themeOptions = [
  { value: "light", label: "Yorug‘", color: "#ffffff" },
  { value: "dark", label: "Qorong‘i", color: "#1f2937" },
  { value: "blue", label: "Moviy (Ocean)", color: "#3b82f6" },
  { value: "green", label: "Yashil (Nature)", color: "#10b981" },
  { value: "purple", label: "Binafsha (Lavender)", color: "#8b5cf6" },
  { value: "gray", label: "Kulrang (Minimal)", color: "#9ca3af" },
  { value: "solarized", label: "Solarized", color: "#fcd34d" },
  { value: "dracula", label: "Dracula", color: "#44475a" },
  { value: "high-contrast", label: "Yuqori Kontrast", color: "#000000" },
];

const languageOptions = [
  { value: "uz", label: "O‘zbek", flag: "https://flagcdn.com/w40/uz.png" },
  { value: "ru", label: "Rus", flag: "https://flagcdn.com/w40/ru.png" },
  { value: "en", label: "Ingliz", flag: "https://flagcdn.com/w40/gb.png" },
];

const fontSizes = [
  { value: "small", label: "Kichik", icon: "fa-solid fa-text-height text-sm" },
  { value: "medium", label: "O‘rta", icon: "fa-solid fa-font text-base" },
  { value: "large", label: "Katta", icon: "fa-solid fa-text-width text-lg" },
];

const animationThemes = [
  {
    value: "1",
    label: "Bahor",
    icon: "fa-solid fa-seedling",
    color: "#10b981",
  },
  { value: "2", label: "Yoz", icon: "fa-solid fa-sun", color: "#facc15" },
  { value: "3", label: "Kuz", icon: "fa-solid fa-leaf", color: "#f97316" },
  {
    value: "4",
    label: "Qish",
    icon: "fa-solid fa-snowflake",
    color: "#60a5fa",
  },
];
</script>

<style scoped>
.label {
  @apply block text-[13px] font-semibold text-slate-600 dark:text-gray-300 mb-1;
}
</style>
