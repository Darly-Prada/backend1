import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnection = async () => {
  try {
    // Conectar a la base de datos principal (ShopFem)
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'ShopFem' });
    console.log('Conectado a la base de Productos');

  } catch (error) {
    console.error("Error de conexión a MongoDB ShopFem:", error);
  }
};

// Conexión a la base de datos 'orders' para almacenar las órdenes
export const ordersConnection = async () => {

  try{
      await mongoose.connect(process.env.MONGO_URI, { dbName: 'ordenes' });
    console.log('Conectado a la base de datos Ordenes');
  } catch (error) {
    console.error("Error de conexión a las Ordenes:", error);
  }
};
