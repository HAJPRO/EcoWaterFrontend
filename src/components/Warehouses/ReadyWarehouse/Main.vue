<template>
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-boxes-stacked mr-3 fa-md"></i>Tayyor mahsulot ombori</h3> 
      </template>
    </Title>
    <HeaderTabLink/>
    <Tabel/>
 
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import HeaderTabLink from  "../../../components/Warehouses/ReadyWarehouse/HeaderTabLink.vue"
import Tabel from  "../../../components/Warehouses/ReadyWarehouse/Tabel.vue"

</script>

<style scoped>

</style>