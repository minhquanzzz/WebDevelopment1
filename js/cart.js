import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const usernameSpan = document.getElementById("username");
const userInfoDiv = document.getElementById("user-info");
const logoutBtn = document.getElementById("logoutBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

let currentUserId = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    usernameSpan.textContent = user.displayName || user.email;
    userInfoDiv.style.display = "flex";
    await displayCartItems();
  } else {
    window.location.href = "login.html";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

async function displayCartItems() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  const q = query(collection(db, "cart"), where("userId", "==", currentUserId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
    cartTotalSpan.textContent = "0₫";
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const item = docSnap.data();
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Giá: ${item.price.toLocaleString()}₫</p>
        <label>Số lượng: 
          <input type="number" min="1" value="${quantity}" data-id="${docSnap.id}" class="qty-input"/>
        </label>
        <button class="remove-btn" data-id="${docSnap.id}">Xoá</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotalSpan.textContent = total.toLocaleString() + "₫";
  addCartEvents();
}

function addCartEvents() {
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "cart", id));
      await displayCartItems();
    });
  });

  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", async () => {
      const newQty = parseInt(input.value);
      const id = input.dataset.id;
      await updateDoc(doc(db, "cart", id), { quantity: newQty });
      await displayCartItems();
    });
  });
}

checkoutBtn.addEventListener("click", async () => {
  alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
  const q = query(collection(db, "cart"), where("userId", "==", currentUserId));
  const querySnapshot = await getDocs(q);

  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(doc(db, "cart", docSnap.id));
  }

  await displayCartItems();
});
