// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com",
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const message = document.getElementById('login-message');

// Xử lý đăng nhập
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      message.style.color = "green";
      message.textContent = "Đăng nhập thành công! Đang chuyển trang...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    })
    .catch((error) => {
      message.style.color = "red";
      message.textContent = `Lỗi: ${error.message}`;
      console.error("Lỗi đăng nhập:", error);
    });
});
