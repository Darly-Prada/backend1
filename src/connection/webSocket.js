import { ProductModel } from "../models/productModel.js"; 


const handleWebSocket = (webSocketServer) => {
  webSocketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado', socket.id);

    // Enviar todos los productos al conectar
    ProductModel.find().then(products => {
      socket.emit('updateProducts', products);  // Enviar todos los productos
    });

    // Evento para agregar producto
    socket.on('addProduct', (productData) => {
      const newProduct = new ProductModel(productData);
      newProduct.save()
        .then(() => {
          // Emitir todos los productos después de agregar uno nuevo
          ProductModel.find().then(updatedProducts => {
            webSocketServer.sockets.emit('updateProducts', updatedProducts);
          });
        })
        .catch(error => console.error('Error al agregar producto:', error));
    });

    // Evento para eliminar producto
    socket.on('deleteProduct', (productId) => {
      ProductModel.findByIdAndDelete(productId)
        .then(() => {
          // Emitir todos los productos después de eliminar uno
          ProductModel.find().then(updatedProducts => {
            webSocketServer.sockets.emit('updateProducts', updatedProducts);
            webSocketServer.sockets.emit('productDeleted', productId);
          });
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    });

    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};

export default handleWebSocket;
