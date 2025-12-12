<script setup>
import { ref } from "vue";
import Sidebar from "../partials/Sidebar.vue";
import Header from "../partials/Header.vue";
import Footer from "../partials/Footer.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-sans">
    
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" class="sticky top-0 z-10" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
        
        <div class="mx-auto w-full p-2 md:p-2 lg:p-2 min-h-[calc(100vh-130px)]">
          
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>

        </div>

        <Footer />
        
      </main>

    </div>
  </div>
</template>

<style>
/* ========================================================================= */
/* SCROLLBARNI YASHIRISH (Lekin scroll ishlashini saqlab qolish) */
/* ========================================================================= */

/* Chrome, Safari va Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
}

/* IE, Edge va Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE va Edge */
  scrollbar-width: none;  /* Firefox */
}

/* ========================================================================= */
/* PAGE TRANSITION ANIMATION (Fade Effect) */
/* ========================================================================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>