<script setup>
import { format } from "date-fns";
</script>

<template>
  <!-- //PAGANATION PAGANATION PAGANATION PAGANATION// -->
  <div class="flex justify-center bg-white w-full pt-3">
    <div
      class="cursor-pointer opacity-[80%] mb-[8px] text-[11px] text-slate-500 font-semibold"
    >
      Eco Water Company {{ format(new Date(), "dd.MM.yyyy ") }}
    </div>
  </div>
  <!-- //////// -->
</template>
<style>
.background {
  background-color: red;
}
</style>
