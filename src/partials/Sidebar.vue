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
              src="../../public/logo icon.jpg"
              style="width: 50px; height: 50px"
              alt="logo"
            />
            <h5 class="text-white mt-3 ml-7 font-serif font-bold">HAJ ERP</h5>
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
        <!-- Dashboard-->
        <div>
          <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"></span>
          </h3>
          <ul class="mt-3">
            <!-- Dashboard items -->
            <SidebarLinkGroup
              v-slot="parentLink"
              :activeCondition="
                currentRoute.fullPath === '/' ||
                currentRoute.fullPath.includes('dashboard')
              "
            >
              <a
                class="block text-slate-200 truncate transition duration-150"
                :class="
                  currentRoute.fullPath === '/' ||
                  currentRoute.fullPath.includes('dashboard')
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
                      <rect width="2.8" height="12" x="1" y="6" fill="#24a8e5">
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="6;1;6"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="12;22;12"
                        />
                      </rect>
                      <rect
                        width="2.8"
                        height="12"
                        x="5.8"
                        y="6"
                        fill="#24a8e5"
                      >
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="6;1;6"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="12;22;12"
                        />
                      </rect>
                      <rect
                        width="2.8"
                        height="12"
                        x="10.6"
                        y="6"
                        fill="#24a8e5"
                      >
                        <animate
                          id="svgSpinnersBarsScaleMiddle0"
                          attributeName="y"
                          begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="6;1;6"
                        />
                        <animate
                          attributeName="height"
                          begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="12;22;12"
                        />
                      </rect>
                      <rect
                        width="2.8"
                        height="12"
                        x="15.4"
                        y="6"
                        fill="#24a8e5"
                      >
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="6;1;6"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.2s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="12;22;12"
                        />
                      </rect>
                      <rect
                        width="2.8"
                        height="12"
                        x="20.2"
                        y="6"
                        fill="#24a8e5"
                      >
                        <animate
                          id="svgSpinnersBarsScaleMiddle1"
                          attributeName="y"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="6;1;6"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBarsScaleMiddle0.begin+0.4s"
                          calcMode="spline"
                          dur="0.6s"
                          keySplines=".14,.73,.34,1;.65,.26,.82,.45"
                          values="12;22;12"
                        />
                      </rect>
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Dashboard</span
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to="/explore"
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
                          >Graphical statistics</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
        </div>

        <!-- Bo'limlar group -->
        <div
          v-if="
            role === 2 ||
            role === 1000 ||
            role === 2 ||
            role === 3 ||
            role === 4 ||
            role === 5 ||
            role === 6
          "
        >
          <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
              >Bo'limlar</span
            >
          </h3>
          <ul v-if="role == 1 || role === 1000" class="mt-3">
            <!-- Sotuv  -->
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
                      <rect
                        width="10"
                        height="10"
                        x="1"
                        y="1"
                        fill="#24a8e5"
                        rx="1"
                      >
                        <animate
                          id="svgSpinnersBlocksShuffle20"
                          fill="freeze"
                          attributeName="x"
                          begin="0;svgSpinnersBlocksShuffle27.end"
                          dur="0.2s"
                          values="1;13"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle21"
                          fill="freeze"
                          attributeName="y"
                          begin="svgSpinnersBlocksShuffle24.end"
                          dur="0.2s"
                          values="1;13"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle22"
                          fill="freeze"
                          attributeName="x"
                          begin="svgSpinnersBlocksShuffle25.end"
                          dur="0.2s"
                          values="13;1"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle23"
                          fill="freeze"
                          attributeName="y"
                          begin="svgSpinnersBlocksShuffle26.end"
                          dur="0.2s"
                          values="13;1"
                        />
                      </rect>
                      <rect
                        width="10"
                        height="10"
                        x="1"
                        y="13"
                        fill="#24a8e5"
                        rx="1"
                      >
                        <animate
                          id="svgSpinnersBlocksShuffle24"
                          fill="freeze"
                          attributeName="y"
                          begin="svgSpinnersBlocksShuffle20.end"
                          dur="0.2s"
                          values="13;1"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle25"
                          fill="freeze"
                          attributeName="x"
                          begin="svgSpinnersBlocksShuffle21.end"
                          dur="0.2s"
                          values="1;13"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle26"
                          fill="freeze"
                          attributeName="y"
                          begin="svgSpinnersBlocksShuffle22.end"
                          dur="0.2s"
                          values="1;13"
                        />
                        <animate
                          id="svgSpinnersBlocksShuffle27"
                          fill="freeze"
                          attributeName="x"
                          begin="svgSpinnersBlocksShuffle23.end"
                          dur="0.2s"
                          values="13;1"
                        />
                      </rect>
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Sotuv
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    :to="{ name: 'legal' }"
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
                          >Yuridik</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    to="/explore/sale/physical"
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
                          >Jismoniy</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
          <ul v-if="role === 2 || role === 1000" class="mt-3">
            <!-- Bo'yash harakati  -->
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
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        fill="#24a8e5"
                        d="M512 1024q-139 0-257-68.5T68.5 769T0 512t68.5-257T255 68.5T512 0q112 0 152 27.5T704 128q0 32-15 61t-33 47t-33 40.5t-15 43.5q0 96 96 96q21 0 43.5-15t40.5-33t47-33t61-15q72 0 100 41t28 151q0 104-40.5 199t-109 163.5t-163.5 109t-199 40.5M288 832q40 0 68-28t28-68t-28-68t-68-28t-68 28t-28 68t28 68t68 28m-64-512q-40 0-68 28t-28 68t28 68t68 28t68-28t28-68t-28-68t-68-28m192-192q-40 0-68 28t-28 68t28 68t68 28t68-28t28-68t-28-68t-68-28m192 576q-40 0-68 28t-28 68t28 68t68 28t68-28t28-68t-28-68t-68-28m192-192q-40 0-68 28t-28 68t28 68t68 28t68-28t28-68t-28-68t-68-28"
                      />
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Bo'yoq
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <!-- //Xommato skladi -->
                  <router-link
                    to="/explore/products/list"
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
                          >Xom mato sklad</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- // -->
                  <ul class="mt-1">
                    <!-- ishlab chiqarish  -->
                    <SidebarLinkGroup
                      v-slot="parentLink"
                      :activeCondition="
                        currentRoute.fullPath.includes('ecommerce')
                      "
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
                            <span
                              class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                              >Ishlab chiqarish
                            </span>
                          </div>
                          <!-- Icon -->
                          <div class="flex shrink-0 ml-2">
                            <svg
                              class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                              :class="parentLink.expanded && 'rotate-180'"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div
                        class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                      >
                        <ul
                          class="mt-1"
                          :class="!parentLink.expanded && 'hidden'"
                        >
                          <!-- //Reja iqtisod -->
                          <router-link
                            to="/explore/department/paint/working/plan"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 ml-2 last:mb-0">
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
                                  >Reja iqtisod</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Xommato skladi -->
                          <router-link
                            to="/explore/products/list"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Xom mato sklad</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //fipsa -->
                          <router-link
                            to="/explore/products/islabchiqarish/fipsa"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Fipsa</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Bo'yoq -->
                          <router-link
                            to="/explore/products/ishlabchiqarish/bo'yoq"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Bo'yoq</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Qurutma-->
                          <router-link
                            to="/explore/products/ishlabciqarish/qurutma"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Qurutma</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //pechat -->
                          <router-link
                            to="/explore/products/ishlabciqarish/pechat"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Pechat</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Rolik -->
                          <router-link
                            to="/explore/products/ishlabciqarish/rolik"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Rolik</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Tarozi -->
                          <router-link
                            to="/explore/products/ishlabciqarish/tarozi"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Tarozi</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //Sklad -->
                          <router-link
                            to="/explore/products/ishlabciqarish/skalad"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Tayyor mato sklad</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                        </ul>
                      </div>
                    </SidebarLinkGroup>
                  </ul>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
          <ul v-if="role === 3 || role === 1000" class="mt-3">
            <!-- To'quv harakatlari  -->
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
                        d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          dur="1.5s"
                          repeatCount="indefinite"
                          type="rotate"
                          values="0 12 12;360 12 12"
                        />
                      </path>
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >To'quv
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <ul class="mt-1">
                    <!-- ishlab chiqarish  -->
                    <SidebarLinkGroup
                      v-slot="parentLink"
                      :activeCondition="
                        currentRoute.fullPath.includes('ecommerce')
                      "
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
                            <span
                              class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                              >Ishlab chiqarish
                            </span>
                          </div>
                          <!-- Icon -->
                          <div class="flex shrink-0 ml-2">
                            <svg
                              class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                              :class="parentLink.expanded && 'rotate-180'"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div
                        class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                      >
                        <ul
                          class="mt-1"
                          :class="!parentLink.expanded && 'hidden'"
                        >
                          <!-- //Reja iqtisod to'quv -->
                          <router-link
                            to="/explore/department/weaving/working/plan"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Reja iqtisod</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <router-link
                            to="/explore/products/tuquv/kolsa"
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
                                  >Kolsa</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //opela -->
                          <router-link
                            to="/explore/products/tuquv/opelad"
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
                                  >Opelad</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                        </ul>
                      </div>
                    </SidebarLinkGroup>
                  </ul>
                  <!-- Xom mato skaldi -->
                  <router-link
                    to="/explore/products/tikuv/xommato_skladi"
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
                          >Xom mato sklad</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- // -->
                  <!-- Ip-Polister Sklad -->
                  <router-link
                    to="/explore/products/tikuv/ip_skald"
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
                          >Ip-Polister Sklad</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- /// -->
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
          <ul v-if="role === 4 || role === 1000" class="mt-3">
            <!-- Yigiruv harakatlari  -->
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
                      viewBox="0 0 1025 1023"
                    >
                      <path
                        fill="#24a8e5"
                        d="M996.413 959h-234q-115-638-122-895h224q13 0 22.5 9.5t9.5 22.5q0 79 12 181.5t26 179t44 231t46 239.5q2 13-6 22.5t-22 9.5m-320 64h-648q-14 0-22-9.5t-5-22.5q127-703 127-959q0-13 9.5-22.5t22.5-9.5h384q13 0 22.5 9.5t9.5 22.5q0 256 128 959q2 13-6 22.5t-22 9.5"
                      />
                    </svg>

                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Yigiruv
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <div class="mt-1">
                    <!-- ishlab chiqarish  -->
                    <SidebarLinkGroup
                      v-slot="parentLink"
                      :activeCondition="
                        currentRoute.fullPath.includes('ecommerce')
                      "
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
                            <span
                              class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                              >Ishlab chiqarish
                            </span>
                          </div>
                          <!-- Icon -->
                          <div class="flex shrink-0 ml-2">
                            <svg
                              class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                              :class="parentLink.expanded && 'rotate-180'"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div
                        class="lg:hidden lg:sidebar-expanded:block 2xl:block"
                      >
                        <ul
                          class="mt-1"
                          :class="!parentLink.expanded && 'hidden'"
                        >
                          <!-- //kolsa -->
                          <!-- //Reja iqtisod to'quv -->
                          <router-link
                            to="/explore/department/spinning/working/plan"
                            custom
                            v-slot="{ href, navigate, isExactActive }"
                          >
                            <li class="mb-1 ml-2 last:mb-0">
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
                                  >Reja iqtisod</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <router-link
                            to="/explore/products/tuquv/kolsa"
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
                                  >Kolsa</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                          <!-- //opela -->
                          <router-link
                            to="/explore/products/tuquv/opelad"
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
                                  >Opelad</span
                                >
                              </a>
                            </li>
                          </router-link>
                          <!-- // -->
                        </ul>
                      </div>
                    </SidebarLinkGroup>
                  </div>
                  <!-- PAXTA SKLADI -->
                  <router-link
                    to="/explore/products/yigiruv/cotton_sklad"
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
                          >Paxta skalad</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- //// -->
                  <!-- STELAJ -->
                  <router-link
                    to="/explore/products/yigiruv/staris"
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
                          >Staris</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- /// -->

                  <!-- // kolsa -->
                  <router-link
                    to="/explore/products/yigiruv/kolsa"
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
                          >Kolsa</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- //// -->
                  <!-- ///opened -->
                  <router-link
                    to="/explore/products/yigiruv/opened"
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
                          >Opened</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- ///< -->
                  <!-- // Ip sklad -->
                  <router-link
                    to="/explore/products/yigiruv/ip_skald"
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
                          >Ip sklad</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <!-- // -->
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
          <ul v-if="role === 5 || role === 1000" class="mt-3">
            <!-- Tikuv harakati  -->
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
                      viewBox="0 0 1025 1024"
                    >
                      <path
                        fill="#24a8e5"
                        d="M896.428 1024h-768q-53 0-90.5-37.5T.428 896V128q0-53 37.5-90.5t90.5-37.5h768q53 0 90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5m-288-768h-256q-13 0-22.5 9.5t-9.5 22.5t9.5 22.5t22.5 9.5h96v416q0 13 9.5 22.5t22.5 9.5t22.5-9.5t9.5-22.5V320h96q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5"
                      />
                    </svg>

                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Tikuv
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    v-if="
                      (role === 5 &&
                        permissions.includes('seam raw warehouse')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'RawMaterialWarehouse' }"
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
                          >Sklad (xom mato)</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    v-if="
                      (role === 5 && permissions.includes('form')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'SeamForm' }"
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
                          >Bichuv</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    v-if="
                      (role === 5 && permissions.includes('classification')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'SeamClassification' }"
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
                          >Tasnif</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    v-if="
                      (role === 5 && permissions.includes('patoks')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'SeamPatoks' }"
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
                          >Patoklar</span
                        >
                      </a>
                    </li>
                  </router-link>

                  <router-link
                    v-if="
                      (role === 5 && permissions.includes('packing')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'SeamPacking' }"
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
                          >Upakovka</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    v-if="
                      (role === 5 &&
                        permissions.includes('seam clothes warehouse')) ||
                      role === 1000 ||
                      permissions.includes('seam accountant')
                    "
                    :to="{ name: 'SeamClothesWarehouse' }"
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
                          >Sklad (tayyor mahsulot)
                        </span>
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>

          <ul v-if="role === 6 || role === 1000" class="mt-3">
            <!-- Taminot bo'limi harakati  -->
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
                      <rect
                        width="7.33"
                        height="7.33"
                        x="1"
                        y="1"
                        fill="#24a8e5"
                      >
                        <animate
                          id="svgSpinnersBlocksWave0"
                          attributeName="x"
                          begin="0;svgSpinnersBlocksWave1.end+0.2s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="y"
                          begin="0;svgSpinnersBlocksWave1.end+0.2s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="width"
                          begin="0;svgSpinnersBlocksWave1.end+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="0;svgSpinnersBlocksWave1.end+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="8.33"
                        y="1"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="1"
                        y="8.33"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.1s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="15.66"
                        y="1"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="8.33"
                        y="8.33"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="1"
                        y="15.66"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="1;4;1"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.2s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="15.66"
                        y="8.33"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="8.33"
                        y="15.66"
                        fill="#08c7f9"
                      >
                        <animate
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="8.33;11.33;8.33"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.3s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                      <rect
                        width="7.33"
                        height="7.33"
                        x="15.66"
                        y="15.66"
                        fill="#08c7f9"
                      >
                        <animate
                          id="svgSpinnersBlocksWave1"
                          attributeName="x"
                          begin="svgSpinnersBlocksWave0.begin+0.4s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="y"
                          begin="svgSpinnersBlocksWave0.begin+0.4s"
                          dur="0.6s"
                          values="15.66;18.66;15.66"
                        />
                        <animate
                          attributeName="width"
                          begin="svgSpinnersBlocksWave0.begin+0.4s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                        <animate
                          attributeName="height"
                          begin="svgSpinnersBlocksWave0.begin+0.4s"
                          dur="0.6s"
                          values="7.33;1.33;7.33"
                        />
                      </rect>
                    </svg>

                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Taminot
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to="/explore/department/provide/working/plan"
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
                          >Reja iqtisod</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
          <ul v-if="role === 7 || role === 1000" class="mt-3">
            <!-- Kadrlar  -->
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
                      viewBox="0 0 26 26"
                    >
                      <path
                        fill="#24a8e5"
                        d="M16.563 15.9c-.159-.052-1.164-.505-.536-2.414h-.009c1.637-1.686 2.888-4.399 2.888-7.07c0-4.107-2.731-6.26-5.905-6.26c-3.176 0-5.892 2.152-5.892 6.26c0 2.682 1.244 5.406 2.891 7.088c.642 1.684-.506 2.309-.746 2.396c-3.324 1.203-7.224 3.394-7.224 5.557v.811c0 2.947 5.714 3.617 11.002 3.617c5.296 0 10.938-.67 10.938-3.617v-.811c0-2.228-3.919-4.402-7.407-5.557m-5.516 8.709c0-2.549 1.623-5.99 1.623-5.99l-1.123-.881c0-.842 1.453-1.723 1.453-1.723s1.449.895 1.449 1.723l-1.119.881s1.623 3.428 1.623 6.018c0 .406-3.906.312-3.906-.028"
                      />
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                      >Kadrlar
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to=""
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
                          >Shikoyatlar</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    to=""
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
                          >Takliflar</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
        </div>

        <!-- Hisobotlar group-->
        <div>
          <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
              >Hisobotlar</span
            >
          </h3>
          <ul class="mt-3">
            <!-- Sklad hisoboti -->
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
                      <ellipse cx="12" cy="5" fill="#24a8e5" rx="4" ry="4">
                        <animate
                          id="svgSpinnersBouncingBall0"
                          fill="freeze"
                          attributeName="cy"
                          begin="0;svgSpinnersBouncingBall2.end"
                          calcMode="spline"
                          dur="0.375s"
                          keySplines=".33,0,.66,.33"
                          values="5;20"
                        />
                        <animate
                          attributeName="rx"
                          begin="svgSpinnersBouncingBall0.end"
                          calcMode="spline"
                          dur="0.05s"
                          keySplines=".33,0,.66,.33;.33,.66,.66,1"
                          values="4;4.8;4"
                        />
                        <animate
                          attributeName="ry"
                          begin="svgSpinnersBouncingBall0.end"
                          calcMode="spline"
                          dur="0.05s"
                          keySplines=".33,0,.66,.33;.33,.66,.66,1"
                          values="4;3;4"
                        />
                        <animate
                          id="svgSpinnersBouncingBall1"
                          attributeName="cy"
                          begin="svgSpinnersBouncingBall0.end"
                          calcMode="spline"
                          dur="0.025s"
                          keySplines=".33,0,.66,.33"
                          values="20;20.5"
                        />
                        <animate
                          id="svgSpinnersBouncingBall2"
                          attributeName="cy"
                          begin="svgSpinnersBouncingBall1.end"
                          calcMode="spline"
                          dur="0.4s"
                          keySplines=".33,.66,.66,1"
                          values="20.5;5"
                        />
                      </ellipse>
                    </svg>
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                    >
                      Sklad hisoboti
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to="/explore/products/list"
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
                          >Kirimlar ro'yxati</span
                        >
                      </a>
                    </li>
                  </router-link>
                  <router-link
                    to="/explore/products/lab"
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
                          >Kirim jarayoni</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
        </div>
        <!-- Settings group-->
        <div v-if="role === 1000">
          <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
              >Sozlamalar</span
            >
          </h3>
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
                      >Admin
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to="/explore/admin/users"
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

                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link
                    to="/explore/admin/role"
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
                          >Role</span
                        >
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
          </ul>
        </div>
        <!-- More group -->
        <div>
          <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span
              class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
              aria-hidden="true"
              >•••</span
            >
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block"
              >Ko'proq</span
            >
          </h3>
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
                <ul class="pl-9 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/signin" custom v-slot="{ href, navigate }">
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
                  <router-link to="/signup" custom v-slot="{ href, navigate }">
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

            <!-- Messages -->
            <router-link
              to="/messages"
              custom
              v-slot="{ href, navigate, isExactActive }"
            >
              <li
                class="px-3 py-2 rounded-sm mb-0.5 last:mb-0"
                :class="isExactActive && 'bg-slate-900'"
              >
                <a
                  class="block text-slate-200 truncate transition duration-150"
                  :class="
                    isExactActive ? 'hover:text-slate-200' : 'hover:text-white'
                  "
                  :href="href"
                  @click="navigate"
                >
                  <div class="flex items-center justify-between">
                    <div class="grow flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="27"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#24a8e5"
                          fill-rule="evenodd"
                          d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983zm5.706 3.809a1 1 0 1 0-1.412 1.417a1 1 0 1 0 1.412-1.417m2.585.002a1 1 0 1 1 .003 1.414a1 1 0 0 1-.003-1.414m5.415-.002a1 1 0 1 0-1.412 1.417a1 1 0 1 0 1.412-1.417"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        >Messages</span
                      >
                    </div>
                    <!-- Badge -->
                    <div class="flex flex-shrink-0 ml-2">
                      <span
                        class="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-[#24a8e5] px-2 rounded"
                        >4</span
                      >
                    </div>
                  </div>
                </a>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
      <!-- Expand / collapse button -->
      <div class="pt-3 hidden lg:inline-flex justify-end mt-auto">
        <div class="px-3 py-2">
          <button @click.prevent="sidebarExpanded = !sidebarExpanded">
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

    const permissions = ref(JSON.parse(Cookies.get("account")).permissions);

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
      permissions,
      trigger,
      sidebar,
      sidebarExpanded,
      currentRoute,
    };
  },
};
</script>
