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
	// 이벤트 위임
	sidebar.addEventListener('click', async (e) => {
		const a = e.target.closest('a.word-item');
		if (!a) return;
		e.preventDefault();

		const src = a.dataset.src;
		const meaning = a.dataset.meaning || '';

		// 섹션 서브타이틀 갱신
		if (subtitleEl) subtitleEl.textContent = '학습 글자 : ' + meaning;

		// 정확도 UI 초기화(원하면)
		if (progressBar) progressBar.style.width = '0%';
		if (percentEl) percentEl.textContent = '0%';

		// 비디오 교체
		try {
			// 소스만 바꾸고 재생
			videoEl.src = src;
			// 형식 명확히 하고 싶으면 <source> 동적 생성해도 됨
			// videoEl.innerHTML = `<source src="${src}" type="video/mp4">`;

			await videoEl.load(); // 메타데이터 로드
			// 자동재생은 브라우저 정책 때문에 실패할 수 있으니 play는 try/catch
			try { await videoEl.play(); } catch (err) { /* 사용자가 눌러야 재생될 수 있음 */ }
		} catch (err) {
			console.error('비디오 로드 실패:', err);
			alert('영상을 불러오지 못했습니다. 경로를 확인하세요.');
		}
	});
})();
