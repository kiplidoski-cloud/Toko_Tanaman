// Get cart data from localStorage or session
let cartData = JSON.parse(localStorage.getItem('cart')) || [
    { name: 'Monstera Deliciosa', price: 150000, quantity: 1 },
    { name: 'Sansevieria', price: 75000, quantity: 2 }
];

const SHIPPING_COST = 15000;
const TAX_RATE = 0.1;

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    displayOrderSummary();
    setupPaymentMethodToggle();
    setupCardFormatting();
    setupFormValidation();
});

// Display Order Summary
function displayOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    let subtotal = 0;
    
    let html = '';
    cartData.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="order-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-quantity">Qty: ${item.quantity}</p>
                </div>
                <div class="item-price">
                    Rp ${itemTotal.toLocaleString('id-ID')}
                </div>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
    
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + SHIPPING_COST + tax;
    
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('tax').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    document.getElementById('grandTotal').textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
}

// Setup Payment Method Toggle
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById('creditCardDetails');
    const bankTransferDetails = document.getElementById('bankTransferDetails');
    const eWalletDetails = document.getElementById('eWalletDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details
            creditCardDetails.style.display = 'none';
            bankTransferDetails.style.display = 'none';
            eWalletDetails.style.display = 'none';
            
            // Show selected payment method details
            switch(this.value) {
                case 'credit_card':
                    creditCardDetails.style.display = 'block';
                    break;
                case 'bank_transfer':
                    bankTransferDetails.style.display = 'block';
                    break;
                case 'e_wallet':
                    eWalletDetails.style.display = 'block';
                    break;
            }
        });
    });
}

// Setup Card Number Formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('paymentForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processPayment();
        }
    });
}

function validateForm() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const address = document.getElementById('address').value;
    const terms = document.getElementById('terms').checked;
    
    if (!customerName || !customerEmail || !customerPhone || !address) {
        showNotification('Mohon lengkapi semua data!', 'error');
        return false;
    }
    
    if (!validateEmail(customerEmail)) {
        showNotification('Format email tidak valid!', 'error');
        return false;
    }
    
    if (!terms) {
        showNotification('Anda harus menyetujui syarat & ketentuan!', 'error');
        return false;
    }
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'credit_card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiryDate || !cvv) {
            showNotification('Mohon lengkapi data kartu kredit!', 'error');
            return false;
        }
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Process Payment
function processPayment() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value
    };
    
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + SHIPPING_COST + tax;
    
    // Simulate payment processing
    setTimeout(() => {
        // In production, you would call your backend API here
        // Example with Midtrans:
        // processMidtransPayment(customerData, grandTotal, paymentMethod);
        
        // For demo purposes, we'll simulate success
        const orderId = 'ORD-' + Date.now();
        
        loadingOverlay.style.display = 'none';
        showSuccessModal(orderId, grandTotal);
        
        // Clear cart
        localStorage.removeItem('cart');
        
    }, 2000);
}

// Midtrans Integration (Production)
function processMidtransPayment(customerData, amount, paymentMethod) {
    // This would be called from your backend
    const transactionData = {
        transaction_details: {
            order_id: 'ORD-' + Date.now(),
            gross_amount: amount
        },
        customer_details: {
            first_name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            billing_address: {
                address: customerData.address,
                city: customerData.city,
                postal_code: customerData.postalCode
            }
        },
        item_details: cartData.map(item => ({
            id: item.name,
            price: item.price,
            quantity: item.quantity,
            name: item.name
        }))
    };
    
    // Call your backend API
    fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        // Midtrans Snap token
        window.snap.pay(data.token, {
            onSuccess: function(result) {
                showSuccessModal(result.order_id, amount);
            },
            onPending: function(result) {
                showNotification('Pembayaran pending, silakan selesaikan pembayaran', 'warning');
            },
            onError: function(result) {
                showNotification('Pembayaran gagal!', 'error');
            },
            onClose: function() {
                showNotification('Anda menutup popup pembayaran', 'info');
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Terjadi kesalahan!', 'error');
    });
}

// Show Success Modal
function showSuccessModal(orderId, total) {
    const modal = document.getElementById('successModal');
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('orderTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    modal.style.display = 'block';
}

// Show Notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#4a7c2c',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#3498db'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
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
    }, 3000);
}

// Save cart to localStorage (call this from main website)
function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}