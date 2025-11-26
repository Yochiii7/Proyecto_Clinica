<template>
  <div class="service-form-container">
    
    <div class="form-card">
      <h2 class="form-title">{{ isEditing ? 'Editando Servicio' : 'Registro de Servicio' }}</h2>

      <div v-if="showSuccessMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="service-form" novalidate>
        
        <div class="input-group">
          <label for="nombre">Nombre del Servicio:</label>
          <input
            id="nombre"
            v-model="servicio.nombre_servicio"
            type="text"
            placeholder="Ej: Consulta de Cardiología"
            required
          />
        </div>

        <div class="input-group">
          <label for="precio">Precio ($):</label>
          <input
            id="precio"
            v-model="servicio.precio"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Ej: 45.00"
            required
          />
        </div>

        <div class="input-group" style="grid-column: 1 / -1;">
          <label for="doctor">Médico Asignado:</label>
          <select id="doctor" v-model="servicio.cod_doctor">
            <option disabled value="">Seleccione un doctor (opcional)...</option>
            <option 
              v-for="doc in doctores" 
              :key="doc.cod_doctor" 
              :value="doc.cod_doctor">
              {{ doc.nombre_doctor }} {{ doc.apellido_doctor }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting" class="submit-button">
            {{ isEditing ? (isSubmitting ? 'Actualizando...' : 'Actualizar Servicio') : (isSubmitting ? 'Registrando...' : 'Registrar Servicio') }}
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

    <div class="service-list-section">
      <div class="list-header">
        <h3 class="list-title">Servicios Registrados</h3>
        <div class="search-bar">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar por nombre de servicio..."
          />
        </div>
      </div>

      <div
        v-if="filteredServicios.length === 0"
        class="no-services-message"
      >
        {{ servicios.length > 0 ? 'No se encontraron servicios con ese criterio.' : 'Aún no hay servicios registrados.' }}
      </div>

      <div v-else class="servicios-grid">
        <div
          class="servicio-card"
          v-for="s in filteredServicios"
          :key="s.cod_servicio"
        >
          <div class="card-header">
            <strong>{{ s.nombre_servicio }}</strong>
          </div>

          <div class="card-body">
            <p><strong>Precio:</strong> ${{ parseFloat(s.precio).toFixed(2) }}</p>
            <p><strong>Médico:</strong> 
              <span v-if="s.doctor">
                {{ s.doctor.nombre_doctor }} {{ s.doctor.apellido_doctor }}
              </span>
              <span v-else class="text-muted">No asignado</span>
            </p>
          </div>

          <div class="card-actions">
            <button @click="iniciarEdicion(s)" class="edit-btn">Editar</button>
            <button
              @click="eliminarServicio(s.cod_servicio)"
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

// --- Estado Reactivo ---

// Objeto para el formulario (v-model)
const servicio = reactive({
  nombre_servicio: '',
  precio: 0.00,
  cod_doctor: '' // Usamos '' para que coincida con la opción disabled
})

// Listas de datos
const servicios = ref([])
const doctores = ref([]) // <--- ¡NUEVO! Para el dropdown

// Estado de la UI
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const isEditing = ref(false)
const servicioEditId = ref(null) // Guardamos el ID (cod_servicio) al editar
const searchTerm = ref('')

// --- Funciones de API (CRUD) ---

// 1. Cargar Servicios (READ)
async function cargarServicios() {
  try {
    const res = await fetch('http://localhost:3000/api/servicios')
    if (!res.ok) throw new Error('Error al cargar servicios')
    servicios.value = await res.json()
  } catch (error) {
    console.error(error.message)
    // Aquí podrías mostrar un error al usuario
  }
}

// 2. Cargar Doctores (para el <select>)
async function cargarDoctores() {
  try {
    // Asumo que tienes un endpoint para listar doctores
    const res = await fetch('http://localhost:3000/api/doctores') 
    if (!res.ok) throw new Error('Error al cargar doctores')
    doctores.value = await res.json()
  } catch (error) {
    console.error(error.message)
  }
}

// 🚀 Cargar datos al montar el componente
onMounted(() => {
  cargarServicios()
  cargarDoctores()
})

// 3. Registrar o Actualizar (CREATE / UPDATE)
async function handleSubmit(e) {
  const form = e.target
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  isSubmitting.value = true
  
  const url = isEditing.value
    ? `http://localhost:3000/api/servicios/${servicioEditId.value}`
    : 'http://localhost:3000/api/servicios'
  const method = isEditing.value ? 'PUT' : 'POST'

  // Preparamos el cuerpo. Si cod_doctor está vacío, se envía null.
  const body = {
    ...servicio,
    cod_doctor: servicio.cod_doctor || null
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    const data = await res.json()
    
    if (!res.ok) throw new Error(data.mensaje || 'Error en la solicitud');

    mostrarMensajeExito(data.mensaje)
    limpiarCampos()
    isEditing.value = false
    await cargarServicios() // Recargar la lista

  } catch (error) {
    console.error(error.message)
    mostrarMensajeExito(error.message, true) // Muestra error
  } finally {
    isSubmitting.value = false
  }
}

// 4. Eliminar Servicio (DELETE)
async function eliminarServicio(id) {
  if (confirm('¿Estás seguro de eliminar este servicio?')) {
    try {
      const res = await fetch(`http://localhost:3000/api/servicios/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.mensaje || 'Error al eliminar');

      mostrarMensajeExito(data.mensaje)
      await cargarServicios() // Recargar la lista
      
      // Si se elimina el servicio que se estaba editando, cancelar edición
      if (isEditing.value && servicioEditId.value === id) {
        cancelarEdicion();
      }

    } catch (error) {
      console.error(error.message)
      mostrarMensajeExito(error.message, true)
    }
  }
}

// --- Funciones Auxiliares ---

// Cargar datos en el formulario para editar
function iniciarEdicion(s) {
  isEditing.value = true
  servicioEditId.value = s.cod_servicio
  
  // Asignamos los valores del servicio (s) al formulario (servicio)
  servicio.nombre_servicio = s.nombre_servicio
  servicio.precio = parseFloat(s.precio)
  servicio.cod_doctor = s.cod_doctor || '' // Asigna '' si es null
  
  window.scrollTo(0, 0) // Subir al inicio de la página
}

// Cancelar edición
function cancelarEdicion() {
  isEditing.value = false
  servicioEditId.value = null
  limpiarCampos()
}

// Limpiar el formulario
function limpiarCampos() {
  servicio.nombre_servicio = ''
  servicio.precio = 0.00
  servicio.cod_doctor = ''
}

// Mostrar mensaje de éxito/error
function mostrarMensajeExito(msg, isError = false) {
  successMessage.value = msg
  showSuccessMessage.value = true
  // (Aquí podrías añadir una clase de 'error' si isError es true)
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

// 🔍 Filtrado de servicios (Computed)
const filteredServicios = computed(() => {
  if (!searchTerm.value) return servicios.value
  const s = searchTerm.value.toLowerCase()
  return servicios.value.filter(srv =>
    srv.nombre_servicio.toLowerCase().includes(s)
  )
})
</script>

<style scoped>
/*
 * COPIA EXACTA de FormPaciente.vue,
 * solo se renombraron las clases base (ej: .patient-form -> .service-form)
 * para evitar colisiones y mantener la semántica.
*/

.service-form-container {
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
.service-form {
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
.no-services-message { /* Renombrada */
  text-align: center;
  color: var(--secondary-color, #6c757d);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
}
.servicios-grid { /* Renombrada */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.servicio-card { /* Renombrada */
  background: var(--header-background, #fff);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow, 0 4px 6px -1px rgba(0,0,0,0.1));
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.servicio-card:hover {
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
.card-body p { margin: 0.5rem 0; font-size: 0.9rem; color: #555; }
.card-body .text-muted {
  color: #888;
  font-style: italic;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto; /* Empuja los botones al fondo */
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color, #eee);
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
  .service-form { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .list-header { flex-direction: column; align-items: stretch; }
  .search-bar input { width: 100%; }
}
</style>