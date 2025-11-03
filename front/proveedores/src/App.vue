<template>
  <div id="app" class="m-0 p-0">
    <router-view @change-window="firstCharge()" @notification="notification" @swal="swal" @formatNumber="formatNumber()"></router-view>
  </div>
  <sidebar ref="sideBar" @notification="notification" @swal="swal"></sidebar>
</template>

<script>
import { provide, h } from 'vue'
import { ElNotification } from 'element-plus'
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebar from './components/sidebar.vue';
import datos from './views/datos/datos.vue'
import Swal from 'sweetalert2'
export default {
  name: 'LoginPage',
  mounted() {
    this.firstCharge();
  },
  methods: {
    firstCharge() {
      const path_name = window.location.pathname;
      if (this.$refs.sideBar && this.$refs.sideBar.menuItems) {
        const path = this.$refs.sideBar.menuItems.find(e => e.path == path_name);
        if (path) {
          this.$refs.sideBar.activarMenu(path);
        }
      }
    },
    notification(formData, type, title, position) {
      ElNotification({
        title: title,
        message: h('p', null, [
          h('i', { style: 'color: teal' }, formData),
        ]),
        duration: 5000,
        dangerouslyUseHTMLString: true,
        type: type,
        position: position,
      })
    },
    async swal(formData, type = 'info', title = '', callback) {
      try {
        const alerta = await Swal.fire({
          title: title,
          icon: type,
          text: formData,
          confirmButtonText: 'OK',
          background: '#ffffff',
          color: '#2a9d8f',
          // Agregar algunas configuraciones útiles
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        // Llamar al callback con el resultado
        if (typeof callback === 'function') {
          callback(alerta)
        }
      } catch (error) {
        console.error('Error en manejarNotificacion:', error)
        // Llamar callback con error si es necesario
        if (typeof callback === 'function') {
          callback({ error: error.message })
        }
      }
    },
    

  },
  setup() {
    // Configuración de notificación
    const notificationConfig = {
      duration: 4000,
      position: 'top-right',
      showClose: true
    }

    // Función de notificación
    const showNotification = (title, message, type = 'info') => {
      return ElNotification({
        title,
        message,
        type,
        ...notificationConfig
      })
    }

    const formatNumber = (event) => {
      if (event.target) {
        // formatea valor de inputs
        let val = event.target.value;
        val = val
          .toString()
          .replace( /[^0-9\-]/g, "" )
          .replace(/([0-9])([0-9]{2})$/, `$1,$2`)
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, `.`);
        event.target.value = val;
        return val;
      } else if (event != null) {
        // formatea valores en methods (USO PROGRAMATICO)
        let val = event;
        val = val
          .toString()
          .replace( /[^0-9\-]/g, "" )
          .replace(/([0-9])([0-9]{2})$/, `$1,$2`)
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, `.`);
        event = val;
        return val;
      }
    }
    // Proveer la función globalmente
    provide('showNotification', showNotification)
    provide('formatNumber', formatNumber);
    return {
      showNotification
    }
  },
  components: {
    sidebar,
    datos
  },
}
</script>