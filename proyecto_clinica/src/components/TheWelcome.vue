<script setup>
import WelcomeItem from './WelcomeItem.vue'
// Mantiene el nombre original del archivo .vue, pero usa tu nuevo nombre de variable
import HistorialIcon from './icons/IconDocumentation.vue' // Archivo ORIGINAL
import CitaIcon from './icons/IconTooling.vue'           // Archivo ORIGINAL
import EspecialidadIcon from './icons/IconEcosystem.vue' // Archivo ORIGINAL
import ContactoIcon from './icons/IconCommunity.vue'    // Archivo ORIGINAL
import DonacionIcon from './icons/IconSupport.vue'      // Archivo ORIGINAL

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <HistorialIcon />
    </template>
    <template #heading>Mi Historial Clínico</template>

    Consulte su
    <a href="/historial" target="_blank" rel="noopener">historial médico completo</a>
    y acceda a los resultados de sus últimas pruebas de laboratorio.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CitaIcon />
    </template>
    <template #heading>Reservar Cita</template>

    Utilice nuestro sistema de
    <a href="/reservar-cita" target="_blank" rel="noopener">reservas en línea</a>. El
    método recomendado es seleccionar la
    <a href="/especialistas" target="_blank" rel="noopener">especialidad</a>
    +
    <a href="/horarios" target="_blank" rel="noopener">horario disponible</a>. Si
    necesita una cita de urgencia o
    <a href="/telemedicina" target="_blank" rel="noopener">telemedicina</a>,
    consulte la sección de
    <a href="/urgencias" target="_blank" rel="noopener">Urgencias</a>
    y
    <a href="/videoconsulta" target="_blank" rel="noopener">Videoconsulta</a>.

    <br />

    Más información sobre nuestros procedimientos está disponible en
    <a href="javascript:void(0)" @click="openReadmeInEditor"><code>GuíaDelPaciente.pdf</code></a
    >.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EspecialidadIcon />
    </template>
    <template #heading>Especialidades</template>

    Encuentre a los mejores profesionales en:
    <a href="/cardiologia" target="_blank" rel="noopener">Cardiología</a>,
    <a href="/pediatria" target="_blank" rel="noopener">Pediatría</a>,
    <a href="/dermatologia" target="_blank" rel="noopener">Dermatología</a>, y
    <a href="/nutricion" target="_blank" rel="noopener">Nutrición</a>. Si
    busca más servicios, le sugerimos visitar nuestro
    <a href="/catalogo-servicios" target="_blank" rel="noopener">Catálogo Completo</a>
    de servicios.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ContactoIcon />
    </template>
    <template #heading>Contacto y Ayuda</template>

    ¿Tiene dudas? Pregunte en nuestra
    <a href="/chat-medico" target="_blank" rel="noopener">línea de chat 24/7</a>
    (nuestro canal oficial de soporte), o consulte
    <a href="/preguntas-frecuentes" target="_blank" rel="noopener"
      >Preguntas Frecuentes</a
    >. También puede seguir nuestra
    <a href="https://instagram.com/clinica_salud" target="_blank" rel="noopener">cuenta de Instagram</a>
    o el
    <a href="https://x.com/clinica_salud" target="_blank" rel="noopener">perfil de X</a>
    para las últimas noticias de salud.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <DonacionIcon />
    </template>
    <template #heading>Apoyar a la Clínica</template>

    Como proyecto independiente y sin fines de lucro, su clínica depende del apoyo de la comunidad. Puede ayudarnos
    <a href="/hacer-donacion" target="_blank" rel="noopener">haciendo una donación</a>.
  </WelcomeItem>
</template>
