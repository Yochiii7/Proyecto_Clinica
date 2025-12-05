<template>
  <div class="patient-form-container">
    <div class="form-card">
      <h2 class="form-title">{{ isEditing ? 'Editando Paciente' : 'Registro de Paciente' }}</h2>

      <div v-if="showSuccessMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="patient-form" novalidate>
        <!-- Cédula -->
        <div class="input-group">
          <label for="cedula">Cédula:</label>
          <input
            id="cedula"
            v-model="paciente.cedula_paciente"
            type="text"
            placeholder="Solo números"
            maxlength="8"
            @input="soloNumeros('cedula_paciente')"
            :disabled="isEditing"
            required
          />
        </div>

        <!-- Nombre -->
        <div class="input-group">
          <label for="nombre">Nombre:</label>
          <input
            id="nombre"
            v-model="paciente.nombre_paciente"
            type="text"
            placeholder="Solo letras"
            @input="soloLetras('nombre_paciente')"
            required
          />
        </div>

        <!-- Apellido -->
        <div class="input-group">
          <label for="apellido">Apellido:</label>
          <input
            id="apellido"
            v-model="paciente.apellido_paciente"
            type="text"
            placeholder="Solo letras"
            @input="soloLetras('apellido_paciente')"
            required
          />
        </div>

        <!-- Sexo -->
        <div class="input-group">
          <label for="sexo">Sexo:</label>
          <select id="sexo" v-model="paciente.sexo" required>
            <option disabled value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <!-- Teléfono -->
        <div class="input-group">
          <label for="telefono">Teléfono:</label>
          <input
            id="telefono"
            v-model="paciente.telefono"
            type="text"
            placeholder="Solo números"
            maxlength="13"
            @input="soloNumeros('telefono')"
          />
        </div>

        <!-- Seguro -->
        <div class="input-group">
          <label for="seguro">Seguro:</label>
          <input
            id="seguro"
            v-model="paciente.seguro"
            type="text"
            placeholder="Ej: IVSS, MPPS"
          />
        </div>

        <!-- Estado -->
        <div class="input-group">
          <label for="estado">Estado:</label>
          <select id="estado" v-model="paciente.estado" required>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting" class="submit-button">
            {{ isEditing ? (isSubmitting ? 'Actualizando...' : 'Actualizar Paciente') : (isSubmitting ? 'Registrando...' : 'Registrar Paciente') }}
          </button>

          <button
            v-if="isEditing"
            @click="cancelarEdicion"
            type="button"
            class="cancel-button"
          >
            Cancelar Edición
          </button>
        </div>
      </form>
    </div>

    <hr class="separator" />

    <!-- Lista -->
    <div class="patient-list-section">
      <div class="list-header">
        <h3 class="list-title">Pacientes Registrados</h3>
        <div class="search-bar">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar por nombre, apellido o cédula..."
          />
        </div>
      </div>

      <div
        v-if="filteredPacientes.length === 0"
        class="no-patients-message"
      >
        {{ pacientes.length > 0 ? 'No se encontraron pacientes con ese criterio.' : 'Aún no hay pacientes registrados.' }}
      </div>

      <div v-else class="pacientes-grid">
        <div
          class="paciente-card"
          v-for="p in filteredPacientes"
          :key="p.cedula_paciente"
        >
          <div class="card-header">
            <strong>{{ p.nombre_paciente }} {{ p.apellido_paciente }}</strong>
            <span
              class="status-badge"
              :class="p.estado === 'Activo' ? 'activo' : 'inactivo'"
            >
              {{ p.estado }}
            </span>
          </div>

          <div class="card-body">
            <p><strong>Cédula:</strong> {{ p.cedula_paciente }}</p>
            <p><strong>Sexo:</strong> {{ p.sexo }}</p>
            <p><strong>Teléfono:</strong> {{ p.telefono || 'No especificado' }}</p>
            <p><strong>Seguro:</strong> {{ p.seguro || 'No especificado' }}</p>
          </div>

          <div class="card-actions">
            <button @click="iniciarEdicion(p)" class="edit-btn">Editar</button>
            <button
              @click="eliminarPaciente(p.cedula_paciente)"
              class="delete-btn"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const paciente = reactive({
  cedula_paciente: '',
  nombre_paciente: '',
  apellido_paciente: '',
  sexo: '',
  telefono: '',
  seguro: '',
  estado: 'Activo',
  cargo: 'P'
})

const pacientes = ref([])
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const isEditing = ref(false)
const pacienteEditId = ref(null)
const searchTerm = ref('')

// ✅ Cargar pacientes desde la API
async function cargarPacientes() {
  const res = await fetch('http://localhost:3000/api/pacientes')
  pacientes.value = await res.json()
}

// 🚀 Cargar al montar el componente
onMounted(cargarPacientes)

