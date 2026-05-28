import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/addURL.vue'
import list from '../pages/URLlist.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/URLlist',
    component: list
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router