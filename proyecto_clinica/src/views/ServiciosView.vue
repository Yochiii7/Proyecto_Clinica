<template>
  <div class="page-container">
    <h1 class="page-title">🩺 Registro y Gestión de Servicios</h1>
    
    <div class="main-card">
      <FormServicio />
    </div>
  </div>
</template>

<script>
// Importamos el nuevo componente que crearemos
import FormServicio from '../components/FormServicio.vue'

export default {
  components: { FormServicio }
}
</script>

<style scoped>
/*
 * Usamos exactamente los mismos estilos de PacientesView.vue
 * para mantener la consistencia visual.
*/
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