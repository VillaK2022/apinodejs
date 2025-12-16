import { pool } from "../db.js";
import { excelBasico } from './excel.controllers.js';

// -------------------------ventas vs inv ------------
//traer data de la tiendas
export const ventas_existencia = async (req, res) => {
    try {
        const data = req.query;
        const proveedor = data.id_proveedor;
        const searchtienda = data.tienda;
        // COALESCE(NULLIF(c.desc_tercero, ''), c.descripcion) as articulo
        const query = `SELECT departamento, grupo, subgrupo, descripcion, cant1, cant2, cant3, existencia, 
        proyeccion_ventas, promedio_diario, dias_inventario, fecha_maxima, dias_sin_ventas, unidades_sin_vender, ncodigo,
        valor_sin_ventas, (cant1 + cant2 + cant3) AS cantidades
        FROM  get_vtas_vs_inv(${searchtienda}, ${proveedor}) where nivel = 4`
        const { rows } = await
            pool.query(query);
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar datos con lo solicitado" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
// exportar excel ventas vs inventario
export const excel_venta_vs_inv = async (req, res) => {
    try {
        const data = req.body;
        const mes_actual = data.mes_actual;
        const mes_anterior = data.mes_anterior;
        const mes_anterior2 = data.mes_anterior2;
        const columnas = [
            { index: true, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: true, text: true, variable: "departamento", nombre: "Departamento" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "grupo", nombre: "Grupo" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "subgrupo", nombre: "Subgrupo" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "descripcion", nombre: "Descripcion" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant1", nombre: `Cantidad de ${mes_anterior2}` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant2", nombre: `Cantidad de ${mes_anterior}` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cant3", nombre: `Cantidad de ${mes_actual}` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "existencia", nombre: "Existencia" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "proyeccion_ventas", nombre: "Proyeccion de venta" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "promedio_diario", nombre: "Promedio diario" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "dias_inventario", nombre: "Días inventario" },
            { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_maxima", nombre: "Fecha maxima" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "dias_sin_ventas", nombre: "Días sin venta" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "unidades_sin_vender", nombre: "Unidades sin vender" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "valor_sin_ventas", nombre: "Valor sin ventas" },
        ]

        // console.log("data.titulo", data.titulo);
        // console.log("columnas", columnas);
        // console.log("data.datos", data.datos);
        return excelBasico(req, res, data.titulo, columnas, data.datos, data.fecha);
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Error", error: error });
    }
}
// -------------------------ventas vs inv x fecha ------------
export const ventas_x_periodo= async (req, res) => {
    try {
        const data = req.query;
        const proveedor = data.id_proveedor;
        const periodos = `AND TO_DATE(ventas_xperiodo.periodo, 'YYYY-MM') >= TO_DATE('${data.fechaini}', 'YYYY-MM')
        AND TO_DATE(ventas_xperiodo.periodo, 'YYYY-MM') <= TO_DATE('${data.fechafin}',  'YYYY-MM')`
        const tiendas = !data.tiendas ? "" : `AND ventas_xperiodo.tienda_id IN (${data.tiendas})`;
        const query = `SELECT ventas_xperiodo.periodo, 
                            ventas_xperiodo.articulo_id, 
                            ventas_xperiodo.tienda_id, 
                            ventas_xperiodo.nombre_punto as tienda, 
                            ventas_xperiodo.codigo_producto, 
                            ventas_xperiodo.codigo_ean,
                            COALESCE(NULLIF(marticulo.desc_tercero, ''), ventas_xperiodo.producto) as producto, 
                            ventas_xperiodo.cantidad_kd, 
                            ventas_xperiodo.venta_unidades
                            FROM ventas_xperiodo
                            JOIN marticuloprovee on marticuloprovee.articulo_id = ventas_xperiodo.articulo_id
                            JOIN marticulo on marticulo.id = ventas_xperiodo.articulo_id
                            where marticuloprovee.deleted_at IS NULL AND marticuloprovee.provee_id = ${proveedor} 
                            and marticuloprovee.status = 1 ${tiendas} ${periodos}  ORDER BY ventas_xperiodo.periodo ASC
                            `
        const { rows } = await
            pool.query(query);
            // console.log(query);
            
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar datos con lo solicitado" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const excel_venta_x_periodo= async (req, res) => {
    try {
        const data = req.body;
        const columnas = [
            { index: true, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "periodo", nombre: "Periodo" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "tienda", nombre: "Tienda" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "producto", nombre: "Producto" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "codigo_producto", nombre: "Codigo" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "codigo_ean", nombre: "Barra" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "cantidad_kd", nombre: "Cantidad" },
            // { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "venta_unidades", nombre: "Venta de unidades" },
        ]

        // console.log("data.titulo", data.titulo);
        // console.log("columnas", columnas);
        // console.log("data.datos", data.datos);
        return excelBasico(req, res, data.titulo, columnas, data.datos, data.fecha);
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Error", error: error });
    }
}