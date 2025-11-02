<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
// 필요시 세션/쿠키 처리 등 부가 로직을 여기에 작성
%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>로그인</title>
<link rel="stylesheet" href="${ctx}/assets/css/login.css" />
</head>
<body>
	<main class="page">
		<section class="wrap">

			<!-- 왼쪽 일러스트 -->
			<aside class="hero" aria-hidden="true">
				<img src="${ctx}/assets/img/handicon.png" alt="손 인사 일러스트">
			</aside>

			<!-- 로그인 카드 -->
			<section class="card" aria-labelledby="loginTitle">
				<h1 id="loginTitle" class="title">로그인</h1>

				<form id="loginForm">
					<label class="label" for="id">아이디 <span id="idMsg"></span></label>
					<input id="id" name="id" type="text" class="input"
						placeholder="example" autocomplete="username" /> <label
						class="label" for="pw">비밀번호 <span id="pwMsg"></span></label> <input
						id="pw" name="pw" type="password" class="input" placeholder="•••"
						autocomplete="current-password" />

					<div class="help">
						<a href="${ctx}/FindId.do">아이디 찾기</a> <a href="${ctx}/FindPw.do">비밀번호
							찾기</a>
					</div>

					<button type="submit" class="btn btn-primary" id="loginButton">로그인</button>
				</form>

				<div class="divider"></div>

				<form action="${ctx}/Gojoin.do" method="get">
					<button type="submit" class="btn btn-accent">회원가입</button>
				</form>

				<p class="footnote">계정 보안을 위해 공용 PC에서는 로그인 후 반드시 로그아웃 해주세요.</p>
			</section>
		</section>
	</main>

	<script>window.APP_CTX = '${ctx}';</script>
	<script src="${ctx}/assets/js/login.js"></script>
</body>
</html>
