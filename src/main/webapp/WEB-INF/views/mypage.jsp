<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>마이페이지 | 꼬마손</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
	href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap"
	rel="stylesheet">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/assets/css/mypage.css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/assets/css/mypage.css?v=1">
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
</head>
<body>
	<div class="app-wrap">
		<!-- PAGE TITLE -->
		<main class="container mypage-container">
			<!-- NAV -->
			<jsp:include page="/WEB-INF/views/header.jsp">
				<jsp:param name="nav" value="learn" />
			</jsp:include>
			<h1 class="page-title">마이페이지</h1>

			<div class="grid">
				<!-- Profile Card -->
				<section class="card profile-card">
					<div class="profile-card__row">
						<div class="profile-meta">
							<dl class="meta">
								<div class="meta__row">
									<dt>닉네임</dt>
									<dd>${member.nickname}</dd>
								</div>
								<div class="meta__row">
									<c:choose>
										<c:when
											test="${not empty member.email
                 							and fn:endsWith(fn:toLowerCase(fn:trim(member.email)), '@kakao.com')}">
											<dt>이메일</dt>
											<dd>카카오 이메일은 준비중입니다.</dd>
										</c:when>
										<c:otherwise>
											<dt>이메일</dt>
											<dd>${member.email}</dd>
										</c:otherwise>
									</c:choose>

								</div>
							</dl>
						</div>
					</div>

					<div class="stat">
						<div class="stat__item">
							<div class="stat__label">누적 점수</div>
							<div class="stat__value">${memberScoreRank.totalScore}</div>
						</div>
						<div class="stat__divider" aria-hidden="true"></div>
						<div class="stat__item">
							<div class="stat__label">현재 랭킹</div>
							<div class="stat__value">${memberScoreRank.rankNo}위</div>
						</div>
					</div>
				</section>

				<!-- Shortcut Card -->
				<section class="card mypage-card profile-wrap">
					<div class="quick-list">
						<a class="btn btn--xl btn--primary" href="GoLastResult.do">지난
							학습결과</a> <a class="btn btn--xl btn--success" href="GomemberUpdate.do">회원
							정보 수정</a>
					</div>
				</section>
			</div>
	</div>
	</div>


	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<!-- [호환성] 이클립스 경로로 수정 -->
	<script src="${ctx}/assets/js/header.js"></script>


	<script src="/assets/js/mypage.js"></script>
</body>
</html>
