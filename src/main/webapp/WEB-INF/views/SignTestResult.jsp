<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta charset="UTF-8">
<title>수어 학습 테스트 결과</title>

<!-- 순서: header.css 먼저, 페이지 CSS 나중 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
	rel="stylesheet" />
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
<link rel="stylesheet" href="${ctx}/assets/css/SignTestResult.css" />
</head>
<body>
	<div class="st-viewport">
		<div class="st-container">
			<!-- 상단바 -->
			<jsp:include page="/WEB-INF/views/header.jsp">
				<jsp:param name="nav" value="learn" />
			</jsp:include>

			<div class="st-page">
				<!-- 왼쪽 요약 카드 -->
				<div class="st-left">
					<div class="st-title">수어 학습 테스트 결과</div>

					<div class="st-summary-card">
						<div class="st-summary-label">요약</div>

						<div class="st-trophy">
							<div class="st-trophy-body">
								<div class="st-trophy-star">★</div>
							</div>
						</div>

						<div class="st-gauge">
							<div class="st-gauge-inner" style="width: 78%;"></div>
						</div>

						<div class="st-info-box">
							<div class="st-info-title">총 점수</div>
							<div class="st-info-value">
								<c:out value="${r.totalScore}" default="0" />
							</div>
						</div>

						<div class="st-info-box">
							<div class="st-info-title">정답 수</div>
							<div class="st-info-value">
								<c:out value="${correctCount}" default="0" />
								/
								<c:out value="${totalCount}" default="0" />
							</div>
						</div>

						<button class="st-btn" onclick="location.href='${ctx}/GoTest.do'">다시
							풀기</button>
					</div>
				</div>

				<!-- 오른쪽 문항별 결과 -->
				<div class="st-right">
					<div class="st-right-title">
						문항별 결과 (
						<c:out value="${totalCount}" default="5" />
						문항)
					</div>

					<div class="st-grid">
						<!-- 왼쪽 컬럼: 정답 -->
						<div class="st-col">
							<h3 class="st-col-title">정답</h3>
							<c:if test="${not empty resultList}">
								<c:forEach var="item" items="${resultList}" varStatus="s">
									<div class="st-card is-correct">
										<div class="st-card-num">
											Q
											<c:out value="${s.index + 1}" />
										</div>
										<div class="st-card-text">
											<c:out value="${item.correctJamo}" default="-" />
										</div>
									</div>
								</c:forEach>
							</c:if>

							<c:if test="${empty resultList}">
								<c:forEach var="i" begin="1" end="5">
									<div class="st-card is-correct">
										<div class="st-card-num">Q${i}</div>
										<div class="st-card-text">-</div>
									</div>
								</c:forEach>
							</c:if>
						</div>

						<!-- 오른쪽 컬럼: 내 답(정오답 표시) -->
						<div class="st-col">
							<h3 class="st-col-title">내 답안</h3>
							<c:if test="${not empty resultList}">
								<c:forEach var="item" items="${resultList}" varStatus="s">
									<c:set var="isRight" value="${item.jamo == item.correctJamo}" />
									<div class="st-card ${isRight ? 'is-correct' : 'is-wrong'}">
										<div class="st-card-num">
											Q
											<c:out value="${s.index + 1}" />
										</div>
										<div class="st-card-text">
											<c:out value="${item.jamo}" default="-" />
											&nbsp; <span class="st-badge ${isRight ? 'ok' : 'bad'}">
												${isRight ? 'O' : 'X'} </span>
										</div>
									</div>
								</c:forEach>
							</c:if>

							<c:if test="${empty resultList}">
								<c:forEach var="i" begin="1" end="5">
									<div class="st-card is-wrong">
										<div class="st-card-num">Q${i}</div>
										<div class="st-card-text">
											- &nbsp;<span class="st-badge bad">X</span>
										</div>
									</div>
								</c:forEach>
							</c:if>
						</div>
					</div>
					<!-- ✅ 새 구조 끝 -->
				</div>
			</div>
			<!-- /st-page -->
		</div>
		<!-- /st-container -->
	</div>
	<!-- /st-viewport -->

	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/header.js"></script>
</body>
</html>
