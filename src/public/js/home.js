const socketClient = io(); 


const productForm = document.getElementById('productForm');
const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const productCategory = document.getElementById('productCategory');
const productCode = document.getElementById('productCode');
const productStock = document.getElementById('productStock');
const productList = document.getElementById('productList');

// Agregar un nuevo producto
productForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const newProduct = {
    title: productTitle.value,
    price: parseInt(productPrice.value),
    description: productDescription.value,
    category: productCategory.value,
    code: productCode.value,
    stock: parseInt(productStock.value)
  };
  socketClient.emit('addProduct', newProduct);
  productForm.reset();
});

socketClient.on('updateProducts', (products) => {
  productList.innerHTML = '';

  // Agregar al DOM
  products.forEach((product, index) => {
    const productItem = document.createElement('li');
    productItem.innerHTML = `
      ${product.title} - $${product.price} - ${product.description} - ${product.category} - ${product.code} - ${product.stock}
      <button class="deleteBtn" data-index="${index}">Eliminar</button>
    `;
    productList.appendChild(productItem);
  });

  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      socketClient.emit('deleteProduct', index);
    });
  });
});