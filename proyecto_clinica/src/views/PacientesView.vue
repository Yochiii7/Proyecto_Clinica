<template>
  <div class="page-container">
    <h1 class="page-title">🧑‍🤝‍🧑 Registro y Expedientes de Pacientes</h1>
    <div class="main-card">

      <FormPaciente @pacienteRegistrado="manejarRegistroExitoso" />

      <div v-if="listaPacientes.length > 0" class="mt-5 pt-3 border-top">
          <h2 class="text-primary mb-3">Últimos Pacientes Registrados</h2>
          <ul class="list-group">
            <li v-for="p in listaPacientes" :key="p.id" class="list-group-item d-flex justify-content-between align-items-center">
                {{ p.nombre_paciente }} {{ p.apellido_paciente }} (Cédula: {{ p.cedula_paciente }})
                <span class="badge bg-primary rounded-pill">ID: {{ p.id }}</span>
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

  // *******************************************************************
  // MODIFICACIÓN 4: LÓGICA DEL PADRE PARA RECIBIR Y MANEJAR EL EVENTO
  // *******************************************************************
  data() {
    return {
      // Lista reactiva para demostrar que el padre recibe los datos
      listaPacientes: []
    }
  },
  methods: {
    // Método que recibe el objeto del hijo (payload del emit)
    manejarRegistroExitoso(nuevoPaciente) {
      // Añade el paciente recibido al inicio de la lista local del padre
      this.listaPacientes.unshift(nuevoPaciente);

      // Mantiene la lista corta para la demo
      if (this.listaPacientes.length > 5) {
          this.listaPacientes.pop();
      }

      // Opcional: una alerta para asegurar que la acción es visible en el video
      // alert(`[PacientesView (Padre)] Recibió notificación: ${nuevoPaciente.nombre_paciente}`);
    }
  }
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

/* Estilos para la demo de la lista de pacientes (No afectan el formulario) */
.mt-5 { margin-top: 3rem !important; }
.pt-3 { padding-top: 1rem !important; }
.border-top { border-top: 1px solid #ccc !important; }
.text-primary { color: var(--primary-color, #007bff) !important; }
.mb-3 { margin-bottom: 1rem !important; }

.list-group {
    list-style: none;
    padding: 0;
    margin: 0;
}

.list-group-item {
    padding: 0.75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
}

.list-group-item:first-child {
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
}

.list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
}

.d-flex { display: flex !important; }
.justify-content-between { justify-content: space-between !important; }
.align-items-center { align-items: center !important; }

.badge {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: .75em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25rem;
    color: #fff;
}

.bg-primary {
    background-color: var(--primary-color, #007bff) !important;
}

.rounded-pill {
    border-radius: 50rem !important;
}
</style>
