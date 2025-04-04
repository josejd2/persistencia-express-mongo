import express from "express";
import { listarPeliculas, agregarPelicula, obtenerPeliculaPorId , buscarPeliculaPorTitulo, modificarPelicula, borrarPelicula } from "../controllers/peliculas.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", listarPeliculas);
router.get("/search", buscarPeliculaPorTitulo);
router.get("/:id", obtenerPeliculaPorId);
router.post("/", verificarToken, agregarPelicula);
router.put("/:id", verificarToken, verificarAdmin, modificarPelicula);
router.delete("/:id", verificarToken, verificarAdmin, borrarPelicula);

export default router;