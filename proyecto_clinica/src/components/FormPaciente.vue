<template>
  <div class="container-fluid py-4">
    <div class="container">
      <div class="form-card">
        <h2 class="text-center text-primary mb-4">
          {{ isEditing ? 'Editando Paciente' : 'Registro de Paciente' }}
        </h2>

        <div v-if="showSuccessMessage" class="success-message">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="cedula" class="form-label">Cédula</label>
              <input
                id="cedula"
                v-model="paciente.cedula_paciente"
                type="text"
                class="form-control"
                maxlength="8"
                @input="soloNumeros('cedula_paciente')"
                :disabled="isEditing"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                id="nombre"
                v-model="paciente.nombre_paciente"
                type="text"
                class="form-control"
                @input="soloLetras('nombre_paciente')"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="apellido" class="form-label">Apellido</label>
              <input
                id="apellido"
                v-model="paciente.apellido_paciente"
                type="text"
                class="form-control"
                @input="soloLetras('apellido_paciente')"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="sexo" class="form-label">Sexo</label>
              <select id="sexo" v-model="paciente.sexo" class="form-select" required>
                <option disabled value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div class="col-12 col-md-6">
              <label for="telefono" class="form-label">Teléfono</label>
              <input
                id="telefono"
                v-model="paciente.telefono"
                type="tel"
                class="form-control"
                maxlength="13"
                @input="soloNumeros('telefono')"
                placeholder="(Opcional)"
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="seguro" class="form-label">Seguro</label>
              <input
                id="seguro"
                v-model="paciente.seguro"
                type="text"
                class="form-control"
                placeholder="Ej: IVSS, MPPS"
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="estado" class="form-label">Estado</label>
              <select id="estado" v-model="paciente.estado" class="form-select" required>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary btn-sm w-100 w-md-auto">
              {{ isEditing ? (isSubmitting ? 'Actualizando...' : 'Actualizar') : (isSubmitting ? 'Registrando...' : 'Registrar') }}
            </button>

            <button
              v-if="isEditing"
              @click="cancelarEdicion"
              type="button"
              class="btn btn-secondary btn-sm w-100 w-md-auto"
            >
              Cancelar Edición
            </button>
          </div>
        </form>
      </div>

      <hr class="separator" />

      <!-- Lista -->
      <div class="patient-list-section">
        <div class="row align-items-center mb-3">
          <div class="col">
            <h3 class="list-title">Pacientes Registrados</h3>
          </div>

          <div class="col-12 col-sm-6 col-md-4 ms-auto">
            <input
              type="text"
              v-model="searchTerm"
              class="form-control"
              placeholder="Buscar por nombre, apellido o cédula..."
            />
          </div>
        </div>

        <div v-if="filteredPacientes.length === 0" class="no-patients-message">
          {{ pacientes.length > 0 ? 'No se encontraron pacientes con ese criterio.' : 'Aún no hay pacientes registrados.' }}
        </div>

        <div v-else class="pacientes-grid">
          <div class="paciente-card" v-for="p in filteredPacientes" :key="p.cedula_paciente">
            <div class="card-header">
              <strong>{{ p.nombre_paciente }} {{ p.apellido_paciente }}</strong>
              <span class="status-badge" :class="p.estado === 'Activo' ? 'activo' : 'inactivo'">
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
              <button @click="iniciarEdicion(p)" class="edit-btn btn btn-sm w-100 w-md-auto">Editar</button>
              <button @click="eliminarPaciente(p.cedula_paciente)" class="delete-btn btn btn-sm w-100 w-md-auto">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, watch, computed } from 'vue'

const emit = defineEmits(['paciente-registrado', 'paciente-actualizado', 'paciente-eliminado'])

const paciente = reactive({
  cedula_paciente: '',
  nombre_paciente: '',
  apellido_paciente: '',
  sexo: '',
  telefono: '',
  seguro: '',
  estado: 'Activo',
  cargo: 'P' // fijo
})

