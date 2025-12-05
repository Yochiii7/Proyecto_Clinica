<template>
  <div>
    <div class="page-header mb-3 d-flex align-items-center">
      <div>
        <h4 class="page-title">Pagos y Honorarios</h4>
        <div class="breadcrumbs d-flex align-items-center">
          <i class="fas fa-home mr-2" style="font-size:17px;color:#b0b7c3"></i>
          <span class="mx-2" style="color:#d1d5db;font-size:18px;">/</span>
          <span style="color:#7b8794;font-size:16px;">Pagos</span>
        </div>
      </div>
    </div>

    <payment-list />
  </div>
</template>

<script>
import PaymentList from '../components/PaymentList.vue';

export default {
  name: 'PaymentsView',
  components: {
    PaymentList
  }
};
</script>

<style scoped>
/* Estilos mínimos de la vista; el componente maneja su propio estilo */
</style>
