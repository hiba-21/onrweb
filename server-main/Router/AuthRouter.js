const express = require("express");
const AuthRouter = express.Router(); // create a router

const {
    authenticateUser,authenticate
} = require("./../Middleware/UserAuthenticationMiddleware");

// Controllers
const UserController = require("../Controller/UserController");

const {
    checkRegisterInput,
    checkLoginInput,
    checkForgotPasswordInput,
    checkRegisterGuestInput,
} = require("../Validation/UserDataRules");

const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");
const auth = require('../Middleware/auth')

// Authentication routes
AuthRouter.post("/logout", authenticateUser, UserController.logOut);
AuthRouter.get("/me", authenticateUser, UserController.getMe);

AuthRouter.post(
    "/register",
    checkRegisterInput,
    inputValidationMiddleware,
    UserController.addUser
);


/*AuthRouter.post(
    "/addGuest",
    
    inputValidationMiddleware,
    upload.single('resume'),
    UserController.addGuestUser
);*/
AuthRouter.post("/activation", UserController.activateEmail);
AuthRouter.post(
    "/login",
    checkLoginInput,
    inputValidationMiddleware,
    UserController.loginUser
);

AuthRouter.post("/forgot", checkForgotPasswordInput,UserController.forgotPassword);
AuthRouter.post("/reset", auth ,UserController.resetPassword);


/* Social Login*/
AuthRouter.post("/google_login", UserController.googleLogin);

module.exports = AuthRouter;
