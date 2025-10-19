<template>
  <form @submit.prevent="registrarPaciente" class="formulario">
    <div>
      <label>Cédula:</label>
      <input v-model="paciente.cedula" type="text" required />
    </div>

    <div>
      <label>Nombre completo:</label>
      <input v-model="paciente.nombre" type="text" required />
    </div>

    <div>
      <label>Fecha de nacimiento:</label>
      <input v-model="paciente.fechaNacimiento" type="date" />
    </div>

    <div>
      <label>Sexo:</label>
      <select v-model="paciente.sexo">
        <option value="">Seleccione...</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
    </div>

    <div>
      <label>Teléfono:</label>
      <input v-model="paciente.telefono" type="text" />
    </div>

    <div>
      <label>Correo:</label>
      <input v-model="paciente.correo" type="email" />
    </div>

    <button type="submit">Registrar</button>
  </form>

  <hr />

  <h3>Pacientes registrados:</h3>
  <table border="1" cellpadding="6">
    <thead>
      <tr>
        <th>Cédula</th>
        <th>Nombre</th>
        <th>Sexo</th>
        <th>Teléfono</th>
        <th>Correo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, i) in pacientes" :key="i">
        <td>{{ p.cedula }}</td>
        <td>{{ p.nombre }}</td>
        <td>{{ p.sexo }}</td>
        <td>{{ p.telefono }}</td>
        <td>{{ p.correo }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      paciente: {
        cedula: '',
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
        telefono: '',
        correo: ''
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
        cedula: '',
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
        telefono: '',
        correo: ''
      }
    }
  }
}
</script>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}
input, select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  margin-top: 10px;
  padding: 8px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #1b5e20;
}
</style>