// ✅ Registrar o actualizar paciente
async function handleSubmit(e) {
  const form = e.target
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  isSubmitting.value = true

  const url = isEditing.value
    ? `http://localhost:3000/api/pacientes/${pacienteEditId.value}`
    : 'http://localhost:3000/api/pacientes'
  const method = isEditing.value ? 'PUT' : 'POST'

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paciente)
  })

  const data = await res.json()
  mostrarMensajeExito(data.mensaje)
  // Emitimos evento global para que otras partes (p. ej Agenda/Calendario) refresquen datos
  if (isEditing.value) {
    window.dispatchEvent(new CustomEvent('paciente-actualizado', { detail: { cedula: pacienteEditId.value } }))
  } else {
    window.dispatchEvent(new CustomEvent('paciente-registrado', { detail: { cedula: data?.paciente?.cod_paciente } }))
  }
  isSubmitting.value = false
  limpiarCampos()
  isEditing.value = false
  cargarPacientes()
}

// ✅ Eliminar paciente
async function eliminarPaciente(cedula) {
  if (confirm('¿Estás seguro de eliminar este paciente?')) {
    const res = await fetch(`http://localhost:3000/api/pacientes/${cedula}`, { method: 'DELETE' })
    const data = await res.json()
    mostrarMensajeExito(data.mensaje)
    // Emitir evento global para notificar eliminación — útil para que la agenda/calendario refresquen y borren citas
    window.dispatchEvent(new CustomEvent('paciente-eliminado', { detail: { cedula } }))
    cargarPacientes()
  }
}

// ✅ Iniciar y cancelar edición
function iniciarEdicion(p) {
  isEditing.value = true
  pacienteEditId.value = p.cedula_paciente
  Object.assign(paciente, p)
  window.scrollTo(0, 0)
}

function cancelarEdicion() {
  isEditing.value = false
  pacienteEditId.value = null
  limpiarCampos()
}

// ✅ Validaciones simples
function soloNumeros(campo) {
  paciente[campo] = paciente[campo].replace(/[^0-9]/g, '')
}
function soloLetras(campo) {
  paciente[campo] = paciente[campo].replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '')
}

// ✅ Auxiliares
function limpiarCampos() {
  Object.assign(paciente, {
    cedula_paciente: '',
    nombre_paciente: '',
    apellido_paciente: '',
    sexo: '',
    telefono: '',
    seguro: '',
    estado: 'Activo',
    cargo: 'P'
  })
}

function mostrarMensajeExito(msg) {
  successMessage.value = msg
  showSuccessMessage.value = true
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

// 🔍 Filtrado de pacientes
const filteredPacientes = computed(() => {
  if (!searchTerm.value) return pacientes.value
  const s = searchTerm.value.toLowerCase()
  return pacientes.value.filter(p =>
    p.nombre_paciente.toLowerCase().includes(s) ||
    p.apellido_paciente.toLowerCase().includes(s) ||
    p.cedula_paciente.toLowerCase().includes(s)
  )
})
</script>

<style scoped>
/* Todo tu CSS original se mantiene igual */
.patient-form-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}
.form-card {
  background-color: var(--header-background, #fff);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1));
  margin-bottom: 2rem;
}
.form-title {
  text-align: center;
  color: var(--primary-color, #007bff);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}
.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}
.patient-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #333);
}
.input-group input,
.input-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color, #dee2e6);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.input-group input:disabled {
  background-color: #f4f7f6;
  cursor: not-allowed;
}
.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--primary-color, #007bff);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
}
.submit-button, .cancel-button {
  flex-grow: 1;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
.submit-button {
  background-color: var(--primary-color, #007bff);
  color: var(--text-light, #fff);
}
.cancel-button {
  background-color: var(--secondary-color, #6c757d);
  color: var(--text-light, #fff);
}
.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
}
.cancel-button:hover {
  background-color: #5a6268;
}
.submit-button:disabled {
  background-color: var(--secondary-color, #6c757d);
  cursor: not-allowed;
  opacity: 0.7;
}
.separator {
  border: none;
  border-top: 1px solid var(--border-color, #eee);
  margin: 2.5rem 0;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.list-title {
  color: var(--text-color, #333);
  margin: 0;
}
.search-bar input {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-color, #dee2e6);
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
}
.no-patients-message {
  text-align: center;
  color: var(--secondary-color, #6c757d);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
}
.pacientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.paciente-card {
  background: var(--header-background, #fff);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1));
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.paciente-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #eee);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}
.status-badge {
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
}
.status-badge.activo { background-color: #28a745; }
.status-badge.inactivo { background-color: #dc3545; }
.card-body p { margin: 0.5rem 0; font-size: 0.9rem; color: #555; }
.card-actions {
  display: flex;
  gap: 0.5rem;
}
.card-actions button {
  width: 100%;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}
.card-actions button:hover { opacity: 0.85; }
.edit-btn { background-color: #ffc107; }
.delete-btn { background-color: #dc3545; }
@media (max-width: 768px) {
  .patient-form { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .list-header { flex-direction: column; align-items: stretch; }
  .search-bar input { width: 100%; }
}
</style>
