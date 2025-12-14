<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import EmptyState from '@/components/Helpers/empty/EmptyState.vue'

// --- PROPS ---
const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }, 
  showIndex: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  searchValue: { type: String, default: '' },
  itemsPerPage: { type: Number, default: 15 }
})

// --- EMITS ---
const emit = defineEmits(['sort-change', 'page-change', 'size-change', 'row-click', 'clear-filter', 'header-setting'])

// --- STATE ---
const pageSize = ref(props.itemsPerPage)
const currentPage = ref(1)
const hoveredColumn = ref(null)
const showPageSizeMenu = ref(false)
const sortConfig = ref({ key: null, direction: 'asc' })
const pageSizeMenuRef = ref(null)

// --- CLICK OUTSIDE LOGIC ---
const handleClickOutside = (event) => {
  if (showPageSizeMenu.value && pageSizeMenuRef.value && !pageSizeMenuRef.value.contains(event.target)) {
    showPageSizeMenu.value = false
  }
}

onMounted(() => { document.addEventListener('click', handleClickOutside) })
onUnmounted(() => { document.removeEventListener('click', handleClickOutside) })

// --- WATCHERS ---
watch(() => props.searchValue, () => { currentPage.value = 1 })
watch(() => props.itemsPerPage, (newVal) => { pageSize.value = newVal })

