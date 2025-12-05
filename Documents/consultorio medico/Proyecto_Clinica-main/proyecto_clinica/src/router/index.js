import { createRouter, createWebHistory } from 'vue-router'

// Vistas existentes
import HomeView from '../views/HomeView.vue'
import PacientesView from '../views/PacientesView.vue'
import AgendaView from '../views/AgendaView.vue'
import DoctoresView from '../views/DoctoresView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import ServiciosView from '../views/ServiciosView.vue'

// Vistas nuevas de Autenticación
import LoginView from '../views/LoginView.vue'
import RegistroUsuarioView from '../views/RegistroUsuarioView.vue'

const routes = [
  // --- RUTA PÚBLICA (LOGIN) ---

  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { hideLayout: true }
  },
  // CAMBIO AQUÍ: Movemos el registro a público y le quitamos el sidebar
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroUsuarioView,
    meta: { hideLayout: true } // Importante: Sin sidebar
  },

  // --- RUTAS PROTEGIDAS (Requieren Login) ---
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes',
    component: PacientesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda',
    component: AgendaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctores',
    component: DoctoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendario',
    component: CalendarioView,
    meta: { requiresAuth: true }
  },
  {
    path: '/servicios',
    component: ServiciosView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- GUARDIA DE NAVEGACIÓN (Seguridad) ---
router.beforeEach((to, from, next) => {
  // Verificamos si hay token guardado
  const token = localStorage.getItem('token');

  // Si la ruta requiere autorización y NO hay token
  if (to.meta.requiresAuth && !token) {
    next('/login'); // Redirigir al login
  }
  // Si intenta ir al login PERO YA TIENE token
  else if (to.path === '/login' && token) {
    next('/'); // Redirigir al inicio
  }
  else {
    next(); // Continuar normal
  }
});

export default router
