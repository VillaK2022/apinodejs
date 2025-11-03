import ExcelJS from 'exceljs';

// export const excel_venta_vs_inv = async (req, res) => {
//   try {
//     const data = req.body;
//     const datos = data.datos;    
//     const mes_actual = data.mes_actual;
//     const mes_anterior = data.mes_anterior;
//     const mes_anterior2 = data.mes_anterior2;
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     // --- 2. ASIGNACION DE COLUMNAS ---
//     const columnas = [
//         { index: true,  mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: true, text: true, variable: "departamento", nombre: "Departamento" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "grupo", nombre: "Grupo" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "subgrupo", nombre: "Subgrupo" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "descripcion", nombre: "Descripcion" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant1", nombre: `Cantidad de ${mes_anterior2}` },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant2", nombre: `Cantidad de ${mes_anterior}` },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant3", nombre: `Cantidad de ${mes_actual}` },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "existencia", nombre: "Existencia" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "proyeccion_ventas", nombre: "Proyeccion de venta" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "promedio_diario", nombre: "Promedio diario" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "dias_inventario", nombre: "Días inventario" },
//         { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_maxima", nombre: "Fecha maxima" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "dias_sin_ventas", nombre: "Días sin venta" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "unidades_sin_vender", nombre: "Unidades sin vender" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "valor_sin_ventas", nombre: "Valor sin ventas" },

//     ];

//     // --- 3. LETRAS (Generador de A-Z, AA-AZ, ...) ---
//     const letters = [];
//     for (let i = 65; i <= 90; i++) { // A-Z
//       letters.push(String.fromCharCode(i));
//     }
//     const originalLetters = [...letters]; // Copia de A-Z
//     for (const letter1 of originalLetters) {
//       for (const letter2 of originalLetters) {
//         letters.push(letter1 + letter2);
//       }
//     }

//     // --- 4. RECORRIDO DE COLUMNAS (Procesamiento de metadata) ---
//     let last_letter = null;
//     const columnas_utilizar = [];
//     const letras_numero = [];
//     const letras_decimal = [];
//     const letras_date = [];
//     const array_letras = []; // Letras para auto-ajustar
//     let key_col = 0;

//     columnas.forEach(column => {
//       // En JS, `true` es "truthy", no se necesita `!!+`
//       if (column.mostrar) {
//         // ASIGNAR LETRA A LA COLUMNA
//         column.letra = letters[key_col];
        
//         // BUSCAR ULTIMA LETRA
//         if (column.ajustar) array_letras.push(column.letra);
//         last_letter = column.letra;
        
//         // ASIGNAR LETRAS DE TIPO DE DATO
//         if (column.date)   letras_date.push(column.letra);
//         if (column.number) {
//           if (column.sin_decimal) letras_numero.push(column.letra);
//           if (!column.sin_decimal) letras_decimal.push(column.letra);
//         }
        
//         // CARGAR COLUMNA
//         columnas_utilizar.push(column);
//         key_col++;
//       }
//     });

//     // --- 5. EXPORTAR EXCEL (Usando ExcelJS) ---
//     const fecha1 = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }); // Formato dd-mm-YYYY
    
//     const workbook = new ExcelJS.Workbook();
    
//     // Set document properties

//     const worksheet = workbook.addWorksheet('ReporteArticulos');
    
//     let rowCount = 3;

//     // --- 6. COLUMNAS (Fila de cabecera) ---
//     const headerRow = worksheet.getRow(rowCount);
//     columnas_utilizar.forEach(coln => {
//       headerRow.getCell(coln.letra).value = coln.nombre;
//     });

//     // --- 7. COLOR COLUMNAS (Estilo de cabecera) ---
//     // Iteramos sobre las celdas de la fila 1 hasta la última columna usada
//     headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
//       if (colNumber <= columnas_utilizar.length) {
//           cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFC2C2C2' } // 'FF' es el alfa (opacidad)
//           };
//           cell.font = {
//             bold: true
//           };
//       }
//     });
    
//     rowCount++;

//     // --- 8. RECORRIDO REGISTROS (Escribir datos) ---
//     datos.forEach((row, key) => {
//       const currentRow = worksheet.getRow(rowCount);
      
//       columnas_utilizar.forEach(coln => {
//         let variable = row[coln.variable] ?? null; // `??` es el 'null coalescing' de PHP

