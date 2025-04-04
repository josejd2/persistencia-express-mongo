import { db } from "../config/database.js";
import { ObjectId } from "mongodb";

const peliculasCollection = () => db.collection("peliculas");

export const listarPeliculas = async (req, res) => {
    const peliculas = await peliculasCollection().find().toArray();
    res.json(peliculas);
};

export const buscarPeliculaPorTitulo = async (req, res) => {
    const {titulo} = req.query;

    const pelicula = await peliculasCollection().find({
        titulo: { $regex: titulo, $options: 'i' }  
    }).toArray();

    if (!pelicula) {
        return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json(pelicula);
};

export const obtenerPeliculaPorId = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    
    const pelicula = await peliculasCollection().findOne({ _id: new ObjectId(id) });
    
    if (!pelicula) {
        return res.status(404).json({ error: "Película no encontrada" });
    }
    
    res.json(pelicula);
};

export const agregarPelicula = async (req, res) => {
    const { titulo, director, año, generos, actores } = req.body;
    if (!titulo) return res.status(400).json({ error: "Falta el título de la película" });

    await peliculasCollection().insertOne({ titulo, director, año, generos, actores });
    res.json({ mensaje: `Película "${titulo}" agregada por usuario con ID ${req.user.userId}` });
};

export const modificarPelicula = async (req, res) => {
    const { id } = req.params;
    const { titulo, director, año, generos, actores } = req.body;

    const resultado = await peliculasCollection().updateOne(
        { _id: id }, { $set: { titulo, director, año, generos, actores } }
    );

    if (!resultado.matchedCount) return res.status(404).json({ error: "Película no encontrada" });
    res.json({ mensaje: "Película actualizada con éxito" });
};

export const borrarPelicula = async (req, res) => {
    const { id } = req.params;
    const resultado = await peliculasCollection().deleteOne({ _id: id });

    if (!resultado.deletedCount) return res.status(404).json({ error: "Película no encontrada" });
    res.json({ mensaje: "Película eliminada con éxito" });
};