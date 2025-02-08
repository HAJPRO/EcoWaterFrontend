<script setup>
import { SeamEmployeesStore } from "../../../../stores/Seam/Employees/employees.store";
const store_employees = SeamEmployeesStore();
import { storeToRefs } from "pinia";
const { isActive, is_report_modal } = storeToRefs(store_employees);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/employees/HeaderTabLink.vue";
import EmployeesTable from "../../../../components/Seam/employees/EmployeesTable.vue";
import ReportEmployeeModal from "../../../../components/Seam/employees/ReportEmployeeModal.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Tikuv ishchi xodimlar</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <EmployeesTable v-if="isActive === 1" />
    <ReportEmployeeModal v-if="is_report_modal === true" />
  </div>
</template>
