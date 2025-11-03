<template>
    <div v-loading.fullscreen.lock="fullscreenLoading"
            :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
            element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body" v-if="isAuthenticated">
        <!-- Navbar Bootstrap -->
        <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
            <div class="container-fluid">
                <!-- Botón para abrir el sidebar -->
                <button class="menu-toggle me-3" @click="toggleSidebar">
                    <font-awesome-icon icon="fa-solid fa-bars" />
                </button>
                <!-- <span style="color: white;"> Proveedores</span> -->
            </div>
        </nav>

        <!-- Overlay para cerrar sidebar -->
        <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="closeSidebar"></div>

        <!-- Sidebar -->
        <aside style="font-size: 0.9rem;" class="sidebar" :class="{ active: sidebarOpen }">
            <!-- Header del Sidebar -->
            <div class="sidebar-header">
                <h3 class="sidebar-title">
                    <i class="fas fa-compass me-2"></i>Menu
                </h3>
                <button class="sidebar-close" @click="closeSidebar">
                    <font-awesome-icon icon="fa-solid fa-bars" />
                </button>
            </div>

            <!-- Navegación -->
            <nav class="sidebar-nav">
                <template v-for="item in menuItems" :key="item.id">
                    <div class="nav-item">
                        <a href="#"
                            class="nav-link" @click.prevent="activarMenu(item, true)"
                            :class="{ active: activeItem === item.id }">
                            <span style="display: flex;">
                                <span style="margin-right: 10px;">
                                    <div v-if="item.is_font_aw">
                                        <font-awesome-icon :icon="item.icon"/>
                                    </div>
                                    <div v-else>
                                        <el-icon style="font-size: 20px;" >
                                            <component :is="item.icon" />
                                        </el-icon>
                                    </div>
                                </span>
                                <span class="nav-text">{{ item.texto }}</span>
                                <span class="badge ms-auto" :class="item.badgeClass" v-if="item.badge">{{ item.badge}}</span>
                            </span>
                        </a>
                    </div>
                </template>
                <div class="nav-item">
                    <a href="#" class="nav-link" @click="cerrarSesion()">
                        <span style="display: flex;">
                            <el-icon color="red" style="font-size: 20px;">
                                <SwitchButton />
                            </el-icon>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="nav-text">Cerrar Sesi&oacute;n</span>
                        </span>
                    </a>
                </div>
            </nav>

            <!-- Footer del Sidebar -->
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-details">
                        <el-tag type="info" effect="dark">
                            <el-icon>
                                <UserFilled />
                            </el-icon>
                        </el-tag>

                        <div class="user-role">{{ userData.email }}</div>
                        <div class="user-role">{{ userData.codigo }}</div>
                        <div class="user-name">{{ userData.razon_social }}</div>
                    </div>
                </div>
            </div>
        </aside>
    </div>
    <logout-button ref="btnCerrarSesion"></logout-button>
