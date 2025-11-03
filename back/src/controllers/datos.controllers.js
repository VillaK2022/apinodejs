import { pool } from "../db.js";
import CryptoJS from 'crypto-js';

//traer data del tercero
export const getdatos = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await
            pool.query(`
            SELECT * FROM users_tercero WHERE id = ${data.id_tercero} and deleted_at IS NULL and status = '1'
        `);

        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar datos de este tercero" })
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
}

// trar datos obligatorios
export const getdatos_obligatorio = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await
            pool.query(`
            SELECT razon_social, email,  direccion, telefono, contacto,
            vendedor, correo_vendedor, telefono_vendedor, dia_pedido, frecuencia_despacho,
            emailcontacto, telefonocontacto, telefonomovil
            FROM users_tercero WHERE id = ${data.id_tercero} 
            and deleted_at IS NULL and status = '1'
        `);

        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar datos de este tercero" })
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
}
// trar datos obligatorios
export const getdatos_todos = async (req, res) => {
    try {
        const data = req.body;
        const { rows } = await
            pool.query(`
            SELECT ci2, razon_social, email,  direccion, telefono, contacto,
            vendedor, correo_vendedor, telefono_vendedor, dia_pedido, frecuencia_despacho,
            emailcontacto, telefonocontacto, telefonomovil, representante1, email_representante1,
            telefono_representante1, celular_representante1, representante2, email_representante2,
            telefono_representante2, celular_representante2, representante3, email_representante3,
            telefono_representante3, celular_representante3, representante4, email_representante4,
            telefono_representante4, celular_representante4, representante5, email_representante5,
            telefono_representante5, celular_representante5
            FROM users_tercero WHERE id = ${data.id_tercero} 
            and deleted_at IS NULL and status = '1'
        `);

        if (rows.length === 0) {
            return res.status(300).json({ message: "No fue posible encontrar datos de este tercero" })
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
}

//actualizar 3ro
export const actualizartercero = async (req, res) => {
    try {
        const actualizado = 1;
        const data = req.body;
        if (!data.id_tercero) return res.status(300).json({ message: "Falta el identificador" })
        try {
            const historico = await insertHistorytercero(req, res);
            if (!!historico.error) {
                console.error(historico.error);
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 1" })
            } else if (!historico.filas || !Array.isArray(historico.filas)) {
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 2" })
            } else if (historico.filas.length === 0) {
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 3" })
            }
        } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email ya existe" })
        }
        return res.status(500).json({ message: "Internal server error" })
    }
        // console.log(data);
        const updated_at = new Date().toLocaleString('es-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/[/]/g, '-').replace(/[,]/g, '');
        // actualizo datos de users_tercero
        const { rows: users_tercero } = await pool.query(
            `UPDATE users_tercero SET 
                direccion = $1, 
                telefono = $2,
                email = $3,
                telefonomovil = $4,
                contacto = $5,
                emailcontacto = $6,
                telefonocontacto = $7,
                correo_vendedor = $8,
                vendedor = $9,
                telefono_vendedor = $10,
                dia_pedido = $11,
                frecuencia_despacho = $12,
                email_representante1 = $13,
                email_representante2 = $14,
                email_representante3 = $15,
                email_representante4 = $16,
                email_representante5 = $17,
                representante1 = $18,
                representante2 = $19,
                representante3 = $20,
                representante4 = $21,
                representante5 = $22,
                celular_representante1 = $23,
                celular_representante2 = $24,
                celular_representante3 = $25,
                celular_representante4 = $26,
                celular_representante5 = $27,
                telefono_representante1 = $28,
                telefono_representante2 = $29,
                telefono_representante3 = $30,
                telefono_representante4 = $31,
                telefono_representante5 = $32,
                updated_at = $33,
                actualizado = $34
                    WHERE id = $35 
            RETURNING *;`,
            [
                data.direccion,
                data.telefono,
                data.correo,
                data.telefono_movil,
                data.contacto,
                data.correo_contacto,
                data.telefono_contacto,
                data.correo_vendedor,
                data.vendedor,
                data.telefono_vendedor,
                data.dia_pedido,
                data.fre_despacho,
                data.email_representante,
                data.email_admin,
                data.email_gerente_ventas,
                data.email_gerente_regional,
                data.email_vendedor,
                data.nombre_representante,
                data.nombre_admin,
                data.nombre_gerente_ventas,
                data.nombre_gerente_regional,
                data.nombre_vendedor,
                data.celular_representante,
                data.celular_admin,
                data.celular_gerente_ventas,
                data.celular_gerente_regional,
                data.celular_vendedor,
                data.telefono_representante,
                data.telefono_admin,
                data.telefono_gerente_ventas,
                data.telefono_gerente_regional,
                data.telefono_vendedor_comerciales,
                updated_at,
                actualizado,
                data.id_tercero
            ]
        );
        const repres = [
            { tipo: 1, email: data.email_admin,            nombre: data.nombre_admin,            celular: data.celular_admin,            telefono: data.telefono_admin },
            { tipo: 4, email: data.email_vendedor,         nombre: data.nombre_vendedor,         celular: data.celular_vendedor,         telefono: data.telefono_vendedor_comerciales },
            { tipo: 0, email: data.email_representante,    nombre: data.nombre_representante,    celular: data.celular_representante,    telefono: data.telefono_representante },
            { tipo: 2, email: data.email_gerente_ventas,   nombre: data.nombre_gerente_ventas,   celular: data.celular_gerente_ventas,   telefono: data.telefono_gerente_ventas },
            { tipo: 3, email: data.email_gerente_regional, nombre: data.nombre_gerente_regional, celular: data.celular_gerente_regional, telefono: data.telefono_gerente_regional },
        ];
        for (let i = 0; i < repres.length; i++) {
            const element = repres[i];
            const { rows: proveerepres } = await pool.query(
                `INSERT INTO proveerepres (proveedor_id, representante, email, telefonooficina, telefonocelular, tipo_repre, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5 , $6, now(), now())
                ON CONFLICT ON CONSTRAINT uniqueproveedor_id_tipo_repre DO UPDATE 
                SET
                    representante   = EXCLUDED.representante, 
                    email           = EXCLUDED.email,
                    telefonooficina = EXCLUDED.telefonooficina,
                    telefonocelular = EXCLUDED.telefonocelular,
                    updated_at      = EXCLUDED.updated_at
            `, [data.id, (!element.nombre ? '' : element.nombre), (!element.email ? '' : element.email), (!element.telefono ? '' : element.telefono), (!element.celular ? '' : element.celular), element.tipo]);
            console.log("proveerepres", proveerepres);
        }
        
        const { rows: mproveedor } = await pool.query(
            `UPDATE mproveedor SET 
                direccion = $1, 
                telefono = $2,
                email = $3,
                telefonomovil = $4,
                contacto = $5,
                emailcontacto = $6,
                telefonocontacto = $7,
                updated_at = $8
                    WHERE id = $9 
            RETURNING *;`,
            [
                data.direccion,
                data.telefono,
                data.correo,
                data.telefono_movil,
                data.contacto,
                data.correo_contacto,
                data.telefono_contacto,
                updated_at,
                data.id
            ]
        );
        if (users_tercero.length === 0) {
            return res.status(300).json({ message: "No fue posible actualizar datos de este tercero" })
        }
        else if (mproveedor.length === 0) {
            return res.status(300).json({ message: "No fue posible actualizar datos de proveedor" })
        } else {
            return res.json(users_tercero[0]);
        }
    } catch (error) {
        console.error(error);
    }
}

//inserta historico tercero
export const insertHistorytercero = async (req, res) => {
    try {
        const data = req.body;
        // console.log('insertHistorytercero', data);
        const { rows: selectTercero } = await pool.query(
            `SELECT * FROM users_tercero WHERE id = ${data.id_tercero}`
        );
        // console.log(selectTercero)
        const { rows: insertTercero } = await pool.query(
            `INSERT INTO users_tercero_history (
                id_user_tercero, username, direccion, telefono, email, codigo, ci1, ci2, password, razon_social, telefonomovil, contacto,
                emailcontacto, telefonocontacto, correo_vendedor, vendedor, telefono_vendedor, dia_pedido, frecuencia_despacho,
                email_representante1, email_representante2, email_representante3, email_representante4, email_representante5,
                representante1, representante2, representante3, representante4, representante5,
                celular_representante1, celular_representante2, celular_representante3, celular_representante4, celular_representante5,
                telefono_representante1, telefono_representante2, telefono_representante3, telefono_representante4, telefono_representante5,
                updated_at, created_at, deleted_at, status, actualizado
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11, $12, 
                $13, $14, $15, $16, $17,
                $18, $19, $20, $21, $22,
                $23, $24, $25, $26, $27,
                $28, $29, $30, $31, $32,
                $33, $34, $35, $36, $37,
                $38, $39, $40, $41, $42,
                $43, $44
            ) RETURNING *`,
            [
                selectTercero[0].id,
                selectTercero[0].username,
                selectTercero[0].direccion,
                selectTercero[0].telefono,
                selectTercero[0].email,
                selectTercero[0].codigo,
                selectTercero[0].ci1,
                selectTercero[0].ci2,
                selectTercero[0].password,
                selectTercero[0].razon_social,
                selectTercero[0].telefonomovil,
                selectTercero[0].contacto,
                selectTercero[0].emailcontacto,
                selectTercero[0].telefonocontacto,
                selectTercero[0].correo_vendedor,
                selectTercero[0].vendedor,
                selectTercero[0].telefono_vendedor,
                selectTercero[0].dia_pedido,
                selectTercero[0].frecuencia_despacho,
                selectTercero[0].email_representante1,
                selectTercero[0].email_representante2,
                selectTercero[0].email_representante3,
                selectTercero[0].email_representante4,
                selectTercero[0].email_representante5,
                selectTercero[0].representante1,
                selectTercero[0].representante2,
                selectTercero[0].representante3,
                selectTercero[0].representante4,
                selectTercero[0].representante5,
                selectTercero[0].celular_representante1,
                selectTercero[0].celular_representante2,
                selectTercero[0].celular_representante3,
                selectTercero[0].celular_representante4,
                selectTercero[0].celular_representante5,
                selectTercero[0].telefono_representante1,
                selectTercero[0].telefono_representante2,
                selectTercero[0].telefono_representante3,
                selectTercero[0].telefono_representante4,
                selectTercero[0].telefono_representante5,
                selectTercero[0].updated_at,
                selectTercero[0].created_at,
                selectTercero[0].deleted_at,
                selectTercero[0].status,
                selectTercero[0].actualizado
            ]
        );
        // console.log(insertTercero);
        return { filas: insertTercero };
    } catch (error) {
        console.error(error);
        return { error: error };
    }
}

//cambiar contraseña
export const cambiarpassword = async (req, res) => {
    try {
        const data = req.body;
        const password = data.password;
        const hash = CryptoJS.SHA1(data.password).toString();
        if (!data.id_tercero) return res.status(300).json({ message: "Falta el identificador" })
        try {
            const historico = await insertHistorytercero(req, res);
            if (!!historico.error) {
                console.error(historico.error);
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 1" })
            } else if (!historico.filas || !Array.isArray(historico.filas)) {
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 2" })
            } else if (historico.filas.length === 0) {
                return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 3" })
            }
        } catch (error) {
            return res.status(300).json({ message: "No fue posible actualizar datos de este tercero 4" });
        }
        const updated_at = new Date().toLocaleString('es-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/[/]/g, '-').replace(/[,]/g, '');

        const { rows } = await pool.query(
            `UPDATE users_tercero SET 
                password = $1, 
                updated_at = $2
                    WHERE id = $3 
            RETURNING *;`,
            [
                hash,
                updated_at,
                data.id_tercero
            ]
        );
        if (!rows.length) {
            return res.status(300).json({ message: "No fue posible actualizar datos de este tercero" })
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
    }
}