// زر فتح السلة الجانبية
const cartBtn = document.getElementById("cart-btn");
// صندوق السلة
const cartSidebar = document.getElementById("cart-sidebar");
// زر الإغلاق
const closeCartBtn = document.getElementById("close-cart");
// مكان عرض المنتجات
const productsContainer = document.getElementById("products");
// مكان عناصر السلة
const cartItemsContainer = document.getElementById("cart-items");

// رقم الواتس آب الصحيح
let whatsappNumber = "+218931122226";

// السلة
let cart = [];


// فتح السلة
cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("open");
});

// إغلاق السلة
closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});


// تحميل المنتجات من ملف products.json
async function loadProducts() {
    try {
        let response = await fetch("products.json");
        let products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach(p => {
            productsContainer.innerHTML += `
                <div class="product">
                    <img src="${p.image}" alt="">
                    <div class="info">
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                        <strong>${p.price} دينار</strong><br>
                        <button class="btn" onclick="addToCart('${p.name}', ${p.price})">إضافة للسلة</button>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        productsContainer.innerHTML = "<p style='color:red;'>لم يتم تحميل المنتجات</p>";
    }
}

loadProducts();


// إضافة للسلة
function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    renderCart();
}


// عرض السلة
function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>السلة فارغة</p>";
        return;
    }

    cart.forEach((item, index) => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    السعر: ${item.price} دينار
                </div>

                <div class="qty-control">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">✖</button>
            </div>
        `;
    });
}


// تعديل الكمية
function changeQty(index, value) {
    cart[index].qty += value;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    renderCart();
}


// حذف منتج
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}


// إرسال الطلب على واتس آب
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    let message = "طلب جديد:\n\n";

    cart.forEach(item => {
        message += `${item.name} - ${item.price} دينار × ${item.qty}\n`;
    });

    let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = url;
}
