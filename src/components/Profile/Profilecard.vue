<script setup>
import { ref, computed } from "vue";

const activeTab = ref("Shaxsiy");
const tabs = ["Shaxsiy", "Kontakt", `Ta'lim`, `Ko'nikmalar`, "Ish tajribasi"];
const user = ref({
  FIO: "Alisher Kamolovich Aliyev",
  // department: "IT Department",
  // position: "Software Engineer",
  // experience: "3 years (Google)",
  // level: "Senior",
  Yoshi: "28 years",
  Jinsi: "Male",
  Yili: "12-May-1996",
  Oilasi: "Married",
  // Tel: "+998901234567",
  Email: "alisher@gmail.com",
  Til: "English, Uzbek, Russian",
  Manzil: "Tashkent, Chilanzar district",
  // Holati: "Active",
});
const contact = ref({
  Tel: "+998901234567",
  Email: "alisher@gmail.com",
  Telegram: "@alisher",
  Instagram: "@alisher",
  Facebook: "@alisher",
  LinkedIn: "@alisher",
});
const education = ref({
  Daraja: "Bachelor's", // Bakalavr, Magistr, PhD va h.k.
  Institution: "Tashkent State University", // O‘qigan joyi
  Tamomlagan: 2022, // Bitirgan yili
  Mutaxasislik: "Computer Science", // Mutaxassislik
  Diplom: "Computer Science", // Diplom nomi
  Ball: 3.8, // O‘rtacha baho
});
const experience = ref([
  {
    company: "Tech Solutions LLC", // Ishlagan kompaniya
    position: "Software Engineer", // Lavozim
    startYear: 2020, // Ish boshlagan yili
    endYear: 2023, // Tugatgan yili (agar hali ishlayotgan bo‘lsa, null)
    responsibilities: [
      "Developed web applications",
      "Managed database optimization",
      "Led a team of junior developers",
    ], // Majburiyatlar
    achievements: [
      "Improved system performance by 30%",
      "Implemented CI/CD pipeline",
    ], // Erishilgan yutuqlar
  },
  {
    company: "InnovateX",
    position: "Frontend Developer",
    startYear: 2018,
    endYear: 2020,
    responsibilities: [
      "Designed and implemented UI components",
      "Optimized website performance",
    ],
    achievements: ["Redesigned company website, increasing engagement by 25%"],
  },
]);

const isEditing = ref(false);
const toggleEdit = () => {
  if (isEditing.value) {
    user.value = { ...editedUserInfo.value }; // Saqlash
  } else {
    editedUserInfo.value = { ...user.value }; // O‘zgartirish rejimiga o‘tish
  }
  isEditing.value = !isEditing.value;
};
const toggleEditConatct = () => {
  if (isEditing.value) {
    contact.value = { ...editedContactInfo.value }; // Saqlash
  } else {
    editedContactInfo.value = { ...contact.value }; // O‘zgartirish rejimiga o‘tish
  }
  isEditing.value = !isEditing.value;
};
const toggleEditEducation = () => {
  if (isEditing.value) {
    education.value = { ...editEducationtInfo.value }; // Saqlash
  } else {
    editEducationtInfo.value = { ...education.value }; // O‘zgartirish rejimiga o‘tish
  }
  isEditing.value = !isEditing.value;
};
const editedIndex = ref(null);
const editedJob = ref({});

// **Tahrirlash rejimini yoqish/o‘chirish**
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    editedIndex.value = null;
  }
};

// **Har bir ish joyini alohida tahrirlash**
const toggleEditJob = (index) => {
  if (editedIndex.value === index) {
    experience.value[index] = { ...editedJob.value };
    editedIndex.value = null;
  } else {
    editedJob.value = { ...experience.value[index] };
    editedIndex.value = index;
  }
};
const skills = ref(["JavaScript", "Vue.js", "Node.js", "MongoDB"]); // Boshlang'ich ko'nikmalar
const newSkill = ref(""); // Yangi skill uchun input

// **Tahrirlash rejimini yoqish/o‘chirish**
const toggleEditSkills = () => {
  isEditing.value = !isEditing.value;
};
// **Yangi ish tajribasi qo‘shish**
const addExperience = () => {
  experience.value.push({
    company: "Tech Solutions LLC", // Ishlagan kompaniya
    position: "Software Engineer", // Lavozim
    startYear: 2020, // Ish boshlagan yili
    endYear: 2023, // Tugatgan yili (agar hali ishlayotgan bo‘lsa, null)
    responsibilities: [
      "Developed web applications",
      "Managed database optimization",
      "Led a team of junior developers",
    ], // Majburiyatlar
    achievements: [
      "Improved system performance by 30%",
      "Implemented CI/CD pipeline",
    ], // Erishilgan yutuqlar
  });
};

