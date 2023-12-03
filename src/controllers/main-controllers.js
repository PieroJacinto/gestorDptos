const fs = require("fs");
const path = require("path");
const {
  index,
  one,
  obtenerDepartamento,
  obtenerReserva,
  agregarNuevoDepartamento,  
} = require("../models/reservas.model");
module.exports = {
  home: async (req, res) => {
    res.render("home");
  },
  nuevaReserva: async (req, res) => {
    res.render("nuevaReserva");
  },
  agregarDpto: async (req, res) => {
    const {
      nombre,
      telefono,
      departamento,
      fechaCheckIn,
      horaCheckIn,
      fechaCheckOut,
      horaCheckOut,
      cantidadHuespedes,
      moneda,
      precioPorDia,
      senia,
    } = req.body;

    // Validación de fechas
    const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ""}`);
    const fechaCheckOutObj = new Date(`${fechaCheckOut} ${horaCheckOut || ""}`);

    if (fechaCheckOutObj <= fechaCheckInObj) {
      // Manejar el caso en que la fecha de Check-Out es anterior o igual a la de Check-In
      res
        .status(400)
        .send("La fecha de Check-Out debe ser posterior a la de Check-In");
      return;
    }

    // Calcula la cantidad de días redondeando siempre hacia arriba
    const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
    const cantidadDias = Math.ceil(diffEnMilisegundos / (1000 * 60 * 60 * 24));

    // Calcula el precio total antes de aplicar la señal
    const precioTotal = cantidadDias * parseFloat(precioPorDia);

    // Calcula el monto de la seña pagada por los huéspedes
    const seniaPagada = senia !== "" ? parseInt(senia) : 0;

    // Crea un objeto con los datos del formulario
    const nuevoDepartamento = {
      nombre,
      telefono,
      departamento,
      fechaCheckIn,
      horaCheckIn,
      fechaCheckOut,
      horaCheckOut,
      cantidadHuespedes: parseInt(cantidadHuespedes),
      moneda,
      precioPorDia: parseFloat(precioPorDia),
      senia: seniaPagada,
      total: precioTotal,
      restaPagar: precioTotal - seniaPagada,
      fechaReserva: new Date().toISOString().split("T")[0],
      cantidadDias,
    };

    // Agrega el nuevo departamento al modelo
    agregarNuevoDepartamento(nuevoDepartamento);

    // Redirige después de agregar un nuevo departamento
    res.redirect("/");
  },
  editarVista: async (req, res) => {
    const reservaId = parseInt(req.params.id);
    const reserva = one(reservaId);

    if (!reserva) {
      // Manejar el caso en que la reserva no se encuentre
      res.status(404).send("Reserva no encontrada");
      return;
    }

    res.render("editarReserva", { reserva });
  },

  editarReserva: async (req, res) => {
    const reservaId = parseInt(req.params.id);

    try {
      // Obtén todas las reservas
      const reservasAll = index();
      // Encuentra la reserva específica por ID
      const reservaExistente = reservasAll.find(
        (reserva) => reserva.id === reservaId
      );
      if (!reservaExistente) {
        res.status(404).send("Reserva no encontrada");
        return;
      }
      // Extrae los datos actualizados del cuerpo de la solicitud
      const {
        nombre,
        telefono,
        departamento,
        fechaCheckIn,
        horaCheckIn,
        fechaCheckOut,
        horaCheckOut,
        cantidadHuespedes,
        moneda,
        precioPorDia,
        senia,
      } = req.body;
      // Validación de fechas
      const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ""}`);
      const fechaCheckOutObj = new Date(
        `${fechaCheckOut} ${horaCheckOut || ""}`
      );
      if (fechaCheckOutObj <= fechaCheckInObj) {
        // Manejar el caso en que la fecha de Check-Out es anterior o igual a la de Check-In
        res
          .status(400)
          .send("La fecha de Check-Out debe ser posterior a la de Check-In");
        return;
      }
      // Calcula la cantidad de días redondeando siempre hacia arriba
      const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
      const cantidadDias = Math.ceil(
        diffEnMilisegundos / (1000 * 60 * 60 * 24)
      );
      // Calcula el precio total antes de aplicar la señal
      const precioTotal = cantidadDias * parseFloat(precioPorDia);
      // Calcula el monto de la seña pagada por los huéspedes
      const seniaPagada = senia !== "" ? parseInt(senia) : 0;
      // Actualiza la reserva existente con los nuevos datos
      Object.assign(reservaExistente, {
        nombre,
        telefono,
        departamento,
        fechaCheckIn,
        horaCheckIn,
        fechaCheckOut,
        horaCheckOut,
        cantidadHuespedes: parseInt(cantidadHuespedes),
        moneda,
        precioPorDia: parseFloat(precioPorDia),
        senia: seniaPagada,
        total: precioTotal,
        restaPagar: precioTotal - seniaPagada,
        fechaReserva: new Date().toISOString().split("T")[0],
        cantidadDias,
      });
      // Guarda la reserva actualizada
      const productoActualizado = JSON.stringify(reservasAll, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../data/reservas.json"),
        productoActualizado
      );

      res.redirect(`/detalle/${reservaId}`);
    } catch (error) {
      console.error("Error al editar la reserva:", error.message);
      res.status(500).send("Error interno al editar la reserva");
    }
  },
  calendario: async (req, res) => {
    const departamentoSeleccionado = req.params.departamento;
    const reservas = await index(); // Ajusta esto según tu aplicación

    const eventosDepartamento = reservas
      .filter((reserva) => reserva.departamento === departamentoSeleccionado)
      .map((reserva) => ({
        title: reserva.nombre,
        start: reserva.fechaCheckIn,
        end: reserva.fechaCheckOut,
        id: reserva.id,
      }));      
    res.render("calendario", { eventosDepartamento, departamentoSeleccionado });
  },

  detalle: async (req, res) => {
    id = parseInt(req.params.id);
    reserva = obtenerReserva(id);
    res.render("detalleReserva", { reserva });
  },
  destroy: (req, res) => {
    console.log("estoy en destroy");
    const reservas = index();
    const id = req.params.id;
    const reservasRestantes = reservas.filter((reserva) => reserva.id != id);
    const reservasGuardar = JSON.stringify(reservasRestantes, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/reservas.json"),
      reservasGuardar
    );
    res.redirect("/");
  },
};
