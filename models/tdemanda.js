var mongoose = require('mongoose');
var TdemandaSchema = new mongoose.Schema({
    idExpediente:String,
    idEspecialidad: String,
    idMateria:String,
    idCliente:String,
    dFechaCreacion:{ type: Date, default: Date.now },
    cNumeroDemanda:String
});
mongoose.model('TDemanda', TdemandaSchema);