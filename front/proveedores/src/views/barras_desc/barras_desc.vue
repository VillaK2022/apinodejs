<template>
    <body v-loading.fullscreen.lock="fullscreenLoading"
        :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
        element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
        <div>
            <span style="font-size: 30px;">Barras principales - Descripción del producto</span>
                <br>

            <el-button @click="info()" type="info">
                Información &nbsp;
                <el-icon><InfoFilled /></el-icon>
            </el-button>
                <br>
                <br>
            <!-- Section de subir, descargar y subir las barras -->
                <section>
                    <div class="row mt-4">
                        <div class="col-lg-4 mb-3">
                                <el-upload class="upload-demo" drag :limit="1" :on-exceed="maximo" :auto-upload="false"
                                    :on-change="cargar_archivo" :before-remove="despues_borrar" accept=".xlsx,.xls">
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        Suelte el archivo aquí o <em>click para subir el archivo</em>
                                    </div>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            xls/xlsx es el formato permitido
                                        </div>
                                    </template>
                                </el-upload>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <el-card style="max-width: 480px">
                                <h4>Descarga el archivo a modificar para realizar los cambios</h4>
                                <br>
                                <br>
                                <br>
                                <el-button @click="exportarexcel()" :icon="Download">Descargar</el-button>
                            </el-card>
                        </div>
                        <div class="col-lg-4 mb-3">
                            <el-card style="max-width: 480px">
                                <h4>Usa el boton subir para guardar los cambios del archivo seleccionado</h4>
                                <span style="font-size: 20px; color: rgb(99, 100, 102)" v-if="!inputs.excelData.length">(Debes subir un archivo valido primero)</span>
                                <span style="font-size: 20px; color: rgb(0, 152, 131)" v-if="!!inputs.excelData.length">(Listo para subir)</span>
                        
                                <br>
                                <br>
                                <el-button :icon="UploadFilled" @click="subir()">Subir</el-button>
                            </el-card>
                        </div>
                    </div>
                </section>
            <!--Fin  -->

            <!-- Modal de barras invalidas -->
                <section>
                    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" v-model="modalinvalidos"
                        title="Revisa estas barras" width="700" align-center>
                        <el-table show-overflow-tooltip :flexible="true"
                            :header-cell-style="{ background: 'rgb(0, 152, 131)', color: '#fff' }"
                            :row-style="{ 'font-size': '11px' }" max-height="300" :data="inputs.invalidados">
                            <el-table-column prop="Barra" label="Barra" />
                            <el-table-column prop="Descripcion" label="Descripcion" />
                            <el-table-column prop="error" label="Detalle" />
                        </el-table>
                        <!-- <span>{{ inputs.invalidados }}</span> -->

                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="modalinvalidos = false">Cerrar</el-button>
                            </div>
                        </template>
                    </el-dialog>

                </section>
            <!--Fin  -->

            <!-- Modal de información -->
                <section>
                    <el-dialog id="modal_infor" v-model="info_modal" title="Información" width="400" destroy-on-close center :close-on-click-modal = "false">
                        <strong>
                            Información: 
                        </strong> 
                        <span>
                        </span>Puedes descargar un excel y subir todos las barras asociadas a tus productos, marcarla como princial y agregar una descripción del mismo.
                        <div class="mt-4">
                            <strong>Importante: </strong>
                                <span>
                                        Descargar y usar el formato de excel de ejemplo
                                </span>
                        </div>
                        <template #footer>
                        <div class="dialog-footer">
                            <el-button type="primary" @click="info_modal = false">
                            Ok
                            </el-button>
                        </div>
                        </template>
                    </el-dialog>
                </section>
            <!--Fin  -->

        </div>
    </body>
