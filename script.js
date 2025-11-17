let cart = [];

async function loadProducts() {
    let res = await fetch("products.json");
    let data = await res.json();

    let html = "";
    data.forEach(p => {
        html += `
        <div class="product">
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <strong>${p.price} دينار</strong><br>
            <button class="btn" onclick="addToCart('${p.name}', ${p.price})">إضافة للسلة</button>
        </div>
        `;
    });

    document.getElementById("products").innerHTML = html;
}

function addToCart(name, price) {
    cart.push({name, price});
    alert("تمت الإضافة للسلة");
}

function openWhatsAppCart() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    let message = "مرحبا، أريد شراء:\n";

    cart.forEach(item => {
        message += `- ${item.name} (${item.price} دينار)\n`;
    });

    let phone = "0931122226";

    window.location.href = `https://wa.me/218${phone}?text=${encodeURIComponent(message)}`;
}

loadProducts();
