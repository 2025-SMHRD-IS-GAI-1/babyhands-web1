<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="error" value="${requestScope.error}" />
<c:if test="${empty error}">
	<c:set var="error" value="${param.error}" />
</c:if>
<c:set var="redirectUrl" value="${requestScope.redirectUrl}" />
<c:if test="${empty redirectUrl}">
	<c:set var="redirectUrl" value="${ctx}/Gomain.do" />
</c:if>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>카카오 로그인 처리</title>
</head>
<body>
	<c:set var="hasError" value="${not empty error}" />
	<c:set var="errorMessage">
		<c:choose>
			<c:when test="${not empty error}">
				<c:out value="${error}" escapeXml="true" />
			</c:when>
			<c:otherwise></c:otherwise>
		</c:choose>
	</c:set>
	<c:set var="loginSuccess" value="${requestScope.loginSuccess == true}" />

	<div id="auth-data" data-has-error="${hasError}"
		data-error-message="<c:out value="${errorMessage}" escapeXml="true" />"
		data-login-success="${loginSuccess}"
		data-redirect-url="<c:out value="${redirectUrl}" escapeXml="true" />"
		style="display: none;"></div>

	<script>
		var authDataEl = document.getElementById('auth-data');
		var authData = {
			hasError : authDataEl.getAttribute('data-has-error') === 'true',
			errorMessage : authDataEl.getAttribute('data-error-message')
					|| null,
			loginSuccess : authDataEl.getAttribute('data-login-success') === 'true',
			redirectUrl : authDataEl.getAttribute('data-redirect-url') || null
		};

		if (authData.hasError && authData.errorMessage) {
			// 에러 발생 시 부모 창에 에러 메시지 전송
			window.opener.postMessage({
				type : 'KAKAO_AUTH_ERROR',
				error : authData.errorMessage
			}, window.location.origin);
			window.close();
		} else if (authData.loginSuccess) {
			// 서버에서 로그인 처리 성공
			window.opener.postMessage({
				type : 'KAKAO_AUTH_SUCCESS',
				redirect : authData.redirectUrl
			}, window.location.origin);
			window.close();
		} else {
			// 로그인 실패
			window.opener.postMessage({
				type : 'KAKAO_AUTH_ERROR',
				error : '카카오 로그인에 실패했습니다.'
			}, window.location.origin);
			window.close();
		}
	</script>
</body>
</html>