const pacientes = ref(JSON.parse(localStorage.getItem('pacientes')) || [])
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const isEditing = ref(false)
const pacienteEditId = ref(null)
const searchTerm = ref('')


const filteredPacientes = computed(() => {
  if (!searchTerm.value) return pacientes.value
  const s = searchTerm.value.toLowerCase()
  return pacientes.value.filter(p =>
    p.nombre_paciente.toLowerCase().includes(s) ||
    p.apellido_paciente.toLowerCase().includes(s) ||
    p.cedula_paciente.toLowerCase().includes(s)
  )
})


const soloNumeros = (campo) => {
  paciente[campo] = paciente[campo].replace(/[^0-9]/g, '')
}

const soloLetras = (campo) => {
  paciente[campo] = paciente[campo].replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '')
}


const handleSubmit = (e) => {
  const form = e.target
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  if (isEditing.value) {
    const index = pacientes.value.findIndex(p => p.cedula_paciente === pacienteEditId.value)
    if (index !== -1) {
      pacientes.value[index] = { ...paciente }
      emit('paciente-actualizado', pacientes.value[index])
      mostrarMensajeExito('¡Paciente actualizado con éxito!')
    }
    cancelarEdicion()
  } else {
    if (pacientes.value.some(p => p.cedula_paciente === paciente.cedula_paciente)) {
      alert('⚠️ Ya existe un paciente con esa cédula.')
      isSubmitting.value = false
      return
    }
    pacientes.value.push({ ...paciente })
    emit('paciente-registrado', paciente)
    mostrarMensajeExito('¡Paciente registrado con éxito!')
    limpiarCampos()
  }

  isSubmitting.value = false
}

const limpiarCampos = () => {
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

const mostrarMensajeExito = (mensaje) => {
  successMessage.value = mensaje
  showSuccessMessage.value = true
  setTimeout(() => (showSuccessMessage.value = false), 3000)
}

const iniciarEdicion = (p) => {
  isEditing.value = true
  pacienteEditId.value = p.cedula_paciente
  Object.assign(paciente, p)
  window.scrollTo(0, 0)
}

const cancelarEdicion = () => {
  isEditing.value = false
  pacienteEditId.value = null
  limpiarCampos()
}

const eliminarPaciente = (cedula) => {
  if (confirm('¿Estás seguro de eliminar este paciente?')) {
    const index = pacientes.value.findIndex(p => p.cedula_paciente === cedula)
    if (index !== -1) {
      const eliminado = pacientes.value.splice(index, 1)
      emit('paciente-eliminado', eliminado[0])
      mostrarMensajeExito('Paciente eliminado correctamente.')
    }
  }
}

watch(pacientes, (nuevo) => {
  localStorage.setItem('pacientes', JSON.stringify(nuevo))
}, { deep: true })
</script>



<style scoped>
.form-card {
  background-color: var(--header-background, #fff);
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
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

.separator {
  border: none;
  border-top: 1px solid var(--border-color, #eee);
  margin: 2.5rem 0;
}

.list-title { margin: 0; color: var(--text-color, #333); }

.search-bar input,
.row .form-control {
  width: 100%;
  max-width: 420px; /* limita en pantallas muy grandes */
}

/* Grid tarjetas */
.pacientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.paciente-card {
  background: var(--header-background, #fff);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.paciente-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
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

.card-body { flex-grow: 1; margin-bottom: 1rem; }
.card-body p { margin: 0.45rem 0; font-size: 0.92rem; color: #555; }

.card-actions {
  display: flex;
  gap: 0.5rem;
}
.card-actions button { width: 100%; }

/* Mobile tweaks */
@media (max-width: 576px) {
  .card-actions { flex-direction: column; }
  .form-card { padding: 1rem; }
}
.edit-btn { background-color: #ffc107; color: #212529; border: none; }
.delete-btn { background-color: #dc3545; color: #fff; border: none; }
</style>

