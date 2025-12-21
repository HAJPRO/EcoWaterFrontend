<template>
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-users mr-3 fa-md"></i>Foydalanuvchilar</h3>
      </template>
    </Title>
    <Tabel/>
    <AddUserModal/>
 
</template>

<script setup>
import { onMounted, ref } from "vue";
import Title from "../../../components/Title.vue";
import Tabel from  "./Table.vue"
import AddUserModal from  "./AddUserModal.vue"

</script>

<style scoped>

</style>