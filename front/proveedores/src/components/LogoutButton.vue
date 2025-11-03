<template>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

export default {
    name: 'LogoutButton',
    setup() {
        const authStore = useAuthStore()
        const router = useRouter()

        const confirmLogout = async () => {
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: '¿Estás seguro de que deseas salir?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2a9d8f',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            });
            if (!result.value) return;
            authStore.logout();
            Swal.fire({
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente',
                icon: 'success',
                confirmButtonColor: '#2a9d8f'
            })
            // router.push('/')
        }

        return {
            confirmLogout
        }
    }
}
</script>