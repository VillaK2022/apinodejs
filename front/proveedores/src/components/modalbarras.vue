<template>
    <div v-loading.fullscreen.lock="fullscreenLoading"
            :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
            element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body">
        <el-dialog v-model="modal_codigo" id="modalbarra" title="Barras asociadas" width="40%" center>
            <div v-if="Array.isArray(inputs.item) && inputs.item.length">
                <span style="font-size:13px">{{ inputs.item[0].articulo }}</span>
                <el-table id="tablabarra" :data="inputs.item" style="width:100%" class="mt-4">
                    <el-table-column prop="descripcion" label="Descripción" />
                    <el-table-column prop="barra" label="Barra" />
                    <el-table-column prop="cod_tercero" label="Principal">
                        <template #default="{ row }">
                            <el-popconfirm @confirm="principal(row, inputs.item)" class="box-item"
                                title="¿Agregar este codigo como principal?" placement="bottom">
                                <template #reference>
                                    <el-button :disabled="row.cod_tercero == 1"
                                        :type="row.cod_tercero == 1 ? 'primary' : 'info'" size="small">
                                        {{ row.cod_tercero == 1 ? 'Si' : 'No' }}
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
///////////////////////////////////////////////////
///////////////// Import
///////////////////////////////////////////////////
import { ref, reactive, defineExpose } from 'vue';
import 'moment/locale/es'; // Importa la configuración regional específica
import axios from 'axios';
import { ElNotification } from 'element-plus'
const modal_codigo = ref(false)
const fullscreenLoading = ref(false)
const loading_msg = ref(null)
const inputs = reactive({ item: [] });
const modalBarrasRef = ref(null)
const principal = async (item, array) => {
    if (fullscreenLoading.value) return;
    fullscreenLoading.value = true;
    try {
        const value = {
            params: {
                item: item,
                array: array,
                _t: new Date().getTime()
            }
        }
        await axios.put(`/actualizar_mcodigobarra_cod_tercero`, value);
        array.forEach(e => e.cod_tercero = 0);
        const d = array.find(e => e.id == item.id);
        d.cod_tercero = 1;
        fullscreenLoading.value = false;
        ElNotification({
            title: 'Barra agregada como principal',
            message: '🥳',
            type: 'success',
        })
    } catch (error) {
        fullscreenLoading.value = false;
        ElNotification({
            title: 'No fue posible agregar barra como principal',
            message: '❌',
            type: 'warning',
        })
    }
}
const modalcodigo = async (item) => {
    if (fullscreenLoading.value) return;
    fullscreenLoading.value = true;
    try {
        const value = {
            params: {
                item: item.codigo_producto,
                _t: new Date().getTime()
            }
        };
        const respuesta = await axios.get(`/mbarra_codigo`, value);
        inputs.item = respuesta.data
        modal_codigo.value = true
        fullscreenLoading.value = false;
    } catch (error) {
        fullscreenLoading.value = false;
        console.warn('Error al cargar datos:', error)
        // El servidor respondió con un código de error
        if (error.respuesta && error.respuesta.status === 300) {
            fullscreenLoading.value = false;
            let msg = (error.respuesta.data?.message || 'Error al obtener los datos')
            emit('notification', msg, 'warning', 'Datos faltantes');
        } else if (error.respuesta && error.respuesta.status === 404) {
            fullscreenLoading.value = false;
            let msg = (error.respuesta.data?.message || 'Revisar ')
            emit('notification', msg, 'info', 'No se encontraron datos con los filtros');
        } else if (error.respuesta && error.respuesta.status === 500) {
            let msg = 'Error interno del servidor'
            emit('notification', msg, 'warning', 'Error interno del servidor');
        } else if (error.respuesta && error.respuesta.status === 400) {
            let msg = 'Intenta nuevamente en unos minutos'
            emit('notification', msg, 'warning', 'Datos faltantes');
        } else {
            fullscreenLoading.value = false
            let msg = error.respuesta.data?.message || 'Error'
            emit('notification', msg, 'warning', 'Error');
        }
    }
}
defineExpose({
    modalcodigo,
    modal_codigo,
    inputs,
    modalBarrasRef
});
</script>