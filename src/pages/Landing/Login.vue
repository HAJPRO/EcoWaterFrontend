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
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <div
      class="flex flex-col col-span-1 row-span-2 bg-white items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow-[0_20px_20px_0px_rgba(0,0,0,0.3)] dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <h1
          class="bg-white rounded-md p-2 border-t-[2px] border-[#36d887] text-[18px] font-bold leading-tight text-center tracking-tight text-gray-500 dark:text-white"
        ></h1>
        <div class="p-4 md:space-y-4 sm:p-4">
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
            Kirish
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
            size="large"
            label-position="top"
            class="space-y-4 md:space-y-6 text-[13px]"
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
                >Tizimga kirish
              </el-button>
            </el-form-item>
          </el-form>
          <div class="mt-2 text-[13px]">
            <router-link
              to="/login/forget_password"
              class="text-[#36d887] hover:underline dark:text-primary-500"
            >
              Parolingiz esdan chiqdimi ?</router-link
            >
          </div>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Hali ro'yxatdan o'tmaganmisiz?
            <router-link
              to="/register"
              class="font-medium text-[#36d887] hover:underline dark:text-primary-500"
            >
              Ro'yxatdan o'tish</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
