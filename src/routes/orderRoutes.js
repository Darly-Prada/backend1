import express from 'express';
import { orderModel } from '../models/orderModel.js';

const router = express.Router();

// Ruta para obtener todas las órdenes (GET)
router.get("/", (req, res) => {
    orderModel.find()
        .then((respuesta) => {
            res.json({ respuesta });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al obtener las órdenes' });
        });
});

// Ruta para crear nuevas órdenes (POST)
router.post("/", (req, res) => {
    orderModel.insertMany([
        {
            talle: "m", 
            cantidad: 6,
            precio: 2500,
            descripcion: "Abrigo light"
        },
        {
            talle: "s", 
            cantidad: 4,
            precio: 2500,
            descripcion: "Abrigo light"
        },
        {
            talle: "m", 
            cantidad: 2,
            precio: 2500,
            descripcion: "Pantalón"
        },
        {
            talle: "l", 
            cantidad: 4,
            precio: 3500,
            descripcion: "Chaqueta"
        },
        {
            talle: "xl", 
            cantidad: 6,
            precio: 3800,
            descripcion: "Camisa"
        },
        {
            talle: "m", 
            cantidad: 4,
            precio: 2500,
            descripcion: "Vestido"
        }
    ])
    .then((respuesta) => {
        res.json({ respuesta });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al crear las órdenes' });
    });
});

export default router;