//         // FORMATO DE FECHA
//         if (coln.date) {
//             // exceljs prefiere objetos Date. 
//             // El string 'YYYY-MM-DD' puede dar problemas de zona horaria con new Date().
//             // Es más seguro parsearlo así:
//             if (row[coln.variable]) {
//                 const parts = row[coln.variable].split('-'); // [YYYY, MM, DD]
//                 variable = new Date(parts[0], parts[1] - 1, parts[2]); // Mes es 0-indexado
//             } else {
//                 variable = "-";
//             }
//         }
//         // FORMATO NUMERICO
//         else if (coln.number) { // Usar 'else if' para evitar sobreescritura
//             variable = Number(row[coln.variable] ?? 0);
//         }
//         // FORMATO DE TEXTO
//         else if (coln.text) {
//             variable = (row[coln.variable] ?? "-") + " "; // Mantenemos el espacio extra
//         }
//         // FORMATO DE INDEX
//         else if (coln.index) {
//             variable = key + 1; // `key` es 0-indexado en JS
//         }
        
//         // ASIGNAR VALOR A LA CELDA
//         // El `(variable ?? "-")` de PHP
//         currentRow.getCell(coln.letra).value = variable ?? "-";
//       });
      
//       rowCount++;
//     });

//     rowCount--; // Ajuste final de rowCount igual que en PHP

//     // --- 9. CONGELAR PANTALLA Y FILTRO AUTOMATICO ---
//     worksheet.views = [
//       { 
//         state: 'frozen', 
//         xSplit: 0,       // Congelar columnas
//         ySplit: 3,       // Congelar la fila 1
//       }
//     ];
//     worksheet.autoFilter = `A3:${last_letter}${rowCount}`;

//     // --- 10. AÑADIR FORMATOS (por columna) ---
    
//     // FORMATOS NUMERICOS SIN DECIMAL
//     letras_numero.forEach(letra => {
//       worksheet.getColumn(letra).numFmt = '0';
//     });

//     // FORMATOS NUMERICOS CON DECIMAL
//     letras_decimal.forEach(letra => {
//       // NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1
//       worksheet.getColumn(letra).numFmt = '#,##0.00'; 
//     });

//     // FORMATOS DE FECHA
//     letras_date.forEach(letra => {
//       // NumberFormat::FORMAT_DATE_DDMMYYYY
//       worksheet.getColumn(letra).numFmt = 'dd-mm-yyyy'; 
//     });

//     // --- 11. DEJAR EL TAMAÑO AUTOMATICO ---
//     // Replicando setAutoSize(true)
//     array_letras.forEach(letra => {
//         const column = worksheet.getColumn(letra);
//         let maxLen = 0;
//         // Obtenemos el ancho del header
//         maxLen = column.header?.length ?? 10; 
        
//         // Recorremos las celdas para encontrar el valor más largo
//         column.eachCell({ includeEmpty: true }, (cell) => {
//             let cellLen = cell.value ? cell.value.toString().length : 0;
//             if (cell.numFmt === 'dd-mm-yyyy') { // Las fechas tienen ancho fijo
//                 cellLen = 10; 
//             }
//             if (cellLen > maxLen) {
//                 maxLen = cellLen;
//             }
//         });
//         // Asignamos el ancho + un pequeño padding
//         column.width = maxLen < 10 ? 10 : maxLen + 2; 
//     });


//     // --- 12. CONFIGURACIONES DEL ARCHIVO Y ENVÍO ---
    
//     // Seleccionar celda activa (opcional, se puede añadir a `views`)
//     worksheet.views[0].activeCell = `A${rowCount}`;

//     // El nombre de la hoja (setTitle) se asignó en `workbook.addWorksheet()`

//     // --- 13. Redirect output to a client’s web browser (ExcelJS / Express) ---
    
//     // Generar nombre de archivo
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15); // YYYYMMDDTHHMMSS
//     const fileName = `ReporteArticulos${timestamp}.xlsx`; // Usar .xlsx

//     // Setear headers de la respuesta
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.setHeader('Cache-Control', 'max-age=0');
//     // Los otros headers (Expires, Last-Modified, Pragma) no son necesarios
//     // para los navegadores modernos al enviar archivos.

//     // Escribir el buffer del workbook en la respuesta
//     await workbook.xlsx.write(res);
    
//     // Finalizar la respuesta
//     res.end();
//     // return ventas->generarExcelBasico("titulo", columnas, datos);
//   } catch (error) {
//     // Manejo de errores en el servidor
//     console.error("Error al generar el archivo Excel:", error);
//     res.status(500).send("Error interno del servidor al generar el reporte.");
//   }
// }

// // no esta en uso funcion de dee
// export const excel_venta_vs_inv2 = async (request, response) => {
//     const data = request.body;
//     const datos = data.datos;  
//     // ASIGNACION DE COLUMNAS
//     const columnas = [
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: true, text: true, variable: "departamento", nombre: "Departamento" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "grupo", nombre: "grupo" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "subgrupo", nombre: "subgrupo" },
//         { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "descripcion", nombre: "descripcion" },
//         // { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_ini", nombre: "Fecha Ini" },
//         // { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_fin", nombre: "Fecha Fin" },
//         // { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "precio", nombre: "Precio" },
//     ];

