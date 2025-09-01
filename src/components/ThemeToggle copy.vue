<template>
  <div class="relative" ref="target">
    <!-- Trigger -->
    <button
      @click="dropdownOpen = !dropdownOpen"
      class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-md"
    >
      <!-- Icon -->
      <svg
        v-if="!isDark"
        class="w-5 h-5 text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm..." />
        <circle cx="10" cy="10" r="3" />
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M17.293 13.293a8 8 0 01-10.586-10.586A8 8 0 1017.293 13.293z"
        />
      </svg>
    </button>

    <!-- Dropdown menyu -->
    <transition name="fade">
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-50"
      >
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Tungi rejimni yoqish/o‘chirish
        </p>
        <button
          @click="
            toggleDark();
            dropdownOpen = false;
          "
          class="mt-2 w-full py-2 px-3 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          {{ isDark ? "Oq rejim" : "Tungi rejim" }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useDark, useToggle, onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
});
const toggleDark = useToggle(isDark);

const dropdownOpen = ref(false);
const target = ref(null);

// tashqarisini bosganda yopish
onClickOutside(target, () => {
  dropdownOpen.value = false;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
