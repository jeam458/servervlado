var mongoose = require('mongoose');

var ClientesSchema = new mongoose.Schema({
    tipo: Number,
    Dni: Number,
    Ruc: Number,
    Nombre: String,
    AP: String,
    AM: String,
    Gerente: String,
    Direccion: String,
    UbicacionGPS:{lat:String,lng:String},
    Referencia: String,
    Correo: String,
    Celular: Number,
    Telefono: Number,
    Telefono1: Number,
    Imagen: String,
    fecha: { type: Date, default: Date.now }
});

mongoose.model('Clientes', ClientesSchema);