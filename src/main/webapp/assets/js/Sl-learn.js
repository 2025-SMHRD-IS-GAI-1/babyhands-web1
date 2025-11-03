// ------------------------------------------------------------------
// 메인 초기화 함수
// (화면 순서 1: 사이드바)

const sidebar = document.querySelector('.sidebar');
const videoEl = document.getElementById('learning_video');
const subtitleEl = document.querySelector('.section-subtitle');
const progressBar = document.querySelector('.progress-bar');
const percentEl = document.querySelector('.accuracy-percent');


function startApp() {
	// 1. 사이드바 HTML 요소 가져오기
	const CharDisplay = document.querySelector('.section-subtitle');
	const jamoBtn = document.querySelectorAll('.word-item');
	const actJamoBtn = document.querySelector('.word-item.active');

	const webcam = document.getElementById('webcam');
	const learningVideo = document.getElementById('learning_video');

	const accuracyPercent = document.querySelector('.accuracy-percent');
	const progressBar = document.querySelector('.progress-bar');

	// -----------------------------------------------------------------------
	// 2. 초기 글자 설정
	if (actJamoBtn) {
		CharDisplay.textContent = `학습 글자 : ${actJamoBtn.textContent}`;
	} else {
		CharDisplay.textContent = '학습 글자 : 글자를 선택하세요';
	}

	//-------------------------------------------------------
	// 5. 웹캠 연결 함수 호출
	if (webcam && accuracyPercent && progressBar) {
		startWebcam(webcam, accuracyPercent, progressBar);
	}
}

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



(function() {
	// 필요한 DOM 참조가 이 스코프에 있어야 합니다.
	sidebar.addEventListener('click', function(e) {
		var a = e.target.closest('a.word-item');
		if (!a) return;
		e.preventDefault();

		var src = a.dataset.src;
		var meaning = a.dataset.meaning || '';

		if (subtitleEl) subtitleEl.textContent = '학습 글자 : ' + meaning;
		if (progressBar) progressBar.style.width = '0%';
		if (percentEl) percentEl.textContent = '0%';

		try {
			videoEl.src = src;

			// load()는 동기 호출
			videoEl.load();

			// 메타데이터 로드 후 재생 (이벤트 기반)
			var tryPlay = function() {
				var p = videoEl.play();
				if (p && typeof p.then === 'function') {
					p.catch(function() { /* 자동재생 정책으로 실패 가능 */ });
				}
			};

			if (videoEl.readyState >= 1) {
				// 이미 메타데이터 로드됨
				tryPlay();
			} else {
				videoEl.addEventListener('loadedmetadata', function onMeta() {
					videoEl.removeEventListener('loadedmetadata', onMeta);
					tryPlay();
				});
			}
		} catch (err) {
			console.error('비디오 로드 실패:', err);
			alert('영상을 불러오지 못했습니다. 경로를 확인하세요.');
		}
	});
})();
