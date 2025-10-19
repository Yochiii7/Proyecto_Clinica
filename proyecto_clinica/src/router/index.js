import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PacientesView from '../views/PacientesView.vue'
import RegistroServicios from '../views/RegistroServicios.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/pacientes', component: PacientesView },
  { path: '/servicios', component: RegistroServicios }, // 👈 nueva ruta agregada

]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