</template>
<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth'
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    import LogoutButton from './LogoutButton.vue'
    import { InfoFilled } from '@element-plus/icons-vue'
    // Props y Emits
    defineOptions({
        name: 'navbarproveedores'
    })
    ///////////////////////////////////////////////////
    /////////////////  Stores y Router
    ///////////////////////////////////////////////////
    const authStore = useAuthStore()
    const router = useRouter()
    const fullscreenLoading = ref(false)
    const loading_msg = ref(null)
    ///////////////////////////////////////////////////
    ///////////////// REFS
    ///////////////////////////////////////////////////
    const sidebarOpen = ref(false)
    const activeItem = ref(1)
    const userData = ref({ ...authStore.user })
    const btnCerrarSesion = ref<InstanceType<typeof LogoutButton> | null>(null)
    const isFirstLoad = ref(true);

    ///////////////////////////////////////////////////
    ///////////////// COMPUTADAS
    ///////////////////////////////////////////////////
    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    ///////////////////////////////////////////////////
    ///////////////// DATOS DEL MENU
    ///////////////////////////////////////////////////
    const menuItems = ref([
        // { id: 1, validado: 0, texto: 'Bienvenida', path: '/welcome', icon: 'House', badge: '', badgeClass: 'bg-cyber' },
        // { id: 2, validado: 1, texto: 'Dashboard', path: '/principal', icon: 'TrendCharts', badge: '', badgeClass: 'bg-cyber' },
        // { id: 3, validado: 1, texto: 'Retención', path: '/retenciones', icon: 'Coin', badge: '', badgeClass: 'bg-holo' },
        // { id: 4, validado: 1, texto: 'Pagos', path: '/pagos', icon: 'Money', badge: '', badgeClass: 'bg-holo' },
        // { id: 5, validado: 1, texto: 'Inventario', path: '/inventario', icon: 'MessageBox', badge: '', badgeClass: 'bg-cyber' },
        // { id: 6, validado: 1, texto: 'Ventas', path: '/ventas', icon: 'Sell', badge: '', badgeClass: 'bg-cyber' },
        // { id: 7, validado: 2, texto: 'Datos', path: '/datos', icon: 'User', badge: '', badgeClass: 'bg-cyber' },
    ])
    // SVG para loading

    const emit = defineEmits(['notification', 'swal']);
    // Función emitAsync
    const emitAsync = (event: string, ...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            (emit as any)(event, ...args, (response: any, error: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            })
        })
    }

    ///////////////////////////////////////////////////
    ///////////////// METODOS
    ///////////////////////////////////////////////////
    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
        sidebarOpen.value = false
    }

    const setActiveItem = (itemId: number) => {
        activeItem.value = itemId
        closeSidebar()
    }
    
    const activarMenu = async (v_item: any, v_validar = true) => {
        // VALIDACIONES
        if (fullscreenLoading.value) return;
        if (!user.value || !user.value.id) return;
        fullscreenLoading.value = true;
        loading_msg.value = "Cargando Datos... Por favor espere";
        // VALIDAR SI VIENE DEL LOGIN
        const isLogin = window.location.pathname == "/";
        try {
            ///////////////////////////////////////////
            //  PROCESO DE CARGAR DATOS Y VALIDAR
            ///////////////////////////////////////////
            // -- usuario
            const userParams = { params: { usuario: user.value.id, _t: Date.now() } };
            const userResponse = await axios.get(`/usuario`, userParams);
            // -- validar usuario 
            if (!userResponse.data?.id) {
                await emitAsync('swal', '', 'error', 'Usuario no encontrado');
                authStore.logout();
                throw new Error('Usuario no disponible');
            }
            // -- variables del usuario
            const { actualizado, menu: menuId } = userResponse.data;
            // SI VALIDA EL MENU
            if (v_validar || !v_item || typeof v_item == 'string') {
                // -- menu
                const menuParams   = { params: { menu: menuId, _t: Date.now() } };
                const menuResponse = await axios.get(`/menu`, menuParams);
                const menu_totales = !!menuResponse.data && Array.isArray(menuResponse.data) ? menuResponse.data : [];
                // -- validar menu
                if (!menu_totales.length) {
                    await emitAsync('swal', '', 'error', 'El usuario no tiene ningun menu disponible');
                    authStore.logout();
                    throw new Error('Usuario sin menu');
                }
                // -- menu's principales
                const welcome   = menu_totales.find(e => e.path === '/welcome');
                const principal = menu_totales.find(e => e.path === '/principal');
                // -- validar menu's principales
                if (!welcome || !principal) {
                    fullscreenLoading.value = false;
                    await emitAsync('swal', '', 'error', 'El usuario no tiene los menus principales disponibles');
                    authStore.logout();
                    throw new Error('Usuario sin menus principales');
                }
                // -- add menu
                if (actualizado == 0) menuItems.value = menu_totales.filter(e => e.path == "/welcome" || e.validado == 2);
                if (actualizado == 1) menuItems.value = menu_totales.filter(e => e.path != "/welcome" || e.validado == 2);
                // VALIDAR ITEM O SI ES LOGIN
                if (!v_item || isLogin) {
                    fullscreenLoading.value = false;
                    if (actualizado == 0) activarMenu(welcome, false);
                    if (actualizado == 1) activarMenu(principal, false);
                    return;
                }
                // -- buscar el item consultado
                let item = null;
                if (typeof v_item == 'string') {
                    item = menuItems.value.find(e => e.path === v_item);
                } else {
                    item = menuItems.value.find(e => e.path === v_item.path);
                }
                // -- validar que exista el item, sino redireccionar
                if (!!item) {
                    fullscreenLoading.value = false;
                    activarMenu(item, false);
                    return;
                } else {
                    fullscreenLoading.value = false;
                    await emitAsync('swal', '', 'error', 'No tiene permisos para acceder a este módulo');
                    if (actualizado == 0) activarMenu(welcome, false);
                    if (actualizado == 1) activarMenu(principal, false);
                    return;
                }
            } 
            // -- CAMBIAR LA RUTA
            setActiveItem(v_item.id);
            await router.push(v_item.path);
            fullscreenLoading.value = false;
        } catch (error: any) {
            fullscreenLoading.value = false;
            console.error('Error en activarMenu:', error);
            if (error.response?.status === 404) {
                await emitAsync('swal', 'Usuario no encontrado', 'error', 'Error');
                authStore.logout();
            } else if (error.response?.status >= 500) {
                await emitAsync('swal', 'Error en el servidor', 'error', 'Error');
            } else {
                await emitAsync('swal', 'Error al consultar', 'error', 'Ha ocurrido un error inesperado');
            }
        }
    };

    const cerrarSesion = () => {
        if (btnCerrarSesion.value) {
            btnCerrarSesion.value.confirmLogout()
        }
    }

    // Event listeners
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && sidebarOpen.value) {
            closeSidebar()
        }
    }

    const handleResize = () => {
        if (window.innerWidth > 768) {
            closeSidebar()
        }
    }

    ///////////////////////////////////////////////////
    ///////////////// onMounted
    ///////////////////////////////////////////////////
    onMounted(() => {
        document.addEventListener('keydown', handleKeydown)
        window.addEventListener('resize', handleResize)
        activarMenu(window.location.pathname);
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown)
        window.removeEventListener('resize', handleResize)
    })

    // Expose methods if needed
    defineExpose({
        activarMenu,
        cerrarSesion,
        toggleSidebar,
        menuItems
    })
