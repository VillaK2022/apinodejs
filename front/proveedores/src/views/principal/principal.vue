<template>
    <div id="contenedor">
        <div v-loading.fullscreen.lock="fullscreenLoading"
            :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
            element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body">
            <div >
                <h1>hola es el dashboard</h1>
            </div>
        </div>
    </div>
</template>
<script setup>
///////////////////////////////////////////////////
    ///////////////// IMPORT
///////////////////////////////////////////////////

///////////////////////////////////////////////////
    ///////////////// VARIABLES
///////////////////////////////////////////////////
    const fullscreenLoading = false
    const loading_msg = null
</script>
<style scoped>
/* Header personalizado */
.welcome-header {
    background: #009985;
    color: white;
    padding: 30px 20px;
    margin: -20px -20px 0 -20px;
    border-radius: 8px 8px 0 0;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.avatar {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-text h3 {
    margin: 0 0 5px 0;
    font-size: 2rem;
    font-weight: 700;
}

.header-text p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
}

/* Contenido principal */
.welcome-content {
    padding: 20px 0;
}

.welcome-message {
    text-align: center;
    margin-bottom: 25px;
}

.welcome-message p {
    margin: 5px 0;
    color: #666;
    line-height: 1.5;
}

.welcome-message strong {
    color: #667eea;
}

/* Grid de características */
.features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: #f8f9ff;
    border-radius: 12px;
    border-left: 4px solid #667eea;
    transition: all 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.feature-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    flex-shrink: 0;
}

.feature-text h4 {
    margin: 0 0 4px 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
}

.feature-text p {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
}

/* Sección de progreso */
.progress-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: #666;
}

/* Footer personalizado */
.welcome-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 10px 0 0 0;
}

.later-btn {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    color: #6c757d;
    font-weight: 500;
}

.later-btn:hover {
    background-color: #e9ecef;
    border-color: #dee2e6;
    color: #495057;
}

.later-btn i {
    margin-right: 6px;
}

.start-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-weight: 500;
}

.start-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.start-btn i {
    margin-right: 6px;
}

/* Animaciones */
:deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    animation: modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Responsive */
@media (max-width: 600px) {
    :deep(.el-dialog) {
        width: 90% !important;
        margin: 20px auto;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .header-content {
        flex-direction: column;
        text-align: center;
    }

    .welcome-footer {
        flex-direction: column;
    }

    .later-btn,
    .start-btn {
        width: 100%;
    }
}
</style>
