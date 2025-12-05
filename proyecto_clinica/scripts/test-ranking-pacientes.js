#!/usr/bin/env node
import axios from 'axios'

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

async function main() {
  try {
    console.log('⚙️  Test: ranking de pacientes por visitas')
    const res = await axios.get(`${API_BASE}/api/citas/reporte/ranking-pacientes`)
    console.log('Status:', res.status)
    console.log('Resultados:', Array.isArray(res.data) ? res.data.slice(0,10) : res.data)
    console.log('✅ Prueba completada')
  } catch (err) {
    console.error('❌ Falló test de ranking:', err?.message || err)
    process.exitCode = 1
  }
}

main()
