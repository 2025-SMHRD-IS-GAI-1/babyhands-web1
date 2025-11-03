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




		<!-- 캘린더 -->
		<%-- ====== 동적 달력: 이번 달 + 오늘 강조 + 월 이동 ====== --%>
		<%
		// Java 8+ java.time 사용
		java.time.LocalDate today = java.time.LocalDate.now();

		// 쿼리 파라미터(y, m)가 있으면 해당 월/년으로, 없으면 오늘 기준
		String py = request.getParameter("y");
		String pm = request.getParameter("m");

		int year = (py != null && py.matches("\\d{1,4}")) ? Integer.parseInt(py) : today.getYear();
		int month = (pm != null && pm.matches("\\d{1,2}")) ? Integer.parseInt(pm) : today.getMonthValue();

		// 범위 보정 (1~12)
		if (month < 1) {
			month = 1;
		}
		if (month > 12) {
			month = 12;
		}

		java.time.LocalDate first = java.time.LocalDate.of(year, month, 1);
		int lengthOfMonth = first.lengthOfMonth(); // 해당 월의 총 일수
		int firstDow = first.getDayOfWeek().getValue(); // 1=월 ... 7=일 (우리 요일 헤더와 맞음)
		int leadingBlanks = firstDow - 1; // 앞쪽 빈 칸 수
		int totalCells = leadingBlanks + lengthOfMonth;
		int trailingBlanks = (7 - (totalCells % 7)) % 7; // 뒤쪽 빈 칸 수 (모듈러 보정)

		// 이전/다음 월 계산
		java.time.LocalDate prevMonth = first.minusMonths(1);
		java.time.LocalDate nextMonth = first.plusMonths(1);

		// 현재 페이지 URI (월 이동 버튼 링크용)
		String self = request.getContextPath() + "/Gomain.do";
		%>

		<section class="calendar-section card">
			<!-- 헤더 (제목 + 오늘 버튼) -->
			<div class="cal__titlebar">
				<h2 class="card__title">출석 캘린더</h2>
				<a class="today-btn"
					href="<%=self%>?y=<%=today.getYear()%>&m=<%=today.getMonthValue()%>">오늘</a>
			</div>




			<div class="cal">
				<!-- 상단: 월 이동 헤더 -->
				<div class="cal__header">
					<a class="icon-btn" aria-label="이전 달"
						href="<%=self%>?y=<%=prevMonth.getYear()%>&m=<%=prevMonth.getMonthValue()%>">
						<span class="chev chev--left"></span>
					</a>

					<div class="cal__month">
						<%=year%>년&nbsp;<%=month%>
						월
					</div>

					<a class="icon-btn" aria-label="다음 달"
						href="<%=self%>?y=<%=nextMonth.getYear()%>&m=<%=nextMonth.getMonthValue()%>">
						<span class="chev chev--right"></span>
					</a>
				</div>

				<!-- 요일 헤더 -->
				<div class="cal__week" align="center">
					<span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span
						class="sun">일</span>
				</div>

				<!-- 날짜 그리드(동적 생성) -->
				<div class="cal__grid">
					<%-- 앞쪽 빈 칸 --%>
					<%
					for (int i = 0; i < leadingBlanks; i++) {
					%>
					<span></span>
					<%
					}
					%>

					<%-- 1일부터 말일까지 --%>
					<%
					for (int d = 1; d <= lengthOfMonth; d++) {
						boolean isToday = (year == today.getYear() && month == today.getMonthValue() && d == today.getDayOfMonth());
					%>
					<button class="<%=isToday ? "today" : ""%>"><%=d%></button>
					<%
					}
					%>

					<%-- 뒤쪽 빈 칸 --%>
					<%
					for (int i = 0; i < trailingBlanks; i++) {
					%>
					<span></span>
					<%
					}
					%>
				</div>
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

	<!-- 퍼센트 값 주입 -->
	<script>
    document.querySelectorAll('.donut').forEach(el => {
      el.style.setProperty('--percent', +el.dataset.percent || 0);
    });
  </script>



	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	
	
</body>
</html>