<template>
  <ThemeSidebar
    :visible="themeSidebarOpen"
    @close="themeSidebarOpen = false"
    @update="animationTheme = 0"
  />

  <header
    :class="[
      'sticky top-0 border-b border-slate-200 dark:border-slate-400 z-30',
    ]"
    class="bg-white/80 dark:bg-slate-600/80 backdrop-blur bg-repeat bg-center bg-cover"
  >
    <!-- Animatsion fon -->
    <HeaderAnimatsion class="z-1" :season="selectedAnimationTheme" />

    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 h-16 w-full">
        <!-- Hamburger button -->
        <button
          class="text-slate-500 hover:text-slate-600 lg:hidden"
          @click.stop="$emit('toggle-sidebar')"
          aria-controls="sidebar"
          :aria-expanded="sidebarOpen"
        >
          <span class="sr-only">Open sidebar</span>
          <svg
            class="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="5" width="16" height="2" />
            <rect x="4" y="11" width="16" height="2" />
            <rect x="4" y="17" width="16" height="2" />
          </svg>
        </button>

        <!-- Back/Forward/Reload -->
        <div
          class="flex items-center gap-2 px-2 rounded-lg shadow-sm bg-white border border-slate-200 dark:bg-slate-700 dark:border-slate-600 backdrop-blur-sm"
        >
          <button
            @click="goBack"
            class="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 transition-colors duration-200"
            title="Back"
          >
            <i class="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <button
            @click="goForward"
            class="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 transition-colors duration-200"
            title="Forward"
          >
            <i class="fa-solid fa-arrow-right text-sm"></i>
          </button>
          <button
            @click="goReload"
            class="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 transition-colors duration-200"
            title="Reload"
          >
            <i class="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>

        <!-- Tabs -->
        <div
          class="flex-1 mx-2 flex items-center  overflow-x-auto whitespace-nowrap relative
                 bg-white dark:bg-slate-700 rounded-lg shadow-sm custom-scroll py-1 px-3 border border-slate-200 dark:border-none "
        >
          <div
            v-for="tab in openTabs"
            :key="tab.path"
            @click="goToTab(tab.path)"
            class="relative flex items-center justify-center gap-2 px-2 py-0.5 cursor-pointer flex-shrink-0 rounded-md transition-colors duration-150 group select-none"
          >
            <!-- Active underline -->
            <div
              v-if="tab.path === route.path"
              class="absolute bottom-0 left-1 right-1 h-[2px] bg-indigo-500 rounded-t-md transition-all duration-150"
            ></div>

            <!-- Label -->
            <span
              class="truncate max-w-[600px]  text-[12px] font-medium text-center flex items-center justify-center transition-colors duration-150"
              :class="[
                tab.path === route.path
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-300 group-hover:text-indigo-500',
              ]"
            >
              {{ tab.label }}
            </span>

            <!-- Close button -->
            <button
              @click.stop="closeTab(tab.path)"
              class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-200"
            >
              <i class="fa-solid fa-xmark text-[12px]"></i>
            </button>
          </div>
        </div>

        <!-- Date & Time -->
        <div
          class="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg shadow-sm bg-indigo-50 border border-indigo-200 dark:bg-slate-700 dark:border-slate-600 text-gray-700 dark:text-gray-200 flex-shrink-0"
        >
          <i class="fa-solid fa-calendar-days text-indigo-500 dark:text-indigo-400"></i>
          <span>{{ currentDate }}</span>
          <i class="fa-solid fa-clock ml-2 text-indigo-500 dark:text-indigo-400"></i>
          <span>{{ currentTime }}</span>
        </div>

        <!-- Settings Dropdown -->
        <div class="relative flex-shrink-0" ref="dropdownRef">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center justify-center w-9 h-9 rounded-full shadow
                   bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200
                   hover:bg-indigo-100 dark:hover:bg-indigo-600 transition-colors duration-200 focus:outline-none"
            title="Settings"
          >
            <i class="fa-solid fa-sliders text-base"></i>
          </button>

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ul
              v-show="dropdownOpen"
              class="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden"
            >
              <li
                v-for="item in actions"
                :key="item.value"
                @click="handleMobileAction(item.value)"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-600 cursor-pointer transition-colors duration-150"
              >
                <i :class="item.icon"></i>
                {{ item.label }}
              </li>
            </ul>
          </transition>
        </div>

        <!-- Profile Menu -->
        <UserMenu align="right" />

        <!-- Search Modal -->
        <SearchModal
          id="search-modal"
          searchId="search"
          :modalOpen="searchModalOpen"
          @open-modal="searchModalOpen = true"
          @close-modal="searchModalOpen = false"
        />
      </div>
    </div>
  </header>
