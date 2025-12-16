import { pool } from "../db.js";
import { excel_basico_barras_desc } from './excel.controllers.js';
//traer data de la tienda
export const mbarra_codigo = async (req, res) => {

    try {
        const datos = req.query;
        const { rows } = await
            pool.query(`SELECT b.barra, b.descripcion, COALESCE(NULLIF(c.desc_tercero, ''), c.descripcion) as articulo, b.cod_tercero, b.id
                FROM mcodigobararticulo AS a
                JOIN mcodigobarra AS b ON b.id = a.codbarra_id
                JOIN marticulo AS c on c.id = a.articulo_id
                WHERE b.deleted_at IS NULL AND a.deleted_at IS NULL AND c.codigo = $1
                ORDER BY b.descripcion ASC`, [datos.item]);
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar barra asociadas" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
export const actualizar_mcodigobarra_cod_tercero = async (req, res) => {
    try {
        const data = req.body.params;
        const cod_tercero = 0;
        const cod_tercero1 = 1
        // console.log(data,'data');
        // console.log(data.array, 'array');

        if (!Array.isArray(data.array) || data.array.length === 0) {
            return res.status(400).json({ message: "No hay elementos para actualizar" })
            console.log('no hat elementos');
        }
        const updatedRows = [];
        for (const element of data.array) {
            const { rows: vaciar } = await pool.query(
                'UPDATE mcodigobarra set cod_tercero = $1 WHERE id = $2 RETURNING *',
                [cod_tercero, element.id]
            )
            if (vaciar[0]) updatedRows.push(vaciar[0]);
        }
        const { rows } = await pool.query(
            'UPDATE mcodigobarra set cod_tercero = $1 WHERE id = $2 RETURNING *',
            [cod_tercero1, data.item.id]
        )
        return res.json(rows)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const actualizar_mcodigobarra_marticulodesc = async (req, res) => {
    try {
        const data = req.body.params;
        const cod_tercero = 0;
        const cod_tercero1 = 1
        // console.log(data,'data');
        // console.log(data.array, 'array');

        if (!Array.isArray(data.array) || data.array.length === 0) {
            return res.status(400).json({ message: "No hay elementos para actualizar" })
            console.log('no hat elementos');
        }
        const updatedRows = [];
        for (const element of data.array) {
            const { rows: vaciar } = await pool.query(
                'UPDATE mcodigobarra set cod_tercero = $1 WHERE id = $2 RETURNING *',
                [cod_tercero, element.id]
            )
            if (vaciar[0]) updatedRows.push(vaciar[0]);
        }
        const { rows } = await pool.query(
            'UPDATE mcodigobarra set cod_tercero = $1 WHERE id = $2 RETURNING *',
            [cod_tercero1, data.item.id]
        )
        return res.json(rows)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const excel_barras_desc = async (req, res) => {
    try {
        const data = req.body;
        const columnas = [
            // { index: true, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: false, variable: "index", nombre: "#" },
            { index: false, mostrar: true, ajustar: true, date: false, number: true, sin_decimal: true, text: false, variable: "barra", nombre: "Barra" },
            { index: false, mostrar: true, ajustar: true, date: false, number: false, sin_decimal: false, text: true, variable: "descripcion", nombre: "Descripcion" },
        ]
        return excel_basico_barras_desc(req, res, data.titulo, columnas, data.fecha);
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Error", error: error });
    }
}
export const actualizar_mcodigobarra_cod_tercero_desc = async (req, res) => {
    try {
        const data = req.body.params;
        const cod_tercero = 0;
        const cod_tercero1 = 1

        if (!Array.isArray(data.item) || data.item.length === 0) {
            return res.status(400).json({ message: "No hay elementos para actualizar" })
            console.log('no hay elementos');
        }
        let validos   = [];
        let invalidos = [];
        // const updatedRows = [];
        for (const element of data.item) {
            try {
                const { rows: codigosasociados } = await pool.query(
                    `SELECT a.id, a.barra, b.articulo_id, b.codbarra_id FROM mcodigobarra as a
                    INNER JOIN mcodigobararticulo as b on a.id = b.codbarra_id 
                    where a.barra = $1 AND b.deleted_at IS NULL AND a.deleted_at IS NULL`,
                    [element.Barra]
                );
                // VALIDAR QUE EXISTA LA BARRA
                if (!codigosasociados.length) {
                    element.error = "LA BARRA NO EXISTE";
                    invalidos.push(element);
                    continue;
                }
                // VALIDAR SI EL ARTICULO YA ESTA VALIDO
                if (!!validos.find(e => e.articulo_id == codigosasociados[0].articulo_id)) {
                    element.error = "EL ARTICULO YA SE ENCUENTRA EN EL ARCHIVO";
                    invalidos.push(element);
                    continue;
                }
                // MODIFICAR TODOS LOS CODIGO DEL ARTICULO CONSEGUIDO
                await pool.query(
                    `UPDATE mcodigobarra SET cod_tercero = 0 WHERE id IN (
                        SELECT a.id 
                        FROM mcodigobarra as a
                        INNER JOIN mcodigobararticulo as b on a.id = b.codbarra_id 
                        WHERE b.articulo_id = $1 AND b.deleted_at IS NULL AND a.deleted_at IS NULL
                        GROUP BY 1
                    )
                    `,
                    [codigosasociados[0].articulo_id]
                );
                // MODIFICAR EL CODIGO VALIDADO POR EL TERCERO
                await pool.query(
                    `UPDATE mcodigobarra SET cod_tercero = 1 WHERE id = $1 and deleted_at IS NULL`,
                    [codigosasociados[0].id]
                );   

                await pool.query(
                    `UPDATE marticulo SET desc_tercero = $1 WHERE id = $2`,
                    [element.Descripcion, codigosasociados[0].articulo_id]
                );   
                element.articulo_id = codigosasociados[0].articulo_id;
                validos.push(element)
            } catch (error) {
                element.error = "ERROR AL TRATAR DE MODIFICAR";
                invalidos.push(element);
                console.error(`Error fetching data for ID ${element.cxp_id}:`, error);
                continue;
            }
        }
        const respuesta = {
            "validos"   : validos,
            "invalidos" : invalidos,
        };
        return res.json(respuesta);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}