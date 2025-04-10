// Nhúng Firebase SDK từ CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ⚙️ Cấu hình Firebase (bạn thay bằng thông tin project thật từ Firebase Console)
const firebaseConfig = {
    apiKey : "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc" , 
    authDomain : "web-development-d110c.firebaseapp.com" , 
    projectId : "web-development-d110c" , 
    storageBucket : "web-development-d110c.firebasestorage.app" , 
    messagingSenderId : "646917777821" , 
    appId : "1:646917777821:web:4231def15898fc89ac6774" ,
};

// 🔌 Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🎯 Bắt sự kiện khi submit form login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "✅ Đăng nhập thành công!";
    message.style.color = "green";
    console.log("User:", userCredential.user);

    // 👉 Chuyển đến trang chính
    // window.location.href = "admin.html"; // hoặc product.html...

  } catch (error) {
    message.textContent = `❌ Lỗi: ${error.message}`;
    message.style.color = "red";
  }
});
