<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { storeToRefs } from "pinia";

// --- COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Button from "../../../UI/Button.vue";
import Select from "../../../UI/Select.vue";
import DataTable from "../../../UI/DataTable.vue"; 
import { useToast } from "../../../UI/utils/useToast";

// --- STORES ---
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";

const { toast } = useToast();
const store_rw = ReadyWarehouseStore();
const store_pro = ProductsManagmentStore();
const { product_modal, model, ModalAction } = storeToRefs(store_rw);
const { products } = storeToRefs(store_pro);

// --- STATE ---
const loading = ref(false);
const isFetchingProduct = ref(false);
const newDataArray = ref([]); 
const packingOptions = ref([]); 
const selectedProductObj = ref(null);

// Static Data
const manufacturersList = ref([{ id: 1, name: "Eco Water MCHJ" }]);
const unitOptions = [
  { label: "Dona", value: "Dona" }, 
  { label: "Blok", value: "Blok" },
  { label: "Kg", value: "Kg" }, 
  { label: "Litr", value: "Litr" },
  { label: "Quti", value: "Quti" }
];

// --- COLUMNS ---
const tableColumns = [
  { label: 'Mahsulot', key: 'product_details', width: '30%' },
  { label: 'Qadoq', key: 'packing', width: '15%' },
  { label: 'Narx', key: 'price', align: 'right', width: '15%' },
  { label: 'Miqdor', key: 'quantity', align: 'center', width: '10%' },
  { label: 'Jami', key: 'total', align: 'right', width: '15%' },
  { label: 'Sana', key: 'dates', align: 'center', width: '10%' },
  { label: '', key: 'actions', align: 'center', width: '5%' }
];

// --- COMPUTED (Ma'lumotlar shu yerdan selectga boradi) ---
const manufacturerOptions = computed(() => {
  if (!manufacturersList.value) return [];
  return manufacturersList.value.map(m => ({ 
    label: m.name || "Nomsiz", 
    value: m.name 
  }));
});

const productOptions = computed(() => {
  // Agar products bo'sh bo'lsa, demak store hali yuklanmagan
  if (!products.value || products.value.length === 0) return [];
  
  return products.value.map(p => ({ 
    label: p.pro_name || "Nomsiz mahsulot", 
    value: p.pro_name 
  }));
});

const tableData = computed(() => {
  return ModalAction.value.action === 'update' ? newDataArray.value : (model.value.products || []);
});

const currentPrice = computed(() => {
    if(model.value.unit === 'Blok') {
        return Number(model.value.blockCostPrice) || 0;
    }
    return Number(model.value.costPrice) || 0;
});

const currentLineTotal = computed(() => (Number(model.value.quantity) || 0) * currentPrice.value);

const totalDocSum = computed(() => {
    if (!tableData.value) return 0;
    return tableData.value.reduce((acc, item) => {
        const price = typeof item.totalPrice === 'object' ? Number(item.totalPrice.value || 0) : Number(item.totalPrice || 0);
        return acc + price;
    }, 0);
});

watch(totalDocSum, (val) => {
    model.value.totalAmount = val;
    model.value.totalRemainderPrice = val;
});

// --- ACTIONS ---

const handlePlus = (field, title) => {
  const val = prompt(`${title} nomini kiriting:`);
  if (val && val.trim()) {
      manufacturersList.value.push({ id: Date.now(), name: val });
      model.value[field] = val;
      toast.success("Qo'shildi");
  }
};

const onProductSelect = async (val) => {
  if (!val) return;
  const localProd = products.value.find(p => p.pro_name === val);
  
  if (!localProd) {
      toast.warning("Mahsulot topilmadi");
      return;
  }

  isFetchingProduct.value = true;
  try {
      // Bazadan to'liq ma'lumot olish
      await store_pro.GetOne(localProd._id);
      const freshData = store_pro.product || localProd; 

      selectedProductObj.value = freshData;
      model.value.category = freshData.pro_category;
      model.value.code = freshData.code;
      
      if (freshData.products && Array.isArray(freshData.products)) {
          packingOptions.value = freshData.products.map(p => ({ 
              label: p.packingType, 
              value: p.packingType 
          }));
      } else {
          packingOptions.value = [];
      }
      
      model.value.packagingType = "";
      model.value.costPrice = "";
      model.value.blockCostPrice = "";
      model.value.quantity = "";
      model.value.unit = "";
      
      toast.success("Mahsulot ma'lumotlari yuklandi");
  } catch (e) { 
      console.error(e);
      toast.error("Xatolik yuz berdi"); 
  } finally {
      isFetchingProduct.value = false;
  }
};

