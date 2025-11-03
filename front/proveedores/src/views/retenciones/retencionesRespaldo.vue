<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
    element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
    <div class="demo-input-with-icon">
      <div class="input-group">
        <div class="input-container">
          <!-- <span>Proveedor</span> -->
          <el-form-item label="Proveedor:">
            <el-input disabled v-model="input1" class="responsive-input" placeholder="Razon_social"
              :suffix-icon="Avatar" />
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="Fechas:">
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker v-model="fecha" type="daterange" start-placeholder="Fecha inicio"
                  end-placeholder="Fecha final" format="DD-MM-YYYY" value-format="DD-MM-YYYY" />
              </div>
            </div>
          </el-form-item>
          <el-button type="primary" :icon="Search" circle @click="buscar()" />
        </div>
      </div>
    </div>
    <el-table v-if="tableData" :data="filterTableData" max-height="450" style="width: 100%; font-size: 12px;">
      <el-table-column width="70" sortable fixed prop="id" label="id" />
      <el-table-column sortable fixed prop="factura_num" label="Factura" />
      <el-table-column sortable fixed prop="nro_control" label="Control" />
      <el-table-column sortable fixed prop="fecha" label="F.Recepción" />
      <el-table-column sortable fixed prop="fecha_emision" label="F.Emisión" />
      <!-- <el-table-column sortable fixed prop="fecha_vencimiento" label="F.Vencimiento" /> -->
      <el-table-column sortable fixed prop="subtotal" label="Subtotal" />
      <el-table-column sortable fixed prop="impuesto" label="Impuesto" />
      <el-table-column sortable fixed prop="retencion" label="Retencion" />
      <el-table-column sortable fixed prop="total" label="Total" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="busqueda" size="small" placeholder="Buscar" />
        </template>
        <template #default="scope">
          <el-button type="primary" @click="exportPdf(scope.row)" icon="Printer" circle />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination v-if="tableData && tableData.length > 0" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" :total="tableData.length" style="margin-top: 16px; justify-content: center;" size="small"
      background layout="prev, pager, next" class="mt-4" /> -->

    <template v-show="false">
      <ContenidoPDF ref="pdfretencion" />
    </template>
  </div>
</template>
<script lang="ts" setup>
///////////////////////////////////////////////////
///////////////// Import
///////////////////////////////////////////////////
import html2pdf from 'html2pdf.js';
import { ref, onMounted, computed, inject } from 'vue';
import axios from 'axios';
import { Search, Avatar } from '@element-plus/icons-vue'
import ContenidoPDF from '../../pdf/pdfretenciones.vue';


///////////////////////////////////////////////////
///////////////// VARIABLES
///////////////////////////////////////////////////
const formatNumber = inject('formatNumber') as (value: any) => string;
const input1 = ref('');
const busqueda = ref('')
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
const tableData = ref([]);

///////////////////////////////////////////////////
///////////////// METODOS
///////////////////////////////////////////////////
const buscar = async () => {
  if (fullscreenLoading.value) return;
  tableData.value = [];
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
    response.data.forEach(element => {
      element.subtotal = element.subtotal && !isNaN(+element.subtotal) ? formatNumber((+element.subtotal).toFixed(2)) : formatNumber((0).toFixed(2));
      element.impuesto = element.impuesto && !isNaN(+element.impuesto) ? formatNumber((+element.impuesto).toFixed(2)) : formatNumber((0).toFixed(2));
      element.retencion = element.retencion && !isNaN(+element.retencion) ? formatNumber((+element.retencion).toFixed(2)) : formatNumber((0).toFixed(2));
      element.total = element.total && !isNaN(+element.total) ? formatNumber((+element.total).toFixed(2)) : formatNumber((0).toFixed(2));
    });
    tableData.value = response.data;
    fullscreenLoading.value = false

    // console.log(tableData);


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
  // console.log('Buscar');
}
const datos = () => {
  input1.value = datosinicio.razon_social
  console.log();

}
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
      const opt = {
        margin: 0,
        filename: `reporte_${row.id || 'retencion'}.pdf`,
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
const filterTableData = computed(() => {
  // console.clear();
  const records = tableData.value.filter((data) => {
    if (!busqueda.value) return true;
    const condiciones = (
      (!!data.id && data.id.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.factura_num && data.factura_num.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.nro_control && data.nro_control.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.fecha && data.fecha.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.fecha_emision && data.fecha_emision.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.fecha_vencimiento && data.fecha_vencimiento.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.subtotal && data.subtotal.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.impuesto && data.impuesto.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.retencion && data.retencion.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1) ||
      (!!data.total && data.total.toLowerCase().trim().indexOf(busqueda.value.toLowerCase().trim()) > -1)
    )
    return condiciones;
  });
  return records;
})
//paginacion

onMounted(() => {
  datos();
});
</script>
<style scoped>
.demo-input-with-icon {
  width: 100%;
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
