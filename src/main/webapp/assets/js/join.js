const joinForm = document.getElementById("joinForm");
const joinButton = document.getElementById("joinButton");

const idEl = document.getElementById("id");
const pwEl = document.getElementById("pw");
const pw2El = document.getElementById("pw2");
const nickEl = document.getElementById("nickname");
const emailEl = document.getElementById("email");

const idCheckBtn = document.getElementById("idCheckBtn");
const nickCheckBtn = document.getElementById("nickCheckBtn");
const emailCheckBtn = document.getElementById("emailCheckBtn");

const idStatus = document.getElementById("idStatus");
const nickStatus = document.getElementById("nicknameStatus");
const emailStatus = document.getElementById("emailStatus");

const idMsg = document.getElementById("idMsg");
const pwMsg = document.getElementById("pwMsg");
const pw2Msg = document.getElementById("pw2Msg");
const nickMsg = document.getElementById("nickMsg");
const emailMsg = document.getElementById("emailMsg");

let idValid = false;
let pwValid = false;
let pw2Valid = false;
let nickValid = false;
let emailValid = false;

let idDupCheckFlag = false;
let nickDupCheckFlag = false;
let emailDupCheckFlag = false;

// 아이디 입력할때마다 검증
idEl.addEventListener("input", (e) => {
	if (e.isComposing) return;

	// 아이콘/중복확인 상태 초기화
	idStatus.classList.remove("show");
	idDupCheckFlag = false;

	// 메시지 클래스 초기화
	idMsg.classList.remove("ok", "error");
	idMsg.innerText = "";

	const idValidCheck = idValidate();

	// ===== 아이디 검사 =====
	if (idValidCheck) {
		idValid = true;
		idMsg.classList.add("ok");
		idMsg.innerText = "중복 확인을 진행하세요.";
	} else {
		idValid = false;
		idMsg.classList.add("error");
	}

	idCheckBtn.disabled = !idValidCheck;
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

// 아이디 중복 체크
idCheckBtn.addEventListener("click", function(e) {

	const body = new URLSearchParams({ id: idEl.value.trim() });

	if (idCheckBtn) { idCheckBtn.disabled = false; idCheckBtn.textContent = "중복 확인중..."; }

	fetch(`${APP_CTX}/IdCheck.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then((data) => {
			if (data && !data.ok) {
				idStatus.classList.add("show");
				idDupCheckFlag = true;
				idMsg.innerText = "중복 확인 완료";
				enableJoinIfReady();
			} else {
				alert("중복된 아이디가 있습니다");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (idCheckBtn) { idCheckBtn.textContent = "중복 확인"; }
		});
});


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


// 닉네임 입력할때마다 검증
nickEl.addEventListener("input", (e) => {

	// 아이콘/중복확인 상태 초기화
	nickStatus.classList.remove("show");
	nickDupCheckFlag = false;

	// 메시지 클래스 초기화
	nickMsg.classList.remove("ok", "error");
	nickMsg.innerText = "";

	const nickValidCheck = nickValidate();

	// ===== 닉네임 검사 =====
	if (nickValidCheck) {
		nickValid = true;
		nickMsg.classList.add("ok");
		nickMsg.innerText = "중복 확인을 진행하세요";
	} else {
		nickValid = false;
		nickMsg.classList.add("error");
	}

	nickCheckBtn.disabled = !nickValidCheck;
	enableJoinIfReady();
});

// 닉네임 검증 로직
function nickValidate() {
	if (!nickEl.value) {
		nickMsg.innerText = "닉네임을 입력하세요.";
		return false;
	}

	// 길이
	if (nickEl.value.length < 2 || nickEl.value.length > 20) {
		nickMsg.innerText = "닉네임 2~20자여야 합니다.";
		return false;
	}

	// 한글만
	if (!/^[\uAC00-\uD7A3]{2,20}$/.test(nickEl.value)) {
		nickMsg.innerText = "한글만 입력하세요 (2~20자)";
		return false;
	}
	return true;
}

// 닉네임 중복 체크
nickCheckBtn.addEventListener("click", function(e) {

	const body = new URLSearchParams({ nickname: nickEl.value.trim() });

	if (nickCheckBtn) { nickCheckBtn.disabled = false; nickCheckBtn.textContent = "중복 확인중..."; }

	fetch(`${APP_CTX}/NickNameCheck.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then((data) => {
			if (data && !data.ok) {
				nickStatus.classList.add("show");
				nickDupCheckFlag = true;
				nickMsg.innerText = "중복 확인 완료";
				enableJoinIfReady();
			} else {
				alert("중복된 닉네임이 있습니다");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (nickCheckBtn) { nickCheckBtn.textContent = "중복 확인"; }
		});
});

// 이메일 입력할때마다 검증
emailEl.addEventListener("input", (e) => {
	
	// 아이콘/중복확인 상태 초기화
	emailStatus.classList.remove("show");
	emailDupCheckFlag = false;
	
	// 메시지 클래스 초기화
	emailMsg.classList.remove("ok", "error");
	emailMsg.innerText = "";

	const emailValidCheck = emailValidate();

	// ===== 닉네임 검사 =====
	if (emailValidCheck) {
		emailValid = true;
		emailMsg.classList.add("ok");
		emailMsg.innerText = "중복 확인을 진행하세요";
	} else {
		emailValid = false;
		emailMsg.classList.add("error");
	}
	
	emailCheckBtn.disabled = !emailValidCheck;
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

// 이메일 중복 체크
emailCheckBtn.addEventListener("click", function(e) {

	const body = new URLSearchParams({ email: emailEl.value.trim() });

	if (emailCheckBtn) { emailCheckBtn.disabled = false; emailCheckBtn.textContent = "중복 확인중..."; }

	fetch(`${APP_CTX}/EmailCheck.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then((data) => {
			if (data && !data.ok) {
				emailStatus.classList.add("show");
				emailDupCheckFlag = true;
				emailMsg.innerText = "중복 확인 완료";
				enableJoinIfReady();
			} else {
				alert("중복된 닉네임이 있습니다");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (emailCheckBtn) { emailCheckBtn.textContent = "중복 확인"; }
		});
});


joinForm.addEventListener("submit", function(e) {
	e.preventDefault();

	if (joinButton) { joinButton.disabled = true; joinButton.textContent = "회원 가입 중..."; }

	const body = new URLSearchParams({ id: idEl.value.trim(), pw: pwEl.value, nickname: nickEl.value, email: emailEl.value });

	fetch(`${APP_CTX}/Join.do`, {
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
				alert("회원가입 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "회원가입 실패");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (joinButton) { joinButton.disabled = false; joinButton.textContent = "가입하기"; }
		});
});

function enableJoinIfReady() {
	const ready = idValid && idDupCheckFlag && pwValid && pw2Valid && nickValid && nickDupCheckFlag && emailValid && emailDupCheckFlag
	joinButton.disabled = !ready;
}