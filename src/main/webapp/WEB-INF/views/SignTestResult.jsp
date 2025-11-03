<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta charset="UTF-8">
<title>수어 학습 테스트 결과</title>
<link rel="stylesheet" href="${ctx}/assets/css/SignTestResult.css">
</head>
<body>
	<div class="st-page">

		<!-- 왼쪽 요약 카드 -->
		<div class="st-left">
			<div class="st-title">수어 학습 테스트 결과</div>

			<div class="st-summary-card">
				<div class="st-summary-label">요약</div>

				<!-- 트로피 (CSS로 그린거) -->
				<div class="st-trophy">
					<div class="st-trophy-body">
						<div class="st-trophy-star">★</div>
					</div>
				</div>

				<!-- 얇은 게이지바 (그냥 장식) -->
				<div class="st-gauge">
					<div class="st-gauge-inner" style="width: 78%;"></div>
				</div>

				<!-- 점수 박스 -->
				<div class="st-info-box">
					<div class="st-info-title">총 점수</div>
					<div class="st-info-value">
						<c:out value="${totalScore}" default="0" />
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
				<c:out value="${totalCount}" default="10" />
				문항)
			</div>

			<div class="st-grid">
				<!-- 리스트 있을 때 -->
				<c:if test="${not empty resultList}">
					<c:forEach var="item" items="${resultList}">
						<c:choose>
							<c:when test="${item.correct}">
								<div class="st-cell st-cell-correct">
									<c:out value="${item.jamo}" default="ㅇ" />
								</div>
							</c:when>
							<c:otherwise>
								<div class="st-cell st-cell-wrong">
									<c:out value="${item.jamo}" default="ㅇ" />
								</div>
							</c:otherwise>
						</c:choose>
					</c:forEach>
				</c:if>

				<!-- 리스트가 없을 때 임시 10칸 -->
				<c:if test="${empty resultList}">
					<c:forEach var="i" begin="1" end="10">
						<div class="st-cell st-cell-correct">ㅇ</div>
					</c:forEach>
				</c:if>
			</div>
		</div>

	</div>
</body>
</html>