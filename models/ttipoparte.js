var mongoose = require('mongoose');
var TTipoParteSchema = new mongoose.Schema({
    nombre: String,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TTipoParte', TTipoParteSchema);