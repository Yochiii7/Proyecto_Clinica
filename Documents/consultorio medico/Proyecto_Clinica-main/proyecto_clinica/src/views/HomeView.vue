<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { RouterLink } from 'vue-router' // Necesario para los enlaces rápidos
</script>

<template>
  <div class="dashboard-grid">
    <div class="dashboard-section card-style">
      <h2 class="section-title">Resumen de Hoy</h2>
      <TheWelcome />
    </div>

    <div class="quick-links-panel card-style">
      <h3 class="panel-title">Accesos Rápidos</h3>
      <div class="link-grid">
        <RouterLink to="/citas" class="quick-link-btn primary-bg">
          <span class="icon">➕</span> Agendar Cita
        </RouterLink>
        <RouterLink to="/pacientes" class="quick-link-btn secondary-bg">
          <span class="icon">👤</span> Nuevo Paciente
        </RouterLink>
        <RouterLink to="/agenda" class="quick-link-btn tertiary-bg">
          <span class="icon">👀</span> Ver Agenda de Hoy
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Las variables se heredan de App.vue */
.dashboard-grid {
  display: grid;
  grid-template-columns: 3fr 1fr; /* Una columna más ancha para contenido, otra para accesos */
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.card-style {
  background-color: var(--text-light);
  box-shadow: var(--shadow-light);
  border-radius: var(--border-radius);
}

.dashboard-section {
  padding: 2rem;
}

.section-title {
  color: var(--primary-color);
  margin-top: 0;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* ⚡ Panel de Enlaces Rápidos */
.quick-links-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.panel-title {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
}

.link-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-link-btn {
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-link-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.primary-bg { background-color: var(--primary-color); }
.secondary-bg { background-color: var(--secondary-color); }
.tertiary-bg { background-color: var(--tertiary-color); }

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr; /* Una sola columna en móvil */
  }
}
</style>
