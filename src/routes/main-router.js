// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

//EXPORTAMOS ROUTER
module.exports = router;

// REQUERIMOS EL MAIN CONTROLLER
const mainControllers = require("../controllers/main-controllers");

// HOME
router.get("/", mainControllers.home);
router.get("/nueva", mainControllers.nuevaReserva)
router.post("/nueva", mainControllers.agregarDpto);

router.get("/detalle/:id", mainControllers.detalle)

// Nuevas rutas para la edición
router.get("/editar/:id", mainControllers.editarVista);
router.put("/editar/:id", mainControllers.editarReserva);
router.delete("/eliminar/:id", mainControllers.destroy);

// Agrega una nueva ruta para manejar las reservas por departamento
router.get("/calendario/:departamento", mainControllers.calendario);

