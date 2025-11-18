// جميع المنتجات مضمّنة هنا
const products = [
  {
    "id": 1,
    "name": "ضوء مغناطيسي للتصوير",
    "price": 45,
    "description": "إضاءة صغيرة مناسبة للسيلفي أو التصوير الليلي.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/light1.jpeg"
  },
  {
    "id": 2,
    "name": "سماعة بلوتوث",
    "price": 65,
    "description": "سماعة لاسلكية بجودة عالية وعزل ضوضاء.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/speaker1.jpeg"
  },
  {
    "id": 3,
    "name": "حمار للبيع",
    "price": 320,
    "description": "حمار مطيع وهادئ، مناسب الاستخدامات الزراعية.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/product1.jpeg"
  },
  {
    "id": 4,
    "name": "باور بانك 20000 ملّي أمبير",
    "price": 90,
    "description": "بطارية محمولة بسعة كبيرة لشحن هاتفك عدة مرات.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/bank1.jpeg"
  },
  {
    "id": 5,
    "name": "ساعة ذكية",
    "price": 120,
    "description": "ساعة ذكية مع مراقبة نبضات القلب وعدد الخطوات.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/watch1.jpeg"
  },
  {
    "id": 6,
    "name": "حقيبة ظهر رياضية",
    "price": 55,
    "description": "حقيبة ظهر خفيفة ومريحة للسفر أو الرياضة.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/bag1.jpeg"
  },
  {
    "id": 7,
    "name": "كيبورد ميكانيكي",
    "price": 150,
    "description": "كيبورد ألعاب بإضاءة RGB وزرّات ميكانيكية.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/kb1.jpeg"
  },
  {
    "id": 8,
    "name": "ماوس ألعاب",
    "price": 70,
    "description": "ماوس سريع ودقيق مخصص للألعاب.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/mouse1.jpeg"
  },
  {
    "id": 9,
    "name": "مروحة USB صغيرة",
    "price": 25,
    "description": "مروحة صغيرة تعمل عبر USB، مثالية للمكتب أو السيارة.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/fan1.jpeg"
  },
  {
    "id": 10,
    "name": "شاحن مغناطيسي",
    "price": 35,
    "description": "شاحن مغناطيسي سريع، مناسب لأجهزة حديثة.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/charger1.jpeg"
  },
  {
    "id": 11,
    "name": "نظارة شمسية رياضية",
    "price": 40,
    "description": "نظارة شمسية خفيفة مع عدسات مقاومة للخدش.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/glasses1.jpeg"
  },
  {
    "id": 12,
    "name": "سماعة بودز صغيرة",
    "price": 55,
    "description": "سماعة داخل الأذن صغيرة الحجم مع بلوتوث سريع.",
    "image": "https://raw.githubusercontent.com/alzowam20-afk/abdo-store/main/images/earbuds1.jpeg"
  }
];

// تحميل المنتجات في الصفحة
function loadProducts() {
  let html = "";
  products.forEach(p => {
    html += `
      <div class="product">
        <img src="${p.image}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <strong>${p.price} دينار</strong>
          <br>
          <button class="btn" onclick="addToCart('${p.name}', ${p.price})">إضافة للسلة</button>
        </div>
      </div>
    `;
  });
  document.getElementById("products").innerHTML = html;
}

loadProducts();

// إدارة السلة
let cart = [];
function addToCart(name, price) {
  cart.push({name, price});
  alert(`${name} أضيف للسلة`);
}

// إرسال السلة على واتس آب
function sendToWhatsApp() {
  if(cart.length === 0){
    alert("السلة فارغة");
    return;
  }
  let message = cart.map(i => `${i.name} (${i.price} دينار)`).join("\n");
  let url = `https://wa.me/0931122226?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}
