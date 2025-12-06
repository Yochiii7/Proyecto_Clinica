<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="/src/style.css">

  <header class="d-flex align-items-center mb-3">
    <h2 class="mb-0">Calendario</h2>
    <button type="button" class="btn btn-primary ms-4" @click="router.push('/agenda')">Ir a Agenda</button>
    <button @click="router.push('/doctores')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Doctores</button>
  </header>

  <div class="container-fluid p-4">
    <div class="row">

      <div class="col-12">
        <div class="card shadow-sm calendar-card full-width">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="btn-group">
                <button @click="mesAnterior" class="btn btn-outline-secondary">←</button>
              </div>

              <h3 class="text-center mb-0">
                <span class="mx-3 text-orange">{{ nombreMesActual }} {{ anioActual }}</span>
              </h3>

              <button @click="mesSiguiente" class="btn btn-outline-secondary">→</button>
            </div>

            <table class="table table-bordered table-fixed text-center calendar-table">
              <thead class="table-light">
                <tr>
                  <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(semana, index) in semanasDelMes" :key="index">
                  <td v-for="(dia, diaIndex) in semana" :key="diaIndex"
                      :class="{
                        'text-muted': !dia.esMesActual,
                        'bg-light': isToday(dia),
                        'p-2 cell-height': true
                      }"
                  >
                    <div class="day-number text-end fw-bold mb-1">
                      {{ dia.dia !== null ? dia.dia : '' }}
                    </div>


                    <div v-for="(ev, idx) in dia.events" :key="idx" class="event-item badge"
                         :class="statusBadge(ev.status)"
                         :title="ev.patient + ' — ' + ev.time"
                    >
                      {{ ev.time }} {{ ev.patient }}
                    </div>

                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// API base (same default used elsewhere)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const router = useRouter()

const fechaReferencia = ref(new Date())
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const diaHoyGlobal = new Date()
const appointments = ref([])

async function loadAppointments() {
  try {
    const res = await axios.get(`${API_BASE}/api/citas`)
    if (Array.isArray(res.data)) {
      appointments.value = res.data.map(c => ({
        date: c.fecha || c.date || '',
        time: c.hora || c.time || '',
        patient: c.paciente || c.patient || '',
        status: c.estado || c.status || ''
      }))
    } else {
      appointments.value = []
    }
  } catch (err) {
    console.error('Error cargando citas en calendario:', err)
    appointments.value = []
  }
}


onMounted(() => {
  loadAppointments()
  // Escuchamos eventos globales cuando otras vistas modifican citas
  window.addEventListener('appointments-changed', loadAppointments)
})
onBeforeUnmount(() => {
  window.removeEventListener('appointments-changed', loadAppointments)
})


function getStatusForDisplay(dateStr, status, timeStr = '00:00:00') {
  if (!dateStr) return status || ''

  let hora = String(timeStr || '').trim()
  if (!hora) hora = '00:00:00'
  if (hora.split(':').length === 2) hora = hora + ':00'

  const appt = new Date(`${dateStr}T${hora}`)
  const now = new Date()

  if (appt > now) return 'Por atender'

  // Si ya pasó -> Atendido salvo que esté cancelada
  const s = String(status || '').trim()
  const code = s.toUpperCase()
  if (code === 'C' || String(status).toLowerCase().includes('cancel')) return 'Cancelado'
  return 'Atendido'
}

const anioActual = computed(() => fechaReferencia.value.getFullYear())
const mesActual = computed(() => fechaReferencia.value.getMonth())
const nombreMesActual = computed(() => fechaReferencia.value.toLocaleString('es-ES', { month: 'long' }))

const semanasDelMes = computed(() => {
  const year = anioActual.value
  const month = mesActual.value

  const primerDia = new Date(year, month, 1)
  const ultimoDiaMesAnterior = new Date(year, month, 0).getDate()
  const ultimoDia = new Date(year, month + 1, 0).getDate()
  const primerDiaSemana = primerDia.getDay()

  let dias = []

  for (let i = 0; i < primerDiaSemana; i++) {
    const diaNum = ultimoDiaMesAnterior - (primerDiaSemana - 1 - i)
    dias.push({ dia: diaNum, esMesActual: false, events: [] })
  }

  for (let i = 1; i <= ultimoDia; i++) {
    dias.push({ dia: i, esMesActual: true, events: [] })
  }

  const diasRestantes = 42 - dias.length
  for (let i = 1; i <= diasRestantes; i++) {
    dias.push({ dia: i, esMesActual: false, events: [] })
  }


  const yearStr = String(year)
  const monthStr = String(month + 1).padStart(2, '0')
  dias.forEach(day => {
    if (!day.esMesActual) return
    const dnum = String(day.dia).padStart(2, '0')
    const dateKey = `${yearStr}-${monthStr}-${dnum}`
    const dayEvents = appointments.value.filter(a => a.date === dateKey)
    day.events = dayEvents.map(e => ({
      patient: e.patient,
      time: e.time,
      status: getStatusForDisplay(e.date, e.status, e.time)
    }))
  })

  let semanas = []
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7))
  }
  return semanas
})

function mesAnterior() {
  fechaReferencia.value = new Date(anioActual.value, mesActual.value - 1, 1)
}
function mesSiguiente() {
  fechaReferencia.value = new Date(anioActual.value, mesActual.value + 1, 1)
}

function statusBadge(status) {
  if (!status) return 'bg-secondary'
  const s = String(status).toLowerCase()
  if (s === 'a' || s.includes('atendido')) return 'bg-success'
  if (s === 'p' || s.includes('por')) return 'bg-warning text-dark'
  if (s === 'c' || s.includes('cancel')) return 'bg-danger text-light'
  return 'bg-info'
}

function isToday(day) {
  return day.esMesActual &&
         diaHoyGlobal.getDate() === day.dia &&
         diaHoyGlobal.getMonth() === mesActual.value &&
         diaHoyGlobal.getFullYear() === anioActual.value
}
</script>

<style scoped>

.calendar-card {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.5rem;
}


.calendar-table {
  table-layout: fixed;
  width: 100%;
  font-size: 0.95rem;
}

.calendar-table th, .calendar-table td {
  padding: 0.6rem;
}

.cell-height {

  min-height: 160px;
  vertical-align: top;
}


.day-number {
  font-size: 1.1rem;
}

.event-item {
  display: block;
  width: 100%;
  margin-bottom: 4px;
  text-align: left;
  padding: 6px 8px;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
}


@media (max-width: 991px) {
  .cell-height { min-height: 100px; }
  .calendar-table { font-size: 0.9rem; }
  .day-number { font-size: 1rem; }
  .event-item { font-size: 0.85rem; padding: 4px 6px; }
}
</style>
