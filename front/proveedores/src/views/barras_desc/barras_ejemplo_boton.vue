<template>

    <body id="contenedor">
        <div>
            <span style="font-size: 30px;">Barras principales - Descripción del producto</span>
            <br>
            <br>
            <section>
                <div class="col-3">
                    <el-upload class="upload-demo" drag
                        :limit="1"
                        :on-exceed="handleExceed" :auto-upload="false" :on-change="handleFileUpload"
                        accept=".xlsx,.xls">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template>
                    </el-upload>
                </div>
            </section>
            <el-button @click="getFile()">Trear Archivo</el-button>
            <input type="file" id="archivo_inp" @change="handleFileUpload" style="display: none;"></input>
        </div>
    </body>
</template>
<script setup>
import * as XLSX from 'xlsx';
import { UploadFilled } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, inject, computed, nextTick, h } from 'vue';
import { ElMessage } from 'element-plus'; // Para mostrar mensajes
const excelData = ref([]);

const getFile = () => {
    document.getElementById("archivo_inp").click()
}
// Función que se dispara al seleccionar/cambiar el archivo
const handleFileUpload = (file, fileList) => {
    // document.getElementById("archivo_inp").value = "";
    // El 'file' contiene el objeto de archivo, incluyendo raw
    const rawFile = file.target.files[0];
    document.getElementById("archivo_inp").value = "";
    console.log("rawFile", rawFile)
    // Verificamos si realmente hay un archivo (puede ser llamado al borrar también)
    if (!rawFile) {
        excelData.value = []; // Limpiar si no hay archivo
        return;
    }

    // Opcional: Verificar el tipo de archivo nuevamente
    const isExcel = rawFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || rawFile.type === 'application/vnd.ms-excel';

    if (!isExcel) {
        ElMessage.error('.xlsx/.xls son los formatos permitidos');
        // Aquí podrías querer eliminar el archivo de la lista si no es válido
        // fileList.pop(); 
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
        excelData.value = json;
        console.log('Datos de Excel cargados:', json);

        ElMessage.success(`¡Archivo "${rawFile.name}" cargado y leído con éxito!`);
    };

    // Leer el archivo como un ArrayBuffer
    reader.readAsArrayBuffer(rawFile);
};


// La función handleExceed que ya tenías
const handleExceed = (files) => {
    ElMessage.warning(`El límite es 1 archivo. Seleccionaste ${files.length} archivo(s) más.`);
    // Podrías forzar a reemplazar el archivo existente aquí si lo deseas
};
</script>