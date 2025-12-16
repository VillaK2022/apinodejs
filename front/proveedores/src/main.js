import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import routes from './routes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileExcel, faPlus, faUser, faBars, faHome, faCodeBranch, faEllipsis, faDeleteLeft, faCashRegister, 
faCartArrowDown, faCartShopping, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { faCalendarMinus,faCalendar, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/styles/global.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Bar } from 'vue-chartjs'
import axios from 'axios'
import Es from 'element-plus/es/locale/lang/es'
const router = createRouter({
  history: createWebHistory(),
  routes
});

library.add(faBars, faHome, faCodeBranch, faEllipsis, faTwitter, faFileExcel, faDeleteLeft, faPlus, faUser, faCalendar,
faCalendarMinus, faCashRegister, faEnvelope, faCartArrowDown, faCartShopping, faBarcode);

// GUARDIA DE NAVEGACIÓN - Esto se ejecuta antes de cada cambio de ruta

// Guarda la instancia de la aplicación en una variable
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(ElementPlus, {
    locale: Es,
  })
axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
const apiClient = axios;


// Recorre y registra cada ícono de Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación y el usuario NO está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/') // Redirigir al login
  }
  // Si el usuario está autenticado y trata de ir al login
  else if (to.path === '/' && authStore.isAuthenticated) {
    next('/welcome') // Redirigir al dashboard
  }
  // En cualquier otro caso, permitir el acceso
  else {
    next()
  }
})
// Monta la aplicación al final de todo el registro
app.mount('#app');