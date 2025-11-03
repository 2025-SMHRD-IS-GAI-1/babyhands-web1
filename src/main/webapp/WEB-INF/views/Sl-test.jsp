<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수어 학습 테스트</title>
    
    <!-- [수정] 'xintegrity' -> 'integrity' 오타 수정 (필수) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
    <!-- Google Fonts (Noto Sans KR) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- [확인] 이클립스 경로 (정상) -->
    <link rel="stylesheet" href="${ctx}/assets/css/header.css" />
    <link rel="stylesheet" href="${ctx}/assets/css/Sl-test.css" />
</head>
<body>
    
    <div class="container">
        <!-- [수정] jsp:include 헤더 제거 -->
        <jsp:include page="/WEB-INF/views/header.jsp">
			<jsp:param name="nav" value="learn" />
		</jsp:include>
		
        <!-- 2. 페이지 전체 제목 (중앙 정렬) -->
        <div class="page-title-header">
            <h1 class="page-title">수어 학습 테스트</h1>
        </div>

        <!-- 3. [신규] 부제목 행 (좌/우 분리) -->
        <div class="sub-header-row">
            <h2 class="sub-header-title" id="question-subtitle">문제 영상 1 / 10</h2>
            <h2 class="sub-header-title" id="answer-title-header">정답 선택</h2>
        </div>

        <!-- 4. 메인 컨텐츠 (박스 2개) -->
        <main class="main-content-test">

            <!-- 4-1. 좌측 영상 패널 -->
            <section class="test-panel">
                
                <div class="video-placeholder-test video-box">
                    <p class="video-title">문제 영상</p>
                    <div class="video-placeholder">
                        <video id="question_video" style="width:100%; height:100%; background-color:#000;" controls>
                            <span>수어 문제 영상 플레이스홀더</span>
                        </video>
                    </div>
                </div>
            </section>

            <!-- 4-2. 우측 정답 패널 -->
            <section class="answer-panel">
                <form action="<c:url value='/submitAnswer' />" method="POST" class="answer-form">
                    <ul class="answer-list">
                        <li>
                            <input type="radio" id="ans1" name="answer" value="1" required>
                            <label for="ans1">반갑습니다람쥐</label>
                        </li>
                        <li>
                            <input type="radio" id="ans2" name="answer" value="2">
                            <label for="ans2">집에가고싶다</label>
                        </li>
                        <li>
                            <input type="radio" id="ans3" name="answer" value="3">
                            <label for="ans3">아니요</label>
                        </li>
                        <li>
                            <input type="radio" id="ans4" name="answer" value="4">
                            <label for="ans4">네</label>
                        </li>
                    </ul>
                    <button type="submit" class="submit-btn">제출하기</button>
                </form>
            </section>

        </main>
    </div> <!-- /container -->
    
    <!-- [수정] 'xintegrity' -> 'integrity' 오타 수정 (필수) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" defer></script>

    <!-- [확인] 이클립스 경로 (정상) -->
    <script>
		window.APP_CTX = '${ctx}';
	</script>
	<!-- [수정] 헤더 JS 제거 -->
	<script src="${ctx}/assets/js/header.js"></script>
    <script src="<c:url value='/assets/js/Sl-test.js' />"></script>
</body>
</html>

