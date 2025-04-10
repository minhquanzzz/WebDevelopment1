// Import Firebase SDK từ CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 🔧 Firebase config (Thay bằng thông tin thật từ Firebase Console của bạn)
const firebaseConfig = {
  apiKey : "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc" , 
  authDomain : "web-development-d110c.firebaseapp.com" , 
  projectId : "web-development-d110c" , 
  storageBucket : "web-development-d110c.firebasestorage.app" , 
  messagingSenderId : "646917777821" , 
  appId : "1:646917777821:web:4231def15898fc89ac6774" ,
};

// 🔌 Khởi tạo Firebase app & auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🎯 Bắt sự kiện khi nhấn nút Register
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn load lại trang

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "✅ Tạo tài khoản thành công!";
    message.style.color = "green";

    console.log("Người dùng:", userCredential.user);
    // Redirect nếu muốn:
    // window.location.href = "index.html";
  } catch (error) {
    message.textContent = `❌ Lỗi: ${error.message}`;
    message.style.color = "red";
  }
});
