<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>꼬마손 | 메인</title>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/assets/css/main.css">
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
</head>
<body>

	<!-- NAV -->
	<jsp:include page="/WEB-INF/views/header.jsp">
		<jsp:param name="nav" value="learn" />
	</jsp:include>

	<!-- 메인 -->
	<main class="container">
		<section class="calendar-section card" id="calendar">
			<!-- 헤더 (제목 + 오늘 버튼) -->
			<div class="cal__titlebar">
				<h2 class="card__title">출석 캘린더</h2>
				<button type="button" class="today-btn" id="btnToday">오늘</button>
			</div>

			<div class="cal">
				<!-- 상단: 월 이동 헤더 -->
				<div class="cal__header">
					<button class="icon-btn" aria-label="이전 달" id="btnPrev">
						<span class="chev chev--left"></span>
					</button>

					<div class="cal__month" id="monthLabel">0000년 00월</div>

					<button class="icon-btn" aria-label="다음 달" id="btnNext">
						<span class="chev chev--right"></span>
					</button>
				</div>

				<!-- 요일 헤더 -->
				<div class="cal__week" align="center">
					<span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span
						class="sun">일</span>
				</div>

				<!-- 날짜 그리드(동적으로 채움) -->
				<div class="cal__grid" id="calGrid"></div>
			</div>
		</section>

		<!-- KPI -->
		<aside class="kpi-wrap">
			<div class="card kpi">
				<h3 class="card__title">오늘의 목표</h3>
				<div class="donut" ${totalCount}>
					<div class="donut__ring"></div>
					<div class="donut__label">${totalScore}0%</div>
				</div>
			</div>

			<div class="card kpi">
				<h3 class="card__title">전체 진행률</h3>
				<div class="donut" data-percent="70">
					<div class="donut__ring"></div>
					<div class="donut__label">70%</div>
				</div>
			</div>
		</aside>
	</main>


	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	<script src="${ctx}/assets/js/main.js"></script>

</body>
</html>