// ------------------------------------------------------------------
// 메인 초기화 함수
// (화면 순서 1: 사이드바)

const sidebar = document.querySelector('.sidebar');
const videoEl = document.getElementById('learning_video');
const subtitleEl = document.querySelector('.section-subtitle');
const progressBar = document.querySelector('.progress-bar');
const percentEl = document.querySelector('.accuracy-percent');
const hiddenSlId = document.getElementById('slId');
const currentPredEl = document.querySelector('.current-prediction');

// FastAPI 서버 주소 (설정 가능)
const AI_SERVER_URL = 'http://127.0.0.1:8000';
const AI_WS_URL = 'ws://127.0.0.1:8000/ws';

// 전역 변수
let currentSlId = null;
let currentMeaning = '';  // 현재 학습 중인 글자
let aiSocket = null;
let captureInterval = null;
let canvas = null;
let ctx = null;
let successSet = null;
let todaySet = null;

function startApp() {
	// 1. 사이드바 HTML 요소 가져오기
	const actJamoBtn = document.querySelector('.word-item.active');
	const webcam = document.getElementById('webcam');

	// -----------------------------------------------------------------------
	// 2. 초기 글자 설정
	if (actJamoBtn) {
		subtitleEl.textContent = `학습 글자 : ${actJamoBtn.textContent.trim()}`;
		currentSlId = Number(actJamoBtn.dataset.slId);
		currentMeaning = actJamoBtn.dataset.meaning || actJamoBtn.textContent.trim();
		if (hiddenSlId) hiddenSlId.value = currentSlId;
		if (actJamoBtn.dataset.src) {
			videoEl.src = actJamoBtn.dataset.src;
			videoEl.load();
		}
	} else {
		subtitleEl.textContent = '학습 글자 : 글자를 선택하세요';
	}

	//-------------------------------------------------------
	// 3. 웹캠 연결 함수 호출
	if (webcam && percentEl && progressBar) {
		startWebcam(webcam, percentEl, progressBar);
	}
}

document.addEventListener('DOMContentLoaded', startApp);

// -----------------------------------------------------
// 웹캠 연결 함수
/**
 * 시스템 아키텍쳐(WebSocket)를 반영한 웹캠 연결 함수
 * 비동기 함수
 */
function startWebcam(videoElement, accuracyPercent, progressBar) {
	// 웹캠 사용 가능 여부 확인 후 스트림을 요청합니다.
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: 'user'
				}
			})
			.then((stream) => {
				// 1. 웹캠 영상을 video 요소의 srcObject로 연결.
				videoElement.srcObject = stream;
				videoElement.play();

				// 2. Canvas 생성 (비디오 프레임 캡처용)
				if (!canvas) {
					canvas = document.createElement('canvas');
					canvas.width = 640;
					canvas.height = 480;
					ctx = canvas.getContext('2d');
				}

				// 3. WebSocket 연결
				connectWebSocket(accuracyPercent, progressBar);

			})
			.catch((error) => {
				console.error(
					'웹캠을 켜지 못했습니다. 카메라 권한을 확인해주세요.',
					error
				);
				alert('웹캠을 켜지 못했습니다. 카메라 권한을 확인해주세요.');
			});
	} else {
		// 브라우저가 웹캠을 아예 지원 안 할 경우
		console.error('이 브라우저는 웹캠 기능을 지원하지 않습니다.');
		alert('이 브라우저는 웹캠 기능을 지원하지 않습니다.');
	}
}

/**
 * WebSocket 연결 및 이미지 전송 함수
 */
