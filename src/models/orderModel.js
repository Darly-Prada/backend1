import { model, Schema } from 'mongoose';
import mongoosePaginatev2 from "mongoose-paginate-v2";

const orderCollection ="Ordenes"

const orderSchema = new  Schema({
  precio:Number, 
  cantidad:Number,
  talle: {
    type:String,
    enum:["s", "m", "l", "xl"],
    default: "m"
  },
  descripcion:String
})

orderSchema.plugin(mongoosePaginatev2)

export const orderModel = model(orderCollection, orderSchema);