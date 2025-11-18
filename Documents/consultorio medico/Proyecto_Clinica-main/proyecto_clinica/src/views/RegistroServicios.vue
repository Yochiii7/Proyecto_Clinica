<script setup>
import { ref, computed } from 'vue'

// --- ESTADO REACTIVO ---
const areasMedicas = ref([
  { id: 1, servicio: "Consulta General", precio: 45.00, medico: "Dr. Juan Pérez" },
  { id: 2, servicio: "Cardiología", precio: 120.00, medico: "Dra. Ana López" }
])

const nextId = ref(areasMedicas.value.length > 0 ? Math.max(...areasMedicas.value.map(a => a.id)) + 1 : 1)
const isModifying = ref(false)
const modifyId = ref(null)

const form = ref({
  servicio: '',
  precio: 0.00,
  medico: ''
})

// --- COMPUTED ---
const formTitle = computed(() => isModifying.value
  ? `Modificar Servicio ID: ${modifyId.value}`
  : 'Registrar Nuevo Servicio')

const submitButtonText = computed(() => isModifying.value
  ? 'Guardar Cambios'
  : 'Registrar Servicio')

// --- FUNCIONES ---
function resetForm() {
  form.value = { servicio: '', precio: 0.00, medico: '' }
  isModifying.value = false
  modifyId.value = null
}

function handleSubmit() {
  if (!form.value.servicio || form.value.precio <= 0 || !form.value.medico) {
    alert("Por favor, rellena todos los campos correctamente.")
    return
  }

  const nuevoPrecio = parseFloat(form.value.precio).toFixed(2)

  if (isModifying.value) {
    const index = areasMedicas.value.findIndex(area => area.id === modifyId.value)
    if (index !== -1) {
      areasMedicas.value[index].servicio = form.value.servicio
      areasMedicas.value[index].precio = nuevoPrecio
      areasMedicas.value[index].medico = form.value.medico
      alert("Servicio modificado con éxito.")
    }
  } else {
    const nuevoRegistro = {
      id: nextId.value++,
      servicio: form.value.servicio,
      precio: nuevoPrecio,
      medico: form.value.medico
    }
    areasMedicas.value.push(nuevoRegistro)
    alert("Servicio registrado con éxito.")
  }

  resetForm()
}

function cargarParaModificar(id) {
  const area = areasMedicas.value.find(area => area.id === id)
  if (area) {
    form.value.servicio = area.servicio
    form.value.precio = parseFloat(area.precio)
    form.value.medico = area.medico
    isModifying.value = true
    modifyId.value = id
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function eliminarRegistro(id) {
  if (confirm(`¿Estás seguro de que quieres eliminar el servicio con ID ${id}?`)) {
    areasMedicas.value = areasMedicas.value.filter(area => area.id !== id)
    alert("Servicio eliminado con éxito.")
    if (modifyId.value === id) resetForm()
  }
}
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">💉 Registro de Servicios Médicos</h1>

    <div class="card-panel form-panel">
      <div class="card-header primary-bg">
        <h5>{{ formTitle }}</h5>
      </div>
      <div class="card-content">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="servicio" class="form-label">Nombre del Servicio:</label>
            <input type="text" class="form-input" id="servicio" required v-model="form.servicio">
          </div>

          <div class="form-group">
            <label for="precio" class="form-label">Precio ($):</label>
            <input type="number" step="0.01" class="form-input" id="precio" required min="0.01" v-model="form.precio">
          </div>

          <div class="form-group">
            <label for="medico" class="form-label">Médico Responsable:</label>
            <input type="text" class="form-input" id="medico" required v-model="form.medico">
          </div>

          <div class="button-group">
            <button type="submit" class="btn" :class="isModifying ? 'btn-warning' : 'btn-primary'">
              {{ submitButtonText }}
            </button>
            <button type="button" class="btn btn-secondary" v-if="isModifying" @click="resetForm">
              Cancelar Modificación
            </button>
          </div>
        </form>
      </div>
    </div>

    <h2 class="section-title">Servicios Registrados</h2>
    <div class="card-panel table-panel">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Servicio</th>
              <th>Precio</th>
              <th>Médico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="area in areasMedicas" :key="area.id">
              <td>{{ area.id }}</td>
              <td>{{ area.servicio }}</td>
              <td class="price-cell">${{ parseFloat(area.precio).toFixed(2) }}</td>
              <td>{{ area.medico }}</td>
              <td>
                <button class="btn btn-warning me-2" @click="cargarParaModificar(area.id)">Modificar</button>
                <button class="btn btn-danger" @click="eliminarRegistro(area.id)">Eliminar</button>
              </td>
            </tr>
            <tr v-if="areasMedicas.length === 0">
              <td colspan="5" class="empty-row">No hay servicios médicos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Las variables se heredan de App.vue */

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
  text-align: center;
}

.section-title {
  color: var(--primary-color);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

/* --- Panel Genérico (Tarjeta) --- */
.card-panel {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.5rem;
  color: var(--text-light);
}

.card-header h5 {
  margin: 0;
  font-weight: 500;
  font-size: 1.15rem;
}

.card-content {
  padding: 1.5rem;
}

.primary-bg { background-color: var(--primary-color); }

/* --- Formulario --- */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* --- Botones (Reemplazando Bootstrap) --- */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  color: var(--text-light);
}

.btn-primary {
  background-color: var(--primary-color);
}
.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-warning {
  background-color: var(--tertiary-color); /* Naranja */
  color: var(--text-color);
}
.btn-warning:hover {
  background-color: #e68a00;
}

.btn-danger {
  background-color: #dc3545; /* Rojo para eliminar */
}
.btn-danger:hover {
  background-color: #c82333;
}

.btn-secondary {
  background-color: var(--secondary-color);
}
.btn-secondary:hover {
  background-color: #5a6268;
}

.me-2 {
  margin-right: 0.5rem;
}

/* --- Tabla (Reemplazando Bootstrap) --- */
.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background-color: var(--primary-color);
  color: var(--text-light);
}

.data-table th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--primary-light);
}

.data-table tbody tr:nth-child(even) {
  background-color: var(--primary-light); /* Rayas más suaves */
}

.data-table tbody tr:hover {
  background-color: #f0f4fa;
}

.data-table td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.price-cell {
  font-weight: 600;
  color: var(--primary-color);
}

.empty-row {
  text-align: center;
  font-style: italic;
  color: var(--secondary-color);
}
</style>
