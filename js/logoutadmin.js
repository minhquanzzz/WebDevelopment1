// ✅ Đăng xuất
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("Đăng xuất thành công");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Lỗi khi đăng xuất:", error);
        });
    });
  }
});