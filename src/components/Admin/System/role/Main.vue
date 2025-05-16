<template>
  <Title>
    <template v-slot:title>
      <h3><i class="fa-solid fa-user-shield mr-3 fa-md"></i>Rol boshqaruvi</h3>
    </template>
  </Title>
  <HeaderTabLink />
  <Tabel />
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Admin/System/role/HeaderTabLink.vue";
import Tabel from "../../../../components/Admin/System/role/Table.vue";
</script>

<style scoped></style>
