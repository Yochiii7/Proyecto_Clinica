#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

async function main() {
  try {
    console.log('⚙️  Iniciando test: crear paciente, crear cita, eliminar paciente y verificar cascade')

    // 1) Crear paciente de prueba
    const cedula = String(Math.floor(10000000 + Math.random() * 89999999))
    const pacientePayload = {
      cedula_paciente: cedula,
      nombre_paciente: 'Test',
      apellido_paciente: 'Paciente',
      sexo: 'Masculino',
      telefono: '0000000000',
      seguro: 'N/A',
      estado: 'Activo',
      cargo: 'P'
    }

    const createRes = await axios.post(`${API_BASE}/api/pacientes`, pacientePayload)
    console.log('Paciente creado:', createRes.data)
    const codPaciente = createRes.data?.paciente?.cod_paciente
    if (!codPaciente) throw new Error('No se recibió cod_paciente al crear paciente')

    // 2) Obtener doctor y especialidad existentes
    const [doctRes, espRes] = await Promise.all([
      axios.get(`${API_BASE}/api/doctores`),
      axios.get(`${API_BASE}/api/especialidades`)
    ])

    const doctores = Array.isArray(doctRes.data) ? doctRes.data : []
    const especialidades = Array.isArray(espRes.data) ? espRes.data : []
    if (!doctores.length || !especialidades.length) {
      console.warn('No hay doctores o especialidades en la BD — el test no puede continuar con creacion de cita.')
      console.warn('Borra manualmente el paciente o prueba en entorno con datos de doctores/especialidades.')
      return
    }

    const codDoctor = doctores[0].cod_doctor
    const codEsp = especialidades[0].cod_especialidad

    // 3) Crear cita para ese paciente
    const fecha = new Date().toISOString().slice(0,10) // YYYY-MM-DD
    const hora = '09:00:00'
    const citaPayload = { fecha, hora, cod_paciente: codPaciente, cod_doctor: codDoctor, cod_especialidad: codEsp }
    const citaRes = await axios.post(`${API_BASE}/api/citas`, citaPayload)
    console.log('Cita creada:', citaRes.data)

    // 4) Verificar la cita existe
    const citasAntes = await axios.get(`${API_BASE}/api/citas`)
    const foundBefore = citasAntes.data.find(c => Number(c.cod_paciente) === Number(codPaciente))
    console.log('Cita existe antes de borrar paciente:', !!foundBefore)
    if (!foundBefore) throw new Error('No se encontró la cita recién creada')

    // 5) Eliminar paciente (por cédula)
    const delRes = await axios.delete(`${API_BASE}/api/pacientes/${cedula}`)
    console.log('Respuesta al eliminar paciente:', delRes.data)

    // 6) Verificar las citas ya no existen
    const citasDespues = await axios.get(`${API_BASE}/api/citas`)
    const foundAfter = citasDespues.data.find(c => Number(c.cod_paciente) === Number(codPaciente))
    console.log('Cita existe después de borrar paciente (debería ser false):', !!foundAfter)

    if (foundAfter) throw new Error('Cascade delete falló: la cita sigue presente')

    console.log('✅ Test completado correctamente — las citas se eliminaron cuando se borró el paciente')

  } catch (err) {
    console.error('❌ Test fallido:', err?.message || err)
    process.exitCode = 1
  }
}

main()
