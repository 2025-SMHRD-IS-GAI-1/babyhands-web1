logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("submit", function(e) {
	e.preventDefault();

	if (logoutButton) { logoutButton.disabled = true; logoutButton.textContent = "로그 아웃 중..."; }

	const body = new URLSearchParams({ });

	fetch(`${APP_CTX}/Logout.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then((data) => {
			if (data && data.ok) {
				alert("로그아웃 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message);
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (logoutButton) { logoutButton.disabled = false; logoutButton.textContent = "로그아웃"; }
		});
});