const onPackingSelect = (val) => {
  if (!selectedProductObj.value || !val) return;
  const details = selectedProductObj.value.products.find(item => item.packingType === val);
  
  if (details) {
      model.value.packagingType = details.packingType;
      model.value.costPrice = details.buying_price;       
      model.value.blockCostPrice = details.block_cost_price;
      toast.info(`Narx: ${formatPrice(details.buying_price)}`);
  }
};

const addRow = () => {
  if (!model.value.product || !model.value.quantity || !model.value.packagingType || !model.value.unit) {
      return toast.error("Barcha maydonlarni to'ldiring!");
  }

  const newItem = {
    id: uuidv4(),
    product: model.value.product,
    code: model.value.code,
    quantity: Number(model.value.quantity),
    packagingType: model.value.packagingType,
    unit: model.value.unit,
    costPrice: Number(model.value.costPrice) || 0,
    blockCostPrice: Number(model.value.blockCostPrice) || 0,
    totalPrice: currentLineTotal.value,
    manufactureDate: model.value.manufactureDate || moment().format("YYYY-MM-DD"),
    expireDate: model.value.expireDate,
    registeredAt: model.value.registeredAt || moment().format("YYYY-MM-DD"),
    status: ModalAction.value.action === "update" ? "Yangi" : "Dastlabki",
  };

  const target = ModalAction.value.action === "update" ? newDataArray.value : (model.value.products || (model.value.products = []));
  target.unshift(newItem);
  
  toast.success("Qo'shildi");
  model.value.quantity = ""; 
};

const removeRow = (id) => {
  if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
  if (ModalAction.value.action === 'update') {
      newDataArray.value = newDataArray.value.filter(i => i.id !== id);
  } else {
      model.value.products = model.value.products.filter(i => i.id !== id);
  }
};

const save = async () => {
    if (!model.value.partyNumber) return toast.error("Hujjat raqami yo'q!");
    if (tableData.value.length === 0) return toast.error("Jadval bo'sh!");
    
    loading.value = true;
    try {
        const payload = {
            action: ModalAction.value.action,
            ...(ModalAction.value.action === "update" 
                ? { newDataArray: newDataArray.value, id: model.value._id } 
                : { model: model.value })
        };
        await store_rw.Create(payload);
        toast.success("Saqlandi!");
        store_rw.product_modal = false;
        newDataArray.value = [];
    } catch (e) { 
        toast.error("Xatolik!"); 
    } finally { 
        loading.value = false; 
    }
};

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);
const formatDate = (d) => d ? moment(d).format("DD.MM.YYYY") : "-";

onMounted(() => { store_pro.GetAll({ status: 0 }); });
</script>

