<template>
  <div class="page-container">
    <h1 class="page-title">🧑‍⚕️ Registro y Gestión de Doctores</h1>
    <div class="main-card">
      <FormDoctor />
    </div>
  </div>
</template>

<script>
import FormDoctor from '../components/FormDoctor.vue'

export default {
  components: { FormDoctor }
}
</script>

<style scoped>
/* Estilos idénticos a PacientesView.vue */
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