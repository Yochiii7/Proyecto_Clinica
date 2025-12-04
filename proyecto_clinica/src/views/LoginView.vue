<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-area">
        <h1>🏥 Bienestar</h1>
        <p>Inicie sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Usuario</label>
          <input
            v-model="credenciales.usuario"
            type="text"
            placeholder="Ingrese su usuario"
            required
            autofocus
          />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input
            v-model="credenciales.clave"
            type="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <div v-if="errorMsg" class="error-alert">
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>

        <div class="register-link">
        <p>¿No tienes cuenta?
          <router-link to="/registro">Regístrate aquí</router-link>
        </p>
      </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMsg = ref('');

const credenciales = reactive({
  usuario: '',
  clave: ''
});

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    });

    const data = await res.json();

    if (res.ok) {
      // Guardar token y datos en LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirigir al inicio
      router.push('/');
    } else {
      errorMsg.value = data.mensaje || 'Error de credenciales';
    }
  } catch (error) {
  console.error(error); // 👈 Esto soluciona el error de "unused-vars"
  errorMsg.value = 'Error de conexión con el servidor'; // 👈 Usa errorMsg, no mensaje
} finally {
  loading.value = false;
}
};
</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
}
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.logo-area {
  text-align: center;
  margin-bottom: 2rem;
}
.logo-area h1 {
  color: #1a73e8; /* Tu variable primary-color */
  margin: 0;
}
.input-group {
  margin-bottom: 1.2rem;
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}
.input-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box; /* Importante para que no se salga */
}
.login-btn {
  width: 100%;
  padding: 0.9rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.login-btn:hover {
  background-color: #1557b0;
}
.error-alert {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
