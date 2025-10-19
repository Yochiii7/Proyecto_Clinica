<template>
  <div class="container">
    <h1>Registro de Pacientes 🏥</h1>
    <FormPaciente />
  </div>
</template>

<script>
import FormPaciente from '../components/FormPaciente.vue'

export default {
  components: { FormPaciente }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
