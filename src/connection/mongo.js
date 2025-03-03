import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Conexión a la base de datos principal 'ShopFem' (productos y carritos)
export const mongoConnection = async () => {
  try {
    // Conectar a la base de datos principal (ShopFem)
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'ShopFem' });
    console.log('Conectado a la base de datos ShopFem');
  } catch (error) {
    console.error("Error de conexión a MongoDB ShopFem:", error);
  }
};

// Conexión a la base de datos 'orders' para almacenar las órdenes
export const ordersConnection = async () => {
  try {
    // Crear una conexión separada para la base de datos 'orders'
    await mongoose.createConnection(process.env.MONGO_URI, { dbName: 'orders' });
    console.log('Conectado a la base de datos Orders');
  } catch (error) {
    console.error("Error de conexión a la base de datos Orders:", error);
  }
};
