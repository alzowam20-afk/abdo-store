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
                        <strong>${p.price} دينار</strong>
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

loadProducts();
