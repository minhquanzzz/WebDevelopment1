// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Lấy phần tử giao diện
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const message = document.getElementById("login-message");

// Nếu đã đăng nhập → kiểm tra quyền
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  }
});

// Sự kiện khi người dùng nhấn nút đăng nhập
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    message.textContent = "Đăng nhập thành công! Đang kiểm tra quyền...";

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (error) {
    if (error.code === "auth/user-not-found") {
      message.textContent = "Tài khoản không tồn tại.";
    } else if (error.code === "auth/wrong-password") {
      message.textContent = "Sai mật khẩu.";
    } else if (error.code === "auth/invalid-email") {
      message.textContent = "Email không hợp lệ.";
    } else {
      message.textContent = `Lỗi: ${error.message}`;
    }
  }
});
