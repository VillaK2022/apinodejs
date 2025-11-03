import { pool } from "../db.js";
import { excelBasico } from './excel.controllers.js';
//buscar todas los pagos del proveedor con fecha y id_proveedor
export const cargar_pagos = async (req, res) => {
    try {
        const data = req.query;
        if (!data) {
            return res.status(300).json({ message: "No tiene identificador" })
        }
        const num_factura = data.fact;
        const j_factura =  num_factura ? `
                JOIN (
					SELECT a.id registro_banco_id
					FROM registro_banco AS a
					JOIN reg_ban_cxp    AS b ON b.regbanco_id = a.id
					JOIN cxp_p          AS c ON c.id = b.cxp_id
					WHERE c.numero_fact ilike '%${num_factura}%' and c.deleted_at is null and b.deleted_at is null
					GROUP BY a.id 
				) AS rc ON rc.registro_banco_id = registro_banco.id
        ` : ' ';
        const w_fecha = !!data.fechaini && !!data.fechafin ? ` and fecha_pago BETWEEN '${data.fechaini}'::date and '${data.fechafin}'::date ` : '';
        const query = `SELECT
            registro_banco.id,
            registro_banco.organizacion_id,
            registro_banco.tienda_id,
            registro_banco.codigo_id,
            registro_banco.fecha_pago,
            registro_banco.tipo_mov,
            registro_banco.monto,
                mt.descripcion as tienda,
                mo.name as organizacion,
                mp.razon_social as proveedor
        FROM
            registro_banco
                JOIN morganizacion as mo on mo.id = registro_banco.organizacion_id
                JOIN mtienda as mt on mt.id = registro_banco.tienda_id
                JOIN mproveedor as mp on mp.id = registro_banco.codigo_id
                ${j_factura}
                WHERE registro_banco.codigo_id = $1
                ${w_fecha}
                and registro_banco.deleted_at is null
        ORDER BY
            registro_banco.fecha_pago ASC`;
        console.log("query", query);
        const { rows } = await pool.query(query, [data.id_proveedor])
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron pagos" })
        }
        res.json(rows)
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "El servidor no puede procesar una solicitud del cliente", error: error });
    }
}
export const export_pagos = async (req, res) => {
    try {
        const data = req.query;
        if (!data) {
            return res.status(300).json({ message: "No tiene identificador" })
        }
        let registro_banco = null;
        
        const { rows: registroBanco } = await pool.query(`
            SELECT
            rb.*, mb.descripcion AS banco, mc.num_cuenta AS cuenta, users.name AS usuario, mtienda.descripcion as tienda, morganizacion.name AS organizacion, 
            morganizacion.nit, morganizacion.id AS id_organizacion, mb_p.descripcion AS banco_prov, mc_p.numerodecuenta as cuenta_prov,
            conceptos_contables.concepto
            FROM
                registro_banco AS rb
                left JOIN mbanco AS mb on mb.id = rb.banco_id
                left JOIN mcuentabanco AS mc on mc.id = rb.cuenta_id
                left JOIN mbanco AS mb_p ON mb_p.id = rb.bancoprov_id
                left JOIN proveecutabanc AS mc_p ON mc_p.id = rb.cuentaprov_id
                left JOIN users ON users.id = rb.usuario_id
                left JOIN mtienda ON mtienda.id = rb.tienda_id
                left JOIN morganizacion on morganizacion.id = rb.organizacion_id
                left JOIN conceptos_contables ON conceptos_contables.id = rb.concepto_pago_id
            WHERE
                rb.ID = $1 
            ORDER BY rb.fecha_pago DESC
                LIMIT 1`,  [data.id]
            )
            // console.log(registroBanco);
            
            if (!registroBanco.length) {
                return res.status(300).json({ message: "No se encontro registro banco" });
            }
            registro_banco = {...registroBanco[0]};
            const { rows: movimientos } = await pool.query(`
            SELECT a.*, b.id AS id_cpx, b.proveedor_id AS proveedor_cpx, b.tipo, d.descripcion as tipo_documento, 
            b.fact_afecta, b.numero_fact, b.fecha_factura, b.fecha_vence, b.fecha_registro, b.monto_cargo, b.retencion,
            (b.monto_cargo + b.retencion) AS total, (b.monto_cargo - b.monto_descargo) AS saldo, 
            (b.monto_cargo + b.retencion - b.monto_cargo + b.monto_descargo - a.monto) AS abono, COALESCE(mfc.total_nc, 0) AS total_nc
                FROM
                        reg_ban_cxp AS a
                        JOIN cxp_p AS b ON b.ID = a.cxp_id 
                        JOIN mproveedor as c ON c.id = a.proveedor_id
                        JOIN mtipodocumento as d ON d.id = c.tipodocumento_one_id
                        LEFT JOIN (
                            SELECT doc_afecta_id, SUM(total) AS total_nc
                            FROM movimiento_factura
                            WHERE deleted_at IS NULL AND doc_afecta_id IS NOT NULL AND tipo_doc IN ('NC', 'NCDV', 'NCD')
                            GROUP BY 1
                        ) AS mfc ON mfc.doc_afecta_id = b.id
                WHERE
                        a.regbanco_id = $1 AND a.deleted_at is null`, [registro_banco.id]);
            // ADD MOVIMIENTOS 
            let mov_afect = [];
            for (const element of movimientos) {
                try {
                    const { rows: movimientos_afectados } = await pool.query(
                        `
                        SELECT * from movimiento_factura where doc_afecta_id = $1
                        `,
                        [element.cxp_id]
                    ); 
                    if (!!movimientos_afectados.length) {
                        movimientos_afectados.forEach(element => {
                            mov_afect.push({...element});
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching data for ID ${element.cxp_id}:`, error);
                }
            }
        if (!registro_banco) {
            return res.status(300).json({ message: "No se encontro pago solicitado" })
        }        
        res.json({registro_banco: registro_banco, movimientos: movimientos, mov_afect: mov_afect})
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const excel_pagos = async (req, res) => {
    try {
        const data = req.body;
        const columnas = [
            { index: true, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "organizacion", nombre: "Organizacion" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "tienda", nombre: "Tienda" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "id", nombre: "#Pago" },
            { index: false, mostrar: true, ajustar: true, date: true, number: false, sin_decimal: false, text: false, variable: "fecha_pago", nombre: "F.Emisión" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "tipo_mov", nombre: `Tipo` },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: false, text: false, variable: "monto", nombre: `Monto` },
        ]
        return excelBasico(req, res, data.titulo, columnas, data.datos, data.fecha);
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Error", error: error });
    }
}
