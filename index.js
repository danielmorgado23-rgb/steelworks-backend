// ==============================
//  SERVIDOR DE HERRERÍA JIREH
// ==============================

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ==============================
//  MIDDLEWARES
// ==============================

app.use(cors());
app.use(express.json()); // MEJOR QUE body-parser
app.use(express.static(path.join(__dirname, 'public')));

// ==============================
//  CONEXIÓN A MONGODB
// ==============================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error MongoDB:', err));

// ==============================
//  MODELOS
// ==============================

const Cotizacion = require('./models/Cotizacion');
const Admin = require('./models/Admin');

// ==============================
//  RUTAS PÚBLICAS
// ==============================

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Guardar cotización
app.post('/api/cotizacion', async (req, res) => {
  try {
    const nuevaCotizacion = new Cotizacion({
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      descripcion: req.body.descripcion,
      materiales: req.body.materiales,
      costo: req.body.costo,
      fecha: new Date(),
      estado: "pendiente"
    });

    await nuevaCotizacion.save();
    res.status(201).json({ message: 'Cotización guardada correctamente' });

  } catch (error) {
    console.error('Error al guardar:', error);
    res.status(500).json({ message: 'Error al guardar cotización' });
  }
});

// ==============================
//  RUTAS ADMIN API
// ==============================

// Ver todas las cotizaciones
app.get('/api/cotizaciones', async (req, res) => {
  const cotizaciones = await Cotizacion.find().sort({ fecha: -1 });
  res.json(cotizaciones);
});

// Cambiar estado
app.put('/api/cotizacion/:id', async (req, res) => {
  try {
    await Cotizacion.findByIdAndUpdate(req.params.id, {
      estado: req.body.estado
    });

    res.json({ message: "Estado actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar" });
  }
});

// Editar cotización completa
app.put('/api/cotizacion-editar/:id', async (req, res) => {
  try {
    await Cotizacion.findByIdAndUpdate(req.params.id, {
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      descripcion: req.body.descripcion,
      materiales: req.body.materiales
    });

    res.json({ message: "Cotización actualizada" });
  } catch (error) {
    console.error("Error al editar:", error);
    res.status(500).json({ message: "Error al editar" });
  }
});

// Eliminar cotización
app.delete('/api/cotizacion/:id', async (req, res) => {
  try {
    await Cotizacion.findByIdAndDelete(req.params.id);
    res.json({ message: "Cotización eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar" });
  }
});

// ==============================
//  ADMIN + LOGIN
// ==============================

// Crear admin UNA SOLA VEZ
app.get('/crear-admin', async (req, res) => {
  try {
    const existe = await Admin.findOne({ usuario: "admin" });
    if (existe) return res.send("El admin ya existe");

    const nuevoAdmin = new Admin({
      usuario: "admin",
      password: "12345"
    });

    await nuevoAdmin.save();
    res.send("Admin creado correctamente");

  } catch (error) {
    console.error("Error al crear admin:", error);
    res.status(500).send("Error al crear admin");
  }
});

//Login admin
app.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const admin = await Admin.findOne({ usuario, password });

    if (!admin) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.json({ message: "Login correcto" });

  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: "Error en login" });
  }
});

// ==============================
//  PÁGINAS ADMIN
// ==============================

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ==============================
//  SERVIDOR
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});






