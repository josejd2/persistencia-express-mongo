import express from "express";
import { register, login, listarUsuarios } from "../controllers/usuarios.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
// ryta, middleware -si los hay-, controlador
router.post("/register", register);
router.post("/login", login);
router.get("/", verificarToken, verificarAdmin, listarUsuarios);

export default router;