</script>
<style scoped>
    /* .app-container {
        min-height: 100vh;
        position: relative;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    } */

    /* Navbar Styles - Futurista Blanco */
    .espacio-abajito {
        margin-bottom: 20px;
        /* Crea un espacio de 20px debajo del componente */
    }

    .navbar-custom {
        background: #009985;
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        height: 70px;
        z-index: 1030;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    }

    .navbar-brand {
        font-size: 1.5rem;
        color: #1a202c !important;
        font-weight: 700;
        letter-spacing: -0.5px;
    }

    .menu-toggle {
        background: rgb(244, 239, 239);
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #4a5568;
        border-radius: 12px;
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .menu-toggle:hover {
        background: rgba(255, 244, 244, 0.618);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .user-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    /* Sidebar Styles - Futurista Blanco */
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 1040;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease-in-out;
    }

    .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: -320px;
        width: 320px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 5px 0 30px rgba(0, 0, 0, 0.15);
        z-index: 1050;
        transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    .sidebar.active {
        left: 0;
    }

    .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.8);
    }

    .sidebar-title {
        color: #1a202c;
        font-weight: 600;
        font-size: 1.3rem;
        margin: 0;
        display: flex;
        align-items: center;
    }

    .sidebar-close {
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #4a5568;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .sidebar-close:hover {
        background: rgba(0, 0, 0, 0.1);
        transform: rotate(90deg);

    }

    .sidebar-nav {
        padding: 1rem 0;
        flex: 1;
        overflow-y: auto;
    }

    .nav-item {
        margin: 0.25rem 0.75rem;
    }

    .nav-link {
        color: #4a5568;
        padding: 1rem 1.5rem;
        text-decoration: none;
        display: flex;
        align-items: center;
        border-radius: 12px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: 1px solid transparent;
    }

    .nav-link::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }

    .nav-link:hover {
        color: #1a202c;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .nav-link:hover::before {
        transform: scaleY(1);
    }

    .nav-link.active {
        color: #1a202c;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.4);
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .nav-link.active::before {
        transform: scaleY(1);
    }

    .nav-icon {
        width: 20px;
        margin-right: 15px;
        text-align: center;
        font-size: 1.1rem;
        color: #667eea;
    }

    .nav-text {
        flex: 1;
        font-weight: 500;
    }

    .badge {
        font-size: 0.7rem;
        padding: 0.35em 0.65em;
        font-weight: 600;
    }

    .bg-cyber {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    .bg-holo {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
    }

    /* Sidebar Footer */
    .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.8);
    }

    .user-info {
        display: flex;
        align-items: center;
    }

    .user-avatar-large {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        margin-right: 15px;
        color: white;
    }

    .user-details {
        color: #1a202c;
    }

    .user-name {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 0.2rem;
    }

    .user-role {
        font-size: 0.85rem;
        color: #718096;
    }

    /* Main Content */
    .main-content {
        margin-top: 70px;
        padding: 2rem;
        transition: all 0.3s ease;
        min-height: calc(100vh - 70px);
    }

    .content-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        padding: 2.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        transition: all 0.3s ease;
        overflow: hidden;
        backdrop-filter: blur(10px);
    }

    .stat-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.95);
    }

    .stat-card .card-body {
        padding: 2rem 1rem;
    }

    .gradient-icon-1 {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        /* -webkit-background-clip: text; */
        -webkit-text-fill-color: transparent;
    }

    .gradient-icon-2 {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        /* -webkit-background-clip: text; */
        -webkit-text-fill-color: transparent;
    }

    .gradient-icon-3 {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        /* -webkit-background-clip: text; */
        -webkit-text-fill-color: transparent;
    }

    .gradient-icon-4 {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        /* -webkit-background-clip: text; */
        -webkit-text-fill-color: transparent;
    }

    .futuristic-card {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        backdrop-filter: blur(10px);
    }

    .futuristic-card .card-header {
        background: rgba(255, 255, 255, 0.6);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
    }

    .activity-wave {
        height: 100px;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
        border-radius: 8px;
        animation: wave 2s infinite;
    }

    .performance-bar {
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 4px;
        animation: fill 2s ease-in-out;
    }

    @keyframes wave {
        0% {
            background-position: -200px 0;
        }

        100% {
            background-position: calc(200px + 100%) 0;
        }
    }
    @keyframes fill {
        from {
            width: 0%;
        }
        to {
            width: 85%;
        }
    }
    /* Responsive */
    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            left: -100%;
        }

        .main-content {
            padding: 1rem;
        }

        .content-card {
            padding: 1.5rem;
        }
    }
    @media (max-width: 576px) {
        .navbar-brand {
            font-size: 1.2rem;
        }

        .menu-toggle {
            width: 40px;
            height: 40px;
        }
    }
</style>