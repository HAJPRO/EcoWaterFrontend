<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { storeToRefs } from "pinia";

// UI
import Modal from "../../../UI/Modal.vue";
import Button from "../../../UI/Button.vue";
import DataTable from "../../../UI/DataTable.vue"; 
import Select from "../../../UI/Select.vue"; 
import Input from "../../../UI/Input.vue"; 
import { useToast } from "../../../UI/utils/useToast";

// STORES
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
const unitOptions = [{ label: "Dona", value: "Dona" }, { label: "Blok", value: "Blok" }, { label: "Kg", value: "Kg" }, { label: "Litr", value: "Litr" }, { label: "Quti", value: "Quti" }];

// --- COMPUTED ---
const manufacturerOptions = computed(() => manufacturersList.value.map(m => ({ label: m.name, value: m.name })));
const productOptions = computed(() => products.value.map(p => ({ label: p.pro_name, value: p.pro_name })));
const tableData = computed(() => ModalAction.value.action === 'update' ? newDataArray.value : (model.value.products || []));

const currentPrice = computed(() => model.value.unit === 'Blok' ? (Number(model.value.blockCostPrice) || 0) : (Number(model.value.costPrice) || 0));
const totalDocSum = computed(() => tableData.value.reduce((acc, i) => acc + (Number(i.totalPrice) || 0), 0));

const tableColumns = [
  { label: 'Mahsulot', key: 'product_details', width: '35%' },
  { label: 'Qadoq', key: 'packing', width: '15%' },
  { label: 'Narx', key: 'price', align: 'right', width: '15%' },
  { label: 'Miqdor', key: 'quantity', align: 'center', width: '15%' },
  { label: 'Jami', key: 'total', align: 'right', width: '15%' },
  { label: '', key: 'actions', align: 'center', width: '5%' }
];

// --- WATCHERS ---
watch(totalDocSum, (val) => { model.value.totalAmount = val; model.value.totalRemainderPrice = val; });

watch(() => model.value.product, async (newVal) => {
    if(!newVal) return;
    isFetchingProduct.value = true;
    try {
       const localProd = products.value.find(p => p.pro_name === newVal);
       if(localProd) {
          await store_pro.GetOne(localProd._id);
          const freshData = store_pro.product || localProd;
          selectedProductObj.value = freshData;
          model.value.code = freshData.code;
          packingOptions.value = freshData.products?.map(p => ({ label: p.packingType, value: p.packingType })) || [];
          model.value.packagingType = ""; model.value.quantity = "";
          if(packingOptions.value.length === 1) model.value.packagingType = packingOptions.value[0].value;
       }
    } finally { isFetchingProduct.value = false; }
});

watch(() => model.value.packagingType, (val) => {
    const details = selectedProductObj.value?.products.find(i => i.packingType === val);
    if(details) {
        model.value.costPrice = details.buying_price;
        model.value.blockCostPrice = details.block_cost_price;
    }
});

// --- ACTIONS ---
const handleNewManufacturer = (name) => {
    manufacturersList.value.push({ id: Date.now(), name });
    model.value.manufacturer = name;
    toast.success("Qo'shildi");
};

const addRow = () => {
    if(!model.value.product || !model.value.quantity) {
        document.getElementById('input-bar')?.classList.add('shake-anim');
        setTimeout(() => document.getElementById('input-bar')?.classList.remove('shake-anim'), 400);
        return toast.warning("To'liq to'ldiring");
    }
    const item = {
        id: uuidv4(),
        product: model.value.product,
        code: model.value.code,
        quantity: Number(model.value.quantity),
        packagingType: model.value.packagingType,
        unit: model.value.unit,
        costPrice: Number(model.value.costPrice) || 0,
        blockCostPrice: Number(model.value.blockCostPrice) || 0,
        totalPrice: Number(model.value.quantity) * currentPrice.value,
        status: "Yangi"
    };
    const target = ModalAction.value.action === 'update' ? newDataArray.value : (model.value.products || (model.value.products=[]));
    target.unshift(item);
    model.value.quantity = "";
    toast.success("Qo'shildi");
};

const removeRow = (id) => {
    if(ModalAction.value.action === 'update') newDataArray.value = newDataArray.value.filter(i => i.id !== id);
    else model.value.products = model.value.products.filter(i => i.id !== id);
};

