async function loadProducts() {
    try {
        let response = await fetch("products.json");
        let products = await response.json();
        let html = "";
        products.forEach(p => {
            html += `
                <div class="product">
                    <img src="${p.image}">
                    <div class="info">
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                        <strong>${p.price} دينار</strong><br>
                        <button class="btn" onclick="addToCart('${p.name}', '${p.price}')">إضافة للسلة</button>
                    </div>
                </div>
            `;
        });
        document.getElementById("products").innerHTML = html;
    } catch (err) {
        console.error("خطأ في تحميل المنتجات:", err);
        document.getElementById("products").innerHTML = "<p>لم يتم تحميل المنتجات.</p>";
    }
}

function addToCart(name, price) {
    let url = `https://wa.me/218931122226?text=مرحبا! أريد طلب المنتج: ${name} بسعر: ${price}`;
    window.open(url, "_blank");
}

loadProducts();
