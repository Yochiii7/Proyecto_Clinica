<template>
  <div class="auth-container">
    <div class="auth-card">

      <div class="auth-header">
        <h1>📝 Registro</h1>
        <p>Crea tu cuenta en Bienestar</p>
      </div>

      <div v-if="mensaje" :class="['alert-box', exito ? 'alert-success' : 'alert-error']">
        {{ mensaje }}
      </div>

      <form @submit.prevent="registrarUsuario" class="auth-form">
        <div class="form-group">
          <label for="nombre">Nombre Completo</label>
          <input
            id="nombre"
            v-model="form.nombre"
            type="text"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div class="form-group">
          <label for="usuario">Usuario (Login)</label>
          <input
            id="usuario"
            v-model="form.usuario"
            type="text"
            placeholder="Ej. jperez23"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="juan@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.clave"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
        </button>

        <div class="auth-footer">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mensaje = ref('');
const exito = ref(false);
const loading = ref(false);

const form = reactive({
  nombre: '',
  usuario: '',
  email: '',
  clave: '',
  cargo: 'M' // Valor por defecto
});

const registrarUsuario = async () => {
  loading.value = true;
  mensaje.value = '';

  try {
    const res = await fetch('http://localhost:3000/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      exito.value = true;
      mensaje.value = '¡Cuenta creada con éxito! Redirigiendo...';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      exito.value = false;
      mensaje.value = data.mensaje || 'Error al crear usuario';
    }
  } catch (error) {
    console.error(error);
    exito.value = false;
    mensaje.value = 'Error de conexión con el servidor';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Contenedor principal para centrar la tarjeta */
.auth-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* El padding ayuda en dispositivos móviles */
  padding: 1rem;
}

/* Tarjeta blanca con sombra */
.auth-card {
  background: white;
  width: 100%;
  max-width: 420px; /* Ancho máximo elegante */
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); /* Sombra suave y moderna */
}

/* Encabezado */
.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.8rem;
  color: #1a73e8; /* Tu color primario */
  margin: 0 0 0.5rem 0;
}

.auth-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

/* Inputs y Labels */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box; /* Crucial para que no se salga del contenedor */
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

/* Botón Principal */
.btn-primary {
  width: 100%;
  padding: 0.85rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background-color: #1557b0;
}

.btn-primary:disabled {
  background-color: #a0c1ed;
  cursor: not-allowed;
}

/* Alertas */
.alert-box {
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.alert-success {
  background-color: #e6f4ea;
  color: #1e8e3e;
  border: 1px solid #ceead6;
}

.alert-error {
  background-color: #feefc3; /* Un tono amarillo/alerta suave */
  color: #b06000;
  border: 1px solid #f9e298;
}

/* Pie de tarjeta (Links) */
.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.auth-footer a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
