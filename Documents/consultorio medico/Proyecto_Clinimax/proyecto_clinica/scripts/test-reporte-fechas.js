#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

async function main() {
  try {
    console.log('⚙️  Test: reporte por rango de fechas (últimos 30 días)')

    const now = new Date()
    const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const fecha_desde = past.toISOString().slice(0,10)
    const fecha_hasta = now.toISOString().slice(0,10)

    const res = await axios.get(`${API_BASE}/api/citas/reporte/por-fechas`, { params: { fecha_desde, fecha_hasta } })
    console.log('Status:', res.status)
    console.log('Resultados encontrados:', Array.isArray(res.data) ? res.data.length : 'respuesta inesperada')
    console.log('Primeras filas (si hay):', (Array.isArray(res.data) && res.data.slice(0,5)) || res.data)

    console.log('✅ Prueba completada')
  } catch (err) {
    console.error('❌ Falló test de reporte por fechas:', err?.message || err)
    process.exitCode = 1
  }
}

main()
