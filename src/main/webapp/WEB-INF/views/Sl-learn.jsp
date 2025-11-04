<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>꼬마손 - 수어 학습하기</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
	rel="stylesheet" />

<!-- [호환성] 이클립스 경로로 수정 -->
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
<link rel="stylesheet" href="${ctx}/assets/css/Sl-learn.css" />

</head>
<body>
	<div class="container">
		<!-- 1. 헤더 (로고, 네비게이션, 사용자 정보) -->
		<jsp:include page="/WEB-INF/views/header.jsp">
			<jsp:param name="nav" value="learn" />
		</jsp:include>

		<!-- 2. 메인 컨텐츠 (사이드바 + 학습 영역) -->
		<main class="main-content">
			<!-- 2-1. 사이드바 (수어 단어 목록) -->
			<aside class="sidebar">
				<h2 class="sidebar-title">자음</h2>
				<ul class="word-list">
					<c:forEach var="consonant" items="${consonantList}">
						<li><a href="#" class="word-item"
							data-sl-id="${consonant.slId}"
							data-src="${ctx}/assets/video/${consonant.videoPath}"
							data-meaning="${consonant.meaning}"> ${consonant.meaning} </a></li>
					</c:forEach>
				</ul>

				<input type="hidden" id="slId" name="slId" />

				<div id="vacant"></div>

				<h2 class="sidebar-title">모음</h2>
				<ul class="word-list">
					<c:forEach var="vowel" items="${vowelList}">
						<li><a href="#" class="word-item" data-sl-id="${vowel.slId}"
							data-src="${ctx}/assets/video/${vowel.videoPath}"
							data-meaning="${vowel.meaning}"> ${vowel.meaning} </a></li>
					</c:forEach>
				</ul>
			</aside>

			<!-- 2-2. 학습 섹션 (비디오 + 정확도) -->
			<section class="learning-section">
				<div class="section-header">
					<h1 class="section-title">수어 학습하기</h1>
					<p class="section-subtitle">학습 글자 : ???</p>
				</div>

				<div class="video-containers">
					<div class="video-box">
						<p class="video-title">학습 영상</p>
						<video id="learning_video" class="video-placeholder" controls
							playsinline>
							<span>영상 플레이스홀더</span>
						</video>
					</div>

					<div class="video-box">
						<p class="video-title">실시간 카메라</p>
						<video id="webcam" class="video-placeholder camera-feed" autoplay
							playsinline>
							<span>카메라 영역</span>
						</video>
					</div>
				</div>

				<div class="accuracy-section">
					<span class="accuracy-label">정확도</span>
					<div class="progress-container">
						<div class="progress-bar" style="width: 0%"></div>
					</div>
					<span class="accuracy-percent">0%</span>
				</div>
			</section>
		</main>
	</div>
	<!-- /container -->

	<script>
		window.APP_CTX = '${ctx}';
		window.__disableWS__ = true;   // ← 웹소켓 코드 비활성화 (외부 JS 로드 전에!)
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	<script src="${ctx}/assets/js/Sl-learn.js"></script>









	<script>
  // 중복 실행 방지
  // 이거 그냥 테스트 용..... 버려도 됨용 ==> 결론 못하겠음
  if (!window.__aiHooked__) {
    window.__aiHooked__ = true;

    (function () {
      var API_URL = 'http://127.0.0.1:5001/predict'; // Flask /predict
      var cam = document.getElementById('webcam');
      if (!cam) cam = document.querySelector('video.camera-feed') || document.querySelector('video');


      // 캔버스 준비 (없으면 생성)
      var cv = document.getElementById('cv');
      if (!cv) {
        cv = document.createElement('canvas');
        cv.id = 'cv';
        cv.width = 320;
        cv.height = 240;
        cv.style.display = 'none';
        document.body.appendChild(cv);
      }
      var ctx = cv.getContext('2d');

      // 정확도 바 요소
      var progressBar = document.querySelector('.progress-bar');
      var percentText = document.querySelector('.accuracy-percent');

      function toPercent(conf) {
        if (typeof conf !== 'number' || isNaN(conf)) return 0;
        return (conf <= 1) ? Math.round(conf * 100) : Math.round(conf);
      }

      // 웹캠 시작 (Promise 방식, async/await 안 씀)
      function startCam() {
        if (!cam) {
          console.error('video#cam 요소 없음');
          return Promise.reject(new Error('no video element'));
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (percentText) percentText.textContent = '웹캠 미지원';
          return Promise.reject(new Error('getUserMedia not supported'));
        }
        return navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(function (stream) {
            cam.srcObject = stream;
          })
          .catch(function (e) {
            console.error('웹캠 실패:', e);
            if (percentText) percentText.textContent = '웹캠 실패';
          });
      }

      // 주기 루프 (fetch도 then/catch로 처리)
      function loop() {
        try {
          if (cam && cam.videoWidth > 0) {
            ctx.drawImage(cam, 0, 0, cv.width, cv.height);
            var dataUrl = cv.toDataURL('image/jpeg', 0.8);

            fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl })
            })
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              return r.json();
            })
            .then(function (j) {
              // console.log('predict:', j);
              var pct = j && j.ok ? toPercent(j.confidence) : 0;
              if (progressBar) progressBar.style.width = pct + '%';
              if (percentText)  percentText.textContent = j && j.ok ? (pct + '%') : '에러';
            })
            .catch(function (err) {
              console.error('연결 오류:', err);
              if (percentText) percentText.textContent = '연결 오류';
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setTimeout(loop, 300); // 3~4fps
        }
      }

      // 페이지 어딘가에 있는 웹소켓 코드 비활성화(간단 보호)
      window.__disableWS__ = true;

      // 시작!
      startCam().then(function () {
        loop();
      });
    })();
  }
</script>









</body>
</html>

