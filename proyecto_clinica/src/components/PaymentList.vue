<template>
  <div>
    <div class="page-header mb-3 d-flex align-items-center">
      <div>
        <h4 class="page-title">Pagos y Honorarios</h4>
        <div class="breadcrumbs d-flex align-items-center">
          <i class="fas fa-home mr-2" style="font-size:17px;color:#b0b7c3"></i>
          <span class="mx-2" style="color:#d1d5db;font-size:18px;">/</span>
          <span style="color:#7b8794;font-size:16px;">Mostrar</span>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            ¿Está seguro de eliminar este pago? Esta acción no se puede deshacer.
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar pago -->
    <AddPaymentModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
      @save="addPayment"
    />
    
    <EditPaymentModal 
      v-if="showEditModal" 
      :payment="editingPayment"
      @close="showEditModal = false" 
      @save="updatePayment"
    />

    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between flex-wrap">
        <div class="d-flex align-items-center gap-2">
          <h4 class="card-title mb-0">Mostrar</h4>
          <button class="btn btn-outline-info btn-round btn-sm ms-2" @click="printPayments">Imprimir</button>
        </div>
        <button class="btn btn-dark btn-round btn-new" @click="newPayment">Nuevo Pago</button>
      </div>
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <label class="me-2 mb-0" for="perPage">Mostrar</label>
            <select id="perPage" v-model="perPage" class="form-select form-select-sm" style="width:80px">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="ms-2">registros por página</span>
          </div>
          <div class="d-flex align-items-center">
            <label class="me-2 mb-0" for="search">Buscar:</label>
            <input id="search" v-model="search" class="form-control form-control-sm" style="width:180px" placeholder="Buscar..." />
          </div>
        </div>
        <div class="table-responsive">
          <table id="payments-table" class="display table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payment, index) in filteredPayments" :key="index">
                <td class="cell-block">{{ index + 1 }}</td>
                <td class="cell-block">{{ formatDate(payment.fecha) }}</td>
                <td class="cell-block">{{ payment.paciente }}</td>
                <td class="cell-block">{{ payment.medico }}</td>
                <td class="cell-block">{{ payment.concepto }}</td>
                <td class="cell-block">${{ payment.monto.toFixed(2) }}</td>
                <td>
                  <span :class="getStatusBadge(payment.estado)">
                    {{ getStatusText(payment.estado) }}
                  </span>
                </td>
                <td class="cell-block">
                  <div class="form-button-action">
                    <button v-if="payment.estado === 'pendiente'" class="btn btn-success btn-sm" @click="markAsPaid(payment.id)" title="Marcar como Pagado">
                      <i class="fa fa-check"></i> Pagar
                    </button>
                    <button class="btn btn-link btn-primary btn-lg" @click="editPayment(payment)" title="Editar">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-link btn-danger btn-lg" @click="confirmDeleteDialog(payment.id)" title="Eliminar">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPayments.length === 0">
                <td colspan="8" class="text-center">No hay pagos registrados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumen de Pagos -->
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="card bg-primary">
              <div class="card-body p-3 text-white">
                <h5 class="card-title mb-1 text-white">Total Recaudado</h5>
                <h3 class="mb-0">${{ totalRecaudado.toFixed(2) }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-success text-white">
              <div class="card-body p-3">
                <h5 class="card-title mb-1">Pagados</h5>
                <h3 class="mb-0">${{ totalPagados.toFixed(2) }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card" style="background-color: #ff9800;">
              <div class="card-body p-3">
                <h5 class="card-title mb-1 text-dark">Pendientes</h5>
                <h3 class="mb-0 text-dark">${{ totalPendientes.toFixed(2) }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddPaymentModal from './AddPaymentModal.vue';
import EditPaymentModal from './EditPaymentModal.vue';

export default {
  name: 'PaymentList',
  components: {
    AddPaymentModal,
    EditPaymentModal
  },
  data() {
    return {
      payments: [],
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      paymentToDelete: null,
      editingPayment: null,
      search: '',
      perPage: 10,
      currentPage: 1
    };
  },
  computed: {
    filteredPayments() {
      const searchTerm = this.search.toLowerCase();
      return this.payments.filter(payment => {
        return (
          payment.paciente.toLowerCase().includes(searchTerm) ||
          payment.medico.toLowerCase().includes(searchTerm) ||
          payment.concepto.toLowerCase().includes(searchTerm) ||
          payment.monto.toString().includes(searchTerm)
        );
      });
    },
    totalRecaudado() {
      return this.payments.reduce((sum, payment) => sum + payment.monto, 0);
    },
    totalPagados() {
      return this.payments
        .filter(p => p.estado === 'pagado')
        .reduce((sum, payment) => sum + payment.monto, 0);
    },
    totalPendientes() {
      return this.payments
        .filter(p => p.estado === 'pendiente')
        .reduce((sum, payment) => sum + payment.monto, 0);
    }
  },
  created() {
    this.loadPayments();
  },
  methods: {
    getEmptyPayment() {
      return {
        id: Date.now(),
        paciente: '',
        medico: '',
        concepto: '',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        notas: ''
      };
    },
    loadPayments() {
      const savedPayments = localStorage.getItem('payments');
      if (savedPayments) {
        this.payments = JSON.parse(savedPayments);
      } else {
        // Datos de ejemplo
        this.payments = [
          {
            id: 1,
            paciente: 'Juan Pérez',
            medico: 'Dra. María López',
            concepto: 'Consulta General',
            monto: 150.00,
            fecha: '2023-10-15',
            estado: 'pagado',
            notas: 'Pago realizado con tarjeta'
          },
          {
            id: 2,
            paciente: 'Ana García',
            medico: 'Dr. Carlos Ruiz',
            concepto: 'Control',
            monto: 200.00,
            fecha: '2023-10-16',
            estado: 'pendiente',
            notas: 'Pendiente de pago en efectivo'
          }
        ];
        this.savePayments();
      }
    },
    savePayments() {
      localStorage.setItem('payments', JSON.stringify(this.payments));
    },
    newPayment() {
      this.showAddModal = true;
    },
    
    editPayment(payment) {
      this.editingPayment = { ...payment };
      this.showEditModal = true;
    },
    
    addPayment(payment) {
      payment.id = Date.now();
      this.payments.unshift(payment);
      this.savePayments();
      this.showAddModal = false;
    },
    
    updatePayment(updatedPayment) {
      const index = this.payments.findIndex(p => p.id === updatedPayment.id);
      if (index !== -1) {
        this.payments.splice(index, 1, updatedPayment);
        this.savePayments();
      }
      this.showEditModal = false;
    },
    
    markAsPaid(id) {
      const payment = this.payments.find(p => p.id === id);
      if (payment) {
        payment.estado = 'pagado';
        this.savePayments();
      }
    },
    
    confirmDeleteDialog(id) {
      this.paymentToDelete = id;
      this.showDeleteModal = true;
    },
    
    confirmDelete() {
      if (this.paymentToDelete) {
        this.payments = this.payments.filter(payment => payment.id !== this.paymentToDelete);
        this.savePayments();
        this.showDeleteModal = false;
        this.paymentToDelete = null;
      }
    },
    
    confirmDeleteDialog(id) {
      this.paymentToDelete = id;
      this.showDeleteModal = true;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    getStatusBadge(status) {
      return {
        'badge': true,
        'badge-success': status === 'pagado',
        'badge-warning': status === 'pendiente',
        'badge-danger': status === 'cancelado'
      };
    },
    getStatusText(status) {
      const statusMap = {
        'pagado': 'Pagado',
        'pendiente': 'Pendiente',
        'cancelado': 'Cancelado'
      };
      return statusMap[status] || status;
    },
    printPayments() {
      window.print();
    }
  }
};
</script>

<style scoped>
.badge-pending {
  background-color: #ffc107;
  color: #212529;
}

.card {
  margin-bottom: 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
}

.card-title {
  margin-bottom: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-round {
  border-radius: 50px;
  padding: 8px 20px;
  font-weight: 500;
}

.btn-new {
  background-color: #1e3a8a;
  color: white;
}

.btn-new:hover {
  background-color: #1e40af;
  color: white;
}

.table th {
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.cell-block {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.form-button-action {
  white-space: nowrap;
}

.modal-content {
  border: none;
  border-radius: 10px;
}

.modal-header {
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
}

.modal-footer {
  border-top: 1px solid #eee;
  padding: 15px 20px;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .card, .card-body {
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    border: 1px solid #dee2e6;
    padding: 8px;
  }
}
</style>