function connectWebSocket(accuracyPercent, progressBar) {
	// AI 서버(FastAPI) 주소
	aiSocket = new WebSocket(AI_WS_URL);

	aiSocket.onopen = () => {
		console.log('✅ AI 서버와 연결되었습니다.');

		// 연결 성공 시 주기적으로 프레임 캡처 및 전송 시작 (약 10fps)
		const webcam = document.getElementById('webcam');
		captureInterval = setInterval(() => {
			if (webcam && webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
				captureAndSendFrame(webcam);
			}
		}, 100); // 100ms = 10fps
	};

	// AI 서버로부터 예측 결과를 메시지(이벤트)로 수신
	aiSocket.onmessage = (event) => {
		try {
			const aiResponse = JSON.parse(event.data);

			if (aiResponse.accuracy !== undefined) {
				// 서버는 정수 0~100 내려주지만 혹시 모를 타입 혼동을 방지

				const prediction = (aiResponse.prediction || '').trim();

				// 예측 결과와 현재 학습 글자 비교 (유니코드 정규화 포함)
				const target = (currentMeaning || '').trim().normalize('NFC');
				const pred = prediction.normalize('NFC');
				const isCorrect = pred && target && pred === target;

				if (pred == target) {

					const accuracyScore = Math.max(0, Math.min(100, parseInt(aiResponse.accuracy, 10)));

					if (accuracyScore >= 60 && isCorrect) {
						progressBar.style.backgroundColor = '#4caf50';
					} else if (accuracyScore >= 40) {
						progressBar.style.backgroundColor = '#ff9800';
					} else {
						progressBar.style.backgroundColor = '#f44336';
					}

					// 정확도 UI
					accuracyPercent.textContent = `${accuracyScore}%`;
					progressBar.style.width = `${accuracyScore}%`;

					// 60% 이상이고 오늘 수어 학습 리스트에 없으면 수어 학습 테이블에 넣음
					if (accuracyScore >= 60 && !todaySet.has(currentSlId)) {
						todaySet.add(currentSlId);
						
						if(!successSet.has(currentSlId)) {
							successSet.add(currentSlId);
						}
						
						document.querySelectorAll('.word-item').forEach(a => {
							const id = String(a.dataset.slId);
							if (successSet.has(id)) a.closest('li').classList.add('learned');
							else a.closest('li').classList.remove('learned');
						});


						const body = new URLSearchParams({ slId: currentSlId });

						fetch(`${APP_CTX}/SlLearnSuccess.do`, {
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
									alert("학습 성공");
								} else {
									alert(data.message);
								}
							})
							.catch(function(err) {
								console.error(err);
								alert("네트워크 오류가 발생했습니다.");
							})
					}

				} else {
					accuracyPercent.textContent = `0%`;
					progressBar.style.backgroundColor = '#f44336';
					progressBar.style.width = `0%`;
				}

				console.log(target + " " + pred);

			}

			if (aiResponse.error) {
				console.error('AI 서버 오류:', aiResponse.error);
			}
		} catch (e) {
			console.error('AI 서버 메시지 파싱 실패:', event.data, e);
		}
	};

	aiSocket.onerror = (error) => {
		console.error('AI 서버 연결 중 오류가 발생했습니다.', error);
		// 연결 실패 시 재연결 시도 (선택사항)
		setTimeout(() => {
			if (aiSocket.readyState === WebSocket.CLOSED) {
				console.log('재연결 시도 중...');
				connectWebSocket(accuracyPercent, progressBar);
			}
		}, 3000);
	};

	aiSocket.onclose = () => {
		console.log('AI 서버와 연결이 끊어졌습니다.');
		// 캡처 중지
		if (captureInterval) {
			clearInterval(captureInterval);
			captureInterval = null;
		}
	};
}

/**
 * 비디오 프레임을 캡처하여 WebSocket으로 전송
 */
function captureAndSendFrame(videoElement) {
	if (!aiSocket || aiSocket.readyState !== WebSocket.OPEN) {
		return;
	}

	if (!canvas || !ctx) {
		return;
	}

	try {
		// Canvas에 현재 비디오 프레임 그리기
		ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

		// Canvas를 Base64 JPEG로 변환
		const imageData = canvas.toDataURL('image/jpeg', 0.8);

		// WebSocket으로 전송
		const message = {
			type: 'image',
			data: imageData
		};

		aiSocket.send(JSON.stringify(message));
	} catch (error) {
		console.error('프레임 캡처 오류:', error);
	}
}

/**
 * WebSocket 연결 종료
 */
function disconnectWebSocket() {
	if (aiSocket) {
		aiSocket.close();
		aiSocket = null;
	}
	if (captureInterval) {
		clearInterval(captureInterval);
		captureInterval = null;
	}
}

// 페이지를 떠날 때 연결 종료
window.addEventListener('beforeunload', () => {
	disconnectWebSocket();
});

function learnMark() {
	const body = new URLSearchParams({});

	fetch(`${APP_CTX}/LearnSuccessList.do`, {
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

				successSet = new Set(data.successlist);

				document.querySelectorAll('.word-item').forEach(a => {
					const id = String(a.dataset.slId);
					if (successSet.has(id)) a.closest('li').classList.add('learned');
					else a.closest('li').classList.remove('learned');
				});

				todaySet = new Set(data.todaySuccessList);
			} else {
				alert(data.message);
			}
		})
		.catch(function(err) {
			console.error(err);
			alert("네트워크 오류가 발생했습니다.");
		})
}

learnMark();


// 사이드바 클릭 이벤트(이벤트 위임)
(function() {
	if (!sidebar) return;

	sidebar.addEventListener('click', function(e) {
		const a = e.target.closest('a.word-item');
		if (!a) return;
		e.preventDefault();

		// 1) slId 세팅
		currentSlId = a.dataset.slId;
		currentMeaning = a.dataset.meaning || a.textContent.trim();

		if (hiddenSlId) hiddenSlId.value = currentSlId;

		// 2) 자막/정확도 초기화
		if (subtitleEl) subtitleEl.textContent = '학습 글자 : ' + currentMeaning;
		if (progressBar) {
			progressBar.style.width = '0%';
			progressBar.style.backgroundColor = '#4caf50'; // 기본 색상
		}
		if (percentEl) percentEl.textContent = '0%';

		// 3) 비디오 교체
		try {
			if (a.dataset.src) {
				videoEl.src = a.dataset.src;
				videoEl.load();

				const tryPlay = () => {
					const p = videoEl.play();
					if (p && typeof p.then === 'function') p.catch(() => { });
				};

				if (videoEl.readyState >= 1) tryPlay();
				else {
					videoEl.addEventListener('loadedmetadata', function onMeta() {
						videoEl.removeEventListener('loadedmetadata', onMeta);
						tryPlay();
					});
				}
			}
		} catch (err) {
			console.error('비디오 로드 실패:', err);
			alert('영상을 불러오지 못했습니다. 경로를 확인하세요.');
		}

		// (선택) active 클래스 토글
		document.querySelectorAll('.word-item.active').forEach(el => el.classList.remove('active'));
		a.classList.add('active');


	});
})();
