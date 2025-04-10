// assets/js/admin.js
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
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logoutBtn = document.getElementById("logout-btn");
const userList = document.getElementById("user-list-ul");
const productList = document.getElementById("product-list-ul");

const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productImageInput = document.getElementById("product-image");
const addProductBtn = document.getElementById("add-product-btn");

const editModal = document.getElementById("edit-modal");
const editId = document.getElementById("edit-id");
const editName = document.getElementById("edit-name");
const editPrice = document.getElementById("edit-price");
const saveEdit = document.getElementById("save-edit");
const closeEdit = document.getElementById("close-edit");

// 1. Kiểm tra quyền admin
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().role !== "admin") {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "index.html";
    } else {
      loadUsers();
      loadProducts();
    }
  } else {
    window.location.href = "login.html";
  }
});

// 2. Đăng xuất
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// 3. Quản lý người dùng
async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  userList.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().email} - Role: ${doc.data().role}`;
    userList.appendChild(li);
  });
}

// 4. Thêm sản phẩm
addProductBtn.addEventListener("click", async () => {
  const name = productNameInput.value;
  const price = parseFloat(productPriceInput.value);
  const image = productImageInput.files[0]?.name || "default.jpg";

  if (!name || isNaN(price)) {
    alert("Vui lòng nhập đầy đủ tên và giá sản phẩm.");
    return;
  }

  await addDoc(collection(db, "products"), {
    name,
    price,
    image
  });

  productNameInput.value = "";
  productPriceInput.value = "";
  productImageInput.value = "";

  alert("Đã thêm sản phẩm!");
  loadProducts();
});

// 5. Hiển thị sản phẩm
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${docSnap.data().name}</b> - ${docSnap.data().price}₫
      <button data-id="${docSnap.id}" class="edit-btn">Edit</button>
      <button data-id="${docSnap.id}" class="delete-btn">Delete</button>
    `;
    productList.appendChild(li);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "products", id));
      alert("Đã xóa sản phẩm!");
      loadProducts();
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      editId.value = id;
      const li = btn.parentElement;
      const name = li.querySelector("b").textContent;
      const price = li.textContent.match(/- ([\d.,]+)/)[1];
      editName.value = name;
      editPrice.value = price.replace(/₫/g, "");
      editModal.style.display = "block";
    });
  });
}

// 6. Sửa sản phẩm
saveEdit.addEventListener("click", async () => {
  const id = editId.value;
  const name = editName.value;
  const price = parseFloat(editPrice.value);

  if (!name || isNaN(price)) {
    alert("Vui lòng nhập đúng tên và giá.");
    return;
  }

  await updateDoc(doc(db, "products", id), {
    name,
    price
  });

  alert("Đã cập nhật sản phẩm!");
  editModal.style.display = "none";
  loadProducts();
});

closeEdit.addEventListener("click", () => {
  editModal.style.display = "none";
});
