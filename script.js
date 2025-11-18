// ===== CONFIG =====
const WA_PHONE = "218931122226"; // رقم واتساب بدون +
const PRODUCTS_JSON = "products.json?nocache=" + Date.now();

// ===== fallback products (in-case fetch fails) - same format as products.json =====
const fallbackProducts = [
  {id:1,name:"ضوء مغناطيسي للتصوير",price:45,description:"إضاءة صغيرة مناسبة للسيلفي أو التصوير الليلي.",image:"images/light1.jpeg"},
  {id:2,name:"سماعة بلوتوث",price:65,description:"سماعة لاسلكية بجودة عالية وعزل ضوضاء.",image:"images/speaker1.jpeg"},
  {id:3,name:"حمار للبيع",price:320,description:"حمار مطيع وهادئ، مناسب الاستخدامات الزراعية.",image:"images/product1.jpeg"},
  {id:4,name:"باور بانك 20000 ملّي أمبير",price:90,description:"بطارية محمولة بسعة كبيرة لشحن هاتفك عدة مرات.",image:"images/bank1.jpeg"},
  {id:5,name:"ساعة ذكية",price:120,description:"ساعة ذكية مع مراقبة نبضات القلب وعدد الخطوات.",image:"images/watch1.jpeg"},
  {id:6,name:"حقيبة ظهر رياضية",price:55,description:"حقيبة ظهر خفيفة ومريحة للسفر أو الرياضة.",image:"images/bag1.jpeg"},
  {id:7,name:"كيبورد ميكانيكي",price:150,description:"كيبورد ألعاب بإضاءة RGB وزرّات ميكانيكية.",image:"images/kb1.jpeg"},
  {id:8,name:"ماوس ألعاب",price:70,description:"ماوس سريع ودقيق مخصص للألعاب.",image:"images/mouse1.jpeg"},
  {id:9,name:"مروحة USB صغيرة",price:25,description:"مروحة صغيرة تعمل عبر USB، مثالية للمكتب أو السيارة.",image:"images/fan1.jpeg"},
  {id:10,name:"شاحن مغناطيسي",price:35,description:"شاحن مغناطيسي سريع، مناسب لأجهزة حديثة.",image:"images/charger1.jpeg"},
  {id:11,name:"نظارة شمسية رياضية",price:40,description:"نظارة شمسية خفيفة مع عدسات مقاومة للخدش.",image:"images/glasses1.jpeg"},
  {id:12,name:"سماعة بودز صغيرة",price:55,description:"سماعة داخل الأذن صغيرة الحجم مع بلوتوث سريع.",image:"images/earbuds1.jpeg"}
];

// ===== state =====
let products = [];
let cart = loadCartFromStorage(); // cart = [{id, qty}]

// ===== dom refs =====
const productsEl = document.getElementById('products');
const cartButton = document.getElementById('cart-button');
const cartPopup = document.getElementById('cart-popup');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const sendWhatsappBtn = document.getElementById('send-whatsapp');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');

// ===== functions =====
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_JSON);
    if(!res.ok) throw new Error('fetch failed');
    products = await res.json();
    // Validate basic structure
    if(!Array.isArray(products) || !products.length) throw new Error('invalid json');
  } catch (e) {
    console.warn("Failed to load products.json — using fallback", e);
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
      <img src="${p.image}" alt="${escapeHtml(p.name)}">
      <div class="info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description||'')}</p>
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
      <img src="${d.image}" alt="${escapeHtml(d.name)}">
      <div class="meta">
        <div style="font-weight:700">${escapeHtml(d.name)}</div>
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

// helpers: change qty by index in cart array
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

// send to whatsapp
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
  // navigate to whatsapp
  window.location.href = url;
}

// storage
function saveCartToStorage(){
  try{ localStorage.setItem('zuwam_cart_v1', JSON.stringify(cart)); }catch(e){}
}
function loadCartFromStorage(){
  try{
    const raw = localStorage.getItem('zuwam_cart_v1');
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed)) return [];
    return parsed;
  }catch(e){ return []; }
}

// escape simple html
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
}

// ===== events (delegation) =====
document.addEventListener('click', function(e){
  const addBtn = e.target.closest('.add-btn');
  if(addBtn){
    const id = Number(addBtn.dataset.id);
    if(!isNaN(id)) addToCartById(id);
    return;
  }

  // cart popup buttons (+ - remove)
  if(e.target.classList.contains('inc')){
    const idx = Number(e.target.dataset.idx);
    changeQtyByIndex(idx, 1);
    return;
  }
  if(e.target.classList.contains('dec')){
    const idx = Number(e.target.dataset.idx);
    changeQtyByIndex(idx, -1);
    return;
  }
  if(e.target.classList.contains('remove')){
    const idx = Number(e.target.dataset.idx);
    removeByIndex(idx);
    return;
  }

  // cart button open/close
  if(e.target.closest('#cart-button')){ toggleCart(); return; }
  if(e.target.closest('#close-cart')){ toggleCart(); return; }
  if(e.target.closest('#send-whatsapp')){ sendToWhatsApp(); return; }
  if(e.target.closest('#clear-cart')){ clearCart(); return; }
});

// close popup when click outside (but not when clicking the button)
document.addEventListener('click', function(e){
  const clickInside = e.target.closest('#cart-popup') || e.target.closest('#cart-button');
  if(!clickInside && !cartPopup.classList.contains('hidden')){
    toggleCart(false); // close
  }
});

// toggle cart helper
function toggleCart(forceOpen){
  const isHidden = cartPopup.classList.contains('hidden');
  const shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : isHidden;
  if(shouldOpen){
    cartPopup.classList.remove('hidden');
    cartPopup.setAttribute('aria-hidden','false');
    renderCartPopup();
  } else {
    cartPopup.classList.add('hidden');
    cartPopup.setAttribute('aria-hidden','true');
  }
}

// init
loadProducts();
