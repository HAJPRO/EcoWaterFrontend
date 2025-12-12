<script setup>
import { ref, computed } from "vue";

const activeTab = ref("Shaxsiy");
const tabs = ["Shaxsiy", "Kontakt", "Ta'lim", "Ko'nikmalar", "Ish tajribasi"];

// --- MOCK DATA ---
const user = ref({
  FIO: "Alisher Kamolovich Aliyev",
  Yoshi: "28 yosh",
  Jinsi: "Erkak",
  Yili: "12-May-1996",
  Oilasi: "Turmush qurgan",
  Email: "alisher@gmail.com",
  Til: "Ingliz, O'zbek, Rus",
  Manzil: "Toshkent sh., Chilonzor tumani",
});

const contact = ref({
  Tel: "+998 90 123 45 67",
  Email: "alisher@gmail.com",
  Telegram: "@alisher_dev",
  Instagram: "@alisher_ui",
  Facebook: "fb.com/alisher",
  LinkedIn: "linkedin.com/in/alisher",
});

const education = ref({
  Daraja: "Bakalavr",
  Muassasa: "Toshkent Axborot Texnologiyalari Universiteti",
  Tamomlagan: 2022,
  Mutaxasislik: "Kompyuter Injiniringi",
  Diplom: "B20220156",
  Ball: "4.8 (GPA)",
});

const experience = ref([
  {
    company: "Tech Solutions LLC",
    position: "Senior Software Engineer",
    startYear: 2020,
    endYear: 2023,
    responsibilities: [
      "Katta hajmli web ilovalarni ishlab chiqish",
      "Ma'lumotlar bazasi arxitekturasini optimallashtirish",
      "Junior dasturchilar jamoasini boshqarish",
    ],
  },
  {
    company: "InnovateX",
    position: "Frontend Developer",
    startYear: 2018,
    endYear: 2020,
    responsibilities: [
      "UI komponentlar kutubxonasini yaratish",
      "Sayt tezligini 40% ga oshirish",
    ],
  },
]);

const skills = ref(["JavaScript", "Vue.js 3", "Node.js", "Tailwind CSS", "TypeScript", "Docker"]);
const newSkill = ref("");

// --- EDIT STATE HANDLERS ---
const isEditing = ref(false);
const editedUserInfo = ref({ ...user.value });
const editedContactInfo = ref({ ...contact.value });
const editEducationtInfo = ref({ ...education.value });
const editedJob = ref({});
const editedIndex = ref(null);

// Universal Edit Toggle
const toggleEdit = () => {
  if (isEditing.value) {
    user.value = { ...editedUserInfo.value };
    contact.value = { ...editedContactInfo.value };
    education.value = { ...editEducationtInfo.value };
  } else {
    editedUserInfo.value = { ...user.value };
    editedContactInfo.value = { ...contact.value };
    editEducationtInfo.value = { ...education.value };
  }
  isEditing.value = !isEditing.value;
};

// Skills Logic
const addSkill = () => {
  if (newSkill.value.trim()) {
    skills.value.push(newSkill.value.trim());
    newSkill.value = "";
  }
};
const removeSkill = (index) => skills.value.splice(index, 1);

// Job Edit Logic
const toggleEditJob = (index) => {
  if (editedIndex.value === index) {
    experience.value[index] = { ...editedJob.value };
    editedIndex.value = null;
  } else {
    editedJob.value = { ...experience.value[index] };
    editedIndex.value = index;
  }
};

