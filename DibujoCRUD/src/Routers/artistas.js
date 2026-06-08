// ============================================================
// PRÁCTICA 3 - PNT: Rutas de Usuarios (Express Router)
// ============================================================
// NUEVO EN P3: Express Router
//
// Express permite organizar las rutas en "routers" separados.
// Cada router maneja las rutas de un recurso específico.
// Esto es mucho más organizado que tener todo en un solo archivo.
//
// ESTRUCTURA:
// /api/usuarios      → GET (listar), POST (crear)
// /api/usuarios/:id  → GET (uno), PUT (actualizar), DELETE (eliminar)
//
// DIFERENCIAS CON P1/P2:
// - No necesitamos parsear la URL manualmente (Express lo hace)
// - No necesitamos leer el body manualmente (express.json() lo hace)
// - No necesitamos manejar CORS manualmente (el middleware lo hace)
// - El código es más limpio y enfocado en la lógica de negocio
// ============================================================

// express.Router() crea un mini-aplicación con sus propias rutas
// Es como un "sub-servidor" dedicado a un recurso
const express = require('express');
const router = express.Router();

// Importar la conexión a la base de datos
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos de usuario
// ============================================================
function validarArtista(datos) {
    const errores = [];

    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.push('El nombre es obligatorio y debe tener al menos 2 caracteres');
    }

    if (!datos.email || typeof datos.email !== 'string') {
        errores.push('El email es obligatorio');
    } else {
        // Validar formato de email con expresión regular básica
        // Esta regex verifica: texto@texto.texto
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            errores.push('El formato del email no es válido');
        }
    }

    return errores;
}

// ============================================================
// GET /api/artistas — Listar todos
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [artistas] = await db.execute(
            'SELECT id, nombre, email, descripcion, created_at, updated_at FROM artistas ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: artistas,
            count: artistas.length
        });

    } catch (error) {
        console.error('Error al listar artistas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/artistas/:id — Obtener uno
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const [artistas] = await db.execute(
            'SELECT id, nombre, email, descripcion, created_at, updated_at FROM artistas WHERE id = ?',
            [req.params.id]
        );

        if (artistas.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Usuario con ID ${req.params.id} no encontrado`
            });
        }

        res.json({ status: 'success', data: artistas[0] });

    } catch (error) {
        console.error('Error al obtener artistas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/artistas — Crear nuevo
// ============================================================
router.post('/', async (req, res) => {
    try {
        const {nombre, email, descripcion} = req.body;

        if (!nombre || nombre.trim().length < 2)
            return res.status(400).json({ status: 'error', message: 'El nombre es obligatorio (mínimo 2 caracteres)' });
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ status: 'error', message: 'El email no es válido' });
        if (!descripcion || descripcion.trim().length < 2)
            return res.status(400).json({ status: 'error', message: 'La descripción es obligatoria' });


        const [resultado] = await db.execute(
            'INSERT INTO artistas (nombre, email, descripcion) VALUES (?, ?, ?)',
            [nombre.trim(), email.trim().toLowerCase(), descripcion.trim()]
        );

        const [nuevo] = await db.execute(
            'SELECT id, nombre, email, descripcion, created_at FROM artistas WHERE id = ?',
            [resultado.insertId]
        );
        
        // 201 = Created
        res.status(201).json({
            status: 'success',
            data: nuevo[0]
        });

    } catch (error) {
        // Manejar error de email duplicado (UNIQUE constraint)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'Ya existe un artista con ese email'
            });
        }
        console.error('Error al crear artista:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/artistas/:id — Actualizar artista
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {nombre, email, descripcion} = req.body;

        const [existente] = await db.execute('SELECT id FROM artistas WHERE id = ?', [id]);
        if (!nombre || nombre.trim().length < 2)
            return res.status(400).json({ status: 'error', message: 'El nombre es obligatorio' });
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ status: 'error', message: 'El email no es válido' });
        if (!descripcion || descripcion.trim().length < 2)
            return res.status(400).json({ status: 'error', message: 'La descripción es obligatoria' });


        await db.execute(
            'UPDATE artistas SET nombre = ?, email = ?, descripcion = ? WHERE id = ?',
            [nombre.trim(), email.trim().toLowerCase(), descripcion.trim(), id]
        );

        const [actualizado] = await db.execute(
            'SELECT id, nombre, email, descripcion, created_at, updated_at FROM artistas WHERE id = ?',
            [id]
        );

        res.json({ status: 'success', data: actualizado[0] });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'Ya existe otro artistas con ese email'
            });
        }
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/artistas/:id — Eliminar
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [artistas] = await db.execute(
            'SELECT id, nombre FROM artistas WHERE id = ?', [id]
        );

        if (artistas.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Artistas con ID ${id} no encontrado`
            });
        }

        await db.execute('DELETE FROM artistas WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                eliminado: artistas[0],
                mensaje: `Artistas "${artistas[0].nombre}" y sus compras eliminados`
            }
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451)
            return res.status(409).json({status:'error', message:'No se puede eliminar el artista porque tiene dibujos asociados'})
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Exportar el router para que server.js lo pueda usar
module.exports = router;