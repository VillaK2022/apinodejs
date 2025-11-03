import pg from "pg";

// 1. OID para DATE (para mantener tu configuración anterior)
const DATE_OID = 1082; 
// 2. OID para TIMESTAMP WITHOUT TIME ZONE (FECHA Y HORA LOCAL)
const TIMESTAMP_WITHOUT_TIMEZONE_OID = 1114; 
// 3. OID para TIMESTAMP WITH TIME ZONE (FECHA Y HORA UTC/GLOBAL)
const TIMESTAMP_WITH_TIMEZONE_OID = 1184;

// Configurar el parseador para devolver la cadena original (YYYY-MM-DD)
pg.types.setTypeParser(DATE_OID, (stringValue) => {
    return stringValue; 
});

// Configurar el parseador para devolver la cadena original (YYYY-MM-DD HH:MM:SS)
pg.types.setTypeParser(TIMESTAMP_WITHOUT_TIMEZONE_OID, (stringValue) => {
    return stringValue; 
});

// Nota Importante sobre 1184:
// Generalmente, el tipo 1184 (TIMESTAMP WITH TIME ZONE) se debe dejar como objeto Date
// ya que representa un punto exacto en el tiempo. Si lo cambias a string, 
// perderás la información de zona horaria adjunta. 
// Si *realmente* quieres el string original, haz lo mismo:
/*
pg.types.setTypeParser(TIMESTAMP_WITH_TIMEZONE_OID, (stringValue) => {
    return stringValue; 
});
*/
// local bd BIADMIN conexion
export const pool = new pg.Pool ({
    user: "postgres",
    host: "localhost",
    password: "27815919",
    database: "BIADMIN",
    port: "5432"
})

// biadmin conexión
// export const pool = new pg.Pool ({
//     user: "postgres",
//     host: "192.168.125.15",
//     password: "Nozrag*2021",
//     database: "BIADM",
//     port: "5432"
// })

// local bd postgres conexion
// export const pool = new pg.Pool ({
//     user: "postgres",
//     host: "localhost",
//     password: "27815919",
//     database: "postgres",
//     port: "5432"
// })