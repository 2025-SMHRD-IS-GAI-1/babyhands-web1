<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta charset="UTF-8">
<title>지난 학습결과</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
	rel="stylesheet" />

<!-- header.css 먼저, 페이지 CSS 나중에 -->
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
<link rel="stylesheet" href="${ctx}/assets/css/LastResult.css" />
</head>
<body>
	<!-- 화면 가운데 정렬/배경 -->
	<div class="lr-viewport">
		<!-- 카드 컨테이너 (헤더 포함, 폭 통일) -->
		<div class="lr-container">

			<!-- 상단바 (헤더는 컨테이너 안, 최상단) -->
			<jsp:include page="/WEB-INF/views/header.jsp">
				<jsp:param name="nav" value="learn" />
			</jsp:include>

			<!-- 페이지 타이틀 -->
			<h1 class="lr-title">지난 학습결과</h1>

			<!-- 요약 박스 -->
			<div class="lr-top">
				<div class="lr-chip">
					총 학습일 수 : <strong>${TotalDays}</strong>일
				</div>
				<div class="lr-chip">
					평균 : <strong>${AverageScore}</strong>점
				</div>
			</div>

			<!-- 본문 2열 -->
			<div class="lr-grid">
				<!-- 왼쪽 리스트 -->
				<div class="lr-left card">
					<c:forEach var="d" items="${recentDays}">
						<div class="lr-row">
							<div class="lr-row-text">${d.title}</div>
							<button class="lr-btn">이동</button>
						</div>
					</c:forEach>
					<c:if test="${empty recentDays}">
						<div class="lr-empty">최근 데이터가 없습니다.</div>
					</c:if>
				</div>

				<!-- 오른쪽 차트 -->
				<!-- 오른쪽 -->
				<div class="lr-right card">
					<div class="lr-panel-title">주간 학습량</div>
					<div class="lr-chart">
						<div class="bar-col">
							<div class="bar mon"></div>
							<div class="day">월</div>
						</div>
						<div class="bar-col">
							<div class="bar tue"></div>
							<div class="day">화</div>
						</div>
						<div class="bar-col">
							<div class="bar wed"></div>
							<div class="day">수</div>
						</div>
						<div class="bar-col">
							<div class="bar thu"></div>
							<div class="day">목</div>
						</div>
						<div class="bar-col">
							<div class="bar fri"></div>
							<div class="day">금</div>
						</div>
						<div class="bar-col">
							<div class="bar sat"></div>
							<div class="day">토</div>
						</div>
						<div class="bar-col">
							<div class="bar sun"></div>
							<div class="day">일</div>
						</div>
					</div>
				</div>
			</div>
			<!-- /lr-grid -->
		</div>
	</div>

	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/header.js"></script>
</body>
</html>
