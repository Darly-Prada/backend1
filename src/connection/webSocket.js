import { productModel } from '../models/productModel.js';

let cart = { products: [] };

const handleWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir todos los productos cuando un cliente se conecta
    productModel.find().then((products) => {
      socket.emit('updateProducts', products);
    }).catch(err => console.log('Error al obtener productos', err));

    // Escuchar evento para agregar al carrito
    socket.on('addToCart', (productId) => {
      productModel.findById(productId).then(product => {
        const existingProduct = cart.products.find(p => p.productId._id.toString() === productId);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ productId: product, quantity: 1 });
        }
        io.emit('cartUpdated', cart);  // Emitir actualización de carrito
      }).catch(err => console.log('Error al agregar producto al carrito', err));
    });

    // Escuchar evento para eliminar un producto específico del carrito
    socket.on('removeFromCart', (productId) => {
      console.log('Producto a eliminar del carrito:', productId);
      // Eliminar el producto del carrito
      cart.products = cart.products.filter(p => p.productId._id.toString() !== productId);
      io.emit('cartUpdated', cart);  // Emitir carrito actualizado después de eliminar el producto
    });

    // Escuchar evento para vaciar todo el carrito
    socket.on('emptyCart', () => {
      console.log('Vaciando el carrito');
      cart.products = [];
      io.emit('cartUpdated', cart);  // Emitir carrito vacío
    });

    // Escuchar evento para realizar la compra
    socket.on('buyProducts', () => {
      console.log('Procesando la compra...');
      
      // Lógica para finalizar la compra (por ejemplo, guardar la orden)
      // Aquí simplemente vaciamos el carrito como parte del proceso
      const purchasedProducts = cart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      // Aquí podrías agregar lógica para guardar la orden en la base de datos, si es necesario

      // Vaciar el carrito después de la compra
      cart.products = [];
      io.emit('cartUpdated', cart);  // Emitir carrito vacío después de la compra

      // Emitir mensaje de éxito (opcional)
      socket.emit('purchaseComplete', { message: 'Compra realizada con éxito' });
    });

    // Escuchar evento para agregar un nuevo producto
// Escuchar evento para agregar un nuevo producto
socket.on('addProduct', (newProduct) => {
  console.log('Producto recibido para agregar:', newProduct);

  const product = new productModel(newProduct);
  product.save()
    .then(() => {
      productModel.find().then((products) => {
        io.emit('updateProducts', products); // Emitir productos actualizados
      }).catch(err => console.log('Error al obtener productos después de agregar', err));
    })
    .catch(err => console.log('Error al guardar el producto', err));
});

    // Escuchar evento para eliminar un producto
    socket.on('deleteProduct', (productId) => {
      console.log('Producto recibido para eliminar:', productId);
      productModel.findByIdAndDelete(productId)
        .then(() => {
          productModel.find().then((products) => {
            io.emit('updateProducts', products);
          }).catch(err => console.log('Error al obtener productos después de eliminar', err));
        })
        .catch(err => console.log('Error al eliminar producto', err));
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};

export default handleWebSocket;









