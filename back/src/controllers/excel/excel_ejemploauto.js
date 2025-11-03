import ExcelJS from 'exceljs';

export const excel_venta_vs_inv = async (req, res) => {
    try {
        const data = req.body;
        const datos = data.datos;

        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            return res.status(400).json({ 
                message: "La propiedad 'datos' debe ser un array válido con al menos un elemento"
            });
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Empresa Garzón';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Venta VS Inv', {
            views: [{ state: "frozen", ySplit: 1 }],
            properties: { tabColor: { argb: 'FF009883' } },
        });

        // ORDEN PREFERIDO PARA COLUMNAS
        const ordenPreferido = ['departamento', 'grupo', 'subgrupo', 'existencia', 'descripcion'];
        
        const primerElemento = datos[0];
        const todasLasClaves = Object.keys(primerElemento);
        
        // Ordenar columnas: primero las del orden preferido, luego las demás
        const columnasOrdenadas = [
            ...ordenPreferido.filter(key => todasLasClaves.includes(key)),
            ...todasLasClaves.filter(key => !ordenPreferido.includes(key))
        ];

        const columnas = columnasOrdenadas.map(key => {
            const header = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            return {
                header: header,
                key: key,
                width: 25,
                style: {
                    alignment: { 
                        horizontal: 'left', 
                        vertical: 'middle',
                        wrapText: true
                    },
                    font: {
                        size: 11,
                        name: 'Arial'
                    }
                }
            };
        });

        worksheet.columns = columnas;

        // ESTILO MEJORADO PARA EL HEADER
        const headerStyle = {
            alignment: { 
                horizontal: 'center', 
                vertical: 'middle',
                wrapText: true
            },
            font: { 
                bold: true, 
                size: 12, 
                color: { argb: 'FFFFFF' },
                name: 'Arial'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF009883' } // rgb(0, 152, 131)
            },
            border: {
                top: { style: 'thin', color: { argb: 'FF007A6A' } },
                left: { style: 'thin', color: { argb: 'FF007A6A' } },
                bottom: { style: 'thin', color: { argb: 'FF007A6A' } },
                right: { style: 'thin', color: { argb: 'FF007A6A' } }
            }
        };

        // Aplicar estilo al header
        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            Object.assign(cell, headerStyle);
        });

        // Agregar datos con estilos alternados para mejor legibilidad
        datos.forEach((item, index) => {
            console.log("item", item);
            const row = worksheet.addRow(item);
            row.height = 20;
            
            // Estilo para las filas de datos
            const rowStyle = {
                alignment: { 
                    horizontal: 'left', 
                    vertical: 'middle',
                    wrapText: true
                },
                font: {
                    size: 10,
                    name: 'Arial'
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { 
                        argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF0F0F0' // Blanco y gris muy claro alternados
                    }
                },
                border: {
                    top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                }
            };

            row.eachCell((cell) => {
                Object.assign(cell, rowStyle);
                
                // Formato especial para columnas numéricas
                if (typeof cell.value === 'number') {
                    // getColumn(3).numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';
                    cell.alignment = { horizontal: 'right', vertical: 'right' };
                }
            });
        });

        // Autoajustar el ancho de las columnas al contenido
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 0;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = Math.min(Math.max(maxLength + 2, 10), 50);
        });

        // Configurar respuesta
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="venta_vs_inventario.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generando Excel:', error);
        return res.status(500).json({ 
            message: "Error generando archivo Excel",
            error: error.message
        });
    }
};