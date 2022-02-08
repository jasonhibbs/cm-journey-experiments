import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/demo/',
    },
    {
      path: '/demo',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/demo/sheet',
      name: 'Demo Sheet',
      component: () => import('../views/DemoSheetView.vue'),
    },
    {
      path: '/demo/scooter',
      name: 'Demo Scooter',
      component: () => import('../views/DemoScooterView.vue'),
    },
  ],
})

export default router
