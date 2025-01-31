import express from 'express';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from "./routes/cartRoutes.js"


const app = express();

app.use("/static", express.static(path.join(process.cwd(), "src", "public")))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRoutes); 
app.use('/api/carts', cartRoutes);  

app.listen(8080, () => {
  console.log('Servidor por el puerto 8080');
});
