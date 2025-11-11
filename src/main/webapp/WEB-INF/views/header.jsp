<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- nav 활성화값은 param.nav(동적 include) 또는 requestScope.nav(서블릿에서 set) 로 받음 -->
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="nav" value="${empty param.nav ? requestScope.nav : param.nav}" />

<header class="header">
  <div class="header-left">
    <a href="${ctx}/Gomain.do" class="logo">
      <span class="logo-icon">🖐️</span>
      <span class="logo-text">꼬마손</span>
    </a>
  </div>

  <nav class="main-nav">
    <ul class="header-ul">
      <li><a href="${ctx}/GoSl-learn.do"   class="<c:out value='${nav=="learn"?"active":""}'/>">학습하기</a></li>
      <li><a href="${ctx}/GoSl-test.do"    class="<c:out value='${nav=="test"?"active":""}'/>">테스트</a></li>
      <li><a href="${ctx}/GoRanking.do" class="<c:out value='${nav=="rank"?"active":""}'/>">랭킹</a></li>
      <li><a href="${ctx}/Gomypage.do"  class="<c:out value='${nav=="mypage"?"active":""}'/>">마이페이지</a></li>
    </ul>
  </nav>

  <div class="header-right">
    <span class="username">
      ${loginVO.nickname} 님
    </span>

    <form id="logoutButton" style="display:inline">
      <button type="submit" class="header-button">로그아웃</button>
    </form>
  </div>
</header>


