const { Autos } = require('../models');

//1. obtener todos los autos
exports.obtenerTodosLosAutos = async (req, res) => {
  try {
    const autos = await Autos.findAll(); // SIN filtro
    res.json(autos);
  } catch (e) {
    console.error("Error al obtener autos:", e);
    res.status(500).json({ mensaje: "Error al obtener autos" });
  }
};

//2. traer unicamente autos disponibles ==1
exports.autosDisponibles = async (req, res) => {
    try {
        const autos = await Autos.findAll({ 
            where: { disponibilidad: 1 } 
        });
        res.json(autos);
    } catch (e) {
        res.json({ mensaje: "error" });
    } 
};

//3. guardar un nuevo auto
exports.registrarAuto = async (req, res) => {
    //console.log("Datos recibidos en el backend:", req.body); // Log para verificar los datos  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    const { marca, modelo, imagen, valorAlquiler, anio, disponibilidad } = req.body; 
    try {
        // Si 'disponibilidad' está presente en el cuerpo, úsalo, de lo contrario, omítelo
        const autoData = { marca, modelo, imagen, valorAlquiler, anio };
        if (disponibilidad !== undefined) {
            autoData.disponibilidad = disponibilidad;
        }

        const nuevoAuto = await Autos.create(autoData);
        res.json(nuevoAuto);

    } catch (e) {
        console.error('Error al crear el auto:', e); 
        res.status(500).json({ mensaje: "Error al crear el auto", error: e.message });
    }
};

//4. Cambiar disponibilidad de un auto por ID
exports.cambiarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponibilidad } = req.body; // 1 = disponible, 0 = no disponible

        const auto = await Autos.findByPk(id);

        if (!auto) {
            return res.status(404).json({ mensaje: "Auto no encontrado" });
        }

        await auto.update({ disponibilidad });

        res.json({ 
            mensaje: "Disponibilidad actualizada correctamente",
            auto 
        });
    } catch (e) {
        console.error(e);
        res.json({ mensaje: "Error al actualizar disponibilidad", error: e.message });
    }
};