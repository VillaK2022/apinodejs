<template>
  <body v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
    element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" id="contenedor">
    <span style="font-size: 30px;">Ventas x Periodo</span>
    <br>
    <br>

    <!-- inputs  -->
    <section>
      <div class="row mb-3">
        <div class="col-lg-4 mb-2">
          <label class="col-12 label-xs">Razón Social</label>
          <el-input disabled v-model="inputs.prov" placeholder="Razon_social" :suffix-icon="Avatar" />
        </div>
        <div class="col-lg-4 mb-2">
          <label class="col-12 label-xs">Fechas:</label>
          <el-date-picker :disabled="table.datostabla.length > 0" v-model="inputs.fecha" type="monthrange"
            unlink-panelsrange-separator="a" start-placeholder="Mes inicio" end-placeholder="Mes final" format="YYYY-MM"
            value-format="YYYY-MM" :shortcuts="shortcuts" class="w-100" />
        </div>
        <div class="col-lg-4 col-md-9 mb-2">
          <label class="col-12 label-xs">Tienda:</label>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-select :disabled="table.datostabla.length > 0" v-model="inputs.tiendas_select" multiple clearable
                collapse-tags placeholder="Tienda" style="width: 100%">
                <el-option v-for="item in inputs.tiendas" :key="item.id_tienda" :label="item.descripcion"
                  :value="item.id_tienda" />
              </el-select>
            </el-col>
            <el-col :span="4" class="text-right">
              <el-tooltip content="Buscar" placement="top" effect="light">
                <el-button class="w-100" type="primary" :icon="Search" @click="buscardatos()" />
              </el-tooltip>
            </el-col>
            <el-col v-if="table.datostabla.length > 0" :span="4" class="text-right">
              <el-tooltip content="Exportar excel" placement="top" effect="light">
                <el-button class="w-100" type="success" @click="exportar()">
                  <font-awesome-icon icon="file-excel" />
                </el-button>
              </el-tooltip>
            </el-col>
            <el-tooltip content="Limpiar" placement="top" effect="light">
              <el-col v-if="table.datostabla.length > 0" :span="4" class="text-right">
                <el-popconfirm :icon="InfoFilled" class="box-item" @confirm="limpiar" confirm-button-text="Si"
                  cancel-button-text="No" title="¿Seguro desea limpiar los datos?" placement="bottom-end">
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
    <!-- tabla -->
    <section v-if="table.datostabla.length > 0">
      <!-- TABLA DETALLES -->
      <div class="col-lg-12 card p-3">
        <!-- DETALLES -->
        <div class="row">
          <!-- LISTADO DE LA BUSQUEDA -->
          <div class="col-lg-2 mb-2">
            <label class="col-12 label-xs">Paginas</label>
            <el-select v-model="table.pageSize" size="small">
              <el-option v-for="item in table.paginas" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <div class="col-lg-8 text-center">
            <label class="col-12 label-xs"></label>
          </div>
          <div class="col-lg-2 text-end mb-2">
            <label class="col-12 label-xs">Filtro</label>
            <el-input size="small" v-model="table.filterTableDetail" placeholder="Filtro" clearable></el-input>
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
                  <template v-if="!!listVentas_invPage.length">
                    <tr v-for="(item, key) in listVentas_invPage" :key="key">
                      <!-- Item -->
                      <td v-for="(campo_mostrar, idx) in table.campos_mostrar" :key="idx" @click="modalcodigo(item)"
                        style="cursor:pointer; text-wrap: nowrap;" :class="`lh-n text-${campo_mostrar.align}`">{{
                          item[campo_mostrar.key] == null ? '-' : (campo_mostrar.numeric ?
                            (isNaN(+item[campo_mostrar.key]) ? formatNumber((0).toFixed(2))
                              : formatNumber((+item[campo_mostrar.key]).toFixed(2))) : item[campo_mostrar.key]) }}
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
                <h6>{{ listVentas_inv.length == table.datostabla.length ? '' : (listVentas_inv.length +
                  (listVentas_inv.length == 1 ? ' Articulo filtrado' : ' Articulos filtrados') + ' de ')
                }}{{ table.datostabla.length }}{{ table.datostabla.length == 1 ? ' fila total' : ' filas totales' }}
                </h6>
              </div>
              <div class="col-lg-6" style="display: flex; justify-content: flex-end;">
                <el-pagination size="small" layout="prev, pager, next" :total="listVentas_inv.length"
                  v-model:current-page="table.currentPage" v-model:page-size="table.pageSize" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- dialog codigo -->
    <section>
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" v-model="modal_codigo" id="modalbarra"
        title="Barras asociadas" width="40%" center>
        <div v-if="Array.isArray(inputs.item) && inputs.item.length">
          <span style="font-size:13px">{{ inputs.item[0].articulo }}</span>
          <el-table id="tablabarra" :data="inputs.item" style="width:100%" class="mt-4">
            <el-table-column type="index" />
            <el-table-column prop="descripcion" label="Descripción" />
            <el-table-column prop="barra" label="Barra" />
            <el-table-column prop="cod_tercero" label="Principal">
              <template #default="{ row }"> 
                <el-popconfirm @confirm="principal(row, inputs.item)" class="box-item" title="¿Agregar este codigo como principal?" placement="bottom">
                  <template #reference>
                    <el-button :disabled="row.cod_tercero == 1" :type="row.cod_tercero == 1 ? 'primary' : 'info'" size="small">
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
const modal_codigo = ref(false)
const emit = defineEmits(['change-window', 'notification', 'swal']);
const limpiar = async () => {
  table.datostabla = []
}
const inputs = reactive({
  prov: '',
  fecha: [],
  tiendas_select: [],
  tiendas: [],
  item: ''
})
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
const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const cargardatos = () => {
  inputs.prov = datosinicio.razon_social
}
const cargar = () => {
  console.log(inputs);

}
const modalcodigo = async (item) => {
  if (fullscreenLoading.value) return;
  fullscreenLoading.value = true;
  loading_msg.value = "Cargando Datos... Por favor espere";
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
const shortcuts = [
  {
    text: 'Este mes',
    value: [new Date(), new Date()],
  },
  {
    text: 'Este año',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      return [start, end]
    },
  },
  {
    text: 'Ultimos 6 meses',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
]
const exportar = async () => {
  if (fullscreenLoading.value) return;
  fullscreenLoading.value = true;
  loading_msg.value = "Cargando Datos... Por favor espere";
  const fechaactual = ref(moment().format('lll'));
  try {
    const response = await axios.post(`/excel_venta_x_periodo`, {
      datos: table.datostabla,
      fecha: fechaactual.value,
      titulo: 'Ventas por Periodo',
    }, {
      responseType: 'blob' // Indicar que esperamos un blob (archivo binario)
    });

    // Crear un enlace temporal para descargar el blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ventas_x_periodo.xlsx'); // Nombre del archivo
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
const buscardatos = async () => {
  if (fullscreenLoading.value) return;
  fullscreenLoading.value = true;
  loading_msg.value = "Cargando Datos... Por favor espere";
  // console.log(inputs.fecha);

  if (!inputs.fecha || !inputs.fecha.length > 0) {
    fullscreenLoading.value = false;
    emit('notification', 'Debe seleccionar alguna fecha', 'warning', 'Datos faltantes');
    return
  }
  try {
    const arrayfechas = inputs.fecha || []
    const value = {
      params: {
        id_proveedor: id_proveedor,
        tiendas: inputs.tiendas_select.toString(),
        fechaini: (!arrayfechas.length ? null : arrayfechas[0]),
        fechafin: (!arrayfechas.length ? null : arrayfechas[1]),
        _t: new Date().getTime()
      }
    };
    const response = await axios.get(`/ventas_x_periodo`, value);
    table.datostabla = response.data
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
    { id: 2, name: 'Periodo', key: 'periodo', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "center", numeric: false, orderable: true },
    { id: 3, name: 'Tienda', key: 'tienda', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
    { id: 4, name: 'Producto', key: 'producto', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "left", numeric: false, orderable: true },
    { id: 5, name: 'Codigo', key: 'codigo_producto', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: false, orderable: true },
    { id: 6, name: 'Barra', key: 'codigo_ean', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: false, orderable: true },
    { id: 7, name: 'Cantidad', key: 'cantidad_kd', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
    // { id: 8, name: 'Venta de unidades', key: 'venta_unidades', color: 'rgba(0, 152, 131, 1)', width: 'auto', align: "end", numeric: true, orderable: true },
  ],
  paginas: [10, 50, 100, 500]
});
const listVentas_inv = computed(() => {
  if (!listVentas_invFiltro.value.length) return [];
  let data = [...listVentas_invFiltro.value.map(e => { return { ...e } })];
  if (!!table.filterTableDetail) data = data.filter(e => e.data.toLowerCase().trim().indexOf(table.filterTableDetail.toLowerCase().trim()) > -1);
  if (!!table.orderByDetail && table.orderByDetail.order == 'asc') {
    data = data.sort((a, b) => a[table.orderByDetail.item].toString().localeCompare(b[table.orderByDetail.item], 'es', { numeric: true }));
  } else if (!!table.orderByDetail && table.orderByDetail.order == 'desc') {
    data = data.sort((a, b) => b[table.orderByDetail.item].toString().localeCompare(a[table.orderByDetail.item], 'es', { numeric: true }));
  }
  return data;
})
const listVentas_invFiltro = computed(() => {
  if (!table.datostabla.length) return [];
  const resultados = table.datostabla.map((e, i) => {
    // VARIABLES
    const index = i;
    const nro_fila = index + 1;
    const periodo = e.periodo ? e.periodo : null;
    const tienda = e.tienda ? e.tienda : null;
    const producto = e.producto ? e.producto : null;
    const codigo_producto = e.codigo_producto ? e.codigo_producto : null;
    const codigo_ean = e.codigo_ean ? e.codigo_ean : null;
    const cantidad_kd = e.cantidad_kd ? e.cantidad_kd : null;
    const venta_unidades = e.venta_unidades ? e.venta_unidades : null;
    // DATA FOR FILTER
    let data = `${nro_fila}`;
    data += `${periodo}${tienda}${producto}${codigo_producto}${codigo_ean}${cantidad_kd}${venta_unidades}`
    // data += `${formatNumber((+monto).toFixed(2))}`;
    // RETURN VALUE
    return {
      index: index,
      nro_fila: nro_fila,
      periodo: periodo,
      tienda: tienda,
      producto: producto,
      codigo_producto: codigo_producto,
      codigo_ean: codigo_ean,
      cantidad_kd: cantidad_kd,
      venta_unidades: venta_unidades,
      data: data,
    }
  });
  return resultados;
});
const listVentas_invPage = computed(() => {
  if (!listVentas_inv.value.length) return [];
  const page_size = table.pageSize;
  const page_number = table.currentPage;
  const array = listVentas_inv.value.slice((page_number - 1) * page_size, page_number * page_size);
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
const principal = async (item, array) => {
  array.forEach(element => {
    element.cod_tercero = 0;
  });
  const d = array.find(e => e.id == item.id);
  d.cod_tercero = 1;
  // console.log(item);
  // console.log(array);
  
}
onMounted(() => {
  cargardatos();
  tienda();
});
</script>
<style>
    @media screen and (max-width: 1000px) {
        #modalbarra {
            width: 95% !important;
        }
        #tablabarra {
            width: 95% !important;
            font-size: 10px !important;
        }
    }
</style>