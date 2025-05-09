<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-100 bg-center bg-cover"
    style="
      background: url('../../../public/eco_water.jpeg')
        no-repeat center center/cover;
    "
    
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 bg-opacity-90">
      <h1
        class="bg-white rounded-md p-2 shadow-md border-t-[2px] mt-0 mb-4 border-[#36d887] text-[16px] font-bold leading-tight text-center tracking-tight text-gray-500 dark:text-white"
      >
        Kirish
      </h1>

      <img
        class="rounded-[50%] mx-auto"
        src="../../../public/eco_logo.jpg"
        width="90px"
        height="90px"
        alt="logo"
      />

      <el-alert
        v-if="is_alert"
        type="error"
        :description="items.errors"
        show-icon
      ></el-alert>

      <!-- Tabs -->
      <div class="flex justify-between mb-4 border-b pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="ActiveTab(tab.id)"
          class="flex flex-col items-center px-2 py-1 transition"
          :class="{
            'text-black font-bold border-b-2 border-green-500':
              activeTab === tab.id,
            [tab.color]: true,
          }"
        >
          <i :class="tab.icon + ' text-3xl'"></i>
          <span class="text-sm">{{ tab.name }}</span>
        </button>
      </div>

      <div class="p-4 space-y-4 md:space-y-4 sm:p-6">
        <el-form
          v-if="activeTab === 'email'"
          ref="formRef"
          :model="user"
          label-width="auto"
          size="large"
          label-position="top"
          class="space-y-4 md:space-y-6 text-[13px]"
        >
          <el-form-item label="Email" prop="username" :rules="rules">
            <el-input
              clearable
              v-model="user.username"
              type="text"
              placeholder="..."
              required
            />
          </el-form-item>
          <el-form-item label="Parol" prop="password" :rules="rules">
            <el-input
              clearable
              v-model="user.password"
              type="password"
              placeholder="••••••••"
              required
            />
          </el-form-item>
          <el-form-item>
            <el-button
              @click="LoginValidate(formRef)"
              style="
                background-color: #36d887;
                width: 100%;
                color: white;
                border: none;
                cursor: pointer;
              "
            >
              Tizimga kirish
            </el-button>
          </el-form-item>
        </el-form>

        <div v-if="activeTab === 'face'" class="text-center text-gray-600">
          Face ID orqali autentifikatsiya qilish Agar telefoningizda myid
          ilovasi o'rnatilmagan bo'lsa, uni o'rnating va ro'yxatdan o'ting.
          Shundan so'ng siz shaxsiy kabinetingizga shu usulda kirishingiz mumkin
          bo'ladi.
        </div>

        <div v-if="activeTab === 'oneid'" class="text-center text-gray-600">
          ONE ID orqali autentifikatsiya qilish Agar
          <a class="text-green-500" href="https://id.egov.uz/">id.egov.uz</a>
          sizda saytida akkauntingiz bo'lsa va siz bizning veb-saytimizda
          ro'yxatdan o'tgan bo'lsangiz, O'zbekiston Respublikasi EX
          foydalanuvchilarining Yagona identifikatsiya tizimining veb-saytidan
          foydalanib shaxsiy kabinetingizga kirishingiz mumkin. Buning uchun
          login tugmasini bosing va id.egov.uz saytiga kiring.
        </div>

        <div v-if="activeTab === 'eimzo'" class="text-center text-gray-600">
          <ERI-LOGIN />
        </div>

        <div class="mt-2 text-[13px] text-center">
          <router-link
            to="/login/forget_password"
            class="text-[#36d887] hover:underline dark:text-primary-500"
          >
            Parolingiz esdan chiqdimi?
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { AuthStore } from "../../stores/Auth/auth.js";
const store = AuthStore();
import { storeToRefs } from "pinia";

const { is_alert, items } = storeToRefs(store);
const user = ref({
  username: "",
  password: "",
});
const formRef = ref();
const activeTab = ref("email");
const ActiveTab = (id) => {
  activeTab.value = id;

  if (id === "eimzo") {
    window.location.href = "login/eimzo";
  }
  if (id === "oneid") {
    window.location.href =
      "https://id.egov.uz/?client_id=suvan-net&token_id=31d45abc-b2f2-4dce-a7fc-03a730b046ea&method=IDPW";
  }
  if (id === "face") {
    window.location.href =
      "https://signin.myid.uz/login/?client_id=ahost_reg_redirect-HymlCxPYpbY1okRTYhN7jRNItJax6NTz8I18Dkh9&response_type=code&redirect_uri=https%3A%2F%2Fclients.ahost.uz%2Fmyid%2Fcallback.php&scopes=address%2Ccontacts%2Cdoc_data%2Ccommon_data&auth_method=simple&status=0&state=eyJzdGF0ZSI6ImxvZ2luIiwib3JkZXJfaWQiOm51bGx9&oauth2_id=912017cf-7c95-400c-8a68-faa7a1c1af62";
  }
  store.ActiveTab = activeTab.value;
};
const tabs = ref([
  {
    id: "email",
    name: "E-mail",
    icon: "fas fa-envelope",
    color: "text-orange-500 hover:text-orange-600",
  },
  {
    id: "face",
    name: "FACE ID",
    icon: "fas fa-user-check",
    color: "text-green-500 hover:text-green-600",
  },
  {
    id: "oneid",
    name: "ONE ID",
    icon: "fas fa-id-card",
    color: "text-purple-600 hover:text-purple-700",
  },
  {
    id: "eimzo",
    name: "e-imzo",
    icon: "fas fa-key",
    color: "text-blue-500 hover:text-blue-600",
  },
]);

const LoginValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      Login();
    } else {
      return false;
    }
  });
};

const Login = async () => {
  try {
    await store.login(user.value);
  } catch (err) {
    console.log(err.message);
  }
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur!`,
  trigger: "blur",
});
</script>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}
</style>
