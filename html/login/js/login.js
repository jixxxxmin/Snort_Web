
document.querySelector("form").addEventListener("submit", function(e) {
    const id = document.getElementById("id");
    const pw = document.getElementById("password");

    if (!id.value.trim()) {
        e.preventDefault();
        id.setCustomValidity("아이디를 입력하세요.");
        id.reportValidity();
        return;
    } else {
        id.setCustomValidity("");
    }

    if (!pw.value.trim()) {
        e.preventDefault();
        pw.setCustomValidity("비밀번호를 입력하세요.");
        pw.reportValidity();
        return;
    } else {
        pw.setCustomValidity("");
    }
});
