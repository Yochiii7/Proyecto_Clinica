<template>
  <header class="d-flex align-items-center mb-3">
    <h2 class="mb-0">Agenda Médica</h2>
    <button type="button" class="btn btn-primary ms-4" @click="abrirModalNuevaCita">Añadir consulta</button>
    <button @click="router.push('/Doctores')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Doctores</button>
    <button @click="router.push('/Calendario')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Calendario</button>
  </header>

  <!-- Indicadores de carga/errores -->
  <div v-if="loading" class="mb-3">
    <div class="alert alert-info">Cargando citas desde el servidor...</div>
  </div>
  <div v-else-if="error" class="mb-3">
    <div class="alert alert-warning">{{ error }}</div>
  </div>

  <div class="container">
    <div class="row mb-3 g-2 align-items-end">
      <div class="col-auto">
        <label for="from" class="form-label">Desde</label>
        <input id="from" type="date" class="form-control" v-model="filterFrom">
      </div>
      <div class="col-auto">
        <label for="to" class="form-label">Hasta</label>
        <input id="to" type="date" class="form-control" v-model="filterTo">
      </div>
      <div class="col-auto">
        <button class="btn btn-limpiar" @click="resetFilters">Limpiar</button>
      </div>
      <div class="col-auto ms-auto text-end">
        <small class="text-muted">Mostrando {{ filteredAppointments.length }} de {{ appointments.length }}</small>
      </div>
    </div>

    <div class="main-content">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Doctor/a</th>
            <th>Estado</th>
            <th>Fecha consulta</th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="a in filteredAppointments" :key="a.id">
            <th>{{ a.id }}</th>
            <td>{{ a.patient }}</td>
            <td>{{ a.doctor }}</td>
            <td>
              <span :class="statusClass(getStatusForDisplay(a.date, a.status))">
                {{ getStatusForDisplay(a.date, a.status) }}
              </span>
            </td>
            <td>{{ formatDateToDisplay(a.date) }}</td>
            <td>{{ a.time }}</td>
            <td>
              <div class="d-flex gap-2 flex-nowrap align-items-center">
                <button class="btn btn-sm btn-outline-primary" @click="editarCita(a)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="eliminarCita(a)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredAppointments.length === 0">
            <td colspan="7" class="text-center">No hay citas en el rango seleccionado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--MODAL-->
  <div v-if="showModal" class="custom-modal-overlay" @click.self="cerrarModal">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>{{ editando ? 'Editar Cita Médica' : 'Nueva Cita Médica' }}</h3>
        <button class="btn-close" @click="cerrarModal"></button>
      </div>

      <form @submit.prevent="guardarCita">
        <div class="form-row">
          <div class="form-group">
            <label for="patient">Paciente</label>
            <select class="form-control" id="patient" v-model="currentAppointment.cod_paciente" required>
              <option value="">Seleccionar paciente</option>
              <option v-for="p in pacientes" :key="p.cod_paciente" :value="p.cod_paciente">{{ p.nombre }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="especialidad">Especialidad</label>
            <select class="form-control" id="especialidad" v-model="currentAppointment.cod_especialidad" required @change="onEspecialidadChange">
              <option value="">Seleccionar especialidad</option>
              <option v-for="e in especialidades" :key="e.cod_especialidad" :value="e.cod_especialidad">{{ e.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="doctor">Doctor</label>
            <select class="form-control" id="doctor" v-model="currentAppointment.cod_doctor" :disabled="!currentAppointment.cod_especialidad || doctores.length === 0" required>
              <option value="">Seleccionar doctor</option>
              <option v-if="!currentAppointment.cod_especialidad" disabled value="">Selecciona primero una especialidad</option>
              <option v-else-if="doctores.length === 0" disabled value="">No hay doctores disponibles para esta especialidad</option>
              <option v-for="d in doctores" :key="d.cod_doctor" :value="d.cod_doctor">{{ d.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Fecha</label>
            <input type="date" class="form-control" id="date" v-model="currentAppointment.date" required>
          </div>
          <div class="form-group">
            <label for="time">Hora</label>
            <input type="time" class="form-control" id="time" v-model="currentAppointment.time" required>
          </div>
          <div class="form-group">
            <label for="status">Estado</label>
            <select id="status" class="form-control" v-model="currentAppointment.status">
              <option value="Por atender">Por atender</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="cerrarModal">Cancelar</button>
          <button type="submit" class="btn btn-primary">{{ editando ? 'Guardar Cambios' : 'Guardar Cita' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Base URL para la API; puedes sobreescribirlo con VITE_API_BASE_URL en tu .env
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const router = useRouter()
const showModal = ref(false)
const editando = ref(false)
const currentAppointment = ref({})
const appointments = ref([])
const loading = ref(false)
const error = ref('')
const pacientes = ref([])
const doctores = ref([])
const especialidades = ref([])


async function fetchCitas() {
  loading.value = true
  error.value = ''
  try {
    // Ajusta la ruta si tu backend corre en otro dominio/puerto.
    const res = await axios.get(`${API_BASE}/api/citas`)
    if (Array.isArray(res.data)) {
      // El controlador devuelve objetos con campos como: id, fecha, hora, paciente, doctor, estado
      appointments.value = res.data.map(c => ({
        id: c.id,
        patient: c.paciente || c.patient || '',
        doctor: c.doctor || c.doctor || '',
        status: c.estado || c.status || '',
        date: c.fecha || c.date || '',
        time: c.hora || c.time || '',
        cod_paciente: c.cod_paciente || c.codPaciente || null,
        cod_doctor: c.cod_doctor || c.codDoctor || null,
        cod_especialidad: c.cod_especialidad || c.codEspecialidad || null,
        notes: c.notes || ''
      }))
    } else {
      // Respuesta inesperada del servidor: dejamos la lista vacía y mostramos error.
      appointments.value = []
      error.value = 'Respuesta inesperada del servidor.'
    }
  } catch (err) {
    console.error('Error al obtener citas:', err)
    error.value = 'No se pudo conectar al servidor de citas.'
    appointments.value = []
  } finally {
    loading.value = false
  }
}

async function fetchPacientes() {
  try {
    const res = await axios.get(`${API_BASE}/api/pacientes`)
    pacientes.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error al cargar pacientes:', err)
    pacientes.value = []
  }
}

// Si se pasa un id de especialidad, el backend devolverá solo los doctores asociados a esa especialidad
async function fetchDoctores(especialidadId = null) {
  try {
    const url = especialidadId ? `${API_BASE}/api/doctores?especialidad=${especialidadId}` : `${API_BASE}/api/doctores`;
    const res = await axios.get(url)
    doctores.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error al cargar doctores:', err)
    doctores.value = []
  }
}

async function fetchEspecialidades() {
  try {
    const res = await axios.get(`${API_BASE}/api/especialidades`)
    especialidades.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error al cargar especialidades:', err)
    especialidades.value = []
  }
}

onMounted(() => {
  // Al montar, cargamos listas necesarias y las citas desde la API.
  fetchPacientes()
  fetchEspecialidades()
  fetchCitas()
})


function abrirModalNuevaCita() {
  currentAppointment.value = {
    patient: '',
    cod_paciente: '',
    doctor: '',
    cod_doctor: '',
    cod_especialidad: '',
    date: '',
    time: '',
    status: 'Por atender',
    notes: ''
  }
  editando.value = false
  // Para "añadir" queremos que primero se elija especialidad -> luego cargar doctores asociados.
  doctores.value = []
  showModal.value = true
}


// Cuando se edita una cita, abrimos modal y cargamos los doctores asociados a su especialidad
async function editarCita(cita) {
  currentAppointment.value = { ...cita }
  editando.value = true
  showModal.value = true
  if (currentAppointment.value.cod_especialidad) {
    // cargamos solo los doctores con esa especialidad
    await fetchDoctores(currentAppointment.value.cod_especialidad)
  } else {
    // cargamos todos por si la cita no tiene especialidad asignada
    await fetchDoctores()
  }
  // después de cargar doctores, verificamos que el doctor seleccionado pertenezca a la lista
  if (currentAppointment.value.cod_doctor) {
    const found = doctores.value.find(d => d.cod_doctor === currentAppointment.value.cod_doctor)
    if (!found) currentAppointment.value.cod_doctor = ''
  }
}

// Handler cuando el usuario selecciona una especialidad en el formulario
async function onEspecialidadChange() {
  const id = currentAppointment.value.cod_especialidad
  if (id) {
    await fetchDoctores(id)
    // limpiar selección de doctor si no pertenece a la nueva especialidad
    const found = doctores.value.find(d => d.cod_doctor === currentAppointment.value.cod_doctor)
    if (!found) currentAppointment.value.cod_doctor = ''
  } else {
    await fetchDoctores()
  }
}


function guardarCita() {
  
  if (currentAppointment.value.status && String(currentAppointment.value.status).toLowerCase().includes('atendid')) {
    if (!currentAppointment.value.date) {
      alert('La cita debe tener fecha antes de marcar como "Atendido".')
      return
    }
    const appt = new Date(currentAppointment.value.date + 'T00:00:00')
    const today = new Date()
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (appt > todayMid) {
      alert('No se puede marcar como "Atendido" una cita con fecha futura.')
      return
    }
  }
  
  const computedStatus = getStatusForDisplay(currentAppointment.value.date, currentAppointment.value.status)

  // Map status string to code expected by backend
  const statusCode = mapStatusToCode(currentAppointment.value.status || computedStatus)

  if (editando.value) {
    // Update via API
    const id = currentAppointment.value.id
    const payload = {
      fecha: currentAppointment.value.date,
      hora: ensureTimeSeconds(currentAppointment.value.time),
      cod_paciente: currentAppointment.value.cod_paciente,
      cod_doctor: currentAppointment.value.cod_doctor,
      cod_especialidad: currentAppointment.value.cod_especialidad,
      estado: statusCode
    }
    axios.put(`${API_BASE}/api/citas/${id}`, payload)
      .then(() => {
        alert('✅ Cita actualizada correctamente.')
        fetchCitas()
        cerrarModal()
        // notify other components (calendar) that appointments changed
        try { window.dispatchEvent(new Event('appointments-changed')) } catch (e) { /* noop */ }
      })
      .catch(err => {
        console.error('Error actualizando cita:', err)
        alert('Error al actualizar la cita. Revisa la consola.')
      })
  } else {
    // Create via API
    const payload = {
      fecha: currentAppointment.value.date,
      hora: ensureTimeSeconds(currentAppointment.value.time),
      cod_paciente: currentAppointment.value.cod_paciente,
      cod_doctor: currentAppointment.value.cod_doctor,
      cod_especialidad: currentAppointment.value.cod_especialidad,
      estado: statusCode
    }
    axios.post(`${API_BASE}/api/citas`, payload)
      .then(() => {
        alert('✅ Cita registrada correctamente.')
        fetchCitas()
        cerrarModal()
        try { window.dispatchEvent(new Event('appointments-changed')) } catch (e) { /* noop */ }
      })
      .catch(err => {
        console.error('Error creando cita:', err)
        alert('Error al crear la cita. Revisa la consola.')
      })
  }
}

function mapStatusToCode(status) {
  if (!status) return 'P'
  const s = String(status).toLowerCase()
  if (s.includes('atend')) return 'A'
  if (s.includes('cancel') || s.includes('canc')) return 'C'
  return 'P'
}

function ensureTimeSeconds(time) {
  if (!time) return '00:00:00'
  // if already contains seconds
  if (time.split(':').length === 3) return time
  return `${time}:00`
}


function eliminarCita(cita) {
  if (!confirm(`¿Eliminar la cita de "${cita.patient}" (${cita.date} ${cita.time})? Esta acción no se puede deshacer.`)) return
  // Delete via API
  axios.delete(`${API_BASE}/api/citas/${cita.id}`)
    .then(() => {
      alert('🗑️ Cita eliminada correctamente.')
      if (editando.value && currentAppointment.value.id === cita.id) {
        cerrarModal()
        editando.value = false
      }
      fetchCitas()
      try { window.dispatchEvent(new Event('appointments-changed')) } catch (e) { /* noop */ }
    })
    .catch(err => {
      console.error('Error eliminando cita:', err)
      alert('Error al eliminar la cita. Revisa la consola.')
    })
}

function cerrarModal() {
  showModal.value = false
}


const filterFrom = ref('')
const filterTo = ref('')
function inRange(dateStr, fromStr, toStr) {
  const d = new Date(dateStr + 'T00:00:00')
  if (fromStr && d < new Date(fromStr + 'T00:00:00')) return false
  if (toStr && d > new Date(toStr + 'T23:59:59')) return false
  return true
}
const filteredAppointments = computed(() => appointments.value.filter(a => inRange(a.date, filterFrom.value, filterTo.value)))
function resetFilters() {
  filterFrom.value = ''
  filterTo.value = ''
}


function statusClass(status) {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('atendido')) return 'status-atendido'
  if (s.includes('por')) return 'status-por-atender'
  return ''
}

function getStatusForDisplay(dateStr, status) {
  if (!dateStr) return status || ''

  const appt = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (appt > todayMid) return 'Por atender'
  return status || ''
}

function formatDateToDisplay(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-VE')
}
</script>
