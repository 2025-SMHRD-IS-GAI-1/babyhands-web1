const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton"); // 있으면 로딩표시용
const googleLoginButton = document.getElementById("googleLoginButton"); // 구글 로그인 버튼
const naverLoginButton = document.getElementById("naverLoginButton"); // 네이버 로그인 버튼
const kakaoLoginButton = document.getElementById("kakaoLoginButton"); // 카카오 로그인 버튼
const idEl = document.getElementById("id");
const pwEl = document.getElementById("pw");

// 구글 로그인 버튼 이벤트 리스너
if (googleLoginButton) {
	googleLoginButton.addEventListener("click", function(e) {
		e.preventDefault();
		handleGoogleLogin();
	});
}

// 네이버 로그인 버튼 이벤트 리스너
if (naverLoginButton) {
	naverLoginButton.addEventListener("click", function(e) {
		e.preventDefault();
		handleNaverLogin();
	});
}

// 카카오 로그인 버튼 이벤트 리스너
if (kakaoLoginButton) {
	kakaoLoginButton.addEventListener("click", function(e) {
		e.preventDefault();
		handleKakaoLogin();
	});
}

// 구글 로그인 비동기 함수
function handleGoogleLogin() {
	const googleOriginalContent = googleLoginButton
		? googleLoginButton.innerHTML
		: "";

	if (googleLoginButton) {
		googleLoginButton.disabled = true;
		googleLoginButton.style.opacity = "0.6";
		googleLoginButton.style.cursor = "not-allowed";
	}

	// 구글 클라이언트 ID (JSP에서 전달받은 값 사용)
	const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID;

	if (!GOOGLE_CLIENT_ID) {
		alert("구글 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.");
		console.error("구글 클라이언트 ID가 설정되지 않았습니다.");
		if (googleLoginButton) {
			googleLoginButton.disabled = false;
			googleLoginButton.style.opacity = "1";
			googleLoginButton.style.cursor = "pointer";
			googleLoginButton.innerHTML = googleOriginalContent;
		}
		return;
	}

	// Google API가 로드될 때까지 대기
	function initGoogleAuth() {
		if (
			typeof google !== "undefined" &&
			google.accounts &&
			google.accounts.oauth2
		) {
			// 구글 OAuth 토큰 클라이언트 초기화
			const tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: GOOGLE_CLIENT_ID,
				scope:
					"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
				callback: function(response) {
					console.log("구글 로그인 응답:", response); // 디버깅용
					// 토큰을 받았으면 서버로 전송
					if (response.access_token) {
						sendTokenToServer(response.access_token, googleOriginalContent);
					} else {
						alert("구글 로그인에 실패했습니다.");
						if (googleLoginButton) {
							googleLoginButton.disabled = false;
							googleLoginButton.style.opacity = "1";
							googleLoginButton.style.cursor = "pointer";
							googleLoginButton.innerHTML = googleOriginalContent;
						}
					}
				},
			});

			// 토큰 요청
			tokenClient.requestAccessToken({ prompt: "consent" });
		} else {
			// Google API가 아직 로드되지 않은 경우 잠시 후 재시도
			setTimeout(initGoogleAuth, 100);
		}
	}

	// Google API 로드 대기
	if (typeof google === "undefined") {
		// Google API가 로드될 때까지 대기
		const checkGoogle = setInterval(function() {
			if (typeof google !== "undefined" && google.accounts) {
				clearInterval(checkGoogle);
				initGoogleAuth();
			}
		}, 100);

		// 10초 후 타임아웃
		setTimeout(function() {
			clearInterval(checkGoogle);
			alert("구글 로그인을 초기화할 수 없습니다. 페이지를 새로고침해주세요.");
			if (googleLoginButton) {
				googleLoginButton.disabled = false;
				googleLoginButton.style.opacity = "1";
				googleLoginButton.style.cursor = "pointer";
				googleLoginButton.innerHTML = googleOriginalContent;
			}
		}, 10000);
	} else {
		initGoogleAuth();
	}
	
	googleLoginButton.disabled = false;
	googleLoginButton.innerHTML = googleOriginalContent;
}

