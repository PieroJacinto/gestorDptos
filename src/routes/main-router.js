// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

// express validator
const { body } = require("express-validator");
const validations = [
    body("nombre")
        .notEmpty()
        .withMessage("Debes completar tu nombre")
        .bail()
        .isLength({ min: 2 })
        .withMessage("El nombre debe tener al menos dos caracteres"),
    body("telefono")
        .notEmpty()
        .withMessage("Debes completar tu email")
        .isEmail()
        .withMessage("Debes escribir un formato de correo válido"),
    body("departamento")
        .notEmpty()
        .withMessage("Debes seleccionar un departamento")
        .isLength({ min: 1 })
        .withMessage("El departamento no puede ser un string vacío"),
    body("fechaCheckIn")
        .notEmpty()
        .withMessage("Debes proporcionar una fecha de check-in"),
    body("horaCheckIn"),
    body("fechaCheckOut")
        .notEmpty()
        .withMessage("Debes proporcionar una fecha de check-out"),
    body("horaCheckOut"),
    body("cantidadHuespedes")
        .notEmpty()
        .withMessage("Debes proporcionar una cantidad de huespedes"),
    body("moneda")
        .notEmpty()
        .withMessage("Debes proporcionar un tipo de moneda")
        .isLength({ min: 1 })
        .withMessage("La moneda no puede ser un string vacío"),
    body("precioPorDia")
        .notEmpty()
        .withMessage("Debes proporcionar un precio por dia"),
    body("senia")       
]


// REQUERIMOS EL MAIN CONTROLLER
const mainControllers = require("../controllers/main-controllers");

// HOME
router.get("/", mainControllers.home);
router.get("/nueva", mainControllers.nuevaReserva)
router.post("/nueva", validations, mainControllers.agregarDpto);

router.get("/detalle/:id", mainControllers.detalle)

// Nuevas rutas para la edición
router.get("/editar/:id", mainControllers.editarVista);
router.put("/editar/:id", mainControllers.editarReserva);
router.delete("/eliminar/:id", mainControllers.destroy);

// Agrega una nueva ruta para manejar las reservas por departamento
router.get("/calendario/:departamento", mainControllers.calendario);

// Agrega una nueva ruta para manejar la facturación mensual por departamento
router.get("/facturacion/:departamento", mainControllers.facturacion);


//EXPORTAMOS ROUTER
module.exports = router;