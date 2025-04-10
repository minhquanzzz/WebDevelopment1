const firebaseConfig = {
    apiKey : "AIzaSyC3zAz7lnoms99w8o1z74iQpXQvq7xakgc" , 
    authDomain : "web-development-d110c.firebaseapp.com" , 
    projectId : "web-development-d110c" , 
    storageBucket : "web-development-d110c.firebasestorage.app" , 
    messagingSenderId : "646917777821" , 
    appId : "1:646917777821:web:4231def15898fc89ac6774" , 
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");
  
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Lấy thông tin vai trò từ Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();
      const role = userDoc.data().role;
  
      message.textContent = "Đăng nhập thành công!";
      message.style.color = "green";
  
      // Chuyển hướng tùy theo vai trò
      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "index.html";
        }
      }, 1000);
    } catch (error) {
      message.textContent = "Lỗi: " + error.message;
      message.style.color = "red";
    }
  });
  