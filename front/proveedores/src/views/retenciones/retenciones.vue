<template>
    <body v-loading.fullscreen.lock="fullscreenLoading"
        :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
        element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
        <!-- FILTROS -->
        <span style="font-size: 30px;">Retención</span>
        <br>
        <br>
        <section>
            <div class="row mb-3">
                <div class="col-lg-5 mb-2">
                    <label class="col-12 label-xs">Razón Social</label>
                    <el-input disabled v-model="input1" placeholder="Razon_social" :suffix-icon="Avatar" />
                </div>
                <div class="col-lg-6 col-md-9 mb-2">
                    <label class="col-12 label-xs">Fechas</label>
                    <el-row :gutter="24">
                        <el-col :span="14">
                            <el-date-picker :disabled="table.tableData.length > 0" style="width: 100%" class="w-100"
                                v-model="fecha" type="daterange" start-placeholder="Fecha inicio"
                                end-placeholder="Fecha final" format="DD-MM-YYYY" value-format="DD-MM-YYYY" />
                        </el-col>
                        <el-col :span="3" class="text-right">
                            <el-tooltip content="Buscar" placement="top" effect="light">
                                <el-button class="w-100" type="primary" :icon="Search" @click="buscar_retenciones()" />
                            </el-tooltip>
                        </el-col>
                        <el-col v-if="table.tableData.length > 0" :span="3" class="text-right">
                            <el-tooltip content="Exportar excel" placement="top" effect="light">
                                <el-button class="w-100" type="success" @click="exportar()">
                                    <font-awesome-icon icon="file-excel" />
                                </el-button>
                            </el-tooltip>
                        </el-col>
                        <el-tooltip content="Limpiar" placement="top" effect="light">
                            <el-col  v-if="table.tableData.length > 0" :span="3" class="text-right">
                                    <el-popconfirm :icon="InfoFilled"  
                                    class="box-item"  
                                    @confirm="limpiar"
                                    confirm-button-text="Si"
                                    cancel-button-text="No"
                                    title="¿Seguro desea limpiar los datos?" 
                                    placement="bottom-end">
                                        <template #reference>
                                            <el-button class="w-100" type="danger">
                                                <font-awesome-icon :icon="faDeleteLeft" />
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                            </el-col>
                        </el-tooltip>
                    </el-row>
                </div>
            </div>

        </section>
        <!-- TABLA -->
        <section v-if="table.tableData.length > 0">
            <!-- TABLA DETALLES -->
            <div class="col-lg-12 card p-3">
                <!-- DETALLES -->
                <div class="row">
                    <!-- LISTADO DE LA BUSQUEDA -->
                    <div class="col-lg-2 mb-2">
                        <label class="col-12 label-xs">Paginas</label>
                        <el-select v-model="table.pageSize" size="small">
                            <el-option v-for="item in table.paginas" :key="item" :label="item"
                                :value="item"></el-option>
                        </el-select>
                    </div>
                    <div class="col-lg-8"></div>
                    <div class="col-lg-2 text-end mb-2">
                        <label class="col-12 label-xs">Filtro</label>
                        <el-input size="small" v-model="table.filterTableDetail" placeholder="Filtro"
                            clearable></el-input>
                    </div>
                    <!-- TABLA DE DATOS -->
                    <div class="col-lg-12">
                        <div class="table-responsive card"
                            style="padding: 0 !important; max-height: 45vh !important; font-size: 11px !important;">
                            <table class="table table-sm table-hover mb-0" id="tabla_detalles"
                                style="width: 100% !important; font-size: x-small;">
                                <thead>
                                    <tr style="position: sticky; top: 0;">
                                        <!-- Item -->
                                        <th v-for="(campo_mostrar, idx) in table.campos_mostrar" :key="idx"
                                            :class="'lh-n text-center text-light'"
                                            @click="changeOrderDetail(campo_mostrar.key, !!+campo_mostrar.orderable)"
                                            :style="`text-wrap: nowrap; background-color: ${campo_mostrar.color}; font-size: x-small;` + (!!+campo_mostrar.orderable ? 'cursor: pointer;' : '')"
                                            :width="campo_mostrar.width">
                                            <span>{{ campo_mostrar.name }}</span>
                                            <span
                                                v-if="table.orderByDetail && table.orderByDetail.item == campo_mostrar.key && !!+campo_mostrar.orderable">
                                                <template v-if="table.orderByDetail.order == 'asc'">&nbsp;<el-icon>
                                                        <CaretTop />
                                                    </el-icon></template>
                                                <template v-if="table.orderByDetail.order == 'desc'">&nbsp;<el-icon>
                                                        <CaretBottom />
                                                    </el-icon></template>
                                            </span>
                                            <span
                                                v-if="(!table.orderByDetail || (table.orderByDetail && table.orderByDetail.item !== campo_mostrar.key)) && !!+campo_mostrar.orderable">
                                                &nbsp;<el-icon>
                                                    <DCaret />
                                                </el-icon>
                                            </span>
                                        </th>
                                        <th style="background-color: rgba(0, 152, 131, 1); text-wrap: nowrap; font-size: x-small;"
                                            width="5%"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="!!listRetenPage.length">
                                        <tr v-for="(item, key) in listRetenPage" :key="key">
                                            <!-- Item -->
                                            <td v-for="(campo_mostrar, idx) in table.campos_mostrar" :key="idx"
                                                style="text-wrap: nowrap;" :class="`lh-n text-${campo_mostrar.align}`">
                                                {{ item[campo_mostrar.key] == null ? '-' : (campo_mostrar.numeric ?
                                                    (isNaN(+item[campo_mostrar.key]) ? formatNumber((0).toFixed(2)) :
                                                formatNumber((+item[campo_mostrar.key]).toFixed(2))) :
                                                item[campo_mostrar.key]) }}
                                            </td>
                                            <td class="text-center">
                                                <el-popconfirm class="box-item" title="Exportar PDF" placement="top"
                                                    confirm-button-text="Si" cancel-button-text="No"
                                                    @confirm="exportPdf(item)">
                                                    <template #reference>
                                                        <el-tag type="danger" effect="dark" style="cursor: pointer">
                                                            <el-icon style="font-size: 16px">
                                                                <Printer />
                                                            </el-icon>
                                                        </el-tag>
                                                    </template>
                                                </el-popconfirm>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td :colspan="table.campos_mostrar.length + 1" class="text-center">No hay
                                                detalles para mostrar</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- PAGINADOR -->
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-6 mt-2">
                                <h6>{{ listReten.length == table.tableData.length ? '' : (listReten.length +
                                    (listReten.length == 1 ? 'Articulo filtrado' : ' Articulos filtrados') + ' de ') }}{{ table.tableData.length
                                    }}{{
                                        table.tableData.length == 1 ? ' fila total' : ' filas totales' }}</h6>
                            </div>
                            <div class="col-lg-6" style="display: flex; justify-content: flex-end;">
                                <el-pagination size="small" layout="prev, pager, next" :total="listReten.length"
                                    v-model:current-page="table.currentPage" v-model:page-size="table.pageSize" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- PDF -->
        <section>
            <template v-show="false">
                <ContenidoPDF ref="pdfretencion" />
            </template>
        </section>
    </body>
