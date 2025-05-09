<script setup>
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/HR/employees/HeaderTabLink.vue";
import { computed } from "vue";
import { onMounted, ref } from "vue";



</script>
<template>
  <Title>
    <template v-slot:title>
      <h3> <i class="fa-solid fa-users-gear mr-3 fa-md"> </i>  Xodimlar boshqaruvi</h3>
    </template>
  </Title>
  <HeaderTabLink />
</template>
