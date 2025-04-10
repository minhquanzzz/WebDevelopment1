// admin.js
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
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc
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
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Kiểm tra quyền admin khi truy cập trang
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    alert("Bạn không có quyền truy cập.");
    window.location.href = "index.html";
  } else {
    loadUsers();
    loadProducts();
  }
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// 🧍‍♂️ Hiển thị danh sách người dùng
async function loadUsers() {
  const userList = document.getElementById("user-list-ul");
  userList.innerHTML = "";

  const usersSnap = await getDocs(collection(db, "users"));
  usersSnap.forEach((doc) => {
    const user = doc.data();
    const li = document.createElement("li");
    li.textContent = `${user.email} (${user.role || "user"})`;
    userList.appendChild(li);
  });
}

// ➕ Thêm sản phẩm
document.getElementById("add-product-btn").addEventListener("click", async () => {
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const imageFile = document.getElementById("product-image").files[0];

  if (!name || !price || !imageFile) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    name,
    price,
    imageUrl
  });

  document.getElementById("product-name").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-image").value = "";

  loadProducts();
});

// 📋 Hiển thị danh sách sản phẩm
async function loadProducts() {
  const productList = document.getElementById("product-list-ul");
  productList.innerHTML = "";

  const productsSnap = await getDocs(collection(db, "products"));
  productsSnap.forEach((docSnap) => {
    const product = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${product.name}</strong> - ${product.price}đ
      <img src="${product.imageUrl}" width="50" />
      <button data-id="${docSnap.id}" class="delete-btn">Xóa</button>
    `;
    productList.appendChild(li);
  });

  // Xử lý nút xóa
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "products", id));
      loadProducts();
    });
  });
}
