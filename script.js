async function loadProducts() {
    try {
        let response = await fetch("products.json?nocache=" + Date.now());
        let products = await response.json();

        let area = document.getElementById("products");
        area.innerHTML = "";

        products.forEach(p => {
            area.innerHTML += `
                <div class="product">
                    <img src="${p.image}">
                    <div class="info">
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                        <div class="price">${p.price} دينار</div>
                        <button class="btn" onclick="addToCart(${p.id})">إضافة للسلة</button>
                    </div>
                </div>
            `;
        });

    } catch (e) {
        document.getElementById("products").innerHTML =
            "<p style='color:red;text-align:center;'>لم يتم تحميل المنتجات</p>";
    }
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let existing = cart.find(p => p.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: id, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("تمت الإضافة للسلة");
}

loadProducts();
