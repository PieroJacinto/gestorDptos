//REQUERIMOS DOTENV PARA TENER VARIABLES DE ENTORNO
require("dotenv").config();

//REQUERIMOPS EXPRESS
const express = require("express");

//REQUERIMOS SESSION
const session = require('cookie-session');

//EJECUTAMOS EXPRESS
const app = express();

// REQUERIMOS PATH Y STATIC PARA LAS RUTAS
const { join } = require("path");
const { static } = require("express");

//SETEAMOS APP PARA Q MIRE DIRECTAMENTE LAS VISTAS EN VIEWS
app.set("view engine", "ejs");
app.set("views", join(__dirname, "./views"));

// USAMOS STATIC Y JOIN PARA QUE TODO LO QUE AGREGEMOS AL HTML SE REDIRIJA A PUBLIC AUTOMATICAMENTE, Y ASI ACORTAR LAS RUTAS
app.use(static(join(__dirname, "../public")));

// configuramos express para recibir y parsear peticiones HTTP
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// EJECUTAMOS SESSION
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',       
}));

//REQUERIMOS EL ROUTEADOR PRINCIPAL
const mainRouter = require("./routes/main-router");

// MONTAMOS MAIN ROUTER
app.use(mainRouter);

//EXPORTAMOS APP
module.exports = app