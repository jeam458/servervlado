var path = require('path');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var multer = require('multer');
var GridFsStorage= require('multer-gridfs-storage');
var Grid= require('gridfs-stream');
Grid.mongo= mongoose.mongo;
var nodemailer1 = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    nombres: String,
    dni: String,
    tipo: String,
    fechaInscripcion: { type: Date, default: Date.now },
    celular: Number,
    picture: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then (() => {
    console.log ('MongoDB conectado ...')
  })
  .catch (err => console.log (err))
let conn= mongoose.connection;
let gfs//= new  Grid(conn.db, mongoose.mongo);
conn.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
conn.once('open', function() {
    console.log("Connected!")
    //var mongoDriver = mongoose.mongo;
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
      });
  });
/*mongoose.connect(config.MONGO_URI);
let conn= mongoose.connection;
let gfs = Grid(conn.db);
mongoose.connection.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});*/

require('./models/Tareas');
require('./models/Tipos');
require('./models/clientes');
require('./models/registros');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
/*app.use((req, res, next) => {
    //res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Origin' , 'https://pulpofront.herokuapp.com');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);
app.use('/users', users);

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        nombre:user.nombres,
        apellido:user.apellidos,
        tipo:user.tipo,
        email:user.email,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/usuarios', function(req, res, next) {
    User.find(function(err, users) {
        if (err) { return next(err) }
        res.json(users)
    })
})
app.get('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }
        user.nombres = req.body.nombres || user.nombres;
        user.apellidos = req.body.apellidos || user.apellidos;
        user.tipo = req.body.tipo || user.tipo;
        user.picture = req.body.picture || user.picture;
        user.celular = req.body.celular || user.celular;
        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
        });
    });
});


/*
 |--------------------------------------------------------------------------
 | Log in 
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(409).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(409).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
            }
            res.send({ token: createJWT(user) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
var datos = {};
app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'el correo electronico ya ha sido tomado' });
        }
        var user = new User({
            nombres: req.body.nombres,
            dni:req.body.dni,
            tipo: req.body.tipo,
            celular: req.body.celular,
            email: req.body.email,
            password: req.body.password
        });
        var usuario = { username: req.body.email, pas: req.body.password, nombre: req.body.nombres }
        user.save(function() {
            res.send({ token: createJWT(user) });
            datos = usuario;
            sendEmail(datos);
        });
    });
});

app.post('/envcorreos',function(req,res){
    //console.log(req.body[0]);
    var usuario = { username: '', pas: '', nombre: '' }
    /*for(var i=0;i<req.body.length;i++){
       usuario.username=req.body[i].CORREO;
       usuario.pas=req.body[i].PASSWORD;
       usuario.nombre=req.body[i].NOMBRES
       console.log()
       if(sendEmail(usuario)===true) continue;
       else 
       usuario={};
    }*/
    let mp = new Map();
    for(var i=0;i<req.body.length;i++){
       usuario.username=req.body[i].CORREO;
       usuario.pas=req.body[i].PASSWORD;
       usuario.nombre=req.body[i].NOMBRES
       mp.set(i,usuario);
       usuario={};
    }
    console.log(mp);
    //var array=[];
    //array=req.body;
    //console.log(array);
    new Map(mp).forEach(sendEmail)
    res.send({message:"correos enviados"})
})

/*
 |--------------------------------------------------------------------------
 | Create structure for email for signup
 |--------------------------------------------------------------------------
 */

