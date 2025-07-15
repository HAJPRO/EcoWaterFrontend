<template>
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-users mr-3 fa-md"></i>Mijozlar bosharuvi</h3>
      </template>
    </Title>
    <HeaderTabLink/>
    <Tabel/>
 
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import HeaderTabLink from  "../../../components/Customers/customerManagment/HeaderTabLink.vue"
import Tabel from  "../../../components/Customers/customerManagment/Tabel.vue"

</script>

<style scoped>

</style>