</template>


<script>
import ThemeSidebar from "./Settings/ThemeSidebar.vue";
import HeaderAnimatsion from "./Settings/HeaderAnimatsion.vue";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import SearchModal from "../components/ModalSearch.vue";
import Notifications from "../components/DropdownNotifications.vue";
import Help from "../components/DropdownHelp.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import UserMenu from "../components/DropdownProfile.vue";
// import { DocumentsStore } from "../stores/Reception/documents/document.store.js";

export default {
  name: "Header",
  props: ["sidebarOpen"],
  components: {
    SearchModal,
    Notifications,
    Help,
    ThemeToggle,
    UserMenu,
    ThemeSidebar,
    HeaderAnimatsion,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const defaultAnimation = "0";
    const selectedAnimationTheme = ref(
      localStorage.getItem("animation") || defaultAnimation
    );

    setInterval(() => {
      const newValue = localStorage.getItem("animation") || defaultAnimation;
      if (selectedAnimationTheme.value !== newValue) {
        selectedAnimationTheme.value = newValue;
      }
    }, 500);

    // Sidebar funksiyalar
    const themeSidebarOpen = ref(false);

    // Sana & vaqt
    const currentDate = ref("");
    const currentTime = ref("");
    const updateTime = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString("uz-UZ");
      currentTime.value = now.toLocaleTimeString("uz-UZ");
    };

    // === 🧩 Tabs boshqaruvi ===
    const openTabs = ref(JSON.parse(localStorage.getItem("openTabs") || "[]"));

    const addTab = (r) => {
      if (!r.name) return;
      const exists = openTabs.value.some((t) => t.path === r.fullPath);
      if (!exists) {
        openTabs.value.push({ path: r.fullPath, label: r.name });
        saveTabs();
      }
    };

    const closeTab = (path) => {
      const index = openTabs.value.findIndex((t) => t.path === path);
      if (index !== -1) {
        openTabs.value.splice(index, 1);
        saveTabs();
        if (route.fullPath === path && openTabs.value.length) {
          const nextTab = openTabs.value[index - 1] || openTabs.value[0];
          router.push(nextTab.path);
        }
      }
    };

    const goToTab = (path) => router.push(path);
    const saveTabs = () =>
      localStorage.setItem("openTabs", JSON.stringify(openTabs.value));

    onMounted(() => {
      addTab(route);
      watch(
        () => route.fullPath,
        () => addTab(route)
      );

      updateTime();
      setInterval(updateTime, 1000);
      window.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("click", handleClickOutside);
    });

    // Dropdown
    const dropdownOpen = ref(false);
    const dropdownRef = ref(null);
    const searchModalOpen = ref(false);

    const actions = [
      { value: "edo", label: "EDO", icon: "fa-solid fa-folder-tree" },
      { value: "chat", label: "Chat", icon: "fa-solid fa-comments" },
      {
        value: "search",
        label: "Qidiruv",
        icon: "fa-solid fa-magnifying-glass",
      },
      {
        value: "theme",
        label: "Mavzu",
        icon: "fa-solid fa-circle-half-stroke",
      },
    ];

    const handleMobileAction = (action) => {
      dropdownOpen.value = false;
      if (action === "theme") themeSidebarOpen.value = true;
      else if (action === "search") searchModalOpen.value = true;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false;
      }
    };

    const goBack = () => router.go(-1);
    const goForward = () => router.go(1);
    const goReload = () => window.location.reload();

    return {
      goBack,
      goForward,
      goReload,
      currentDate,
      currentTime,
      dropdownOpen,
      dropdownRef,
      searchModalOpen,
      actions,
      handleMobileAction,
      themeSidebarOpen,
      selectedAnimationTheme,
      openTabs,
      closeTab,
      goToTab,
      route,
    };
  },
};
</script>

<style scoped>
/* 🔹 Ultra-thin, hover-only scroll */
.custom-scroll {
  overflow-x: auto;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: transparent transparent; /* default invisible */
}

/* WebKit browsers */
.custom-scroll::-webkit-scrollbar {
  height: 3px; /* juda yupqa */
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: transparent; /* normal holatda ko‘rinmas */
  border-radius: 9999px;
  transition: background-color 0.3s ease, height 0.3s ease;
}

/* Hoverda scroll ko‘rinadi */
.custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(99, 102, 241, 0.7); /* indigo-500, minimal */
  height: 2px; /* faqat hoverda biroz ko‘proq */
}

/* Dark mode */
.dark .custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(129, 140, 248, 0.7);
}
</style>