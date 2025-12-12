<template>
  <div class="relative inline-flex">
    <!-- Trigger -->
    <button
      ref="trigger"
      class="inline-flex items-center justify-center focus:outline-none border-2 border-indigo-500 rounded-full shadow-sm w-9 h-9 overflow-hidden"
      aria-haspopup="true"
      :aria-expanded="dropdownOpen"
      @click.prevent="dropdownOpen = !dropdownOpen"
    >
      <img
        class="w-full h-full object-cover"
        src="https://i.pinimg.com/1200x/23/d1/3a/23d13a1dbad6a60319413ec2512aed29.jpg"
        alt="User Avatar"
      />
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-show="dropdownOpen"
        ref="dropdown"
        class="absolute right-0 mt-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-60"
      >
        <!-- User info -->
        <div
          class="px-4 py-3 border-b border-slate-200 dark:border-slate-700 text-left"
        >
          <div class="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {{ fullname || username }}
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 italic truncate">
            {{ department }} bo'limi
          </div>
        </div>

        <!-- Menu items -->
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li>
            <router-link
              :to="{ name: 'profile_card' }"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-200"
              @click="dropdownOpen = false"
            >
              <i class="fas fa-user"></i> Mening profilim
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'profile_settings' }"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-200"
              @click="dropdownOpen = false"
            >
              <i class="fas fa-cog"></i> Sozlamalar
            </router-link>
          </li>
          <li>
            <button
              @click="logout"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
              <i class="fas fa-sign-out-alt"></i> Chiqish
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import Cookie from "js-cookie";

export default {
  name: "DropdownProfile",
  setup() {
    const dropdownOpen = ref(false);
    const trigger = ref(null);
    const dropdown = ref(null);

    const account = JSON.parse(Cookie.get("account") || "{}");
    const username = ref(account.username || "");
    const department = ref(account.department || "");
    const fullname = ref(account.fullname || "");

    function logout() {
      Cookie.remove("token");
      Cookie.remove("account");
      dropdownOpen.value = false;
      setTimeout(() => window.location.reload(), 500);
    }

    const clickHandler = ({ target }) => {
      if (!dropdownOpen.value) return;
      if (
        !dropdown.value.contains(target) &&
        !trigger.value.contains(target)
      ) {
        dropdownOpen.value = false;
      }
    };

    const keyHandler = ({ keyCode }) => {
      if (dropdownOpen.value && keyCode === 27) dropdownOpen.value = false;
    };

    onMounted(() => {
      document.addEventListener("click", clickHandler);
      document.addEventListener("keydown", keyHandler);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    });

    return {
      dropdownOpen,
      trigger,
      dropdown,
      logout,
      username,
      department,
      fullname,
    };
  },
};
</script>
