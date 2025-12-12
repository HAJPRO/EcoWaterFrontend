<template>
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-calculator mr-3 fa-lg"></i>Sotuv (POS)</h3> 
      </template>
    </Title>
    <HeaderTabLink/>
    <Tabel/>
 
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import HeaderTabLink from  "../../../components/Sale/salepos/HeaderTabLink.vue"
import Tabel from  "../../../components/Sale/salepos/Tabel.vue"

</script>

<style scoped>

</style>