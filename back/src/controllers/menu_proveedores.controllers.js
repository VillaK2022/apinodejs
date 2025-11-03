import { pool } from "../db.js";

export const menu = async (req, res) => {
    try {
        const data = req.query;
        if (!data) {
            return res.status(300).json({ message: "No tiene identificador" })
        }
            const menu_data = !data.menu ? "" : `OR id IN (${data.menu})`;
            const {rows: menu } = await pool.query(`SELECT * FROM menu_proveedores WHERE (validado IN (0,2) ${menu_data}) AND activo = 1 AND deleted_at IS NULL ORDER BY orden asc`);
        if (menu.length === 0) {
            res.json(menu);
        } else {
            res.json(menu)
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "El servidor no puede procesar una solicitud del cliente", error: error });
    }
}

