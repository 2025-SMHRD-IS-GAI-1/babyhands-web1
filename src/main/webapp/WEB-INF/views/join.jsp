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
<title>회원가입</title>
<link rel="stylesheet" href="${ctx}/assets/css/join.css" />

</head>

<body>
	<div class="wrap">
		<div class="card">
			<h1 class="title">회원가입</h1>

			<form id="joinForm" action="${ctx}/Join.do" method="post" novalidate>
				<!-- 아이디 -->
				<label for="id" class="label-with-icon"> 아이디 <span id="idStatus" class="status-icon"
					aria-hidden="true" title="중복 확인 완료"> <!-- 초록 체크 SVG --> <svg
							viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor"
								d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
				</span>
				</label>

				<div class="row">
					<input id="id" name="id" type="text" placeholder="아이디 입력 (4~20자)"
						maxlength="20" autocomplete="username" />
					<button type="button" id="idCheckBtn"
						class="btn btn-primary btn-sm" disabled>중복 확인</button>
				</div>
				<div id="idMsg" class="msg"></div>

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

				<!-- 닉네임 -->
				<label for="nickname" class="label-with-icon">닉네임
				<span id="nicknameStatus" class="status-icon"
					aria-hidden="true" title="중복 확인 완료"> <!-- 초록 체크 SVG --> <svg
							viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor"
								d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
				</span>
				</label>
				<div class="row">
					<input id="nickname" name="nickname" type="text" placeholder="한글 2~20자"
						maxlength="20" />
					<button type="button" id="nickCheckBtn"
						class="btn btn-primary btn-sm" disabled>중복 확인</button>
				</div>
				<div id="nickMsg" class="msg"></div>
				<!-- 이메일 -->
				<label for="email">이메일</label> <input id="email" name="email"
					type="email" placeholder="email@example.com" maxlength="100"/>
				<div id="emailMsg" class="msg"></div>

				<!-- 버튼 -->
				<div class="actions">
					<button id="joinButton" class="btn btn-primary" type="submit"
						disabled>가입하기</button>
					<button class="btn btn-warning" type="button"
						onclick="location.href='${ctx}/Gologin.do'">가입취소</button>
				</div>

				<!-- 힌트 -->
				<p class="hint">
					아이디는 영문 소문자/숫자 4~20자<br>
					비밀번호는 소문자, 대문자, 숫자, 특수문자 중 3종 포함 8~20자<br>
					닉네임은 한글 2~20자<br>
				</p>
			</form>
		</div>
	</div>
	<script>
		window.APP_CTX = '${ctx}';
	</script>
	<script src="${ctx}/assets/js/join.js"></script>
</body>
</html>
