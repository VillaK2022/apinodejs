<template>
    <body v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
        element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
        <!-- FILTROS -->
        <div>
            <span style="font-size: 30px;">Pagos</span>
            <br>
            <br>
                <section>
                    <div class="row mb-3">
                        <div class="col-lg-4 mb-2">
                            <label class="col-12 label-xs">Razón Social</label>
                            <el-input disabled v-model="inputs.prov" placeholder="Razon_social" :suffix-icon="Avatar" />
                        </div>
                        <div class="col-lg-4 mb-2">
                            <label class="col-12 label-xs">Fechas:</label>
                            <el-date-picker :disabled="table.datostabla.length > 0 " class="w-100" v-model="inputs.fecha" type="daterange"start-placeholder="Fecha inicio" 
                            end-placeholder="Fecha final" format="DD-MM-YYYY" value-format="DD-MM-YYYY" />
                        </div>
                        <div class="col-lg-4 mb-2">
                            <label class="col-12 label-xs">Num de fact:</label>
                            <el-row :gutter="24">
                                <el-col :span="14">
                                    <el-input :disabled="table.datostabla.length > 0 " clearable :clear-icon="CloseBold" v-model="inputs.busqueda" class="" 
                                    placeholder="Buscar" :prefix-icon="Postcard" />
                                </el-col>
                                <el-col :span="3" class="text-right">
                                    <el-tooltip
                                        content="Buscar"
                                        placement="top"
                                        effect="light"
                                    > 
                                        <el-button class="w-100" type="primary" :icon="Search" @click="buscardatos()" />
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="3" class="text-right">
                                    <el-tooltip
                                        v-if="table.datostabla.length > 0"
                                        
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
                                    <el-col v-if="table.datostabla.length > 0" :span="3" class="text-right">
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
                <!--TABLAA-->
                <section v-if="table.datostabla.length > 0">
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
                            <div class="col-lg-8 text-center">
                                <label class="col-12 label-xs"></label>
                            </div>
                            <div class="col-lg-2 text-end mb-2">
                                <label class="col-12 label-xs">Filtro</label>
                                <el-input size="small" v-model="table.filterTableDetail" placeholder="Filtro"
                                    clearable></el-input>
                            </div>
                            <!-- TABLA DE DATOS -->
                            <div class="col-lg-12">
                                <div class="table-responsive card" style="padding: 0 !important; max-height: 45vh !important; font-size: 11px !important;">
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
                                                <th style="background-color: rgba(0, 152, 131, 1); font-size: x-small;"
                                                    width="5%"></th>
                                                <th style="background-color: rgba(0, 152, 131, 1); font-size: x-small;"
                                                    width="5%"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="!!listPagosPage.length">
                                                <tr v-for="(item, key) in listPagosPage" :key="key">
                                                    <!-- Item -->
                                                    <td v-for="(campo_mostrar, idx) in table.campos_mostrar" :key="idx" @click="modalpago(item)" style="cursor:pointer; text-wrap: nowrap;"
                                                        :class="`lh-n text-${campo_mostrar.align}`">{{ item[campo_mostrar.key] == null ? '-' : (campo_mostrar.numeric ? (isNaN(+item[campo_mostrar.key]) ? formatNumber((0).toFixed(2)) :formatNumber((+item[campo_mostrar.key]).toFixed(2))) :item[campo_mostrar.key]) }}                                    
                                                    </td>
                                                    <td class="text-center">
                                                        <el-popconfirm class="box-item" title="Ver detalle" placement="top"
                                                            confirm-button-text="Si" cancel-button-text="No"
                                                            @confirm="modalpago(item)">
                                                            <template #reference>
                                                                <el-tag type="primary" effect="dark" style="cursor: pointer">
                                                                    <el-icon style="font-size: 16px">
                                                                        <View />
                                                                    </el-icon>
                                                                </el-tag>
                                                            </template>
                                                        </el-popconfirm>
                                                    </td>
                                                    <td>
                                                        <el-popconfirm class="box-item" title="Exportar PDF" placement="top"
                                                            confirm-button-text="Si" cancel-button-text="No"
                                                            @confirm="exportPdfpagos(item)">
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
                                        <h6>{{ listPagos.length == table.datostabla.length ? '' : (listPagos.length +
                                            (listPagos.length == 1 ? ' Articulo filtrado' : ' Articulos filtrados') + ' de ') }}{{table.datostabla.length }}{{ table.datostabla.length == 1 ? ' fila total' : ' filas totales' }}</h6>
                                    </div>
                                    <div class="col-lg-6" style="display: flex; justify-content: flex-end;">
                                        <el-pagination size="small" layout="prev, pager, next" :total="listPagos.length"
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
                        <ContenidoPDFpagos ref="pdfpago" />
                        <!-- <ContenidoPDFpagos v-if="showPdfContent" ref="pdfpago" /> -->
                    </template>
                </section>
                <!-- Modal mostrar pagos -->
                <section>
                    <el-dialog v-model="modal.activamodal" border show-summary top="3vh" style="width: 90%;" title="Pagos" width="800"
                    :close-on-press-escape="false" :close-on-click-modal="false">
                        <template #header="{ close, titleId, titleClass }">
                            <div class="row">
                                <div class="col-lg-3">
                                    <h4 :id="titleId" :class="titleClass">Pago #{{ modal && modal.dato_registro_banco ? modal.dato_registro_banco.id : '-' }}</h4>
                                </div>
                                <div class="col-lg-3 text-center">
                                    <h4 style="color: #636466;" :id="titleId" :class="titleClass">Organización: {{ modal.dato_registro_banco.organizacion }}</h4>
                                </div>
                                <div class="col-lg-3 text-center">
                                    <h4 style="color: #636466;" :id="titleId" :class="titleClass">Tasa cambio: {{ formatNumber(modal.dato_registro_banco.tasacambio == null && isNaN(+modal.dato_registro_banco.tasacambio) ? (0).toFixed(2) : (+modal.dato_registro_banco.tasacambio).toFixed(2)) }}</h4>
                                </div>
                            </div>
                        </template>
                        <div class="container-fluid">
                            <div class="col-12">
                                <div class="row mb-1">
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>#Doc</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.id"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>#PROPUESTA</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.propuesta_id"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-4 col-md-3 col-sm-12 mb-2">
                                        <span>Proveedor</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.nombre"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>F.pago</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.fecha_pago"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>Monto</span>
                                            <el-input
                                                v-model="modal.monto"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>Banco Paga</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.banco"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-4 col-md-3 col-sm-12 mb-2">
                                        <span>#Cuenta</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.cuenta"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-12 mb-2">
                                        <span>Banco Prov</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.banco_prov"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-4 col-md-3 col-sm-12 mb-2">
                                        <span>#Cuenta</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.cuenta_prov"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-12 mb-2">
                                        <span>Concepto</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.concepto"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-12 mb-2">
                                        <span>Usuario</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.usuario"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                    <div class="col-lg-6 col-md-3 col-sm-12 mb-2">
                                        <span>Observación</span>
                                            <el-input
                                                v-model="modal.dato_registro_banco.observ"
                                                style="width: 100%"
                                                disabled
                                            />
                                    </div>
                                </div>
                            </div>    
                        </div>
                        <span></span>     
                        <h5 class="text-center mt-3 mb-3">Información de detalle.</h5>
                        <el-table show-overflow-tooltip :flexible = "true" 
                        :header-cell-style="{background: 'rgb(0, 152, 131)', color: '#fff'  }" 
                        :row-style="{'font-size': '11px'}"  
                        max-height="300" :data="modal.dato_movimientos" show-summary :summary-method="getSummaries">
                            <el-table-column header-align="center" type="index" label="#"/>
                            <el-table-column header-align="center" property="tipo" label="Tipo"/>
                            <el-table-column header-align="center" width="200" property="numero_fact" label="#factura" />
                            <el-table-column header-align="center" width="150" property="fecha_registro" label="Fecha registro">
                                <template #default="scope">
                                    {{ moment(scope.row.fecha_registro).format('DD-MM-YYYY') }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" property="fecha_factura" label="Fecha factura">
                                <template #default="scope">
                                    {{ moment(scope.row.fecha_factura).format('DD-MM-YYYY') }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="total" label="Total">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.total == null && isNaN(+scope.row.total) ? (0).toFixed(2) : (+scope.row.total).toFixed(2)) }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="retencion" label="Retención">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.retencion == null && isNaN(+scope.row.retencion) ? (0).toFixed(2) : (+scope.row.retencion).toFixed(2)) }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="total_nc" label="N. Crédito">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.total_nc == null && isNaN(+scope.row.total_nc) ? (0).toFixed(2) : (+scope.row.total_nc).toFixed(2)) }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="abono" label="Abono">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.abono == null && isNaN(+scope.row.abono) ? (0).toFixed(2) : (+scope.row.abono).toFixed(2)) }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="monto" label="Pago">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.monto == null && isNaN(+scope.row.monto) ? (0).toFixed(2) : (+scope.row.monto).toFixed(2)) }}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" width="150" align="right" property="saldo" label="Saldo Pend.">
                                <template #default="scope">
                                    {{ formatNumber(scope.row.saldo == null && isNaN(+scope.row.saldo) ? (0).toFixed(2) : (+scope.row.saldo).toFixed(2)) }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <br><br>
                        <!-- parte 2 Documentos aplicados -->
                        <div v-if="modal.dato_mov_afect.length > 0">
                            <h5 class="text-center mt-3 mb-3">Documentos aplicados.</h5>
                            <el-table :header-cell-style="{ background: 'rgb(0, 152, 131)', color: '#fff' }" 
                            :row-style="{'font-size': '11px', 'text-align': 'center' }" max-height="300" :data="modal.dato_mov_afect">
                                <el-table-column header-align="center" type="index" label="#"/>
                                <el-table-column header-align="center" width="150" property="tipo_doc" label="#Número"/>
                                <el-table-column header-align="center" width="150" property="num_factura" label="#Numero" />
                                <el-table-column header-align="center" width="150" property="doc_afecta" label="#Doc Afectado" />
                                <el-table-column header-align="center" width="150" property="fecha" label="#Fecha">
                                    <template #default="scope">
                                        {{ moment(scope.row.fecha).format('DD-MM-YYYY') }}
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" width="150" property="notadevo_id" label="#Notas Internas" />
                                <el-table-column header-align="center" width="200" property="observacion" label="Observación" />
                                <el-table-column header-align="center" width="200" align="right" property="total" label="Total">
                                    <template #default="scope">
                                        {{ formatNumber(scope.row.total == null && isNaN(+scope.row.total) ? (0).toFixed(2) : (+scope.row.total).toFixed(2)) }}
                                    </template>
                                </el-table-column>

                            </el-table>
                        </div>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="modal.activamodal = false">Cerrar</el-button>
                            </div>
                        </template>
                    </el-dialog>
                </section>
        </div>
    </body>
</template>
<script setup>
    ///////////////////////////////////////////////////
    ///////////////// Import
    ///////////////////////////////////////////////////
    import { ref, onMounted, reactive, inject, computed, nextTick, h } from 'vue';
    import html2pdf from 'html2pdf.js';
    import moment from 'moment';
    import { ElTooltip } from 'element-plus';
    import { Search, Avatar, Postcard, CloseBold} from '@element-plus/icons-vue';
    import axios from 'axios';
    import ContenidoPDFpagos from '../../pdf/pdfpagos.vue';
    import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
    import { InfoFilled } from '@element-plus/icons-vue'
    ///////////////////////////////////////////////////
    ///////////////// CONST
    ///////////////////////////////////////////////////
    const pdfpago = ref(null);
    const formatNumber = inject('formatNumber')
    const emit = defineEmits(['change-window', 'notification', 'swal']);
    const datosinicio = JSON.parse(localStorage.getItem('userData'));
    const id_proveedor = datosinicio.id_mproveedor
    const fullscreenLoading = ref(false);
    const loading_msg = ref(null);
    const limpiar = async () => {
        table.datostabla = []
    }
    const modal = reactive({
        activamodal: false,
        datoPago: null,
        dato_mov_afect: null,
        dato_movimientos: null,
        dato_registro_banco: null,
        monto: null,
    })
    const inputs = reactive({
        prov: '',
        fecha: ref([moment().subtract(30, 'days').format('DD-MM-YYYY'), moment().format('DD-MM-YYYY')])
    })
    const cargardatos = () => {
        inputs.prov = datosinicio.razon_social
    }
    const buscardatos = async () => {
        if (fullscreenLoading.value) return;
        if (!inputs.fecha && !inputs.busqueda){
            emit('notification', 'Debe seleccionar una fecha valida o un numero de factura', 'warning', 'Revisar');
            return
        }
        table.filterTableDetail = null;
        table.pageSize = 10;
        table.currentPage = 1;
        changeOrderDetail("nro_fila");
        table.datostabla = [];
        loading_msg.value = "Cargando Datos... Por favor espere";
        fullscreenLoading.value = true;
        try {
            const arrayfechas = inputs.fecha || []
            const num_factura = inputs.busqueda
            const value = { params: { id_proveedor: id_proveedor, fechaini: (!arrayfechas.length ? null : arrayfechas[0]), fechafin: (!arrayfechas.length ? null : arrayfechas[1]), fact: num_factura,_t: new Date().getTime() } };
            const response = await axios.get(`/cargar_pagos`, value);
            table.datostabla = response.data;
            fullscreenLoading.value = false;

        } catch (error) {
            console.warn('Error al exportar:', error)
            // El servidor respondió con un código de error
            if (error.response && error.response.status === 300) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'warning', 'Datos faltantes');
            }else if (error.response && error.response.status === 404) {
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
    const exportPdfpagos = async (fila) => {
        if (fullscreenLoading.value) return;
        loading_msg.value = "Cargando Datos... Por favor espere";
        fullscreenLoading.value = true;
        try {
            const value = { params: { id_proveedor: id_proveedor, id: fila.id, _t: new Date().getTime() } };
            const response = await axios.get(`/export_pagos`, value);
            const datos = response.data
            const movimientos = datos.movimientos
            const registro_banco = datos.registro_banco
            const mov_afect = datos.mov_afect
            if (response) {
                pdfpago.value?.datos_movimientos?.(movimientos);
                pdfpago.value?.datos_registro_banco?.(registro_banco);
                pdfpago.value?.datos_mov_afect?.(mov_afect);

                // 3. 🔑 CRÍTICO: Usar nextTick para esperar la actualización del DOM
                nextTick(() => {
                    try {
                        const element = pdfpago.value?.$el;
                        fullscreenLoading.value = false
                        emit('notification', 'Con exito', 'success', 'Pdf procesado', 'bottom-right');
                        const opt = {
                            margin: [5, 5, 5, 5], // [top, right, bottom, left] - más margen para header/footer
                            filename: `Compro_pagos${fila.id || 'sin_numero'}.pdf`,
                            image: { 
                                type: 'jpeg', 
                                quality: 0.98 
                            },
                            html2canvas: { 
                                scale: 2,
                                useCORS: true,
                                logging: false
                            },
                            jsPDF: { 
                                unit: 'mm', 
                                format: 'a4', 
                                orientation: 'landscape',
                                compress: true
                            },
                            pagebreak: { 
                                mode: ['css', 'legacy'] 
                            }
                        };
                        // 4. Generar el PDF una vez que el DOM está listo
                        html2pdf().set(opt).from(element).save();

                    } catch (pdfError) {
                        // Captura errores específicos de html2pdf
                        console.error("Error al generar el PDF:", pdfError);
                        fullscreenLoading.value = false;
                    }
                });
            } else {
                emit('notification', 'No se pudieron exportar los datos', 'warning', 'Error');
            }

        } catch (error) {
            // ... (Tu manejo de errores existente)
            console.warn('Error al exportar:', error)
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
    }
    ///////////////////////////////////////////////////
    ///////////////// Tabla const
    ///////////////////////////////////////////////////
    const table = reactive({
        datostabla: [],
        orderByDetail: null,
        filterTableDetail: null,
        pageSize: 10,
        currentPage: 1,
        campos_mostrar: [
            { id: 1, name: '#', key: 'nro_fila', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 2, name: 'Organizacion', key: 'organizacion', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            { id: 3, name: 'Tienda', key: 'tienda', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
            // { id: 4, name: 'Proveedor', key: 'proveedor', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "center", numeric: false, orderable: true },
            { id: 4, name: '#pago', key: 'id', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "center", numeric: false, orderable: true },
            { id: 5, name: 'Fecha', key: 'fecha_pago', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: false, orderable: true },
            { id: 6, name: 'Tipo', key: 'tipo_mov', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: false, orderable: true },
            { id: 7, name: 'Monto', key: 'monto', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
        ],
        paginas: [10, 50, 100, 500]
    });
    ///////////////////////////////////////////////////
    ///////////////// COMPUTADAS
    ///////////////////////////////////////////////////
    const listPagos = computed(() => {
        if (!listPagosFiltro.value.length) return [];
        let data = [...listPagosFiltro.value.map(e => { return { ...e } })];
        if (!!table.filterTableDetail) data = data.filter(e => e.data.toLowerCase().trim().indexOf(table.filterTableDetail.toLowerCase().trim()) > -1);
        if (!!table.orderByDetail && table.orderByDetail.order == 'asc') {
            data = data.sort((a, b) => a[table.orderByDetail.item].toString().localeCompare(b[table.orderByDetail.item], 'es', { numeric: true }));
        } else if (!!table.orderByDetail && table.orderByDetail.order == 'desc') {
            data = data.sort((a, b) => b[table.orderByDetail.item].toString().localeCompare(a[table.orderByDetail.item], 'es', { numeric: true }));
        }
        return data;
    })
    const listPagosFiltro = computed(() => {
        if (!table.datostabla.length) return [];
        const resultados = table.datostabla.map((e, i) => {
            // VARIABLES
            const index = i;
            const nro_fila = index + 1;
            const organizacion = e.organizacion ? e.organizacion : null;
            const tienda = e.tienda ? e.tienda : null;
            const proveedor = e.proveedor ? e.proveedor : null;
            const id = e.id ? e.id : null;
            const fecha_pago = e.fecha_pago ? e.fecha_pago : null;
            const tipo_mov = e.tipo_mov ? e.tipo_mov : null;
            const monto = e.monto ? +e.monto : null;
            // DATA FOR FILTER
            let data = `${nro_fila}`;
            data += `${organizacion}${tienda}${proveedor}${id}${fecha_pago}${tipo_mov}`
            data += `${formatNumber((+monto).toFixed(2))}`;
            // RETURN VALUE
            return {
                index: index,
                nro_fila: nro_fila,
                organizacion: organizacion,
                tienda: tienda,
                proveedor: proveedor,
                id: id,
                fecha_pago: fecha_pago,
                tipo_mov: tipo_mov,
                monto: +(+monto).toFixed(2),
                data: data,
            }
        });
        return resultados;
    });
    const listPagosPage = computed(() => {
        if (!listPagos.value.length) return [];
        const page_size = table.pageSize;
        const page_number = table.currentPage;
        const array = listPagos.value.slice((page_number - 1) * page_size, page_number * page_size);
        return array;
    })
    const exportarexcel = async () => {
    if (fullscreenLoading.value) return;
    fullscreenLoading.value = true;
    loading_msg.value = "Cargando Datos... Por favor espere";
    const fechaactual = ref(moment().format('lll'));
    try {
        const response = await axios.post(`/excel_pagos`, {
            datos: table.datostabla,
            fecha: fechaactual.value,
            titulo: 'Pagos',
        }, {
            responseType: 'blob' // Indicar que esperamos un blob (archivo binario)
        });

        // Crear un enlace temporal para descargar el blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Pagos.xlsx'); // Nombre del archivo
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
    onMounted(() => {
        cargardatos();
    });
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
    ///////////////////////////////////////////////////
    ///////////////// Modales
    ///////////////////////////////////////////////////
    const modalpago = async (item) => {
        if (fullscreenLoading.value) return;
        loading_msg.value = "Cargando Datos... Por favor espere";
        fullscreenLoading.value = true;
        try {
            const valores = { params: { id_proveedor: id_proveedor, id: item.id, _t: new Date().getTime() } };
            const respuesta = await axios.get(`/export_pagos`, valores);
            const datos_modal_response = respuesta.data
            modal.dato_movimientos = datos_modal_response.movimientos
            modal.dato_mov_afect = datos_modal_response.mov_afect
            modal.dato_registro_banco = datos_modal_response.registro_banco
            modal.monto = formatNumber(modal.dato_registro_banco.monto == null && isNaN(+modal.dato_registro_banco.monto) ? (0).toFixed(2) : (+modal.dato_registro_banco.monto).toFixed(2)) 
            modal.activamodal = true;
            fullscreenLoading.value = false;
            // console.log(modal.dato_movimientos);
        }catch (error) {
            console.warn('Error al exportar:', error)
            fullscreenLoading.value = false;
            if (error.response && error.response.status === 300) {
                fullscreenLoading.value = false;
                let msg = (error.response.data?.message || 'Error al obtener los datos')
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else if (error.response && error.response.status === 500) {
                fullscreenLoading.value = false;
                let msg = 'Intenta nuevamente en unos minutos'
                emit('notification', msg, 'warning', 'Datos faltantes');
            } else {
                fullscreenLoading.value = false
                let msg = error.response.data?.message || 'Error'
                emit('notification', msg, 'warning', 'Error');
            }
        }
    };

    ///////////////////////////////////////////////////
    ///////////////// Calculos
    ///////////////////////////////////////////////////
    // Asegúrate de importar 'h' y 'ElTooltip' en tu componente
// import { h } from 'vue';
// import { ElTooltip } from 'element-plus'; 

    // Asegúrate de importar 'h' y 'ElTooltip' en tu componente
// import { h } from 'vue';
// import { ElTooltip } from 'element-plus'; 

    const getSummaries = ({ columns, data }) => {
    // Array para almacenar los valores de resumen
    const sums = [];
    
    // Lista de propiedades que deben sumarse y llevar tooltip
    const sumProperties = [
        'abono', 
        'monto', 
        'saldo', 
        'retencion', 
        'total', 
        'total_nc'
    ];
    
    // Iterar sobre cada columna
    columns.forEach((column, index) => {
        
        // Columna 1: Etiqueta de resumen ("Totales")
        if (index === 1) {
            const labelText = 'Totales';
            
            // Creamos un VNode con ElTooltip para la etiqueta
            sums[index] = h('div', { 
                style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: help;' 
            }, [
                h(ElTooltip, {
                    content: 'Total de Movimientos', // Contenido que se muestra en el tooltip
                    placement: 'top',
                }, () => h('span', labelText)) // Texto visible en la celda
            ]);
            return;
        }

        const property = column.property;
        
        // Aplicar Tooltip a las Columnas Numéricas Sumadas
        if (sumProperties.includes(property)) {
            
            // 1. Mapear y sumar los valores
            const sumValue = data.map(item => Number(item[property]))
                               .filter(e => !isNaN(+e))
                               .reduce((a,b) => a+b, 0);
                
                // 2. Calculamos el valor formateado (el texto que se ve y el que se usa en el tooltip)
                // Asume que 'formatNumber' devuelve un string con el formato deseado (ej: separadores de miles)
                const formattedSum = formatNumber(sumValue == null || isNaN(+sumValue) ? (0).toFixed(2) : (+sumValue).toFixed(2));
                
                // 3. ENVOLVEMOS EL VALOR EN UN TOOLTIP
                sums[index] = h('div', {
                    // Forzamos el truncamiento y el overflow si el número es inmensamente largo
                    style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'
                }, [
                    h(ElTooltip, {
                        // 👉 USAMOS EL VALOR YA FORMATEADO PARA EL TOOLTIP
                        content: formattedSum, 
                        placement: 'top',
                    }, 
                    // El texto visible en la celda
                    () => h('span', formattedSum))
                ]);
                
        } else if (index === 0) {
            // Columna de índice
            sums[index] = '';
        } else {
            // Dejar otras celdas vacías o poner un guion
            sums[index] = '-';
        }
        });

        // Retornar el array de valores calculados
        return sums;
    };
    
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
    .el-table ::v-deep(.el-table__body-wrapper .el-table__cell > .cell) {
        /* Fuerza a una sola línea */
        white-space: nowrap !important;
        /* Oculta lo que se desborda */
        overflow: hidden !important;
    }
    .el-table ::v-deep(.el-table__header-wrapper th > .cell) {
        white-space: nowrap !important;
    }
    .el-table ::v-deep(.el-table__footer-wrapper .cell) {
        /* Fuerza el texto a una sola línea */
        white-space: nowrap !important;
        /* Oculta lo que se desborda */
        overflow: hidden !important;
        /* Muestra "..." al final */
        text-overflow: ellipsis !important;
    }
    /* Opcional: Para asegurar que los encabezados sigan en una línea */
    .el-table ::v-deep(.el-table__header-wrapper th > .cell) {
        white-space: nowrap !important;
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
