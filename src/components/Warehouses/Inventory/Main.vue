<template>
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-file-circle-question mr-3 fa-lg"></i>Riviziya qilish</h3> 
      </template>
    </Title>
    <HeaderTabLink/>
    <Tabel/>
 
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import HeaderTabLink from  "./HeaderTabLink.vue"
import Tabel from  "./Tabel.vue"

</script>

<style scoped>

</style>