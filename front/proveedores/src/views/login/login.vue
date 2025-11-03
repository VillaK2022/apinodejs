<template>
	<div class="container-fluid vh-100 d-flex align-items-center justify-content-center login-container">
		<div class="card shadow-lg" style="width: 100%; max-width: 400px;">
			<div class="card-body p-5">
				<!-- Logo o título -->
				<div class="text-center mb-4">
					<h2 class="fw-bold text-aqua">Iniciar Sesión</h2>
					<p class="text-muted">Garzón Proveedores</p>
				</div>
				<!-- Formulario de login -->
				<form @submit.prevent="login">
					<!-- Campo documento -->
					<div class="mb-3">
						<label for="documento" class="form-label"><span>Documento&nbsp;</span>
							<el-tooltip placement="top" :enterable="false" :show-after="300">
								<template #content>El documento no debe llevar - <br />Ejemplo 31133156-4 debe ser
									(311311564)</template>
								<el-icon color="#2a9d8f">
									<QuestionFilled />
								</el-icon>
							</el-tooltip>
						</label>

						<input v-model="form.documento" type="text" pattern="[0-9]*" class="form-control" id="documento"
							placeholder="Documento" required :class="{ 'is-invalid': errors.documento }">
						<div v-if="errors.documento" class="invalid-feedback">
							{{ errors.documento }}
						</div>
					</div>
					<!-- Campo Contraseña -->
					<div class="mb-3">
						<label for="password" class="form-label">Contraseña</label>
						<input v-model="form.password" type="password" class="form-control" id="password"
							placeholder="Tu contraseña" required :class="{ 'is-invalid': errors.password }">
						<div v-if="errors.password" class="invalid-feedback">
							{{ errors.password }}
						</div>
					</div>
					<!-- Botón de login -->
					<button type="submit" class="btn btn-aqua w-100 py-2 fw-semibold" :disabled="loading">
						<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
						{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
					</button>
					<!-- Mensaje de error general -->
					<div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="alert">
						{{ errorMessage }}
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, inject } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth' // ✅ IMPORTAR AUTH STORE
import { useRouter } from 'vue-router' // ✅ IMPORTAR ROUTER
export default {
	props: ['base_url'],
	name: 'login',
	setup() {
		const baseUrl = inject('baseUrl');

		const form = reactive({
			documento: '',
			password: '',
			remember: false,
			documentos: '',
			id: ''
		})

		const errors = reactive({
			documento: '',
			password: ''
		})
		const loading = ref(false)
		const errorMessage = ref('')

		// ✅ INICIALIZAR STORE Y ROUTER
		const authStore = useAuthStore()
		const router = useRouter()

		// ✅ MOVER validarformulario DENTRO del setup
		const validarformulario = () => {
			let isValid = true

			// Resetear errores
			errors.documento = ''
			errors.password = ''
			errorMessage.value = ''

			if (!form.documento) {
				errors.documento = 'El documento es requerido'
				isValid = false
			}


			// Validar contraseña
			if (!form.password) {
				errors.password = 'La contraseña es requerida'
				isValid = false
			} else if (form.password.length < 6) {
				errors.password = 'La contraseña debe tener al menos 6 caracteres'
				isValid = false
			}

			return isValid
		}
		// ✅ MOVER login DENTRO del setup
		const cambiar = async (actualizado) => {	
			console.log(actualizado);
			window.location.reload();
			return;
			if (actualizado == 1){
				console.log(actualizado == 1);
				router.push('/principal')
				window.location.reload();
			}else{
				console.log(actualizado == 0);
				router.push('/welcome')
				window.location.reload();
			}
		}
		const login = async () => {
			if (!validarformulario()) return

			loading.value = true
			errorMessage.value = ''
			try {						
				const response = await axios.post(`/login`, {
					documento: form.documento,
					password: form.password
				})

				// DEBUG: Ver respuesta del servidor
				// console.log('🔍 Respuesta del servidor:', response.data)

				// Verificar que la respuesta tenga los datos esperados
				if (response.data) {
					// console.log(response.data);

					// Buscar token en diferentes propiedades posibles
					const token = response.data.token || response.data.access_token

					// Buscar datos de usuario en diferentes propiedades posibles
					const userData = response.data.user || response.data.usuario || {
						id: 								response.data.id,
						documento: 							form.documento,
						username: 							response.data.username,
						codigo: 							response.data.codigo,
						email: 								response.data.email,
						direccion: 							response.data.direccion,
						telefono: 							response.data.telefono,
						telefonomovil: 						response.data.telefonomovil,
						razon_social: 						response.data.razon_social,
						actualizado: 						response.data.actualizado,
						id_mproveedor: 						response.data.id_mproveedor,
						menu:                               response.data.menu
					}
					// console.log('nameee', response.data.razon_social)

					// ✅ USAR AUTH STORE CORRECTAMENTE
					authStore.setAuth(token, userData)
					// ALERTA
					await Swal.fire({
						title: '¡Login exitoso!',
						text: `Bienvenido ${response.data.razon_social}`,
						icon: 'success',
						confirmButtonText: 'OK',
						background: '#ffffff',
						color: '#2a9d8f',
					});
					// CAMBIAR A LA PAGINA Welcome
					cambiar(response.data.actualizado);
				} else {
					throw new Error('Respuesta del servidor vacía')
				}
			} catch (error) {
				console.error('Error en login:', error)

				// Mostrar error más específico
				if (error.response) {
					// El servidor respondió con un código de error
					console.log('Status:', error.response.status)
					console.log('Data:', error.response.data)

					if (error.response.status === 401) {
						errorMessage.value = 'Credenciales incorrectas'
						Swal.fire({
							title: 'Error de autenticación',
							text: 'El documento o contraseña son incorrectos',
							icon: 'error',
							confirmButtonText: 'OK'
						})
					} else if (error.response.status === 500) {
						errorMessage.value = 'Error del servidor'
						Swal.fire({
							title: 'Error del servidor',
							text: 'Intenta nuevamente en unos minutos',
							icon: 'error',
							confirmButtonText: 'OK'
						})
					} else {
						errorMessage.value = error.response.data?.message || 'Error en la comunicación'
						Swal.fire({
							title: 'Error',
							text: error.response.data?.message || 'Error en la comunicación con el servidor',
							icon: 'error',
							confirmButtonText: 'OK'
						})
					}
				} else if (error.request) {
					// La request fue hecha pero no hubo respuesta
					errorMessage.value = 'No se pudo conectar con el servidor'
					Swal.fire({
						title: 'Error de conexión',
						text: 'Verifica tu conexión a internet',
						icon: 'error',
						confirmButtonText: 'OK'
					})
				} else {
					// Otro tipo de error
					errorMessage.value = error.message
					Swal.fire({
						title: 'Error',
						text: error.message,
						icon: 'error',
						confirmButtonText: 'OK'
					})
				}
			} finally {
				loading.value = false
			}
		}

		// ✅ RETORNAR TODO lo que se usa en el template
		return {
			form,
			errors,
			loading,
			errorMessage,
			login,
			validarformulario // ✅ Ahora está disponible en el template
		}
	}
	// ✅ ELIMINAR la sección "methods" ya que todo está en setup
}
</script>

