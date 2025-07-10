<script setup>
import { computed, ref } from "vue";
import { AuthStore } from "../../stores/Auth/auth.js";
const store = AuthStore();
import { storeToRefs } from "pinia";

const user = ref({
  username: "",
  department: "",
  password: "",
});
const formRef = ref();
const LoginValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      Login();
    } else {
      return false;
    }
  });
};
const Register = async () => {
  try {
    await store.register(user.value);
  } catch (err) {
    console.log(err.message);
  }
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
const register = async () => {
  try {
    if (!user.username || !user.password || !user.department) {
      alert("Barcha qatorlarni to'diring");
    } else {
      await store.register(user);
    }
  } catch (err) {
    console.log(err.message);
  }
};
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 h-screen">
    <div
      class="flex flex-col col-span-1 row-span-2 bg-white items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow-[0_20px_20px_0px_rgba(0,0,0,0.3)] dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <h1
          class="bg-white rounded-md p-2 border-t-[2px] border-[#36d887] text-[18px] font-bold leading-tight text-center tracking-tight text-gray-500 dark:text-white"
        ></h1>
        <div class="p-4 space-y-4 md:space-y-4 sm:p-4">
          <img
            class="rounded-[50%]"
            src="../../../public/eco_logo.jpg"
            width="120px"
            height="120px"
            alt="logo"
            style="align-items: center; margin: 0 auto 0"
          />

          <h1
            class="text-[15px] font-bold leading-tight text-center tracking-tight text-gray-500 md:text-md dark:text-white"
          >
            Ro'yxatdan o'tish
          </h1>
          <el-alert
            v-if="is_alert"
            type="error"
            :description="items.errors"
            show-icon
          >
          </el-alert>
          <el-form
            ref="formRef"
            :model="user"
            label-width="auto"
            size="middle"
            label-position="top"
            class="space-y-2 p-4 md:space-y-2 text-[11px]"
          >
            <el-form-item label="Login" prop="username" :rules="rules">
              <el-input
                clearable
                v-model="user.username"
                type="String"
                placeholder="..."
                required
              />
            </el-form-item>
            <el-form-item label="Password" prop="password" :rules="rules">
              <el-input
                clearable
                v-model="user.password"
                type="Password"
                placeholder="••••••••"
                required
              />
            </el-form-item>
            <el-form-item label="Department" prop="department" :rules="rules">
              <el-input
                clearable
                v-model="user.department"
                type="String"
                placeholder="..."
                required
              />
            </el-form-item>
            <el-form-item>
              <el-button
                @click="Register(formRef)"
                style="
                  background-color: #36d887;
                  width: 100%;
                  color: white;
                  border: none;
                  cursor: pointer;
                "
                >Yuborish
              </el-button>
            </el-form-item>
          </el-form>
          <div class="mt-2 pl-4 text-[13px]">
            <router-link
              to="/login/forget_password"
              class="text-[#36d887] hover:underline dark:text-primary-500"
            >
              Parolingiz esdan chiqdimi ?</router-link
            >
          </div>

          <p class="pl-4 text-sm font-light text-gray-500 dark:text-gray-400">
            Allaqachon ro'yxatdan o'tganmisiz?
            <router-link
              to="/login"
              class="font-medium text-[#36d887] hover:underline dark:text-primary-500"
              >Kirish</router-link
            >
          </p>
          <!-- <form class="space-y-4 md:space-y-6" @submit.prevent="register">
            <div>
              <label
                for="String"
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                >Login</label
              >
              <input
                v-model="user.username"
                type="string"
                name="username"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required=""
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                >Bo'lim</label
              >
              <input
                v-model="user.department"
                type="string"
                name="username"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                >Pasword</label
              >
              <input
                v-model="user.password"
                type="password"
                name="password"
                id="password"
                placeholder=""
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>

            <button
              type="submit"
              class="w-full text-white bg-[#36d887] hover:bg-[#36d887] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Yuborish
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Allaqachon ro'yxatdan o'tganmisiz?
              <router-link
                to="/login"
                class="font-medium text-[#36d887] hover:underline dark:text-primary-500"
                >Kirish</router-link
              >
            </p>
          </form> -->
        </div>
      </div>
    </div>
  </section>
</template>
