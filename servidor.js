import express from 'express';
import path from 'path';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";  // Nueva ruta para órdenes
import handlebars, { engine } from "express-handlebars";
import vistaRoutes from "./src/routes/vistaRoutes.js";
import { orderModel } from './src/models/orderModel.js';
import { Server } from "socket.io";
import handleWebSocket from "./src/connection/webSocket.js";

import { mongoConnection, ordersConnection } from './src/connection/mongo.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const serverHttp = app.listen(8080, () => {
  console.log('Servidor por el puerto 8080');
});
const webSocketServer = new Server(serverHttp);

// Configuración de Handlebars
app.engine("handlebars", engine());  
app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "handlebars");

// Middlewares
app.use("/static", express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
//app.get('/', (req, res) => {res.send('¡Bienvenido a raíz principal!');});
app.use('/api/products', productRoutes); 
app.use('/api/carts', cartRoutes);  
app.use('/api/orders', orderRoutes);   
app.use('/', vistaRoutes);  

// Conexión a MongoDB y WebSocket
mongoConnection();  
ordersConnection(); 

handleWebSocket(webSocketServer);


