<template>
  <div style="margin-top: 25%;">
    <div class="controls">
      <button @click="generatePDF" class="btn-generate">Generar PDF</button>
      <button @click="addMoreItems" class="btn-add">Agregar más items</button>
    </div>

    <!-- Vista previa del contenido -->
    <div class="preview">
      <h3>Vista previa del contenido:</h3>
      <div class="preview-content">
        <div v-for="(section, sectionIndex) in paginatedContent" :key="sectionIndex" class="preview-page">
          <div class="page-header">Página {{ sectionIndex + 1 }}</div>
          <div v-for="item in section" :key="item.id" class="preview-item">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido oculto para PDF -->
    <div id="pdf-content" class="pdf-content">
      <div v-for="(section, sectionIndex) in paginatedContent" :key="sectionIndex" class="pdf-section">
        <div class="pdf-header">
          <h1>Reporte de Productos</h1>
          <p>Página {{ sectionIndex + 1 }} de {{ paginatedContent.length }}</p>
        </div>
        
        <div class="items-container">
          <div v-for="item in section" :key="item.id" class="pdf-item">
            <div class="item-header">
              <span class="item-id">#{{ item.id }}</span>
              <span class="item-category">{{ item.category }}</span>
            </div>
            <div class="item-content">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <div class="item-details">
                <span class="price">Precio: ${{ item.price }}</span>
                <span class="stock">Stock: {{ item.stock }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Page break después de cada sección excepto la última -->
        <div v-if="sectionIndex < paginatedContent.length - 1" class="page-break"></div>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'

export default {
  name: 'PDFGenerator',
  data() {
    return {
      // Datos de ejemplo
      items: [
        { id: 1, name: 'Laptop Gaming', description: 'Laptop para gaming de alta gama con RTX 4080', category: 'Tecnología', price: 2500, stock: 15 },
        { id: 2, name: 'Smartphone Pro', description: 'Teléfono inteligente con cámara de 108MP', category: 'Tecnología', price: 1200, stock: 30 },
        { id: 3, name: 'Tablet Digital', description: 'Tablet para diseño y trabajo creativo', category: 'Tecnología', price: 800, stock: 25 },
        { id: 4, name: 'Auriculares BT', description: 'Auriculares inalámbricos con cancelación de ruido', category: 'Audio', price: 300, stock: 50 },
        { id: 5, name: 'Monitor 4K', description: 'Monitor ultra HD de 32 pulgadas', category: 'Tecnología', price: 600, stock: 20 },
        { id: 6, name: 'Teclado Mecánico', description: 'Teclado mecánico RGB switches azules', category: 'Periféricos', price: 150, stock: 40 },
        { id: 7, name: 'Ratón Gaming', description: 'Ratón para gaming con 16000 DPI', category: 'Periféricos', price: 80, stock: 60 },
        { id: 8, name: 'Silla Ergonómica', description: 'Silla de oficina ergonómica ajustable', category: 'Muebles', price: 450, stock: 10 },
        { id: 9, name: 'Escritorio Moderno', description: 'Escritorio de madera con diseño moderno', category: 'Muebles', price: 350, stock: 8 },
        { id: 10, name: 'Impresora Laser', description: 'Impresora láser multifunción', category: 'Oficina', price: 280, stock: 12 },
        { id: 11, name: 'Router WiFi 6', description: 'Router de última generación WiFi 6', category: 'Redes', price: 200, stock: 25 },
        { id: 12, name: 'Disco SSD 1TB', description: 'Disco sólido de alta velocidad', category: 'Almacenamiento', price: 120, stock: 35 },
        { id: 13, name: 'Memoria RAM 32GB', description: 'Kit de memoria RAM DDR5', category: 'Componentes', price: 180, stock: 28 },
        { id: 14, name: 'Webcam 4K', description: 'Cámara web para streaming y videollamadas', category: 'Video', price: 160, stock: 22 },
        { id: 15, name: 'Micrófono Studio', description: 'Micrófono de estudio USB-C', category: 'Audio', price: 220, stock: 18 }
      ],
      itemsPerPage: 4, // Ajusta este valor según la altura de tus items
      maxHeightPerPage: 700 // Altura máxima aproximada en píxeles por página
    }
  },
  computed: {
    // Divide el contenido en páginas basado en items por página
    paginatedContent() {
      const pages = []
      for (let i = 0; i < this.items.length; i += this.itemsPerPage) {
        pages.push(this.items.slice(i, i + this.itemsPerPage))
      }
      return pages
    }
  },
  methods: {
    generatePDF() {
      const element = document.getElementById('pdf-content')
      
      const options = {
        margin: [15, 15, 20, 15], // [top, right, bottom, left]
        filename: `reporte-productos-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'] 
        }
      }

      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages()
          
          // Agregar números de página en el footer
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(10)
            pdf.setTextColor(100, 100, 100)
            pdf.text(
              `Página ${i} de ${totalPages}`,
              pdf.internal.pageSize.getWidth() / 2,
              pdf.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            )
          }
        })
        .save()
    },

    addMoreItems() {
      const newId = this.items.length + 1
      const categories = ['Tecnología', 'Audio', 'Periféricos', 'Muebles', 'Oficina']
      const newItem = {
        id: newId,
        name: `Producto Nuevo ${newId}`,
        description: `Descripción del nuevo producto ${newId} agregado dinámicamente`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 1000) + 50,
        stock: Math.floor(Math.random() * 50) + 5
      }
      this.items.push(newItem)
    },

    // Método alternativo para calcular páginas basado en altura estimada
    calculateItemsPerPage() {
      // Puedes ajustar esta lógica según la altura real de tus elementos
      const estimatedItemHeight = 120 // Altura estimada en píxeles por item
      const availableHeight = this.maxHeightPerPage
      this.itemsPerPage = Math.floor(availableHeight / estimatedItemHeight)
    }
  },
  mounted() {
    this.calculateItemsPerPage()
  }
}
</script>

<style scoped>
.controls {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.btn-generate, .btn-add {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-generate {
  background: #4CAF50;
  color: white;
}

.btn-add {
  background: #2196F3;
  color: white;
}

.preview {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.preview-content {
  display: flex;
  gap: 20px;
  overflow-x: auto;
}

.preview-page {
  min-width: 200px;
  padding: 15px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  background: #f9f9f9;
}

.page-header {
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

.preview-item {
  padding: 5px;
  margin: 5px 0;
  background: white;
  border-radius: 3px;
  font-size: 12px;
}

/* Estilos para el contenido del PDF */

.pdf-section {
  font-family: 'Arial', sans-serif;
  page-break-inside: avoid;
}

.pdf-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #333;
}

.pdf-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.pdf-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.items-container {
  margin: 20px 0;
}

.pdf-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fafafa;
  page-break-inside: avoid;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
}

.item-id {
  background: #333;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
}

.item-category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 10px;
}

.item-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.item-content p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.item-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
}

.price {
  color: #4CAF50;
}

.stock {
  color: #2196F3;
}

/* Page break CSS */
.page-break {
  page-break-after: always;
  break-after: page;
  height: 0;
  margin: 0;
  padding: 0;
}

/* Estilos para impresión/PDF */
@media print {
  .page-break {
    page-break-after: always;
  }
  
  .pdf-section {
    page-break-inside: avoid;
  }
  
  .pdf-item {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>