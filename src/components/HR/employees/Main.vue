<template>
  <Title>
    <template v-slot:title>
      <h3><i class="fa-solid fa-users mr-3 fa-md"></i>Xodimlar boshqaruvi</h3>
    </template>
  </Title>
  <HeaderTabLink />
  <Tabel />
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import HeaderTabLink from "../../../components/HR/employees/HeaderTabLink.vue";
import Tabel from "../../../components/HR/employees/Tabel.vue";
</script>

<style scoped></style>
