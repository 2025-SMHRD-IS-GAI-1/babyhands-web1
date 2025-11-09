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
	if (googleLoginButton) {
		googleLoginButton.disabled = true;
		const originalContent = googleLoginButton.innerHTML;
		googleLoginButton.innerHTML = '<span>로그인 중...</span>';
	}

	// 구글 클라이언트 ID (JSP에서 전달받은 값 사용)
	const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID;

	if (!GOOGLE_CLIENT_ID) {
		alert("구글 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.");
		console.error("구글 클라이언트 ID가 설정되지 않았습니다.");
		if (googleLoginButton) {
			googleLoginButton.disabled = false;
			googleLoginButton.innerHTML = originalContent;
		}
		return;
	}

	
	// Google API가 로드될 때까지 대기
	function initGoogleAuth() {
		if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
			// 구글 OAuth 토큰 클라이언트 초기화
			const tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: GOOGLE_CLIENT_ID,
				scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
				callback: function(response) {
					console.log("구글 로그인 응답:", response); // 디버깅용
					// 토큰을 받았으면 서버로 전송
					if (response.access_token) {
						sendTokenToServer(response.access_token);
					} else {
						alert("구글 로그인에 실패했습니다.");
						if (googleLoginButton) {
							googleLoginButton.disabled = false;
							googleLoginButton.innerHTML = originalContent;
						}
					}
				}
			});
			
			// 토큰 요청
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Google API가 아직 로드되지 않은 경우 잠시 후 재시도
			setTimeout(initGoogleAuth, 100);
		}
	}
	
	// Google API 로드 대기
	if (typeof google === 'undefined') {
		// Google API가 로드될 때까지 대기
		const checkGoogle = setInterval(function() {
			if (typeof google !== 'undefined' && google.accounts) {
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
				googleLoginButton.innerHTML = originalContent;
			}
		}, 10000);
	} else {
		initGoogleAuth();
	}
}

