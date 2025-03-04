
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

  // Emitir evento al servidor para agregar producto
  socket.emit('addProduct', newProduct);

  // Limpiar formulario después de enviar
  productForm.reset();
});

// Escuchar eventos para actualizar la lista de productos
socket.on('updateProducts', (products) => {
  // Limpiar la lista actual de productos
  productList.innerHTML = '';

  // Crear y agregar los nuevos productos a la lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.id = `product-${product._id}`;
    li.innerHTML = `
      ${product.title} - $${product.price} - ${product.description} - ${product.category} - ${product.code} - ${product.stock}
      <button class="deleteBtn" data-id="${product._id}">Eliminar</button>
    `;
    productList.appendChild(li);
  });

  // Añadir los eventos para eliminar productos
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      socket.emit('deleteProduct', productId); // Emitir evento de eliminación
    });
  });
});

// Escuchar cuando el servidor emita que el producto fue eliminado
socket.on('productDeleted', (productId) => {
  const productElement = document.getElementById(`product-${productId}`);
  if (productElement) {
    productElement.remove();
  }
});

// Al agregar producto al carrito
document.querySelectorAll('.addToCartBtn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const productId = e.target.dataset.id;
    const cartId = 'ID_DEL_CARRITO'; // Aquí puedes poner un ID dinámico de un carrito existente.

    // Agregar producto al carrito a través de la API
    await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
    });

    // Emitir un evento a través del WebSocket para actualizar la vista
    socket.emit('updateCart', cartId);
  });
});

// Escuchar el evento de actualización del carrito
socket.on('cartUpdated', (cart) => {
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';

  cart.products.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.productId.title} - ${item.quantity}`;
    cartList.appendChild(li);
  });
});
// Evento para eliminar un producto
const deleteBtns = document.querySelectorAll(".deleteBtn");

deleteBtns.forEach(button => {
  button.addEventListener("click", async () => {
    const productId = button.dataset.id;
    const cartId = "idDelCarrito";  // Asegúrate de tener el ID del carrito correcto, por ejemplo, lo puedes obtener de la URL o tenerlo previamente

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (response.ok) {
      alert("Producto eliminado exitosamente!");
      location.reload();  // Recargar la página para mostrar el carrito actualizado
    } else {
      alert("Error al eliminar el producto");
    }
  });
});

const addToCartButtons = document.querySelectorAll('.addToCartBtn');

addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const productId = this.getAttribute('data-id');  // Obtener el id del producto
    // Emitir el evento para agregar el producto al carrito
    socket.emit('addToCart', productId);
  });
});

// Escuchar los productos actualizados en el carrito
socket.on('updateCart', (updatedCart) => {
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';  // Limpiar la lista del carrito

  updatedCart.products.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'list';
    listItem.innerHTML = `${item.productId.title} - ${item.quantity}`;
    
    cartList.appendChild(listItem);
  });
});

