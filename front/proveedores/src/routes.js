const routes = [
  {
    path: '/',
    name: 'home', // El nombre de la ruta (recomendado)
    component: () => import('./views/login/login.vue'),
    meta: { requiresAuth: false }
  },

  //----------------------- login --------------------------------

  //------------------------pantalla welcome ----------------------------------
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('./views/welcome/welcome.vue'),
    meta: { requiresAuth: true }
  },

  //------------------------pantalla principal/dashboard ----------------------------------

  {
    path: '/principal',
    name: 'principal',
    component: () => import('./views/principal/principal.vue'),
    meta: { requiresAuth: true }
  },

  //_----------------------retenciones ---------------------------------
  {
    path: '/retenciones',
    name: 'retenciones',
    component: () => import('./views/retenciones/retenciones.vue'),
    meta: { requiresAuth: true }
  },

  //-----------------------Inventario----------------------------
  {
    path: '/inventario',
    name: 'inventario',
    component: () => import('./views/inventario/inventario.vue'),
    meta: { requiresAuth: true }
  },


  //------------------------perfil-------------------------------------
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('./views/login/perfil.vue'),
    meta: { requiresAuth: true }
  },


  //-----------------------Ventas-----------------------------------------
  {
    path: '/ventas_vs_inv',
    name: 'ventas_vs_inv',
    component: () => import('./views/ventas/ventas_vs_inv.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas_x_periodo',
    name: 'ventas_x_periodo',
    component: () => import('./views/ventas/ventas_x_periodo.vue'),
    meta: { requiresAuth: true }
  },


  //---------------------datos del tercero---------------------------------
  {
    path: '/datos',
    name: 'datos',
    component: () => import('./views/datos/datos.vue'),
    meta: { requiresAuth: true }
  },

  //-----------------------pagos--------------------------------------------
  {
    path: '/pagos',
    name: 'pagos',
    component: () => import('./views/pagos/pagos.vue'),
    meta: { requiresAuth: true }
  },


  //----------------------menu lateral---------------------------------------
  {
    path: '/sidebard',
    name: 'sidebard',
    component: () => import('./components/sidebar.vue'),
    meta: { requiresAuth: true }
  },


  // -------------------- si no consigue ruta -----------------------------------
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('./views/NotFound.vue'), // Create this component!
    meta: {requiresAuth: false} 
  }
];

export default routes;
