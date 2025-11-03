import { pool } from "../db.js";
import CryptoJS from 'crypto-js';

export const login = async (req, res) => {
    try {
        const data = req.body;
        const hash = CryptoJS.SHA1(data.password).toString();
        const status = 1;
        const { rows } = await pool.query(`SELECT * FROM users_tercero WHERE REPLACE(ci2, '-', '') = $1 
            AND password = $2 AND status = $3 AND deleted_at IS NULL`, [data.documento, hash, status])
                    
        if (!rows.length) return res.status(300).json({ message: "Usuario no encontrado" })
        
        return res.json(rows[0]);
    } catch (error) {
        console.error(error);
    }
}