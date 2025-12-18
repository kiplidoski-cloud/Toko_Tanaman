// Shopping Cart
let cart = [];
let cartCount = 0;

// Add to Cart Function
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });
    
    cartCount++;
    updateCartCount();
    showNotification(`${productName} ditambahkan ke keranjang!`);
}

// Update Cart Count
function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4a7c2c;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Cart Modal
const modal = document.getElementById('cartModal');
const cartIcon = document.querySelector('.cart-icon');
const closeBtn = document.querySelector('.close');

cartIcon.onclick = function() {
    displayCart();
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Display Cart Items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#666;">Keranjang kosong</p>';
        totalPrice.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    let html = '<div style="display: flex; flex-direction: column; gap: 1rem;">';
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <div>
                    <strong>${item.name}</strong>
                    <p style="color: #4a7c2c; margin-top: 5px;">Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background: #ff4757; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    cartItems.innerHTML = html;
    totalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    displayCart();
    showNotification('Produk dihapus dari keranjang');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemList = cart.map(item => item.name).join(', ');
    
    alert(`Checkout berhasil!\n\nProduk: ${itemList}\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nTerima kasih telah berbelanja!`);
    
    cart = [];
    cartCount = 0;
    updateCartCount();
    modal.style.display = 'none';
}

// Filter Products
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const category = card.getAttribute('data-category');
                if (category.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Contact Form
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
    this.reset();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Modify checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}