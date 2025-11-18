const WA_PHONE = "218931122226";
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();
let products = [];
let cart = JSON.parse(localStorage.getItem("cart_v2")||"[]");

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
    {id:4,name:"باور بانك",price:90,description:"بطارية محمولة كبيرة.",image:"images/bank1.jpeg"},
    {id:5,name:"ساعة ذكية",price:120,description:"ساعة ذكية.",image:"images/watch1.jpeg"},
    {id:6,name:"حقيبة رياضية",price:55,description:"حقيبة ظهر مريحة.",image:"images/bag1.jpeg"}
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
  details.forEach((d, idx)=>{
    total += d.price*d.qty;
    cartItemsEl.innerHTML += `<div class="cart-item">
      <img src="${d.image}">
      <div>
        ${d.name} × ${d.qty} = ${d.price*d.qty} دينار
        <div class="qty-controls">
          <button class="small-btn dec" onclick="changeQty(${idx}, -1)">-</button>
          <button class="small-btn inc" onclick="changeQty(${idx}, 1)">+</button>
          <button class="small-btn remove" onclick="removeItem(${idx})">حذف</button>
        </div>
      </div>
    </div>`;
  });
  cartTotalEl.textContent = total;
}

// Qty functions
function changeQty(idx, delta){
  cart[idx].qty += delta;
  if(cart[idx].qty<=0) cart.splice(idx,1);
  saveCart(); renderCart();
}
function removeItem(idx){
  cart.splice(idx,1);
  saveCart(); renderCart();
}

// Toggle cart
document.getElementById("cart-button").onclick = ()=>cartPopup.classList.toggle("hidden");
document.getElementById("close-cart").onclick = ()=>cartPopup.classList.add("hidden");

// WhatsApp
document.getElementById("send-whatsapp").onclick = ()=>{
  if(!cart.length) return alert("السلة فارغة");
  let msg = "مرحبا، أود طلب:%0A";
  cart.forEach(i=>{
    let p = products.find(x=>x.id==i.id);
    msg += `${p.name} × ${i.qty} = ${p.price*i.qty} دينار%0A`;
  });
  window.location.href = `https://wa.me/${WA_PHONE}?text=${msg}`;
};

// Clear cart
document.getElementById("clear-cart").onclick = ()=>{
  cart=[]; saveCart(); renderCart();
};

// LocalStorage
function saveCart(){ localStorage.setItem("cart_v2", JSON.stringify(cart)); }

loadProducts();
