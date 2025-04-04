import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarDB } from "./config/database.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import peliculasRoutes from "./routes/peliculas.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

conectarDB();

app.use("/usuarios", usuariosRoutes);
app.use("/peliculas", peliculasRoutes);

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));