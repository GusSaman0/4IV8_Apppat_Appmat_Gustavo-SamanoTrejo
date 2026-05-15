//lo primero que necesitamos es obtener cada uno de los parametros del formulario

const formUsuario = document.getElementById('form-usuario');
const inputId = document.getElementById('usuario-id');
const inputNombre = document.getElementById('nombre');
const inputFecha  = document.getElementById('fecha-nacimiento');
const inputNota = document.getElementById('nota');
const formTitulo = document.getElementById('form-titulo');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios  = document.getElementById('tabla-usuarios');
const mensajeCargar = document.getElementById('mensaje-carga');
const mensajeVacio = document.getElementById('mensaje-vacio');
const notificacionDiv = document.getElementById('notificacion');

//elementos para errores
const errorNombre = document.getElementById('error-nombre');
const errorFecha = document.getElementById('error-nacimiento');
const errorNota = document.getElementById('error-nota');

//vamos a crear una API, para poder atender las peticiones del cliente hacia el servidor
const API_URL = '/api/usuarios';

//por defecto recordemos que el metodo get sirve para obtener los datos de todos los usuarios select * from usuarios

async function cargarUsuarios(){
    try {
        //vamos a utilizar una funcion llamada fetch la cual realiza una peticion http por defecto mediante get, mientras que al ser una funcion asincrona, espera (await) que la peticion se complete antes de continuar
        const respuesta = await fetch(API_URL);

        //si responde ok el codigo nos da un estado 200 a 299
        if(!respuesta.ok){
            throw new Error('Error al cargar los usuarios');
        }
        const usuarios = await respuesta.json();

        //tenemos que pintar los datos
        renderizarTable(usuarios);
    }
    catch (error){
        console.log('Error:', error);
        mostrarNotificacion('Error al cargar los usuarios', 'error');
    }
}