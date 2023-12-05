// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

// requerimos validaciones
const loginValidations = require("../middlewares/loginValidations")

// REQUERIMOS EL MAIN CONTROLLER
const authControllers = require("../controllers/auth-controllers");

// HOME
router.get("/login", authControllers.login)


//EXPORTAMOS ROUTER
module.exports = router;