// 서버로 토큰 전송
function sendTokenToServer(accessToken, originalContent) {
	const body = new URLSearchParams({ accessToken: accessToken });
	let loginSuccess = false;

	fetch(`${APP_CTX}/GoogleLogin.do`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then(function(data) {
			if (data && data.ok) {
				loginSuccess = true;
				alert("구글 로그인 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "구글 로그인 실패");
			}
		})
		.catch(function(err) {
			console.error("구글 로그인 오류:", err);
			alert("네트워크 오류가 발생했습니다.");
		})
		.finally(function() {
			googleLoginButton.disabled = false;
			googleLoginButton.style.opacity = "1";
			googleLoginButton.style.cursor = "pointer";
			googleLoginButton.innerHTML = originalContent;
		});
}

// 네이버 로그인 비동기 함수
function handleNaverLogin() {
	const naverOriginalContent = naverLoginButton
		? naverLoginButton.innerHTML
		: "";

	if (naverLoginButton) {
		naverLoginButton.disabled = true;
		naverLoginButton.style.opacity = "0.6";
		naverLoginButton.style.cursor = "not-allowed";
	}

	// 백엔드 서비스를 통해 네이버 OAuth 시작 (state는 백엔드에서 생성하고 세션에 저장)
	// 팝업 창 열기
	const width = 500;
	const height = 600;
	const left = (screen.width - width) / 2;
	const top = (screen.height - height) / 2;

	const popup = window.open(
		`${APP_CTX}/NaverOAuthStart.do`,
		"네이버 로그인",
		"width=" +
		width +
		",height=" +
		height +
		",left=" +
		left +
		",top=" +
		top +
		",resizable=yes,scrollbars=yes"
	);

	// 버튼 상태 복원 함수
	const restoreButton = function() {
		if (naverLoginButton) {
			naverLoginButton.disabled = false;
			naverLoginButton.style.opacity = "1";
			naverLoginButton.style.cursor = "pointer";
			naverLoginButton.innerHTML = naverOriginalContent;
		}
	};

	// 팝업에서 메시지 받기 (OAuth 완료 후)
	const messageListener = function(event) {
		if (event.origin !== window.location.origin) return;

		if (event.data.type === "NAVER_AUTH_SUCCESS") {
			window.removeEventListener("message", messageListener);
			popup.close();
			// 서버에서 이미 로그인 처리 완료, 리다이렉트만 수행
			if (event.data.redirect) {
				alert("네이버 로그인 성공");
				location.replace(event.data.redirect);
			} else {
				alert("네이버 로그인 성공");
				location.replace(APP_CTX + "/Gomain.do");
			}
		} else if (event.data.type === "NAVER_AUTH_ERROR") {
			window.removeEventListener("message", messageListener);
			popup.close();
			alert(
				"네이버 로그인에 실패했습니다: " +
				(event.data.error || "알 수 없는 오류")
			);
			restoreButton();
		}
	};

	window.addEventListener("message", messageListener);

	// 팝업이 닫혔는지 확인
	const checkClosed = setInterval(function() {
		if (popup.closed) {
			clearInterval(checkClosed);
			window.removeEventListener("message", messageListener);
			restoreButton();
		}
	}, 500);
}

// 카카오 로그인 비동기 함수
function handleKakaoLogin() {
	const kakaoOriginalContent = kakaoLoginButton
		? kakaoLoginButton.innerHTML
		: "";

	if (kakaoLoginButton) {
		kakaoLoginButton.disabled = true;
		kakaoLoginButton.style.opacity = "0.6";
		kakaoLoginButton.style.cursor = "not-allowed";
	}

	// 백엔드 서비스를 통해 카카오 OAuth 시작 (state는 백엔드에서 생성하고 세션에 저장)
	// 팝업 창 열기
	const width = 500;
	const height = 600;
	const left = (screen.width - width) / 2;
	const top = (screen.height - height) / 2;

	const popup = window.open(
		`${APP_CTX}/KakaoOAuthStart.do`,
		"카카오 로그인",
		"width=" +
		width +
		",height=" +
		height +
		",left=" +
		left +
		",top=" +
		top +
		",resizable=yes,scrollbars=yes"
	);

	// 버튼 상태 복원 함수
	const restoreButton = function() {
		if (kakaoLoginButton) {
			kakaoLoginButton.disabled = false;
			kakaoLoginButton.style.opacity = "1";
			kakaoLoginButton.style.cursor = "pointer";
			kakaoLoginButton.innerHTML = kakaoOriginalContent;
		}
	};

	// 팝업에서 메시지 받기 (OAuth 완료 후)
	const messageListener = function(event) {
		if (event.origin !== window.location.origin) return;

		if (event.data.type === "KAKAO_AUTH_SUCCESS") {
			window.removeEventListener("message", messageListener);
			popup.close();
			// 서버에서 이미 로그인 처리 완료, 리다이렉트만 수행
			if (event.data.redirect) {
				alert("카카오 로그인 성공");
				location.replace(event.data.redirect);
			} else {
				alert("카카오 로그인 성공");
				location.replace(APP_CTX + "/Gomain.do");
			}
		} else if (event.data.type === "KAKAO_AUTH_ERROR") {
			window.removeEventListener("message", messageListener);
			popup.close();
			alert(
				"카카오 로그인에 실패했습니다: " +
				(event.data.error || "알 수 없는 오류")
			);
			restoreButton();
		}
	};

	window.addEventListener("message", messageListener);

	// 팝업이 닫혔는지 확인
	const checkClosed = setInterval(function() {
		if (popup.closed) {
			clearInterval(checkClosed);
			window.removeEventListener("message", messageListener);
			restoreButton();
		}
	}, 500);
}

// 서버로 네이버 인증 코드 전송
function sendNaverCodeToServer(code, state) {
	const body = new URLSearchParams({
		code: code,
		state: state,
	});

	fetch(`${APP_CTX}/NaverLogin.do`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then(function(data) {
			if (data && data.ok) {
				alert("네이버 로그인 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "네이버 로그인 실패");
				if (naverLoginButton) {
					const originalContent =
						'<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><rect width="18" height="18" fill="#03C75A" rx="2"/><path stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" d="M6 5.5v7M6 5.5l6 7M12 5.5v7"/></svg>네이버로 로그인';
					naverLoginButton.innerHTML = originalContent;
				}
			}
		})
		.catch(function(err) {
			console.error("네이버 로그인 오류:", err);
			alert("네트워크 오류가 발생했습니다.");
			if (naverLoginButton) {
				const originalContent =
					'<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><rect width="18" height="18" fill="#03C75A" rx="2"/><path stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" d="M6 5.5v7M6 5.5l6 7M12 5.5v7"/></svg>네이버로 로그인';
				naverLoginButton.innerHTML = originalContent;
			}
		});
}

loginForm.addEventListener("submit", function(e) {
	e.preventDefault();
	if (!validate()) return;

	if (loginButton) {
		loginButton.disabled = true;
		loginButton.textContent = "로그인 중...";
	}

	const body = new URLSearchParams({ id: idEl.value.trim(), pw: pwEl.value });

	fetch(`${APP_CTX}/Login.do`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
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
			if (loginButton) {
				loginButton.disabled = false;
				loginButton.textContent = "로그인";
			}
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
		/[^\w\s]/.test(pwEl.value), // 특수문자
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
}
