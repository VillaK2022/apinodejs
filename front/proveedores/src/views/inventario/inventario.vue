<template>
    <body v-loading.fullscreen.lock="fullscreenLoading"
        :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
        element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
        <span style="font-size: 30px;">Inventario</span>
        <br>
        <br>

        <!-- inputs  -->
        <section>
            <div class="row mb-3">
                <div class="col-lg-3 mb-2">
                    <label class="col-12 label-xs">Razón Social</label>
                    <el-input disabled v-model="inputs.prov" placeholder="Razon_social" :suffix-icon="Avatar" />
                </div>
                <div class="col-lg-3 mb-2">
                    <label class="col-12 label-xs">Tienda</label>
                    <el-select :disabled="table.tableData.length > 0" v-model="inputs.tiendas_select" multiple clearable collapse-tags placeholder="Tienda" style="width: 100%">
                        <el-option v-for="item in inputs.tiendas" :key="item.id_tienda" :label="item.descripcion" :value="item.id_tienda" />
                    </el-select>
                </div>
                <div class="col-lg-3 col-md-9 mb-2">
                    <label class="col-12 label-xs">Tipo de búsqueda</label>
                    <el-row :gutter="24">
                        <el-col :span="14">
                            <el-select :disabled="table.tableData.length > 0" v-model="inputs.option" filterable placeholder="Búsqueda" style="width: 100%">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-col>
                        <el-col :span="3" class="text-right">
                            <el-tooltip
                                content="Buscar"
                                placement="top"
                                effect="light"> 
                                <el-button class="w-100" type="primary" :icon="Search" @click="buscar()" />
                            </el-tooltip>
                        </el-col>
                        <el-col :span="3" class="text-right">
                            <el-tooltip
                                v-if="table.tableData.length > 0"
                                
                                content="Exportar excel"
                                placement="top"
                                effect="light"
                            > 
                                <el-button class="w-100" type="success"
                                    @click="exportarexcel()">
                                    <font-awesome-icon icon="file-excel" />
                                </el-button>
                            </el-tooltip>
                        </el-col>
                        <el-tooltip content="Limpiar" placement="top" effect="light">
                            <el-col v-if="table.tableData.length > 0" :span="3" class="text-right">
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

                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="!!listInvPage.length">
                                        <tr v-for="(item, key) in listInvPage" :key="key">
                                            <!-- Item -->
                                            <td v-for="(campo_mostrar, idx) in table.campos_mostrar" :key="idx"
                                                :class="`lh-n text-${campo_mostrar.align}`" style="text-wrap: nowrap; cursor: pointer;" @click="modalcodigo(item)">
                                                {{ item[campo_mostrar.key] == null ? '-' : (campo_mostrar.numeric ?
                                                    (isNaN(+item[campo_mostrar.key]) ? formatNumber((0).toFixed(2)) :
                                                formatNumber((+item[campo_mostrar.key]).toFixed(2))) :
                                                item[campo_mostrar.key]) }}
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
                                <h6>{{ listInv.length == table.tableData.length ? '' : (listInv.length + (listInv.length == 1 ? ' Articulofiltrado' : ' Articulos filtrados') + ' de ') }}{{ table.tableData.length }}{{
                                        table.tableData.length ==
                                    1 ? ' fila total' : ' filas totales' }}</h6>
                            </div>
                            <div class="col-lg-6" style="display: flex; justify-content: flex-end;">
                                <el-pagination size="small" layout="prev, pager, next" :total="listInv.length"
                                    v-model:current-page="table.currentPage" v-model:page-size="table.pageSize" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- dialog codigo -->
        <section>
            <el-dialog :close-on-press-escape="false" :close-on-click-modal ="false"  v-model="modal_codigo" id="modalbarra" title="Barras asociadas" width="30%" center>
                <div v-if="!!inputs.item[0]">
                    <span style="font-size: 13px;">{{ inputs.item[0].articulo }}</span>
                    <br>
                    <br>
                        <el-table :data="inputs.item" style="width: 100%">
                            <el-table-column prop="descripcion" label="Descripción" />
                            <el-table-column prop="barra" label="Barra" />
                        </el-table>
                    <br>
                    <br>
                </div>
                <template #footer>
                    <div class="dialog-footer d-flex justify-content-end" >
                        <el-button type="info" plain @click="modal_codigo = false">Cerrar</el-button>
                    </div>
                </template>
            </el-dialog>
        </section>
    </body>
