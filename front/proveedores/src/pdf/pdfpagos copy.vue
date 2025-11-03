<template>
    <body style="background-color: white !important;" ref="pdfpago" v-if="!!record.registro_banco">
    <div v-for="(section, sectionIndex) in paginatedContent" :key="sectionIndex" class="pdf-section">
        <header>
            <div style="margin-top: 3%;" class="cabecera">
                <table width="100%" cellpadding="0" cellspacing="1">
                    <tr>
                        <td colspan="1">
                            <table width="100%" cellpadding="0" cellspacing="1" class="text-center">
                                <tr>
                                    <td>
                                        <!-- <img v-if="record.registro_banco.id_organizacion == 4" src="../assets/img/J-30526930-0.png" style="width:112px; height:32px; top:0; left:0; padding-top:0;" > -->
                                        <img src="../assets/img/hKfB4mg9Xk.png" class="logo"
                                            style="width:112px; height:32px; top:0; left:0; padding-top:0;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td colspan="2">
                            <table width="50%" style="margin-left: 50%; margin-bottom: 3px; font-size: 8px;"
                                cellspacing="1">
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
                <br></br>
            </div>
        </header>
        <main>
            <table width="100%" cellspacing="1" align="center">
                <tr>
                    <td align="center">
                        <span><strong>COMPROBANTE DE EGRESO</strong></span>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="1"
                
                class="clase_table mb-3 mt-3">
                <thead>
                    <tr align="center">
                        <th class="clase_bottom" colspan="8">Información Contable.Este doc. se registró con la tasa: {{ record.registro_banco.tasacambio }}.
                        </th>
                    </tr>
                    <tr>
                        <th align="left">#DOC.:
                        </th>
                        <th align="left">{{ record.registro_banco.id }}
                        </th>
                        <th align="left">PROVEEDOR:
                        </th>
                        <th align="left">{{ record.registro_banco.nombre }}
                        </th>
                        <th align="left">CONCEPTO:
                        </th>
                        <th align="left">{{ record.registro_banco.concepto }}
                        </th>
                        <th align="left">OBSERVACIÓN:
                        </th>
                        <th align="left">{{ record.registro_banco.observ }}
                        </th>
                    </tr>
                    <tr>
                        <th align="left">BANCO PAGA.:
                        </th>
                        <th align="left">{{ record.registro_banco.banco }}
                        </th>
                        <th align="left">#CUENTA:
                        </th>
                        <th align="left">{{ record.registro_banco.cuenta }}
                        </th>
                        <th align="left">BANCO PROV.:
                        </th>
                        <th align="left">{{ record.registro_banco.banco_prov }}
                        </th>
                        <th align="left">#CUENTA:
                        </th>
                        <th align="left">{{ record.registro_banco.cuenta_prov }}
                        </th>
                    </tr>
                    <tr>
                        <th align="left">#PROPUESTA:
                        </th>
                        <th align="left">{{ record.registro_banco.propuesta_id }}
                        </th>
                        <th align="left">F. PAGO:
                        </th>
                        <th align="left">{{ moment(record.registro_banco.fecha_pago).format("DD-MM-YYYY") }}
                        </th>
                        <th align="left">USUARIO:
                        </th>
                        <th align="left">{{ record.registro_banco.usuario }}
                        </th>
                        <th align="left">MONTO:
                        </th>
                        <th align="left">{{ formatNumber(record.registro_banco.monto == null && isNaN(+record.registro_banco.monto) ?    (0).toFixed(2) : (+record.registro_banco.monto).toFixed(2)) }}
                        </th>
                    </tr>
                </thead>
            </table>
            <br>
            <table width="100%" cellpadding="0" cellspacing="1" class="clase_table">
                <thead>
                    <tr align="center">
                        <th class="clase_bottom" colspan="11">Información de Detalle.
                        </th>
                    </tr>
                    <tr>
                        <th class="clase_bottom text-center" style="width: 10px; padding:0;">#</th>
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
                    <tr v-for="(detalle, index) in record.movimientos" :key="index">
                        <td class="mb-2 text-center">{{ +index + 1 }} </td>
                        <td class="mb-2 text-center"> {{ detalle.tipo }} </td>
                        <td class="mb-2 text-center">{{ detalle.numero_fact }}</td>
                        <td class="mb-2 text-center">{{ moment(detalle.fecha_registro).format('DD-MM-YYYY') }}</td>
                        <td class="mb-2 text-center">{{ moment(detalle.fecha_factura).format('DD-MM-YYYY') }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.total == null && isNaN(+detalle.total) ? (0).toFixed(2) : (+detalle.total).toFixed(2)) }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.retencion == null && isNaN(+detalle.retencion) ? (0).toFixed(2) : (+detalle.retencion).toFixed(2)) }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.total_nc == null && isNaN(+detalle.total_nc) ? (0).toFixed(2) : (+detalle.total_nc).toFixed(2)) }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.abono == null && isNaN(+detalle.abono) ? (0).toFixed(2) : (+detalle.abono).toFixed(2)) }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.monto == null && isNaN(+detalle.monto) ? (0).toFixed(2) : (+detalle.monto).toFixed(2)) }}</td>
                        <td class="mb-2 text-end">{{ formatNumber(detalle.saldo == null && isNaN(+detalle.saldo) ? (0).toFixed(2) : (+detalle.saldo).toFixed(2)) }}</td>
                    </tr>
                    <tr>
                        <th class="text-end" colspan="8">Total: </th>
                        <th class="text-end clase_bottom">{{formatNumber((record.movimientos.map(e => +e.abono).filter(e => !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                        </th>
                        <th class="text-end clase_bottom"> {{formatNumber((record.movimientos.map(e => +e.monto).filter(e => !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                        </th>
                        <th class="text-end clase_bottom"> {{formatNumber((record.movimientos.map(e => +e.saldo).filter(e => !isNaN(+e)).reduce((a, b) => a + b, 0)).toFixed(2)) }}
                        </th>
                    </tr>
                </tbody>
            </table>
        </main>
        <!-- <footer >
        <table width="100%" style="font-size: 9px;" cellpadding="3" cellspacing="3">
            <tr>
                <td align="left"><strong>FIRMA Y SELLO DEL BENEFICIARIO</strong></td>
                <td align="left" colspan="3"><strong></strong></td>
            </tr>
            <tr>
                <td colspan="4"><strong></strong></td>
            </tr>
            <tr>
                <td align="center"><strong>__________________________________________</strong></td>
                <td align="center"><strong>__________________________________________</strong></td>
                <td align="center"><strong>__________________________________________</strong></td>
                <td align="center"><strong>__________________________________________</strong></td>
            </tr>
            <tr>
                <td align="left"><strong>RIF / NIT:</strong></td>
                <td align="left"><strong>ELABORO:</strong></td>
                <td align="left"><strong>REVISO:</strong></td>
                <td align="left"><strong>APROBO:</strong></td>
            </tr>
        </table>
        <br>
        <span style="font-size: 8px;"><strong>Copyright &copy; 2022 Grupo de Empresas {{ record.registro_banco.organizacion }}</strong></span>
        </footer> -->
    </div>
    </body>
</template>
<style scoped>
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
    position: fixed;
    top: -30px;
    left: 0px;
    right: 0px;
}

footer {
    position: fixed;
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

.page-break {
    page-break-after: always;
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
    border-spacing: 10px 5px;
    border: 1px solid black;
    border-radius: 20px;
    -moz-border-radius: 20px;
    padding: 2px;
}

.total {
    width: 100%;
    /* background-color: #FFF; */
    text-align: right;
    padding-right: 2rem !important;
    font-size: 1.5rem !important;
    position: fixed;
    bottom: 15px;
}

.clase_top {
    background-color: #FEFEFE;
    border-top: 0.2px solid #000;
    /* border-bottom: 1px solid #000; */
    /* border-left: 1px solid #000; */
    /* border-right: 1px solid #000; */
}

.clase_bottom {
    background-color: #EBEDEF;
    /* border-top: 0.2px solid #000; */
    border-bottom: 0.2px solid #000;
    /* border-left: 1px solid #000; */
    /* border-right: 1px solid #000; */
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
let itemsPerPage = 4
let maxHeightPerPage = 700
const record = reactive({
    movimientos: [],
    registro_banco: null,
    mov_afect: [],
});
const fecha = moment().format('DD-MM-YYYY')
const hora: string = moment().format('h:mm:ss a');
// Función para actualizar los datos del PDF
const datos_movimientos = (nuevosDatos): void => {
    // Object.assign(movimientos, nuevosDatos);
    record.movimientos = nuevosDatos;
};
const datos_registro_banco = (nuevosDatos): void => {
    // Object.assign(record.registro_banco, nuevosDatos);
    record.registro_banco = nuevosDatos;

};
const datos_mov_afect = (nuevosDatos): void => {
    // Object.assign(record.mov_afect, nuevosDatos);
    record.mov_afect = nuevosDatos;
};
const paginatedContent= computed(() => {
      const pages = []
      for (let i = 0; i < record.registro_banco.length; i += itemsPerPage) {
        pages.push(record.registro_banco.slice(i, i + itemsPerPage))
      }
      return pages
})

const calculateItemsPerPage = async () => {
      // Puedes ajustar esta lógica según la altura real de tus elementos
    const estimatedItemHeight = 120 // Altura estimada en píxeles por item
    const availableHeight = maxHeightPerPage
    itemsPerPage = Math.floor(availableHeight / estimatedItemHeight)
}
onMounted (() => {
    calculateItemsPerPage()
});
defineExpose({
    datos_movimientos,
    datos_registro_banco,
    datos_mov_afect
});
</script>