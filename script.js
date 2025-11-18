let products = [];

async function loadProducts() {
    try {
        let response = await fetch("products.json?nocache=" + Date.now());
        products = await response.json();
        displayProducts();
    } catch (err) {
        document.getElementById("products").innerHTML =
            "<p>لم يتم تحميل المنتجات.</p>";
    }
}

function displayProducts() {
    let container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <strong>${p.price} دينار</strong>
                <button class="btn" onclick="addToCart(${p.id})">إضافة للسلة</button>
            </div>
        `;
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت الإضافة للسلة");
}

document.getElementById("cart-btn").onclick = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return alert("السلة فارغة");

    let text = "مرحبا، أريد طلب المنتجات التالية:%0A";
    cart.forEach(item => {
        text += `- ${item.name} بسعر ${item.price} دينار%0A`;
    });

    window.open(`https://wa.me/218931122226?text=${text}`);
    localStorage.removeItem("cart");
};

loadProducts();
