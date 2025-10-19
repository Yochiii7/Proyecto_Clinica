<template>
  <div class="container">
    <!-- Formulario -->
    <form @submit.prevent="registrarPaciente" class="formulario">
      <h2>Registrar Paciente</h2>

      <div class="input-group">
        <label>Cédula:</label>
        <input v-model="paciente.cedula_paciente" type="text" required />
      </div>

      <div class="input-group">
        <label>Nombre:</label>
        <input v-model="paciente.nombre_paciente" type="text" required />
      </div>

      <div class="input-group">
        <label>Apellido:</label>
        <input v-model="paciente.apellido_paciente" type="text" required />
      </div>

      <div class="input-group">
        <label>Sexo:</label>
        <select v-model="paciente.sexo" required>
          <option value="">Seleccione...</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>

      <div class="input-group">
        <label>Teléfono:</label>
        <input v-model="paciente.telefono" type="text" />
      </div>

      <div class="input-group">
        <label>Seguro:</label>
        <input v-model="paciente.seguro" type="text" placeholder="Ej: IVSS, MPPS" />
      </div>

      <div class="input-group">
        <label>Estado:</label>
        <select v-model="paciente.estado">
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <div class="input-group">
        <label>Cargo:</label>
        <input v-model="paciente.cargo" type="text" maxlength="1" placeholder="Ej: P (paciente)" />
      </div>

      <button type="submit">Registrar</button>
    </form>

    <hr />

    <!-- Pacientes registrados -->
    <h3>Pacientes registrados:</h3>
    <div class="pacientes-grid">
      <div class="paciente-card" v-for="(p, i) in pacientes" :key="i">
        <div class="card-header">
          <strong>{{ p.nombre_paciente }} {{ p.apellido_paciente }}</strong>
          <span :class="{'activo': p.estado === 'Activo', 'inactivo': p.estado === 'Inactivo'}">
            {{ p.estado }}
          </span>
        </div>
        <div class="card-body">
          <p><strong>Cédula:</strong> {{ p.cedula_paciente }}</p>
          <p><strong>Sexo:</strong> {{ p.sexo }}</p>
          <p><strong>Teléfono:</strong> {{ p.telefono || '-' }}</p>
          <p><strong>Seguro:</strong> {{ p.seguro || '-' }}</p>
          <p><strong>Cargo:</strong> {{ p.cargo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paciente: {
        cedula_paciente: '',
        nombre_paciente: '',
        apellido_paciente: '',
        sexo: '',
        telefono: '',
        seguro: '',
        estado: 'Activo',
        cargo: 'P'
      },
      pacientes: JSON.parse(localStorage.getItem('pacientes')) || []
    }
  },
  methods: {
    registrarPaciente() {
      this.pacientes.push({ ...this.paciente })
      localStorage.setItem('pacientes', JSON.stringify(this.pacientes))
      alert('✅ Paciente registrado con éxito')
      this.limpiarCampos()
    },
    limpiarCampos() {
      this.paciente = {
        cedula_paciente: '',
        nombre_paciente: '',
        apellido_paciente: '',
        sexo: '',
        telefono: '',
        seguro: '',
        estado: 'Activo',
        cargo: 'P'
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor general */
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Formulario */
.formulario {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 20px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.formulario h2 {
  grid-column: 1 / -1;
  text-align: center;
  color: #1976d2;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: 0.3s;
}

input:focus, select:focus {
  border-color: #1976d2;
  outline: none;
  box-shadow: 0 0 5px rgba(25, 118, 210, 0.5);
}

button {
  grid-column: 1 / -1;
  padding: 10px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

button:hover {
  background: #0d47a1;
}

/* Separador */
hr {
  margin: 30px 0;
  border: none;
  border-top: 2px solid #eee;
}

/* Pacientes registrados: grid de tarjetas */
.pacientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* ancho mínimo mayor */
  gap: 15px;
  margin-top: 20px;
}

.paciente-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  color: #333; /* Color de texto por defecto dentro de la tarjeta */
}

.paciente-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between; /* nombre a la izquierda, estado a la derecha */
  align-items: center;
  margin-bottom: 10px;
  gap: 10px; /* espacio opcional extra */
}


.card-header strong {
  display: inline-block;
  font-size: 18px;
  color: white;
  font-weight: bold;
  background: linear-gradient(90deg, #0d47a1, #507fc5); /* degradado naranja */
  padding: 4px 8px;
  border-radius: 5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}



.card-header .activo {
  background-color: #2e7d32; /* verde intenso */
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
}

.card-header .inactivo {
  background-color: #c62828; /* rojo oscuro */
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
}

.card-body p {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}
</style>
