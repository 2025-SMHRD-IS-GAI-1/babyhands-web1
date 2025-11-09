const findIdForm = document.getElementById("findIdForm");

const emailEl = document.getElementById("email");

const emailMsg = document.getElementById("emailMsg");

const findIdButton = document.getElementById("findIdButton");

let emailValid = false;

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


findIdForm.addEventListener("submit", function(e) {
	e.preventDefault();
	
	const emailValidCheck = emailValidate();

	// ===== 닉네임 검사 =====
	if (emailValidCheck) {
		emailMsg.classList.add("ok");
		emailMsg.innerText = "올바른 이메일 형식 입니다";
	} else {
		emailMsg.classList.add("error");
		return;
	}
	

	if (findIdButton) { findIdButton.disabled = true; findIdButton.textContent = "아이디 찾기 중..."; }

	const body = new URLSearchParams({ email: emailEl.value });

	fetch(`${APP_CTX}/FindId.do`, {
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
				alert("아이디 찾기 성공\n입력한 이메일에서 아이디를 확인하세요.");
			} else {
				alert(data.message);
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (findIdButton) { findIdButton.disabled = false; findIdButton.textContent = "아이디 찾기"; }
		});
});

function enableJoinIfReady() {
	findIdButton.disabled = !emailValid;
}