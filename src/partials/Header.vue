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
      <div class="flex items-center justify-between h-16 -mb-px">
        <!-- Header: Left side -->
        <div class="flex">
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
        </div>

        <div class="flex items-center gap-1 flex-wrap md:flex-nowrap">
<Help/>

          <!-- Sana & vaqt -->
          <div
            class="text-sm text-gray-600 flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 shadow-sm"
          >
            <i class="fa-solid fa-calendar-days text-indigo-500"></i>
            <span>{{ currentDate }}</span>
            <i class="fa-solid fa-clock text-indigo-500 ml-2"></i>
            <span>{{ currentTime }}</span>
          </div>
          <!-- Select menyu (faqat harakatlar uchun) -->
          <div class="relative min-w-[24px] min-h-[24px]">
            <!-- Trigger -->
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="bg-slate-100 rounded-full px-3 py-2 text-sm text-gray-700 w-full flex justify-center items-center shadow"
            >
              <i class="fa-solid fa-sliders text-base"></i>
            </button>

            <!-- Menu -->
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
                class="absolute right-0 z-50 mt-2 w-48 bg-white border dark:bg-slate-700 border-slate-200 rounded-lg shadow-lg divide-y divide-slate-100"
              >
                <li
                  v-for="item in actions"
                  :key="item.value"
                  @click="handleMobileAction(item.value)"
                  class="px-4 py-2 text-sm text-slate-700 dark:text-white dark:hover:bg-slate-600 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                >
                  <i :class="item.icon"></i>
                  {{ item.label }}
                </li>
              </ul>
            </transition>
          </div>

          <!-- Profil menyusi -->
          <UserMenu align="right" />

          <!-- Qidiruv modal -->
          <SearchModal
            id="search-modal"
            searchId="search"
            :modalOpen="searchModalOpen"
            @open-modal="searchModalOpen = true"
            @close-modal="searchModalOpen = false"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import ThemeSidebar from "./Settings/ThemeSidebar.vue";
import HeaderAnimatsion from "./Settings/HeaderAnimatsion.vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

import SearchModal from "../components/ModalSearch.vue";
import Notifications from "../components/DropdownNotifications.vue";
import Help from "../components/DropdownHelp.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import UserMenu from "../components/DropdownProfile.vue";

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

    // Boshlanish qiymatini localStorage'dan olamiz yoki '0' qilamiz
    const selectedAnimationTheme = ref(
      localStorage.getItem("animation") || defaultAnimation
    );

    // Har 500ms da tekshiradi, localStorage'dagi o‘zgarishlarni muntazam aniqlaydi
    setInterval(() => {
      const newValue = localStorage.getItem("animation") || defaultAnimation;
      if (selectedAnimationTheme.value !== newValue) {
        selectedAnimationTheme.value = newValue;
      }
    }, 500); // Har yarim soniyada tekshiradi

    // Sidebar funksiyalari
    const openEdoSidebar = () => {
      window.dispatchEvent(new Event("toggle-edo-sidebar"));
    };

    const openChatSidebar = () => {
      window.dispatchEvent(new Event("toggle-chat-sidebar"));
    };
    const themeSidebarOpen = ref(false);
    const animationTheme = ref(0);
    // Pinia store

    // Breadcrumbs
    const breadcrumbs = computed(() =>
      route.matched.map((r) => ({
        path: r.path,
        label: r.name,
      }))
    );

    const goBack = () => {
      router.go(-1);
    };

    // Sana va vaqt
    const currentDate = ref("");
    const currentTime = ref("");

    const updateTime = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString("uz-UZ");
      currentTime.value = now.toLocaleTimeString("uz-UZ");
    };

    // Dropdown holati
    const dropdownOpen = ref(false);
    const dropdownRef = ref(null); // dropdown uchun ref

    // Search modal holati
    const searchModalOpen = ref(false);

    // Dropdown menyudagi actionlar
    const actions = [
      { value: "edo", label: "EDO", icon: "fa-solid fa-folder-tree" },
      { value: "chat", label: "Chat", icon: "fa-solid fa-comments" },
      {
        value: "search",
        label: "Qidiruv",
        icon: "fa-solid fa-magnifying-glass",
      },
      {
        value: "notifications",
        label: "Bildirishnoma",
        icon: "fa-solid fa-bell",
      },
      { value: "help", label: "Yordam", icon: "fa-solid fa-circle-question" },
      {
        value: "theme",
        label: "Mavzu",
        icon: "fa-solid fa-circle-half-stroke",
      },
    ];

    const handleMobileAction = (action) => {
      dropdownOpen.value = false;
      switch (action) {
        case "edo":
          openEdoSidebar();
          break;
        case "chat":
          openChatSidebar();
          break;
        case "search":
          searchModalOpen.value = true;
          break;
        case "notifications":
          // TODO: add notifications logic
          break;
        case "help":
          // TODO: add help logic
          break;
        case "theme":
          themeSidebarOpen.value = true;
          break;
        default:
          break;
      }
    };

    // Sahifaning tashqi joyi bosilganda dropdownni yopish
    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false;
      }
    };

    onMounted(() => {
      updateTime();
      setInterval(updateTime, 1000);
      window.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("click", handleClickOutside);
    });

    return {
      goBack,
      breadcrumbs,
      currentDate,
      currentTime,
      dropdownOpen,
      dropdownRef,
      searchModalOpen,
      actions,
      handleMobileAction,
      openEdoSidebar,
      openChatSidebar,
      themeSidebarOpen,
      selectedAnimationTheme,
    };
  },
};
</script>
