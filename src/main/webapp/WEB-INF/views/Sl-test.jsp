<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수어 학습 테스트 | 340lab</title>
    <!-- Google Fonts (Noto Sans KR) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- test.css 연결 (경로는 /css/test.css로 가정) -->
        <!-- CSS 파일 연결 -->
   <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/Sl-test.css">
    
</head>
<body>

    <div class="container">
        <!-- 1. 헤더 (learning.jsp와 동일한 구조) -->
        <header class="header">
            <!-- 헤더 왼쪽: 로고 + 네비게이션 -->
            <div class="header-left">
                <!-- 로고 -->
                <a href="#" class="logo">
                    <span class="logo-icon">🖐️</span>
                    <span class="logo-text">340lab</span>
                </a>
                <!-- 네비게이션 -->
                <nav class="main-nav">
                    <ul>
                        <li><a href="#">학습하기</a></li>
                        <li><a href="#" class="active">테스트</a></li>
                        <li><a href="#">랭킹</a></li>
                        <li><a href="#">마이페이지</a></li>
                    </ul>
                </nav>
            </div>
            
            <!-- 헤더 오른쪽: 사용자 정보 + 아이콘 -->
            <div class="header-right">
                <span class="username">김민준 님</span>
                <button class="logout-btn">로그아웃</button>
                <button class="code-icon">
                    &lt;/&gt;
                </button>
            </div>
        </header>

        <!-- 2. 메인 컨텐츠 (문제 영상 + 정답 선택) -->
        <main class="main-content-test">
            
            <!-- 2-1. 문제 패널 -->
            <section class="test-panel">
                <div class="section-header">
                    <h1 class="section-title">수어 학습 테스트</h1>
                    <p class="section-subtitle">문제 영상 1 / 10</p>
                </div>
                <div class="video-placeholder-test">
                    <span>영상 플레이스홀더</span>
                </div>
            </section>

            <!-- 2-2. 정답 패널 -->
            <section class="answer-panel">
                <h2 class="answer-title">정답 선택</h2>
                <form action="submitAnswer" method="POST" class="answer-form">
                    <ul class="answer-list">
                        <li>
                            <input type="radio" id="ans1" name="answer" value="1">
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

</body>
</html>
