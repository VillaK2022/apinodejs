import { pool } from "../db.js";

//traer data de la tienda
export const mbarra_codigo = async (req, res) => {
    
    try {
        const datos = req.query;
        const { rows } = await
            pool.query(`SELECT b.barra, b.descripcion, c.descripcion as articulo, b.cod_tercero, b.id
                FROM mcodigobararticulo AS a
                JOIN mcodigobarra AS b ON b.id = a.codbarra_id
                JOIN marticulo AS c on c.id = a.articulo_id
                WHERE b.deleted_at IS NULL AND a.deleted_at IS NULL AND c.codigo = $1
                ORDER BY b.descripcion ASC`, [datos.item]) ;
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
        const datos = req.query;
        const { rows } = await
            pool.query(`SELECT b.barra, b.descripcion, c.descripcion as articulo, b.cod_tercero, b.id
                FROM mcodigobararticulo AS a
                JOIN mcodigobarra AS b ON b.id = a.codbarra_id
                JOIN marticulo AS c on c.id = a.articulo_id
                WHERE b.deleted_at IS NULL AND a.deleted_at IS NULL AND c.codigo = $1
                ORDER BY b.descripcion ASC`, [datos.item]) ;
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar barra asociadas" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
