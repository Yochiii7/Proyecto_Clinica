<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <header class="d-flex align-items-center mb-3">
    <h2 class="mb-0">Doctores</h2>
    <button @click="router.push('/')" type="button" class="btn btn-primary ms-4">Ir a Agenda</button>
    <button @click="router.push('/Calendario')" type="button" class="btn btn-primary ms-4" style="background-color: #5884c7;">Calendario</button>
</header>

<div class="container">
               
        <div class="row g-4">
            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Maria Lopez</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Neurología </h6>
                        <p class="card-text">Se dedica al estudio, diagnóstico y tratamiento de los trastornos 
                            que afectan al sistema nervioso central.</p>
                        <button @click="router.push('/perfil-doctor')" type="button" class="btn btn-success">Ver Perfil</button>
                        
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        
                        <h5 class="card-title">José Rodríguez</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Cardiología</h6>
                        <p class="card-text">Se dedica al estudio, diagnóstico, tratamiento y prevención de 
                            enfermedades del corazón y del sistema circulatorio.</p>
                        <button @click="router.push('/perfil-doctor2')" type="button" class="btn btn-success">Ver Perfil</button>
                        
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        
                        <h5 class="card-title">Carla Quintero</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Dermatología</h6>
                        <p class="card-text">Se enfoca en el diagnóstico, tratamiento y prevención de enfermedades 
                            de la piel, el cabello, las uñas y las membranas mucosas.</p>
                        <button @click="router.push('/perfil-doctor3')" type="button" class="btn btn-success">Ver Perfil</button>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        
                        <h5 class="card-title">Victor Contreras</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Neumología</h6>
                        <p class="card-text">Se dedica al estudio, diagnóstico y tratamiento de los trastornos 
                            que afectan al sistema nervioso central.</p>
                        <button @click="router.push('/perfil-doctor4')" type="button" class="btn btn-success">Ver Perfil</button>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        
                        <h5 class="card-title">Estefany Lunar</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Pediatría</h6>
                        <p class="card-text">Se enfoca en el cuidado de la salud de bebés, niños y adolescentes, 
                            desde la concepción hasta aproximadamente los 18-21 años. </p>
                        <button @click="router.push('/perfil-doctor5')" type="button" class="btn btn-success">Ver Perfil</button>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        
                        <h5 class="card-title">Alejandro Parra</h5>
                        <h6 class="list-group-item"><strong>Especialidad:</strong> Geriatría</h6>
                        <p class="card-text">se enfoca en el cuidado integral de las personas mayores.</p>
                        <button @click="router.push('/perfil-doctor6')" type="button" class="btn btn-success">Ver Perfil</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>