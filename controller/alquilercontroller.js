const { Alquiler, Cliente, Autos } = require('../models');

//1.crear alquiler de vehiculo a un cliente
exports.realizarAlquiler = async (req, res) => {
    const { clienteId, autoId, fechaInicio, fechaFin } = req.body;
    try {
        const auto = await Autos.findByPk(autoId);
        if (auto && auto.disponibilidad === 1) {
            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                return res.json({ mensaje: "El cliente no existe" });
            }

            const alquiler = await Alquiler.create({
                clienteId,
                autoId,
                fechaInicio,
                fechaFin
            });

            await auto.update({ disponibilidad: 0 });

            res.json(alquiler);
        } else {
            res.json({ mensaje: "El auto no está disponible o no existe" });
        }
    } catch (e) {
        console.error(e); // Para ver el error en la consola
        res.json({ mensaje: "Error al registrar el alquiler", error: e.message });
    }
};


// 2. devolver el historial completo de todos los alquileres 
exports.historial = async (req, res) => {
    try {
        const alquileres = await Alquiler.findAll({
            include: [
                { model: Cliente,
                  as: 'clientes',
                  attributes: ['nombre', 'correo', 'numLic'] },
                { model: Autos,
                  as: 'autos', 
                  attributes: ['marca', 'modelo', 'imagen', 'valorAlquiler', 'anio'] } 
            ]
        });
        res.json(alquileres);
    } catch (e) {
        console.error(e); 
        res.json({ mensaje: "Error al obtener el historial de alquileres",error: e.message});
    }
};

// 3. traer alquileres realizados por 1 usuario
exports.historialPorCliente = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const alquileres = await Alquiler.findAll({
            where: { clienteId },
            include: [
                {
                    model: Autos,
                    as: 'autos',
                    attributes: ['marca', 'modelo', 'imagen', 'valorAlquiler', 'anio']
                }
            ]
        });

        res.status(200).json(alquileres);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            mensaje: "Error al obtener alquileres del cliente",
            error: e.message
        });
    }
};

// Devolver un vehiculo alquilado
exports.devolverVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const alquiler = await Alquiler.findByPk(id);
        if (!alquiler) {
            return res.status(404).json({ mensaje: "Alquiler no encontrado" });
        }

        await alquiler.update({ estado: 'devuelto' });

        await Autos.update(
            { disponibilidad: 1 },
            { where: { id: alquiler.autoId } }
        );

        res.json({ mensaje: "Vehículo devuelto correctamente" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ mensaje: "Error al devolver el vehículo", error: e.message });
    }
};