// **Yangi skill qo'shish**
const addSkill = () => {
  if (newSkill.value.trim() !== "") {
    skills.value.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

// **Skillni o‘chirish**
const removeSkill = (index) => {
  skills.value.splice(index, 1);
};
const editedUserInfo = ref({ ...user.value });
const editedContactInfo = ref({ ...contact.value });
const editEducationtInfo = ref({ ...education.value });
const editExperienceInfo = ref({ ...experience.value });
</script>

<template>
  <div class="max-w-screen mx-auto bg-white rounded shadow overflow-hidden">
    <!-- Profil sarlavhasi -->
    <div class="relative">
      <img
        src="https://hajdev.company-erp.uz/Clothes.jpg"
        alt="Banner"
        class="w-full h-40 object-cover"
      />
      <div class="absolute -bottom-10 left-6 flex items-center">
        <img
          src="https://img.freepik.com/free-photo/medium-shot-smiley-man-sitting-desk_23-2149927603.jpg?t=st=1740713731~exp=1740717331~hmac=80f32fa460a7158c9731adc0cf8a12d6a79dd1630f0fe4cbb25e12fe7e6e4e19&w=1060"
          alt="Profil rasmi"
          class="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div
          class="ml-4 bg-white p-3 rounded shadow-sm text-left cursor-pointer"
        >
          <h2 class="text-lg font-bold text-gray-900">A.K.Aliyev</h2>
          <p class="text-sm font-bold text-gray-900">UI/UX Dizayner</p>
          <p class="text-xs font-bold text-gray-900">
            Uzbekistan,Bukhara,Gijduvan
          </p>
        </div>
      </div>
    </div>

    <!-- Profil tanasi -->
    <div class="p-6 mt-12">
      <nav class="flex border-b">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="py-2 px-4 text-sm font-medium border-b-2"
          :class="
            activeTab === tab
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600'
          "
        >
          {{ tab }}
        </button>
      </nav>

      <div v-if="activeTab === 'Shaxsiy'" class="mt-4">
        <div
          class="max-full mx-auto bg-white rounded p-6 border border-gray-200"
        >
          <!-- Profil sarlavhasi -->
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700">
              Shaxsiy ma'lumotlar
            </h2>
            <button
              @click="toggleEdit"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-1.5 rounded hover:bg-green-600"
            >
              <i v-if="!isEditing" class="fa-solid fa-edit fa-sm mr-2"></i>
              <i v-else class="fa-solid fa-check fa-sm mr-2"></i>
              {{ isEditing ? "Saqlash" : "O'zgartirish" }}
            </button>
          </div>

          <!-- Profil ma'lumotlari -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="(value, key) in user"
              :key="key"
              class="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded border"
            >
              <span class="font-medium text-gray-500 w-44">{{ key }}:</span>
              <span v-if="!isEditing" class="text-gray-900">{{ value }}</span>
              <input
                v-else
                v-model="editedUserInfo[key]"
                class="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'Kontakt'" class="mt-4">
        <div
          class="max-full mx-auto bg-white rounded p-6 border border-gray-200"
        >
          <!-- Profil sarlavhasi -->
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700">
              Kontakt ma'lumotlar
            </h2>
            <button
              @click="toggleEditConatct"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-1.5 rounded hover:bg-green-600"
            >
              <i v-if="!isEditing" class="fa-solid fa-edit fa-sm mr-2"></i>
              <i v-else class="fa-solid fa-check fa-sm mr-2"></i>
              {{ isEditing ? "Saqlash" : "O'zgartirish" }}
            </button>
          </div>

          <!-- Profil ma'lumotlari -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="(value, key) in contact"
              :key="key"
              class="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded border"
            >
              <span class="font-medium text-gray-500 w-44">{{ key }}:</span>
              <span v-if="!isEditing" class="text-gray-900">{{ value }}</span>
              <input
                v-else
                v-model="editedContactInfo[key]"
                class="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === `Ta'lim`" class="mt-4">
        <div
          class="max-full mx-auto bg-white rounded p-6 border border-gray-200"
        >
          <!-- Profil sarlavhasi -->
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700">
              Ta'lim ma'lumotlar
            </h2>
            <button
              @click="toggleEditEducation"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-1.5 rounded hover:bg-green-600"
            >
              <i v-if="!isEditing" class="fa-solid fa-edit fa-sm mr-2"></i>
              <i v-else class="fa-solid fa-check fa-sm mr-2"></i>
              {{ isEditing ? "Saqlash" : "O'zgartirish" }}
            </button>
          </div>

          <!-- Profil ma'lumotlari -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="(value, key) in education"
              :key="key"
              class="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded border"
            >
              <span class="font-medium text-gray-500 w-44">{{ key }}:</span>
              <span v-if="!isEditing" class="text-gray-900">{{ value }}</span>
              <input
                v-else
                v-model="editEducationtInfo[key]"
                class="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === `Ish tajribasi`" class="mt-4">
        <div
          class="max-w-full mx-auto bg-white rounded p-6 border border-gray-200"
        >
          <!-- Sarlavha va Umumiy tahrirlash tugmasi -->
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700">
              Ish tajribasi ma'lumotlari
            </h2>
            <!-- Ish tajribasi qo'shish tugmasi -->
            <button
              @click="addExperience"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-1.5 rounded hover:bg-green-600"
            >
              <i class="fa-solid fa-plus fa-sm mr-2"></i> Qo'shish
            </button>
          </div>

          <!-- Ish tajribasi ro'yxati -->
          <div class="grid gap-6">
            <div
              v-for="(job, index) in experience"
              :key="index"
              class="p-4 border rounded-md bg-gray-50"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-md font-semibold text-gray-800">
                  {{ job.company }}
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="toggleEditJob(index)"
                    class="text-green-600 hover:underline text-sm"
                  >
                    <i
                      v-if="editedIndex === index"
                      class="fa-solid fa-check fa-md mr-2"
                    ></i>
                    <i v-else class="fa-solid fa-edit fa-md mr-2"></i>
                  </button>
                  <button class="text-red-500 hover:underline text-sm">
                    <i class="fa-solid fa-trash fa-md mr-2"></i>
                  </button>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-500 w-44">Lavozim:</span>
                  <span v-if="editedIndex !== index" class="text-gray-900">
                    {{ job.position }}
                  </span>
                  <input
                    v-else
                    v-model="editedJob.position"
                    class="border p-2 rounded w-full"
                  />
                </div>

                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-500 w-44"
                    >Boshlagan yil:</span
                  >
                  <span v-if="editedIndex !== index" class="text-gray-900">
                    {{ job.startYear }}
                  </span>
                  <input
                    v-else
                    v-model="editedJob.startYear"
                    type="number"
                    class="border p-2 rounded w-full"
                  />
                </div>

                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-500 w-44"
                    >Tugatgan yil:</span
                  >
                  <span v-if="editedIndex !== index" class="text-gray-900">
                    {{ job.endYear || "Hozirda ishlayapti" }}
                  </span>
                  <input
                    v-else
                    v-model="editedJob.endYear"
                    type="number"
                    class="border p-2 rounded w-full"
                  />
                </div>

                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-500 w-44"
                    >Majburiyatlar:</span
                  >
                  <ul
                    v-if="editedIndex !== index"
                    class="list-disc pl-5 text-gray-900"
                  >
                    <li v-for="(task, i) in job.responsibilities" :key="i">
                      {{ task }}
                    </li>
                  </ul>
                  <textarea
                    v-else
                    v-model="editedJob.responsibilities"
                    class="border p-2 rounded w-full"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === `Ko'nikmalar`" class="mt-4">
        <div
          class="max-w-full mx-auto bg-white rounded p-6 border border-gray-200"
        >
          <!-- Sarlavha va umumiy tahrirlash -->
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700">Ko'nikmalari</h2>
            <button
              @click="toggleEditSkills"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-1.5 rounded hover:bg-green-600"
            >
              <i v-if="!isEditing" class="fa-solid fa-edit fa-sm mr-2"></i>
              <i v-else class="fa-solid fa-check fa-sm mr-2"></i>
              {{ isEditing ? "Saqlash" : "O'zgartirish" }}
            </button>
          </div>

          <!-- Ko'nikmalar ro'yxati -->
          <div class="grid gap-4">
            <div
              v-for="(skill, index) in skills"
              :key="index"
              class="flex items-center justify-between p-2 border rounded-md bg-gray-50"
            >
              <span v-if="!isEditing" class="text-gray-900">{{ skill }}</span>
              <input
                v-else
                v-model="skills[index]"
                class="border p-2 rounded w-full"
              />

              <button
                v-if="isEditing"
                @click="removeSkill(index)"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <i class="fa-solid fa-xmark fa-sm"></i>
              </button>
            </div>
          </div>

          <!-- Yangi skill qo'shish -->
          <div v-if="isEditing" class="mt-4 flex items-center space-x-2">
            <input
              v-model="newSkill"
              placeholder="Yangi ko'nikma qo'shing..."
              class="border p-2 rounded w-full"
            />
            <button
              @click="addSkill"
              class="flex items-center bg-green-500 text-white text-[13px] px-4 py-2.5 rounded hover:bg-green-600"
            >
              <i class="fa-solid fa-plus fa-sm mr-2"></i> Qo'shish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
button {
  transition: all 0.3s ease;
}
</style>
