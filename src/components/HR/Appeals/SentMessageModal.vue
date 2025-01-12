<script setup>
import { ref, onMounted } from "vue";
import { HRAppealsStore } from "../../../stores/HR/Appeals/appeals.store";
const store = HRAppealsStore();
import { storeToRefs } from "pinia";
const { chat } = storeToRefs(store);
const formRef = ref();
const Sent = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store.ReplyMessageCreate(model.value);
    } else {
      return false;
    }
  });
};

const model = ref({
  reply_message: "",
});
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="chat.is_modal" title="Javob yozish oynasi" width="600">
    <span>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-12">
          <el-form-item
            label="Javob yozish"
            prop="reply_message"
            :rules="rules"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              required
              v-model="model.reply_message"
              clearable
              class="w-[100%]"
              size="smal"
              placeholder="..."
            />
          </el-form-item>
        </div>
      </el-form>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="600"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <router-link
          to=""
          @click="Sent(formRef)"
          class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
        >
          <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
        >
      </div>
    </template>
  </el-dialog>
</template>
