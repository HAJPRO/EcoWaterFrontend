<template>
  <div
    class="shadow-md rounded-md bg-white text-center text-slate-500 mb-2 mt-2 font-semibold text-[17px] p-2 cursor-pointer border-t-[1px] border-[#36d887]"
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