<style scoped>
.login-container {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	min-height: 100vh;
}

.card {
	border: none;
	border-radius: 15px;
	background: #ffffff;
}

.btn-aqua {
	background: linear-gradient(45deg, #2a9d8f, #57cc99);
	border: none;
	border-radius: 8px;
	color: white;
}

.btn-aqua:hover {
	background: linear-gradient(45deg, #21867a, #44b884);
	transform: translateY(-1px);
	transition: all 0.3s ease;
	color: white;
}

.btn-aqua:disabled {
	background: linear-gradient(45deg, #8ecae6, #90e0ef);
	transform: none;
}

.form-control:focus {
	border-color: #2a9d8f;
	box-shadow: 0 0 0 0.2rem rgba(42, 157, 143, 0.25);
}

.text-aqua {
	color: #2a9d8f !important;
}

a.text-aqua:hover {
	color: #21867a !important;
}

.alert-danger {
	background-color: #f8d7da;
	border-color: #f5c6cb;
	color: #721c24;
}

.invalid-feedback {
	color: #dc3545;
}

.form-check-input:checked {
	background-color: #2a9d8f;
	border-color: #2a9d8f;
}

.form-check-input:focus {
	border-color: #2a9d8f;
	box-shadow: 0 0 0 0.2rem rgba(42, 157, 143, 0.25);
}

/* Estilos para los placeholders */
::placeholder {
	color: #6c757d !important;
	opacity: 0.7;
}

/* Efectos suaves */
.card {
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 25px rgba(42, 157, 143, 0.15) !important;
}
</style>