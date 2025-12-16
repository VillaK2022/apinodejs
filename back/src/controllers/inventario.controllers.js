import { pool } from "../db.js";
import { excelBasico } from './excel.controllers.js';

//traer data de la tiendas
export const existencia = async (req, res) => {
    try {
        const data = req.query;
        const proveedor = data.id_proveedor;
        const tiendas = !data.tiendas_envia ? "" : `AND tie.id IN (${data.tiendas_envia})`;
        let operador = '';
        switch (data.options) {
            case '1': operador = ''; break;
            case '2': operador = `AND ROUND(exi.cantidad_cargo + exi.consignacion - exi.cantidad_descargo, 2) > 0`; break;
            case '3': operador = `AND ROUND(exi.cantidad_cargo + exi.consignacion - exi.cantidad_descargo, 2) = 0`; break;
            case '4': operador = `AND ROUND(exi.cantidad_cargo + exi.consignacion - exi.cantidad_descargo, 2) < 0`;; break;
        }
        const query = `SELECT org.name AS organizacion, tie.descripcion AS tiendas, alm.descripcion AS almacen, 
                COALESCE(NULLIF(art.desc_tercero, ''), art.descripcion) as articulo, 
                ROUND(exi.cantidad_cargo + exi.consignacion - exi.cantidad_descargo, 2) AS existencia, art.codigo as codigo
                FROM marticuloprovee  AS arp
                JOIN kardexexistencia AS exi ON exi.articulo_id = arp.articulo_id
                JOIN marticulo        AS art ON art.id = exi.articulo_id
                JOIN morganizacion    AS org ON org.id = exi.organizacion_id
                JOIN mtienda          AS tie ON tie.id = exi.tienda_id
                JOIN malmacen         AS alm ON alm.id = exi.almacen_id
                JOIN mtipoproducto    as mtipo on mtipo.id = art.tipoarticulo_id
                WHERE arp.deleted_at IS NULL and arp.status = 1 AND mtipo.descuenta = 1 AND arp.provee_id = ${proveedor} 
                ${tiendas} 
                ${operador} 
                ORDER BY 5 desc`                
        const { rows } = await
            pool.query(query);
            // console.log(query);
            
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar inv con los datos solicitados" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const excel_inv = async (req, res) => {  
    try {
        const data = req.body;
        const columnas = [
            { index: true,  mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "organizacion", nombre: "Organización" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "tiendas", nombre: "Tienda" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "almacen", nombre: "Almacen" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "articulo", nombre: "Articulo" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "existencia", nombre: "Existencia" },
        ]
        // console.log("data.titulo", data.titulo);
        // console.log("columnas", columnas);
        // console.log("data.datos", data.datos);
        return excelBasico(req, res, data.titulo, columnas, data.datos, data.fecha);
    } catch (error) {
        // console.log(error);
        return res.status(400).json({ message: "Error", error: error });
    }
}