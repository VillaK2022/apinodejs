<template>
    <body style="background-color: white !important;" ref="pdfpago" v-if="!!record.registro_banco">
        <!-- Contenido paginado -->
        <div v-for="(section, sectionIndex) in paginatedContent" :key="sectionIndex">
            <!-- Header fijo para cada página -->
            <header v-if="sectionIndex === 0" style="position: fixed; margin-top: 3%;" class="cabecera">
                <div>
                    <table width="100%" cellspacing="1">
                        <tr>
                            <td colspan="1">
                                <table width="100%" cellspacing="1" class="text-center">
                                    <tr>
                                        <td>
                                            <img src="../assets/img/hKfB4mg9Xk.png" class="logo"
                                                style="width:112px; height:32px; top:0; left:0; padding-top:0;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="2">
                                <table width="50%" style="margin-left: 50%;font-size: 8px;" cellspacing="1">
                                    <tr>
                                        <td><strong>GRUPO: {{ record.registro_banco.organizacion }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>RIF: {{ record.registro_banco.nit }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA: {{ fecha }} - Hora: {{ hora }}</strong></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <br>
                </div>
            </header>
            <header v-if="sectionIndex != 0" class="cabecera">
                <div>
                    <table width="100%" cellspacing="1">
                        <tr>
                            <td colspan="1">
                                <table width="100%" cellspacing="1" class="text-center">
                                    <tr>
                                        <td>
                                            <img src="../assets/img/hKfB4mg9Xk.png" class="logo"
                                                style="width:112px; height:32px; top:0; left:0; padding-top:0;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="2">
                                <table width="50%" style="margin-left: 50%;font-size: 8px;" cellspacing="1">
                                    <tr>
                                        <td><strong>GRUPO: {{ record.registro_banco.organizacion }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>RIF: {{ record.registro_banco.nit }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA: {{ fecha }} - Hora: {{ hora }}</strong></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <br>
                </div>
            </header>
            <main>
                <!-- Información del comprobante (siempre en primera página) -->
                <div v-if="sectionIndex === 0">
                    <table width="100%" cellspacing="1" class="text-center mt-4">
                        <tr>
                            <td class="text-center">
                                <span><strong>COMPROBANTE DE EGRESO</strong></span>
                            </td>
                        </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="1" class="clase_table mb-3">
                        <thead>
                            <tr class="text-center">
                                <th class="clase_bottom" colspan="8">
                                    Información Contable.Este doc. se registró con la tasa: {{
                                        formatNumber(record.registro_banco.tasacambio == null &&
                                        isNaN(+record.registro_banco.tasacambio) ? (0).toFixed(2) :
                                    (+record.registro_banco.tasacambio).toFixed(2)) }}.
                                </th>
                            </tr>
                            <tr>
                                <th align="left">#DOC.:</th>
                                <th align="left">{{ record.registro_banco.id }}</th>
                                <th align="left">PROVEEDOR:</th>
                                <th align="left">{{ record.registro_banco.nombre }}</th>
                                <th align="left">CONCEPTO:</th>
                                <th align="left">{{ record.registro_banco.concepto }}</th>
                                <th align="left">OBSERVACIÓN:</th>
                                <th align="left">{{ record.registro_banco.observ }}</th>
                            </tr>
                            <tr>
                                <th align="left">BANCO PAGA.:</th>
                                <th align="left">{{ record.registro_banco.banco }}</th>
                                <th align="left">#CUENTA:</th>
                                <th align="left">{{ record.registro_banco.cuenta }}</th>
                                <th align="left">BANCO PROV.:</th>
                                <th align="left">{{ record.registro_banco.banco_prov }}</th>
                                <th align="left">#CUENTA:</th>
                                <th align="left">{{ record.registro_banco.cuenta_prov }}</th>
                            </tr>
                            <tr>
                                <th align="left">#PROPUESTA:</th>
                                <th align="left">{{ record.registro_banco.propuesta_id }}</th>
                                <th align="left">F. PAGO:</th>
                                <th align="left">{{ moment(record.registro_banco.fecha_pago).format("DD-MM-YYYY") }}
                                </th>
                                <th align="left">USUARIO:</th>
                                <th align="left">{{ record.registro_banco.usuario }}</th>
                                <th align="left">MONTO:</th>
                                <th align="left">
                                    {{ formatNumber(record.registro_banco.monto == null &&
                                        isNaN(+record.registro_banco.monto) ? (0).toFixed(2) :
                                    (+record.registro_banco.monto).toFixed(2)) }}
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <br>
                </div>
                <!-- Tabla de detalles con paginación -->
                <table width="100%" cellpadding="0" cellspacing="1" class="clase_table mb-2">
                    <thead>
                        <tr class="text-center">
                            <th class="clase_bottom" colspan="11">
                                Información de detalle
                            </th>
                        </tr>
                        <tr>
                            <th class="clase_bottom text-center" style="width: 8px; padding:0;">#</th>
                            <th class="clase_bottom text-center">Tipo</th>
                            <th class="clase_bottom text-center">#Factura</th>
                            <th class="clase_bottom text-center">Fecha Registro</th>
                            <th class="clase_bottom text-center">Fecha Emision</th>
                            <th class="clase_bottom text-center">Total</th>
                            <th class="clase_bottom text-center">Retención</th>
                            <th class="clase_bottom text-center">N. Cr&eacute;dito</th>
                            <th class="clase_bottom text-center">Abono</th>
                            <th class="clase_bottom text-center">Pago</th>
                            <th class="clase_bottom text-center">Saldo Pend.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(detalle, index) in section" :key="index">
                            <td class="mb-2 text-center">{{ (sectionIndex * itemsPerPage) + index + 1 }}</td>
                            <td class="mb-2 text-center">{{ detalle.tipo }}</td>
                            <td class="mb-2 text-center">{{ detalle.numero_fact }}</td>
                            <td class="mb-2 text-center">{{ moment(detalle.fecha_registro).format('DD-MM-YYYY') }}</td>
                            <td class="mb-2 text-center">{{ moment(detalle.fecha_factura).format('DD-MM-YYYY') }}</td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.total == null && isNaN(+detalle.total) ? (0).toFixed(2) :
                                    (+detalle.total).toFixed(2)) }}
                            </td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.retencion == null && isNaN(+detalle.retencion) ? (0).toFixed(2)
                                    : (+detalle.retencion).toFixed(2)) }}
                            </td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.total_nc == null && isNaN(+detalle.total_nc) ? (0).toFixed(2) :
                                    (+detalle.total_nc).toFixed(2)) }}
                            </td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.abono == null && isNaN(+detalle.abono) ? (0).toFixed(2) :
                                    (+detalle.abono).toFixed(2)) }}
                            </td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.monto == null && isNaN(+detalle.monto) ? (0).toFixed(2) :
                                    (+detalle.monto).toFixed(2)) }}
                            </td>
                            <td class="mb-2 text-end">
                                {{ formatNumber(detalle.saldo == null && isNaN(+detalle.saldo) ? (0).toFixed(2) :
                                    (+detalle.saldo).toFixed(2)) }}
                            </td>
                        </tr>
                        <!-- Totales en la última página -->
                        <tr v-if="!(sectionIndex < paginatedContent.length - 1)">
                            <th class="text-end" colspan="8">Total: </th>
                            <th class="text-end clase_bottom">
                                {{formatNumber((record.movimientos.map(e => +e.abono).filter(e =>
                                    !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                            </th>
                            <th class="text-end clase_bottom">
                                {{formatNumber((record.movimientos.map(e => +e.monto).filter(e =>
                                    !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                            </th>
                            <th class="text-end clase_bottom">
                                {{formatNumber((record.movimientos.map(e => +e.saldo).filter(e =>
                                    !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                            </th>
                        </tr>

                    </tbody>
                </table>
                <!-- Filas vacías para completar hasta 15 -->
                <table>
                    <tbody>
                        <tr v-for="n in emptyRows(sectionIndex)" :key="'empty-' + n" class="empty-row">
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
                <!-- Footer fijo para cada página -->
                <footer v-if="sectionIndex === 0">
                    <table width="100%" style="font-size: 9px;" cellpadding="3" cellspacing="3">
                        <tr>
                            <td align="left"><strong>FIRMA Y SELLO DEL BENEFICIARIO</strong></td>
                            <td align="left" colspan="3"><strong></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong></strong></td>
                        </tr>
                        <tr>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>RIF / NIT:</strong></td>
                            <td align="left"><strong>ELABORO:</strong></td>
                            <td align="left"><strong>REVISO:</strong></td>
                            <td align="left"><strong>APROBO:</strong></td>
                        </tr>
                    </table>
                    <span class="mt-3" style="font-size: 8px;">
                        <strong>Copyright &copy; 2022 Grupo de Empresas {{ record.registro_banco.organizacion }} </strong>
                    </span>
                </footer>
                <footer class="document-footer" v-else>
                    <table width="100%" style="font-size: 9px;" cellpadding="3" cellspacing="3">
                        <tr>
                            <td align="left"><strong>FIRMA Y SELLO DEL BENEFICIARIO</strong></td>
                            <td align="left" colspan="3"><strong></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong></strong></td>
                        </tr>
                        <tr>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>RIF / NIT:</strong></td>
                            <td align="left"><strong>ELABORO:</strong></td>
                            <td align="left"><strong>REVISO:</strong></td>
                            <td align="left"><strong>APROBO:</strong></td>
                        </tr>
                    </table>
                    <span class="mt-3" style="font-size: 8px;">
                        <strong>Copyright &copy; 2022 Grupo de Empresas {{ record.registro_banco.organizacion }} </strong>
                    </span>
                </footer>
            </main>
            <!-- Page break después de cada sección excepto la última -->
            <div v-if="sectionIndex < paginatedContent.length - 1" class="page-break"></div>
            <div v-else class="page-break"></div>
        </div>

        <!-- tabla de mov_afect -->
        <div v-for="(section2, sectionIndex2) in paginatedContent2" :key="sectionIndex2">
            <header v-if="sectionIndex2 === 0" class="cabecera">
                <div>
                    <table width="100%" cellspacing="1">
                        <tr>
                            <td colspan="1">
                                <table width="100%" cellspacing="1" class="text-center">
                                    <tr>
                                        <td>
                                            <img src="../assets/img/hKfB4mg9Xk.png" class="logo"
                                                style="width:112px; height:32px; top:0; left:0; padding-top:0;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="2">
                                <table width="50%" style="margin-left: 50%;font-size: 8px;" cellspacing="1">
                                    <tr>
                                        <td><strong>GRUPO: {{ record.registro_banco.organizacion }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>RIF: {{ record.registro_banco.nit }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA: {{ fecha }} - Hora: {{ hora }}</strong></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <br>
                </div>
            </header>
            <header v-if="sectionIndex2 != 0" class="cabecera mt-2">
                <div>
                    <table width="100%" cellspacing="1">
                        <tr>
                            <td colspan="1">
                                <table width="100%" cellspacing="1" class="text-center">
                                    <tr>
                                        <td>
                                            <img src="../assets/img/hKfB4mg9Xk.png" class="logo"
                                                style="width:112px; height:32px; top:0; left:0; padding-top:0;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="2">
                                <table width="50%" style="margin-left: 50%;font-size: 8px;" cellspacing="1">
                                    <tr>
                                        <td><strong>GRUPO: {{ record.registro_banco.organizacion }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>RIF: {{ record.registro_banco.nit }}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA: {{ fecha }} - Hora: {{ hora }}</strong></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <br>
                </div>
            </header>
            <main>
                <table width="100%" cellpadding="0" cellspacing="1" class="clase_table mb-2">
                    <thead> 
                        <tr class="text-center">
                            <th class="clase_bottom" colspan="11">
                                Documentos Aplicados.
                            </th>
                        </tr>
                        <tr>
                            <th class="clase_bottom text-center" style="width: 8px; padding:0;">#</th>
                            <th class="text-center clase_bottom" >Tipo</th>
                            <th class="text-center clase_bottom" >#Número</th>
                            <th class="text-center clase_bottom" >#Doc. Afectado</th>
                            <th class="text-center clase_bottom" >Fecha</th>
                            <th class="text-center clase_bottom" >#Notas Internas</th>
                            <th class="text-center clase_bottom" >Observacion</th>
                            <th class="text-center clase_bottom" >Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, index2) in section2" :key="index2">
                            <td class="mb-2 text-center">{{ (sectionIndex2 * itemsPerPage2) + index2 + 1}}</td>
                            <td class="text-center">{{ value.tipo_doc }}</td>
                            <td class="text-center">{{ value.num_factura }}</td>
                            <td class="text-center">{{ value.doc_afecta }}</td>
                            <td class="text-center">{{ moment(value.fecha).format('DD-MM-YYYY') }}</td>
                            <td class="text-center">{{ value.notadevo_id }}</td>
                            <td class="text-center">{{ value.observacion }}</td>
                            <td class="text-center">{{ formatNumber(value.total == null && isNaN(+value.total) ? (0).toFixed(2) : (+value.total).toFixed(2)) }}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr v-for="n in emptyRows2(sectionIndex2)" :key="'empty-' + n" class="empty-row">
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-center">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                            <td class="mb-2 text-end">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
                <footer v-if="sectionIndex2 === 0">
                    <table width="100%" style="font-size: 9px;" cellpadding="3" cellspacing="3">
                        <tr>
                            <td align="left"><strong>FIRMA Y SELLO DEL BENEFICIARIO</strong></td>
                            <td align="left" colspan="3"><strong></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong></strong></td>
                        </tr>
                        <tr>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>RIF / NIT:</strong></td>
                            <td align="left"><strong>ELABORO:</strong></td>
                            <td align="left"><strong>REVISO:</strong></td>
                            <td align="left"><strong>APROBO:</strong></td>
                        </tr>
                    </table>
                    <span class="mt-3" style="font-size: 8px;">
                        <strong>Copyright &copy; 2022 Grupo de Empresas {{ record.registro_banco.organizacion }} </strong>
                    </span>
                </footer>
                <footer class="document-footer" v-else>
                    <table width="100%" style="font-size: 9px;" cellpadding="3" cellspacing="3">
                        <tr>
                            <td align="left"><strong>FIRMA Y SELLO DEL BENEFICIARIO</strong></td>
                            <td align="left" colspan="3"><strong></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong></strong></td>
                        </tr>
                        <tr>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                            <td class="text-center"><strong>__________________________________________</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>RIF / NIT:</strong></td>
                            <td align="left"><strong>ELABORO:</strong></td>
                            <td align="left"><strong>REVISO:</strong></td>
                            <td align="left"><strong>APROBO:</strong></td>
                        </tr>
                    </table>
                    <span class="mt-3" style="font-size: 8px;">
                        <strong>Copyright &copy; 2022 Grupo de Empresas {{ record.registro_banco.organizacion }} </strong>
                    </span>
                </footer>
            </main>
            <div v-if="sectionIndex2 < paginatedContent2.length - 1" class="page-break"></div>
        </div>
    </body>
</template>

<style scoped>
    /* Footer para la última página con firmas */
    .document-footer {
        position: static;
        margin-top: 2cm;
        /* Usar unidades absolutas en lugar de porcentajes */
        page-break-before: avoid;
        break-before: avoid;
    }

    /* Footer para páginas intermedias */
    .page-footer {
        position: static;
        margin-top: 1cm;
        text-align: center;
    }

    /* Asegurar que el footer esté al final de la página */
    .pdf-page {
        position: relative;
        min-height: 29.7cm;
        /* Altura A4 */
        display: flex;
        flex-direction: column;
    }

    .main-content {
        flex: 1;
    }

    /* Estilos para impresión */
    @media print {
        .document-footer {
            margin-top: 3cm;
            /* Más espacio en impresión */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page-footer {
            margin-top: 1.5cm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }

    @page {
        margin: .4rem;
        margin-top: 1.5cm;
        margin-bottom: 1.5cm;
        padding: .1rem;
        font-size: .5rem !important;
    }

    body {
        margin: 0px;
    }

    * {
        font-family: verdana, arial, sans-serif;
    }

    header {
        /* position: relative; */
        top: -30px;
        left: 0px;
        right: 0px;
    }

    footer {
        bottom: 70px;
        left: 0px;
        right: 0px;
        background-color: white;
        text-align: center;
        margin-left: .4cm !important;
        margin-right: .4cm !important;
    }

    p {
        page-break-after: always;
    }

    p:last-child {
        page-break-after: never;
    }

    /* Page break CSS para división automática */
    .page-break {
        page-break-after: always;
        break-after: page;
        height: 0;
        margin: 0;
        padding: 0;
        display: block;
    }

    .pdf-section {
        page-break-inside: avoid;
        break-inside: avoid;
    }

    main {
        position: relative;
        top: 15px !important;
        bottom: 110px !important;
        left: 0px !important;
        right: 0px !important;
        margin-left: .4cm !important;
        margin-right: .4cm !important;
        margin-bottom: 1.5cm !important;
    }

    .cabecera {
        background-color: #FEFEFE;
        color: #000000;
        padding: 2rem;
        padding-top: .2rem;
        padding-bottom: 0px;
    }

    .cabecera .logo {
        margin: 5px;
    }

    .cabecera table {
        padding: 1px;
        margin-bottom: .2rem;
    }

    table {
        font-size: x-small
    }

    tfoot tr td {
        font-weight: bold;
        font-size: x-small;
    }

    .clase_table {
        border-collapse: separate;
        border-spacing: 20px 5px;
        border: 1px solid black;
        border-radius: 20px;
        -moz-border-radius: 20px;
        padding: 2px;
    }

    .total {
        width: 100%;
        text-align: right;
        padding-right: 2rem !important;
        font-size: 1.5rem !important;
        /* position: fixed; */
        bottom: 15px;
    }

    .clase_top {
        background-color: #FEFEFE;
        border-top: 0.2px solid #000;
    }

    .clase_bottom {
        background-color: #EBEDEF;
        border-bottom: 0.2px solid #000;
    }

    /* Estilos específicos para impresión/PDF */
    @media print {
        .page-break {
            page-break-after: always;
        }

        .pdf-section {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }
    }
</style>

<script setup lang="ts">
    import { ref, reactive, Ref, inject, onMounted, computed } from 'vue';
    import moment from 'moment';
    interface PdfDatos {
        [key: string]: any;
    }
    const formatNumber = inject('formatNumber') as (value: any) => string;
    const pdfpago: Ref<HTMLElement | null> = ref(null);

    // Configuración de paginación
    let itemsPerPage = ref(15); // Ajusta según la altura de tus filas
    const maxHeightPerPage = 600;
    let itemsPerPage2 = ref(15); // Ajusta según la altura de tus filas
    const maxHeightPerPage2 = 600;

    const record = reactive({
        movimientos: [] as any[],
        registro_banco: null as any,
        mov_afect: [] as any[],
    });
    const fecha = moment().format('DD-MM-YYYY');
    const hora = moment().format('LTS'); 

    // Computed para paginación automática
    const paginatedContent = computed(() => {
        if (!record.movimientos || record.movimientos.length === 0) {
            return [];
        }

        const pages = [];
        for (let i = 0; i < record.movimientos.length; i += itemsPerPage.value) {
            pages.push(record.movimientos.slice(i, i + itemsPerPage.value));
        }
        return pages;
    });
    const paginatedContent2 = computed(() => {
        if (!record.mov_afect || record.mov_afect.length === 0) {
            return [];
        }

        const pages2 = [];
        for (let i = 0; i < record.mov_afect.length; i += itemsPerPage2.value) {
            pages2.push(record.mov_afect.slice(i, i + itemsPerPage2.value));
        }
        return pages2;
    });

    // Función para calcular items por página basado en altura
    const calculateItemsPerPage = () => {
        // Ajusta según la altura de tus filas en la tabla
        const estimatedRowHeight = 25; // Altura estimada por fila en píxeles
        const availableHeight = maxHeightPerPage - 200; // Restar espacio para header y footer
        itemsPerPage.value = Math.max(5, Math.floor(availableHeight / estimatedRowHeight));
    };
    const calculateItemsPerPage2 = () => {
        // Ajusta según la altura de tus filas en la tabla
        const estimatedRowHeight2 = 25; // Altura estimada por fila en píxeles
        const availableHeight2 = maxHeightPerPage2 - 200; // Restar espacio para header y footer
        itemsPerPage2.value = Math.max(5, Math.floor(availableHeight2 / estimatedRowHeight2));
    };
    // Funciones para actualizar datos
    const datos_movimientos = (nuevosDatos: any[]): void => {
        record.movimientos = nuevosDatos;
        calculateItemsPerPage(); // Recalcular cuando cambien los datos
    };

    const datos_registro_banco = (nuevosDatos: any): void => {
        record.registro_banco = nuevosDatos;
    };

    const datos_mov_afect = (nuevosDatos: any[]): void => {
        record.mov_afect = nuevosDatos;
        calculateItemsPerPage2(); // Recalcular cuando cambien los datos
    };
    const emptyRows = (sectionIndex: number) => {
        // Solo agregar filas vacías en la última página
        if (sectionIndex < paginatedContent.value.length - 1) {
            return 0;
        }

        const currentItems = paginatedContent.value[sectionIndex]?.length || 0;
        const targetRows = itemsPerPage.value;
        const remainingRows = targetRows - currentItems;

        // Asegurar que no sea negativo
        return Math.max(0, remainingRows);
    };
    const emptyRows2 = (sectionIndex2: number) => {
        // Solo agregar filas vacías en la última página
        if (sectionIndex2 < paginatedContent2.value.length - 1) {
            return 0;
        }

        const currentItems = paginatedContent2.value[sectionIndex2]?.length || 0;
        const targetRows = itemsPerPage2.value;
        const remainingRows = targetRows - currentItems;

        // Asegurar que no sea negativo
        return Math.max(0, remainingRows);
    };

    onMounted(() => {
        calculateItemsPerPage();
        calculateItemsPerPage2();
    });

    defineExpose({
        datos_movimientos,
        datos_registro_banco,
        datos_mov_afect,
        // Exponer la función para generar PDF
    });
</script>