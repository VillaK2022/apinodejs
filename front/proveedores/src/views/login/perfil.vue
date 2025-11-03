<template>
    <div style="margin-top: 7% !important;" class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <!-- Sidebar de perfil -->
          <div class="card">
            <div class="card-body text-center">
              <div class="user-avatar-large mb-3">
                <div class="avatar-placeholder-large">
                  {{  }}
                </div>
              </div>
              <h4>{{ user.name }}</h4>
              <p class="text-muted">{{ user.email }}</p>
              <div class="badge bg-aqua">{{ user.role }}</div>
            </div>
          </div>
        </div>
        
        <div class="col-md-8">
          <!-- Información detallada del usuario -->
          <div class="card">
            <div class="card-header">
              <h5>Información del Perfil</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <strong>documento de usuario:</strong>
                </div>
                <div class="col-6">
                  {{ user.documento }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-6">
                  <strong>Nombre:</strong>
                </div>
                <div class="col-6">
                  {{ user.name }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-6">
                  <strong>Email:</strong>
                </div>
                <div class="col-6">
                  {{ user.email }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-6">
                  <strong>Rol:</strong>
                </div>
                <div class="col-6">
                  {{ user.role }}
                </div>
              </div>
              
              <!-- Mostrar campos adicionales si existen -->
              <template v-if="user.phone">
                <div class="row mt-2">
                  <div class="col-6">
                    <strong>Teléfono:</strong>
                  </div>
                  <div class="col-6">
                    {{ user.phone }}
                  </div>
                </div>
              </template>
              
              <div class="mt-4">
                <h6>Datos técnicos:</h6>
                <pre class="bg-light p-3 rounded">{{ JSON.stringify(user, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'


export default {
  name: 'Perfil',

  setup() {
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    console.log('usuario', user);
    
    // const userInitials = computed(() => {
    //   if (!authStore.user?.name) return 'U'
    //   return authStore.user.name
    //     .split(' ')
    //     .map(word => word[0])
    //     .join('')
    //     .toUpperCase()
    //     .substring(0, 2)
    // })

    return {
      user
    }
  }
}
</script>