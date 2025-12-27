<script setup>
import { ref, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
import { useToast } from "../../../UI/utils/useToast";
const { toast } = useToast();

// --- COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Button from "../../../UI/Button.vue";
import Select from "../../../UI/Select.vue";
import Input from "../../../UI/Input.vue";
import FileUpload from "../../../UI/Upload.vue"; 

const store_product = ProductsManagmentStore();
const { product_modal, model, TitleAction } = storeToRefs(store_product);

// --- OPTIONS ---
const categoryes = ref([
    { id: 1, name: "Gazli ichimliklar" },
    { id: 2, name: "Gazsiz ichimliklar" },
    { id: 3, name: "Sharbatlar" },
    { id: 4, name: "Sneklar" },
    { id: 5, name: "Sut mahsulotlari" },
]);

const units = ref([
    { id: 'dona', name: 'Dona' },
    { id: 'kg', name: 'Kilogram (kg)' },
    { id: 'litr', name: 'Litr (l)' },
    { id: 'blok', name: 'Blok/Upakovka' }
]);

const errors = reactive({});

// --- CALCULATIONS ---
const calculateSalePrice = (cost, margain) => cost > 0 ? parseFloat((cost * (1 + margain / 100)).toFixed(2)) : 0;
const calculateMargain = (cost, sale) => cost > 0 ? parseFloat((((sale - cost) / cost) * 100).toFixed(2)) : 0;

// --- WATCHERS ---
watch(() => model.value.costPrice, (newCost) => {
    if (newCost > 0 && model.value.margainPercent > 0) {
        model.value.salePrice = calculateSalePrice(newCost, model.value.margainPercent);
    }
}, { immediate: true });

watch(() => model.value.margainPercent, (newMargain) => {
    const cost = model.value.costPrice || 0;
    if (cost > 0) model.value.salePrice = calculateSalePrice(cost, newMargain);
});

watch(() => model.value.salePrice, (newSale) => {
    const cost = model.value.costPrice || 0;
    if (cost > 0) model.value.margainPercent = calculateMargain(cost, newSale);
});

// --- ACTIONS ---
const handleClose = () => {
    store_product.closeModal();
    Object.keys(errors).forEach(key => delete errors[key]);
};

const SaveProduct = async () => {
    errors.code = !model.value.code;
    errors.name = !model.value.name;
    errors.category = !model.value.category;
    errors.salePrice = !model.value.salePrice || model.value.salePrice <= 0;

    if (Object.values(errors).some(e => e)) {
        toast.warning("Iltimos, majburiy maydonlarni to'ldiring!");
        return;
    }

    try {
        const formData = new FormData();
        Object.keys(model.value).forEach(key => {
            const value = model.value[key];
            if (key === 'image') {
                if (value instanceof File) formData.append('image', value);
                else if (typeof value === 'string') formData.append('image', value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        await store_product.SaveProduct(formData); 
        toast.success("Muvaffaqiyatli saqlandi!");
        handleClose();
    } catch (error) {
        toast.error("Saqlashda xatolik!");
    }
};
// --- 0. FORMATTERS ---
// Narxlarni so'm formatiga o'tkazuvchi professional funksiya
const formatPrice = (v) => {
    return new Intl.NumberFormat('uz-UZ', { 
        style: 'currency', 
        currency: 'UZS', 
        maximumFractionDigits: 0 
    }).format(v || 0);
};
</script>

<template>
    <Modal v-model="product_modal" :title="TitleAction.title" 
           subtitle="Tizimga yangi assortiment kiritish va narxlarni sozlash"
           icon="fa-solid fa-cart-plus" @close="handleClose" width="max-w-[85vw]">

        <div class="space-y-6">
            <div class="relative group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div class="absolute -top-3 left-8 px-4 py-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30">
                    <span class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <i class="fa-solid fa-fingerprint"></i> Identifikatsiya
                    </span>
                </div>

                <div class="grid grid-cols-12 gap-6 pt-2">
                    <div class="col-span-12 lg:col-span-3">
                        <FileUpload 
                            v-model="model.image" 
                            type="image" 
                            rounded="rounded-[2.5rem]"
                            :error="errors.image"
                            class="shadow-inner"
                        />
                    </div>

                    <div class="col-span-12 lg:col-span-9 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="form-label required">Artikul / Shtrix Kod</label>
                                <Input v-model="model.code" type="number" placeholder="478000..." 
                                       icon-pre="fa-solid fa-barcode" :error="errors.code" clearable />
                            </div>
                            <div class="space-y-1.5">
                                <label class="form-label required">Mahsulot To'liq Nomi</label>
                                <Input v-model="model.name" placeholder="Masalan: Coca Cola 1.5L" :error="errors.name" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="col-span-1 md:col-span-1 space-y-1.5">
                                <label class="form-label required">Kategoriya</label>
                                <Select v-model="model.category" :options="categoryes" labelKey="name" valueKey="name" 
                                        placeholder="Tanlang..." searchable :error="!!errors.category" clearable  />
                            </div>
                            <div class="space-y-1.5">
                                <label class="form-label required">O'lchov Birligi</label>
                                <Select v-model="model.unit" :options="units" labelKey="name" valueKey="id" clearable searchable/>
                            </div>
                            <div class="space-y-1.5">
                                <label class="form-label">Qadoq Hajmi (Blokda)</label>
                                <Input v-model.number="model.packSize" type="number" placeholder="12" icon-pre="fa-solid fa-layer-group" clearable />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative bg-emerald-50/50 dark:bg-emerald-950/10 rounded-[2.5rem] p-6 border border-emerald-100 dark:border-emerald-900 shadow-sm transition-all">
                <div class="absolute -top-3 left-8 px-4 py-1 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30">
                    <span class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <i class="fa-solid fa-chart-line"></i> Narx siyosati va Zaxira
                    </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                    <div class="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <label class="form-label !text-slate-400">Kelish Narxi</label>
                        <Input v-model="model.costPrice" type="number" placeholder="0" suffix="UZS"  clearable
                               class="!border-transparent" input-class="!text-lg font-black text-slate-700 dark:text-white" />
                    </div>

                    <div class="p-4 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-200 dark:border-emerald-900 shadow-md">
                        <label class="form-label !text-emerald-500">Ustama (%)</label>
                        <Input v-model="model.margainPercent" type="number" placeholder="0" suffix="%"  clearable
                               class="!border-transparent" input-class="!text-xl font-black text-emerald-600 text-center" />
                    </div>

                    <div class="p-4 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-400 dark:border-emerald-800 shadow-md ring-4 ring-emerald-500/10">
                        <label class="form-label !text-emerald-600">Sotuv Narxi</label>
                        <Input v-model="model.salePrice" type="number" placeholder="0" suffix="UZS" clearable 
                               :error="errors.salePrice" class="!border-transparent" 
                               input-class="!text-xl font-black text-emerald-700" />
                    </div>

                    <div class="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <label class="form-label">Dastlabki Qoldiq</label>
                        <Input v-model="model.totalStock" type="number" placeholder="0"  clearable
                               :suffix="model.unit || 'ta'" class="!border-transparent" 
                               input-class="!text-lg font-black text-indigo-600" />
                    </div>
                </div>

                <div class="mt-6">
                    <label class="form-label ml-4">Qo'shimcha izoh yoki tavsif</label>
                    <Input v-model="model.description" type="textarea" rows="2"  clearable
                           placeholder="Mahsulot haqida tahliliy ma'lumotlar yoki eslatma..." 
                           rounded="rounded-[1.5rem]" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-between w-full">
                <div v-if="model.salePrice > model.costPrice" class="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <i class="fa-solid fa-hand-holding-dollar text-emerald-500"></i>
                    <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">
                        Sof Foyda: {{ formatPrice(model.salePrice - model.costPrice) }} / birlik
                    </span>
                </div>
                <div v-else></div>

                <div class="flex gap-3">
                    <Button left-icon="fas fa-xmark" size="md" variant="secondary" @click="handleClose" class="!rounded-2xl !px-8">
                        Bekor qilish
                    </Button>
                    <Button left-icon="fas fa-save" size="md" :variant="TitleAction.action === 'create' ? 'primary' : 'success' " 
                            @click="SaveProduct" class="!rounded-2xl !px-10 shadow-lg shadow-indigo-500/20">
                        {{ TitleAction.action === "create" ? "Saqlash" : "Yangilash" }}
                    </Button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
.required::after { content: " *"; @apply text-rose-500 font-bold; }
.form-label { @apply block text-[10px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-[1.5px]; }

:deep(.el-input__wrapper) {
    @apply shadow-none border-none bg-transparent !important;
}

/* Modal ichidagi scrollni chiroyli qilish */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-700 rounded-full; }
</style>