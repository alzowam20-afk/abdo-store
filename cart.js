// cart.js
const WA_PHONE = "218931122226"; // رقمك بدون +
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();

async function fetchProducts() {
  try {
    let res = await fetch(PRODUCTS_JSON);
    return await res.json();
  } catch (e) {
    console.error("خطأ تحميل المنتجات:", e);
    return [];
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(p) {
  return `${p} دينار`;
}

async function renderCart() {
  const container = document.getElementById("cart-container");
  let cart = getCart();
  if (!cart || cart.length === 0) {
    container.innerHTML = `<div class="empty"><p>السلة فارغة</p><a class="back" href="index.html">العودة للتسوق</a></div>`;
    return;
  }

  const products = await fetchProducts();
  let html = "";
  let total = 0;

  cart.forEach(item => {
    let prod = products.find(p => p.id === item.id);
    if (!prod) return; // لو المنتج اختفى
    const sub = Number(prod.price) * Number(item.qty);
    total += sub;
    html += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${prod.image}" alt="${prod.name}">
        <div style="flex:1">
          <div style="font-weight:700">${prod.name}</div>
          <div style="color:#666">${prod.description || ""}</div>
          <div style="margin-top:6px; color:#007bff">${formatPrice(prod.price)} لكل وحدة</div>
        </div>
        <div style="text-align:center">
          <div class="qty">
            <button onclick="decrease(${item.id})">-</button>
            <div style="min-width:28px;text-align:center">${item.qty}</div>
            <button onclick="increase(${item.id})">+</button>
          </div>
          <div style="margin-top:8px; font-weight:700">${formatPrice(sub)}</div>
          <button class="remove" onclick="removeItem(${item.id})">حذف</button>
        </div>
      </div>
    `;
  });

  html += `<div class="total-row">المجموع الكلي: ${formatPrice(total)}</div>`;
  html += `<button class="send-btn" onclick="sendCart()">إرسال الطلب عبر واتساب</button>`;

  container.innerHTML = html;
}

function increase(id) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Number(item.qty) + 1;
  saveCart(cart);
  renderCart();
}

function decrease(id) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (!item) return;
  if (item.qty > 1) item.qty = Number(item.qty) - 1;
  else {
    // لو الكمية تصبح صفر نحذف
    cart = cart.filter(i => i.id !== id);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

async function sendCart() {
  const products = await fetchProducts();
  let cart = getCart();
  if (!cart || cart.length === 0) { alert("السلة فارغة"); return; }

  let message = "السلام عليكم، أود طلب المنتجات التالية:%0A";
  let total = 0;
  cart.forEach(i => {
    let p = products.find(x => x.id === i.id);
    if (!p) return;
    let sub = Number(p.price) * Number(i.qty);
    total += sub;
    message += `- ${p.name} x${i.qty} = ${sub} دينار%0A`;
  });
  message += `%0Aالمجموع الكلي: ${total} دينار`;

  // افتح واتساب
  window.open(`https://wa.me/${WA_PHONE}?text=${message}`, "_blank");

  // مسح السلة بعد الإرسال
  localStorage.removeItem("cart");
  setTimeout(renderCart, 500);
}

// تشغيل العرض عند فتح الصفحة
renderCart();
