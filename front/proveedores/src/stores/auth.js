import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // Obtener datos del localStorage de forma segura
  const getStoredToken = () => {
    try {
      return localStorage.getItem('authToken') || ''
    } catch (error) {
      console.error('Error al obtener token:', error)
      return ''
    }
  }

  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem('userData')
      // Verificar que no sea null, undefined, o el string 'null'
      if (userData && userData !== 'null' && userData !== 'undefined') {
        return JSON.parse(userData)
      }
      return null
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error)
      // Limpiar datos corruptos
      localStorage.removeItem('userData')
      return null
    }
  }

  const token = ref(getStoredToken())
  const user = ref(getStoredUser())
  const isAuthenticated = computed(() => !!token.value)
  const router = useRouter()

  // ================== CÓDIGO NUEVO PARA CIERRE AUTOMÁTICO ==================

  // Configuración de tiempos (puedes ajustarlos)
  const INACTIVITY_TIMEOUT = 516130 * 60 * 1000 // 30 minutos de inactividad
  const TOKEN_CHECK_INTERVAL = 432425 * 60 * 1000 // Verificar token cada 5 minutos

  // Timers y variables de control
  let inactivityTimer = null
  let tokenCheckTimer = null
  let lastActivityTime = Date.now()

  // Reiniciar el timer de inactividad cuando hay actividad
  const resetInactivityTimer = () => {
    if (!isAuthenticated.value) return

    lastActivityTime = Date.now()
    clearTimeout(inactivityTimer)

    inactivityTimer = setTimeout(() => {
      console.log('Cerrando sesión por inactividad...')
      autoLogout('inactivity')
    }, INACTIVITY_TIMEOUT)
  }

  // Detectar actividad del usuario
  const setupActivityListeners = () => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true })
    })
  }

  // Remover listeners de actividad
  const removeActivityListeners = () => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    activityEvents.forEach(event => {
      document.removeEventListener(event, resetInactivityTimer)
    })
  }

  // Cierre automático de sesión
  const autoLogout = (reason = 'auto') => {
    console.log(`Cierre automático de sesión por: ${reason}`)

    // Mostrar mensaje al usuario (opcional)
    if (reason === 'inactivity' && typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Tu sesión ha caducado por inactividad',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      })
    }

    logout()

    // Redirigir al login si estamos en una ruta protegida
    if (window.location.pathname !== '/') {
      window.location.href = '/?razón=' + reason
    }
  }

  // Verificar periodicamente el token con el backend
  const startTokenValidation = () => {
    if (!isAuthenticated.value) return

    tokenCheckTimer = setInterval(async () => {
      try {
        const isValid = await checkAuth()
        if (!isValid) {
          autoLogout('invalid_token')
        }
      } catch (error) {
        console.error('Error en validación periódica:', error)
      }
    }, TOKEN_CHECK_INTERVAL)
  }

  // Verificar expiración al cargar la página
  const checkInitialExpiration = () => {
    if (!isAuthenticated.value) return

    const loginTime = localStorage.getItem('loginTime')
    if (loginTime) {
      const timeSinceLogin = Date.now() - parseInt(loginTime)

      // Si ya pasó el tiempo de inactividad, cerrar sesión
      if (timeSinceLogin > INACTIVITY_TIMEOUT) {
        autoLogout('initial_check')
      } else {
        // Configurar timer con el tiempo restante
        const remainingTime = INACTIVITY_TIMEOUT - timeSinceLogin
        inactivityTimer = setTimeout(() => autoLogout('inactivity'), remainingTime)
      }
    }
  }

  // ================== FUNCIONES ORIGINALES MODIFICADAS ==================

  const setAuth = (newToken, userData) => {
    try {
      token.value = newToken
      user.value = userData

      // Guardar en localStorage de forma segura
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('loginTime', Date.now().toString()) // Guardar tiempo de login

      // Configurar axios para incluir el token en todas las requests
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      }

      // Iniciar sistemas de cierre automático
      resetInactivityTimer()
      setupActivityListeners()
      startTokenValidation()

      // console.log('Sesión iniciada y timers configurados')

    } catch (error) {
      console.error('Error al guardar autenticación:', error)
    }
  }

  const logout = () => {
    try {
      token.value = ''
      user.value = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('loginTime')
      delete axios.defaults.headers.common['Authorization']

      // Limpiar todos los timers y listeners
      clearTimeout(inactivityTimer)
      clearInterval(tokenCheckTimer)
      removeActivityListeners()
      router.push("/");
      // console.log('Sesión cerrada correctamente')

    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Verificar si el token es válido
  const checkAuth = async () => {
    if (!token.value) return false

    try {
      // Ajusta esta URL según tu backend
      const response = await axios.get('/verify-token')
      return response.data.valid
    } catch (error) {
      console.error('Error verificando token:', error)
      return false
    }
  }

  // Función para extender sesión manualmente (desde componentes)
  const extendSession = () => {
    if (isAuthenticated.value) {
      resetInactivityTimer()
      console.log('Sesión extendida por actividad del usuario')
    }
  }

  // ================== INICIALIZACIÓN ==================

  // Inicializar axios con el token si existe
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

    // Iniciar sistemas de cierre automático si hay sesión activa
    checkInitialExpiration()
    setupActivityListeners()
    startTokenValidation()
  }

  // Limpiar recursos cuando el store sea destruido
  onUnmounted(() => {
    clearTimeout(inactivityTimer)
    clearInterval(tokenCheckTimer)
    removeActivityListeners()
  })

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout,
    checkAuth,
    extendSession, // Nueva función exportada
    resetInactivityTimer // Para uso externo
  }
})