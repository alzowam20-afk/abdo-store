let products = [];

function addProduct() {
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let image = document.getElementById("image").value;
    let description = document.getElementById("description").value;

    if (!name || !price || !image || !description) {
        alert("الرجاء ملء كل الحقول!");
        return;
    }

    let id = products.length + 1;
    let product = {id, name, price, image, description};
    products.push(product);
    displayProducts();
    alert("تمت إضافة المنتج. لا تنسى تعديل ملف products.json على GitHub.");
}

function displayProducts() {
    let list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach(p => {
        list.innerHTML += `<div class="product-item">${p.id}. ${p.name} - ${p.price}</div>`;
    });
}
