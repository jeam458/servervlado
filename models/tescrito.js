var mongoose = require('mongoose');
var TEscritoSchema = new mongoose.Schema({
    idDemanda: String,
    idTipoDocumento: String,
    idUsuario:String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TEscrito', TEscritoSchema);