//let testAccount = await nodemailer.createTestAccount();
//crear estructura de envio de correo
var transporter= nodemailer1.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'jeancarlos387@gmail.com',
    pass: 'yandilove387123'
  }
}))
/*var transporter = nodemailer1.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
    
    }
})*/
var message1 = function(datos) {
    //console.log(datos)-
    var message = {
        from: 'jeancarlos387@gmail.com',
        to: datos.username,
        subject: 'Bienvenido al sistema de elecciones',
        //text: 'querido'+datos.nombre,
        html:
            /*'<p class="text-center"> <img src="data:image/png;base64,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"/></P><br/><p><b>Hola, </b></p>' + '<p>' + datos.nombre + '</p>' +
            '<p class="text-center">Soy el Administrador y te doy la bienvenida al sistema de elecciones, ingresa con tus datos y realiza tu voto con responsabilidad.</p><br/>' +
            '<p class="text-center">Datos de usuario</p></br>' +
            '<p class="text-center">Nombre de Usuario: </p>' + datos.username + '</br>' +
            '<p>Contraseña: </p>' + datos.pas + '</br>' +
            '<p class="text-center text-muted">' + '<a href="https://turismoproy.herokuapp.com/#/login"></a>' + '</p>'*/
           '<p>&nbsp;</p>'+
           '<h3 style="text-align: center; color: #0;"><strong>ELECCION DEL REPRESENTANTE DE LOS JUECES ESPECIALIZADOS Y MIXTOS&nbsp;</strong></h3>'+
           '<p style="text-align: center;"><img src="https://seeklogo.com/images/P/poder-judicial-peru-logo-4159895347-seeklogo.com.png" alt="" /></p> '+
           '<p><strong>Hola, '+ datos.nombre +'&nbsp;</strong></p>'+
           '<p><strong>Bienvenido al Módulo de Elecciones, ingresa con tus datos y realiza tu voto responsable. (Este módulo solo es para realizar tu voto)</strong></p>'+
           '<p>Datos de usuario:</p>'+
           '<table class="demoTable" style="height: 47px;">'+
           '<thead>'+
           '<tr style="height: 18px;">'+
           '<td style="width: 326px; height: 18px; text-align: center;"><span style="color: #c82828;">Correo</span></td>'+
           '<td style="width: 378px; height: 18px; text-align: center;"><span style="color: #c82828;">Contrase&ntilde;a</span></td>'+
           '</tr>'+
           '</thead>'+
           '<tbody>'+
           '<tr style="height: 29px;">'+
           '<td style="width: 326px; height: 29px; text-align: center;">'+ datos.username + '</td>'+
           '<td style="width: 378px; height: 29px; text-align: center;">'+ datos.pas +'</td>'+
           '</tr>'+
           '</tbody>'+
           '</table>'+
           '<p>&nbsp;</p>'+
           '<p>Las elecciones se realizar&aacute;n el d&iacute;a viernes&nbsp; 18 de diciembre del 2020 a horas 3:30 PM.</p>'+
           '<p>Pasos para votar:</p>'+
           '<ol>'+
           '<li>Ajustar click derecho sobre el link "Link de votación", abrir en nueva pestaña:&nbsp;&nbsp;<a target="_blank" rel="nofollow noopener" href="https://eleccionesmgcusco.herokuapp.com">https://eleccionesmgcusco.herokuapp.com</a>&nbsp;</li>'+
           '<li>Permitir que la aplicaci&oacute;n rastree tu ubicaci&oacute;n.</li>'+
           '<li>Ingresar con sus correo y contrase&ntilde;</li>'+
           '<li>Elegir la opci&oacute;n.</li>'
    }
    return message;
}
var sendEmail = function(datos) {
    //console.log("mostrando datos", datos)
    transporter.sendMail(message1(datos), function(err, info) {
        if (err) {
            console.log(err);
            sendEmail(datos);
            //return false;
            //res.send(500, err.message);
        } else {
            console.log('registro enviado');
            //res.send({message:"enviando"})
            //return true;
            //res.status(200).json(req.body)
        }
    })
}





/*
 |--------------------------------------------------------------------------
 | upload crud
 |--------------------------------------------------------------------------
 */

const storage = new GridFsStorage({
    url: config.MONGO_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
          };
          resolve(fileInfo);
        });
      });
    },
  });

let upload = multer({
    storage
})

// Route for file upload
app.post('/uploadI', (req, res) => {
    console.log("subiendo archivo");
    upload(req,res, (err) => {
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var file = {id:res.req.file.id, originalname: res.req.file.originalname,filename:res.req.file.grid.filename,contentType:res.req.file.grid.contentType};
        res.json({error_code:0, error_desc: null, file_uploaded: true,file:file});
    });
});

// Downloading a single file
app.get('/file/:filename', (req, res) => {
    gfs.collection('ctFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // create read stream
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType)
        // Return response
        return readstream.pipe(res);
    });
});

// Route for getting all the files
app.get('/files', (req, res) => {
    let filesData = [];
    let count = 0;
    gfs.collection('ctFiles'); // set the collection to look up into

    gfs.files.find({}).toArray((err, files) => {
        // Error checking
        if(!files || files.length === 0){
            return res.json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // Loop through all the files and fetch the necessary information
        //console.log(files)
        files.forEach((file) => {
            filesData[count++] = {
                originalname: file.metadata.originalname,
                filename: file.filename,
                contentType: file.contentType,
                _id:file._id
            }
        });
        res.json(filesData);
    });
});


app.delete('/files/:id', (req, res) => {
    console.log(req.params.id);
    //var db = mongoose.connection.db;
    //var mongoDriver = mongoose.mongo;
    //var gfs = new Grid(db, mongoDriver);
    gfs.remove({ _id: req.params.id,root:'ctFiles'}, (err, gridStore) => {
        //console.log(gridStore)
      if (err) {
        return res.status(404).json({ err: err });
      }
      res.json({message:'elemento eliminado'})
      //res.redirect('/');
    });
  });

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
    console.log('Express server escuchando en el puerto ' + app.get('port'));
});