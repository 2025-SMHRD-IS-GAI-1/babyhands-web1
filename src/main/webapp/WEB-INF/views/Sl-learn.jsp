<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
					<li><a href="#" class="word-item">ㄱ</a></li>
					<li><a href="#" class="word-item">ㄴ</a></li>
					<li><a href="#" class="word-item">ㄷ</a></li>
					<li><a href="#" class="word-item">ㄹ</a></li>
					<li><a href="#" class="word-item">ㅁ</a></li>
					<li><a href="#" class="word-item">ㅂ</a></li>
					<li><a href="#" class="word-item">ㅅ</a></li>
					<li><a href="#" class="word-item">ㅇ</a></li>
					<li><a href="#" class="word-item">ㅈ</a></li>
					<li><a href="#" class="word-item">ㅊ</a></li>
					<li><a href="#" class="word-item">ㅋ</a></li>
					<li><a href="#" class="word-item">ㅌ</a></li>
					<li><a href="#" class="word-item">ㅍ</a></li>
					<li><a href="#" class="word-item">ㅎ</a></li>
				</ul>

				<div id="vacant"></div>

				<h2 class="sidebar-title">모음</h2>
				<ul class="word-list">
					<!-- 10 기본 모음 -->
					<li><a href="#" class="word-item active">ㅏ</a></li>
					<li><a href="#" class="word-item">ㅑ</a></li>
					<li><a href="#" class="word-item">ㅓ</a></li>
					<li><a href="#" class="word-item">ㅕ</a></li>
					<li><a href="#" class="word-item">ㅗ</a></li>
					<li><a href="#" class="word-item">ㅛ</a></li>
					<li><a href="#" class="word-item">ㅜ</a></li>
					<li><a href="#" class="word-item">ㅠ</a></li>
					<li><a href="#" class="word-item">ㅡ</a></li>
					<li><a href="#" class="word-item">ㅣ</a></li>
					<!-- 11 복합 모음 -->
					<li><a href="#" class="word-item">ㅐ</a></li>
					<li><a href="#" class="word-item">ㅒ</a></li>
					<li><a href="#" class="word-item">ㅔ</a></li>
					<li><a href="#" class="word-item">ㅖ</a></li>
					<li><a href="#" class="word-item">ᅪ</a></li>
					<li><a href="#" class="word-item">ᅫ</a></li>
					<li><a href="#" class="word-item">ㅚ</a></li>
					<li><a href="#" class="word-item">ᅯ</a></li>
					<li><a href="#" class="word-item">ᅰ</a></li>
					<li><a href="#" class="word-item">ㅟ</a></li>
					<li><a href="#" class="word-item">ㅢ</a></li>
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
						<video id="learning_video" class="video-placeholder">
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
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	<script src="${ctx}/assets/js/Sl-learn.js"></script>
</body>
</html>

