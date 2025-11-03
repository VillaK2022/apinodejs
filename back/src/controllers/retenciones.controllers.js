import { pool } from "../db.js";
import { excelBasico } from './excel.controllers.js';
//buscar todas las retenciones del proveedor con fecha y id_proveedor
export const cargar_retenciones = async (req, res) => {
    try {
        const data = req.body;
        const fecha = JSON.stringify(data.fecha)
        let [fechaini, fechafin] = fecha.split(',');
        console.log(fechaini, fechafin);
        
        if (!data) {
            return res.status(300).json({ message: "No tiene identificador" })
        }
        const { rows } = await pool.query(
            `WITH v_params AS ( SELECT ID moneda_id FROM mmoneda WHERE predeterminada = 1 LIMIT 1 ) 
            SELECT ROW_NUMBER() OVER() AS id,
                a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc,
                SUM(a.subtotal) AS subtotal, SUM(a.impuesto) AS impuesto, SUM(a.retencion) AS retencion, SUM(a.total) AS total
                FROM (
                    SELECT 
                    a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                    a.organizacion_id, a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                    a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc,
                    a.alicuota, a.porc_renten, 
                    SUM(a.subtotal) AS subtotal, SUM(a.impuesto) AS impuesto, SUM(a.retencion) AS retencion, SUM(a.total) AS total
                    FROM (
                        SELECT a.id, a.factura_num, a.nro_control, a.fecha, a.fecha_emision, 
                        CASE WHEN a.tipo_doc = 'LIQU' THEN 'FAC' ELSE a.tipo_doc END tipo_doc,
                        a.organizacion_id, a.documento_retencion, c.ci2 as ci2_proveedor, c.razon_social as razon_social_proveedor, 
                        c.telefono as telefono_proveedor, c.direccion as direccion_proveedor, 
                        d.name AS organizacion, d.direccion as direccion_organizacion, d.telefono as telefono_organizacion, d.nit AS nit_org, 
                        a.alicuota, 
                        getmountreconv ( a.subtotal, a.moneda_id, p.moneda_id ) :: NUMERIC ( 100, 3 ) AS subtotal,
                        getmountreconv ( a.impuesto, a.moneda_id, p.moneda_id ) :: NUMERIC ( 100, 3 ) AS impuesto,
                        getmountreconv ( a.monto, a.moneda_id, p.moneda_id ) :: NUMERIC ( 100, 3 )    AS retencion, 
                        getmountreconv ( a.total, a.moneda_id, p.moneda_id ) :: NUMERIC ( 100, 3  )   AS total,
                        b.porc_renten
                        FROM
                                registro_retencion AS a 
                                JOIN mretenciones  AS b ON b.id = a.retencion_id
                                JOIN mproveedor    AS c on c.id = a.proveedor_id
                                JOIN morganizacion AS d on d.id = a.organizacion_id
                                JOIN v_params      AS p ON true
                                WHERE b.correlativo_id = 1 AND c.id = $1
                                AND a.fecha BETWEEN $2 AND $3
                        ORDER BY
                                a.ID DESC
                    ) AS a
                    GROUP BY a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                    a.organizacion_id, a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                    a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc,
                    a.alicuota, a.porc_renten
                ) AS a
                GROUP BY a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc
                ORDER BY a.fecha_emision DESC
        `, [data.id_proveedor, fechaini, fechafin])
        if (rows.length === 0) {
            return res.status(300).json({ message: "No se encontraron retenciones para este proveedor en la fecha" })
        }
        res.json(rows)
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const export_retenciones = async (req, res) => {
    try {
        // const data = req.params;
        const data = req.query;
        // let factura_num = 'A014B7790508058'
        // let num_fac = data.factura_num.toString();
        if (!data) {
            return res.status(300).json({ message: "No tiene identificador" })
        }
        const { rows } = await pool.query(`SELECT *
            FROM (
                SELECT 
                a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                a.organizacion_id, a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc, a.documento_retencion, TO_CHAR(fecha, 'YYYYMM') || lpad(documento_retencion, 8, '0') AS doc,
                SUM(a.exento) as exento, SUM(a.subtotal) AS subtotal, SUM(a.impuesto) AS impuesto, SUM(a.retencion) AS retencion, SUM(a.total) AS total,
                json_agg(
                        json_build_object(
                                'alicuota', a.alicuota,
                                'porc_renten', a.porc_renten,
                                'subtotal', a.subtotal,
                                'impuesto', a.impuesto,
                                'retencion', a.retencion,
                                'total', a.total,
                                'exento', a.exento
                        )
                ) AS detalles
                FROM (
                    SELECT a.id, a.factura_num, a.nro_control, a.fecha, a.fecha_emision, 
                    CASE WHEN a.tipo_doc = 'LIQU' THEN 'FAC' ELSE a.tipo_doc END tipo_doc,
                    a.organizacion_id, a.documento_retencion, c.ci2 as ci2_proveedor, c.razon_social as razon_social_proveedor, 
                    c.telefono as telefono_proveedor, c.direccion as direccion_proveedor, 
                    d.name AS organizacion, d.direccion as direccion_organizacion, d.telefono as telefono_organizacion, d.nit AS nit_org, 
                    a.alicuota, a.base_ret AS subtotal, a.impuesto_ret AS impuesto, a.monto AS retencion, a.base_ret + a.impuesto_ret AS total,
                    CASE WHEN a.alicuota = 0 THEN a.base_ret else 0 end AS exento,
                    b.porc_renten
                    FROM
                            registro_retencion AS a 
                            JOIN mretenciones  AS b ON b.id = a.retencion_id
                            JOIN mproveedor    AS c on c.id = a.proveedor_id
                            JOIN morganizacion AS d on d.id = a.organizacion_id
                            WHERE b.correlativo_id = 1 AND c.id = $1
                            AND a.factura_num = $2
                    ORDER BY
                            a.ID DESC
                ) AS a
                GROUP BY a.ci2_proveedor, a.razon_social_proveedor, a.telefono_proveedor, a.direccion_proveedor, 
                a.organizacion_id, a.organizacion, a.direccion_organizacion, a.telefono_organizacion, a.nit_org,
                a.factura_num, a.nro_control, a.fecha, a.fecha_emision, a.tipo_doc, a.documento_retencion
            ) AS a
        `, [data.id_proveedor, data.factura_num])
        // 
        if (rows.length === 0) {
            return res.status(300).json({ message: "No se encontraron el numero de factura solicitado 213" })
        }
        res.json(rows)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const excel_retenciones = async (req, res) => {
    try {
        const data = req.body;
        const columnas = [
            { index: true, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "factura_num", nombre: "Factura" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "nro_control", nombre: "Control" },
            { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha", nombre: "F.Recepción" },
            { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_emision", nombre: "F.Emisión" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "subtotal", nombre: `Subtotal` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "impuesto", nombre: `Impuesto` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "retencion", nombre: `Retención` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "total", nombre: "Total" },
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