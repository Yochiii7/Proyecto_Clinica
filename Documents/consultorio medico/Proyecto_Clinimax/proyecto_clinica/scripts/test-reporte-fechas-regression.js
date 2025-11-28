#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

async function main() {
  try {
    console.log('⚙️  Regression test: ensure reporte por-fechas filters by appointment date (fecha), not registration date (fecha_creacion)')

    // 1) Create a temporary paciente
    const cedula = String(Math.floor(10000000 + Math.random() * 89999999))
    const pacientePayload = { cedula_paciente: cedula, nombre_paciente: 'RegTest', apellido_paciente: 'Paciente', sexo: 'Otro', estado: 'Activo', cargo: 'P' }
    const createRes = await axios.post(`${API_BASE}/api/pacientes`, pacientePayload)
    const codPaciente = createRes.data?.paciente?.cod_paciente
    if (!codPaciente) throw new Error('No se obtuvo cod_paciente al crear paciente de prueba')

    // 2) Find an available doctor & especialidad
    const [doctRes, espRes] = await Promise.all([
      axios.get(`${API_BASE}/api/doctores`),
      axios.get(`${API_BASE}/api/especialidades`)
    ])
    const codDoctor = doctRes.data?.[0]?.cod_doctor
    const codEsp = espRes.data?.[0]?.cod_especialidad
    if (!codDoctor || !codEsp) throw new Error('No hay doctores/especialidades en la BD — añade datos para continuar.')

    const today = new Date()
    const start = addDays(today, -1)
    const end = addDays(today, 1)

    const fechaDesde = start.toISOString().slice(0,10)
    const fechaHasta = end.toISOString().slice(0,10)

    // 3) Create two citas:
    //  - citaFuera: fecha fuera del rango (e.g., +10 days) — should NOT appear in report
    //  - citaDentro: fecha inside the range (e.g., today) — should appear
    const citaFueraFecha = addDays(today, 10).toISOString().slice(0,10)
    const citaDentroFecha = today.toISOString().slice(0,10)

    const create1 = await axios.post(`${API_BASE}/api/citas`, { fecha: citaFueraFecha, hora: '09:00:00', cod_paciente: codPaciente, cod_doctor: codDoctor, cod_especialidad: codEsp })
    const create2 = await axios.post(`${API_BASE}/api/citas`, { fecha: citaDentroFecha, hora: '10:00:00', cod_paciente: codPaciente, cod_doctor: codDoctor, cod_especialidad: codEsp })

    console.log('Citas creadas. Intentando reporte (default => fecha_creacion) con fechas:', fechaDesde, fechaHasta)

    // Default now filters by fecha_creacion (registro). Since both citas fueron creadas ahora,
    // y el rango (fechaDesde..fechaHasta) incluye hoy, debemos ver ambas entradas.
    const res = await axios.get(`${API_BASE}/api/citas/reporte/por-fechas`, { params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta } })

    if (!Array.isArray(res.data)) {
      console.error('Respuesta inesperada:', res.data)
      process.exitCode = 1
      return
    }

    console.log('Citas devueltas por el reporte (default - fecha_creacion):', res.data.length)
    const ids = res.data.map(r => ({ id: r.id, fecha: r.fecha }))
    console.log(ids)

    // Expect that both will be present because both were registered now and the date range includes today
    const foundDentroDefault = res.data.find(r => r.fecha === citaDentroFecha)
    const foundFueraDefault = res.data.find(r => r.fecha === citaFueraFecha)
    if (!foundDentroDefault || !foundFueraDefault) {
      console.error('❌ Falla: con el comportamiento por defecto (filter_by=fecha_creacion) se esperaban ambas citas, pero no se obtuvieron ambas')
      process.exitCode = 1
      return
    }

    console.log('✅ OK: comportamiento por defecto (filter_by=fecha_creacion) funciona correctamente')

    // Ahora comprobamos explícitamente filter_by=fecha (fecha de consulta) — debe devolver solo la cita dentro del rango de consulta
    console.log('Intentando reporte por fecha de consulta con fechas:', fechaDesde, fechaHasta)
    const resFecha = await axios.get(`${API_BASE}/api/citas/reporte/por-fechas`, { params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta, filter_by: 'fecha' } })

    if (!Array.isArray(resFecha.data)) {
      console.error('Respuesta inesperada (filter_by=fecha):', resFecha.data)
      process.exitCode = 1
      return
    }

    const foundDentroFecha = resFecha.data.find(r => r.fecha === citaDentroFecha)
    const foundFueraFecha = resFecha.data.find(r => r.fecha === citaFueraFecha)
    if (!foundDentroFecha) {
      console.error('❌ Falla: la cita con fecha dentro del rango NO fue devuelta por el reporte (filter_by=fecha)')
      process.exitCode = 1
      return
    }
    if (foundFueraFecha) {
      console.error('❌ Falla: la cita con fecha FUERA del rango fue devuelta por el reporte (filter_by=fecha)')
      process.exitCode = 1
      return
    }

    console.log('✅ OK: filter_by=fecha funciona correctamente')

    // Ahora comprobamos que si solicitamos filter_by=fecha_creacion, el endpoint filtra por fecha de registro
    const todayStr = today.toISOString().slice(0,10)
    console.log('Intentando reporte por fecha_creacion (registro) con rango:', todayStr, todayStr)

    const resReg = await axios.get(`${API_BASE}/api/citas/reporte/por-fechas`, { params: { fecha_desde: todayStr, fecha_hasta: todayStr, filter_by: 'fecha_creacion' } })

    if (!Array.isArray(resReg.data)) {
      console.error('Respuesta inesperada (fecha_creacion):', resReg.data)
      process.exitCode = 1
      return
    }

    const idsReg = resReg.data.map(r => ({ id: r.id, fecha: r.fecha }))
    console.log('Reg resultados:', idsReg)

    // Ambas citas se registraron ahora, así que ambas deberían aparecer cuando filtramos por fecha_creacion
    const found1 = resReg.data.find(r => r.fecha === citaFueraFecha)
    const found2 = resReg.data.find(r => r.fecha === citaDentroFecha)
    if (!found1 || !found2) {
      console.error('❌ Falla: al filtrar por fecha_creacion no se devolvieron ambas citas creadas ahora (esperado).')
      process.exitCode = 1
      return
    }

    console.log('✅ OK: filter_by=fecha_creacion funciona correctamente')
  } catch (err) {
    console.error('❌ Test fallido:', err?.message || err)
    process.exitCode = 1
  }
}

main()
