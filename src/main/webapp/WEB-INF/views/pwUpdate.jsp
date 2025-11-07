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
<title>비밀번호 재설정</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="${ctx}/assets/css/pwUpdate.css" />
</head>
<body>
	<div class="wrap">
		<div class="card">
			<h1 class="title">비밀번호 재설정</h1>
			
			<input type="hidden" id="id" value="${param.memberId}"> 
			
			<form id="updatePwForm">
				<!-- 비밀번호 -->
				<label for="pw">비밀번호</label> <input id="pw" name="pw"
					type="password" placeholder="소문자, 대문자, 숫자, 특수문자 중 3종 포함 8~20자"
					maxlength="20" autocomplete="new-password" />
				<div id="pwMsg" class="msg"></div>

				<!-- 비밀번호 확인 -->
				<label for="pw2">비밀번호 확인</label> <input id="pw2" name="pw2"
					type="password" placeholder="비밀번호 재입력" maxlength="20"
					autocomplete="new-password" />
				<div id="pw2Msg" class="msg"></div>

				<div class="actions">
					<button type="submit" id="updatePwButton" class="btn btn-primary" disabled>비밀번호 재설정</button>
					<button type="button" class="btn btn-warning"
						onclick="location.href='${ctx}/Gologin.do'">취소</button>
				</div>
			</form>
		</div>
	</div>

	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/pwUpdate.js"></script>
</body>
</html>
