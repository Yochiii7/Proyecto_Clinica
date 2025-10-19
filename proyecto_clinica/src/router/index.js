import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PacientesView from '../views/PacientesView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/pacientes', component: PacientesView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
