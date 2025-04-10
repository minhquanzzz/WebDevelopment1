import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Cấu hình Firebase (sửa lại storageBucket cho đúng)
const firebaseConfig = {
  apiKey: "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc",
  authDomain: "web-development-d110c.firebaseapp.com",
  projectId: "web-development-d110c",
  storageBucket: "web-development-d110c.appspot.com", // ✅ đã sửa
  messagingSenderId: "646917777821",
  appId: "1:646917777821:web:4231def15898fc89ac6774",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const registerForm = document.getElementById('register-form');
const emailInput = document.getElementById('register-email');
const passwordInput = document.getElementById('register-password');
const message = document.getElementById('register-message');

// Đăng ký tài khoản
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Lưu thông tin người dùng vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });

    message.textContent = "Đăng ký thành công! Đang đăng nhập...";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    message.textContent = `Lỗi: ${error.message}`;
  }
});
