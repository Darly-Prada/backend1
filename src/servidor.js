import express from 'express';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import handlebars, { engine } from "express-handlebars";
import vistaRoutes from "./routes/vista.Routes.js";
import { Server } from "socket.io";
import fs from 'fs'


const app = express();

const serverHttp = app.listen(8080,() =>   console.log('Servidor por el puerto 8080'));
const webSocketServer = new Server(serverHttp);

const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');

let leerProductos = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};
let products = leerProductos();

app.engine("handlebars", engine());  
app.set("views",path.join(process.cwd(), "src", "views"));
app.set("view engine","handlebars")

app.use("/static", express.static(path.join(process.cwd(), "src", "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes); 
app.use('/api/carts', cartRoutes);  
app.use('/', vistaRoutes)


// Configuraciones de  WebSocket
webSocketServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado', socket.id);
  socket.emit('updateProducts', products); 
  
 
  socket.on('addProduct', (product) => {
    products.push(product);  
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    webSocketServer.sockets.emit('updateProducts', products);
  });

  socket.on('deleteProduct', (index) => {
    products.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    webSocketServer.sockets.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