</template>

<script setup>
    ///////////////////////////////////////////////////
    ///////////////// Import
    ///////////////////////////////////////////////////
    import { ref, onMounted, reactive, inject, watch, nextTick, computed } from 'vue';
    import { Search, Avatar } from '@element-plus/icons-vue';
    import moment from 'moment';
    import axios from 'axios';
    import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
    import { InfoFilled } from '@element-plus/icons-vue'
    ///////////////////////////////////////////////////
    ///////////////// CONST
    ///////////////////////////////////////////////////
    const formatNumber = inject('formatNumber')
    const datosinicio = JSON.parse(localStorage.getItem('userData'));
    const id_proveedor = datosinicio.id_mproveedor
    const fullscreenLoading = ref(false);
    const loading_msg = ref(null);
    const modal_codigo = ref(false)
    const emit = defineEmits(['change-window', 'notification', 'swal']);
    const options = [
        {
            value: '1',
            label: 'Todos',
        },
        {
            value: '2',
            label: 'Con existencia',
        },
        {
            value: '3',
            label: 'Sin existencia',
        },
        {
            value: '4',
            label: 'Existencia negativa',
        }
    ]
    const inputs = reactive({
        prov: '',
        tiendas_select: [],
        tiendas: [],
        option: '1',
    })
    const verdatos = () => {
        console.log(inputs);

    }
    const table = reactive({
        tableData: [],
        orderByDetail: null,
        filterTableDetail: null,
        pageSize: 10,
        currentPage: 1,
        campos_mostrar: [
            { id: 1, name: '#', key: 'nro_fila', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 2, name: 'Organización', key: 'organizacion', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 3, name: 'Tiendas', key: 'tiendas', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 4, name: 'Almacen', key: 'almacen', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 5, name: 'Articulo', key: 'articulo', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 6, name: 'Existencia', key: 'existencia', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        ],
        paginas: [10, 50, 100, 500]
    });
    const listInv = computed(() => {
        if (!listInvWoutFilter.value.length) return [];
        let data = [...listInvWoutFilter.value.map(e => { return { ...e } })];
        if (!!table.filterTableDetail) data = data.filter(e => e.data.toLowerCase().trim().indexOf(table.filterTableDetail.toLowerCase().trim()) > -1);
        if (!!table.orderByDetail && table.orderByDetail.order == 'asc') {
            data = data.sort((a, b) => a[table.orderByDetail.item].toString().localeCompare(b[table.orderByDetail.item], 'es', { numeric: true }));
        } else if (!!table.orderByDetail && table.orderByDetail.order == 'desc') {
            data = data.sort((a, b) => b[table.orderByDetail.item].toString().localeCompare(a[table.orderByDetail.item], 'es', { numeric: true }));
        }
        return data;
    })
    const listInvWoutFilter = computed(() => {
        if (!table.tableData.length) return [];
        const resultados = table.tableData.map((e, i) => {
            // VARIABLES
            const index = i;
            const nro_fila = index + 1;
            const organizacion = e.organizacion ? e.organizacion : null;
            const tiendas = e.tiendas ? e.tiendas : null;
            const almacen = e.almacen ? e.almacen : null;
            const articulo = e.articulo ? e.articulo : null;
            const existencia = e.existencia ? e.existencia : null;
            const codigo =  e.codigo ? e.codigo : null;
            // DATA FOR FILTER
            let data = `${nro_fila}${organizacion}${tiendas}${almacen}${articulo}${existencia}${codigo}`;
            // RETURN VALUE
            return {
                index: index,
                nro_fila: nro_fila,
                organizacion: organizacion,
                tiendas: tiendas,
                almacen: almacen,
                articulo: articulo,
                existencia: existencia,
                codigo: codigo,
                data: data,
            }
        });
        return resultados;
    });
    const listInvPage = computed(() => {
        if (!listInv.value.length) return [];
        const page_size = table.pageSize;
        const page_number = table.currentPage;
        const array = listInv.value.slice((page_number - 1) * page_size, page_number * page_size);
        return array;
    })
    const buscar = async () => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        table.tableData = [];
        if (inputs.tiendas_select.length <= 0 && inputs.option.length <= 0) {
            fullscreenLoading.value = false;
            emit('notification', 'Debe seleccionar algun filtro', 'warning', 'Datos faltantes');
            return
        }
        let opcion = inputs.option
        try {
            const value = {
                params: {
                    id_proveedor: id_proveedor,
                    options: opcion,
                    tiendas_envia: inputs.tiendas_select.toString(),
                    _t: new Date().getTime()
                }
            };
            const response = await axios.get(`/existencia`, value);
            table.tableData = response.data;
            // console.log(response.data, 'data');
            fullscreenLoading.value = false;
        } catch (error) {
            fullscreenLoading.value = false;
            console.warn('Error al cargar datos:', error)
            // El servidor respondió con un código de error
            if (error.response && error.response.status === 300) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'info', 'No se encontraron datos');
            } else if (error.response && error.response.status === 404) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Revisar ')
                emit('notification', msg, 'info', 'No se encontraron datos con los filtros');
            } else if (error.response && error.response.status === 500) {
                let msg = 'Error interno del servidor'
                emit('notification', msg, 'warning', 'Error interno del servidor');
            } else if (error.response && error.response.status === 400) {
                let msg = 'Intenta nuevamente en unos minutos'
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else {
                fullscreenLoading.value = false
                let msg = error.response.data?.message || 'Error'
                emit('notification', msg, 'warning', 'Error');
            }
        }
    }
    const cargardatos = () => {
        inputs.prov = datosinicio.razon_social
    }
    const tienda = async () => {
        // console.log(fullscreenLoading);
        if (fullscreenLoading.value) return;
        loading_msg.value = "Cargando Datos... Por favor espere";
        fullscreenLoading.value = true;
        try {

            const response = await axios.get(`/tiendas`);
            inputs.tiendas = response.data
            fullscreenLoading.value = false;
        } catch (error) {
            console.log(error)
            fullscreenLoading.value = false;
            if (error.response && error.response.status === 300) {
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'warning', 'Datos faltantes');
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
    const exportarexcel = async () => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        const fechaactual = ref(moment().format('lll'));
        try {
            const response = await axios.post(`/excel_inv`, {
                datos: table.tableData,
                fecha: fechaactual.value,
                titulo: 'Inventario',
            }, {
                responseType: 'blob' // Indicar que esperamos un blob (archivo binario)
            });

            // Crear un enlace temporal para descargar el blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'venta_vs_inventario.xlsx'); // Nombre del archivo
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
    const modalcodigo = async (item) => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        try {
            const value = {
                params: {
                    item: item.codigo,
                    _t: new Date().getTime()
                }
            };
            const response = await axios.get(`/mbarra_codigo`, value);
            inputs.item = response.data            
            modal_codigo.value = true
            fullscreenLoading.value = false;
        } catch (error) {
            fullscreenLoading.value = false;
            console.warn('Error al cargar datos:', error)
            // El servidor respondió con un código de error
            if (error.response && error.response.status === 300) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else if (error.response && error.response.status === 404) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Revisar ')
                emit('notification', msg, 'info', 'No se encontraron datos con los filtros');
            } else if (error.response && error.response.status === 500) {
                let msg = 'Error interno del servidor'
                emit('notification', msg, 'warning', 'Error interno del servidor');
            } else if (error.response && error.response.status === 400) {
                let msg = 'Intenta nuevamente en unos minutos'
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else {
                fullscreenLoading.value = false
                let msg = error.response.data?.message || 'Error'
                emit('notification', msg, 'warning', 'Error');
            }
        }
    }
    const limpiar = async () => {
        table.tableData = []
    }
    onMounted(() => {
        cargardatos();
        tienda();
    });
</script>

<style scoped>
    .search-container {
    display: flex; 
    align-items: flex-end; 
    gap: 10px; 
    /* margin-bottom: 3vh; */
    }


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
        #modalbarra{
            width: 85%;
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
        #modalbarra{
            width: 85%;
        }
        .input-container {
            flex-direction: column;
            gap: 1rem;
        }

        .responsive-input {
            width: 100%;
        }
    }
</style>
<style>
    @media screen and (max-width: 1000px) {
        #modalbarra {
            width: 85% !important;
        }
    }
</style>