const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos de estilos
// ============================================================
function validarEstilo(datos) {
    const errores = [];

    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.push('El nombre del estilo es obligatorio (mínimo 2 caracteres)');
    }

    if (!datos.descripcion || typeof datos.descripcion !== 'string' || datos.descripcion.trim().length > 24) {
        errores.push('El descripcion del estilo es obligatorio (maximo 24 caracteres)');
    }

    if (!datos.origen || typeof datos.origen !== 'string' || datos.origen.trim().length > 24) {
        errores.push('El origen del estilo es obligatorio (maximo 24 caracteres)');
    }

    return errores;
}

// ============================================================
// GET /api/estilos — Listar todos
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [estilos] = await db.execute(
            'SELECT id, nombre, descripcion, origen, created_at, updated_at FROM estilos ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: estilos,
            count: estilos.length
        });

    } catch (error) {
        console.error('Error al listar estilos:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/estilos/:id — Obtener uno
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [estilos] = await db.execute(
            'SELECT id, nombre, descripcion, origen, created_at, updated_at FROM estilos WHERE id = ?',
            [id]
        );

        if (estilos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Estilos con ID ${req.params.id} no encontrado`
            });
        }

        res.json({ status: 'success', data: estilos[0] });

    } catch (error) {
        console.error('Error al obtener estilos:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/estilos — Crear nuevo
// ============================================================
router.post('/', async (req, res) => {
    try {
        const {nombre, descripcion, origen} = req.body;
        
        if(!nombre || nombre.trim().length < 2)
            return res.status(400).json({status: 'error', message:'El nombre es obligatorio(minimo 2 caracteres)'});
        if(!descripcion || descripcion.trim().length < 2)
            return res.status(400).json({status: 'error', message: 'la descripcion es oblitatoria'});
        if(!origen || origen.trim().length < 2)
            return res.status(400).json({status: 'error', message: 'El origen es obligatorio'});

        const [resultado] = await db.execute(
            'INSERT INTO estilos (nombre, descripcion, origen) VALUES (?, ?, ?)',
            [nombre.trim(), descripcion.trim(), origen.trim()]
        );

        const [nuevo] = await db.execute('SELECT * FROM estilos WHERE id= ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nuevo[0] });

    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY')
            return res.status(409).json({status: 'error', message: 'Ya existe un estilo con ese nombre'})
        console.error('Error al crear estilo:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/estilos/:id — Actualizar
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, descripcion, origen} = req.body;
        
        const[existente] = await db.execute('SELECT id FROM estilos WHERE id = ?', [id]);
        if(existente.length === 0)
            return res.status(404).json({status: ' error', message: `Estilo con ID ${id} no encontrado`});

        if(!nombre || nombre.trim().length < 2)
            return res.status(400).json({status: 'error', message:'El nombre es obligatorio'});
        if(!descripcion || descripcion.trim().length < 2)
            return res.status(400).json({status: 'error', message: 'la descripcion es oblitatoria'});
        if(!origen || origen.trim().length < 2)
            return res.status(400).json({status: 'error', message: 'El origen es obligatorio'});

        await db.execute(
            'UPDATE estilos SET nombre = ?, descripcion = ?,origen = ? WHERE id = ?',
            [nombre.trim(), descripcion.trim(), origen.trim(), id]
        );

        const [actualizado] = await db.execute('SELECT id, nombre, descripcion, origen, created_at, updated_at FROM estilos WHERE id = ?',[id]);

        res.json({ stauts: 'sucess', data: actualizado[0]});

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ status: 'error', message: 'Ya existe un estilo con ese nombre' });
        console.error('Error al actualizar estilo:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/estilos/:id — Eliminar
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [estilo] = await db.execute('SELECT id, nombre FROM estilos WHERE id = ?',[id]);
        if (estilo.length === 0)
            return res.status(404).json({ status: 'succes', data: {mensaje:`Estilo con ID ${id} no encontrado`}});

        await db.execute('DELETE FROM estilos WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                mensaje: `Estilo "${estilo[0].nombre}" eliminado`
            }
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar el estilo porque tiene dibujos asociadas'
            });
        }
        console.error('Error al eliminar estilo:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;