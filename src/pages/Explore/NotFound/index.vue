<template>
  <!-- component -->
  <main
    class="h-screen w-full flex flex-col justify-center items-center bg-gray-700"
  >
    <h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
    <div
      class="bg-yellow-500 text-[16px] px-2 py-1 text-sm rounded rotate-12 absolute"
    >
      Page Not Found
    </div>
    <button class="mt-10">
      <a
        class="relative inline-block text-sm font-medium text-yellow-500 group active:text-orange-500 focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-yellow-500 group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span
          class="relative block px-8 py-3 bg-gray-700 border border-current"
        >
          <router-link to="/explore">Go Home</router-link>
        </span>
      </a>
    </button>
  </main>
</template>

<style></style>
