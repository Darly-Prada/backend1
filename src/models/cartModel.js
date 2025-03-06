import { model, Schema } from 'mongoose';

const cartCollection = "Carrito"; 

const cartSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Products Shop",   // Asegúrate de que "Products Shop" sea el nombre correcto del modelo de productos
        required: true
      },
      quantity: { 
        type: Number,
        required: true,
        default: 0
      },
      price: {   // Asegúrate de que se guarda el precio
        type: Number,
      },
      description: String
    }
  ],
  total: {
    type: Number,
    default: 0
  }
});

// Calcular el total del carrito
cartSchema.methods.calculateTotal = function() {
  this.total = this.products.reduce((total, product) => {
    const productPrice = product.price || 0;
    const productQuantity = product.quantity || 0;
    console.log(`Producto: ${product.productId}, Price: ${productPrice}, Quantity: ${productQuantity}`);
    return total + (productPrice * productQuantity);
  }, 0);

  return this.total;
};

export const cartModel = model(cartCollection, cartSchema); 










   
