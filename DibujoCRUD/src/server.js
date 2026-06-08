const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
//servidor para iniciarlizar con express

const PORT = process.env.PORT || 3000;


//configuracion del multer
//nota para mi: que es un multer, un multer es un guardado de imagenes, en una carpeta se guardarn las imagenes importadas en el formulario index.html
//hay que ubicar donde guardaremos estos archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + extension);
    }
});

//los tipos que permite el multer
const fileFilter = (req, file, cb) => {
    console.log('mimetype recibido:', file.mimetype);
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if(tiposPermitidos.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Solo se permiten imagenes(jpeg, jpg, png, webp, gif)'))
    }
};
//tamño de la carga
const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5* 1024 * 1024}
});

app.locals.upload = upload;
//para poder aplicar el MVC necesitamos un intermediario que se va a encargar de ser un mesero (middleware), el cual para cada peticion que pasa por la ruta de la vista, obtiene una petición y la envia a un controlador

app.use(cors());

//las peticiones las debemos de atender en un formato JSON, lo que permite poder detectar los elementos bajo los criterios clave, valor

app.use(express.json());

//que se debe de tener una ruta personalizada por cada tipo de petición next es la ruta a la cual se va atender el tipo de petión o de respuesta

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

//debemos definir las rutas para los archivos
app.use(express.static(path.join(__dirname, '..', 'public')));

//vamos a manejar las rutas de los recursos que se van a obtener por medio de las peticiones o respuestas
//pueden existen rutas como app.use('api/usuarios', usuariosRouter) todas las rutas son los metodos posibles para cada formulario
//router.get('/')
//router.get('/usuarios')
//router.post('/')
//router.get('/:id')

const artistasRouter = require('./Routers/artistas');
const estilosRouter = require('./Routers/estilos');
const dibujosRouter = require('./Routers/dibujos');

app.use('/api/artistas', artistasRouter);
app.use('/api/estilos', estilosRouter);
app.use('/api/dibujos', dibujosRouter);


//vamos a documentar cada endpoint
app.get('/api', (req, res) => {
    res.json({
        status : 'success',
        message : 'API REST DibujoCRUD',
        endpoint : {
            artistas : {
                listar : 'GET /api/artistas',
                obtener : 'GET /api/artistas/:id',
                crear : 'POST /api/artistas',
                actualizar : 'PUT /api/artistas/:id',
                eliminar : 'DELETE /api/artistas/:id'
            },
            estilos : {
                listar : 'GET /api/estilos',
                obtener : 'GET /api/estilos/:id',
                crear : 'POST /api/estilos',
                actualizar : 'PUT /api/estilos/:id',
                eliminar : 'DELETE /api/estilos/:id'
            },
            dibujos : {
                listar : 'GET /api/dibujos',
                obtener : 'GET /api/dibujos/:id',
                crear : 'POST /api/dibujos',
                actualizar : 'PUT /api/dibujos/:id',
                eliminar : 'DELETE /api/dibujos/:id'
            }

        }
    });
});

//vamos a crear una funcion para las rutas inexisten
app.use('/api/*path', (req, res) => {
    res.status(404).json({
        status : 'error',
        message : 'Ruta no encontrada'
    });
    res.send('Errores.html');
});

//necesitamos un manejador de errores
app.use((err, req, res, next) =>{
    console.log('error no manejado: ', err.message);
    res.status(500).json({
        status : 'error',
        message : 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log('Servidor inicializado');
});