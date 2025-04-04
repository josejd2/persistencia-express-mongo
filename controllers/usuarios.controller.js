import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";

const SECRET_KEY = process.env.JWT_SECRET || "secreto123";
const usuariosCollection = () => db.collection("usuarios");

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

export const register = async (req, res) => {
    const { nombre, email, password } = req.body;
    // validamos que el email del usuario no existe
    const existingUser = await usuariosCollection().findOne({ email });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const newUser = {
        nombre,
        email,
        passwordHash: hashPassword(password),
        rol: "usuario",
        creadoEn: new Date().toISOString(),
        esActivo: true
    };
    await usuariosCollection().insertOne(newUser);
    res.json({ mensaje: "Usuario registrado con éxito" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    // comprobamos las credenciales del usuario
    const user = await usuariosCollection().findOne(
        { email, passwordHash: hashPassword(password) }
    );
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
    // si las credenciales son ok, le facilitamos un token
    const token = jwt.sign(
        { userId: user._id, rol: user.rol }, SECRET_KEY, { expiresIn: "6h" }
    );
    res.json({ mensaje: "Usuario logueado con éxito", token });
};

export const listarUsuarios = async (req, res) => {
    const usuarios = await usuariosCollection().find({},
        {
            projection: {
                _id: 0,
                nombre: 1,
                passwordHash: 1,
                email: 1,
                rol: 1,
                creadoEn: 1,
                esActivo: 1
            }
        }
    ).toArray();
    res.json(usuarios);
};