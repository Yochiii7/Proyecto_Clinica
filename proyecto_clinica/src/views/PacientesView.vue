<template>
  <div class="container">
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
  color: #333;
  padding: 20px;
}
</style>
