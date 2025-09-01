<template>
  <div
    class="shadow-md rounded-md bg-white dark:bg-slate-500 text-center text-slate-500 dark:text-slate-300 mt-1 font-semibold text-[17px] p-2 cursor-pointer border-t-[1px] border-[#36d887]"
  >
    <slot name="title"></slot>
  </div>
  <nav class="flex mb-1 mt-0" aria-label="Breadcrumb">
    <slot name="breadcrumb"></slot>
  </nav>
</template>

<script>
export default {};
</script>

<style></style>
