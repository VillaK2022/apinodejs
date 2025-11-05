import { Router } from "express";
import { login } from "../controllers/login.controllers.js";
import { cargar_retenciones, export_retenciones, excel_retenciones } from "../controllers/retenciones.controllers.js";
import { cargar_pagos, export_pagos, excel_pagos } from "../controllers/pagos.controllers.js";
import { getdatos, actualizartercero, cambiarpassword, getdatos_obligatorio, getdatos_todos } from "../controllers/datos.controllers.js";
import { tablaconsultar } from "../controllers/tabla.controllers.js";
import { menu } from "../controllers/menu_tercero.controllers.js";
import { tiendas } from "../controllers/org_tiendas.controllers.js";
import { existencia, excel_inv} from "../controllers/inventario.controllers.js";
import { mbarra_codigo, actualizar_mcodigobarra_cod_tercero } from "../controllers/articulos_barras.controllers.js";
import { ventas_existencia,excel_venta_vs_inv, ventas_x_periodo, excel_venta_x_periodo } from "../controllers/ventas.controllers.js";
import { getusers, getuser, createuser, deleteuser, updateuser } from "../controllers/user.controllers.js";
const router = Router();

// -------------------------USUARIOS-------------------------------------------------------------

// consultar usuarios y crear

router.get('/users', getusers);

// consultar 1 usuarios
router.get('/usuario', getuser);

// Crear usuario
router.post('/users', createuser);

// eliminar usuarios
router.delete('/users/:id', deleteuser );

// Actualizar usuario
router.put('/users/:id', updateuser);

//--------------------------- LOGIN -------------------------------------------------------------
router.post('/login', login);

//--------------------------- DATOS TERCERO -------------------------------------------------------------
router.post('/datos', getdatos);

router.post('/datos_todos', getdatos_todos);

router.post('/datos_obligatorios', getdatos_obligatorio);

router.post('/actualizardatostercero', actualizartercero);

router.post('/cambiarpassword', cambiarpassword);

// --------------------------- retenciones ------------------------------------------------------------
router.post('/cargar_reten', cargar_retenciones);
router.get('/export_reten', export_retenciones);

//----------------------------Pagos------------------------------------------------------------------------
router.get('/cargar_pagos', cargar_pagos);
router.get('/export_pagos', export_pagos);

// --------------------------- tabla ------------------------------------------------------------
router.post('/tabla', tablaconsultar);

//-----------------------------Menu_tercero -------------------------------------------------
router.get('/menu', menu);

//-----------------------------Controlador para tienda y organización -------------------------------------------------
router.get('/tiendas', tiendas);

//----------------------------- INVENTARIO -----------------------------------------------------------------------------------
router.get('/existencia', existencia);
//----------------------------- VENTAS -----------------------------------------------------------------------------------
router.get('/ventas_existencia', ventas_existencia);
router.get('/ventas_x_periodo', ventas_x_periodo);

// ----------------------------- Articulos, barras y codigos -------------------------------------------------------------
router.get('/mbarra_codigo', mbarra_codigo);
router.put('/actualizar_mcodigobarra_cod_tercero', actualizar_mcodigobarra_cod_tercero);


//----------------------------- EXCELS -----------------------------------------------------------------------------------
router.post('/excel_inv', excel_inv);
router.post('/excel_venta_vs_inv', excel_venta_vs_inv);
router.post('/excel_venta_x_periodo', excel_venta_x_periodo);
router.post('/excel_retenciones', excel_retenciones);
router.post('/excel_pagos', excel_pagos);
export default router;
