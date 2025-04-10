import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com", // ← sửa lại `.app` thành `.appspot.com`
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const registerForm = document.getElementById("register-form");
const emailInput = document.getElementById("register-email");
const passwordInput = document.getElementById("register-password");
const message = document.getElementById("register-message");

// Sự kiện đăng ký
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Tự động đăng nhập thành công
      message.textContent = "Đăng ký thành công! Đang chuyển hướng...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        message.textContent = "Email đã tồn tại. Vui lòng đăng nhập.";
      } else {
        message.textContent = `Lỗi: ${errorMessage}`;
      }
    });
});
