// ------------------------------------------------------------------
// 메인 초기화 함수
// (화면 순서 1: 사이드바)

const sidebar = document.querySelector('.sidebar');
const videoEl = document.getElementById('learning_video');
const subtitleEl = document.querySelector('.section-subtitle');
const progressBar = document.querySelector('.progress-bar');
const percentEl = document.querySelector('.accuracy-percent');
const hiddenSlId = document.getElementById('slId');


function startApp() {

	// 1. 사이드바 HTML 요소 가져오기
	const actJamoBtn = document.querySelector('.word-item.active');
	const webcam = document.getElementById('webcam');

	// -----------------------------------------------------------------------
	// 2. 초기 글자 설정
	if (actJamoBtn) {
		CharDisplay.textContent = `학습 글자 : ${actJamoBtn.textContent}`;
		currentSlId = Number(actJamoBtn.dataset.slId);
		if (hiddenSlId) hiddenSlId.value = currentSlId;
		if (actJamoBtn.dataset.src) {
			videoEl.src = actJamoBtn.dataset.src;
			videoEl.load();
		}
	} else {
		subtitleEl.textContent = '학습 글자 : 글자를 선택하세요';
	}

	//-------------------------------------------------------
	// 5. 웹캠 연결 함수 호출
	if (webcam && percentEl && progressBar) {
		startWebcam(webcam, percentEl, progressBar);
	}
}

document.addEventListener('DOMContentLoaded', startApp);

// -----------------------------------------------------
// 5. 웹캠 연결 함수 (함수 정의)
// (화면 순서 3: 웹캠)

/**
 * 시스템 아키텍쳐(WebSocket)를 반영한 웹캠 연결 함수
 * 비동기 함수
 */
function startWebcam(videoElement, accuracyPercent, progressBar) {
	// 웹캠 사용 가능 여부 확인 후 스트림을 요청합니다.
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
			})
			.then((stream) => {
				// 1. 웹캠 영상을 video 요소의 srcObject로 연결.
				videoElement.srcObject = stream;
				videoElement.play();

				// AI 서버(FastAPI) 주소
				const aiSocket = new WebSocket('ws://127.0.0.1:8000/ws');

				aiSocket.onopen = () => {
					console.log('AI 서버와 연결되었습니다.');
				};

				// AI 서버로부터 예측 결과를 메시지(이벤트)로 수신
				aiSocket.onmessage = (event) => {
					// AI 서버가 {"prediction": "ㄱ", "accuracy": 70} 형태의 JSON을 보냈다고 가정
					try {
						const aiResponse = JSON.parse(event.data);

						if (aiResponse.accuracy !== undefined) {
							const accuracyScore = parseInt(aiResponse.accuracy, 10);

							// 정확도 UI 업데이트
							accuracyPercent.textContent = `${accuracyScore}%`;
							progressBar.style.width = `${accuracyScore}%`;


						}
					} catch (e) {
						console.error('AI 서버에서 보낸 메시지를 읽을 수 없습니다.', event.data);
					}
				};

				aiSocket.onerror = (error) => {
					console.error('AI 서버 연결 중 오류가 발생했습니다.', error);
				};

				aiSocket.onclose = () => {
					console.log('AI 서버와 연결이 끊어졌습니다.');
				};
			})
			.catch((error) => {
				console.error(
					'웹캠을 켜지 못했습니다. 카메라 권한을 확인해주세요.',
					error
				);
			});
	} else {
		// 브라우저가 웹캠을 아예 지원 안 할 경우
		console.error('이 브라우저는 웹캠 기능을 지원하지 않습니다.');
	}
}

// -------------------------------------------------------
// 메인 이벤트 리스너 (HTML 로드 후 실행)
document.addEventListener('DOMContentLoaded', startApp);

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
				const set = new Set(data.successlist);

				document.querySelectorAll('.word-item').forEach(a => {
					const id = String(a.dataset.slId);
					if (set.has(id)) a.closest('li').classList.add('learned');
					else a.closest('li').classList.remove('learned');
				});
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
		currentSlId = Number(a.dataset.slId);

		console.log(currentSlId);

		if (hiddenSlId) hiddenSlId.value = currentSlId;

		// 2) 자막/정확도 초기화
		const meaning = a.dataset.meaning || a.textContent.trim();
		if (subtitleEl) subtitleEl.textContent = '학습 글자 : ' + meaning;
		if (progressBar) progressBar.style.width = '0%';
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

		//const body = new URLSearchParams({ slId: hiddenSlId.value });

		//fetch(`${APP_CTX}/SlLearnSuccess.do`, {
		//	method: "POST",
		//	headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		//	body,
		//	credentials: "same-origin",
		//})
		//	.then(function(res) {
		//		return res.json();
		//	})
		//	.then((data) => {
		//		if (data && data.ok) {
		//			alert("수어 학습 성공");
		//		} else {
		//			alert(data.message);
		//		}
		//	})
		//	.catch(function(err) {
		//		console.error(err);
		//		alert("네트워크 오류가 발생했습니다.");
		//	})
	});
})();