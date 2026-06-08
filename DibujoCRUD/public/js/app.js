// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

// Fetch wrapper con logging (evolución de P2)
async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = url;
    apiCodigo.textContent = '...';
    apiCodigo.className = 'badge badge-neutral';

    try {
        const respuesta = await fetch(url, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE ARTISTAS
// ============================================================
const formArtista = document.getElementById('form-artista');
const inputArtistaId = document.getElementById('artista-id');
const inputArtistaNombre = document.getElementById('artista-nombre');
const inputArtistaEmail = document.getElementById('artista-email');
const inputArtistasDescripcion = document.getElementById('artista-descripcion');
const formTituloArtista = document.getElementById('form-titulo-artista');
const btnGuardarArtista = document.getElementById('btn-guardar-artista');
const btnCancelarArtista = document.getElementById('btn-cancelar-artista');
const tbodyArtistas = document.getElementById('tbody-artistas');
const tablaArtistas = document.getElementById('tabla-artistas');
const cargaArtistas = document.getElementById('carga-artistas');
const contadorArtistas = document.getElementById('contador-artistas');
const errorArtistaNombre = document.getElementById('error-artista-nombre');
const errorArtistaEmail = document.getElementById('error-artista-email');
const errorArtistaDescripcion = document.getElementById('error-artista-descripcion');

async function cargarArtistas() {
    try {
        const resp = await fetchAPI('/api/artistas');
        cargaArtistas.style.display = 'none';

        if (resp.data.length === 0) {
            tablaArtistas.style.display = 'none';
            cargaArtistas.textContent = 'No hay artistas registrados.';
            cargaArtistas.style.display = 'block';
        } else {
            tablaArtistas.style.display = 'table';
            tbodyArtistas.innerHTML = '';
            resp.data.forEach(a => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${a.id}</td>
                    <td>${escapeHtml(a.nombre)}</td>
                    <td>${escapeHtml(a.email)}</td>
                    <td>${escapeHtml(a.descripcion)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarArtista(${a.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarArtista(${a.id}, '${escapeHtml(a.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyArtistas.appendChild(fila);
            });
        }
        contadorObras.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar artistas: ' + error.message, 'error');
    }
}

async function cargarSelectArtistas() {
    try {
        const resp = await fetchAPI('/api/artistas');
        const select = document.getElementById('dibujo-artista');
        select.innerHTML = '<option value="">-- Seleccionar estilo --</option>';
        resp.data.forEach(a => {
            // createElement es más seguro que innerHTML para datos dinámicos
            const option = document.createElement('option');
            option.value = a.id;
            option.textContent = a.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select artistas:', error);
    }
}

function validarFormArtista() {
    let ok = true;
    const nombre = inputArtistaNombre.value.trim();
    const email = inputArtistaEmail.value.trim();
    const descripcion = inputArtistasDescripcion.value.trim();

    if (!nombre || nombre.length < 2) {
        errorArtistaNombre.textContent = 'Mínimo 2 caracteres';
        inputArtistaNombre.classList.add('input-error');
        ok = false;
    } else {
        errorArtistaNombre.textContent = '';
        inputArtistaNombre.classList.remove('input-error');
    }
    return ok;

    if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.text(email)) {
        errorArtistaEmail.textContent = 'Email no valido';
        inputArtistaEmail.classList.add('input-error');
        ok = false;
    } else {
        errorArtistaEmail.textContent = '';
        inputArtistaEmail.classList.remove('input-error');
    }
    return ok;
    
    if (!nombre || descripcion.length < 2) {
        errorArtistaDescripcion.textContent = 'La descripcion es obligatoria';
        inputArtistasDescripcion.classList.add('input-error');
        ok = false;
    } else {
        errorArtistaDescripcion.textContent = '';
        inputArtistasDescripcion.classList.remove('input-error');
    }
    return ok;
    
}

function limpiarFormArtista() {
    formArtista.reset();
    inputArtistaId.value = '';
    formTituloArtista.textContent = 'Agregar Artistas';
    btnGuardarArtista.textContent = 'Guardar';
    btnCancelarArtista.style.display = 'none';
    errorArtistaNombre.textContent = '';
    errorArtistaEmail.textContent = '';
    errorArtistaDescripcion.textContent = '';
    inputArtistaNombre.classList.remove('input-error');
    inputArtistaEmail.classList.remove('input-error');
    inputArtistasDescripcion.classList.remove('input-error');
}

formArtista.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormArtista()) return;

    const datos = {
        nombre: inputArtistaNombre.value.trim(),
        email: inputArtistaEmail.value.trim(),
        descripcion: inputArtistasDescripcion.value.trim()
    };
    const id = inputArtistaId.value;
     
    try {
        if (id) {
            await fetchAPI(`/api/artistas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Artista actualizado', 'exito');
        } else {
            await fetchAPI('/api/artistas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Artista creado', 'exito');
        }
        limpiarFormArtista();
        cargarArtistas();
        cargarSelectArtistas(); // Actualizar select de compras
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarArtista(id) {
    try {
        const resp = await fetchAPI(`/api/artistas/${id}`);
        inputArtistaId.value = resp.data.id;
        inputArtistaNombre.value = resp.data.nombre;
        inputArtistaEmail.value = resp.data.email;
        inputArtistasDescripcion.value = resp.data.descripcion;
        formTituloArtista.textContent = 'Editar Artista';
        btnGuardarArtista.textContent = 'Actualizar';
        btnCancelarArtista.style.display = 'inline-block';
        cambiarSeccion('artistas');
        formArtista.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarArtista(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}" y todas sus compras?`)) {
        eliminarArtista(id);
    }
}

async function eliminarArtista(id) {
    try {
        await fetchAPI(`/api/artistas/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Artista eliminado', 'exito');
        if (inputArtistaId.value === String(id)) limpiarFormArtista();
        cargarArtistas();
        cargarSelectArtistas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarArtista.addEventListener('click', limpiarFormArtista);
// ============================================================
// 3. MÓDULO DE ESTILOS
// ============================================================
const formEstilo = document.getElementById('form-estilo');
const inputEstiloId = document.getElementById('estilo-id');
const inputEstiloNombre = document.getElementById('estilo-nombre');
const inputEstiloDescripcion = document.getElementById('estilo-descripcion');
const inputEstiloOrigen = document.getElementById('estilo-origen');
const formTituloEstilo = document.getElementById('form-titulo-estilo');
const btnGuardarEstilo = document.getElementById('btn-guardar-estilo');
const btnCancelarEstilo = document.getElementById('btn-cancelar-estilo');
const tbodyEstilos = document.getElementById('tbody-estilos');
const tablaEstilos = document.getElementById('tabla-estilos');
const cargaEstilos = document.getElementById('carga-estilos');
const contadorEstilos = document.getElementById('contador-estilos');
const errorEstiloNombre = document.getElementById('error-estilo-nombre');
const errorEstiloDescripcion = document.getElementById('error-estilo-descripcion');
const errorEstiloOrigen = document.getElementById('error-estilo-origen');

async function cargarEstilos() {
    try {
        const resp = await fetchAPI('/api/estilos');
        cargaEstilos.style.display = 'none';
        if (resp.data.length === 0) {
            tablaEstilos.style.display = 'none';
            cargaEstilos.textContent = 'No hay estilos registrados.';
            cargaEstilos.style.display = 'block';
        } else {
            tablaEstilos.style.display = 'table';
            tbodyEstilos.innerHTML = '';
            resp.data.forEach(e => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${e.id}</td>
                    <td>${escapeHtml(e.nombre)}</td>
                    <td>${escapeHtml(e.descripcion)}</td>
                    <td>${escapeHtml(e.origen)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarEstilo(${e.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarEstilo(${e.id}, '${escapeHtml(e.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyEstilos.appendChild(fila);
            });
        }
        contadorEstilos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar estilos: ' + error.message, 'error');
    }
}

async function cargarSelectEstilos() {
    try {
        const resp = await fetchAPI('/api/estilos');
        const select = document.getElementById('dibujo-estilo');
        select.innerHTML = '<option value="">-- Seleccionar estilo --</option>';
        resp.data.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = `${e.nombre} (${e.origen})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select estilos:', error);
    }
}

function limpiarFormEstilo() {
    formEstilo.reset();
    inputEstiloId.value = '';
    formTituloEstilo.textContent = 'Agregar Estilo';
    btnGuardarEstilo.textContent = 'Guardar';
    btnCancelarEstilo.style.display = 'none';
    errorEstiloNombre.textContent = '';
    errorEstiloDescripcion.textContent = '';
    errorEstiloOrigen.textContent = '';
}

formEstilo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: inputEstiloNombre.value.trim(),
        descripcion: inputEstiloDescripcion.value.trim(),
        origen: inputEstiloOrigen.value.trim()
    };
    const id = inputEstiloId.value;

    try {
        if (id) {
            await fetchAPI(`/api/estilos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Estilo actualizado', 'exito');
        } else {
            await fetchAPI('/api/estilos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Estilo creado', 'exito');
        }
        limpiarFormEstilo();
        cargarEstilos();
        cargarSelectEstilos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarEstilo(id) {
    try {
        const resp = await fetchAPI(`/api/estilos/${id}`);
        inputEstiloId.value = resp.data.id;
        inputEstiloNombre.value = resp.data.nombre;
        inputEstiloDescripcion.value = resp.data.descripcion;
        inputEstiloOrigen.value = resp.data.origen;
        formTituloEstilo.textContent = 'Editar Estilo';
        btnGuardarEstilo.textContent = 'Actualizar';
        btnCancelarEstilo.style.display = 'inline-block';
        cambiarSeccion('estilos');
        formEstilo.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarEstilo(id, nombre) {
    if (confirm(`¿Eliminar el estilo "${nombre}"?`)) eliminarEstilo(id);
}

async function eliminarEstilo(id) {
    try {
        await fetchAPI(`/api/estilos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Estilo eliminado', 'exito');
        if (inputEstiloId.value === String(id)) limpiarFormEstilo();
        cargarEstilos();
        cargarSelectEstilos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarEstilo.addEventListener('click', limpiarFormEstilo);

// ============================================================
// 4. MÓDULO DE DIBUJOS
// ============================================================
const formDibujo = document.getElementById('form-dibujo');
const inputDibujoId = document.getElementById('dibujo-id');
const inputDibujoNombre = document.getElementById('dibujo-nombre');
const inputDibujoDescripcion = document.getElementById('dibujo-descripcion');
const inputDibujoImagen = document.getElementById('dibujo-imagen');
const selectDibujoArtista = document.getElementById('dibujo-artista');
const selectDibujoEstilo = document.getElementById('dibujo-estilo');
const formTituloDibujo = document.getElementById('form-titulo-dibujo');
const btnGuardarDibujo = document.getElementById('btn-guardar-dibujo');
const btnCancelarDibujo = document.getElementById('btn-cancelar-dibujo');
const tbodyDibujos = document.getElementById('tbody-dibujos');
const tablaDibujos = document.getElementById('tabla-dibujos');
const cargaDibujos = document.getElementById('carga-dibujos');
const contadorDibujos = document.getElementById('contador-dibujos');

async function cargarDibujos() {
    try {
        const resp = await fetchAPI('/api/dibujos');
        cargaDibujos.style.display = 'none';
        if (resp.data.length === 0) {
            tablaDibujos.style.display = 'none';
            cargaDibujos.textContent = 'No hay dibujos registrados.';
            cargaDibujos.style.display = 'block';
        } else {
            tablaDibujos.style.display = 'table';
            tbodyDibujos.innerHTML = '';
            resp.data.forEach(d => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${d.id}</td>
                    <td>${escapeHtml(d.nombre)}</td>
                    <td>${escapeHtml(d.artista_nombre)}</td>
                    <td>${escapeHtml(d.estilo_nombre)}</td>
                    <td><img src="/uploads/${d.imagen}" alt="${escapeHtml(d.nombre)}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;"></td>
                    <td>${escapeHtml(d.descripcion)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarDibujo(${d.id}, '${escapeHtml(d.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyDibujos.appendChild(fila);
            });
        }
        contadorDibujos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar dibujos: ' + error.message, 'error');
    }
}

function limpiarFormDibujo() {
    formDibujo.reset();
    inputDibujoId.value = '';
    formTituloDibujo.textContent = 'Agregar Dibujo';
    btnGuardarDibujo.textContent = 'Guardar';
    btnCancelarDibujo.style.display = 'none';
}

formDibujo.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', inputDibujoNombre.value.trim());
    formData.append('descripcion', inputDibujoDescripcion.value.trim());
    formData.append('artista_id', selectDibujoArtista.value);
    formData.append('estilo_id', selectDibujoEstilo.value);
    if (inputDibujoImagen.files[0]) {
        formData.append('imagen', inputDibujoImagen.files[0]);
    }

    try {
        // Usar fetch directo en lugar de fetchAPI
        const respuesta = await fetch('/api/dibujos', {
            method: 'POST',
            body: formData
        });
        const datos = await respuesta.json();
        console.log('Respuesta:', datos);
        if (!respuesta.ok) throw new Error(datos.message);
        mostrarNotificacion('Dibujo creado', 'exito');
        limpiarFormDibujo();
        cargarDibujos();
        cargarObras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarDibujo(id, nombre) {
    if (confirm(`¿Eliminar el dibujo "${nombre}"?`)) eliminarDibujo(id);
}

async function eliminarDibujo(id) {
    try {
        await fetchAPI(`/api/dibujos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Dibujo eliminado', 'exito');
        cargarDibujos();
        cargarObras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarDibujo.addEventListener('click', limpiarFormDibujo);

// ============================================================
// 5. MÓDULO DE OBRAS (galería)
// ============================================================
const galeriaObras = document.getElementById('galeria-obras');
const cargaObras = document.getElementById('carga-obras');
const contadorObras = document.getElementById('contador-obras');

async function cargarObras() {
    try {
        const resp = await fetchAPI('/api/dibujos');
        cargaObras.style.display = 'none';
        contadorObras.textContent = `${resp.count}`;
        galeriaObras.innerHTML = '';

        if (resp.data.length === 0) {
            galeriaObras.innerHTML = '<p>No hay obras registradas.</p>';
            return;
        }

        resp.data.forEach(d => {
            const card = document.createElement('div');
            card.className = 'obra-card';
            card.innerHTML = `
                <img src="/uploads/${d.imagen}" alt="${escapeHtml(d.nombre)}">
                <div class="obra-info">
                    <h3>${escapeHtml(d.nombre)}</h3>
                    <p><strong>Artista:</strong> ${escapeHtml(d.artista_nombre)}</p>
                    <p><strong>Estilo:</strong> ${escapeHtml(d.estilo_nombre)}</p>
                    <p>${escapeHtml(d.descripcion)}</p>
                </div>
            `;
            galeriaObras.appendChild(card);
        });
    } catch (error) {
        mostrarNotificacion('Error al cargar obras: ' + error.message, 'error');
    }
}

// ============================================================
// 5. NAVEGACIÓN POR PESTAÑAS
// ============================================================
// Esta función muestra una sección y oculta las demás.
// También actualiza la pestaña activa visualmente.
// Es un patrón básico de SPA (Single Page Application):
// cambiar contenido sin recargar la página.
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    // Activar la pestaña correspondiente
    // Array.from convierte NodeList a Array para poder usar find()
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.textContent.toLowerCase() === seccion);
    if (tabActiva) tabActiva.classList.add('active');

    // Si cambiamos a compras, recargar selects con datos actuales
    if (seccion === 'compras') {
        cargarSelectArtistas();
        cargarSelectEstilos();
        cargarDibujos();
    }
}

// ============================================================
// 6. INICIALIZACIÓN
// ============================================================
// Al cargar la página, cargamos todos los datos iniciales.
document.addEventListener('DOMContentLoaded', () => {
    cargarArtistas();
    cargarEstilos();
    cargarDibujos();
    cargarObras();
});