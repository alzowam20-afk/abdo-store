// ===== CONFIG =====
const WA_PHONE = "218931122226"; // رقم واتساب بدون +
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();

// ===== fallback products =====
const fallbackProducts = [
  {id:1,name:"ضوء مغناطيسي للتصوير",price:45,description:"إضاءة صغيرة مناسبة للسيلفي أو التصوير الليلي.",image:"images/light1.jpeg"},
  {id:2,name:"سماعة بلوتوث",price:65,description:"سماعة لاسلكية بجودة عالية وعزل ضوضاء.",image:"images/speaker1.jpeg"},
  {id:3,name:"حمار للبيع",price:320,description:"حمار مطيع وهادئ، مناسب الاستخدامات الزراعية.",image:"images/product1.jpeg"},
  {id:4,name:"باور بانك 20000 ملّي أمبير",price:90,description:"بطارية محمولة بسعة كبيرة.",image:"images/bank1.jpeg"},
  {id:5,name:"ساعة ذكية",price:120,description:"ساعة ذكية مع مراقبة نبضات القلب.",image:"images/watch1.jpeg"},
  {id:6,name:"حقيبة ظهر رياضية",price:55,description:"حقيبة ظهر خفيفة ومريحة للسفر.",image:"images/bag1.jpeg"},
  {id:7,name:"كيبورد ميكانيكي",price:150,description:"كيبورد ألعاب بإضاءة RGB.",image:"images/kb1.jpeg"},
  {id:8,name:"ماوس ألعاب",price:70,description:"ماوس سريع ودقيق.",image:"images/mouse1.jpeg"},
  {id:9,name:"مروحة USB صغيرة",price:25,description:"مروحة صغيرة تعمل عبر USB.",image:"images/fan1.jpeg"},
  {id:10,name:"شاحن مغناطيسي",price:35,description:"شاحن مغناطيسي سريع.",image:"images/charger1.jpeg"}
];

// ===== state =====
let products = [];
let cart = loadCartFromStorage();

const productsEl = document.getElementById('products');
const cartButton = document.getElementById('cart-button');
const cartPopup = document.getElementById('cart-popup');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const sendWhatsappBtn = document.getElementById('send-whatsapp');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');

async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_JSON);
    if(!res.ok) throw new Error('fetch failed');
    products = await res.json();
    if(!Array.isArray(products) || !products.length) throw new Error('invalid json');
  } catch {
    products = fallbackProducts.slice();
  }
  renderProducts();
  renderCartPopup();
}

function renderProducts(){
  productsEl.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">${p.price} دينار</div>
        <button class="btn add-btn" data-id="${p.id}">إضافة للسلة</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function addToCartById(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += 1;
  else cart.push({id, qty:1});
  saveCartToStorage();
  renderCartPopup();
}

function getCartDetails(){
  return cart.map(ci=>{
    const p = products.find(x=>x.id===ci.id);
    if(!p) return null;
    return { id:ci.id, name:p.name, price:Number(p.price), qty:ci.qty, image:p.image };
  }).filter(Boolean);
}

function renderCartPopup(){
  const details = getCartDetails();
  const total = details.reduce((s,i)=>s + (i.price * i.qty), 0);
  cartCountEl.textContent = details.reduce((s,i)=>s+i.qty,0);
  cartTotalEl.textContent = total;

  if(details.length===0){
    cartItemsEl.innerHTML = '<p style="text-align:center;color:#666">السلة فارغة</p>';
    return;
  }

  cartItemsEl.innerHTML = '';
  details.forEach((d, idx)=>{
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${d.image}" alt="${d.name}">
      <div class="meta">
        <div style="font-weight:700">${d.name}</div>
        <div style="color:#666;font-size:13px">${d.price} دينار لكل وحدة</div>
        <div class="qty-controls" style="margin-top:6px;">
          <button class="small-btn dec" data-idx="${idx}">-</button>
          <div style="min-width:28px;text-align:center">${d.qty}</div>
          <button class="small-btn inc" data-idx="${idx}">+</button>
          <button class="small-btn remove" data-idx="${idx}" style="margin-left:8px;background:#dc3545">حذف</button>
        </div>
      </div>
      <div style="text-align:center;font-weight:700">${d.price * d.qty} دينار</div>
    `;
    cartItemsEl.appendChild(item);
  });
}

function changeQtyByIndex(idx, delta){
  const item = cart[idx];
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart.splice(idx,1);
  saveCartToStorage();
  renderCartPopup();
}
function removeByIndex(idx){
  cart.splice(idx,1);
  saveCartToStorage();
  renderCartPopup();
}
function clearCart(){
  if(!confirm("هل تريد تفريغ السلة؟")) return;
  cart = [];
  saveCartToStorage();
  renderCartPopup();
}

function sendToWhatsApp(){
  const details = getCartDetails();
  if(details.length === 0){ alert("السلة فارغة"); return; }
  let message = "السلام عليكم، أود طلب المنتجات التالية:%0A";
  let total = 0;
  details.forEach(d=>{
    message += `- ${d.name} x${d.qty} = ${d.price * d.qty} دينار%0A`;
    total += d.price * d.qty;
  });
  message += `%0Aالمجموع الكلي: ${total} دينار`;
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

function saveCartToStorage(){ localStorage.setItem('zuwam_cart_v1', JSON.stringify(cart)); }
function loadCartFromStorage(){ try{ const raw=localStorage.getItem('zuwam_cart_v1'); return raw?JSON.parse(raw):[]; }catch(e){return[];} }

// events
document.addEventListener('click', function(e){
  const addBtn = e.target.closest('.add-btn');
  if(addBtn){ addToCartById(Number(addBtn.dataset.id)); return; }

  if(e.target.classList.contains('inc')) changeQtyByIndex(Number(e.target.dataset.idx),1);
  if(e.target.classList.contains('dec')) changeQtyByIndex(Number(e.target.dataset.idx),-1);
  if(e.target.classList.contains('remove')) removeByIndex(Number(e.target.dataset.idx));

  if(e.target.closest('#cart-button')) toggleCart();
  if(e.target.closest('#close-cart')) toggleCart(false);
  if(e.target.closest('#send-whatsapp')) sendToWhatsApp();
  if(e.target.closest('#clear-cart')) clearCart();
});

function toggleCart(forceOpen){
  const isHidden = cartPopup.classList.contains('hidden');
  const shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : isHidden;
  if(shouldOpen){ cartPopup.classList.remove
