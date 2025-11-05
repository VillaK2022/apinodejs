<template>

    <body v-loading.fullscreen.lock="fullscreenLoading"
        :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
        element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
        <span style="font-size: 30px;">Ventas Vs. Inventario</span>
        <br>
        <span style="font-size: 10px; color: #636466;">Ultimos 3 meses</span>
        <br>
        <br>
        <!-- inputs  -->
        <section>
            <div class="row mb-3">
                <div class="col-lg-4 mb-2">
                    <label class="col-12 label-xs">Razón Social</label>
                    <el-input disabled v-model="inputs.prov" placeholder="Razon_social" :suffix-icon="Avatar" />
                </div>
                <div class="col-lg-4 col-md-9 mb-2">
                    <label class="col-12 label-xs">Tienda:</label>
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-select v-model="inputs.tienda_select" :disabled="table.tableData.length > 0"  clearable placeholder="Tienda"
                                style="width: 100%">
                                <el-option v-for="item in inputs.tiendas" :key="item.id_tienda"
                                    :label="item.descripcion" :value="item.id_tienda" />
                            </el-select>
                        </el-col>
                        <el-col :span="4" class="text-right">
                            <el-tooltip
                                
                                content="Buscar"
                                placement="top"
                                effect="light"
                            > 
                                <el-button class="w-100" type="primary" :icon="Search" @click="buscar_venta()" />
                            </el-tooltip>
                        </el-col>
                        <el-col :span="4" class="text-right">
                            <el-tooltip
                                v-if="table.tableData.length > 0"
                                
                                content="Exportar excel"
                                placement="top"
                                effect="light"
                            > 
                                <el-button class="w-100" type="success"
                                    @click="exportar()">
                                    <font-awesome-icon icon="file-excel" />
                                </el-button>
                            </el-tooltip>
                        </el-col>
                        <el-tooltip content="Limpiar" placement="top" effect="light">
                            <el-col v-if="table.tableData.length > 0" :span="4" class="text-right">
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
        <!-- table -->
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
                                                :class="`lh-n text-${campo_mostrar.align}`" style="cursor:pointer; 
                                                text-wrap: nowrap;" @click="modalcodigo(item)">
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
                                                detalles para mostrar.</td>
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
                                <h6>{{ listVenta_Vs.length == table.tableData.length ? '' : (listVenta_Vs.length +
                                    (listVenta_Vs.length == 1
                                    ? ' Articulofiltrado' : ' Articulos filtrados') + ' de ') }}{{
                                    table.tableData.length }}{{
                                        table.tableData.length ==
                                            1 ? ' fila total' : ' filas totales' }}</h6>
                            </div>
                            <div class="col-lg-6" style="display: flex; justify-content: flex-end;">
                                <el-pagination size="small" layout="prev, pager, next" :total="listVenta_Vs.length"
                                    v-model:current-page="table.currentPage" v-model:page-size="table.pageSize" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- dialog codigo -->
        <section>
            <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" v-model="modal_codigo" id="modalbarra" title="Barras asociadas" width="40%" center>
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
        </section>
    </body>
</template>

