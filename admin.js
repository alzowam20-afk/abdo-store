// admin.js
const PRODUCTS_URL = "products.json?nocache=" + Date.now();
let products = [];

async function load() {
  try {
    let res = await fetch(PRODUCTS_URL);
    products = await res.json();
  } catch (e) {
    console.error("فشل تحميل products.json:", e);
    products = [];
  }
  renderList();
}

function renderList() {
  const list = document.getElementById("list");
  if (!products.length) { list.innerHTML = "<p class='small'>لا يوجد منتجات حالياً.</p>"; return; }

  list.innerHTML = "";
  products.forEach(p => {
    let div = document.createElement("div");
    div.className = "product-row";
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${p.name} <span class="small">(${p.category || ''})</span></div>
        <div class="small">${p.price} دينار — ${p.description || ''}</div>
      </div>
      <div class="actions">
        <button onclick="editProduct(${p.id})" class="btn-primary">تعديل</button>
        <button onclick="deleteProduct(${p.id})" class="btn-danger">حذف</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function resetForm() {
  document.getElementById("pid").value = "";
  document.getElementById("pname").value = "";
  document.getElementById("pcat").value = "";
  document.getElementById("pprice").value = "";
  document.getElementById("pimage").value = "";
  document.getElementById("pdesc").value = "";
}

function addOrUpdate() {
  let id = document.getElementById("pid").value;
  let name = document.getElementById("pname").value.trim();
  let category = document.getElementById("pcat").value.trim() || "عام";
  let price = document.getElementById("pprice").value.trim();
  let image = document.getElementById("pimage").value.trim();
  let desc = document.getElementById("pdesc").value.trim();

  if (!name || !price || !image) {
    alert("الرجاء تعبئة الاسم، السعر، ومسار/رابط الصورة.");
    return;
  }

  if (isNaN(Number(price))) {
    alert("السعر يجب أن يكون رقم.");
    return;
  }

  if (id) {
    // تحديث
    let idx = products.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      products[idx].name = name;
      products[idx].category = category;
      products[idx].price = Number(price);
      products[idx].image = image;
      products[idx].description = desc;
    }
  } else {
    // إضافة جديد
    const newId = Date.now();
    products.push({
      id: newId,
      name,
      category,
      price: Number(price),
      image,
      description: desc
    });
  }

  renderList();
  resetForm();
  alert("تم تحديث القائمة محليًا. اضغط 'تحميل products.json' لحفظ الملف ورفعه على GitHub.");
}

function editProduct(id) {
  let p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById("pid").value = p.id;
  document.getElementById("pname").value = p.name;
  document.getElementById("pcat").value = p.category || "";
  document.getElementById("pprice").value = p.price;
  document.getElementById("pimage").value = p.image;
  document.getElementById("pdesc").value = p.description;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm("هل تريد حذف هذا المنتج؟")) return;
  products = products.filter(p => p.id !== id);
  renderList();
}

// تنزيل products.json جاهز للرفع
function downloadProducts() {
  const text = JSON.stringify(products, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  a.click();
  URL.revokeObjectURL(url);
  alert("تم تنزيل products.json. ارفع الملف الجديد على GitHub لاستبدال القديم.");
}

// init
load();