// --- HELPERS ---
const getNestedValue = (obj, path) => {
  if (!obj || !path) return '';
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

// --- COMPUTED ---
const processedData = computed(() => {
  let data = [...props.items]
  if (sortConfig.value.key) {
    data.sort((a, b) => {
      const valA = getNestedValue(a, sortConfig.value.key)
      const valB = getNestedValue(b, sortConfig.value.key)
      if (valA === valB) return 0
      if (valA == null) return 1
      if (valB == null) return -1
      const comparison = valA > valB ? 1 : -1
      return sortConfig.value.direction === 'asc' ? comparison : -comparison
    })
  }
  return data
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return processedData.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() => Math.ceil(props.items.length / pageSize.value) || 1)

// --- ACTIONS ---
const handleSort = (key) => {
  if (!key) return
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
  emit('sort-change', sortConfig.value)
}

const setPageSize = (size) => {
  pageSize.value = size
  currentPage.value = 1
  showPageSizeMenu.value = false
  emit('size-change', size)
}

const changePage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
    emit('page-change', p)
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden relative z-0">
    
    <div class="flex-1 overflow-auto custom-scrollbar relative">
      <table class="w-full text-left border-collapse" :style="{ minWidth: '100%' }">
        
        <thead class="sticky top-0 z-[50] backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
          <tr>
            <th v-if="showIndex" 
                class="th-fixed left-0 w-14 text-center z-[60]"
                @mouseenter="hoveredColumn = 'index'" @mouseleave="hoveredColumn = null">
                <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">#</span>
            </th>

            <th v-for="(col, index) in columns" :key="col.key"
                scope="col"
                :class="[
                  'py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none transition-all duration-200 group/th',
                  col.sortable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400' : '',
                  col.fixed === 'right' ? 'sticky right-0 z-[50] backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-l border-slate-100 dark:border-slate-800 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]' : ''
                ]"
                :style="{ width: col.width, minWidth: col.width, textAlign: col.align || 'left' }"
                @click="col.sortable && handleSort(col.key)"
                @mouseenter="hoveredColumn = index" @mouseleave="hoveredColumn = null">
              
              <div class="flex items-center gap-2" :class="{'justify-center': col.align === 'center', 'justify-end': col.align === 'right'}">
                
                <template v-if="col.key === 'actions'">
                   <button @click.stop="$emit('header-setting')" class="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800 active:scale-95">
                     <i class="fa-solid fa-gear text-sm"></i>
                   </button>
                </template>
                
                <template v-else>
                  {{ col.label }}
                </template>

                <div v-if="col.sortable && col.key !== 'actions'" 
                     class="flex flex-col gap-[1px] text-[8px] transition-opacity duration-200"
                     :class="sortConfig.key === col.key ? 'opacity-100' : 'opacity-0 group-hover/th:opacity-50'">
                      <i class="fa-solid fa-caret-up transition-colors" 
                         :class="sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-indigo-600 scale-110' : 'text-slate-300'"></i>
                      <i class="fa-solid fa-caret-down transition-colors" 
                         :class="sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-indigo-600 scale-110' : 'text-slate-300'"></i>
                </div>
              </div>

              <div v-if="col.sortable && sortConfig.key === col.key" class="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500"></div>
            </th>
          </tr>
        </thead>

        <tbody v-if="paginatedData.length > 0" class="text-sm divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="(row, rowIndex) in paginatedData" 
              :key="row.id || rowIndex" 
              class="group transition-colors duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50" 
              @click="$emit('row-click', row)">
            
            <td v-if="showIndex" 
                class="td-fixed left-0 text-center font-mono text-xs text-slate-400 z-[30] group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
              {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
            </td>

            <td v-for="(col, colIndex) in columns" :key="col.key"
                :class="[
                  'py-3 px-4 text-slate-700 dark:text-slate-300 transition-colors',
                  col.fixed === 'right' ? 'sticky right-0 z-20 border-l border-slate-50 dark:border-slate-800 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800' : ''
                ]"
                :style="{ textAlign: col.align || 'left' }">
              <slot :name="col.key" :row="row" :index="rowIndex">{{ getNestedValue(row, col.key) }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <EmptyState v-if="paginatedData.length === 0 && !loading" :search-term="searchValue" @action="$emit('clear-filter')" />
    </div>

    <div v-if="paginatedData.length > 0" class="flex-none bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-40 relative">
      
      <div class="flex items-center gap-6 text-sm text-slate-500">
        <span class="font-medium">
          Jami: <span class="text-slate-900 dark:text-white font-bold">{{ props.items.length }}</span> ta
        </span>

        <div class="relative" ref="pageSizeMenuRef">
          <button 
            @click.stop="showPageSizeMenu = !showPageSizeMenu" 
            class="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors text-xs uppercase tracking-wide"
          >
            <span>{{ pageSize }} / sahifa</span>
            <i class="fa-solid fa-chevron-up text-[10px] transition-transform duration-200" :class="{'rotate-180': showPageSizeMenu}"></i>
          </button>
          
          <transition name="dropdown-up">
            <div v-if="showPageSizeMenu" class="absolute bottom-full left-0 mb-2 w-28 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-1 z-50">
              <button 
                v-for="size in [10, 15, 20, 50, 100]" 
                :key="size" 
                @click="setPageSize(size)" 
                class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center"
                :class="pageSize === size ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-300'"
              >
                {{ size }} ta
                <i v-if="pageSize === size" class="fa-solid fa-check text-[10px]"></i>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" 
                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center">
          <button v-for="p in totalPages" :key="p" @click="changePage(p)" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all" 
                  :class="currentPage === p ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'" 
                  v-show="p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)">
            {{ p }}
          </button>
        </div>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" 
                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fixed Columns Styling */
.th-fixed { 
  @apply sticky bg-white/95 dark:bg-slate-900/95 backdrop-blur-md;
  box-shadow: 4px 0 12px -4px rgba(0,0,0,0.05); /* Yumshoq soya */
}
.td-fixed { 
  @apply sticky bg-white dark:bg-slate-900;
  box-shadow: 4px 0 12px -4px rgba(0,0,0,0.05);
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }

/* Transitions */
.dropdown-up-enter-active, .dropdown-up-leave-active { transition: all 0.2s ease-out; }
.dropdown-up-enter-from, .dropdown-up-leave-to { opacity: 0; transform: translateY(8px) scale(0.96); }
</style>