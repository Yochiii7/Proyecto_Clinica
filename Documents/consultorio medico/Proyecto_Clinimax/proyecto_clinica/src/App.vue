<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-layout">
    <aside class="sidebar-nav">
      <div class="logo-container">
        
        <span class="clinic-name">CLinimax</span>
      </div>

      <nav class="main-nav">
        <RouterLink to="/" class="nav-item">
          <span class="icon">🏠</span> Inicio
        </RouterLink>
        <RouterLink to="/agenda" class="nav-item">
          <span class="icon">📅</span> Agenda Médica
        </RouterLink>
        <RouterLink to="/citas" class="nav-item">
          <span class="icon">📋</span> Citas
        </RouterLink>
        <RouterLink to="/pacientes" class="nav-item">
          <span class="icon">🧑‍🤝‍🧑</span> Pacientes
        </RouterLink>
        <RouterLink to="/medicos" class="nav-item">
          <span class="icon">👨‍⚕️</span> Médicos
        </RouterLink>
        <RouterLink to="/servicios" class="nav-item">
          <span class="icon">💉</span> Servicios
        </RouterLink>
        <RouterLink to="/calendario" class="nav-item">
          <span class="icon">🗓️</span> Calendario
        </RouterLink>
        <hr class="nav-separator">
        <RouterLink to="/about" class="nav-item">
          <span class="icon">ℹ️</span> Acerca de
        </RouterLink>
      </nav>
    </aside>

    <div class="content-wrapper">
      <header class="main-header">
        <h1 class="header-title">Panel de Administración de la Clínica</h1>
        <div class="user-info">
          <span class="user-name">User</span>
          <!--<span class="user-name">Dr. Pérez</span>
          <img src="https://via.placeholder.com/40" alt="Avatar" class="user-avatar">-->
        </div>
      </header>

      <main class="content-view">
        <RouterView />

        <div class="quick-links-panel">
          <h3>Accesos Rápidos</h3>
          <div class="link-grid">
            <RouterLink to="/citas" class="quick-link-btn primary-bg">
              Nueva Cita
            </RouterLink>
            <RouterLink to="/pacientes" class="quick-link-btn secondary-bg">
              Nuevo Paciente
            </RouterLink>
            <RouterLink to="/agenda" class="quick-link-btn tertiary-bg">
              Ver Hoy
            </RouterLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* ========================================================= */
/* 🎨 ESTILOS GENERALES Y VARIABLES (Tema Limpio Médico) */
/* ========================================================= */
:root {
  --primary-color: #1a73e8; /* Azul profesional y confiable */
  --primary-light: #e8f0fe;
  --secondary-color: #00bcd4; /* Cian para acentos o éxito */
  --tertiary-color: #ff9800; /* Naranja suave para warnings/atención */
  --background-color: #f7f9fc; /* Fondo muy claro y profesional */
  --text-color: #3c4043; /* Gris oscuro para legibilidad */
  --text-light: #ffffff;
  --sidebar-width: 250px;
  --header-height: 60px;
  --border-radius: 8px;
  --shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

body {
  margin: 0;
  font-family: 'Roboto', 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

/* ========================================================= */
/* 🏠 LAYOUT PRINCIPAL (Flexbox para Sidebar y Contenido) */
/* ========================================================= */
#app-layout {
  display: flex;
  min-height: 100vh;
}

/* 🧭 BARRA LATERAL (SIDEBAR) */
.sidebar-nav {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: var(--text-light); /* Fondo blanco */
  box-shadow: var(--shadow-medium);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh; /* Ocupa toda la altura */
}

/* Logo en Sidebar */
.logo-container {
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1.5rem 1.5rem; /* Padding inferior para separarlo del menú */
  border-bottom: 1px solid var(--primary-light);
  margin-bottom: 1rem;
}

.logo-icon-wrapper {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  margin-right: 0.5rem;
  line-height: 0;
}

.logo-icon {
  color: var(--text-light);
}

.clinic-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* Navegación Principal */
.main-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 1rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-item .icon {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.nav-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

/* Enlace activo */
.nav-item.router-link-exact-active {
  background-color: var(--primary-color);
  color: var(--text-light);
  font-weight: 600;
  box-shadow: var(--shadow-light);
}

.nav-item.router-link-exact-active .icon {
  filter: grayscale(1) brightness(20); /* Asegura que el emoji se vea bien sobre fondo azul */
}

.nav-separator {
  border: 0;
  height: 1px;
  background-color: var(--primary-light);
  margin: 1rem 0;
}

/* ========================================================= */
/* 📦 CONTENIDO PRINCIPAL Y HEADER SUPERIOR */
/* ========================================================= */
.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Header Superior (dentro del content-wrapper) */
.main-header {
  height: var(--header-height);
  background-color: var(--text-light);
  box-shadow: var(--shadow-light);
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 990;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 500;
  color: var(--primary-color);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

/* Área de Vistas (donde se renderiza RouterView) */
.content-view {
  flex-grow: 1;
  padding: 2rem;
}

/* ⚡ Panel de Enlaces Rápidos */
.quick-links-panel {
  margin-top: 2rem;
  background-color: var(--text-light);
  box-shadow: var(--shadow-light);
  padding: 1.5rem;
  border-radius: var(--border-radius);
}

.quick-links-panel h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.quick-link-btn {
  color: var(--text-light);
  text-decoration: none;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
}

.quick-link-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Clases de colores para los botones */
.primary-bg {
  background-color: var(--primary-color);
}
.secondary-bg {
  background-color: var(--secondary-color);
}
.tertiary-bg {
  background-color: var(--tertiary-color);
}


/* ========================================================= */
/* 📱 MEDIA QUERIES (Responsivo) */
/* ========================================================= */

@media (max-width: 1024px) {
  .sidebar-nav {
    width: 200px;
    min-width: 200px;
  }
  .content-view {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  /* Oculta la sidebar y mueve la navegación a la parte superior (opcionalmente oculta con un menú hamburguesa) */
  .sidebar-nav {
    display: none; /* Simplificamos para el móvil */
  }

  #app-layout {
    flex-direction: column;
  }

  .main-header {
    height: auto;
    padding: 1rem 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .user-info {
    justify-content: space-between;
    width: 100%;
  }

  .content-view {
    padding: 1rem;
  }

  .link-grid {
    grid-template-columns: 1fr; /* Una columna en móvil */
  }
}
</style>

