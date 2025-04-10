// Cấu hình Firebase
const firebaseConfig = {
  apiKey : "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc" , 
  authDomain : "web-development-d110c.firebaseapp.com" , 
  projectId : "web-development-d110c" , 
  storageBucket : "web-development-d110c.firebasestorage.app" , 
  messagingSenderId : "646917777821" , 
  appId : "1:646917777821:web:4231def15898fc89ac6774" , 
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Khởi tạo Auth & Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Xử lý sự kiện đăng ký
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    // Đăng ký tài khoản
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      email: user.email,
      role: "user", // Gắn role tại đây
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Thêm người dùng vào Firestore
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    message.textContent = "Đăng ký thành công!";
    message.style.color = "green";

    // Chuyển hướng nếu muốn
    // window.location.href = "index.html";
  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
});
