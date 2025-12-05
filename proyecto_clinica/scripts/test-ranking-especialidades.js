#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

async function main() {
  try {
    console.log('⚙️  Test: ranking de especialidades por solicitudes')
    const res = await axios.get(`${API_BASE}/api/citas/reporte/ranking-especialidades`)
    console.log('Status:', res.status)
    console.log('Resultados:', Array.isArray(res.data) ? res.data.slice(0,20) : res.data)
    console.log('✅ Prueba completada')
  } catch (err) {
    console.error('❌ Falló test de ranking especialidades:', err?.message || err)
    process.exitCode = 1
  }
}

main()
