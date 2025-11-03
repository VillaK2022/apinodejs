<template>
    <body style="background-color: white !important;" ref="pdfretencion" v-if="!!datos">
        <header>
            <div style="margin-top: 3%;" class="cabecera">
                <table width="100%" cellspacing="1">
                    <tr>
                        <td colspan="1">
                            <table width="100%" style="margin-left: 40%;" cellspacing="1" align="center">
                                <tr>
                                    <td colspan="1">
                                        <img src="../assets/img/logo.png" alt="" style="width: 70px; height: 40px;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td colspan="2">
                            <table width="50%" style="margin-left: 75%; font-size: 7px;" cellspacing="1">
                                <tr>
                                    <td><strong>GRUPO: {{ datos.organizacion }}</strong></td>
                                </tr>
                                <tr>
                                    <td><strong>RIF: {{ datos.nit_org }}</strong></td>
                                </tr>
                                <tr>
                                    <td><strong>Fecha: {{ fechaActual }} - Hora: {{ hora }} </strong></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </header>
        <main>
            <table width="50%" style="font-size: 8px !important; " cellpadding="2" cellspacing="2" border="1"
                align="center">
                <tr>
                    <td style="font-weight: bold !important;" align="center">Número de Comprobante:</td>
                    <td style="font-weight: bold !important;" align="center">Periodo Fiscal:</td>
                    <td style="font-weight: bold !important;" align="center">Fecha de Emisión:</td>
                </tr>
                <tr>
                    <td align="center"><strong>{{ datos.doc}}</strong></td>
                    <td align="center"><strong>Año: {{ moment(datos.fecha_emision).format("YYYY") }} Mes: {{ moment(datos.fecha_emision).format("MM")}}</strong></td>
                    <td align="center"><strong>{{ moment(datos.fecha).format("DD-MM-YYYY")}} </strong></td>
                </tr>
            </table>
            <br>
            <table width="100%" cellpadding="0" cellspacing="0" align="center">
                <tr>
                    <td align="center">
                        <h1 class="letra-grande"><strong>COMPROBANTE DE RETENCIÓN DEL IMPUESTO AL VALOR
                                AGREGADO</strong></h1>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <span style="font-family: 7px; font-weight: bold;">Ley del Impuesto al Valor Agregado - Art 11:
                            "Seran responsables del pago del
                            Impuesto en calidad de agentes de retención, los compradores o adquirientes de
                            determinados bienes muebles y los receptores de ciertos designe como tal".</span>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="position: relative;" class="clase_table">
                <tr>
                    <td>
                        <table width="100%" cellpadding="3" cellspacing="3" style="position: relative; font-size: 10px;"
                            class="clase_table">
                            <tr>
                                <td align="left" colspan="2">
                                    <h1 class="letra-grande"><strong>Datos del Contribuyente</strong></h1>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>NOMBRE O RAZÓN SOCIAL: </strong></td>
                                <td>{{ datos.razon_social_proveedor }}</td>
                            </tr>
                            <tr>
                                <td><strong>NÚMERO DE RIF: </strong></td>
                                <td>{{ datos.ci2_proveedor }}</td>
                            </tr>
                            <tr>
                                <td><strong>DIRECCIÓN:</strong></td>
                                <td>{{ datos.direccion_proveedor }}</td>
                            </tr>
                            <tr>
                                <td><strong>NÚMERO DE TELÉFONO: </strong></td>
                                <td>{{ datos.telefono_proveedor }}</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table width="100%" cellpadding="3" cellspacing="3" style="position: relative; font-size: 10px;"
                            class="clase_table">
                            <tr>
                                <td align="left" colspan="2">
                                    <h1 class="letra-grande"><strong>Datos del Agente de Retención</strong></h1>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>NOMBRE O RAZÓN SOCIAL: </strong></td>
                                <td>{{ datos.organizacion }}</td>
                            </tr>
                            <tr>
                                <td><strong>NÚMERO DE RIF: </strong></td>
                                <td>{{ datos.nit_org }}</td>
                            </tr>
                            <tr>
                                <td><strong>DIRECCIÓN: </strong></td>
                                <td>{{ datos.direccion_organizacion }}</td>
                            </tr>
                            <tr>
                                <td><strong>NÚMERO DE TELÉFONO: </strong></td>
                                <td>{{ datos.telefono_organizacion }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <br></br>
            <table width="100%" cellpadding="1" cellspacing="1" style="position: relative;">
                <thead style="background-color: lightgray;">
                    <tr>
                        <th class="text-center">Fecha de Documento</th>
                        <th class="text-center">Tipo de Documento</th>
                        <th class="text-center" colspan="2">Número de Factura</th>
                        <th class="text-center" colspan="2">Número Control de Factura</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center"><span>{{ datos.fecha_emision }}</span></td>
                        <td class="text-center"><span>{{ datos.tipo_doc }}</span></td>
                        <td class="text-center" colspan="2"><span>{{ datos.factura_num }}</span></td>
                        <td class="text-center" colspan="2"><span>{{ datos.nro_control }}</span></td>
                    </tr>
                </tbody>
            </table>
            <br>
            <table width="100%" cellpadding="1" cellspacing="1" style="position: relative;">
                <thead style="background-color: lightgray;">
                    <tr>
                        <th class="text-center">Monto Total</th>
                        <th class="text-center">Monto Exento</th>
                        <th class="text-center">Monto Base IVA</th>
                        <th class="text-center">% IVA</th>
                        <th class="text-center">Monto IVA</th>
                        <th class="text-center">% Retención</th>
                        <th class="text-center">IVA Retenido</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(detalle, index) in datos.detalles" :key="index">
                        <td class="text-end">{{ formatNumber(detalle.total.toFixed(2)) }}</td>
                        <td class="text-end">{{ formatNumber(detalle.exento.toFixed(2)) }}</td>
                        <td class="text-end">{{ formatNumber(detalle.subtotal.toFixed(2)) }}</td>
                        <td class="text-end">{{ formatNumber(detalle.alicuota.toFixed(2)) }}</td>
                        <td class="text-end">{{ formatNumber(detalle.impuesto.toFixed(2)) }}</td>
                        <td class="text-end">{{ formatNumber(detalle.porc_renten.toFixed(2)) }}%</td>
                        <td class="text-end">{{ formatNumber(detalle.retencion.toFixed(2)) }}</td>
                    </tr>
                    <br>
                    <tr>
                        <td class="text-end">
                            ________________
                        </td>
                        <td class="text-end">
                            ________________
                        </td>
                        <td class="text-end">
                            ________________
                        </td>
                        <td class="text-end">
                        </td>
                        <td class="text-end">
                            ________________
                        </td>
                        <td></td>
                        <td class="text-end">
                            ________________
                        </td>
                    </tr>
                    <br>
                    <tr v-if="!!datos.detalles">
                        <td class="text-end" style="font-weight: bold;">{{formatNumber((datos.detalles.map(e => +e.total).filter(e => !isNaN(e)).reduce((a, b)=> a+b, 0)).toFixed(2)) }}</td>
                        <td class="text-end" style="font-weight: bold;">{{formatNumber((datos.detalles.map(e => +e.exento).filter(e => !isNaN(e)).reduce((a, b) => a+b, 0)).toFixed(2)) }}</td>
                        <td class="text-end" style="font-weight: bold;">{{formatNumber((datos.detalles.map(e => +e.subtotal).filter(e => !isNaN(e)).reduce((a, b) => a+b, 0)).toFixed(2)) }}</td>
                        <td class="text-end" style="font-weight: bold;"></td>
                        <td class="text-end" style="font-weight: bold;">{{formatNumber((datos.detalles.map(e => +e.impuesto).filter(e => !isNaN(e)).reduce((a, b) => a+b, 0)).toFixed(2)) }}</td>
                        <td class="text-end" style="font-weight: bold;"></td>
                        <td class="text-end" style="font-weight: bold;">{{formatNumber((datos.detalles.map(e => +e.retencion).filter(e => !isNaN(e)).reduce((a, b) => a+b, 0)).toFixed(2)) }}</td>
                    </tr>
                </tbody>
            </table>
        </main>
        <footer style="margin-top: 30%;">
            <table style="font-size: 8px !important;" width="100%" cellpadding="3" cellspacing="3">
                <tr>
                    <td align="center">
                        <img v-if="datos.organizacion_id == 2" src="../assets/img/J-31131156-4.png"
                            style="width:128px; height:58px;">
                        <img v-if="datos.organizacion_id == 4" src="../assets/img/J-30526930-0.png"
                            style="width:128px; height:58px;">
                    </td>
                    <td></td>
                </tr>
                <tr>

                    <td align="center">
                        <strong>______________________________________________________________________</strong>
                    </td>
                    <td align="left"><strong>RECIBIDO CONFORME: __________________________________________</strong></td>
                </tr>
                <tr>
                    <td align="center"><strong>FIRMA Y SELLO DEL AGENTE DE RETENCIÓN</strong></td>
                    <td align="left"><strong>FECHA DE ENTREGA: ____________________________________________</strong>
                    </td>
                </tr>
            </table>
        </footer>
    </body>
</template>
<script setup lang="ts">
import { ref, reactive, computed, Ref } from 'vue';
import moment from 'moment';
import { format } from 'crypto-js';
interface PdfDatos {
    [key: string]: any;
}
const pdfretencion: Ref<HTMLElement | null> = ref(null);
const datos = reactive<PdfDatos>({});
// Función para actualizar los datos del PDF
const actualizarDatosPdf = (nuevosDatos: PdfDatos): void => {
    Object.assign(datos, nuevosDatos);
};
defineExpose({
    actualizarDatosPdf
});
const fechaActual: string = moment().format('DD-MM-YYYY');
const hora: string = moment().format('h:mm:ss a');
const formatNumber = (event) => {
    if (event.target) {
        // formatea valor de inputs
        let val = event.target.value;
        val = val
            .toString()
            .replace(
                /[^0-9\-]/g,
                ""
            ) /* reemplaza todo lo que no sea numeros, excepto los guiones (-) para las cifras negativas */
            // .replace(/\D/g, "") /* reemplaza todo lo que no sea digito, incluyendo los guiones (-) */
            .replace(/([0-9])([0-9]{2})$/, `$1,$2`)
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, `.`);
        event.target.value = val;
        return val;
    } else if (event != null) {
        // formatea valores en methods (USO PROGRAMATICO)
        let val = event;
        val = val
            .toString()
            .replace(
                /[^0-9\-]/g,
                ""
            ) /* reemplaza todo lo que no sea numeros, excepto los guiones (-) para las cifras negativas */
            // .replace(/\D/g, "") /* reemplaza todo lo que no sea digito, incluyendo los guiones (-) */
            .replace(/([0-9])([0-9]{2})$/, `$1,$2`)
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, `.`);
        event = val;
        return val;
    }
};
</script>
<style scoped>
@page {
    margin: 2rem;
    margin-top: 1.5cm;
    margin-bottom: 1.5cm;
    padding: .1rem;
    font-size: .3rem !important;
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
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: white;
    text-align: center;
}

p {
    page-break-after: always;
}

p:last-child {
    page-break-after: never;
}

main {
    position: relative;
    top: 5px;
    bottom: 110px;
    left: 0px;
    right: 0px;
    margin-left: .4cm !important;
    margin-right: .4cm !important;
}

.cabecera {
    background-color: #FEFEFE;
    color: #000000;
    padding: 2rem;
    padding-top: .2rem;
    padding-bottom: 0px;
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
    border-spacing: 5px;
    border: 1px solid black;
    border-radius: 20px;
    -moz-border-radius: 20px;
    padding: 3px;
}

.total {
    width: 100%;
    background-color: #FFF;
    text-align: right;
    padding-right: 2rem !important;
    font-size: 1.5rem !important;
    position: fixed;
    bottom: 15px;
}

.letra-grande {
    font-size: 12px !important;
}

.letra-mediana {
    font-size: 15px !important;
}

.letra-pequena {
    font-size: 10px !important;
}
</style>