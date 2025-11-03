<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>랭킹</title>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
	rel="stylesheet" />
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
<link rel="stylesheet" href="${ctx}/assets/css/Ranking.css" />

</head>
<body>
	<div class="container">
		<!-- 상단바 -->
		<jsp:include page="/WEB-INF/views/header.jsp">
			<jsp:param name="nav" value="learn" />
		</jsp:include>
	<div class="rk-wrapper">
		<div class="rk-title">랭킹</div>

		<div class="rk-board">

			<div class="rk-header-row">
				<div>순위</div>
				<div>닉네임</div>
				<div>누적점수</div>
			</div>

			<%-- 아래 연동해야하는데 뭐라고 적어야하는지 모르겠삼요 --%>
			<c:choose>
				<c:when test="${not empty rankList}">
					<c:forEach var="r" items="${rankList}">
						<c:choose>
							<c:when test="${r.rank == 1}">
								<div class="rk-row rk-top1">
									<div class="rk-rank-num">1</div>
									<div class="rk-nick-wrap">
										<div class="rk-medal rk-gold">🥇</div>
										<div class="rk-nickname">${r.nickname}</div>
									</div>
									<div class="rk-score">${r.score}</div>
								</div>
							</c:when>
							<c:when test="${r.rank == 2}">
								<div class="rk-row rk-top2">
									<div class="rk-rank-num">2</div>
									<div class="rk-nick-wrap">
										<div class="rk-medal rk-silver">🥈</div>
										<div class="rk-nickname">${r.nickname}</div>
									</div>
									<div class="rk-score">${r.score}</div>
								</div>
							</c:when>
							<c:when test="${r.rank == 3}">
								<div class="rk-row rk-top3">
									<div class="rk-rank-num">3</div>
									<div class="rk-nick-wrap">
										<div class="rk-medal rk-bronze">🥉</div>
										<div class="rk-nickname">${r.nickname}</div>
									</div>
									<div class="rk-score">${r.score}</div>
								</div>
							</c:when>
							<c:otherwise>
								<div class="rk-row">
									<div class="rk-rank-num">${r.rank}</div>
									<div class="rk-nickname">${r.nickname}</div>
									<div class="rk-score">${r.score}</div>
								</div>
							</c:otherwise>
						</c:choose>
					</c:forEach>
				</c:when>


				<c:otherwise>
					<div class="rk-row">
						<div class="rk-rank-num">-</div>
						<div class="rk-nickname">랭킹 데이터가 없습니다.</div>
						<div class="rk-score">0</div>
					</div>
				</c:otherwise>
			</c:choose>


			<div class="rk-dots">
				<div class="rk-dot"></div>
				<div class="rk-dot"></div>
				<div class="rk-dot"></div>
			</div>


			<div class="rk-my">
				<div class="rk-my-left">${loginVO.nickname} 님의 순위</div>
				<div class="rk-my-right">${myRank}위 / ${myScore}점</div>
			</div>

		</div>
	</div>
	</div>
	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>
	<!-- /page -->
</body>
</html>
