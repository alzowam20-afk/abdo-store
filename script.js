let allProducts = [];

async function loadProducts() {
    try {
        let response = await fetch("products.json");
        allProducts = await response.json();
        displayProducts();
    } catch (err) {
        console.error("خطأ في تحميل المنتجات:", err);
        document.getElementById("products").innerHTML = "<p>لم يتم تحميل المنتجات.</p>";
    }
}

function getSelectedCategories() {
    let checkboxes = document.querySelectorAll(".categoryCheckbox");
    let selected = [];
    checkboxes.forEach(cb => { if(cb.checked) selected.push(cb.value); });
    return selected;
}

function displayProducts() {
    let selectedCategories = getSelectedCategories();
    let html = "";
    allProducts.forEach(p => {
        if(!selectedCategories.includes(p.category)) return;
        html += `
            <div class="product">
                <img src="${p.image}">
                <div class="info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <strong>${p.price} دينار</strong><br>
                    <button class="btn" onclick="addToCart(${p.id}, '${p.name}', '${p.price}')">إضافة للسلة</button>
                </div>
            </div>
        `;
    });
    document.getElementById("products").innerHTML = html;
}

// إضافة منتج للسلة
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({id, name, price});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} تم إضافته للسلة`);
}

// زر السلة يرسل جميع المنتجات المختارة على واتساب
document.getElementById("cart-btn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cart.length === 0){ alert("السلة فارغة"); return; }
    let message = "مرحبا! أريد طلب المنتجات التالية:%0A";
    cart.forEach(p => { message += `- ${p.name} بسعر: ${p.price}%0A`; });
    let url = `https://wa.me/218931122226?text=${message}`;
    window.open(url, "_blank");
    localStorage.removeItem("cart");
});

// إعادة عرض المنتجات عند تغيير اختيار الصنف
document.querySelectorAll(".categoryCheckbox").forEach(cb => {
    cb.addEventListener("change", displayProducts);
});

loadProducts();
