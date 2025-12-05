#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

async function main() {
  try {
    console.log('⚙️  Test: crear paciente + cita en el pasado, listar y verificar estado == A')

    // crear paciente
    const cedula = String(Math.floor(10000000 + Math.random() * 89999999))
    const pacientePayload = { cedula_paciente: cedula, nombre_paciente: 'Past', apellido_paciente: 'Paciente', sexo: 'Masculino', estado: 'Activo', cargo: 'P' }
    const createRes = await axios.post(`${API_BASE}/api/pacientes`, pacientePayload)
    const codPaciente = createRes.data?.paciente?.cod_paciente
    if (!codPaciente) throw new Error('No se obtuvo cod_paciente')

    // obtener doctor/especialidad
    const [doctRes, espRes] = await Promise.all([axios.get(`${API_BASE}/api/doctores`), axios.get(`${API_BASE}/api/especialidades`)])
    const codDoctor = doctRes.data?.[0]?.cod_doctor
    const codEsp = espRes.data?.[0]?.cod_especialidad
    if (!codDoctor || !codEsp) {
      console.warn('No hay doctores/especialidades en la BD; agrega datos y vuelve a ejecutar el test.')
      return
    }

    // crear cita en el pasado (2 horas antes)
    const now = new Date()
    const past = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const fecha = past.toISOString().slice(0,10)
    const hora = past.toTimeString().slice(0,8) // HH:MM:SS

    const citaRes = await axios.post(`${API_BASE}/api/citas`, { fecha, hora, cod_paciente: codPaciente, cod_doctor: codDoctor, cod_especialidad: codEsp })
    console.log('Cita creada:', citaRes.data?.cita || citaRes.data)

    // listar citas y comprobar que la cita para codPaciente aparece como estado='A' (Atendido)
    const citasList = await axios.get(`${API_BASE}/api/citas`)
    const found = citasList.data.find(c => Number(c.cod_paciente) === Number(codPaciente))
    console.log('Entrada de cita encontrada en listado:', !!found)
    console.log('Estado en listado:', found?.estado)

    if (!found) throw new Error('No se encontró la cita en el listado')
    if (String(found.estado).toUpperCase() !== 'A') throw new Error('La cita NO fue marcada como Atendido (estado != A)')

    console.log('✅ Prueba exitosa: cita en el pasado fue marcada como Atendido')
  } catch (err) {
    console.error('❌ Test fallido:', err?.message || err)
    process.exitCode = 1
  }
}

main()