const save = async () => {
    if(!model.value.manufacturer) return toast.error("Ta'minotchi tanlang");
    if(tableData.value.length === 0) return toast.error("Jadval bo'sh");
    loading.value = true;
    try {
        await store_rw.Create({
            action: ModalAction.value.action,
            ...(ModalAction.value.action === 'update' ? { newDataArray: newDataArray.value, id: model.value._id } : { model: model.value })
        });
        store_rw.product_modal = false;
        toast.success("Saqlandi");
        newDataArray.value = [];
    } finally { loading.value = false; }
};

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);
onMounted(() => { store_pro.GetAll({ status: 0 }); });
</script>

<template>
  <Modal 
    v-model="product_modal" 
    title="Kirim Amaliyoti" 
    width="max-w-[95vw]" 
    @close="store_rw.product_modal = false"
  >
    
    <div class="grid grid-cols-12 h-[80vh] gap-2 overflow-hidden -m-6"> <div class="col-span-12 lg:col-span-3 bg-slate-800 dark:bg-slate-800 border-r border-slate-700/50 flex flex-col h-full z-10 shadow-2xl">
            
            <div class="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Hujjat ID</span>
                        <div class="text-xl font-mono font-black text-white tracking-tight mt-0.5">
                           <span class="text-indigo-500">#</span>{{ model.partyNumber || 'AUTO' }}
                        </div>
                    </div>
                    <div class="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-white/10 shadow-inner">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar-dark p-5 space-y-6">
                
                <div class="space-y-5">
                    <Select 
                        v-model="model.manufacturer" 
                        label="Ta'minotchi" 
                        :options="manufacturerOptions" 
                        searchable allowAdd 
                        placeholder="Tanlang..." 
                        @add="handleNewManufacturer"
                        class="dark-theme-select"
                        size="small"
                    />
                    
                    <div class="grid grid-cols-1 gap-5">
                        <Select v-model="model.senderEmployee" label="Jo'natuvchi" :options="manufacturerOptions" placeholder="Xodim..." class="dark-theme-select" size="small" />
                        <Select v-model="model.receivedBy" label="Qabul qiluvchi" :options="manufacturerOptions" placeholder="Xodim..." class="dark-theme-select" size="small" />
                    </div>
                </div>

                <div class="pt-5 border-t border-white/10 space-y-5">
                    <Input type="date" label="I/Ch Sana" v-model="model.manufactureDate" class="dark-theme-input" size="small" />
                    <Input type="date" label="Yaroqlilik" v-model="model.expireDate" class="dark-theme-input" size="small" />
                </div>

            </div>

            <div class="p-5 bg-gradient-to-t from-black to-slate-900 border-t border-white/10">
                <span class="text-[10px] font-bold uppercase text-indigo-400 mb-1 block tracking-wider">Jami Summa</span>
                <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-black text-white leading-none">{{ formatPrice(totalDocSum) }}</span>
                    <span class="text-[10px] font-bold text-slate-500">UZS</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-9 flex flex-col h-full bg-slate-50 dark:bg-[#09090b] relative z-0">
            
            <div id="input-bar" class="px-5 py-4 bg-white/80 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-20 shadow-sm">
                <div class="flex flex-wrap xl:flex-nowrap items-end gap-3">
                    
                    <div class="w-full xl:w-1/3 min-w-[200px]">
                        <Select 
                            v-model="model.product" 
                            label="Mahsulot Qidirish"
                            :options="productOptions" 
                            searchable clearable
                            placeholder="Nomini yozing..." 
                            :loading="isFetchingProduct"
                            size="small"
                            class="w-full bg-transparent"
                        />
                    </div>

                    <div class="w-1/2 xl:w-[130px]">
                        <Select label="Qadoq" v-model="model.packagingType" :options="packingOptions" placeholder="-" size="small" class="bg-transparent" />
                    </div>
                    
                    <div class="w-1/2 xl:w-[110px]">
                        <Select label="Birlik" clearable v-model="model.unit" :options="unitOptions" placeholder="-" size="small" class="bg-transparent" />
                    </div>

                    <div class="w-1/2 xl:w-[130px]">
                        <Input label="Narx" :modelValue="formatPrice(currentPrice)" disabled readonly class="text-right font-mono bg-transparent" size="small" />
                    </div>

                    <div class="w-1/2 xl:w-[110px]">
                        <Input 
                            label="Miqdor"
                            type=""
                            v-model="model.quantity" 
                            placeholder="0" 
                            @keyup.enter="addRow"
                            size="small"
                            class="!border-indigo-300 focus:!ring-indigo-500/20 bg-transparent"
                        />
                    </div>

                    <Button 
                        @click="addRow" 
                        variant="primary" 
                        size="sm"
                        left-icon="fa-solid fa-plus"
                    >
                         Qo'shish
                    </Button>
                </div>
            </div>

            <div class="flex-1 overflow-hidden relative bg-white dark:bg-transparent">
                <DataTable 
                    v-if="tableData.length > 0"
                    :items="tableData" 
                    :columns="tableColumns"
                    class="h-full border-none"
                >
                    <template #product_details="{ row }">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase border border-indigo-100 dark:border-white/5 shadow-sm">
                                {{ row.product.substring(0, 2) }}
                            </div>
                            <div class="leading-snug">
                                <div class="font-bold text-xs text-slate-800 dark:text-slate-200">{{ row.product }}</div>
                                <div class="text-[10px] text-slate-400 font-mono">{{ row.code }}</div>
                            </div>
                        </div>
                    </template>

                    <template #packing="{ row }">
                        <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                            {{ row.packagingType }}
                        </span>
                    </template>

                    <template #price="{ row }">
                        <span class="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">{{ formatPrice(row.unit === 'Blok' ? row.blockCostPrice : row.costPrice) }}</span>
                    </template>

                    <template #quantity="{ row }">
                        <span class="font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-500/20">
                            {{ row.quantity }} <span class="text-[9px] text-indigo-400">{{ row.unit }}</span>
                        </span>
                    </template>

                    <template #total="{ row }">
                        <span class="font-bold font-mono text-xs text-slate-800 dark:text-white">{{ formatPrice(row.totalPrice) }}</span>
                    </template>

                    <template #actions="{ row }">
                        <button @click="removeRow(row.id)" class="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <i class="fa-solid fa-trash-can text-[11px]"></i>
                        </button>
                    </template>
                </DataTable>

                <div v-else class="flex flex-col items-center justify-center h-full text-slate-400 select-none pb-10 bg-slate-50/50 dark:bg-transparent">
                    <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
                        <i class="fa-solid fa-layer-group text-3xl opacity-30 text-indigo-400"></i>
                    </div>
                    <p class="text-xs font-medium">Jadvalga mahsulot qo'shing</p>
                </div>
            </div>

        </div>
    </div>

    <template #footer>
        <div class="flex justify-between items-center w-full">
            <div class="text-[11px] text-slate-500 font-medium">
                Jami qatorlar: <span class="text-slate-800 dark:text-white font-bold">{{ tableData.length }}</span>
            </div>
            <div class="flex gap-3">
                <Button variant="danger" left-icon="fas fa-xmark" size="sm" @click="store_rw.product_modal = false">
                    Bekor qilish
                </Button>
                <Button variant="primary" size="sm" :loading="loading" @click="save"  left-icon="fas fa-check">
                    Tasdiqlash
                </Button>
            </div>
        </div>
    </template>

  </Modal>
</template>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
.custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 99px; }
.custom-scrollbar-dark::-webkit-scrollbar-track { background-color: transparent; }

/* Dark Sidebar Overrides (Glass Effect) */
.dark-theme-select :deep(.relative.flex),
.dark-theme-input :deep(.relative.flex) {
    background-color: rgba(255,255,255,0.03) !important;
    border-color: rgba(255,255,255,0.1) !important;
}
/* Label fonini sidebar foni bilan bir xil qilish */
.dark-theme-select :deep(label),
.dark-theme-input :deep(label) {
    background-color: #0f172a !important; 
    color: #94a3b8 !important;
}
.dark-theme-input :deep(input) { color: white !important; }

/* Shake Animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.shake-anim { animation: shake 0.3s ease-in-out; }
</style>