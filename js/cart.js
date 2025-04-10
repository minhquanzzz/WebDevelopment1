// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  databaseURL: "https://web-development-d110c-default-rtdb.firebaseio.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com",
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ==========================
// Giỏ hàng xử lý bằng localStorage
// ==========================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById("cart-count");
  if (countSpan) countSpan.textContent = count;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// ==========================
// Hiển thị giỏ hàng
// ==========================
function renderCart() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng trống.</p>";
    return;
  }

  cart.forEach(product => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="80">
      <div class="item-info">
        <h4>${product.name}</h4>
        <p>Giá: ${formatCurrency(product.price)}</p>
        <p>
          Số lượng: 
          <input type="number" value="${product.quantity}" min="1"
            onchange="updateQuantity('${product.id}', this.value)">
        </p>
        <p>Thành tiền: ${formatCurrency(product.price * product.quantity)}</p>
        <button onclick="removeFromCart('${product.id}')">Xóa</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `
    <h3>Tổng cộng: ${formatCurrency(total)}</h3>
    <button id="checkout-btn">Thanh toán</button>
  `;
  cartItemsDiv.appendChild(totalDiv);

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
}

// ==========================
// Cập nhật - Xóa - Thanh toán
// ==========================

window.updateQuantity = function(productId, newQuantity) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity = parseInt(newQuantity);
      break;
    }
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
};

window.removeFromCart = function(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCount();
};

// ==========================
// Thanh toán và lưu vào Firebase
// ==========================

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
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
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

// ==========================
// Khi trang được tải
// ==========================
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});
