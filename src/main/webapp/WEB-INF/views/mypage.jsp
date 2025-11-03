<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%
// 예시: 세션에서 꺼내 쓰는 값 (실서비스에 맞게 바꿔줘!)
String nickname = (String) session.getAttribute("nickname");
String realname = (String) session.getAttribute("realname");
String email = (String) session.getAttribute("email");
Integer totalScore = (Integer) session.getAttribute("totalScore");
Integer rank = (Integer) session.getAttribute("rank");

if (nickname == null)
	nickname = "닉네임";
if (realname == null)
	realname = "김민준";
if (email == null)
	email = "test4@gmail.com";
if (totalScore == null)
	totalScore = 15200;
if (rank == null)
	rank = 26;
%>
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
<link rel="stylesheet" href="${ctx}/assets/css/header.css" />
</head>
<body>
	<div class="app-wrap">

		<!-- NAV -->
		<jsp:include page="/WEB-INF/views/header.jsp">
			<jsp:param name="nav" value="learn" />
		</jsp:include>

		<!-- PAGE TITLE -->
		<div class="container">
			<h1 class="page-title">마이페이지</h1>

			<div class="grid">
				<!-- Profile Card -->
				<section class="card profile-card">
					<div class="profile-card__row">
						<div class="avatar">
							<div class="avatar__img" aria-hidden="true"></div>
						</div>
						<div class="profile-meta">
							<dl class="meta">
								<div class="meta__row">
									<dt>닉네임</dt>
									<dd>${loginVO.nickname}</dd>
								</div>

								<div class="meta__row">
									<dt>이메일</dt>
									<dd>${loginVO.email}</dd>
								</div>
							</dl>
						</div>
					</div>

					<div class="stat">
						<div class="stat__item">
							<div class="stat__label">누적 점수</div>
							<div class="stat__value"><%=String.format("%,d", totalScore)%></div>
						</div>
						<div class="stat__divider" aria-hidden="true"></div>
						<div class="stat__item">
							<div class="stat__label">현재 랭킹</div>
							<div class="stat__value"><%=rank%>위
							</div>
						</div>
					</div>
				</section>

				<!-- Shortcut Card -->
				<section class="card quick-card">
					<h2 class="sr-only">바로가기</h2>
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


</body>
</html>