//     // GENERAR LETRAS DE COLUMNAS
//     const letters = [];
//     for (let i = 0; i < 26; i++) {
//         letters.push(String.fromCharCode(65 + i));
//     }
//     for (let i = 0; i < 26; i++) {
//         for (let j = 0; j < 26; j++) {
//             letters.push(String.fromCharCode(65 + i) + String.fromCharCode(65 + j));
//         }
//     }

//     // PROCESAR COLUMNAS
//     let last_letter = null;
//     const columnas_utilizar = [];
//     const letras_numero = [];
//     const letras_decimal = [];
//     const letras_date = [];
//     const array_letras = [];
//     let key_col = 0;

//     columnas.forEach(column => {
//         if (column.mostrar) {
//             // ASIGNAR LETRA A LA COLUMNA
//             column.letra = letters[key_col];
            
//             // BUSCAR ULTIMA LETRA
//             if (column.ajustar) array_letras.push(column.letra);
//             last_letter = column.letra;
            
//             // ASIGNAR LETRAS DE TIPO DE DATO
//             if (column.date) letras_date.push(column.letra);
//             if (column.number) {
//                 if (column.sin_decimal) letras_numero.push(column.letra);
//                 else letras_decimal.push(column.letra);
//             }
            
//             // CARGAR COLUMNA
//             columnas_utilizar.push(column);
//             key_col++;
//         }
//     });

//     // CREAR EXCEL
//     const fecha1 = new Date().toLocaleDateString('es-ES');
//     const workbook = new ExcelJS.Workbook();
    
//     // SET DOCUMENT PROPERTIES
//     workbook.creator = 'BIADM';
//     workbook.lastModifiedBy = 'BIADM';
//     workbook.created = new Date();
//     workbook.modified = new Date();
    
//     const worksheet = workbook.addWorksheet('ReporteArticulos');
    
//     // CONFIGURAR ENCABEZADOS
//     const headerRow = worksheet.addRow([]);
//     let rowCount = 1;

//     // AGREGAR NOMBRES DE COLUMNAS
//     columnas_utilizar.forEach(coln => {
//         const cell = headerRow.getCell(coln.letra);
//         cell.value = coln.nombre;
//     });

//     // ESTILO ENCABEZADOS
//     headerRow.eachCell((cell) => {
//         cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFC2C2C2' }
//         };
//         cell.font = { bold: true };
//     });

//     rowCount++;

//     // AGREGAR REGISTROS
//     datos.forEach((row, key) => {
//         const dataRow = worksheet.addRow([]);
        
//         columnas_utilizar.forEach(coln => {
//             let variable = row[coln.variable] ?? null;
            
//             // FORMATO DE FECHA
//             if (coln.date) {
//                 variable = row[coln.variable] ? new Date(row[coln.variable]) : '-';
//             }
            
//             // FORMATO NUMERICO
//             if (coln.number) {
//                 variable = Number(row[coln.variable] ?? 0);
//             }
            
//             // FORMATO DE TEXTO
//             if (coln.text) {
//                 variable = (row[coln.variable] ?? '-') + ' ';
//             }
            
//             // FORMATO DE INDICE
//             if (coln.index) {
//                 variable = key + 1;
//             }
            
//             const cell = dataRow.getCell(coln.letra);
//             cell.value = variable ?? '-';
            
//             // APLICAR FORMATOS
//             if (coln.date && variable instanceof Date) {
//                 cell.numFmt = 'dd/mm/yyyy';
//             } else if (coln.number) {
//                 if (coln.sin_decimal) {
//                     cell.numFmt = '0';
//                 } else {
//                     cell.numFmt = '#,##0.00';
//                 }
//             }
//         });
//         rowCount++;
//     });

//     // CONGELAR PANTALLA Y FILTRO AUTOMATICO
//     worksheet.views = [{ state: 'frozen', ySplit: 1 }];
//     worksheet.autoFilter = {
//         from: `A1`,
//         to: `${last_letter}${datos.length + 1}`
//     };

//     // AJUSTAR ANCHO DE COLUMNAS
//     array_letras.forEach(col => {
//         worksheet.getColumn(col).width = 35;
//     });

//     // CONFIGURAR RESPUESTA
//     response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     response.setHeader('Content-Disposition', `attachment; filename="ReporteArticulos${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}.xlsx"`);
//     response.setHeader('Cache-Control', 'max-age=0');
//     response.setHeader('Pragma', 'public');

//     // ENVIAR ARCHIVO
//     await workbook.xlsx.write(response);
//     response.end();
// }