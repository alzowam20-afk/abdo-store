// رقم واتسابك
const WA_PHONE = "21893112226";

// تحميل ملف المنتجات
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();

let products = [];
let cart = loadCart();

// تحميل المنتجات
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_JSON);
    if (!res.ok) throw new Error();
    products = await res.json();
  } catch (e) {
    alert("فشل تحميل المنتجات");
    products = [];
  }
  renderProducts();
  updateCart();
}

function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";

    el.innerHTML = `
      <img src="${p.image}" alt="">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price} دينار</div>
      <button class="add-btn" onclick="addToCart(${p.id})">إضافة للسلة</button>
    `;

    box.appendChild(el);
  });
}

function addToCart(id) {
  let item = cart.find(c => c.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  saveCart();
  updateCart();
}

function updateCart() {
  const cartBox = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const totalBox = document.getElementById("cart-total");

  cartBox.innerHTML = "";
  let total = 0;

  cart.forEach((c, i) => {
    const p = products.find(p => p.id === c.id);
    if (!p) return;

    total += p.price * c.qty;

    cartBox.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}">
        <div class="meta">
          <strong>${p.name}</strong>
          <div>${p.price} دينار</div>
          <div class="qty-controls">
            <button class="small-btn" onclick="changeQty(${i},1)">+</button>
            <span>${c.qty}</span>
            <button class="small-btn" onclick="changeQty(${i},-1)">-</button>
            <button class="small-btn" style="background:#dc3545" onclick="removeItem(${i})">حذف</button>
          </div>
        </div>
      </div>
    `;
  });

  totalBox.innerText = total;
  count.innerText = cart.reduce((s, c) => s + c.qty, 0);
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  updateCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("zuwam_cart", JSON.stringify(cart));
}

function loadCart() {
  return JSON.parse(localStorage.getItem("zuwam_cart") || "[]");
}

// إرسال واتساب
document.getElementById("send-whatsapp").onclick = () => {
  if (cart.length === 0) return alert("السلة فارغة");

  let msg = "السلام عليكم، أريد طلب:\n";
  let total = 0;

  cart.forEach(c => {
    const p = products.find(x => x.id === c.id);
    msg += `- ${p.name} x${c.qty} = ${p.price * c.qty} دينار\n`;
    total += p.price * c.qty;
  });

  msg += `\nالمجموع الكلي: ${total} دينار`;

  window.location.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
};

// فتح / إغلاق السلة
document.getElementById("cart-button").onclick = () => {
  document.getElementById("cart-popup").classList.remove("hidden");
};

document.getElementById("close-cart").onclick = () => {
  document.getElementById("cart-popup").classList.add("hidden");
};

// تشغيل
loadProducts();
