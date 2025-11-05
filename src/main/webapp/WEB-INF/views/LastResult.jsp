<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta charset="UTF-8">
<title>지난 테스트결과</title>

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
			<h1 class="lr-title">지난 테스트결과</h1>

			<!-- 요약 박스 -->
			<div class="lr-top">
				<div class="lr-chip">
					총 테스트일 수 : <strong>${totalLearnDay}</strong>일
				</div>
				<div class="lr-chip">
					평균 : <strong>${avgScore}</strong>점
				</div>
			</div>

			<!-- 본문 2열 -->
			<div class="lr-grid">
				<!-- 왼쪽 리스트 -->
				<div class="lr-left card">
					<c:choose>
						<c:when test="${not empty lastTestList}">
							<c:forEach items="${lastTestList}" var="lastTest">
								<div class="lr-row">
									<div class="lr-meta">
										<time class="lr-date">
											<fmt:formatDate value="${lastTest.slTestDate}"
												pattern="yyyy/MM/dd HH:mm:ss" />
										</time>

										<!-- 점수 알약 + 미니바 -->
										<div class="lr-score-wrap">
											<span class="lr-score-pill
										        <c:choose>
										          <c:when test="${lastTest.correct >= 4}">is-good</c:when>
										          <c:when test="${lastTest.correct >= 2}">is-mid</c:when>
										          <c:otherwise>is-bad</c:otherwise>
										        </c:choose>">
												${lastTest.correct}/5 
											</span>
										</div>
									</div>

									<form action="${ctx}/GoSignTestResult.do" method="get">
										<input type="hidden" name="groupNo" value="${lastTest.slTestGroup}">
										<button type="submit" class="lr-btn lr-btn--primary">결과</button>
									</form>
								</div>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<div class="lr-empty">최근 데이터가 없습니다.</div>
						</c:otherwise>
					</c:choose>
				</div>

				<!-- 오른쪽 차트 -->
				<!-- 오른쪽 -->
				<div class="lr-right card">
					<div class="lr-panel-title">주간 테스트량</div>
					<div class="lr-chart" data-goal="20">
						<c:forEach items="${dailyTestList}" var="daily">
							<div class="bar-col">
								<div class="bar" data-value="${daily.testCount}"></div>
								<div class="day">${daily.day}</div>
							</div>
						</c:forEach>
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
	<script src="${ctx}/assets/js/lastResult.js"></script>
</body>
</html>
