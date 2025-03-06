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

  // Captura de los valores del formulario
  const newProduct = {
    title: productTitle.value,
    price: productPrice.value,
    description: productDescription.value,
    category: productCategory.value,
    code: productCode.value,
    stock: productStock.value,
  };

  socket.emit('addProduct', newProduct); // Emitir evento para agregar producto
  productForm.reset(); // Resetear el formulario
});

// Escuchar evento para actualizar productos en la lista
socket.on('updateProducts', (products) => {
  productList.innerHTML = '';  // Limpiar lista de productos

  // Crear y agregar los nuevos productos a la lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.id = `product-${product._id}`;
    li.innerHTML = `
      ${product.title} - $${product.price} - ${product.description} - ${product.category} - ${product.code} - ${product.stock}
      <button class="deleteBtn" data-id="${product._id}">Eliminar</button>
      <button class="addToCartBtn" data-id="${product._id}">Agregar al carrito</button>
    `;
    productList.appendChild(li);
  });

  // Eliminar producto
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
      socket.emit('addToCart', productId); // Emitir evento para agregar al carrito
    });
  });
});

// Escuchar evento para actualizar el carrito
socket.on('cartUpdated', (cart) => {
  cartList.innerHTML = '';  // Limpiar carrito

  // Crear y agregar los productos del carrito a la lista
  cart.products.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('list');
    li.innerHTML = `
      ${item.productId.title} - Cantidad: ${item.quantity}
      <button class="removeFromCartBtn" data-id="${item.productId._id}">Eliminar</button>
    `;
    cartList.appendChild(li);
  });

  // Eliminar producto del carrito
  const removeFromCartButtons = document.querySelectorAll('.removeFromCartBtn');
  removeFromCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      socket.emit('removeFromCart', productId); // Emitir evento para eliminar producto del carrito
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
// Redirigir a página en blanco cuando se hace clic en "Comprar mis Productos"
const buyButton = document.querySelector('.buyBtn'); // Cambié la clase aquí
if (buyButton) {
  buyButton.addEventListener('click', () => {
    window.location.href = '/empty'; // Redirigir a una página en blanco
  });
}