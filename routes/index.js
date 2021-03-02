//import { read } from 'fs';

var express = require('express');
var Request = require('request');
var router = express.Router();

var multiparty = require('connect-multiparty')();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Gridfs = require('gridfs-stream');
const { json } = require('body-parser');

var Tareas = mongoose.model('Tareas');
var Tipos = mongoose.model('Tipos');
var Clientes = mongoose.model('Clientes');
var Accesos = mongoose.model('Accesos');
//var Votos= mongoose.model('Votos');
//var Partidos= mongoose.model('Partidos');
//var Electores=mongoose.model('Electores');



//inicio metodos para las imagenes

router.post('/upload1', multiparty, function(req, res, next) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var writestream = gfs.createWriteStream({
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
    })
    fs.createReadStream(req.files.file.path).pipe(writestream);

    writestream.on('close', function(file) {
        fs.unlink(req.files.file.path, function(err) {
            console.log('success')
        })
    })
})

router.post('/upload/:id', multiparty, function(req, res, next) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var writestream = gfs.createWriteStream({
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
    })
    fs.createReadStream(req.files.file.path).pipe(writestream);

    writestream.on('close', function(file) {
        Productos.findById(req.params.id, function(err, producto) {
            eliminar(producto.imagen);
            producto.imagen = file._id;
            producto.save(function(err, updateproducto) {
                return res.json(200, updateproducto)
            })
        })
        fs.unlink(req.files.file.path, function(err) {
            console.log('success')
        })
    })
})

router.get('/descargar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var readstream = gfs.createReadStream({
        _id: req.params.id
    })
    readstream.on('error', function(err) {
        res.send('no existe imagen')
    })
    readstream.pipe(res);
    //console.log(res)

})

function eliminar(id, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: id }, function(err, found) {
        if (err) return { mensaje: "error ocurrido" };
        if (found) {
            gfs.remove({ _id: id }, function(err) {
                if (err) return { mensaje: "error ocurrido" }; { mensaje: "imagen elimnada" };
            })
        } else {
            { mensaje: "no existe imagen con ese id" };
        }
    })
}

router.get('/eliminar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: re.params.id }, function(err, found) {
        if (err) return res.send("error ocurrido");
        if (found) {
            gfs.remove({ _id: req.params.id }, function(err) {
                if (err) return res.send("error ocurrido");
                res.send("imagen elimnada")
            })
        } else {
            res.send("no existe imagen con ese id");
        }
    })
})


//fin metodos para las imagenes


//GET - Listar todos
router.get('/tareas', function(req, res, next) {
    Tareas.find(function(err, tareas) {
        if (err) { return next(err) }

        res.json(tareas)
    })
})

router.get('/tipos', function(req, res, next) {
    Tipos.find(function(err, tipos) {
        if (err) { return next(err) }
        res.json(tipos);
    })
})

router.get('/clientes', function(req, res, next) {
    Clientes.find(function(err, clientes) {
        if (err) { return next(err) }
        res.json(clientes);
    })
})

router.get('/stockproductoFechas5/:startDate/:endDate/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Sucursal: req.params.sucursal }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})


router.get('/accesos', function(req, res, next) {
        Accesos.find(function(err, accesos) {
            if (err) { return next(err) }
            res.json(accesos);
        })
    })


    //POST - Agregar todos
router.post('/tarea', function(req, res, next) {
    var tarea = new Tareas(req.body);
    tarea.save(function(err, tarea) {
        if (err) { return next(err) }
        res.json(tarea);
    })
})

router.post('/tipo', function(req, res, next) {
    var tipo = new Tipos(req.body);
    tipo.save(function(err, tipo) {
        if (err) { return next(err) }
        res.json(tipo);
    })
})
router.post('/cliente', function(req, res, next) {
    var cliente = new Clientes(req.body);
    cliente.save(function(err, cliente) {
        if (err) { return next(err) }
        res.json(cliente);
    })
})


router.post('/acceso', function(req, res, next) {
    var acceso = new Accesos(req.body);
    acceso.save(function(err, acceso) {
        if (err) { return next(err) }
        res.json(acceso);
    })
})



//PUT - Actualizar todos
router.put('/tarea/:id', function(req, res) {
    Tareas.findById(req.params.id, function(err, tarea) {
        tarea.nombre = req.body.nombre;
        tarea.prioridad = req.body.prioridad;
        tarea.responsable = req.body.responsable;

        tarea.save(function(err) {
            if (err) { res.send(err) }

            res.json(tarea);
        })
    })
})
router.get('/Dni/:dni', function(req, res) {
    Request.get("http://api.grupoyacck.com/dni/" + req.params.dni, function(error, response, body) {
        if (error) { res.send(error) }
        //console.log(body)
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})

router.get('/Ruc/:ruc', function(req, res) {
    //console.log(req.params.ruc)
    Request.get("http://api.grupoyacck.com/ruc/" + req.params.ruc + "/?force_update=1", function(error, response, body) {
        if (error) { res.send(error) }
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})

router.put('/tipo/:id', function(req, res) {
    Tipos.findById(req.params.id, function(err, tipo) {
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.save(function(err) {
            if (err) { res.send(err) }
            res.json(tipo);
        })
    })
})
router.put('/cliente/:id', function(req, res) {
    Clientes.findById(req.params.id, function(err, cliente) {
        cliente.Tipo = req.body.Tipo;
        cliente.Dni = req.body.Dni;
        cliente.Ruc = req.body.Ruc;
        cliente.Nombre = req.body.Nombre;
        cliente.AP = req.body.AP;
        cliente.AM = req.body.AM;
        cliente.Gerente = req.body.Gerente;
        cliente.Direccion = req.body.Direccion;
        cliente.Referencia = req.body.Referencia;
        cliente.Correo = req.body.Correo;
        cliente.Celular = req.body.Celular;
        cliente.Telefono = req.body.Telefono;
        cliente.Telefono1 = req.body.Telefono1;
        cliente.save(function(err) {
            if (err) { res.send(err) }
            res.json(cliente);
        })
    })
})


router.put('/acceso/:id', function(req, res) {
        Accesos.findById(req.params.id, function(err, acceso) {
            acceso.fecha2 = req.body.fecha2;
            acceso.save(function(err) {
                if (err) { res.send(err) }
                res.json(acceso);
            })
        })
    })



    //DELETE - Eliminar todos
router.delete('/tarea/:id', function(req, res) {
    Tareas.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La tarea se ha eliminado' });
    })
})

router.delete('/tipo/:id', function(req, res) {
    Tipos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el tipo se ha eliminado' })
    })
})
router.delete('/cliente/:id', function(req, res) {
    Clientes.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el cliente fue eliminado' });
    })
})



module.exports = router;