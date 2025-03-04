import { model, Schema } from 'mongoose';

const cartCollection = "Carrito"; 

const cartSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',  // Asegúrate de que 'Product' exista en tu base de datos
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      precio: Number,   
      descripcion: String   
    }
  ],
  total: {
    type: Number,
    default: 0
  }
});

// Método para calcular el total del carrito
cartSchema.methods.calculateTotal = function() {
  this.total = this.products.reduce((total, product) => {
    return total + (product.precio * product.quantity);
  }, 0);
  return this.total;
};

export const cartModel = model(cartCollection, cartSchema);



   
