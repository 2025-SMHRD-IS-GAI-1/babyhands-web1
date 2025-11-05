<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>꼬마손 | 메인 - 최종</title>
    <!-- [호환성] 이클립스 경로로 수정 -->
	<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
	<link rel="stylesheet" href="${ctx}/assets/css/main.css" />
    
</head>
<body>
    
    <!-- ✨ 1. 메인 콘텐츠 (헤더 + 캘린더 + KPI) -->
    <main class="container">
     
        <!-- ✨ 1-1. 헤더 (로고, 네비게이션, 사용자 정보) - 컨테이너 안으로 이동 -->
        <header class="main-header-area">
			<jsp:include page="/WEB-INF/views/header.jsp">
				<jsp:param name="nav" value="main" />
			</jsp:include>
        </header>
        
        <!-- ✨ 1-2. 캘린더 -->
        <section class="calendar-section card" id="calendar">
            <div class="cal__titlebar">
                <h2 class="card__title">출석 캘린더</h2>
                <button type="button" class="today-btn" id="btnToday">오늘</button>
            </div>

            <div class="cal">
                <div class="cal__header">
                    
                    <button class="icon-btn" aria-label="이전 달" id="btnPrev">
                        <span class="chev chev--left"></span>
                    </button>
                    
                    <div class="cal__month" id="monthLabel">2025년 11월</div>
                    
                    <button class="icon-btn" aria-label="다음 달" id="btnNext">
                        <span class="chev chev--right"></span>
                    </button>
                </div>

                <div class="cal__week" align="center">
                    <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span
                        class="sun">일</span>
                </div>

                <div class="cal__grid" id="calGrid">
                    <!-- JS가 동적으로 채웁니다 -->
                </div>
            </div>
        </section>

        <!-- ✨ 1-3. KPI -->
        <aside class="kpi-wrap">
            <div class="card kpi">
                <h3 class="card__title">오늘의 목표</h3>
                <div class="donut" data-percent="80" style="--percent:80">
                    <div class="donut__ring"></div>
                    <div class="donut__label">80%</div>
                </div>
            </div>

            <div class="card kpi">
                <h3 class="card__title">전체 진행률</h3>
                <div class="donut" data-percent="45" style="--percent:45">
                    <div class="donut__ring"></div>
                    <div class="donut__label">45%</div>
                </div>
            </div>
        </aside>
            
    </main>
    <script>
        // 도넛 차트의 percent 값을 data-percent에서 읽어 CSS 변수 --percent에 설정
        document.querySelectorAll('.donut').forEach(donut => {
            const percent = donut.dataset.percent;
            donut.style.setProperty('--percent', percent);
        });
        // JSP 환경의 컨텍스트 패스 변수 정의
        window.APP_CTX = "${ctx}";
    </script>
	
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	<script src="${ctx}/assets/js/main.js"></script>
</body>
</html>

