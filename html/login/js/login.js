
document.getElementById("login-form").addEventListener("submit", function(e) {
    const id = document.getElementById("id").value.trim();
    const pw = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error-msg");

    if (!id) {
        e.preventDefault();
        errorBox.textContent = "아이디를 입력하세요.";
        errorBox.style.display = "block";
        return;
    }

    if (!pw) {
        e.preventDefault();
        errorBox.textContent = "비밀번호를 입력하세요.";
        errorBox.style.display = "block";
        return;
    }

    errorBox.style.display = "none";
});
