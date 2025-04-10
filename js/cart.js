import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

const cartItemsDiv = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("user-info");
const usernameSpan = document.getElementById("username");

// Hiển thị giỏ hàng người dùng
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      usernameSpan.textContent = userDoc.data().email || "Người dùng";
      userInfo.style.display = "block";
    }

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      renderCartItems(cartData.items || []);
    }
  } else {
    window.location.href = "login.html";
  }
});

// Đăng xuất
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// Hiển thị danh sách sản phẩm trong giỏ hàng
function renderCartItems(items) {
  cartItemsDiv.innerHTML = "";
  cartCount.textContent = items.length;

  if (items.length === 0) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng trống.</p>";
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" width="80" />
      <div>
        <strong>${item.name}</strong><br>
        Giá: ${item.price}<br>
        Số lượng: ${item.quantity}
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });
}