const addExperience = () => {
  experience.value.unshift({
    company: "Yangi Kompaniya",
    position: "Lavozim",
    startYear: new Date().getFullYear(),
    endYear: null,
    responsibilities: [],
  });
  toggleEditJob(0); // Yangi qo'shilganni darhol tahrirlash
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans pb-10">
    
    <div class="relative h-64 w-full bg-slate-900 overflow-hidden group">
      <img
        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        alt="Cover"
        class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div class="relative group">
            <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl">
              <img
                src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
                alt="Avatar"
                class="w-full h-full object-cover rounded-[20px] border-4 border-white dark:border-slate-900"
              />
            </div>
            <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
          </div>

          <div class="flex-1 text-center sm:text-left mb-2">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-1">{{ user.FIO }}</h1>
            <p class="text-indigo-600 dark:text-indigo-400 font-medium mb-3">Senior Software Engineer</p>
            
            <div class="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                <i class="fa-solid fa-location-dot text-indigo-500"></i> Toshkent, O'zbekiston
              </span>
              <span class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                <i class="fa-solid fa-briefcase text-indigo-500"></i> 5+ yil tajriba
              </span>
            </div>
          </div>

          <div class="mb-2">
             <button
              @click="toggleEdit"
              class="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 active:scale-95"
            >
              <i class="mr-2 transition-transform duration-300" :class="isEditing ? 'fa-solid fa-check scale-110' : 'fa-solid fa-pen-to-square group-hover:rotate-12'"></i>
              {{ isEditing ? "Saqlash" : "Tahrirlash" }}
            </button>
          </div>
        </div>

        <div class="mt-10 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 relative"
              :class="activeTab === tab 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            >
              {{ tab }}
              <span v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-t-full"></span>
            </button>
          </nav>
        </div>

        <div class="py-8">
          <transition name="fade" mode="out-in">
            
            <div v-if="activeTab === 'Shaxsiy'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div v-for="(value, key) in user" :key="key" class="group bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ key }}</label>
                <div v-if="!isEditing" class="text-base font-semibold text-slate-800 dark:text-slate-200">{{ value }}</div>
                <input
                  v-else
                  v-model="editedUserInfo[key]"
                  class="custom-input w-full"
                />
              </div>
            </div>

            <div v-else-if="activeTab === 'Kontakt'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div v-for="(value, key) in contact" :key="key" class="relative group bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <i class="fa-solid" :class="getIcon(key)"></i>
                  </div>
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ key }}</label>
                </div>
                
                <div v-if="!isEditing" class="text-base font-semibold text-slate-800 dark:text-slate-200 pl-11">{{ value }}</div>
                <input
                  v-else
                  v-model="editedContactInfo[key]"
                  class="custom-input w-full ml-11 !w-[calc(100%-2.75rem)]"
                />
              </div>
            </div>

            <div v-else-if="activeTab === `Ta'lim`" class="animate-fade-in-up">
               <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                     <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md text-2xl">🎓</div>
                        <div>
                           <h3 class="text-lg font-bold text-slate-900 dark:text-white">Oliy Ma'lumot</h3>
                           <p class="text-sm text-slate-500">Universitet darajasi</p>
                        </div>
                     </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     <div v-for="(value, key) in education" :key="key" class="border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                        <label class="text-xs text-slate-500 dark:text-slate-400 block mb-1">{{ key }}</label>
                        <div v-if="!isEditing" class="font-semibold text-slate-800 dark:text-slate-200">{{ value }}</div>
                        <input v-else v-model="editEducationtInfo[key]" class="custom-input w-full" />
                     </div>
                  </div>
               </div>
            </div>

            <div v-else-if="activeTab === `Ko'nikmalar`" class="animate-fade-in-up">
               <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <div class="flex flex-wrap gap-3">
                     <div v-for="(skill, index) in skills" :key="index" 
                          class="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md
                                 bg-slate-100 text-slate-700 hover:bg-white hover:text-indigo-600
                                 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400">
                        <span>{{ skill }}</span>
                        <button v-if="isEditing" @click="removeSkill(index)" class="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                           <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                     </div>
                     
                     <div v-if="isEditing" class="flex items-center gap-2">
                        <input 
                           v-model="newSkill" 
                           @keyup.enter="addSkill"
                           placeholder="Yangi ko'nikma..." 
                           class="bg-transparent border-b-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 outline-none px-2 py-1 text-sm text-slate-700 dark:text-slate-200 w-32 focus:w-48 transition-all placeholder:text-slate-400" 
                        />
                        <button @click="addSkill" class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 active:scale-90 transition-transform">
                           <i class="fa-solid fa-plus"></i>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div v-else-if="activeTab === `Ish tajribasi`" class="animate-fade-in-up">
               <div class="flex justify-end mb-6">
                  <button @click="addExperience" class="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors">
                     <i class="fa-solid fa-plus-circle text-lg"></i> Tajriba qo'shish
                  </button>
               </div>

               <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
                  
                  <div v-for="(job, index) in experience" :key="index" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     
                     <div class="absolute left-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 shadow-lg md:left-1/2 md:-translate-x-1/2 flex items-center justify-center text-white z-10 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-briefcase text-xs"></i>
                     </div>

                     <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900">
                        
                        <div class="flex justify-between items-start mb-2">
                           <div v-if="editedIndex !== index">
                              <h3 class="font-bold text-lg text-slate-800 dark:text-white">{{ job.position }}</h3>
                              <div class="text-indigo-600 dark:text-indigo-400 font-medium">{{ job.company }}</div>
                           </div>
                           <div v-else class="flex flex-col gap-2 w-full">
                              <input v-model="editedJob.position" class="custom-input font-bold" placeholder="Lavozim" />
                              <input v-model="editedJob.company" class="custom-input text-indigo-600" placeholder="Kompaniya" />
                           </div>

                           <div class="flex gap-2 ml-4">
                              <button @click="toggleEditJob(index)" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center">
                                 <i class="fa-solid" :class="editedIndex === index ? 'fa-check text-green-500' : 'fa-pen'"></i>
                              </button>
                           </div>
                        </div>

                        <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                           <i class="fa-regular fa-calendar"></i>
                           <span v-if="editedIndex !== index">{{ job.startYear }} - {{ job.endYear || 'Hozir' }}</span>
                           <div v-else class="flex gap-2">
                              <input v-model="editedJob.startYear" type="number" class="custom-input w-20 py-0 text-xs" /> - 
                              <input v-model="editedJob.endYear" type="number" class="custom-input w-20 py-0 text-xs" placeholder="Hozir" />
                           </div>
                        </div>

                        <ul v-if="editedIndex !== index" class="space-y-2">
                           <li v-for="(task, i) in job.responsibilities" :key="i" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                              {{ task }}
                           </li>
                        </ul>
                        <textarea v-else v-model="editedJob.responsibilities" class="custom-input w-full text-sm min-h-[80px]" placeholder="Majburiyatlar (virgul bilan ajrating)"></textarea>
                     </div>
                  </div>

               </div>
            </div>

          </transition>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 Custom Input Style */
.custom-input {
  @apply bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg px-3 py-1.5 
         text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 
         focus:border-indigo-500 outline-none transition-all duration-200;
}

/* 🎭 Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>