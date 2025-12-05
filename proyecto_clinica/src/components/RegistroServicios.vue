<script setup>
import { ref, computed } from 'vue';


// 1. ESTADO REACTIVO (DATA)
// Las variables 'ref' son las que, al cambiar su valor, actualizan el HTML.

const areasMedicas = ref([
    { id: 1, servicio: "Consulta General", precio: 45.00, medico: "Dr. Juan Pérez" },
    { id: 2, servicio: "Cardiología", precio: 120.00, medico: "Dra. Ana López" }
]);

const nextId = ref(areasMedicas.value.length > 0 ? Math.max(...areasMedicas.value.map(a => a.id)) + 1 : 1);
const isModifying = ref(false); // Bandera para saber si estamos en modo edición
const modifyId = ref(null);    // ID del registro que se está editando

// Objeto que enlaza los campos del formulario con v-model
const form = ref({
    servicio: '',
    precio: 0.00,
    medico: ''
});


// 2. PROPIEDADES COMPUTADAS (LECTURA DINÁMICA)
// Valores que dependen de otra data reactiva. Se actualizan solas.

const formTitle = computed(() => isModifying.value
    ? `Modificar Servicio ID: ${modifyId.value}`
    : 'Registrar Nuevo Servicio');

const submitButtonText = computed(() => isModifying.value
    ? 'Guardar Cambios'
    : 'Registrar Servicio');


// 3. FUNCIONES (MÉTODOS)

// Limpia el formulario y desactiva el modo modificación
function resetForm() {
    form.value = { servicio: '', precio: 0.00, medico: '' };
    isModifying.value = false;
    modifyId.value = null;
    form.value.precio = 0.00; // Asegura que el precio sea numérico para el input
}

// Lógica de CREAR (C) / MODIFICAR (U)
function handleSubmit() {
    if (!form.value.servicio || form.value.precio <= 0 || !form.value.medico) {
        alert("Por favor, rellena todos los campos correctamente.");
        return;
    }

    const nuevoPrecio = parseFloat(form.value.precio).toFixed(2);

    if (isModifying.value) {
        // --- Lógica de MODIFICAR (UPDATE) ---
        const index = areasMedicas.value.findIndex(area => area.id === modifyId.value);
        if (index !== -1) {
            areasMedicas.value[index].servicio = form.value.servicio;
            areasMedicas.value[index].precio = nuevoPrecio;
            areasMedicas.value[index].medico = form.value.medico;
            alert("Servicio modificado con éxito.");
        }
    } else {
        // --- Lógica de CREAR (CREATE) ---
        const nuevoRegistro = {
            id: nextId.value++,
            servicio: form.value.servicio,
            precio: nuevoPrecio,
            medico: form.value.medico
        };
        areasMedicas.value.push(nuevoRegistro);
        alert("Servicio registrado con éxito.");
    }

    resetForm();
}

// Lógica para cargar los datos en el formulario (Modificar - Parte 1)
function cargarParaModificar(id) {
    const area = areasMedicas.value.find(area => area.id === id);
    if (area) {
        form.value.servicio = area.servicio;
        form.value.precio = parseFloat(area.precio);
        form.value.medico = area.medico;

        isModifying.value = true;
        modifyId.value = id;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Lógica de ELIMINAR (DELETE)
function eliminarRegistro(id) {
    if (confirm(`¿Estás seguro de que quieres eliminar el servicio con ID ${id}?`)) {
        // Reemplaza el arreglo con uno nuevo que no incluye el ID
        areasMedicas.value = areasMedicas.value.filter(area => area.id !== id);
        alert("Servicio eliminado con éxito.");

        if (modifyId.value === id) {
            resetForm(); // Limpia si borras el registro que se estaba editando
        }
    }
}
</script>

<template>
    <div class="container">
        <h1 class="text-center mb-4 text-primary">Registro de Servicios Médicos</h1>

        <div class="card shadow mb-4">
            <div class="card-header bg-primary text-white">
                <h5 v-text="formTitle"></h5>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleSubmit">

                    <div class="mb-3">
                        <label for="servicio" class="form-label">Nombre del Servicio:</label>
                        <input type="text" class="form-control" id="servicio" required v-model="form.servicio">
                    </div>

                    <div class="mb-3">
                        <label for="precio" class="form-label">Precio ($):</label>
                        <input type="number" step="0.01" class="form-control" id="precio" required min="0.01" v-model="form.precio">
                    </div>

                    <div class="mb-3">
                        <label for="medico" class="form-label">Médico Responsable:</label>
                        <input type="text" class="form-control" id="medico" required v-model="form.medico">
                    </div>

                    <button type="submit" class="btn" :class="isModifying ? 'btn-warning' : 'btn-success'">
                        {{ submitButtonText }}
                    </button>
                    <button type="button" class="btn btn-secondary" v-if="isModifying" @click="resetForm">
                        Cancelar Modificación
                    </button>
                </form>
            </div>
        </div>

        <h2 class="mt-5 mb-3">Servicios Registrados</h2>
        <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Médico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="area in areasMedicas" :key="area.id">
                        <td>{{ area.id }}</td>
                        <td>{{ area.servicio }}</td>
                        <td>${{ parseFloat(area.precio).toFixed(2) }}</td>
                        <td>{{ area.medico }}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-2" @click="cargarParaModificar(area.id)">Modificar</button>
                            <button class="btn btn-sm btn-danger" @click="eliminarRegistro(area.id)">Eliminar</button>
                        </td>
                    </tr>
                    <tr v-if="areasMedicas.length === 0">
                        <td colspan="5" class="text-center">No hay servicios médicos registrados.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
/* Estilos opcionales */
.container {
    padding-bottom: 50px;
}
</style>
