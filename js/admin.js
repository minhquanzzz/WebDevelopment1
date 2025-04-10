// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
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

// Kiểm tra đăng nhập và quyền admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDocs(collection(db, "users"));
  const currentUser = Array.from(userDoc.docs).find(d => d.id === user.uid);
  if (!currentUser || currentUser.data().role !== "admin") {
    window.location.href = "index.html";
  }

  loadUsers();
  loadProducts();
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("Signed out"); // kiểm tra logout
      window.location.href = "login.html";
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  });
  

// Load danh sách người dùng
async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const userList = document.getElementById("user-list-ul");
  userList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `Email: ${data.email} | Role: ${data.role || 'user'}`;
    userList.appendChild(li);
  });
}

// Thêm sản phẩm
document.getElementById("add-product-btn").addEventListener("click", async () => {
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const imageFile = document.getElementById("product-image").files[0];

  if (!name || !price || !imageFile) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const imageRef = ref(storage, `products/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    name,
    price,
    image: imageUrl
  });

  loadProducts();
});

// Hiển thị sản phẩm
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productList = document.getElementById("product-list-ul");
  productList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${data.image}" width="50" />
      <strong>${data.name}</strong> - ${data.price}
      <button onclick="editProduct('${docSnap.id}', '${data.name}', '${data.price}')">Edit</button>
      <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
    `;
    productList.appendChild(li);
  });
}

// Sửa sản phẩm
window.editProduct = (id, name, price) => {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = name;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-modal").style.display = "block";
};

document.getElementById("save-edit").addEventListener("click", async () => {
  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("edit-name").value;
  const price = document.getElementById("edit-price").value;

  await updateDoc(doc(db, "products", id), { name, price });
  document.getElementById("edit-modal").style.display = "none";
  loadProducts();
});

document.getElementById("close-edit").addEventListener("click", () => {
  document.getElementById("edit-modal").style.display = "none";
});

// Xoá sản phẩm
window.deleteProduct = async (id) => {
  if (confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};
