<template>
    <div id="contenedor"></div>
    <h1>Pagina no encontrada</h1>
</template>
<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router' // ✅ IMPORTAR ROUTER
    const emit = defineEmits(['change-window', 'notification', 'swal']);
    const emitAsync = (event: string, ...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            // Usar emit normal pero agregando callback como último argumento
            (emit as any)(event, ...args, (response: any, error: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
            })
        })
    }
    const router = useRouter()
    onMounted(async () => {
        await emitAsync('swal', '', 'warning', 'pagina no encontrada');
    })
    // CAMBIAR A LA PAGINA Welcome
    router.push('/datos')
</script>