const findPwForm = document.getElementById("findPwForm");

const idEl = document.getElementById("id");
const emailEl = document.getElementById("email");

const idMsg = document.getElementById("idMsg");
const emailMsg = document.getElementById("emailMsg");

const findPwButton = document.getElementById("findPwButton");

let idValid = false;
let emailValid = false;

// 아이디 입력할때마다 검증
idEl.addEventListener("input", (e) => {
	if (e.isComposing) return;

	// 메시지 클래스 초기화
	idMsg.classList.remove("ok", "error");
	idMsg.innerText = "";

	const idValidCheck = idValidate();

	// ===== 아이디 검사 =====
	if (idValidCheck) {
		idValid = true;
		idMsg.classList.add("ok");
		idMsg.innerText = "올바른 아이디 형식입니다";
	} else {
		idValid = false;
		idMsg.classList.add("error");
	}

	enableJoinIfReady();
});

// 아이디 검증 로직
function idValidate() {
	if (!idEl.value) {
		idMsg.innerText = "아이디를 입력하세요.";
		return false;
	}

	// 길이
	if (idEl.value.length < 4 || idEl.value.length > 20) {
		idMsg.innerText = "아이디는 4~20자여야 합니다.";
		return false;
	}

	// 허용 문자(영문 소문자/숫자만)
	if (!/^[a-z0-9]+$/.test(idEl.value)) {
		idMsg.innerText = "영문 소문자, 숫자만 사용할 수 있습니다.";
		return false;
	}
	return true;
}


// 이메일 입력할때마다 검증
emailEl.addEventListener("input", (e) => {

	// 메시지 클래스 초기화
	emailMsg.classList.remove("ok", "error");
	emailMsg.innerText = "";

	const emailValidCheck = emailValidate();

	// ===== 닉네임 검사 =====
	if (emailValidCheck) {
		emailValid = true;
		emailMsg.classList.add("ok");
		emailMsg.innerText = "올바른 이메일 형식 입니다";
	} else {
		emailValid = false;
		emailMsg.classList.add("error");
	}

	enableJoinIfReady();
});

// 이메일 검증 로직
function emailValidate() {
	if (!emailEl.value) {
		emailMsg.innerText = "이메일을 입력하세요";
		return false;
	}

	if (emailEl.value.length > 100) {
		emailMsg.innerText = "이메일은 100자 이내로 입력하세요";
		return false;
	}

	const emailRe = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
	// 형식
	if (!emailRe.test(emailEl.value)) {
		emailMsg.innerText = "이메일 형식을 확인하세요 (예: name@example.com)";
		return false;
	}

	return true;
}

findPwForm.addEventListener("submit", function(e) {
	e.preventDefault();

	if (findPwButton) { findPwButton.disabled = true; findPwButton.textContent = "비밀번호 찾기 중..."; }

	const body = new URLSearchParams({ id: idEl.value, email: emailEl.value });

	fetch(`${APP_CTX}/FindPw.do`, {
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
				alert("비밀번호 찾기 성공\n입력한 이메일에서 비밀번호를 확인하세요");
			} else {
				alert(data.message);
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (findPwButton) { findPwButton.disabled = false; findPwButton.textContent = "비밀번호 찾기"; }
		});
});

function enableJoinIfReady() {
	const ready = idValid && emailValid;
	findPwButton.disabled = !ready;
}