var mongoose = require('mongoose');
var TipoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    fecha: { type: Date, default: Date.now },
});
mongoose.model('Tipos', TipoSchema);