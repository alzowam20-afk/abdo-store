const WA_PHONE = "218931122226";
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();
let products = [];
let cart = loadCart();

const productsEl = document.getElementById("products");
const cartPopup = document.getElementById("cart-popup");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

// Load Products
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_JSON);
    if(!res.ok) throw 0;
    products = await res.json();
  } catch { products = fallbackProducts(); }
  renderProducts();
  renderCart();
}

function fallbackProducts(){
  return [
    {id:1,name:"ضوء مغناطيسي للتصوير",price:45,description:"إضاءة جميلة للتصوير.",image:"images/light1.jpeg"},
    {id:2,name:"سماعة بلوتوث",price:65,description:"سماعة بجودة عالية.",image:"images/speaker1.jpeg"},
    {id:3,name:"حمار للبيع",price:320,description:"حمار مطيع وهادئ.",image:"images/product1.jpeg"},
    {id:4,name:"باور بانك",price:90,description:"بطارية محمولة كبيرة.",image:"images/bank1.jpeg"}
  ];
}

// Render Products
function renderProducts() {
  productsEl.innerHTML = "";
  products.forEach(p => {
    productsEl.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">${p.price} دينار</div>
        <button class="add-btn" onclick="addToCart(${p.id})">إضافة للسلة</button>
      </div>
    `;
  });
}

// Cart functions
function addToCart(id) {
  let item = cart.find(i=>i.id==id);
  if(item) item.qty++;
  else cart.push({id, qty:1});
  saveCart(); renderCart();
}

function renderCart() {
  let details = cart.map(i=>{
    let p = products.find(x=>x.id==i.id);
    return {...p, qty:i.qty};
  });
  cartCountEl.textContent = details.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML = "";
  let total = 0;
  details.forEach(d=>{
    total += d.price*d.qty;
    cartItemsEl.innerHTML += `<div class="cart-item">
      <img src="${d.image}">
      <div>${d.name} × ${d.qty} = ${d.price*d.qty} دينار</div>
    </div>`;
  });
  cartTotalEl.textContent = total;
}

// Toggle cart
document.getElementById("cart-button").onclick = ()=>{ cartPopup.classList.toggle("hidden"); };
document.getElementById("close-cart").onclick = ()=>{ cartPopup.classList.add("hidden"); };

// WhatsApp
document.getElementById("send-whatsapp").onclick = ()=>{
  if(!cart.length) return alert("السلة فارغة");
  let msg = "مرحبا، أود طلب:%0A";
  cart.forEach(i=>{
    let p = products.find(x=>x.id==i.id);
    msg += `${p.name} × ${i.qty}%0A`;
  });
  window.location.href = `https://wa.me/${WA_PHONE}?text=${msg}`;
};

// Clear cart
document.getElementById("clear-cart").onclick = ()=>{
  cart=[]; saveCart(); renderCart();
};

// LocalStorage
function saveCart(){ localStorage.setItem("cart_v1", JSON.stringify(cart)); }
function loadCart(){ return JSON.parse(localStorage.getItem("cart_v1")) || []; }

loadProducts();
