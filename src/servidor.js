
import express from 'express';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
// import cartRoutes from './routes/cartRoutes.js'; 

const app = express();

// Middleware para parsear el JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productRoutes); 
// app.use('/api/carts', cartRoutes);  

app.listen(8080, () => {
  console.log('Servidor por el puerto 8080');
});

/*  
import express from 'express';
import path from 'path';


import productRoutes from './src/routes/productRoutes.js';


  
const app = express()


app.use("/static", express.static(path.join(process.cwd(), "src", "public")))
app.use(express.json()); 
app.use(express.urlencoded({extended: true}))

// Rutas
app.use('/api/products', productRoutes); // Ruta de productos
app.use('/api/carts', cartRoutes);        // Ruta de carrito

// Iniciar el servidorapp.use(express.json()); 

app.listen (8080, ()=>{
    console.log("Servidor por el puerto 8080")
})
*/