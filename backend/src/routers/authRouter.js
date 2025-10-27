
const express = require("express");
const authRouter = express.Router();
const { signup, login, logout, checkAuth } = require("../controllers/authController");

// Routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check-auth", checkAuth);

module.exports = authRouter;
