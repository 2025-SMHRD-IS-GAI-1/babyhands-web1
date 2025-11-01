const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton"); // 있으면 로딩표시용
const idEl = document.getElementById("id");
const pwEl = document.getElementById("pw");

loginForm.addEventListener("submit", function(e) {
	e.preventDefault();
	if (!validate()) return;

	if (loginButton) { loginButton.disabled = true; loginButton.textContent = "로그인 중..."; }

	const body = new URLSearchParams({ id: idEl.value.trim(), pw: pwEl.value });

	fetch(`${APP_CTX}/Login.do`, {
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
				alert("로그인 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "로그인 실패");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (loginButton) { loginButton.disabled = false; loginButton.textContent = "로그인"; }
		});
});

// 로그인 전에 검증 로직
function validate() {

	const idMsg = document.getElementById("idMsg");
	const pwMsg = document.getElementById("pwMsg");

	idMsg.innerText = "";
	pwMsg.innerText = "";

	idEl.value = idEl.value.trim();


	// ===== 아이디 검사 =====
	if (!idEl.value) {
		idMsg.innerText = "아이디를 입력하세요.";
		idEl.focus();
		return false;
	}

	// 길이
	if (idEl.value.length < 4 || idEl.value.length > 20) {
		idMsg.innerText = "아이디는 4~20자여야 합니다.";
		idEl.focus();
		return false;
	}

	// 허용 문자(영문 소문자/숫자/._-만)
	if (!/^[a-z0-9._-]+$/.test(idEl.value)) {
		idMsg.innerText = "영문 소문자, 숫자, ., _, -만 사용할 수 있습니다.";
		idEl.focus();
		return false;
	}

	// ===== 비밀번호 검사 =====
	if (!pwEl.value) {
		pwMsg.innerText = "비밀번호를 입력하세요.";
		pwEl.focus();
		return false;
	}

	// 길이
	if (pwEl.value.length < 10 || pwEl.value.length > 20) {
		pwMsg.innerText = "비밀번호는 10~20자여야 합니다.";
		pwEl.focus();
		return false;
	}

	// 공백(원치 않으면 금지)
	if (/\s/.test(pwEl.value)) {
		pwMsg.innerText = "비밀번호에 공백을 사용할 수 없습니다.";
		pwEl.focus();
		return false;
	}

	// 문자군 3종 이상
	const classes = [
		/[a-z]/.test(pwEl.value),
		/[A-Z]/.test(pwEl.value),
		/\d/.test(pwEl.value),
		/[^\w\s]/.test(pwEl.value) // 특수문자
	].filter(Boolean).length;

	if (classes < 3) {
		pwMsg.innerText = "소문자/대문자/숫자/특수문자 중 3종 이상을 포함하세요.";
		pwEl.focus();
		return false;
	}


	// 모든 검증 통과
	idMsg.innerText = "";
	pwMsg.innerText = "";


	return true;
};