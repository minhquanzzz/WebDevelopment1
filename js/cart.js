import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com",
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const cartItemsContainer = document.getElementById("cart-items");
const cartCountSpan = document.getElementById("cart-count");

// Kiểm tra người dùng đăng nhập
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-info").style.display = "block";
  document.getElementById("username").textContent = user.email;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });

  loadCart(user.uid);
});

// Load giỏ hàng
async function loadCart(uid) {
  const cartRef = doc(db, "carts", uid);
  const cartSnap = await getDoc(cartRef);

  cartItemsContainer.innerHTML = "";
  cartCountSpan.textContent = "0";

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const items = Object.entries(cartData);
    cartCountSpan.textContent = items.length;

    for (const [productId, item] of items) {
      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");
      itemEl.innerHTML = `
        <img src="${item.image}" width="80" />
        <div>
          <strong>${item.name}</strong><br />
          Giá: ${item.price} <br />
          Số lượng: 
          <input type="number" value="${item.quantity}" min="1" data-id="${productId}" class="qty-input" />
          <br />
          <button data-id="${productId}" class="remove-btn">Xóa</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    }

    addCartEventListeners(uid);
  } else {
    cartItemsContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
  }
}

// Gắn sự kiện thay đổi số lượng & xoá sản phẩm
function addCartEventListeners(uid) {
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", async (e) => {
      const productId = e.target.dataset.id;
      const quantity = parseInt(e.target.value);
      if (quantity <= 0) return;

      const cartRef = doc(db, "carts", uid);
      await updateDoc(cartRef, {
        [`${productId}.quantity`]: quantity
      });
      loadCart(uid);
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      const cartRef = doc(db, "carts", uid);
      await updateDoc(cartRef, {
        [productId]: deleteField()
      });
      loadCart(uid);
    });
  });
}
