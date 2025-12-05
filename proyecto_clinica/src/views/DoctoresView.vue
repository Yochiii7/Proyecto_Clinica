<script setup>
import DoctoresForm from '../components/DoctoresForm.vue'
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">👨‍⚕️ Gestión de Médicos y Especialistas</h1>
    <div class="main-card">
      <DoctoresForm />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
}

.main-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
}
</style>
