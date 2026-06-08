// ============================================================
// PRÁCTICA 3 - PNT: Rutas de Compras (Express Router)
// ============================================================
// Este es el router más interesante porque trabaja con RELACIONES.
//
// CONCEPTOS CLAVE:
// - JOIN: combinar datos de varias tablas en una sola consulta
// - INNER JOIN: solo muestra registros con coincidencia en ambas tablas
// - Foreign Keys: las compras DEBEN referenciar un usuario y producto existentes
// - Transacciones implícitas: MySQL asegura que cada INSERT es atómico
//
// ENDPOINTS:
// GET    /api/compras         → Listar todas (con datos de usuario y producto)
// GET    /api/compras/:id     → Obtener una compra específica
// GET    /api/compras/usuario/:id → Compras de un usuario específico
// POST   /api/compras         → Registrar nueva compra
// DELETE /api/compras/:id     → Eliminar una compra
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../DB/database');
const path = require('path');
const fs = require('fs');


// ============================================================
// GET /api/dibujos — Listar todos los dibujos
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [dibujos] = await db.execute(`
            SELECT
                d.id,
                d.nombre,
                d.descripcion,
                d.imagen,
                d.artista_id,
                a.nombre AS artista_nombre,
                d.estilo_id,
                e.nombre AS estilo_nombre,
                d.created_at,
                d.updated_at
            FROM dibujos d
            INNER JOIN artistas a ON d.artista_id = a.id
            INNER JOIN estilos e ON d.estilo_id = e.id
            ORDER BY d.id ASC
        `);

        res.json({
            status: 'success',
            data: dibujos,
            count: dibujos.length
        });

    } catch (error) {
        console.error('Error al listar compras:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/dibujos/:id — Obtener uno
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const [dibujos] = await db.execute(`
            SELECT
                d.id,
                d.nombre,
                d.descripcion,
                d.imagen,
                d.artista_id,
                a.nombre AS artista_nombre,
                d.estilo_id,
                e.nombre AS estilo_nombre,
                d.created_at,
                d.updated_at
            FROM dibujos d
            INNER JOIN artistas a ON d.artista_id = a.id
            INNER JOIN estilos e ON d.estilo_id = e.id
            WHERE d.id = ?
        `, [req.params.id]);

        if (dibujos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Dibujo con ID ${id} no encontrada`
            });
        }

        res.json({ status: 'success', data: dibujos[0] });

    } catch (error) {
        console.error('Error al obtener dibujo:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});
// ============================================================
// POST /api/dibujos — Crear nuevo
// ============================================================
router.post('/', (req, res) => {
    console.log('llegó al router de dibujos'); // ← agregar
    console.log('upload:', req.app.locals.upload);
    const upload = req.app.locals.upload;
    upload.single('imagen')(req, res, async (err)=>{
        if (err)
            return res.status(400).json({ staus:'error', message: err.message});
        try{
            const {nombre, descripcion, artista_id, estilo_id} = req.body;

            if(!nombre || nombre.trim().length < 2)
                return res.status(400).json({status:'error', message:'El nombre es obligatorio (minimo 2 caracteres)'})
            if(!descripcion || descripcion.trim().length < 2)
                return res.status(400).json({status:'error', message:'La descripcion es obligatoria'})
            if(!artista_id || isNaN(Number(artista_id)))
                return res.status(400).json({status:'error', message:'El artista es obligatorio'})
            if(!estilo_id || isNaN(Number(estilo_id)))
                return res.status(400).json({status:'error', message:'El estilo es obligatorio'})
            if(!req.file)
                return res.status(400).json({status:'error', message:'La imagen es obligatoria'})
            const [artista] = await db.execute('SELECT id FROM artistas WHERE id = ?',[artista_id]);
            if(artista.length === 0)
                return res.status(404).json({status:'error', message:`Artista con ID ${artista_id} no encontrado`});
            const [estilo] = await db.execute('SELECT id FROM estilos WHERE id = ?', [estilo_id])
            if (estilo.length === 0)
                return res.status(404).json({status:'error', message:`Estilo con ID ${estilo_id} no encontrado`})
            const nombreImagen = req.file.filename;
            const [resultado] = await db.execute('INSERT INTO dibujos(nombre, descripcion, imagen, artista_id, estilo_id)VALUES (?, ?, ?, ?, ?)',[nombre.trim(), descripcion.trim(), nombreImagen,artista_id, estilo_id]);
            const [nuevo] = await db.execute(`
                SELECT d.id, d.nombre, d.descripcion, d.imagen, a.nombre AS artista_nombre, e.nombre AS estilo_nombre, d.created_at
                FROM dibujos d
                INNER JOIN artistas a ON d.artista_id = a.id
                INNER JOIN estilos e ON d.estilo_id = e.id
                WHERE d.id = ?
                `,[resultado.insertId]);
                res.status(201).json({status:'success', data: nuevo[0]});
        }catch(error){
            if(req.file) fs.unlink(req.file.path, () => {});
            console.error('Error al crear dibujo:', error.message);
            res.status(500).json({status:'error', message:'Error interno del servidor'});
        }
    });
});
// ============================================================
// PUT /api/dibujos/:id — Actiualizar (imagen opcional)
// ============================================================
router.put('/:id', (req, res) => {
    const upload = req.app.locals.upload;
    upload.single('imagen')(req, res, async (err)=>{
        console.log('err:', err);
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
        if (err)
            return res.status(400).json({ staus:'error', message: err.message});
        try{
            const { id } = req.params;
            const { nombre, descripcion, artista_id, estilo_id } = req.body;

            const [existente] = await db.execute('SELECT id, imagen FROM dibujos WHERE id = ?',[id]);

            if(existente.length === 0)
                return res.status(404).json({status:'error', message:`Dibujo con ID ${id} no encontrado`})

            if(!nombre || nombre.trim().length < 2)
                return res.status(400).json({status:'error', message:'El nombre es obligatorio (minimo 2 caracteres)'})
            if(!descripcion || descripcion.trim().length < 2)
                return res.status(400).json({status:'error', message:'La descripcion es obligatoria'})
            if(!artista_id || isNaN(Number(artista_id)))
                return res.status(400).json({status:'error', message:'El artista es obligatorio'})
            if(!estilo_id || isNaN(Number(estilo_id)))
                return res.status(400).json({status:'error', message:'El estilo es obligatorio'})

            const [artista] = await db.execute('SELECT id FROM artistas WHERE id = ?',[artista_id]);

            if(artista.length === 0)
                return res.status(404).json({status:'error', message:`Artista con ID ${artista_id} no encontrado`});

            const [estilo] = await db.execute('SELECT id FROM estilos WHERE id = ?', [estilo_id])
            if (estilo.length === 0)
                return res.status(404).json({status:'error', message:`Estilo con ID ${estilo_id} no encontrado`})

            let nombreImagen = existente[0].imagen;
            if(req.file){
                const rutaAnterior = path.join(__dirname , '..', '..','public', 'uploads', existente[0].imagen);
                fs.unlink(rutaAnterior, () => {});
                nombreImagen = req.file.filename;
            }
            await db.execute(
                'UPDATE dibujos SET nombre = ?, descripcion = ?, imagen = ?, artista_id = ?, estilo_id = ? WHERE id = ?', [nombre.trim(), descripcion.trim(), nombreImagen, artista_id, estilo_id, id]
            );
            const [actualizado] = await db.execute(`
                SELECT d.id, d.nombre, d.descripcion, d.imagen,
                       a.nombre AS artista_nombre, e.nombre AS estilo_nombre,
                       d.created_at, d.updated_at
                FROM dibujos d
                INNER JOIN artistas a ON d.artista_id = a.id
                INNER JOIN estilos e ON d.estilo_id = e.id
                WHERE d.id = ?
            `,[id]);
            res.json({status:'success', data: actualizado[0]});
        }catch(error){
            if(req.file) fs.unlink(req.file.path, () => {
                console.error('Error al crear dibujo:', error.message);
                res.status(500).json({status:'error', message:'Error interno del servidor'});
                fs.unlink(rutaAnterior, () => {});
                nombreImagen = req.file.filename;
            });
        }
    });
});
// ============================================================
// DELETE /api/dibujos/:id — Eliminar
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [dibujo] = await db.execute(
            'SELECT id, nombre, imagen FROM dibujos WHERE id = ?', [id]
        );

        if (dibujo.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Dibujo con ID ${req.params.id} no encontrada`
            });
        }

        const rutaImagen = path.join(__dirname, '..', '..','public','uploads', dibujo[0].imagen);
        fs.unlink(rutaImagen, () => {});

        await db.execute('DELETE FROM dibujos WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: { mensaje: `Dibujo "${dibujo[0].nombre}" eliminado` }
        });

    } catch (error) {
        console.error('Error al eliminar dibujo:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;