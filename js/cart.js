import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// 🔐 Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 👉 DOM elements
const cartItemsDiv = document.getElementById("cart-items");
const totalPriceSpan = document.getElementById("total-price");
let totalPrice = 0;

// 👤 Kiểm tra đăng nhập
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const item = docSnap.data();
      totalPrice += item.price;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>Giá: ${item.price.toLocaleString()}₫</p>
          <p>Người thêm: ${item.userName || "Không rõ"}</p>
        </div>
        <button class="remove-btn">Xoá</button>
      `;

      const removeBtn = itemDiv.querySelector(".remove-btn");
      removeBtn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "cart", docSnap.id));
        itemDiv.remove();
        totalPrice -= item.price;
        totalPriceSpan.textContent = totalPrice.toLocaleString() + "₫";
      });

      cartItemsDiv.appendChild(itemDiv);
    });

    totalPriceSpan.textContent = totalPrice.toLocaleString() + "₫";
  } else {
    window.location.href = "login.html";
  }
});
