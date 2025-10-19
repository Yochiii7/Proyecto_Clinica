<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-layout">
    <header class="main-header">
      <div class="logo-container">
        <!-- He reemplazado el logo de Vue por un SVG simple de una cruz médica -->
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span class="clinic-name">Clínica Bienestar</span>
      </div>

      <nav class="main-nav">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/pacientes">Registro de Pacientes</RouterLink>
        <RouterLink to="/citas">Citas</RouterLink>
        <RouterLink to="/agenda">Agenda Médica</RouterLink>
        <RouterLink to="/medicos">Médicos</RouterLink>
        <RouterLink to="/servicios">Servicios</RouterLink>
        <RouterLink to="/doctores">Doctores</RouterLink>
        <RouterLink to="/calendario">Calendario</RouterLink>
        <RouterLink to="/about">Acerca de</RouterLink>
      </nav>
    </header>

    <main class="content-view">
      <!-- Aquí se renderizan las vistas del router -->
      <RouterView />

      <!-- 🔹 Botones rápidos del Dashboard -->
      <div class="dashboard-buttons">
        <h2>Panel de Navegación Rápida</h2>
        <div class="button-grid">
          <RouterLink to="/agenda" class="dash-btn">📅 Ir a Agenda Médica</RouterLink>
          <RouterLink to="/doctores" class="dash-btn">👨‍⚕️ Ver Doctores</RouterLink>
          <RouterLink to="/calendario" class="dash-btn">🗓️ Abrir Calendario</RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* 🎨 Estilos Globales */
:root {
  --primary-color: #007bff; /* Azul primario */
  --secondary-color: #6c757d; /* Gris secundario */
  --background-color: #f4f7f6; /* Fondo claro tipo dashboard */
  --header-background: #ffffff; /* Fondo del header */
  --text-color: #333;
  --text-light: #f8f9fa;
  --border-color: #dee2e6;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 🧭 Estilos del Header y Navegación */
.main-header {
  background-color: var(--header-background);
  box-shadow: var(--shadow);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  color: var(--primary-color);
}

.clinic-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: var(--secondary-color);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.main-nav a:hover {
  color: var(--primary-color);
}

.main-nav a:hover::after {
  width: 100%;
}

/* Enlace activo */
.main-nav a.router-link-exact-active {
  color: var(--primary-color);
  font-weight: 700;
}
.main-nav a.router-link-exact-active::after {
  width: 100%;
}

/* 📦 Contenido principal */
.content-view {
  flex-grow: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

/* 🧩 Dashboard de botones */
.dashboard-buttons {
  margin-top: 2rem;
  background-color: white;
  box-shadow: var(--shadow);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.dashboard-buttons h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.dash-btn {
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s;
  display: inline-block;
}

.dash-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .main-nav {
    gap: 1rem;
    font-size: 0.9rem;
  }
  .button-grid {
    flex-direction: column;
  }
  .dash-btn {
    width: 100%;
  }
}
</style>
