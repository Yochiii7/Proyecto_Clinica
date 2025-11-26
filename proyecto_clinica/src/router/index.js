import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PacientesView from '../views/PacientesView.vue'
import AgendaView from '../views/AgendaView.vue'
import DoctoresView from '../views/DoctoresView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import ServiciosView from '../views/ServiciosView.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/pacientes', component: PacientesView },
  { path: '/servicios', component: ServiciosView }, 
  { path: '/agenda', component: AgendaView }, // 👈 nueva ruta
  { path: '/calendario', component: CalendarioView },
  { path: '/doctores', component: DoctoresView },
  


]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
