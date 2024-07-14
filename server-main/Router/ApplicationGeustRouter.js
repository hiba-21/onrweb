const express = require("express");
const ApplicationRouter = express.Router();

const {
    authenticateUser,
} = require("../Middleware/UserAuthenticationMiddleware");

// Controllers
const ApplicationController = require("../Controller/ApplicationController");

// Middlewares
const { checkInput } = require("../Validation/ApplicationDataRules");
const { checkGuestApplications } = require("../middleware/GuestMiddleware");
const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Utilisez la mémoire pour stocker temporairement le fichier

// Route pour appliquer en tant que guest
ApplicationRouter.post("/applyGeust", upload.single('resume'), ApplicationController.applyForGuest);
/*ApplicationRouter.post(
    "/applyGeust",
    inputValidationMiddleware,
    checkGuestApplications, // Middleware pour vérifier les applications des invités
    ApplicationController.applyForGuest
);
*/

module.exports = ApplicationRouter;
