const {
  index,
  one,
  obtenerDepartamento,
  agregarNuevoDepartamento,
  guardarReservas,
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
    const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ''}`);
    const fechaCheckOutObj = new Date(`${fechaCheckOut} ${horaCheckOut || ''}`);

    if (fechaCheckOutObj <= fechaCheckInObj) {
      // Manejar el caso en que la fecha de Check-Out es anterior o igual a la de Check-In
      res.status(400).send("La fecha de Check-Out debe ser posterior a la de Check-In");
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
    const reserva = one(reservaId);

    if (!reserva) {
      // Manejar el caso en que la reserva no se encuentre
      res.status(404).send("Reserva no encontrada");
      return;
    }

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

    // Realiza las actualizaciones en la reserva
    reserva.nombre = nombre;
    reserva.telefono = telefono;
    reserva.departamento = departamento;
    reserva.fechaCheckIn = fechaCheckIn;
    reserva.horaCheckIn = horaCheckIn;
    reserva.fechaCheckOut = fechaCheckOut;
    reserva.horaCheckOut = horaCheckOut;
    reserva.cantidadHuespedes = parseInt(cantidadHuespedes);
    reserva.moneda = moneda;
    reserva.precioPorDia = parseFloat(precioPorDia);
    reserva.senia = senia !== "" ? parseInt(senia) : 0;

    // Calcula la cantidad de días redondeando siempre hacia arriba
    const fechaCheckInObj = new Date(`${fechaCheckIn} ${horaCheckIn || ''}`);
    const fechaCheckOutObj = new Date(`${fechaCheckOut} ${horaCheckOut || ''}`);
    const diffEnMilisegundos = fechaCheckOutObj - fechaCheckInObj;
    const cantidadDias = Math.ceil(diffEnMilisegundos / (1000 * 60 * 60 * 24));

    // Calcula el precio total antes de aplicar la señal
    const precioTotal = cantidadDias * parseFloat(precioPorDia);

    // Calcula el monto de la seña pagada por los huéspedes
    const seniaPagada = senia !== "" ? parseInt(senia) : 0;

    // Actualiza los campos adicionales
    reserva.total = precioTotal;
    reserva.restaPagar = precioTotal - seniaPagada;
    reserva.cantidadDias = cantidadDias;

    // Guarda la reserva actualizada
    guardarReservas([reserva]);

    // Redirige después de editar la reserva
    res.redirect("/");
  },
  
  eliminarReserva: async (req, res) => {
    const reservaId = parseInt(req.params.id);
    const reserva = one(reservaId);

    if (!reserva) {
      // Manejar el caso en que la reserva no se encuentre
      res.status(404).send("Reserva no encontrada");
      return;
    }

    // Elimina la reserva por ID
    eliminarReservaPorId(reservaId);

    // Redirige después de eliminar la reserva
    res.redirect("/");
  },
};
