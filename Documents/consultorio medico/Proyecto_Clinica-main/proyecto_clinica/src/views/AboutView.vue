<template>
  <div class="page-container">
    <h1 class="page-title">ℹ️ Acerca de la Aplicación y la Clínica</h1>
    <div class="main-card about-content">
      <p>Esta es la página de información. Aquí puedes describir la misión de la Clínica Bienestar, el equipo de desarrollo, la versión del sistema, o cualquier otra información relevante.</p>
      <p>El objetivo es proporcionar una herramienta robusta y organizada para la gestión de servicios médicos y pacientes.</p>
      <p class="version-info">Versión 1.0.0 - Desarrollado con Vue 3 y CSS moderno.</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
}

.main-card {
  background-color: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  flex-grow: 1;
}

.version-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--primary-light);
  font-style: italic;
  color: var(--secondary-color);
}
</style>
