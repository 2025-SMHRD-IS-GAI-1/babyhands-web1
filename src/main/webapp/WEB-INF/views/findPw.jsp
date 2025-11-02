<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
request.setCharacterEncoding("UTF-8");
%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>비밀번호 찾기</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="${ctx}/assets/css/findPw.css" />
</head>
<body>
	<div class="wrap">
		<div class="card">
			<h1 class="title">비밀번호 찾기</h1>

			<form id="findPwForm">
				<label for="id">아이디</label> <input id="id" name="id"
					type="text" placeholder="아이디 입력 (4~20자)" maxlength="20"/>
				<div id="idMsg" class="msg"></div>
				<label for="email">가입 이메일</label> <input id="email" name="email"
					type="text" placeholder="email@example.com" maxlength="100"/>
				<div id="emailMsg" class="msg"></div>

				<div class="actions">
					<button type="submit" id="findPwButton" class="btn btn-primary" disabled>비밀번호 찾기</button>
					<button type="button" class="btn btn-warning"
						onclick="location.href='${ctx}/Gologin.do'">취소</button>
				</div>
			</form>
		</div>
	</div>

	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/findPw.js"></script>
</body>
</html>
