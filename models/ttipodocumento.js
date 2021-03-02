var mongoose = require('mongoose');
var TTipoDocumentoSchema = new mongoose.Schema({
    nombre: String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TTipoDocumento', TTipoDocumentoSchema);