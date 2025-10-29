<template>
  <div class="container py-4">
    <h1 class="text-center text-primary mb-4">🧑‍🤝‍🧑 Registro y Expedientes de Pacientes</h1>

    <div class="card p-4 shadow-sm">
      <!-- Formulario hijo -->
      <FormPaciente @paciente-registrado="manejarRegistroExitoso" />

      <!-- Lista de últimos pacientes -->
      <div v-if="listaPacientes.length" class="mt-5 border-top pt-3">
        <h2 class="text-primary mb-3">Últimos Pacientes Registrados</h2>
        <ul class="list-group">
          <li v-for="p in listaPacientes" :key="p.cedula_paciente"
              class="list-group-item d-flex justify-content-between align-items-center">
            {{ p.nombre_paciente }} {{ p.apellido_paciente }} (Cédula: {{ p.cedula_paciente }})
            <span class="badge bg-primary rounded-pill">ID: {{ p.cedula_paciente }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import FormPaciente from '../components/FormPaciente.vue'

export default {
  components: { FormPaciente },
  data() {
    return {
      listaPacientes: []
    }
  },
  methods: {
    manejarRegistroExitoso(nuevoPaciente) {
      // Añade al inicio de la lista
      this.listaPacientes.unshift(nuevoPaciente)

      // Mantener máximo 5 pacientes para demo
      if (this.listaPacientes.length > 5) this.listaPacientes.pop()
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
.card {
  border-radius: 12px;
  background-color: #fff;
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
}
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}
</style>

