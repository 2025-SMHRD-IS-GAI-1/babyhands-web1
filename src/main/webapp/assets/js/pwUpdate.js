const updatePwForm = document.getElementById("updatePwForm");

const idEl = document.getElementById("id");
const pwEl = document.getElementById("pw");
const pw2El = document.getElementById("pw2");

const pwMsg = document.getElementById("pwMsg");
const pw2Msg = document.getElementById("pw2Msg");

const updatePwButton = document.getElementById("updatePwButton");

let pwValid = false;
let pw2Valid = false;


// 비밀번호 입력할때마다 검증
pwEl.addEventListener("input", (e) => {
	if (e.isComposing) return;

	// 메시지 클래스 초기화
	pwMsg.classList.remove("ok", "error");
	pwMsg.innerText = "";

	pw2Valid = false;
	pw2Msg.innerText = "";
	pw2Msg.classList.remove("ok", "error");

	const pwValidCheck = pwValidate();

	// ===== 비밀번호 검사 =====
	if (pwValidCheck) {
		pwValid = true;
		pwMsg.classList.add("ok");
		pwMsg.innerText = "사용 가능한 비밀번호입니다";
	} else {
		pwValid = false;
		pwMsg.classList.add("error");
	}

	enableJoinIfReady();
});

// 비밀번호 검증 로직
function pwValidate() {
	// ===== 비밀번호 검사 =====
	if (!pwEl.value) {
		pwMsg.innerText = "비밀번호를 입력하세요.";
		pwEl.focus();
		return false;
	}

	// 길이
	if (pwEl.value.length < 8 || pwEl.value.length > 20) {
		pwMsg.innerText = "비밀번호는 8~20자여야 합니다.";
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

	return true;
}

// 비밀번호 확인 입력할때마다 검증
pw2El.addEventListener("input", (e) => {
	if (e.isComposing) return;

	// 메시지 클래스 초기화
	pw2Msg.classList.remove("ok", "error");
	pw2Msg.innerText = "";

	if (pwEl.value == "") {
		pw2Valid = false;
		pw2Msg.classList.add("error");
		pw2Msg.innerText = "먼저 비밀번호를 입력하세요";
		return;
	}

	// ===== 비밀번호 확인 검사 =====
	if (pwEl.value == pw2El.value) {
		pw2Valid = true;
		pw2Msg.classList.add("ok");
		pw2Msg.innerText = "비밀번호가 일치합니다";
	} else {
		pw2Valid = false;
		pw2Msg.classList.add("error");
		pw2Msg.innerText = "비밀번호가 일치하지 않습니다";
	}
	enableJoinIfReady();
});


updatePwForm.addEventListener("submit", function(e) {
	e.preventDefault();

	if (updatePwButton) { updatePwButton.disabled = true; updatePwButton.textContent = "비밀번호 재설정 중..."; }

	const body = new URLSearchParams({ id: idEl.value, pw: pwEl.value });

	fetch(`${APP_CTX}/PwUpdate.do`, {
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
				alert("비밀번호 재설정 성공\n로그인 화면으로 돌아갑니다.");
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
			if (updatePwButton) { updatePwButton.disabled = false; updatePwButton.textContent = "비밀번호 재설정"; }
		});
});

function enableJoinIfReady() {
	const ready = pwValid && pw2Valid;
	updatePwButton.disabled = !ready;
}