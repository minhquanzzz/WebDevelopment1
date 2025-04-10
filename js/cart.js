// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey : "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc" , 
  authDomain : "web-development-d110c.firebaseapp.com" , 
  projectId : "web-development-d110c" , 
  storageBucket: "web-development-d110c.appspot.com",
  messagingSenderId : "646917777821" , 
  appId : "1:646917777821:web:4231def15898fc89ac6774" , 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ======= Các hàm giỏ hàng =======

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, image, name, price) {
    let cart = getCart();
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += 1;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({
            id: id,
            image: image,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }

    saveCart(cart);
    alert("Đã thêm vào giỏ hàng!");
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(product => product.id !== productId);
    saveCart(cart);
    alert("Đã xóa sản phẩm khỏi giỏ hàng.");
    renderCart();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    let cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = parseInt(newQuantity);
            break;
        }
    }

    saveCart(cart);
    renderCart();
}

function calculateTotalPrice() {
    let cart = getCart();
    let total = 0;

    for (let product of cart) {
        total += product.price * product.quantity;
    }

    return total.toLocaleString(); // Định dạng có dấu chấm
}

function renderCart() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Giỏ hàng trống.</p>";
        return;
    }

    cart.forEach(product => {
        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="80">
            <div class="item-info">
                <h4>${product.name}</h4>
                <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
                <p>
                    Số lượng: 
                    <input type="number" value="${product.quantity}" min="1"
                        onchange="updateQuantity('${product.id}', this.value)">
                </p>
                <p>Thành tiền: ${(product.price * product.quantity).toLocaleString()} VNĐ</p>
                <button onclick="removeFromCart('${product.id}')">Xóa</button>
            </div>
        `;
        cartItemsDiv.appendChild(item);
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.innerHTML = `
        <h3>Tổng cộng: ${calculateTotalPrice()} VNĐ</h3>
        <button onclick="checkout()">Thanh toán</button>
    `;
    cartItemsDiv.appendChild(totalDiv);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById("cart-count");
    if (cartCountSpan) {
        cartCountSpan.innerText = count;
    }
}

// ======= Thanh toán và lưu vào Firebase =======

function checkout() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const order = {
                uid: user.uid,
                email: user.email,
                items: cart,
                total: calculateTotalPrice().replace(/\./g, ''),
                createdAt: new Date().toISOString()
            };

            const ordersRef = ref(db, "orders");
            push(ordersRef, order)
                .then(() => {
                    localStorage.removeItem("cart");
                    alert("Thanh toán thành công! Đơn hàng đã được lưu.");
                    renderCart();
                    updateCartCount();
                })
                .catch((error) => {
                    console.error("Lỗi khi lưu đơn hàng:", error);
                    alert("Có lỗi xảy ra khi lưu đơn hàng.");
                });
        } else {
            alert("Bạn cần đăng nhập để thanh toán.");
        }
    });
}

// ======= Khởi động =======
window.addEventListener("DOMContentLoaded", () => {
    renderCart();
    updateCartCount();
});
