const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const model = {
  file: join(__dirname, "../data", "reservas.json"),

  index: () => {
    const content = readFileSync(model.file, "utf-8");
    return JSON.parse(content).reservas;
  },

  one: (id) => model.index().find((e) => e.id == id),

  obtenerDepartamento: (departamento) =>
    model.index().filter((e) => e.departamento === departamento),

  agregarNuevoDepartamento: (nuevoDepartamento) => {
    const reservas = model.index();
    const nuevoId =
      reservas.length > 0 ? reservas[reservas.length - 1].id + 1 : 1;

    const nuevaReserva = {
      id: nuevoId,
      ...nuevoDepartamento,
    };

    reservas.push(nuevaReserva);
    model.guardarReservas(reservas); // Guarda todas las reservas actualizadas

    // No necesitas volver a escribir el archivo aquí, ya que se hace en guardarReservas
  },

  // Modificada para encontrar, actualizar y guardar la reserva editada
  guardarReservas: (reservasActualizadas) => {
    const reservasOriginales = model.index();

    // Encuentra la reserva que se va a editar
    const reservaEditada = reservasActualizadas.find((reserva) =>
      reservasOriginales.some((original) => original.id === reserva.id)
    );

    if (reservaEditada) {
      // Actualiza la reserva encontrada con la nueva información
      Object.assign(
        reservaEditada,
        reservasActualizadas.find((reserva) => reserva.id === reservaEditada.id)
      );
    }

    // Filtra las reservas que no se han modificado
    const reservasFiltradas = reservasOriginales.filter(
      (original) => !reservasActualizadas.some((reserva) => reserva.id === original.id)
    );

    // Combina las reservas filtradas con las actualizadas
    const reservasCombinadas = [...reservasFiltradas, ...reservasActualizadas];

    const nuevoModelo = { reservas: reservasCombinadas };
    const nuevoContenido = JSON.stringify(nuevoModelo, null, 2);
    writeFileSync(model.file, nuevoContenido, "utf-8");
  },
};

module.exports = model;

