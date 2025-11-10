const updateForm = document.getElementById("updateForm");
const updateButton = document.getElementById("updateButton");
const deleteButton = document.getElementById("deleteButton");

const idEl = document.getElementById("id");
const nickEl = document.getElementById("nickname");

const nickStatus = document.getElementById("nicknameStatus");

const nickMsg = document.getElementById("nickMsg");

const modal = document.getElementById("deleteModal");
const backdrop = document.getElementById("deleteBackdrop");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

let nickValid = true;

let nickDupCheckFlag = true;

let lastFocused = null;

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

	// 한글(가~힣) + 숫자 + _ 만 허용, 길이 2~20
	const ok = /^[\uAC00-\uD7A30-9_]{2,20}$/.test(nickEl.value);
	if (!ok) {
		nickMsg.innerText = "한글, 숫자, _ 만 입력하세요 (2~20자)";
		return false;
	}
	return true;
}

// 닉네임 중복 체크
nickCheckBtn.addEventListener("click", function(e) {

	const body = new URLSearchParams({ id: idEl.value.trim(), nickname: nickEl.value.trim() });

	if (nickCheckBtn) { nickCheckBtn.disabled = false; nickCheckBtn.textContent = "중복 확인중..."; }

	fetch(`${APP_CTX}/UpdateNickCheck.do`, {
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

updateForm.addEventListener("submit", function(e) {
	e.preventDefault();

	if (updateButton) { updateButton.disabled = true; updateButton.textContent = "회원 수정 중..."; }

	const body = new URLSearchParams({ id: idEl.value, nickname: nickEl.value });

	fetch(`${APP_CTX}/UpdateSocialMember.do`, {
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
				alert("회원수정 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "회원수정 실패");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (updateButton) { updateButton.disabled = false; updateButton.textContent = "수정하기"; }
		});
});

function enableJoinIfReady() {
	const ready = nickValid && nickDupCheckFlag
	updateButton.disabled = !ready;
}

// 외부영역(backdrop) 클릭 닫기
backdrop.addEventListener("click", closeModal);
cancelDelete.addEventListener("click", closeModal);

// 열기
deleteButton.addEventListener("click", openModal);

// 삭제 확인
confirmDelete.addEventListener("click", function(e) {
	e.preventDefault();

	if (confirmDelete) { confirmDelete.disabled = true; confirmDelete.textContent = "회원 탈퇴 중..."; }

	const body = new URLSearchParams({ id: idEl.value.trim() });

	fetch(`${APP_CTX}/DeleteMember.do`, {
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
				alert("회원탈퇴 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "회원탈퇴 실패");
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			if (confirmDelete) { confirmDelete.disabled = false; confirmDelete.textContent = "탈퇴하기"; }
		});
});


function openModal() {
	lastFocused = document.activeElement;
	modal.classList.remove("hidden");
	// ESC로 닫기
	document.addEventListener("keydown", escClose);
}

function closeModal() {
	modal.classList.add("hidden");
	document.removeEventListener("keydown", escClose);
	if (lastFocused) lastFocused.focus();
}

function escClose(e) {
	if (e.key === "Escape") closeModal();
}


