var mongoose = require('mongoose');
var TMateriaSchema = new mongoose.Schema({
    nombre: String,
    description: String,
    tangs:[],
    fecha: { type: Date, default: Date.now },
    responsable: String
});
mongoose.model('TMateria', TMateriaSchema);