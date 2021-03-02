var mongoose = require('mongoose');
var AccesosSchema = new mongoose.Schema({
    CodUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    NombreUsuario: String,
    fecha: { type: Date, default: Date.now },
    fecha2: { type: Date },
    lat: Number,
    lng: Number
})
mongoose.model('Accesos', AccesosSchema)