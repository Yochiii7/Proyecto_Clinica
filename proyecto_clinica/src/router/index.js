import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PacientesView from '../views/PacientesView.vue'
import RegistroServicios from '../views/RegistroServicios.vue'
import AgendaView from '../views/AgendaView.vue'
import DoctoresView from '../views/DoctoresView.vue'
import CalendarioView from '../views/CalendarioView.vue'
<<<<<<< HEAD
import ServiciosView from '../views/ServiciosView.vue'
import PaymentsView from '../views/PaymentsView.vue'
=======
>>>>>>> gabriel


const routes = [
  { path: '/', component: HomeView },
  { path: '/pacientes', component: PacientesView },
  { path: '/servicios', component: RegistroServicios }, // 👈 nueva ruta agregada
  { path: '/agenda', component: AgendaView }, // 👈 nueva ruta
  { path: '/calendario', component: CalendarioView },
  { path: '/doctores', component: DoctoresView },



<<<<<<< HEAD
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
  ,
  {
    path: '/payments',
    component: PaymentsView,
    meta: { requiresAuth: true }
  }
=======
>>>>>>> gabriel
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
