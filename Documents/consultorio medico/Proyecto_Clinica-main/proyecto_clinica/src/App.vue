<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>

<template>
  <div v-if="route.meta.hideLayout" class="auth-layout">
    <RouterView />
  </div>

  <div v-else id="app-layout">

    <header class="top-navbar">
      <div class="navbar-left">
        <div class="logo-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span class="brand-name">Clinimax</span>
        </div>
        <h1 class="page-title-header">Panel de Administración</h1>
      </div>

      <div class="navbar-right">
        <div class="user-profile">
          <img src="https://via.placeholder.com/35" alt="Avatar" class="avatar">
          <span class="username">Admin</span>
        </div>
        <button @click="logout" class="logout-btn" title="Cerrar Sesión">
          <span class="icon">⏻</span> Salir
        </button>
      </div>
    </header>

    <div class="main-container">

      <aside class="sidebar">
        <nav class="nav-menu">
          <RouterLink to="/" class="nav-link">
            <span class="icon">🏠</span> Inicio
          </RouterLink>
          <RouterLink to="/agenda" class="nav-link">
            <span class="icon">📅</span> Agenda
          </RouterLink>
          <RouterLink to="/citas" class="nav-link">
            <span class="icon">📋</span> Citas
          </RouterLink>
          <RouterLink to="/pacientes" class="nav-link">
            <span class="icon">🧑‍🤝‍🧑</span> Pacientes
          </RouterLink>
          <RouterLink to="/doctores" class="nav-link">
            <span class="icon">👨‍⚕️</span> Médicos
          </RouterLink>
          <RouterLink to="/servicios" class="nav-link">
            <span class="icon">💉</span> Servicios
          </RouterLink>

          <div class="nav-divider"></div>

          <RouterLink to="/about" class="nav-link">
            <span class="icon">ℹ️</span> Acerca de
          </RouterLink>
        </nav>
      </aside>

      <main class="content-area">
        <div class="content-centered-wrapper">
          <RouterView />
        </div>
      </main>

    </div>
  </div>
</template>

<style>
/* ================= VARIABLES ================= */
:root {
  --header-height: 64px;
  --sidebar-width: 240px;
  --primary-color: #1a73e8;
  --primary-hover: #1557b0;
  --bg-color: #f0f2f5;
  --sidebar-bg: #ffffff;
  --header-bg: #ffffff;
  --text-color: #333;
  --border-color: #e0e0e0;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* ================= LOGIN LAYOUT ================= */
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* ================= MAIN LAYOUT ================= */

/* 1. TOP NAVBAR (Fija arriba, ancho completo) */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  z-index: 1000; /* Asegura que esté por encima de todo */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.2rem;
}

.page-title-header {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
  margin: 0;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.avatar {
  border-radius: 50%;
  border: 2px solid var(--primary-color);
}

.logout-btn {
  background: none;
  border: 1px solid #ffcccc;
  background-color: #fff5f5;
  color: #d32f2f;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

/* 2. SIDEBAR (Fijo a la izquierda, debajo del header) */
.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #5f6368;
  text-decoration: none;
  border-radius: 0 25px 25px 0; /* Borde redondeado solo a la derecha */
  transition: background 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #f1f3f4;
  color: var(--primary-color);
}

.nav-link.router-link-active {
  background-color: #e8f0fe;
  color: var(--primary-color);
}

.nav-link .icon {
  margin-right: 1rem;
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.nav-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 0.5rem 1rem;
}

/* 3. CONTENT AREA (Desplazado a la derecha y abajo) */
.content-area {
  margin-top: var(--header-height);
  margin-left: var(--sidebar-width);
  padding: 2rem;
  min-height: calc(100vh - var(--header-height));
  box-sizing: border-box;

  /* Centrado del contenido */
  display: flex;
  justify-content: center; /* Centra horizontalmente el wrapper */
  align-items: flex-start; /* Alinea arriba (no verticalmente al centro) */
}

/* Wrapper para limitar el ancho del contenido y que se vea "central" */
.content-centered-wrapper {
  width: 100%;
  max-width: 1200px; /* Ancho máximo para que no se estire demasiado en monitores grandes */
  background: white; /* Opcional: si quieres que parezca una hoja de papel */
  padding: 2rem; /* Espaciado interno */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Sutil sombra */
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  /* En móviles, ocultamos sidebar y ajustamos contenido */
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .content-area {
    margin-left: 0;
    padding: 1rem;
  }

  .navbar-left h1 {
    display: none; /* Ocultar título en móvil */
  }
}
</style>