// 서버로 토큰 전송
function sendTokenToServer(accessToken) {
	const body = new URLSearchParams({ accessToken: accessToken });
	
	fetch(`${APP_CTX}/GoogleLogin.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: body,
		credentials: "same-origin",
	})
		.then(function(res) {
			return res.json();
		})
		.then(function(data) {
			if (data && data.ok) {
				alert("구글 로그인 성공");
				location.replace(data.redirect);
			} else {
				alert(data.message || "구글 로그인 실패");
				if (googleLoginButton) {
					googleLoginButton.disabled = false;
					const originalContent = '<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.158 6.656 3.58 9 3.58z"/></svg>구글로 로그인';
					googleLoginButton.innerHTML = originalContent;
				}
			}
		})
		.catch(function(err) {
			console.error("구글 로그인 오류:", err);
			alert("네트워크 오류가 발생했습니다.");
			if (googleLoginButton) {
				googleLoginButton.disabled = false;
				const originalContent = '<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.158 6.656 3.58 9 3.58z"/></svg>구글로 로그인';
				googleLoginButton.innerHTML = originalContent;
			}
		});
}

// 네이버 로그인 비동기 함수
function handleNaverLogin() {
	if (naverLoginButton) {
		naverLoginButton.disabled = true;
		const originalContent = naverLoginButton.innerHTML;
		naverLoginButton.innerHTML = '<span>로그인 중...</span>';
	}

	// 네이버 클라이언트 ID (JSP에서 전달받은 값 사용)
	const NAVER_CLIENT_ID = window.NAVER_CLIENT_ID;
	const redirectUri = window.location.origin + APP_CTX + '/NaverOAuthCallback.do';
	const state = generateRandomString(); // CSRF 방지를 위한 랜덤 문자열
	
	// state를 sessionStorage에 저장 (콜백에서 검증용)
	sessionStorage.setItem('naver_state', state);

	if (!NAVER_CLIENT_ID) {
		alert("네이버 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.");
		console.error("네이버 클라이언트 ID가 설정되지 않았습니다.");
		if (naverLoginButton) {
			naverLoginButton.disabled = false;
			naverLoginButton.innerHTML = originalContent;
		}
		return;
	}

	// 네이버 로그인 인증 URL 생성
	const naverAuthUrl = 'https://nid.naver.com/oauth2.0/authorize?' +
		'response_type=code' +
		'&client_id=' + encodeURIComponent(NAVER_CLIENT_ID) +
		'&redirect_uri=' + encodeURIComponent(redirectUri) +
		'&state=' + encodeURIComponent(state);

	// 팝업 창 열기
	const width = 500;
	const height = 600;
	const left = (screen.width - width) / 2;
	const top = (screen.height - height) / 2;
	
	const popup = window.open(
		naverAuthUrl,
		'네이버 로그인',
		'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes'
	);

	// 팝업에서 메시지 받기 (OAuth 완료 후)
	const messageListener = function(event) {
		if (event.origin !== window.location.origin) return;
		
		if (event.data.type === 'NAVER_AUTH_SUCCESS') {
			window.removeEventListener('message', messageListener);
			popup.close();
			sessionStorage.removeItem('naver_state');
			// 서버에서 이미 로그인 처리 완료, 리다이렉트만 수행
			if (event.data.redirect) {
				alert("네이버 로그인 성공");
				location.replace(event.data.redirect);
			} else {
				alert("네이버 로그인 성공");
				location.replace(APP_CTX + '/Gomain.do');
			}
		} else if (event.data.type === 'NAVER_AUTH_ERROR') {
			window.removeEventListener('message', messageListener);
			popup.close();
			sessionStorage.removeItem('naver_state');
			alert("네이버 로그인에 실패했습니다: " + (event.data.error || "알 수 없는 오류"));
			if (naverLoginButton) {
				naverLoginButton.disabled = false;
				naverLoginButton.innerHTML = originalContent;
			}
		}
	};
	
	window.addEventListener('message', messageListener);
	
	// 팝업이 닫혔는지 확인
	const checkClosed = setInterval(function() {
		if (popup.closed) {
			clearInterval(checkClosed);
			window.removeEventListener('message', messageListener);
			sessionStorage.removeItem('naver_state');
			if (naverLoginButton) {
				naverLoginButton.disabled = false;
				naverLoginButton.innerHTML = originalContent;
			}
		}
	}, 500);
}

// 랜덤 문자열 생성 (CSRF 방지용)
function generateRandomString() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 카카오 로그인 비동기 함수
function handleKakaoLogin() {
	if (kakaoLoginButton) {
		kakaoLoginButton.disabled = true;
		const originalContent = kakaoLoginButton.innerHTML;
		kakaoLoginButton.innerHTML = '<span>로그인 중...</span>';
	}

	// 카카오 클라이언트 ID (JSP에서 전달받은 값 사용)
	const KAKAO_REST_API_KEY = window.KAKAO_REST_API_KEY;
	const redirectUri = window.location.origin + APP_CTX + '/KakaoOAuthCallback.do';
	const state = generateRandomString(); // CSRF 방지를 위한 랜덤 문자열
	
	// state를 sessionStorage에 저장 (콜백에서 검증용)
	sessionStorage.setItem('kakao_state', state);

	if (!KAKAO_REST_API_KEY) {
		alert("카카오 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.");
		console.error("카카오 클라이언트 ID가 설정되지 않았습니다.");
		if (kakaoLoginButton) {
			kakaoLoginButton.disabled = false;
			kakaoLoginButton.innerHTML = originalContent;
		}
		return;
	}

	// 카카오 로그인 인증 URL 생성
	const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize?' +
		'response_type=code' +
		'&client_id=' + encodeURIComponent(KAKAO_REST_API_KEY) +
		'&redirect_uri=' + encodeURIComponent(redirectUri) +
		'&state=' + encodeURIComponent(state);

	// 팝업 창 열기
	const width = 500;
	const height = 600;
	const left = (screen.width - width) / 2;
	const top = (screen.height - height) / 2;
	
	const popup = window.open(
		kakaoAuthUrl,
		'카카오 로그인',
		'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes'
	);

	// 팝업에서 메시지 받기 (OAuth 완료 후)
	const messageListener = function(event) {
		if (event.origin !== window.location.origin) return;
		
		if (event.data.type === 'KAKAO_AUTH_SUCCESS') {
			window.removeEventListener('message', messageListener);
			popup.close();
			sessionStorage.removeItem('kakao_state');
			// 서버에서 이미 로그인 처리 완료, 리다이렉트만 수행
			if (event.data.redirect) {
				alert("카카오 로그인 성공");
				location.replace(event.data.redirect);
			} else {
				alert("카카오 로그인 성공");
				location.replace(APP_CTX + '/Gomain.do');
			}
		} else if (event.data.type === 'KAKAO_AUTH_ERROR') {
			window.removeEventListener('message', messageListener);
			popup.close();
			sessionStorage.removeItem('kakao_state');
			alert("카카오 로그인에 실패했습니다: " + (event.data.error || "알 수 없는 오류"));
			if (kakaoLoginButton) {
				kakaoLoginButton.disabled = false;
				kakaoLoginButton.innerHTML = originalContent;
			}
		}
	};
	
	window.addEventListener('message', messageListener);
	
	// 팝업이 닫혔는지 확인
	const checkClosed = setInterval(function() {
		if (popup.closed) {
			clearInterval(checkClosed);
			window.removeEventListener('message', messageListener);
			sessionStorage.removeItem('kakao_state');
			if (kakaoLoginButton) {
				kakaoLoginButton.disabled = false;
				kakaoLoginButton.innerHTML = originalContent;
			}
		}
	}, 500);
}

// 서버로 네이버 인증 코드 전송
function sendNaverCodeToServer(code, state) {
	const body = new URLSearchParams({ 
		code: code,
		state: state
	});
	
	fetch(`${APP_CTX}/NaverLogin.do`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
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
					naverLoginButton.disabled = false;
					const originalContent = '<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><rect width="18" height="18" fill="#03C75A" rx="2"/><path stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" d="M6 5.5v7M6 5.5l6 7M12 5.5v7"/></svg>네이버로 로그인';
					naverLoginButton.innerHTML = originalContent;
				}
			}
		})
		.catch(function(err) {
			console.error("네이버 로그인 오류:", err);
			alert("네트워크 오류가 발생했습니다.");
			if (naverLoginButton) {
				naverLoginButton.disabled = false;
				const originalContent = '<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;"><rect width="18" height="18" fill="#03C75A" rx="2"/><path stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" d="M6 5.5v7M6 5.5l6 7M12 5.5v7"/></svg>네이버로 로그인';
				naverLoginButton.innerHTML = originalContent;
			}
		});
}

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


	// 모든 검증 통과
	idMsg.innerText = "";
	pwMsg.innerText = "";


	return true;
};