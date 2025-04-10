import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const userList = document.getElementById("user-list");
const productList = document.getElementById("product-list");

const logoutBtn = document.getElementById("logout-btn");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const imageInput = document.getElementById("product-image");
const addBtn = document.getElementById("add-product-btn");

const allowedAdmins = ["admin@example.com"]; // Thay bằng email admin thực tế

onAuthStateChanged(auth, async (user) => {
  if (!user || !allowedAdmins.includes(user.email)) {
    window.location.href = "login.html";
  } else {
    loadUsers();
    loadProducts();
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  userList.innerHTML = "";
  snapshot.forEach((doc) => {
    const user = doc.data();
    const li = document.createElement("li");
    li.textContent = `${user.displayName || user.email}`;
    userList.appendChild(li);
  });
}

function loadProducts() {
  onSnapshot(collection(db, "products"), (snapshot) => {
    productList.innerHTML = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <div>
          <h4>${p.name}</h4>
          <p>Giá: ${Number(p.price).toLocaleString()}₫</p>
        </div>
      `;
      productList.appendChild(div);
    });
  });
}

addBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const file = imageInput.files[0];

  if (!name || !price || !file) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const storageRef = ref(storage, "product-images/" + file.name);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "products"), {
    name,
    price,
    image: imageUrl
  });

  nameInput.value = "";
  priceInput.value = "";
  imageInput.value = "";

  alert("Đã thêm sản phẩm thành công!");
});
