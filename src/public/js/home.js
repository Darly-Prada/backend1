const socket = io(); // Conexión con el servidor WebSocket

// Referencias a los elementos del DOM
const productForm = document.getElementById('productForm');
const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const productCategory = document.getElementById('productCategory');
const productCode = document.getElementById('productCode');
const productStock = document.getElementById('productStock');
const productList = document.getElementById('productList');
const cartList = document.getElementById('cartList');

// Agregar un nuevo producto
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newProduct = {
    title: productTitle.value,
    price: productPrice.value,
    description: productDescription.value,
    category: productCategory.value,
    code: productCode.value,
    stock: productStock.value,
  };

  socket.emit('addProduct', newProduct);  
  productForm.reset();  
});
socket.on('updateProducts', (products) => {
  productList.innerHTML = ''; 

  products.forEach(product => {
    const li = document.createElement('li');
    li.id = `product-${product._id}`;
    li.innerHTML = `
      ${product.title} - $${product.price} - ${product.description} - ${product.category} - ${product.code} - ${product.stock}
      <button class="deleteBtn" data-id="${product._id}">Eliminar Producto</button>
      <button class="addToCartBtn" data-id="${product._id}">Agregar al carrito</button>
    `;
    productList.appendChild(li);
  });

  // Boton Eliminar producto
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      socket.emit('deleteProduct', productId); // Emitir evento para eliminar producto
    });
  });

  // Agregar al carrito
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      socket.emit('addToCart', productId);
    });
  });
});

// Escuchar evento y actualizar carrito
socket.on('cartUpdated', (cart) => {
  cartList.innerHTML = '';  

  cart.products.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('list');
    li.innerHTML = `
      ${item.productId.title} - Cantidad: ${item.quantity}
      <button class="removeFromCartBtn" data-id="${item.productId._id}">❌</button>
    `;
    cartList.appendChild(li);
  });

  // Eliminar producto del carrito individual 
  const removeFromCartButtons = document.querySelectorAll('.removeFromCartBtn');
  removeFromCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      socket.emit('removeFromCart', productId);
    });
  });
});

// Botón para vaciar el carrito
const emptyCartButton = document.querySelector('.emptyCartBtn'); // Cambié la clase aquí
if (emptyCartButton) {
  emptyCartButton.addEventListener('click', () => {
    socket.emit('emptyCart'); // Emitir evento para vaciar carrito
  });
}
// Redirigir a página en blanco cuando se hace clic en "Comprar mis Productos" en desarrollo
const buyButton = document.querySelector('.buyBtn'); 
if (buyButton) {
  buyButton.addEventListener('click', () => {
    window.location.href = '/empty'; // en Desarrollo
  });
}