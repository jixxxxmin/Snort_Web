
(function () {
  function showErrorIfNeeded() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login_failed") === "1") {
      const el = document.getElementById("error-msg");
      if (el) el.hidden = false;
    }
  }
  showErrorIfNeeded();
})();
