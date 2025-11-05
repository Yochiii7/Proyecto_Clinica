<template>
  <div class="page-container">
    <h1 class="page-title">🧑‍🤝‍🧑 Registro y Expedientes de Pacientes</h1>
    <div class="main-card">
      <FormPaciente />
    </div>
  </div>
</template>

<script>
import FormPaciente from '../components/FormPaciente.vue'

export default {
  components: { FormPaciente }
}
</script>

<style scoped>
.page-container {
  max-width: 800px;
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
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
}
</style>
