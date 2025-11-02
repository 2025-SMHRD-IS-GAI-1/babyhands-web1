// ------------------------------------------------------------------
// 메인 초기화 함수
// (화면 순서 1: 사이드바)
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
  // 3. 사이드바-자모음의 낱글자들에 클릭버튼 생성!
  jamoBtn.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const click_Jamo = this.textContent;

      CharDisplay.textContent = `학습 글자 : ${click_Jamo}`;

      fetchLearningVideo(click_Jamo, learning_video);

      const pre_act_btn = document.querySelector(
        '.word-item.active'
      );
      if (pre_act_btn) {
        pre_act_btn.classList.remove('active');
      }

      this.classList.add('active');
    });
  }); // 3. 종료

  //-------------------------------------------------------
  // 5. 웹캠 연결 함수 호출
  if (webcam && accuracyPercent && progressBar) {
    startWebcam(webcam, accuracyPercent, progressBar);
  }
}

// ---------------------------------------------------------------------
// 4. 학습 영상 연결 함수 (함수 정의)
// (화면 순서 2: 학습 영상)

/**
 * 클릭된 자모에 따라 학습 영상의 소스를 설정하는 함수
 * fetch를 사용하는 비동기 함수
 */
function fetchLearningVideo(jamo, videoElement) {
  // learningVideo 요소가 없으면 함수 실행 중지
  if (!videoElement) return;

  // =================================================================
  // [ 외부 URL 테스트용 임시 코드 ]
  // (이전 로컬 파일 경로(testVideoPathMap) 대신, 외부 링크를 사용합니다.)
  const testVideoURL =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  videoElement.src = testVideoURL;
  videoElement.load();
  videoElement.muted = true; // 음소거 (자동 재생 정책 해결)

  // videoElement.play()는 Promise를 반환합니다.
  // 이 Promise가 성공했는지(.then) 실패했는지(.catch) 확인해야
  // 브라우저가 재생을 거부(무시)했는지 알 수 있습니다.
  const playPromise = videoElement.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // 재생 성공
        console.log(
          `[테스트] '${jamo}' 클릭. 외부 영상 재생 시작: ${testVideoURL}`
        );
      })
      .catch((error) => {
        // 재생 실패 (F12 콘솔에서 이 오류를 확인하세요)
        console.error(
          `[테스트] '${jamo}' 영상 재생 실패. (오류: ${error.name})`,
          error
        );
      });
  }


} // 4. 종료

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

