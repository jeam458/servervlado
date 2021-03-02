var mongoose = require('mongoose');
var TParteSchema = new mongoose.Schema({
    idDemanda: String,
    idCliente:String,
    idTipoParte: String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TParte', TParteSchema);