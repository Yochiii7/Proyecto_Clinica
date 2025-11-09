<template>
  <div class="doctor-form-container"> <div class="form-card">
      <h2 class="form-title">{{ isEditing ? 'Editando Doctor' : 'Registro de Doctor' }}</h2>

      <div v-if="showSuccessMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="doctor-form" novalidate>
        <div class="input-group">
          <label for="dni">DNI:</label>
          <input
            id="dni"
            v-model="doctor.dni_doctor"
            type="text"
            placeholder="Solo números"
            maxlength="8"
            @input="soloNumeros('dni_doctor')"
            :disabled="isEditing"
            required
          />
        </div>

        <div class="input-group">
          <label for="nombre">Nombre:</label>
          <input
            id="nombre"
            v-model="doctor.nombre_doctor"
            type="text"
            placeholder="Solo letras"
            @input="soloLetras('nombre_doctor')"
            required
          />
        </div>

        <div class="input-group">
          <label for="apellido">Apellido:</label>
          <input
            id="apellido"
            v-model="doctor.apellido_doctor"
            type="text"
            placeholder="Solo letras"
            @input="soloLetras('apellido_doctor')"
            required
          />
        </div>

        <div class="input-group">
          <label for="sexo">Sexo:</label>
          <select id="sexo" v-model="doctor.sexo" required>
            <option disabled value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div class="input-group">
          <label for="telefono">Teléfono:</label>
          <input
            id="telefono"
            v-model="doctor.telefono"
            type="text"
            placeholder="Solo números"
            maxlength="13"
            @input="soloNumeros('telefono')"
          />
        </div>

        <div class="input-group">
          <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input
            id="fecha_nacimiento"
            v-model="doctor.fecha_nacimiento"
            type="date"
            required
          />
        </div>

        <div class="input-group">
          <label for="correo">Correo Electrónico:</label>
          <input
            id="correo"
            v-model="doctor.correo"
            type="email"
            placeholder="ejemplo@dominio.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="nacionalidad">Nacionalidad:</label>
          <input
            id="nacionalidad"
            v-model="doctor.nacionalidad"
            type="text"
            placeholder="Venezolano(a)"
          />
        </div>

        <div class="input-group" style="grid-column: 1 / -1;">
          <label for="estado">Estado:</label>
          <select id="estado" v-model="doctor.estado" required>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting" class="submit-button">
            {{ isEditing ? (isSubmitting ? 'Actualizando...' : 'Actualizar Doctor') : (isSubmitting ? 'Registrando...' : 'Registrar Doctor') }}
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

    <div class="doctor-list-section">
      <div class="list-header">
        <h3 class="list-title">Doctores Registrados</h3>
        <div class="search-bar">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar por nombre, apellido o DNI..."
          />
        </div>
      </div>

      <div
        v-if="filteredDoctores.length === 0"
        class="no-doctors-message"
      >
        {{ doctores.length > 0 ? 'No se encontraron doctores con ese criterio.' : 'Aún no hay doctores registrados.' }}
      </div>

      <div v-else class="doctores-grid">
        <div
          class="doctor-card"
          v-for="d in filteredDoctores"
          :key="d.cod_doctor"
        >
          <div class="card-header">
            <strong>{{ d.nombre_doctor }} {{ d.apellido_doctor }}</strong>
            <span
              class="status-badge"
              :class="d.estado === 'Activo' ? 'activo' : 'inactivo'"
            >
              {{ d.estado }}
            </span>
          </div>

          <div class="card-body">
            <p><strong>DNI:</strong> {{ d.dni_doctor }}</p>
            <p><strong>Correo:</strong> {{ d.correo }}</p>
            <p><strong>Teléfono:</strong> {{ d.telefono || 'No especificado' }}</p>
            <p><strong>Nacimiento:</strong> {{ d.fecha_nacimiento }}</p>
          </div>

          <div class="card-actions">
            <button @click="iniciarEdicion(d)" class="edit-btn">Editar</button>
            <button
              @click="eliminarDoctor(d.dni_doctor)"
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

const API_URL = 'http://localhost:3000/api/doctores'

// Estado reactivo para el formulario
const doctor = reactive({
  dni_doctor: '',
  nombre_doctor: '',
  apellido_doctor: '',
  sexo: '',
  telefono: '',
  fecha_nacimiento: '',
  correo: '',
  nacionalidad: 'Venezolano(a)',
  estado: 'Activo'
})

// Lista de doctores
const doctores = ref([])
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const isEditing = ref(false)
const doctorEditDni = ref(null) // Usamos DNI para editar
const searchTerm = ref('')

// Cargar doctores
async function cargarDoctores() {
  const res = await fetch(API_URL)
  doctores.value = await res.json()
}

onMounted(cargarDoctores)

// Registrar o actualizar
async function handleSubmit(e) {
  const form = e.target
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  isSubmitting.value = true

  const url = isEditing.value
    ? `${API_URL}/${doctorEditDni.value}` // Actualiza por DNI
    : API_URL
  const method = isEditing.value ? 'PUT' : 'POST'

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctor)
  })

  const data = await res.json()
  mostrarMensajeExito(data.mensaje)
  isSubmitting.value = false
  limpiarCampos()
  isEditing.value = false
  cargarDoctores()
}

// Eliminar doctor por DNI
async function eliminarDoctor(dni) {
  if (confirm('¿Estás seguro de eliminar este doctor?')) {
    const res = await fetch(`${API_URL}/${dni}`, { method: 'DELETE' })
    const data = await res.json()
    mostrarMensajeExito(data.mensaje)
    cargarDoctores()
  }
}

// Cargar datos para editar
function iniciarEdicion(d) {
  isEditing.value = true
  doctorEditDni.value = d.dni_doctor // Guardamos el DNI
  
  // Asignamos los datos al formulario
  Object.assign(doctor, d)
  
  window.scrollTo(0, 0)
}

function cancelarEdicion() {
  isEditing.value = false
  doctorEditDni.value = null
  limpiarCampos()
}

// Validaciones
function soloNumeros(campo) {
  doctor[campo] = doctor[campo].replace(/[^0-9]/g, '')
}
function soloLetras(campo) {
  doctor[campo] = doctor[campo].replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '')
}

// Auxiliares
function limpiarCampos() {
  Object.assign(doctor, {
    dni_doctor: '',
    nombre_doctor: '',
    apellido_doctor: '',
    sexo: '',
    telefono: '',
    fecha_nacimiento: '',
    correo: '',
    nacionalidad: 'Venezolano(a)',
    estado: 'Activo'
  })
}

function mostrarMensajeExito(msg) {
  successMessage.value = msg
  showSuccessMessage.value = true
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

// Filtrado
const filteredDoctores = computed(() => {
  if (!searchTerm.value) return doctores.value
  const s = searchTerm.value.toLowerCase()
  return doctores.value.filter(d =>
    d.nombre_doctor.toLowerCase().includes(s) ||
    d.apellido_doctor.toLowerCase().includes(s) ||
    d.dni_doctor.toLowerCase().includes(s)
  )
})
</script>

<style scoped>
/* Estilos idénticos a FormPaciente.vue, solo renombrando las clases */
.doctor-form-container {
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
.doctor-form {
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
.no-doctors-message {
  text-align: center;
  color: var(--secondary-color, #6c757d);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
}
.doctores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.doctor-card {
  background: var(--header-background, #fff);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1));
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.doctor-card:hover {
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
  .doctor-form { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .list-header { flex-direction: column; align-items: stretch; }
  .search-bar input { width: 100%; }
}
</style>