<script setup>
    ///////////////////////////////////////////////////
    ///////////////// Import
    ///////////////////////////////////////////////////
    import { ref, onMounted, reactive, inject, watch, nextTick, computed } from 'vue';
    import { Search, Avatar } from '@element-plus/icons-vue';
    import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
    import moment from 'moment/moment';
    import 'moment/locale/es'; // Importa la configuración regional específica
    import axios from 'axios';
    import { InfoFilled } from '@element-plus/icons-vue'
    ///////////////////////////////////////////////////
    ///////////////// CONST
    ///////////////////////////////////////////////////
    const formatNumber = inject('formatNumber')
    const datosinicio = JSON.parse(localStorage.getItem('userData'));
    const id_proveedor = datosinicio.id_mproveedor
    const fullscreenLoading = ref(false);
    const loading_msg = ref(null);
    const mes_actual = ref(moment().format("MMM"));
    const mes_anterior = ref(moment().clone().subtract(1, 'month').format("MMM"));
    const mes_anterior2 = ref(moment().clone().subtract(2, 'month').format("MMM"));
    const emit = defineEmits(['change-window', 'notification', 'swal']);
    const modal_codigo = ref(false)
    const table = reactive({
        tableData: [],
        orderByDetail: null,
        filterTableDetail: null,
        pageSize: 10,
        currentPage: 1,
        campos_mostrar: [
            { id: 1, name: '#', key: 'nro_fila', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 2, name: 'Departamento', key: 'departamento', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 3, name: 'Grupo', key: 'grupo', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 4, name: 'Subgrupo', key: 'subgrupo', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 5, name: 'Descripcion', key: 'descripcion', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            // { id: 6, name: 'Codigo', key: 'ncodigo', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 7, name: `Cantidad de ${mes_anterior2.value ? mes_anterior2.value : ''}`, key: 'cant1', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 8, name: `Cantidad de ${mes_anterior.value ? mes_anterior.value : ''}`, key: 'cant2', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 9, name: `Cantidad de ${mes_actual.value ? mes_actual.value : ''} `, key: 'cant3', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 10, name: 'Existencia', key: 'existencia', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 11, name: 'Proyeccion de venta', key: 'proyeccion_ventas', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 12, name: 'Promedio diario', key: 'promedio_diario', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 13, name: 'Dias de inventario', key: 'dias_inventario', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 14, name: 'Fecha maxima de ventas', key: 'fecha_maxima', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: false, orderable: true },
            { id: 15, name: 'Días sin venta', key: 'dias_sin_ventas', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 16, name: 'Unidades sin vender', key: 'unidades_sin_vender', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
            { id: 17, name: 'Valor sin ventas', key: 'valor_sin_ventas', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        ],
        paginas: [10, 50, 100, 500]
    });
    const listVenta_Vs = computed(() => {
        if (!listInvWoutFilter.value.length) return [];
        let data = [...listInvWoutFilter.value.map(e => { return { ...e } })];
        if (!!table.filterTableDetail) data = data.filter(e => e.data.toLowerCase().trim().indexOf(table.filterTableDetail.toLowerCase().trim()) > -1);
        if (!!table.orderByDetail && table.orderByDetail.order == 'asc') {
            data = data.sort((a, b) => !isNaN(a[table.orderByDetail.item]) && !isNaN(b[table.orderByDetail.item]) ? a[table.orderByDetail.item] - b[table.orderByDetail.item] : a[table.orderByDetail.item].toString().localeCompare(b[table.orderByDetail.item], 'es', { numeric: true }));
        } else if (!!table.orderByDetail && table.orderByDetail.order == 'desc') {
            data = data.sort((a, b) => !isNaN(a[table.orderByDetail.item]) && !isNaN(b[table.orderByDetail.item]) ? b[table.orderByDetail.item] - a[table.orderByDetail.item] : b[table.orderByDetail.item].toString().localeCompare(a[table.orderByDetail.item], 'es', { numeric: true }));
        }
        return data;
    })
    const listInvWoutFilter = computed(() => {
        if (!table.tableData.length) return [];
        const resultados = table.tableData.map((e, i) => {
            // VARIABLES
            const index = i;
            const nro_fila = index + 1;
            // const ncodigo = e.ncodigo ? e.ncodigo : '-';
            const departamento = e.departamento ? e.departamento : '-';
            const grupo = e.grupo ? e.grupo : '-';
            const subgrupo = e.subgrupo ? e.subgrupo : '-';
            const descripcion = e.descripcion ? e.descripcion : '-';
            const ncodigo = e.ncodigo ? e.ncodigo : 0;
            const cant1 = +(e.cant1 ? e.cant1 : 0);
            const cant2 = +(e.cant2 ? e.cant2 : 0);
            const cant3 = +(e.cant3 ? e.cant3 : 0);
            const existencia = +(e.existencia ? e.existencia : 0);
            const proyeccion_ventas = +(e.proyeccion_ventas ? e.proyeccion_ventas : 0);
            const promedio_diario = +(e.promedio_diario ? e.promedio_diario : 0);
            const dias_inventario = +(e.dias_inventario ? e.dias_inventario : 0);
            const fecha_maxima = e.fecha_maxima ? e.fecha_maxima : '-';
            const dias_sin_ventas = +(e.dias_sin_ventas ? e.dias_sin_ventas : 0);
            const unidades_sin_vender = +(e.unidades_sin_vender ? e.unidades_sin_vender : 0);
            const valor_sin_ventas = +(e.valor_sin_ventas ? e.valor_sin_ventas : 0);
            // DATA FOR FILTER
            let data = `${nro_fila}${departamento}${grupo}${subgrupo}${descripcion}${ncodigo}
                ${formatNumber((cant1).toFixed(2))}
                ${formatNumber((cant2).toFixed(2))}
                ${formatNumber((cant3).toFixed(2))}
                ${formatNumber((existencia).toFixed(2))}
                ${formatNumber((dias_sin_ventas).toFixed(2))}
                ${formatNumber((dias_inventario).toFixed(2))}
                ${formatNumber((promedio_diario).toFixed(2))}
                ${formatNumber((proyeccion_ventas).toFixed(2))}
                ${formatNumber((unidades_sin_vender).toFixed(2))}
                ${formatNumber((valor_sin_ventas).toFixed(2))}`;
            // RETURN VALUE
            return {
                index: index,
                nro_fila: nro_fila,
                // ncodigo: ncodigo,
                departamento: departamento,
                grupo: grupo,
                subgrupo: subgrupo,
                descripcion: descripcion,
                ncodigo: ncodigo,
                cant1: +(+cant1).toFixed(2),
                cant2: +(+cant2).toFixed(2),
                cant3: +(+cant3).toFixed(2),
                existencia: +(+existencia).toFixed(2),
                dias_sin_ventas: dias_sin_ventas,
                dias_inventario: +(+dias_inventario).toFixed(2),
                fecha_maxima: fecha_maxima,
                promedio_diario: +(+promedio_diario).toFixed(2),
                proyeccion_ventas: +(+proyeccion_ventas).toFixed(2),
                unidades_sin_vender: +(+unidades_sin_vender).toFixed(2),
                valor_sin_ventas: +(+valor_sin_ventas).toFixed(2),
                data: data,
            }
        });
        return resultados;
    });
    const listInvPage = computed(() => {
        if (!listVenta_Vs.value.length) return [];
        const page_size = table.pageSize;
        const page_number = table.currentPage;
        const array = listVenta_Vs.value.slice((page_number - 1) * page_size, page_number * page_size);
        return array;
    })
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
    const inputs = reactive({
        prov: '',
        tienda_select: '',
        tiendas: [],
        option: '1',
        mes_actual: '',
        mes_anterior: '',
        mes_anterior2: '',
        item: ''
    })
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
      emit('notification', '🥳', 'success', 'Barra agregada como principal');
    } catch (error) {
      fullscreenLoading.value = false;
      emit('notification', '❌', 'warning', 'No fue posible agregar barra como principal');
    }
    }
    const modalcodigo = async (item) => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        try {
        const value = {
            params: {
            item: item.ncodigo,
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
    const ver = () => {
        console.log(inputs.tienda_select);

    }
    const buscar_venta = async () => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        table.tableData = [];
        // console.log(inputs.tienda_select);
        if (!inputs.tienda_select) {
            fullscreenLoading.value = false;
            emit('notification', 'Debe seleccionar una tienda', 'warning', 'Datos faltantes');
            return
        }
        try {
            const value = {
                params: {
                    id_proveedor: id_proveedor,
                    tienda: inputs.tienda_select,
                    _t: new Date().getTime()
                }
            };
            const response = await axios.get(`/ventas_existencia`, value);
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
    const exportar = async () => {
        if (fullscreenLoading.value) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        const fechaactual = ref(moment().format('lll'));
        try {
            const response = await axios.post(`/excel_venta_vs_inv`, {
                datos: table.tableData,
                mes_actual: mes_actual.value,
                mes_anterior: mes_anterior.value,
                mes_anterior2: mes_anterior2.value,
                fecha: fechaactual.value,
                titulo: 'Ventas Vs Inv',
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
                emit('notification', msg, 'info', 'No se encontraron datos');
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
    const limpiar = async () => {
        table.tableData = []
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
                emit('notification', msg, 'info', 'No se encontraron datos');
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
    const capitalizeFirstLetter = (str) => {
        if (!str || typeof str !== 'string') {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const cargardatos = () => {
        inputs.prov = datosinicio.razon_social
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

@media screen and (max-width: 768px) {
    .demo-autocomplete {
        gap: 1rem;
    }

    .demo-block {
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