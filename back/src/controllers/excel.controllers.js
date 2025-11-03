import ExcelJS from 'exceljs';

export const excelBasico = async (req, res, titulo, columnas, datos, fecha) => {
    // console.log("titulo, columnas, datos", titulo, columnas, datos);
    try {

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // --- 2. ASIGNACION DE COLUMNAS ---
        // --- 3. LETRAS (Generador de A-Z, AA-AZ, ...) ---
        const letters = [];
        for (let i = 65; i <= 90; i++) { // A-Z
            letters.push(String.fromCharCode(i));
        }
        const originalLetters = [...letters]; // Copia de A-Z
        for (const letter1 of originalLetters) {
            for (const letter2 of originalLetters) {
                letters.push(letter1 + letter2);
            }
        }

        // --- 4. RECORRIDO DE COLUMNAS (Procesamiento de metadata) ---
        let last_letter = null;
        const columnas_utilizar = [];
        const letras_numero = [];
        const letras_decimal = [];
        const letras_date = [];
        const array_letras = []; // Letras para auto-ajustar
        let key_col = 0;

        columnas.forEach(column => {
            if (column.mostrar) {
                // ASIGNAR LETRA A LA COLUMNA
                column.letra = letters[key_col];

                // BUSCAR ULTIMA LETRA
                if (column.ajustar) array_letras.push(column.letra);
                last_letter = column.letra;

                // ASIGNAR LETRAS DE TIPO DE DATO
                if (column.date) letras_date.push(column.letra);
                if (column.number) {
                    if (column.sin_decimal) letras_numero.push(column.letra);
                    if (!column.sin_decimal) letras_decimal.push(column.letra);
                }

                // CARGAR COLUMNA
                columnas_utilizar.push(column);
                key_col++;
            }
        });

        // --- 5. EXPORTAR EXCEL (Usando ExcelJS) ---
        const fecha1 = fecha
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(titulo);
        const titleText = titulo;
        const startRow = 1;
        const startCol = 2;
        const endRow = 1;
        const endCol = 4; // Combina de A1 a E1
        worksheet.mergeCells(startRow, startCol, endRow, endCol);
        worksheet.getCell(startRow, startCol).value = titleText;
        const cell = worksheet.getCell(startRow, startCol);

        // Estilo de fuente
        cell.font = {
            name: 'Calibri',
            size: 15,
            bold: true,
            color: { argb: 'FF000000' } 
        };

        // Alineación del texto
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        // --- 5. EXPORTAR EXCEL (Usando ExcelJS) ---
        const fechatitle = `Fecha actual: ${fecha1}`;
        const start = 2;
        const startColu = 2;
        const endRowc = 2;
        const endCol2 = 4; // Combina de A1 a E1
        worksheet.mergeCells(start, startColu, endRowc, endCol2);
        worksheet.getCell(start, startColu).value = fechatitle;
        const cell2 = worksheet.getCell(start, startColu);

        // Estilo de fuente
        cell2.font = {
            name: 'Calibri',
            size: 10,
            bold: true,
            color: { argb: 'FF000000' },
        };

        // Alineación del texto
        cell2.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        let rowCount = 3;
        // --- 6. COLUMNAS (Fila de cabecera) ---
        const headerRow = worksheet.getRow(rowCount);
        columnas_utilizar.forEach(coln => {
            headerRow.getCell(coln.letra).value = coln.nombre;
        });
        // --- 7. COLOR COLUMNAS (Estilo de cabecera) ---
        // Iteramos sobre las celdas de la fila 1 hasta la última columna usada
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            if (colNumber <= columnas_utilizar.length) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFC2C2C2' } // 'FF' es el alfa (opacidad)
                };
                cell.font = {
                    bold: true
                };
            }
        });

        rowCount++;

        // --- 8. RECORRIDO REGISTROS (Escribir datos) ---
        datos.forEach((row, key) => {
            const currentRow = worksheet.getRow(rowCount);

            columnas_utilizar.forEach(coln => {
                let variable = row[coln.variable] ?? null; // `??` es el 'null coalescing' de PHP

                // FORMATO DE FECHA
                if (coln.date) {
                    // exceljs prefiere objetos Date. 
                    // El string 'YYYY-MM-DD' puede dar problemas de zona horaria con new Date().
                    // Es más seguro parsearlo así:
                    if (row[coln.variable]) {
                        const parts = row[coln.variable].split('-'); // [YYYY, MM, DD]
                        variable = new Date(parts[0], parts[1] - 1, parts[2]); // Mes es 0-indexado
                    } else {
                        variable = "-";
                    }
                }
                // FORMATO NUMERICO
                else if (coln.number) { // Usar 'else if' para evitar sobreescritura
                    variable = Number(row[coln.variable] ?? 0);
                }
                // FORMATO DE TEXTO
                else if (coln.text) {
                    variable = (row[coln.variable] ?? "-") + " "; // Mantenemos el espacio extra
                }
                // FORMATO DE INDEX
                else if (coln.index) {
                    variable = key + 1; // `key` es 0-indexado en JS
                }

                // ASIGNAR VALOR A LA CELDA
                // El `(variable ?? "-")` de PHP
                currentRow.getCell(coln.letra).value = variable ?? "-";
            });

            rowCount++;
        });

        rowCount--; // Ajuste final de rowCount igual que en PHP

        // --- 9. CONGELAR PANTALLA Y FILTRO AUTOMATICO ---
        worksheet.views = [
            {
                state: 'frozen',
                xSplit: 0,       // Congelar columnas
                ySplit: 3,       // Congelar la fila 1
            }
        ];
        worksheet.autoFilter = `A3:${last_letter}${rowCount}`;

        // --- 10. AÑADIR FORMATOS (por columna) ---

        // FORMATOS NUMERICOS SIN DECIMAL
        letras_numero.forEach(letra => {
            worksheet.getColumn(letra).numFmt = '0';
        });

        // FORMATOS NUMERICOS CON DECIMAL
        letras_decimal.forEach(letra => {
            // NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1
            worksheet.getColumn(letra).numFmt = '#,##0.00';
        });

        // FORMATOS DE FECHA
        letras_date.forEach(letra => {
            // NumberFormat::FORMAT_DATE_DDMMYYYY
            worksheet.getColumn(letra).numFmt = 'dd-mm-yyyy';
        });

        // --- 11. DEJAR EL TAMAÑO AUTOMATICO ---
        // Replicando setAutoSize(true)
        array_letras.forEach(letra => {
            const column = worksheet.getColumn(letra);
            let maxLen = 0;
            // Obtenemos el ancho del header
            maxLen = column.header?.length ?? 10;

            // Recorremos las celdas para encontrar el valor más largo
            column.eachCell({ includeEmpty: true }, (cell) => {
                let cellLen = cell.value ? cell.value.toString().length : 0;
                if (cell.numFmt === 'dd-mm-yyyy') { // Las fechas tienen ancho fijo
                    cellLen = 10;
                }
                if (cellLen > maxLen) {
                    maxLen = cellLen;
                }
            });
            // Asignamos el ancho + un pequeño padding
            column.width = maxLen < 10 ? 10 : maxLen + 2;
        });


        // --- 12. CONFIGURACIONES DEL ARCHIVO Y ENVÍO ---

        // Seleccionar celda activa (opcional, se puede añadir a `views`)
        worksheet.views[0].activeCell = `A${rowCount}`;

        // El nombre de la hoja (setTitle) se asignó en `workbook.addWorksheet()`

        // --- 13. Redirect output to a client’s web browser (ExcelJS / Express) ---

        // Generar nombre de archivo
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15); // YYYYMMDDTHHMMSS
        const fileName = `ReporteArticulos${timestamp}.xlsx`; // Usar .xlsx

        // Setear headers de la respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'max-age=0');
        // Los otros headers (Expires, Last-Modified, Pragma) no son necesarios
        // para los navegadores modernos al enviar archivos.

        // Escribir el buffer del workbook en la respuesta
        await workbook.xlsx.write(res);

        // Finalizar la respuesta
        res.end();
        // return ventas->generarExcelBasico("titulo", columnas, datos);
    } catch (error) {
        // Manejo de errores en el servidor
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).send("Error interno del servidor al generar el reporte.");
    }
}