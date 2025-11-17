let cart = [];

function addToCart(id, name, price) {
    cart.push({ id, name, price });

    alert("✔ تمت إضافة المنتج إلى السلة");

    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    let saved = localStorage.getItem("cart");
    if (saved) {
        cart = JSON.parse(saved);
    }
}
loadCart();

function sendCartToWhatsApp() {
    let number = "0931122226"; // رقمك
    let message = "طلب جديد:\n\n";

    cart.forEach((item, i) => {
        message += `${i+1}- ${item.name} | السعر: ${item.price} دينار\n`;
    });

    let url = `https://wa.me/218${number}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}
