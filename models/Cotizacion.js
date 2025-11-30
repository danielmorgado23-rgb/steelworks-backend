// =======================================
//  MODELO DE COTIZACIÓN - MONGOOSE
// =======================================

// Se importa mongoose, que permite crear esquemas y modelos para MongoDB
const mongoose = require('mongoose');

// Se define un nuevo esquema (estructura) para las cotizaciones.
// Aquí se especifica qué campos tendrá cada documento y sus tipos.
const CotizacionSchema = new mongoose.Schema({
    nombre: String,       // Nombre del cliente que solicita la cotización
    telefono: String,     // Teléfono de contacto del cliente
    descripcion: String,  // Descripción general del trabajo solicitado
    materiales: String,   // Lista o texto de materiales necesarios para el proyecto
    costo: Number,        // Costo total estimado del trabajo
    fecha: Date,          // Fecha en la que se guarda la cotización
    estado: String        // Estado de la cotización (ej: pendiente, aceptada, cancelada)
});

// Se exporta el modelo "Cotizacion", basado en el esquema anterior.
// Esto permite usar este modelo en cualquier parte del backend para guardar o consultar cotizaciones.
module.exports = mongoose.model('Cotizacion', CotizacionSchema);




