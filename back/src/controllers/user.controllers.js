import { pool } from "../db.js";

//consultar todos los usuarios
export const getusers = async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE deleted_at IS NULL AND status = '1'`)
    // console.log(rows);
    res.json(rows)

    // res.send('obteniendo usuarios')
}

//consultar un usuario
export const getuser = async (req, res) => {
    // const data = req.params;
    const data = req.query;
    const { rows } = await pool.query(`SELECT * FROM users_tercero WHERE id = $1 AND deleted_at IS NULL AND status = '1'`, [data.usuario])

    if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    res.json(rows[0])

    // res.send('obteniendo un usuario' + id)
}

//crear un usuario
export const createuser = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await pool.query(
            "INSERT INTO users (name, email) values ($1, $2) RETURNING *",
            [data.name, data.email]
        );
        return res.json(rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email ya existe" })
        }
        return res.status(500).json({ message: "Internal server error" })
    }
}

//eliminar un usuario
export const deleteuser = async (req, res) => {
    const { id } = req.params
    const { rows, rowCount } = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
    );
    console.log(rows);

    if (rowCount === 0) {
        return res.status(404).json({ message: "Usuario no eliminado" })
    }
    // return res.json({ rows })
    return res.sendStatus(204)
    // res.send('eliminando usuario')


}

//actualizar un usuario
export const updateuser = async (req, res) => {
    try{

    const { id } = req.params;
    const data = req.body;

    const { rows } = await pool.query(
        'UPDATE users set name = $1, email = $2 WHERE id = $3 RETURNING *',
        [data.name, data.email, id]
    )
    return res.json(rows[0])
    
    }catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email ya existe" })
        }
        return res.status(500).json({ message: "Internal server error" })
    }
}

