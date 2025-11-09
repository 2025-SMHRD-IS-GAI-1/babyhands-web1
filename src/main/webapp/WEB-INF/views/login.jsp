<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
// context.xml에서 구글 클라이언트 ID 가져오기
String googleClientId = null;
try {
	javax.naming.Context env = (javax.naming.Context) new javax.naming.InitialContext().lookup("java:comp/env");
	googleClientId = (String) env.lookup("google.client.id");
} catch (Exception e) {
	// JNDI 조회 실패 시 기본값 또는 에러 처리
	googleClientId = "YOUR_GOOGLE_CLIENT_ID_HERE";
}
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
						<a href="${ctx}/GofindId.do">아이디 찾기</a> <a href="${ctx}/GofindPw.do">비밀번호
							찾기</a>
					</div>

					<button type="submit" class="btn btn-primary" id="loginButton">로그인</button>
					<button type="button" class="btn btn-google" id="googleLoginButton">
						<svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px;">
							<path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
							<path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
							<path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
							<path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.158 6.656 3.58 9 3.58z"/>
						</svg>
						구글로 로그인
					</button>
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
	<script>window.GOOGLE_CLIENT_ID = '<%= googleClientId != null ? googleClientId : "YOUR_GOOGLE_CLIENT_ID_HERE" %>';</script>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
	<script src="${ctx}/assets/js/login.js"></script>
</body>
</html>
