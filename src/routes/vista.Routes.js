import { Router } from "express";
import path from "path";
import fs from "fs"; 


const route = Router();

const leerProductos = () => {
  const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
  if (!fs.existsSync(filePath)) {
    console.error(`El archivo ${filePath} no existe`);
    return []; 
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};
route.get("/", (req, res) => {
  const productos = leerProductos(); 
  res.render("home", { products: productos });
});

export default route; 
