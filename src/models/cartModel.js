import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  total: {
    type: Number,
    default: 0
  }
});

cartSchema.methods.calculateTotal = function() {
  this.total = this.products.reduce((total, product) => {
    return total + (product.productId.price * product.quantity);
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
