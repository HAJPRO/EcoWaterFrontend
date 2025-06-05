<template>
  <div>
    <!-- Sidebar backdrop (mobile only) -->
    <div
      class="fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
    ></div>

    <!-- Sidebar -->
    <div
      id="sidebar"
      ref="sidebar"
      class="flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-64'"
    >
      <!-- Sidebar header -->
      <div class="flex justify-between mb-5 ml-2 sm:px-2">
        <!-- Logo -->
        <div>
          <router-link class="flex" to="/explore">
            <img
              class="rounded-[50%] ml-[-20px]"
              src="../../public/eco_logo.jpg"
              style="width: 50px; height: 50px"
              alt="logo"
            />
            <h5 class="text-white mt-3 ml-7 font-serif font-bold">Eco Water</h5>
          </router-link>
          <div class="mt-4 ml-[-30px] border-b-[0.2px] w-screen"></div>
        </div>
        <!-- Close button -->
        <button
          ref="trigger"
          class="lg:hidden text-slate-500 hover:text-slate-400"
          @click.stop="$emit('close-sidebar')"
          aria-controls="sidebar"
          :aria-expanded="sidebarOpen"
        >
          <span class="sr-only">Close sidebar</span>
          <svg
            class="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z"
            />
          </svg>
        </button>
      </div>

      <!-- Links -->
      <div class="space-y-5">
        <!-- Dashboard group -->
        <div>
          <h3
            @click="is_dashboard = !is_dashboard"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Dashboard
              </span>
              <i
                v-if="is_dashboard === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_dashboard === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_dashboard === true">
            <!-- Dashboard statistik -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M29.43 26.34A1.47 1.47 0 0 1 28 25.22l-3.14-12.07l-3.12 12.07a1.49 1.49 0 0 1-1.45 1.12a1.49 1.49 0 0 1-1.46-1.12l-3.12-12.07l-3.11 12.07a1.51 1.51 0 0 1-2.91 0L6.57 13.15l-1.35 5.22H2a1 1 0 0 1 0-2h1.67l1.45-5.59a1.48 1.48 0 0 1 1.45-1.12A1.47 1.47 0 0 1 8 10.78l3.12 12.07l3.12-12.07a1.49 1.49 0 0 1 1.45-1.12a1.49 1.49 0 0 1 1.46 1.12l3.12 12.07l3.12-12.07a1.5 1.5 0 0 1 2.9 0l3.12 12.07l1.35-5.22H34a1 1 0 0 1 0 2h-1.67l-1.45 5.59a1.48 1.48 0 0 1-1.45 1.12"
                          class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Statistika
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'StatisticSale' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Sotuv statistikasi</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="856"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ombor zaxirasi, xarajatlar va foyda</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="8552"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ishlab chiqarilgan suv hajmi (kunlik, oylik)</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="5693"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ishchilar samaradorligi</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>
        <!-- Ishlab chiqarish group -->
        <div>
          <h3
            @click="is_production = !is_production"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Ishlab chiqarish
              </span>
              <i
                v-if="is_production === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_production === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_production === true">
            <!-- //suv tozalash// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M34 30H2a1 1 0 0 0 0 2h32a1 1 0 0 0 0-2"
                          class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path
                          fill="#24a8e5"
                          d="M16 5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v23h10Zm-2 21H8V6h6Z"
                          class="clr-i-outline clr-i-outline-path-2"
                        />
                        <path
                          fill="#24a8e5"
                          d="M30 13a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v15h10Zm-2 13h-6V14h6Z"
                          class="clr-i-outline clr-i-outline-path-3"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Suv tozalash
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- // idish to‘ldirish// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                        />
                        <path
                          fill="#24a8e5"
                          d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                        />
                        <path
                          fill="#24a8e5"
                          d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >
                        Idish to'ldirish
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- qadoqlash  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 6V4h-3V2h-2v2h-1c-1.103 0-2 .898-2 2v2c0 1.103.897 2 2 2h4v2h-6v2h3v2h2v-2h1c1.103 0 2-.897 2-2v-2c0-1.102-.897-2-2-2h-4V6zm-6 14v2h2.586L23 25.586l-2.292-2.293a1 1 0 0 0-.706-.293H20a.997.997 0 0 0-.706.293L14 28.586L15.414 30l4.587-4.586l2.292 2.293a1 1 0 0 0 1.414 0L28 23.414V26h2v-6zM4 30H2v-5c0-3.86 3.14-7 7-7h6c1.989 0 3.89.85 5.217 2.333l-1.49 1.334A5.008 5.008 0 0 0 15 20H9c-2.757 0-5 2.243-5 5zm8-14a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0-12a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                        />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Qadoqlash
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Orders' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Buyurtalar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Sifat nazorati  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 6V4h-3V2h-2v2h-1c-1.103 0-2 .898-2 2v2c0 1.103.897 2 2 2h4v2h-6v2h3v2h2v-2h1c1.103 0 2-.897 2-2v-2c0-1.102-.897-2-2-2h-4V6zm-6 14v2h2.586L23 25.586l-2.292-2.293a1 1 0 0 0-.706-.293H20a.997.997 0 0 0-.706.293L14 28.586L15.414 30l4.587-4.586l2.292 2.293a1 1 0 0 0 1.414 0L28 23.414V26h2v-6zM4 30H2v-5c0-3.86 3.14-7 7-7h6c1.989 0 3.89.85 5.217 2.333l-1.49 1.334A5.008 5.008 0 0 0 15 20H9c-2.757 0-5 2.243-5 5zm8-14a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0-12a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                        />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Sifat nazorati
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Orders' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Laboratoriya natijalari</span
                          >
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Qayta ishlashga yuborilganlari</span
                          >
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Rad etilgan partiyalar statistikasi</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- xom ashyo  ombori  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.008 7.008 0 0 1 7 7zm-8 0h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7zM20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14m-8 2a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Ombor(xom ashyo)
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="#"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mijozlar
                          </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Tayyor mahsulot ombori  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.008 7.008 0 0 1 7 7zm-8 0h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7zM20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14m-8 2a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Ombor(tayyor mahsulot)
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'ReadyWarehouse' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mijozlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>
        <!-- Bo'limlar group -->
        <div>
          <h3
            @click="is_departments = !is_departments"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Bo'limlar
              </span>
              <i
                v-if="is_departments === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_departments === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_departments === true">
            <!-- //Accountant// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M28 2H8a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M8 32V4h20v28Z"
                          class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path
                          fill="#24a8e5"
                          d="M12 8h13.67V6H11a1 1 0 0 0-1 1v4.67h2Z"
                          class="clr-i-outline clr-i-outline-path-2"
                        />
                        <path
                          fill="#24a8e5"
                          d="M12 16h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-3"
                        />
                        <path
                          fill="#24a8e5"
                          d="M24 16h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-4"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18 16h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-5"
                        />
                        <path
                          fill="#24a8e5"
                          d="M12 22h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-6"
                        />
                        <path
                          fill="#24a8e5"
                          d="M24 22h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-7"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18 22h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-8"
                        />
                        <path
                          fill="#24a8e5"
                          d="M12 28h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-9"
                        />
                        <path
                          fill="#24a8e5"
                          d="M24 28h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-10"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18 28h-2v2h4v-4h-2z"
                          class="clr-i-outline clr-i-outline-path-11"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Buhgalterya
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar boshqaruvi</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="8596"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Asosiy vositalarni ro'yxatga olish</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="8569"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ish haqi, bonuslar, jarimalar</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="79"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Hisobvaraqlar reestri
                          </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="78"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Kassa kirim-chiqim hujjatlari
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="70"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Debit/Kredit
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="88"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Bank to‘lovlari va kirimlar
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="81"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mijozlardan qarzdorlik (Debitor) nazorati
                          </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- //HR// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                        />
                        <path
                          fill="#24a8e5"
                          d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                        />
                        <path
                          fill="#24a8e5"
                          d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Kadrlar
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar boshqaruvi</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Sale  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 6V4h-3V2h-2v2h-1c-1.103 0-2 .898-2 2v2c0 1.103.897 2 2 2h4v2h-6v2h3v2h2v-2h1c1.103 0 2-.897 2-2v-2c0-1.102-.897-2-2-2h-4V6zm-6 14v2h2.586L23 25.586l-2.292-2.293a1 1 0 0 0-.706-.293H20a.997.997 0 0 0-.706.293L14 28.586L15.414 30l4.587-4.586l2.292 2.293a1 1 0 0 0 1.414 0L28 23.414V26h2v-6zM4 30H2v-5c0-3.86 3.14-7 7-7h6c1.989 0 3.89.85 5.217 2.333l-1.49 1.334A5.008 5.008 0 0 0 15 20H9c-2.757 0-5 2.243-5 5zm8-14a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0-12a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                        />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Sotuv
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Products' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mahsulotlar boshqaruvi</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      :to="{ name: 'Orders' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Buyurtmalar boshqaruvi</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Customers  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.008 7.008 0 0 1 7 7zm-8 0h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7zM20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14m-8 2a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Mijozlar
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: `CustomersManagement` }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mijozlar boshqaruvi</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Drivers  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M15 17h3v2h-3z"
                          class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path
                          fill="#24a8e5"
                          d="M26.45 14.17A22.1 22.1 0 0 0 19.38 7a9.64 9.64 0 0 0-9-.7a8.6 8.6 0 0 0-4.82 6.4c-.08.47-.14.92-.2 1.36A4 4 0 0 0 2 18v6.13a2 2 0 0 0 2 2V18a2 2 0 0 1 2-2h18.73A7.28 7.28 0 0 1 32 23.27V24h-2a4.53 4.53 0 1 0 .33 2H32a2 2 0 0 0 2-2v-.73a9.28 9.28 0 0 0-7.55-9.1M11 14H6.93c0-.31.09-.63.15-1A6.52 6.52 0 0 1 11 8Zm2 0V7.58a8.17 8.17 0 0 1 5.36 1.16A19 19 0 0 1 23.9 14Zm12.8 14.38a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5"
                          class="clr-i-outline clr-i-outline-path-2"
                        />
                        <path
                          fill="#24a8e5"
                          d="M14.17 24a4.53 4.53 0 1 0 .33 2h5.3v-.25A6 6 0 0 1 20 24ZM10 28.38a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5"
                          class="clr-i-outline clr-i-outline-path-3"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Logistika
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Monitoring' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >GPS nazorati</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="25"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Haydovchilar</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="3"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mashinalar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Agents  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M11.09 14.57h.31a6.43 6.43 0 0 1 .09-2a2.09 2.09 0 1 1 1.47-3a6.58 6.58 0 0 1 1.55-1.31a4.09 4.09 0 1 0-3.42 6.33Z"
                          class="clr-i-outline--alerted clr-i-outline-path-1--alerted"
                        />
                        <path
                          fill="#24a8e5"
                          d="M13 18.14a6.53 6.53 0 0 1-1.28-2.2h-.63a8.67 8.67 0 0 0-6.43 2.52l-.24.28v7h2v-6.23a7 7 0 0 1 4.67-1.6a8.09 8.09 0 0 1 1.91.23"
                          class="clr-i-outline--alerted clr-i-outline-path-2--alerted"
                        />
                        <path
                          fill="#24a8e5"
                          d="M31.35 18.42A8.59 8.59 0 0 0 25 15.91c-.32 0-.6 0-.9.06a6.53 6.53 0 0 1-1.35 2.25a7.9 7.9 0 0 1 2.25-.31a6.94 6.94 0 0 1 4.64 1.58v6.27h2V18.7Z"
                          class="clr-i-outline--alerted clr-i-outline-path-3--alerted"
                        />
                        <path
                          fill="#24a8e5"
                          d="M18.1 19.73a9.69 9.69 0 0 0-7.1 2.74l-.25.28v7.33a1.57 1.57 0 0 0 1.61 1.54h11.47a1.57 1.57 0 0 0 1.61-1.54v-7.35l-.25-.28a9.58 9.58 0 0 0-7.09-2.72m5.33 9.88h-10.7v-6.06a8.08 8.08 0 0 1 5.37-1.82a8 8 0 0 1 5.33 1.8Z"
                          class="clr-i-outline--alerted clr-i-outline-path-4--alerted"
                        />
                        <path
                          fill="#24a8e5"
                          d="M20.28 14.27a2.46 2.46 0 1 1-2.42-2.89a2.44 2.44 0 0 1 1 .24a3.67 3.67 0 0 1 .43-2a4.41 4.41 0 0 0-1.48-.27A4.47 4.47 0 1 0 22.14 15a3.69 3.69 0 0 1-1.86-.73"
                          class="clr-i-outline--alerted clr-i-outline-path-5--alerted"
                        />
                        <path
                          fill="#24a8e5"
                          d="m27.18.8l-5.72 9.91a1.28 1.28 0 0 0 1.1 1.91H34a1.28 1.28 0 0 0 1.1-1.91L29.39.8a1.28 1.28 0 0 0-2.21 0"
                          class="clr-i-outline--alerted clr-i-outline-path-6--alerted clr-i-alert"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Agentlar
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Monitoring' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Monitoring</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Omborlar  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M7 7.76v2.09a43.53 43.53 0 0 0 11 1.27a54.82 54.82 0 0 0 6.2-.36a7.5 7.5 0 0 1-1.13-1.88c-1.5.15-3.2.24-5.07.24A37.6 37.6 0 0 1 7 7.76"
                          class="clr-i-outline--badged clr-i-outline-path-1--badged"
                        />
                        <path
                          fill="#24a8e5"
                          d="M31 13.43v.82c-.33.86-5.06 2.45-13 2.45a37.45 37.45 0 0 1-11-1.36v2.08a43.33 43.33 0 0 0 11 1.28c4 0 9.93-.48 13-2v5.17c-.33.86-5.06 2.45-13 2.45a37.45 37.45 0 0 1-11-1.4V25a43.33 43.33 0 0 0 11 1.28c4 0 9.93-.48 13-2v5.1c-.35.86-5.08 2.45-13 2.45S5.3 30.2 5 29.37V6.82c.3-.82 5-2.46 13-2.46c1.7 0 3.25.08 4.64.2a7.44 7.44 0 0 1 .67-1.94c-1.88-.18-3.75-.26-5.31-.26c-5.57 0-15 .93-15 4.43v22.58c0 3.49 9.43 4.43 15 4.43s15-.93 15-4.43v-16.5a7.45 7.45 0 0 1-2 .56"
                          class="clr-i-outline--badged clr-i-outline-path-2--badged"
                        />
                        <circle
                          cx="30"
                          cy="6"
                          r="5"
                          fill="#24a8e5"
                          class="clr-i-outline--badged clr-i-outline-path-3--badged clr-i-badge"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Omborlar
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'ReadyWarehouse' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Tayyor mahsulot (ombori)</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="577878"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xom ashyo (ombori)</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Uskunalar va texnik xizmat  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="#24a8e5"
                          d="M20 14h-4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1m-.4 6.6h-3.2v-5.2h3.2Z"
                          class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path
                          fill="#24a8e5"
                          d="m33.71 12.38l-4.09-4.09a1 1 0 0 0-.7-.29h-5V6.05A2 2 0 0 0 22 4h-8.16A1.92 1.92 0 0 0 12 6.05V8H7.08a1 1 0 0 0-.71.29l-4.08 4.09a1 1 0 0 0-.29.71V28a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V13.08a1 1 0 0 0-.29-.7M14 6h8v2h-8Zm18 11H22v1.93h10V28H4v-9.07h10V17H4v-3.5L7.5 10h21l3.5 3.5Z"
                          class="clr-i-outline clr-i-outline-path-2"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Texnik xizmat
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Orders' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Uskunalar ro‘yxati</span
                          >
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Texnik xizmat jadvali</span
                          >
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Uskunalar holati (aktiv / nosoz)</span
                          >
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Nosozlik tarixi va ta’mirlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>
        <!-- Hisobotlar group -->
        <div>
          <h3
            @click="is_reports = !is_reports"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Hisobotlar
              </span>
              <i
                v-if="is_reports === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_reports === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_reports === true">
            <!-- //Accountant// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Buhgalterya hisoboti
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- //HR// -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Kadrlar hisoboti
                      </span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Employees' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xodimlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Sale  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <spttan
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Sotuv hisoboti
                      </spttan>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="#"
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mahsulotlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      :to="{ name: 'Orders' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Buyurtmalar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Customers  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Mijozlar hisoboti
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="#"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Mijozlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Drivers  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Haydovchilar hisoboti
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Monitoring' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Monitoring</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
            <!-- Agents  -->
            <ul class="mt-3">
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
                          fill="#24a8e5"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Agentlar hisoboti
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1 ml-2"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'Monitoring' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0 text-[13px]">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Monitoring</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        <!-- Settings group-->
        <div>
          <h3
            @click="is_settings = !is_settings"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Sozlamalar
              </span>
              <i
                v-if="is_settings === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_settings === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_settings === true">
            <ul class="mt-3">
              <!-- Admin  -->
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#24a8e5"
                          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5Zm0 3.9a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0 7.9c2 0 6 1.09 6 3.08a7.2 7.2 0 0 1-12 0c0-1.99 4-3.08 6-3.08"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Tizm sozlamalari
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="$"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Foydalanuvchilar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="@"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Bo'limlar</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      :to="{ name: 'RoleManagment' }"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ruxsatlar boshqaruvi
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="\"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Bildirishnomalar
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="\"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Integratsiyalar
                          </span>
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Xavfsizlik sozlamalari
                          </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>
        <!-- More group -->
        <div>
          <h3
            @click="is_mores = !is_mores"
            class="text-xs uppercase text-white font-semibold ml-[-9px] mr-[-9px]"
          >
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <div
              class="flex justify-between cursor-pointer bg-slate-600 p-2 rounded w-full"
            >
              <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                >Boshqalar
              </span>
              <i
                v-if="is_mores === true"
                class="fa-solid fa-angle-up fa-sm mt-2"
              ></i>
              <i
                v-if="is_mores === false"
                class="fa-solid fa-angle-down fa-sm mt-2"
              ></i>
            </div>
          </h3>
          <div v-if="is_mores === true">
            <ul class="mt-3">
              <!-- Authentication  -->
              <SidebarLinkGroup v-slot="parentLink">
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    parentLink.expanded
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="#24a8e5"
                          d="m11 23.18l-2-2.001l-1.411 1.41L11 26l6-6l-1.41-1.41zM28 30h-4v-2h4V16h-4V8a4.005 4.005 0 0 0-4-4V2a6.007 6.007 0 0 1 6 6v6h2a2.002 2.002 0 0 1 2 2v12a2.002 2.002 0 0 1-2 2"
                        />
                        <path
                          fill="#24a8e5"
                          d="M20 14h-2V8A6 6 0 0 0 6 8v6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2M8 8a4 4 0 0 1 8 0v6H8Zm12 20H4V16h16Z"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Authentication</span
                      >
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="/signin"
                      custom
                      v-slot="{ href, navigate }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Sign in</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/signup"
                      custom
                      v-slot="{ href, navigate }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Sign up</span
                          >
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/reset-password"
                      custom
                      v-slot="{ href, navigate }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Reset Password</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
              <SidebarLinkGroup
                v-slot="parentLink"
                :activeCondition="currentRoute.fullPath.includes('ecommerce')"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    currentRoute.fullPath.includes('ecommerce')
                      ? 'hover:text-slate-200'
                      : 'hover:text-white'
                  "
                  href="#0"
                  @click.prevent="
                    sidebarExpanded
                      ? parentLink.handleClick()
                      : (sidebarExpanded = true)
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#24a8e5"
                          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5Zm0 3.9a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0 7.9c2 0 6 1.09 6 3.08a7.2 7.2 0 0 1-12 0c0-1.99 4-3.08 6-3.08"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Tizm sozlamalari
                      </span>
                    </div>
                    <!-- Icon -->
                    <div class="flex shrink-0 ml-2">
                      <svg
                        class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        :class="parentLink.expanded && 'rotate-180'"
                        viewBox="0 0 12 12"
                      >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="$"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Hujjat shablonlari</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="@"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ish vaqti / Ish kunlari</span
                          >
                        </a>
                      </li>
                    </router-link>
                  </ul>
                  <ul
                    class="pl-9 mt-1"
                    :class="!parentLink.expanded && 'hidden'"
                  >
                    <router-link
                      to="\"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Chop etish sozlamalari
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="\"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >DNS / domen / URL sozlamalari
                          </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="\"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Ko‘p tilli interfeys (Localization)
                          </span>
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Modul sozlamalari
                          </span>
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Hisobot sozlamalari
                          </span>
                        </a>
                      </li>
                      <li class="mb-1 last:mb-0">
                        <a
                          class="block transition duration-150 truncate"
                          :class="
                            isExactActive
                              ? 'text-[#36d887]'
                              : 'text-slate-400 hover:text-slate-200'
                          "
                          :href="href"
                          @click="navigate"
                        >
                          <span
                            class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                            >Log sozlamalari
                          </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        <!-- Expand / collapse button -->
        <div class="pt-3 hidden lg:inline-flex justify-end mt-auto">
          <div class="px-3 py-2">
            <button
              class="mt-[520px] ml-40"
              @click.prevent="sidebarExpanded = !sidebarExpanded"
            >
              <span class="sr-only">Expand / collapse sidebar</span>
              <svg
                class="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  class="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path class="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import SidebarLinkGroup from "./SidebarLinkGroup.vue";