</template>
<script lang="ts" setup>
///////////////////////////////////////////////////
///////////////// Import
///////////////////////////////////////////////////
import html2pdf from 'html2pdf.js';
import { ref, onMounted, computed, inject, reactive } from 'vue';
import axios from 'axios';
import { Search, Avatar } from '@element-plus/icons-vue'
import ContenidoPDF from '../../pdf/pdfretenciones.vue';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { InfoFilled } from '@element-plus/icons-vue'
import moment from 'moment/moment';
///////////////////////////////////////////////////
///////////////// VARIABLES
///////////////////////////////////////////////////
const formatNumber = inject('formatNumber') as (value: any) => string;
const input1 = ref('');
const datosinicio = JSON.parse(localStorage.getItem('userData'));
const id_proveedor = datosinicio.id_mproveedor
const fechaActual = new Date();
const año = fechaActual.getFullYear();
const mes = fechaActual.getMonth() + 1;
const dia = fechaActual.getDate().toString().padStart(2, '0');
const fechaHace30Dias = new Date(fechaActual);
const diaActual = fechaHace30Dias.getDate();
fechaHace30Dias.setDate(diaActual - 30);
const añoAnterior = fechaHace30Dias.getFullYear(); // RECORDAR QUITAR EL MENOS 5
const mesAnterior = (fechaHace30Dias.getMonth() + 1).toString().padStart(2, '0');
const diaAnterior = fechaHace30Dias.getDate().toString().padStart(2, '0');
fechaHace30Dias.setDate(diaActual - 30);
const fecha = ref([`${diaAnterior}-${mesAnterior}-${añoAnterior}`, `${dia}-${mes}-${año}`]);
const fullscreenLoading = ref(false);
const loading_msg = ref(null);
const pdfretencion = ref<any>(null);
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
const exportar = async () => {
    if (fullscreenLoading.value) return;
    fullscreenLoading.value = true;
    loading_msg.value = "Cargando Datos... Por favor espere";
    const fechaactual = ref(moment().format('lll'));
    try {
        const response = await axios.post(`/excel_retenciones`, {
            datos: table.tableData,
            fecha: fechaactual.value,
            titulo: 'Retenciones',
        }, {
            responseType: 'blob' // Indicar que esperamos un blob (archivo binario)
        });

        // Crear un enlace temporal para descargar el blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Retenciones.xlsx'); // Nombre del archivo
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
// -- VARIABLES DATA TABLE
const table = reactive({
    tableData: [],
    orderByDetail: null,
    filterTableDetail: null,
    pageSize: 10,
    currentPage: 1,
    campos_mostrar: [
        { id: 1, name: '#', key: 'nro_fila', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
        { id: 2, name: 'Factura', key: 'factura_num', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
        { id: 3, name: 'Control', key: 'nro_control', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
        { id: 4, name: 'F.Recepción', key: 'fecha', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "center", numeric: false, orderable: true },
        { id: 5, name: 'F.Emisión', key: 'fecha_emision', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "center", numeric: false, orderable: true },
        { id: 6, name: 'Subtotal', key: 'subtotal', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        { id: 7, name: 'Impuesto', key: 'impuesto', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        { id: 8, name: 'Retencion', key: 'retencion', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        { id: 9, name: 'Total', key: 'total', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
    ],
    paginas: [10, 50, 100, 500]
});
///////////////////////////////////////////////////
///////////////// COMPUTADAS
///////////////////////////////////////////////////
const listReten = computed(() => {
    if (!listRetenWoutFilter.value.length) return [];
    let data = [...listRetenWoutFilter.value.map(e => { return { ...e } })];
    if (!!table.filterTableDetail) data = data.filter(e => e.data.toLowerCase().trim().indexOf(table.filterTableDetail.toLowerCase().trim()) > -1);
    if (!!table.orderByDetail && table.orderByDetail.order == 'asc') {
        data = data.sort((a, b) => a[table.orderByDetail.item].toString().localeCompare(b[table.orderByDetail.item], 'es', { numeric: true }));
    } else if (!!table.orderByDetail && table.orderByDetail.order == 'desc') {
        data = data.sort((a, b) => b[table.orderByDetail.item].toString().localeCompare(a[table.orderByDetail.item], 'es', { numeric: true }));
    }
    return data;
})
const listRetenWoutFilter = computed(() => {
    if (!table.tableData.length) return [];
    const resultados = table.tableData.map((e, i) => {
        // VARIABLES
        const index = i;
        const nro_fila = index + 1;
        const id = e.id ? e.id : null;
        const factura_num = e.factura_num ? e.factura_num : null;
        const nro_control = e.nro_control ? e.nro_control : null;
        const fecha = e.fecha ? e.fecha : null;
        const fecha_emision = e.fecha_emision ? e.fecha_emision : null;
        const subtotal = e.subtotal ? +e.subtotal : null;
        const impuesto = e.impuesto ? +e.impuesto : null;
        const retencion = e.retencion ? +e.retencion : null;
        const total = e.total ? +e.total : null;
        // DATA FOR FILTER
        let data = `${nro_fila}${id}`;
        data += `${factura_num}${nro_control}${fecha}${fecha_emision}`
        data += `${formatNumber((+subtotal).toFixed(2))}${formatNumber((+impuesto).toFixed(2))}${formatNumber((+retencion).toFixed(2))}${formatNumber((+total).toFixed(2))}`;
        // RETURN VALUE
        return {
            index: index,
            nro_fila: nro_fila,
            id: id,
            factura_num: factura_num,
            nro_control: nro_control,
            fecha: fecha,
            fecha_emision: fecha_emision,
            subtotal: +(+subtotal).toFixed(2),
            impuesto: +(+impuesto).toFixed(2),
            retencion: +(+retencion).toFixed(2),
            total: +(+total).toFixed(2),
            data: data,
        }
    });
    return resultados;
});
const listRetenPage = computed(() => {
    if (!listReten.value.length) return [];
    const page_size = table.pageSize;
    const page_number = table.currentPage;
    const array = listReten.value.slice((page_number - 1) * page_size, page_number * page_size);
    return array;
})
///////////////////////////////////////////////////
///////////////// METODOS
///////////////////////////////////////////////////
// accion con datos
const buscar_retenciones = async () => {
    if (fullscreenLoading.value) return;
    table.filterTableDetail = null;
    table.pageSize = 10;
    table.currentPage = 1;
    changeOrderDetail("nro_fila");
    table.tableData = [];
    loading_msg.value = "Cargando Datos... Por favor espere";
    fullscreenLoading.value = true;
    if (!fecha.value) {
        fullscreenLoading.value = false
        emit('notification', 'Debe seleccionar una fecha valida', 'warning', 'Falta seleccionar una fecha');
        return
    }
    if (!id_proveedor) {
        fullscreenLoading.value = false
        emit('notification', '', 'warning', 'Falta proveedor');
        return
    }
    try {
        const response = await axios.post(`/cargar_reten`, {
            id_proveedor: id_proveedor,
            fecha: fecha.value,
        })
        emit('notification', '', 'success', 'Cargado con exito');
        table.tableData = response.data;
        fullscreenLoading.value = false
    } catch (error) {
        fullscreenLoading.value = false;
        console.error('Error al guardar datos de 3ro:', error)
        // El servidor respondió con un código de error
        if (error.response && error.response.status === 300) {
            let msg = (error.response.data?.message || 'Error al obtener los datos')
            emit('notification', msg, 'info', 'Error');
        } else if (error.response && error.response.status === 500) {
            let msg = 'Intenta nuevamente en unos minutos'
            emit('notification', msg, 'warning', 'Error');
        } else {
            let msg = error.response.data?.message || 'Error en guardar los cambios'
            emit('notification', msg, 'warning', 'Error');
        }
    }
}
const datos = () => {
    input1.value = datosinicio.razon_social
}
// exportar pdf
const exportPdf = async (row) => {
    if (fullscreenLoading.value) return;
    loading_msg.value = "Cargando Datos... Por favor espere";
    fullscreenLoading.value = true;
    const element = pdfretencion.value?.$el;
    if (!element) {
        fullscreenLoading.value = false;
        console.error("El contenido para el PDF no está disponible.");
        return;
    }
    try {
        const value = { params: { id_proveedor: id_proveedor, factura_num: row.factura_num, _t: new Date().getTime() } };
        const response = await axios.get(`/export_reten`, value);
        // Actualizar los datos antes de generar el PDF
        if (pdfretencion.value?.actualizarDatosPdf) {
            pdfretencion.value.actualizarDatosPdf(response.data[0]);
        }
        // Pequeña pausa para asegurar que Vue actualice el DOM
        setTimeout(() => {
            fullscreenLoading.value = false
            emit('notification', 'Con exito', 'success', 'Pdf procesado', 'bottom-right');
            const opt = {
                margin: 0,
                filename: `Ret_${row.factura_num || 'sin_numero'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            } as const;
            html2pdf().set(opt).from(element).save();
        }, 100);
    } catch (error) {
        console.warn('Error al exportar:', error)
        // El servidor respondió con un código de error
        if (error.response && error.response.status === 300) {
            fullscreenLoading.value = false;
            let msg = (error.response.data?.message || 'Error al obtener los datos')
            emit('notification', msg, 'warning', 'Datos faltantes');
        } else if (error.response && error.response.status === 500) {
            let msg = 'Intenta nuevamente en unos minutos'
            emit('notification', msg, 'warning', 'Datos faltantes');
        } else {
            fullscreenLoading.value = false
            let msg = error.response.data?.message || 'Error'
            emit('notification', msg, 'warning', 'Error');
        }
    }
};
// -- metodos de la tabla
const changeOrderDetail = (item, orderable = true) => {
    if (!orderable) return;
    if (!table.orderByDetail) {
        table.orderByDetail = { item: item, order: 'asc' };
        return;
    }
    let order = table.orderByDetail.order == 'asc';
    if (table.orderByDetail.item == item) {
        order = !order;
        table.orderByDetail = { item: item, order: (order ? 'asc' : 'desc') };
    } else {
        table.orderByDetail = { item: item, order: 'asc' };
    }
};
const limpiar = async () => {
    table.tableData = []
}
// -- datos al cargar la pagina
onMounted(() => {
    datos();
});
</script>
<style scoped>
.demo-autocomplete {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.demo-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.demo-title {
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
    min-height: 2.5em;
    display: flex;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .demo-autocomplete {
        gap: 1rem;
    }

    .demo-block {
        width: 100%;
    }
}

.demo-input-with-icon {
    width: 100%;
}

.el-table ::v-deep(.el-table__footer-wrapper) .el-table__footer {
    font-size: 14px;
    background-color: red;
}

.input-group {
    margin-bottom: 1.5rem;
}

.label {
    display: block;
    margin-bottom: 1rem;
    color: var(--el-text-color-regular);
}

.input-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.responsive-input {
    width: 540px;
}

@media (max-width: 768px) {
    .input-container {
        flex-direction: column;
        gap: 1rem;
    }

    .responsive-input {
        width: 100%;
    }
}
</style>
