var mongoose = require('mongoose');
var TareasSchema = new mongoose.Schema({
    nombre: String,
    prioridad: Number,
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('Tareas', TareasSchema);