<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>수어 학습 테스트</title>
    <!-- Bootstrap CSS (오타 수정 완료) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
    <!-- Google Fonts (Noto Sans KR) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">

<!-- Bootstrap CSS (integrity 오타 수정) -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	crossorigin="anonymous">

<!-- Custom CSS -->
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
<link rel="stylesheet" href="${ctx}/assets/css/Sl-test.css" />
</head>
<body>

	<div class="container">
		<!-- 헤더 jsp:include 부분 -->
		<jsp:include page="/WEB-INF/views/header.jsp">
			<jsp:param name="nav" value="test" />
		</jsp:include>

		<!-- 2. 페이지 전체 제목 (중앙 정렬) -->
		<div class="page-title-header">
			<h1 class="page-title">수어 학습 테스트</h1>
		</div>
		
		<!-- 4. 메인 컨텐츠 (박스 2개) -->
		<main class="main-content-test">
		
            <!-- 4-1. 좌측 영상 패널 -->
            <section class="test-panel">
                
                <!-- 박스 내부 제목 -->
                <div class="section-header">
                    <div class="section-subtitle" id="question-subtitle">문제 영상 1 / 10</div>
                </div>

                <!-- 비디오 박스 구조 -->
                <div class="video-placeholder-test video-box">                                                
                    <div class="video-placeholder">
                        <video id="question_video" controls>
                            <span>수어 문제 영상 플레이스홀더</span>
                        </video>
                    </div>
                </div>
            </section>
            
            

            <!-- 4-2. 우측 정답 패널 -->
            <section class="answer-panel">
                
                <!-- 박스 내부 제목 -->
                <div class="section-header">
					<p class="section-subtitle">정답 선택</p>
				</div>

				<form action="<c:url value='/submitAnswer' />" method="POST"
					class="answer-form">
					<ul class="answer-list">
						<li><input type="radio" id="ans1" name="answer" value="1"
							required> <label for="ans1"></label></li>
						<li><input type="radio" id="ans2" name="answer" value="2">
							<label for="ans2"></label></li>
						<li><input type="radio" id="ans3" name="answer" value="3">
							<label for="ans3"></label></li>
						<li><input type="radio" id="ans4" name="answer" value="4">
							<label for="ans4"></label></li>
					</ul>
					
					<div class="answer-actions">
						<button type="button" id="btnPrev"
							class="btn btn-outline-secondary">이전</button>
						<button type="button" id="btnNext" class="btn btn-primary">다음</button>
					</div>
					
				</form>
            </section>

        </main>
    </div> <!-- /container -->

	<!-- Bootstrap JS (integrity 오타 수정) -->
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous" defer></script>

	<!-- Custom JS -->
	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/header.js"></script>
    <script src="${ctx}/assets/js/sl-test.js"></script>







</body>
</html>