</template>
<script setup>
    ///////////////////////////////////////////////////
    ///////////////// Import
    ///////////////////////////////////////////////////
        import * as XLSX from 'xlsx';
        import { UploadFilled } from '@element-plus/icons-vue'
        import { ref, onMounted, reactive, inject, computed, nextTick, h } from 'vue';
        import { ElMessage } from 'element-plus';
        import moment from 'moment';
        import axios from 'axios';
        import { Delete, Edit, Search, Share, Upload, Download } from '@element-plus/icons-vue'
    ///////////////////////////////////////////////////
    ///////////////// Const
    ///////////////////////////////////////////////////
        const fullscreenLoading = ref(false);
        const loading_msg = ref(null);
        const emit = defineEmits(['change-window', 'notification', 'swal']);
        const excelData = ref([]);
        const modalinvalidos = ref(false)
        const info_modal = ref(false)
        const inputs = reactive({
            excelData: [],
            invalidados: []
        })
    ///////////////////////////////////////////////////
    ///////////////// Funciones
    ///////////////////////////////////////////////////
    const cargar_archivo = (file, fileList) => {
        // El 'file' contiene el objeto de archivo, incluyendo raw
        const rawFile = file.raw;

        // Verificamos si realmente hay un archivo (puede ser llamado al borrar también)
        if (!rawFile) {
            inputs.excelData = []; // Limpiar si no hay archivo
            return;
        }

        // Opcional: Verificar el tipo de archivo nuevamente
        const isExcel = rawFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || rawFile.type === 'application/vnd.ms-excel';

        if (!isExcel) {
            ElMessage.error('.xlsx/.xls son los formatos permitidos');
            // Aquí podrías querer eliminar el archivo de la lista si no es válido
            fileList.pop();
            return;
        }

        // Leemos el archivo usando FileReader
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Asumimos que queremos leer la primera hoja
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertimos los datos de la hoja a un array de objetos JSON
            const json = XLSX.utils.sheet_to_json(worksheet);

            // Almacenamos los datos
            inputs.excelData = json;
            // console.log(inputs.excelData.length, ' valor');

            // console.log('Datos de Excel cargados:', json);
            emit('notification', `Falta subir los datos`, 'success', `¡Archivo "${rawFile.name}" cargado con éxito!`);
        };

        // Leer el archivo como un ArrayBuffer
        reader.readAsArrayBuffer(rawFile);
    };
    // La función maximo que ya tenías
    const maximo = (files) => {
        emit('notification', `El límite es 1 archivo. Seleccionaste ${files.length} archivo(s) más.`, 'warning', 'Revisar');
    };
    const despues_borrar = () => {
        inputs.excelData = [];
    }
    const subir = async () => {
            if (fullscreenLoading.value) return;
            fullscreenLoading.value = true;
            // Primero validar que exista el arreglo con datos
            if (!inputs.excelData || !Array.isArray(inputs.excelData) || inputs.excelData.length === 0) {
                emit('notification', 'Revisar o subir un archivo valido', 'warning', 'Revisar');
                fullscreenLoading.value = false;
                return;
            }
        try {
            const value = {
                params: {
                    item: inputs.excelData,
                    _t: new Date().getTime()
                }
            }
            const act = await axios.put(`/actualizar_mcodigobarra_cod_tercero_desc`, value);
            fullscreenLoading.value = false;
            // console.log(act.data.invalidos, 'inva');
            emit('notification', '🥳', 'success', 'Barras agregadas como principal');
            if (act.data.invalidos.length) {
                inputs.invalidados = act.data.invalidos
                modalinvalidos.value = true;
            }
        } catch (error) {
            fullscreenLoading.value = false;
            emit('notification', '❌', 'warning', 'No fue posible agregar barra como principal');
        }
    }
    const exportarexcel = async () => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        const fechaactual = ref(moment().format('lll'));
        try {
            const response = await axios.post(`/excel_barras_desc`, {
                fecha: fechaactual.value,
                titulo: 'EXCEL_BARRAS',
            }, {
                responseType: 'blob' // Indicar que esperamos un blob (archivo binario)
            });

            // Crear un enlace temporal para descargar el blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'EXCEL_BARRAS.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            fullscreenLoading.value = false;
        } catch (error) {
            fullscreenLoading.value = false;
            console.warn('Error al cargar datos:', error)
            // El servidor respondió con un código de error
            if (error.response && error.response.status === 300) {
                // Nota: El servidor ya no envía 300, así que esto no debería ocurrir.
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else if (error.response && error.response.status === 404) {
                let msg = (error.response.data?.message || 'Revisar ')
                emit('notification', msg, 'info', 'No se encontraron datos con los filtros');
            } else if (error.response && error.response.status === 500) {
                let msg = 'Error interno del servidor'
                emit('notification', msg, 'warning', 'Error interno del servidor');
            } else if (error.response && error.response.status === 400) {
                let msg = 'Intenta nuevamente en unos minutos'
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else {
                let msg = error.response?.data?.message || 'Error'
                emit('notification', msg, 'warning', 'Error');
            }
        }
    }
    const info = async () => {
        info_modal.value = true
    }
</script>
