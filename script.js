// إدارة سلة التسوق
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    // تحميل السلة من localStorage
    loadCart() {
        const savedCart = localStorage.getItem('abdoStoreCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // حفظ السلة في localStorage
    saveCart() {
        localStorage.setItem('abdoStoreCart', JSON.stringify(this.items));
    }

    // إضافة منتج إلى السلة
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('تمت إضافة المنتج إلى السلة');
    }

    // تحديث كمية منتج في السلة
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    // إزالة منتج من السلة
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('تمت إزالة المنتج من السلة');
    }

    // حساب المجموع الكلي
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // تحديث عرض السلة
    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        // تحديث عدد العناصر
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // تحديث قائمة العناصر
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">السلة فارغة</p>';
        } else {
            this.items.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                
                // التحقق من وجود صورة
                const hasImage = item.image && item.image !== '';
                const imageClass = hasImage ? 'has-image' : '';
                const imageStyle = hasImage ? `background-image: url('${item.image}')` : '';
                
                cartItemElement.innerHTML = `
                    <div class="cart-item-image ${imageClass}" style="${imageStyle}">
                        ${!hasImage ? '<i class="fas fa-box"></i>' : ''}
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} دينار</div>
                        <div class="cart-item-controls">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItemElement);
            });
        }

        // تحديث المجموع الكلي
        cartTotal.textContent = this.getTotal();

        // إضافة مستمعي الأحداث للعناصر الجديدة
        this.addCartItemEventListeners();
    }

    // إضافة مستمعي الأحداث لعناصر السلة
    addCartItemEventListeners() {
        // أزرار زيادة الكمية
        document.querySelectorAll('.cart-item .increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // أزرار تقليل الكمية
        document.querySelectorAll('.cart-item .decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // أزرار إزالة العنصر
        document.querySelectorAll('.cart-item .remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                this.removeItem(productId);
            });
        });
    }

    // إظهار إشعار
    showNotification(message) {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 1200;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // إرسال الطلب عبر واتساب
    sendOrderViaWhatsApp() {
        if (this.items.length === 0) {
            this.showNotification('السلة فارغة، أضف منتجات أولاً');
            return;
        }

        let message = `مرحباً، أريد طلب المنتجات التالية من متجر عبدو:\n\n`;
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price} دينار = ${item.quantity * item.price} دينار\n`;
        });
        
        message += `\nالمجموع الكلي: ${this.getTotal()} دينار\n\n`;
        message += `شكراً لخدمتكم!`;
        
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '0931122226';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    const cart = new Cart();
    
    // عرض المنتجات
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // التحقق من وجود صورة
        const hasImage = product.image && product.image !== '';
        const imageClass = hasImage ? 'has-image' : '';
        const imageStyle = hasImage ? `background-image: url('${product.image}')` : '';
        
        productCard.innerHTML = `
            <div class="product-image ${imageClass}" style="${imageStyle}">
                ${!hasImage ? '<i class="fas fa-box"></i>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} دينار</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                        <span class="quantity">1</span>
                        <button class="quantity-btn increase" data-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">أضف إلى السلة</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // إضافة مستمعي الأحداث للمنتجات
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            const quantityElement = e.target.closest('.product-actions').querySelector('.quantity');
            const quantity = parseInt(quantityElement.textContent);
            
            if (product) {
                cart.addItem(product, quantity);
                // إعادة تعيين الكمية إلى 1 بعد الإضافة
                quantityElement.textContent = 1;
            }
        });
    });

    // أزرار زيادة وتقليل الكمية في المنتجات
    document.querySelectorAll('.product-card .quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonElement = e.target.closest('button');
            const quantityElement = buttonElement.closest('.quantity-controls').querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (buttonElement.classList.contains('increase')) {
                quantity++;
            } else if (buttonElement.classList.contains('decrease') && quantity > 1) {
                quantity--;
            }
            
            quantityElement.textContent = quantity;
        });
    });

    // فتح وإغلاق سلة التسوق
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // إغلاق السلة بالنقر خارجها
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // زر إتمام الطلب
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', () => {
        cart.sendOrderViaWhatsApp();
    });
});
