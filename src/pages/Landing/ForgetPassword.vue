<!-- <script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const loading = computed(() => {
  return store.state.loading;
});
const items = ref([]);
const ext = ref({
  userName: "",
  password: "",
  signedData: "",
});

const AccountGenerateToken = async () => {
  store.commit("setLoading", true, { root: true });
  try {
    const res = await AccountService.AccountGenerateToken(ext.value);
    items.value = res;
    store.commit("setLoading", false, { root: true });
  } catch (err) {
    store.commit("setLoading", false, { root: true });
    store.commit(
      "setToast",
      { show: true, msg: err.message, type: "error" },
      { root: true }
    );
  }
};
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
     
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
          Change Password
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            @submit.prevent="AccountGenerateToken"
          >
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your Email</label
              >
              <input
                v-model="ext.userName"
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >New Password</label
              >
              <input
                v-model="ext.password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label
              >
              <input
                v-model="ext.signedData"
                type="confirm-password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required=""
                />
              </div>
              <div class="ml-3 text-sm">
                <label
                  for="terms"
                  class="font-light text-gray-500 dark:text-gray-300"
                  >I accept the
                  <router-link to="/"  class="text-[#36d887] hover:underline dark:text-primary-500">Terms and Conditions?</router-link>
                  
                </label>
              </div>
            </div>
            <button
              type="submit"
              class="w-full text-white bg-[#36d887] hover:bg-[#36d887] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Reset Password
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already registered ?
              <router-link
                to="/login"
                class="font-medium text-[#36d887] hover:underline dark:text-primary-500"
                >Login</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template> -->
