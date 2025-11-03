import { pool } from "../db.js";


export const tablaconsultar = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await
            pool.query(`
            SELECT * FROM users_tercero WHERE id = ${data.id}
        `);

        if (rows.length === 0) {
            return res.status(300).json({ message: "Usuario no encontrado" })
        } else {
            return res.json(rows);
            console.log(rows);
        }

    } catch (error) {
        console.error(error);
    }
}