
(function () {
    const params = new URLSearchParams(window.location.search);
  
    const failed = params.get("login_failed");
    const el = document.getElementById("login-error");

    if (!el) return;

    if (failed === "1") {
        el.textContent = "Invalid ID or password.";
        el.style.display = "block";
    } else {
        el.textContent = "";
        el.style.display = "none";
    }
    if (failed) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})();
