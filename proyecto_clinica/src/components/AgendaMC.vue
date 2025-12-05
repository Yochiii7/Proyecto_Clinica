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
        <label for="from" class="form-label"><b>Desde:</b></label>
        <input id="from" type="date" class="form-control" v-model="filterFrom">
      </div>
      <div class="col-auto">
        <label for="to" class="form-label"><b>Hasta:</b></label>
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
            <th>Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="a in filteredAppointments" :key="a.id">
            <th>{{ a.id }}</th>
            <td>{{ a.patient }}</td>
            <td>{{ a.doctor }}</td>
            <td>
              <span :class="statusClass(getStatusForDisplay(a.date, a.status, a.time))">
                {{ getStatusForDisplay(a.date, a.status, a.time) }}
              </span>
            </td>
            <td>{{ formatDateToDisplay(a.date) }}</td>
            <td>{{ a.time }}</td>
            <td>
              <span :class="pagoStatusClass(a.pagoEstado)">
                {{ getEstadoPagoTexto(a.pagoEstado) }}
                <br>
                <small class="text-muted">
                  ${{ (parseFloat(a.total_pagado) || 0).toFixed(2) }} / ${{ (parseFloat(a.monto_total) || 0).toFixed(2) }}
                </small>
                <br>
                <small :class="parseFloat(a.saldo_pendiente) > 0 ? 'text-warning' : 'text-success'">
                  Saldo: ${{ (parseFloat(a.saldo_pendiente) || 0).toFixed(2) }}
                </small>
              </span>
            </td>
            <td>
              <div class="d-flex gap-2 flex-nowrap align-items-center">
                <button class="btn btn-sm btn-outline-success" @click="procesarPago(a)" :disabled="a.pagoEstado === 'completado'">
                  <i class="bi bi-credit-card"></i>
                </button>
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
            <td colspan="8" class="text-center">No hay citas en el rango seleccionado.</td>
          </tr>
        </tbody>
      </table>
        <h3>Reportes:</h3>
      <!-- Botones para reportes -->
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-primary" @click="abrirModalReporteFechas">Generar Reporte por Fechas</button>
        <button class="btn btn-primary" @click="abrirModalRanking">Ranking de Pacientes por Visitas</button>
        <button class="btn btn-primary" @click="abrirModalEspecialidades">Especialidades más solicitadas</button>
      </div>
    </div>
  </div>

  <!-- Modal: Reporte por fechas -->
  <div v-if="showReportModal" class="custom-modal-overlay" @click.self="closeReportModal">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>Reporte de Citas por Rango de Fechas</h3>
        <button class="btn-close" @click="closeReportModal"></button>
      </div>

      <div class="p-3">
        <div class="row g-2 mb-3">
          <div class="col-auto">
            <label for="rep_desde" class="form-label"><b>Desde:</b></label>
            <input id="rep_desde" type="date" class="form-control" v-model="reportDesde">
          </div>
          <div class="col-auto">
            <label for="rep_hasta" class="form-label"><b>Hasta:</b></label>
            <input id="rep_hasta" type="date" class="form-control" v-model="reportHasta">
          </div>
            
            <div class="col-auto align-self-end">
              <button class="btn btn-primary" :disabled="reportLoading" @click="generarReporteFechas">Generar Reporte</button>
            </div>
        </div>

        <div v-if="reportLoading" class="mb-3"><div class="alert alert-info">Generando reporte...</div></div>
        <div v-if="reportError" class="mb-3"><div class="alert alert-warning">{{ reportError }}</div></div>

        <div v-if="reportResults && reportResults.length > 0" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Doctoría</th>
                <th>Estado</th>
                <th>Fecha consulta</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reportResults" :key="`rep-${r.id}`">
                <td>{{ r.id }}</td>
                <td>{{ r.paciente }}</td>
                <td>{{ r.doctor }}</td>
                <td>{{ r.estado }}</td>
                <td>{{ formatDateToDisplay(r.fecha) }}</td>
                <td>{{ r.hora }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="!reportLoading && !reportError" class="text-muted">No se encontraron citas para el rango seleccionado.</div>
      </div>
    </div>
  </div>

  <!-- Modal: Ranking pacientes -->
  <div v-if="showRankingModal" class="custom-modal-overlay" @click.self="closeRankingModal">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>Ranking de Pacientes por Visitas</h3>
        <button class="btn-close" @click="closeRankingModal"></button>
      </div>

      <div class="p-3">
        <div v-if="rankingLoading" class="mb-3"><div class="alert alert-info">Cargando ranking...</div></div>
        <div v-if="rankingError" class="mb-3"><div class="alert alert-warning">{{ rankingError }}</div></div>

        <div v-if="rankingResults && rankingResults.length > 0" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th><b>Paciente</b></th>
                <th><b>Total de Citas</b></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in rankingResults" :key="`rank-${idx}`">
                <td>{{ row.paciente }}</td>
                <td>{{ row.total_citas }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="!rankingLoading && !rankingError" class="text-muted">No hay datos para mostrar.</div>
      </div>
    </div>
  </div>

  <!-- Modal: Ranking especialidades -->
  <div v-if="showEspecialidadModal" class="custom-modal-overlay" @click.self="closeEspecialidadModal">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>Especialidades más solicitadas</h3>
        <button class="btn-close" @click="closeEspecialidadModal"></button>
      </div>

      <div class="p-3">
        <div v-if="especialidadLoading" class="mb-3"><div class="alert alert-info">Cargando ranking de especialidades...</div></div>
        <div v-if="especialidadError" class="mb-3"><div class="alert alert-warning">{{ especialidadError }}</div></div>

        <div v-if="especialidadResults && especialidadResults.length > 0" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th><b>Especialidad</b></th>
                <th><b>Total de Solicitudes</b></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in especialidadResults" :key="`esp-${idx}`">
                <td>{{ row.especialidad }}</td>
                <td>{{ row.total_solicitudes }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="!especialidadLoading && !especialidadError" class="text-muted">No hay datos para mostrar.</div>
      </div>
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
              <!-- Usamos códigos en el value (P/A/C) y etiquetas humanas para que al editar se seleccione correctamente
                   Si el backend devuelve 'A'/'P'/'C' serán reconocidos y mostrados. -->
              <option value="P">Por atender</option>
              <option value="A">Atendido</option>
              <option value="C">Cancelado</option>
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

  <!-- Modal: Procesar Pago -->
  <div v-if="showPagoModal" class="custom-modal-overlay" @click.self="cerrarModalPago">
    <div class="custom-modal">
      <div class="modal-header">
        <h3>Procesar Pago - Cita #{{ currentCitaPago.id }}</h3>
        <button class="btn-close" @click="cerrarModalPago"></button>
      </div>

      <div class="p-3">
        <div class="mb-3">
          <p><strong>Paciente:</strong> {{ currentCitaPago.patient }}</p>
          <p><strong>Doctor:</strong> {{ currentCitaPago.doctor }}</p>
          <p><strong>Fecha y Hora:</strong> {{ formatDateToDisplay(currentCitaPago.date) }} {{ currentCitaPago.time }}</p>
          <div class="alert alert-info">
            <h6 class="alert-heading">Resumen de Pago:</h6>
            <p class="mb-1"><strong>Monto Total:</strong> ${{ (parseFloat(currentCitaPago.monto_total) || 0).toFixed(2) }}</p>
            <p class="mb-1"><strong>Ya Pagado:</strong> ${{ (parseFloat(currentCitaPago.total_pagado) || 0).toFixed(2) }}</p>
            <p class="mb-0"><strong>Saldo Pendiente:</strong> ${{ (parseFloat(currentCitaPago.saldo_pendiente) || 0).toFixed(2) }}</p>
          </div>
        </div>

        <form @submit.prevent="guardarPago">
          <div class="form-group mb-3">
            <label for="monto"><b>Monto a pagar:</b></label>
            <input type="number" step="0.01" class="form-control" id="monto" v-model="pagoForm.monto" 
                   :max="parseFloat(currentCitaPago.saldo_pendiente) || 0" required>
            <small class="text-muted">
              Máximo a pagar: ${{ (parseFloat(currentCitaPago.saldo_pendiente) || 0).toFixed(2) }}
            </small>
          </div>

          <div class="form-group mb-3">
            <label for="metodo_pago"><b>Método de pago:</b></label>
            <select id="metodo_pago" class="form-control" v-model="pagoForm.metodo_pago" required>
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="movil">Pago Móvil</option>
            </select>
          </div>

          <div class="form-group mb-3">
            <label for="referencia"><b>Referencia (opcional):</b></label>
            <input type="text" class="form-control" id="referencia" v-model="pagoForm.referencia" 
                   placeholder="Número de referencia, último 4 dígitos, etc.">
          </div>

          <div v-if="pagoLoading" class="mb-3">
            <div class="alert alert-info">Procesando pago...</div>
          </div>
          <div v-if="pagoError" class="mb-3">
            <div class="alert alert-warning">{{ pagoError }}</div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="cerrarModalPago">Cancelar</button>
            <button type="submit" class="btn btn-success" :disabled="pagoLoading">
              {{ pagoLoading ? 'Procesando...' : 'Confirmar Pago' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// --- Estado para reportes ---
const showReportModal = ref(false)
const reportDesde = ref('')
const reportHasta = ref('')
// El reporte de la UI ahora filtra exclusivamente por fecha de registro (fecha_creacion)
const reportFilterBy = ref('fecha_creacion')
const reportResults = ref([])
const reportLoading = ref(false)
const reportError = ref('')

const showRankingModal = ref(false)
const rankingResults = ref([])
const rankingLoading = ref(false)
const rankingError = ref('')

// Especialidades ranking
const showEspecialidadModal = ref(false)
const especialidadResults = ref([])
const especialidadLoading = ref(false)
const especialidadError = ref('')

// Estado para pagos
const showPagoModal = ref(false)
const currentCitaPago = ref({})
const pagoForm = ref({
  monto: '',
  metodo_pago: '',
  referencia: ''
})
const pagoLoading = ref(false)
const pagoError = ref('')


async function fetchCitas() {
  loading.value = true
  error.value = ''
  try {
    // Ajusta la ruta si tu backend corre en otro dominio/puerto.
    const res = await axios.get(`${API_BASE}/api/citas`)
    if (Array.isArray(res.data)) {
      // El controlador devuelve objetos con campos como: id, fecha, hora, paciente, doctor, estado
      const citasConPago = await Promise.all(res.data.map(async (c) => {
        try {
          // Obtener resumen completo de pagos de la cita
          const pagoRes = await axios.get(`${API_BASE}/api/pagos/resumen/${c.id}`)
          return {
            id: c.id,
            patient: c.paciente || c.patient || '',
            doctor: c.doctor || c.doctor || '',
            status: c.estado || c.status || '',
            date: c.fecha || c.date || '',
            time: c.hora || c.time || '',
            cod_paciente: c.cod_paciente || c.codPaciente || null,
            cod_doctor: c.cod_doctor || c.codDoctor || null,
            cod_especialidad: c.cod_especialidad || c.codEspecialidad || null,
            notes: c.notes || '',
            // Información de pago mejorada
            monto_total: pagoRes.data.monto_total || 0,
            total_pagado: pagoRes.data.total_pagado || 0,
            saldo_pendiente: pagoRes.data.saldo_pendiente || 0,
            estado_completo: pagoRes.data.estado_completo || false,
            pagoEstado: pagoRes.data.estado_completo ? 'completado' : 
                      (pagoRes.data.total_pagado > 0 ? 'parcial' : 'pendiente'),
            cantidad_pagos: pagoRes.data.pagos ? pagoRes.data.pagos.length : 0
          }
        } catch (pagoError) {
          // Si no hay información de pago, establecer valores por defecto
          return {
            id: c.id,
            patient: c.paciente || c.patient || '',
            doctor: c.doctor || c.doctor || '',
            status: c.estado || c.status || '',
            date: c.fecha || c.date || '',
            time: c.hora || c.time || '',
            cod_paciente: c.cod_paciente || c.codPaciente || null,
            cod_doctor: c.cod_doctor || c.codDoctor || null,
            cod_especialidad: c.cod_especialidad || c.codEspecialidad || null,
            notes: c.notes || '',
            // Valores por defecto cuando no hay información de pago
            monto_total: 150.00, // Precio por defecto
            total_pagado: 0,
            saldo_pendiente: 150.00,
            estado_completo: false,
            pagoEstado: 'pendiente',
            cantidad_pagos: 0
          }
        }
      }))
      appointments.value = citasConPago
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

// Handlers para eventos globales (emitidos desde el formulario de pacientes)
function handlePacienteChanged(/* event */) {
  // recargamos pacientes y citas para mantener UI sincronizada
  fetchPacientes()
  fetchCitas()
}

function handleAppointmentsChanged() {
  fetchCitas()
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
  // Escuchar eventos globales para actualizar agenda cuando hay cambios en pacientes
  window.addEventListener('paciente-eliminado', handlePacienteChanged)
  window.addEventListener('paciente-actualizado', handlePacienteChanged)
  window.addEventListener('paciente-registrado', handlePacienteChanged)
  // También respondemos a eventos de cambios en citas (ya existían en otras acciones)
  window.addEventListener('appointments-changed', handleAppointmentsChanged)
})

onUnmounted(() => {
  window.removeEventListener('paciente-eliminado', handlePacienteChanged)
  window.removeEventListener('paciente-actualizado', handlePacienteChanged)
  window.removeEventListener('paciente-registrado', handlePacienteChanged)
  window.removeEventListener('appointments-changed', handleAppointmentsChanged)
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

// Abrir modal de reporte por fechas
function abrirModalReporteFechas() {
  reportDesde.value = ''
  reportHasta.value = ''
  reportResults.value = []
  reportError.value = ''
  showReportModal.value = true
}

function closeReportModal() {
  showReportModal.value = false
}

async function generarReporteFechas() {
  reportError.value = ''
  reportResults.value = []
  if (!reportDesde.value || !reportHasta.value) {
    reportError.value = 'Selecciona ambas fechas.'
    return
  }

  reportLoading.value = true
  try {
    const res = await axios.get(`${API_BASE}/api/citas/reporte/por-fechas`, { params: { fecha_desde: reportDesde.value, fecha_hasta: reportHasta.value, filter_by: reportFilterBy.value } })
    if (Array.isArray(res.data)) {
      reportResults.value = res.data
    } else {
      reportResults.value = []
      reportError.value = 'Respuesta inesperada del servidor.'
    }
  } catch (err) {
    console.error('Error generando reporte por fechas:', err)
    reportError.value = 'No se pudo generar el reporte. Revisa la consola.'
  } finally {
    reportLoading.value = false
  }
}

// Ranking
function abrirModalRanking() {
  rankingResults.value = []
  rankingError.value = ''
  showRankingModal.value = true
  fetchRanking()
}

function closeRankingModal() {
  showRankingModal.value = false
}

async function fetchRanking() {
  rankingLoading.value = true
  rankingError.value = ''
  rankingResults.value = []
  try {
    const res = await axios.get(`${API_BASE}/api/citas/reporte/ranking-pacientes`)
    rankingResults.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error cargando ranking:', err)
    rankingError.value = 'No se pudo cargar el ranking. Revisa la consola.'
  } finally {
    rankingLoading.value = false
  }
}

// Especialidades
function abrirModalEspecialidades() {
  especialidadResults.value = []
  especialidadError.value = ''
  showEspecialidadModal.value = true
  fetchRankingEspecialidades()
}

function closeEspecialidadModal() {
  showEspecialidadModal.value = false
}

async function fetchRankingEspecialidades() {
  especialidadLoading.value = true
  especialidadError.value = ''
  especialidadResults.value = []
  try {
    const res = await axios.get(`${API_BASE}/api/citas/reporte/ranking-especialidades`)
    especialidadResults.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error cargando ranking de especialidades:', err)
    especialidadError.value = 'No se pudo cargar el ranking de especialidades. Revisa la consola.'
  } finally {
    especialidadLoading.value = false
  }
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
  
  // Soportamos tanto valores legibles ('Atendido', 'Por atender') como códigos ('A','P','C')
  const statusForCheck = String(currentAppointment.value.status || '').toLowerCase()
  if (currentAppointment.value.status && (statusForCheck === 'a' || statusForCheck.includes('atendid') || statusForCheck.includes('atend'))) {
    if (!currentAppointment.value.date) {
      alert('La cita debe tener fecha antes de marcar como "Atendido".')
      return
    }
    // consideramos la hora también (si no hay hora, se considera medianoche 00:00:00)
    let horaVal = currentAppointment.value.time || '00:00:00'
    if (horaVal.split(':').length === 2) horaVal = horaVal + ':00'
    const appt = new Date(`${currentAppointment.value.date}T${horaVal}`)
    const today = new Date()
    const now = new Date()
    if (appt > now) {
      alert('No se puede marcar como "Atendido" una cita con fecha futura.')
      return
    }
  }
  

  // Normalize status for payload: if user selected a code (P/A/C) use it, otherwise try mapping
  const computedStatus = getStatusForDisplay(currentAppointment.value.date, currentAppointment.value.status, currentAppointment.value.time)

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
  const s = String(status).trim()
  // If already a single-letter code (P/A/C) return it (case-insensitive)
  const upper = s.toUpperCase()
  if (['P','A','C'].includes(upper)) return upper

  const lower = s.toLowerCase()
  if (lower.includes('atend')) return 'A'
  if (lower.includes('cancel') || lower.includes('canc')) return 'C'
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
  const s = String(status).toLowerCase()
  // Aceptamos códigos (p/a/c) o etiquetas completas
  if (s === 'a' || s.includes('atendid')) return 'status-atendido'
  if (s === 'p' || s.includes('por')) return 'status-por-atender'
  if (s === 'c' || s.includes('cancel')) return 'status-cancelado'
  return ''
}

function getStatusForDisplay(dateStr, status, timeStr = '00:00:00') {
  if (!dateStr) return status || ''

  // normalizar hora
  let hora = String(timeStr || '').trim()
  if (!hora) hora = '00:00:00'
  if (hora.split(':').length === 2) hora = hora + ':00'

  const appt = new Date(`${dateStr}T${hora}`)
  const now = new Date()

  // Si la cita está en el futuro (fecha+hora), mostrar "Por atender"
  if (appt > now) return 'Por atender'

  // Pasó el turno -> mostrar Atendido salvo que esté explícitamente cancelada
  const s = String(status || '').trim()
  const code = s.toUpperCase()
  if (code === 'C' || String(status).toLowerCase().includes('cancel')) return 'Cancelado'
  return 'Atendido'
}

function formatDateToDisplay(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-VE')
}

// Funciones para manejo de pagos
function procesarPago(cita) {
  currentCitaPago.value = { ...cita }
  pagoForm.value = {
    monto: '',
    metodo_pago: '',
    referencia: ''
  }
  pagoError.value = ''
  showPagoModal.value = true
}

function cerrarModalPago() {
  showPagoModal.value = false
  currentCitaPago.value = {}
  pagoForm.value = {
    monto: '',
    metodo_pago: '',
    referencia: ''
  }
  pagoError.value = ''
}

async function guardarPago() {
  pagoLoading.value = true
  pagoError.value = ''
  
  try {
    const monto = parseFloat(pagoForm.value.monto)
    const saldoPendiente = parseFloat(currentCitaPago.value.saldo_pendiente || 0)
    
    // Validar que el monto no sea mayor al saldo pendiente
    if (monto > saldoPendiente) {
      pagoError.value = `El monto a pagar ($${monto.toFixed(2)}) no puede ser mayor al saldo pendiente ($${saldoPendiente.toFixed(2)}).`
      pagoLoading.value = false
      return
    }
    
    // Validar que el monto sea mayor a 0
    if (monto <= 0) {
      pagoError.value = 'El monto a pagar debe ser mayor a 0.'
      pagoLoading.value = false
      return
    }
    
    const payload = {
      cod_cita: currentCitaPago.value.id,
      monto: monto,
      metodo_pago: pagoForm.value.metodo_pago,
      referencia: pagoForm.value.referencia || null
    }
    
    const res = await axios.post(`${API_BASE}/api/pagos`, payload)
    
    if (res.status === 201) {
      alert('✅ Pago registrado correctamente.')
      cerrarModalPago()
      fetchCitas() // Recargar citas para actualizar estado de pago
    }
  } catch (err) {
    console.error('Error al procesar pago:', err)
    if (err.response && err.response.data && err.response.data.message) {
      pagoError.value = err.response.data.message
    } else {
      pagoError.value = 'Error al procesar el pago. Intente nuevamente.'
    }
  } finally {
    pagoLoading.value = false
  }
}

function pagoStatusClass(estado) {
  if (!estado) return 'status-no-pagado'
  const s = String(estado).toLowerCase()
  if (s === 'completado') return 'status-pago-completado'
  if (s === 'parcial') return 'status-pago-parcial'
  if (s === 'pendiente') return 'status-pago-pendiente'
  if (s === 'rechazado') return 'status-pago-rechazado'
  return ''
}

function getEstadoPagoTexto(estado) {
  if (!estado) return 'No pagado'
  const s = String(estado).toLowerCase()
  if (s === 'completado') return 'Pagado'
  if (s === 'parcial') return 'Parcial'
  if (s === 'pendiente') return 'Pendiente'
  if (s === 'rechazado') return 'Rechazado'
  return estado
}
</script>

<style scoped>
.status-atendido {
  background-color: #d4edda;
  color: #155724;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-por-atender {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-cancelado {
  background-color: #f8d7da;
  color: #721c24;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-pago-completado {
  background-color: #d4edda;
  color: #155724;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-pago-pendiente {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-pago-parcial {
  background-color: #cce5ff;
  color: #004085;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-pago-rechazado {
  background-color: #f8d7da;
  color: #721c24;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-no-pagado {
  background-color: #e2e3e5;
  color: #383d41;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.custom-modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.btn-limpiar {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-limpiar:hover {
  background-color: #5a6268;
}
</style>