export default {
  name: "Sidebar",
  props: ["sidebarOpen"],
  components: {
    SidebarLinkGroup,
  },
  setup(props, { emit }) {
    const trigger = ref(null);
    const sidebar = ref(null);
    const role = ref(JSON.parse(Cookies.get("account")).role);
    const is_dashboard = ref(false);
    const is_production = ref(false);
    const is_departments = ref(false);
    const is_reports = ref(false);
    const is_settings = ref(false);
    const is_mores = ref(false);

    // const permissions = ref(JSON.parse(Cookies.get("account")).permissions);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const sidebarExpanded = ref(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    const currentRoute = useRouter().currentRoute.value;

    // close on click outside
    const clickHandler = ({ target }) => {
      if (!sidebar.value || !trigger.value) return;
      if (
        !props.sidebarOpen ||
        sidebar.value.contains(target) ||
        trigger.value.contains(target)
      )
        return;
      emit("close-sidebar");
    };

    // close if the esc key is pressed
    const keyHandler = ({ keyCode }) => {
      if (!props.sidebarOpen || keyCode !== 27) return;
      emit("close-sidebar");
    };

    onMounted(() => {
      document.addEventListener("click", clickHandler);
      document.addEventListener("keydown", keyHandler);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    });

    watch(sidebarExpanded, () => {
      localStorage.setItem("sidebar-expanded", sidebarExpanded.value);
      if (sidebarExpanded.value) {
        document.querySelector("body").classList.add("sidebar-expanded");
      } else {
        document.querySelector("body").classList.remove("sidebar-expanded");
      }
    });

    return {
      role,
      trigger,
      sidebar,
      sidebarExpanded,
      currentRoute,
      is_dashboard,
      is_production,
      is_departments,
      is_reports,
      is_settings,
      is_mores,
    };
  },
};
</script>
