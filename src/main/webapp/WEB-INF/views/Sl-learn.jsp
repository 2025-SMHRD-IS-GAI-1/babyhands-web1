<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>학습하기 | 340lab</title>
    <!-- Google Fonts (Noto Sans KR) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- learning.css 연결 (경로는 /css/learning.css로 가정) -->
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/Sl-learn.css">
    

</head>
<body>

    <div class="container">
        <!-- 1. 헤더 (로고, 네비게이션, 사용자 정보) -->
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
                        <li><a href="#" class="active">학습하기</a></li>
                        <li><a href="#">테스트</a></li>
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

        <!-- 2. 메인 컨텐츠 (사이드바 + 학습 영역) -->
        <main class="main-content">
            
            <!-- 2-1. 사이드바 (수어 단어 목록) -->
            <aside class="sidebar">
                <h2 class="sidebar-title">수어 단어</h2>
                <ul class="word-list">
                    <li><a href="#" class="word-item active">돼지</a></li>
                    <li><a href="#" class="word-item">백조</a></li>
                    <li><a href="#" class="word-item">정해물</a></li>
                </ul>
            </aside>

            <!-- 2-2. 학습 섹션 (비디오 + 정확도) -->
            <section class="learning-section">
                <!-- 섹션 제목 -->
                <div class="section-header">
                    <h1 class="section-title">수어 학습하기</h1>
                    <p class="section-subtitle">제시어: 돼지</p>
                </div>
                
                <!-- 비디오 영역 -->
                <div class="video-containers">
                    <!-- 모델 영상 -->
                    <div class="video-box">
                        <p class="video-title">모델 영상</p>
                        <div class="video-placeholder">
                            <span>영상 플레이스홀더</span>
                        </div>
                    </div>
                    
                    <!-- 실시간 카메라 -->
                    <div class="video-box">
                        <p class="video-title">실시간 카메라</p>
                        <div class="video-placeholder camera-feed">
                            <span>카메라 영역</span>
                        </div>
                    </div>
                </div>

                <!-- 정확도 프로그레스 바 -->
                <div class="accuracy-section">
                    <span class="accuracy-label">정확도</span>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 70%;"></div>
                    </div>
                    <span class="accuracy-percent">70%</span>
                </div>
            </section>
        </main>

    </div> <!-- /container -->

</body>
</html>
