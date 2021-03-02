var mongoose = require('mongoose');
var TTipoEtapaSchema = new mongoose.Schema({
    nombre: String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TTipoEtapa', TTipoEtapaSchema);