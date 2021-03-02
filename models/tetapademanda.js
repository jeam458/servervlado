var mongoose = require('mongoose');
var TEtapaDemandaSchema = new mongoose.Schema({
    idDemanda: String,
    idTipoEtapa: String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TEtapaDemanda', TEtapaDemandaSchema);