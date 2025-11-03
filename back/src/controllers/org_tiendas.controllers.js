import { pool } from "../db.js";

//traer data de la tienda
export const tiendas = async (req, res) => {
    try {
        // const data = req.query;
        const { rows } = await
            pool.query(`SELECT descripcion, id as id_tienda FROM mtienda where deleted_at is null and status = 1 order by descripcion `);
        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar tiendas" })
        } else {
            return res.json(rows);
        }
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error });
    }
}
