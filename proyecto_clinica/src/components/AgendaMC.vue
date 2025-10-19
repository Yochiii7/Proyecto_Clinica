<template>
  <header class="d-flex align-items-center mb-3">
    <h2 class="mb-0">Agenda Médica</h2>
    <button type="button" class="btn btn-primary ms-4" @click="abrirModalNuevaCita">Añadir consulta</button>
    <button @click="router.push('/Doctores')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Doctores</button>
    <button @click="router.push('/Calendario')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Calendario</button>
  </header>

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

  <!-- MODAL (para añadir o editar cita) -->
  <div v-if="showModal" class="custom-modal-overlay" @click.self="cerrarModal">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>{{ editando ? 'Editar Cita Médica' : 'Nueva Cita Médica' }}</h3>
        <button class="btn-close" @click="cerrarModal"></button>
      </div>

      <form @submit.prevent="guardarCita">
        <div class="form-row">
          <div class="form-group">
            <label for="patient">Nombre del Paciente</label>
            <input class="form-control" id="patient" v-model="currentAppointment.patient" required type="text">
          </div>

          <div class="form-group">
            <label for="doctor">Doctor</label>
            <select class="form-control" id="doctor" v-model="currentAppointment.doctor" required>
              <option value="">Seleccionar doctor</option>
              <option value="Dra. Maria Lopez">Dra. Maria Lopez</option>
              <option value="Dr. José Rodríguez">Dr. José Rodríguez</option>
              <option value="Dra. Carla Quintero">Dra. Carla Quintero</option>
              <option value="Dr. Victor Contreras">Dr. Victor Contreras</option>
              <option value="Dra. Estefany Lunar">Dra. Estefany Lunar</option>
              <option value="Dr. Alejandro Parra">Dr. Alejandro Parra</option>
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
              <option value="Atendido">Atendido</option>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const editando = ref(false)
const currentAppointment = ref({})
const appointments = ref([])

// 📥 Cargar desde LocalStorage
onMounted(() => {
  const saved = localStorage.getItem('appointments')
  if (saved) {
    appointments.value = JSON.parse(saved)
  } else {
    appointments.value = [
      { id: 1, patient: 'Carlos Ramos', doctor: 'Maria Lopez', status: 'Atendido', date: '2025-06-02', time: '08:30', notes: '' },
      { id: 2, patient: 'Elena Perez', doctor: 'Jose Rodríguez', status: 'Por atender', date: '2025-12-12', time: '09:45', notes: '' },
      { id: 3, patient: 'Maria Campos', doctor: 'Jose Rodríguez', status: 'Atendido', date: '2025-08-15', time: '10:15', notes: '' }
    ]
  }
})

// 💾 Guardar cada vez que se actualiza la lista
watch(appointments, (value) => {
  localStorage.setItem('appointments', JSON.stringify(value))
}, { deep: true })

// 🔹 Abrir modal para nueva cita
function abrirModalNuevaCita() {
  currentAppointment.value = {
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'Por atender',
    notes: ''
  }
  editando.value = false
  showModal.value = true
}

// 🔹 Abrir modal para editar cita existente
function editarCita(cita) {
  currentAppointment.value = { ...cita } // Clonamos
  editando.value = true
  showModal.value = true
}

// 🔹 Guardar cita (nueva o editada)
function guardarCita() {
  // impedir marcar como Atendido si la fecha es futura
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
  // recalcular estado según la fecha antes de guardar (mantener ajuste automático)
  const computedStatus = getStatusForDisplay(currentAppointment.value.date, currentAppointment.value.status)

  if (editando.value) {
    const index = appointments.value.findIndex(a => a.id === currentAppointment.value.id)
    if (index !== -1) {
      const updated = { ...currentAppointment.value, status: computedStatus }
      // usar splice para garantizar reactividad
      appointments.value.splice(index, 1, updated)
    }
    alert('✅ Cita actualizada correctamente.')
  } else {
    const nextId = appointments.value.length ? Math.max(...appointments.value.map(a => a.id)) + 1 : 1
    const newAppt = { id: nextId, ...currentAppointment.value, status: computedStatus }
    appointments.value.push(newAppt)
    alert('✅ Cita registrada correctamente.')
  }
  cerrarModal()
}

// 🔹 Eliminar cita
function eliminarCita(cita) {
  if (!confirm(`¿Eliminar la cita de "${cita.patient}" (${cita.date} ${cita.time})? Esta acción no se puede deshacer.`)) return
  const index = appointments.value.findIndex(a => a.id === cita.id)
  if (index !== -1) {
    appointments.value.splice(index, 1)
    // si estamos editando la misma cita, cerrar modal
    if (editando.value && currentAppointment.value.id === cita.id) {
      cerrarModal()
      editando.value = false
    }
    alert('🗑️ Cita eliminada correctamente.')
  }
}

function cerrarModal() {
  showModal.value = false
}

// 🔹 Filtros
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

// 🔹 Clases y formato
function statusClass(status) {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('atendido')) return 'status-atendido'
  if (s.includes('por')) return 'status-por-atender'
  return ''
}

// Nueva función: determina el estado que se debe mostrar según la fecha
function getStatusForDisplay(dateStr, status) {
  if (!dateStr) return status || ''
  // comparar fechas sin tiempo
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