<template>
  <Modal 
    v-model="product_modal" 
    title="Kirim Hujjati" 
    subtitle="Omborga mahsulot qabul qilish"
    icon="fa-solid fa-boxes-stacked"
    width="max-w-[98vw]"
  >
    <div class="flex flex-col lg:flex-row h-[85vh] bg-slate-50 dark:bg-slate-900 font-sans text-slate-700 overflow-hidden">
        
      <div class="w-full lg:w-[320px] shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-40 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
         
         <div class="p-5 border-b border-slate-100 dark:border-slate-700 overflow-visible">
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-bold uppercase text-slate-400 tracking-wider">Hujjat Ma'lumotlari</span>
               <div class="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-mono font-bold">
                 #{{ model.partyNumber || 'AUTO' }}
               </div>
            </div>
            
            <div class="space-y-4">
               <div class="group relative z-50"> 
                  <label class="text-[10px] font-bold text-slate-500 mb-1 block">Ishlab chiqaruvchi</label>
                  <div class="flex gap-1">
                     <Select 
                        v-model="model.manufacturer" 
                        :options="manufacturerOptions" 
                        labelKey="label" valueKey="value"
                        placeholder="Tanlang..." 
                        class="w-full" 
                        searchable
                     />
                   
                  </div>
               </div>

               <div class="relative z-40">
                  <label class="text-[10px] font-bold text-slate-500 mb-1 block">Jo'natuvchi</label>
                  <Select v-model="model.senderEmployee" :options="manufacturerOptions" labelKey="label" valueKey="value" placeholder="Xodim tanlang" class="w-full" />
               </div>

               <div class="relative z-30">
                  <label class="text-[10px] font-bold text-slate-500 mb-1 block">Qabul qiluvchi</label>
                  <Select v-model="model.receivedBy" :options="manufacturerOptions" labelKey="label" valueKey="value" placeholder="Xodim tanlang" class="w-full" />
               </div>

            
            </div>
         </div>

         <div class="mt-auto p-5 bg-slate-50/80 border-t border-slate-200">
            <label class="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Umumiy Summa</label>
            <div class="text-3xl font-black text-slate-800 tracking-tighter">{{ formatPrice(totalDocSum) }}</div>
            <div class="text-xs text-slate-400 font-medium mt-1">so'm</div>
         </div>
      </div>

      <div class="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-900 relative z-0">
         
         <div class="p-4 shrink-0 z-50 relative">
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 flex flex-wrap xl:flex-nowrap gap-3 items-end overflow-visible">
               
               <div class="w-full xl:w-1/4 min-w-[200px] relative z-50">
                  <label class=" required text-[10px] font-bold text-slate-400 mb-1 block pl-1 flex justify-between">
                      Mahsulot 
                      <span v-if="isFetchingProduct" class="text-indigo-500 animate-pulse"><i class="fa-solid fa-circle-notch fa-spin"></i> Yuklanmoqda...</span>
                  </label>
                  <Select 
                     v-model="model.product" 
                     :options="productOptions" 
                     labelKey="label" valueKey="value"
                     searchable 
                     placeholder="Nomini yozing..." 
                     @change="onProductSelect" 
                     class="w-full"
                     :loading="isFetchingProduct" 
                  />
               </div>

               <div class="w-24 shrink-0 hidden md:block">
                  <label class="text-[10px] font-bold text-slate-400 mb-1 block pl-1">Kod</label>
                  <div class="h-[38px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-500">
                     {{ model.code || '---' }}
                  </div>
               </div>

               <div class="w-full md:w-1/3 xl:w-1/5 min-w-[150px] flex gap-2 relative z-40">
                  <div class="w-1/2 relative z-50">
                      <label class="required text-[10px] font-bold text-slate-400 mb-1 block pl-1">Qadoq</label>
                      <Select v-model="model.packagingType" :options="packingOptions" labelKey="label" valueKey="value" placeholder="-" @change="onPackingSelect" class="w-full" />
                  </div>
                  <div class="w-1/2 relative z-40">
                      <label class=" required text-[10px] font-bold text-slate-400 mb-1 block pl-1">Birlik</label>
                      <Select v-model="model.unit" :options="unitOptions" labelKey="label" valueKey="value" placeholder="-" class="w-full" />
                  </div>
               </div>
   <div class="grid grid-cols-2 gap-2 relative z-20">
                   <div>
                       <label class="text-[10px] font-bold text-slate-500 mb-1 block">I/Ch Sana</label>
                       <input type="date" v-model="model.manufactureDate" class="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 bg-slate-50 h-[38px]">
                   </div>
                   <div>
                       <label class="text-[10px] font-bold text-slate-500 mb-1 block">Yaroqlilik</label>
                       <input type="date" v-model="model.expireDate" class="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 bg-slate-50 h-[38px]">
                   </div>
               </div>
               <div class="w-full md:w-1/3 xl:w-1/4 flex gap-2 relative z-30">
                   <div class="w-1/2">
                      <label class=" required text-[10px] font-bold text-slate-400 mb-1 block pl-1">Narx</label>
                      <div class="h-[38px] flex items-center px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 truncate">
                         {{ formatPrice(currentPrice) }}
                      </div>
                   </div>
                   <div class="w-1/2">
                      <label class="requiredtext-[10px] font-bold text-indigo-400 mb-1 block pl-1">Miqdor</label>
                      <input type="number" v-model="model.quantity" @keyup.enter="addRow" class="w-full h-[38px] border-2 border-indigo-100 rounded-lg px-3 text-center font-bold text-indigo-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-indigo-200" placeholder="0" min="0">
                   </div>
               </div>

               <div class="w-full md:w-auto mt-2 md:mt-0 relative z-20">
                  <button @click="addRow" class="w-full md:w-12 h-[38px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all active:scale-95">
                     <i class="fa-solid fa-plus text-sm"></i>
                  </button>
               </div>
            </div>
         </div>

         <div class="flex-1 overflow-hidden px-4 pb-2 relative z-0">
            <div class="h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
               
               <DataTable :items="tableData" :columns="tableColumns" class="flex-1">
                  <template #product_details="{ row }">
                     <div class="flex flex-col">
                        <span class="font-bold text-slate-700 text-xs">{{ row.product }}</span>
                        <span class="text-[10px] text-slate-400 font-mono mt-0.5">{{ row.code }}</span>
                     </div>
                  </template>

                  <template #packing="{ row }">
                     <span class="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-slate-600 text-[11px] border border-slate-100">
                        {{ row.packagingType }} <span class="text-slate-300 mx-1">/</span> {{ row.unit }}
                     </span>
                  </template>

                  <template #price="{ row }">
                     <span class="text-xs font-medium text-slate-500 font-mono">
                        {{ row.unit === 'Blok' ? formatPrice(row.blockCostPrice) : formatPrice(row.costPrice) }}
                     </span>
                  </template>

                  <template #quantity="{ row }">
                     <span class="font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                        {{ row.quantity }}
                     </span>
                  </template>

                  <template #total="{ row }">
                     <span class="font-bold text-xs text-slate-800 font-mono">
                       {{ typeof row.totalPrice === 'object' ? formatPrice(row.totalPrice.value) : formatPrice(row.totalPrice) }}
                     </span>
                  </template>

                  <template #dates="{ row }">
                     <div class="flex flex-col text-[9px] leading-tight">
                        <span class="text-emerald-600" title="I/Ch Sana">{{ formatDate(row.manufactureDate) }}</span>
                        <span class="text-rose-500" title="Yaroqlilik">{{ formatDate(row.expireDate) }}</span>
                     </div>
                  </template>

                  <template #actions="{ row }">
                     <button @click="removeRow(row.id)" class="w-7 h-7 flex items-center justify-center rounded hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                     </button>
                  </template>

               </DataTable>

            </div>
         </div>

      </div>
    </div>

    <template #footer>
        <div class="flex justify-between items-center w-full px-2">
            <div class="text-xs text-slate-400 hidden md:flex items-center gap-4">
                <span><i class="fa-solid fa-keyboard mr-1.5"></i> <b>Enter</b> - Qo'shish</span>
                <span>Jami: <b>{{ tableData.length }}</b> qator</span>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
                <Button variant="secondary" @click="store_rw.product_modal = false" class="flex-1 md:flex-none">Bekor qilish</Button>
                <Button variant="primary" :loading="loading" @click="save" class="flex-1 md:flex-none !px-8 shadow-lg shadow-indigo-500/20">
                   <i class="fa-solid fa-check-circle mr-2"></i> Tasdiqlash
                </Button>
            </div>
        </div>
    </template>
  </Modal>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-300 rounded-full; }
.form-group { @apply flex flex-col gap-1.5; }
.form-label { @apply text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1; }
.form-input { @apply w-full h-[40px] px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 dark:text-slate-200; }

/* Majburiy yulduzcha */
.required:after {
  content: " *";
  color: #ef4444; /* red-500 */
}
</style>