<template>
  <div class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Nuevo Pago</h5>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <label>Paciente</label>
            <input type="text" v-model="form.paciente" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Médico</label>
            <input type="text" v-model="form.medico" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Concepto</label>
            <input type="text" v-model="form.concepto" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Monto</label>
            <input type="number" step="0.01" min="0" v-model.number="form.monto" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Fecha</label>
            <input type="date" v-model="form.fecha" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Estado</label>
            <select v-model="form.estado" class="form-control" required>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="mb-2">
            <label>Notas</label>
            <textarea v-model="form.notas" class="form-control"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="save">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPaymentModal',
  data() {
    return {
      form: {
        paciente: '',
        medico: '',
        concepto: '',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        notas: ''
      }
    };
  },
  methods: {
    save() {
      if (!this.form.paciente || !this.form.medico || !this.form.concepto || this.form.monto <= 0) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }
      this.$emit('save', { ...this.form });
      this.resetForm();
    },
    resetForm() {
      this.form = {
        paciente: '',
        medico: '',
        concepto: '',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        notas: ''
      };
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.btn-close {
  padding: 0.5rem 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
  background-color: transparent;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  cursor: pointer;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
}

.btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-primary {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
  margin-left: 0.5rem;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

label {
  display: inline-block;
  margin-bottom: 0.5rem;
}

textarea.form-control {
  min-height: 100px;
}
</style>
