import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  customer: String,
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, default: 'pending' }
});

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;