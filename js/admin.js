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

// ✅ Firebase cấu hình đầy đủ
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID", // <-- nếu cần thiết
  appId: "YOUR_APP_ID" // <-- nếu cần thiết
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ DOM element
const userList = document.getElementById("user-list");
const productList = document.getElementById("product-list");

const logoutBtn = document.getElementById("logout-btn");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const imageInput = document.getElementById("product-image");
const addBtn = document.getElementById("add-product-btn");

// ✅ Danh sách email admin
const allowedAdmins = ["admin@example.com"]; // Thay bằng email thật của bạn

// ✅ Kiểm tra người dùng và phân quyền admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("Chưa đăng nhập");
    window.location.href = "login.html";
    return;
  }

  if (!allowedAdmins.includes(user.email)) {
    alert("Bạn không có quyền truy cập trang này.");
    window.location.href = "index.html";
    return;
  }

  console.log("Admin đăng nhập:", user.email);
  loadUsers();
  loadProducts();
});

// ✅ Đăng xuất
logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// ✅ Tải danh sách người dùng
async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  userList.innerHTML = "";
  snapshot.forEach((doc) => {
    const user = doc.data();
    const li = document.createElement("li");
    li.textContent = `${user.displayName || user.email || "Người dùng không rõ"}`;
    userList.appendChild(li);
  });
}

// ✅ Tải danh sách sản phẩm
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

// ✅ Thêm sản phẩm mới
addBtn?.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const file = imageInput.files[0];

  if (!name || !price || !file) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  try {
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
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm.");
  }
});
