<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>꼬마손 | 메인</title>
  <link rel="stylesheet" href="<%=request.getContextPath()%>/assets/css/main.css">
</head>
<body>
  <!-- 헤더 -->
  <header class="header">
    <div class="logo-area">
      <!-- 인라인 SVG: 손 로고 (이미지 파일 X) -->
      <svg class="logo" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffd666"/>
            <stop offset="1" stop-color="#ffb84d"/>
          </linearGradient>
        </defs>
        <path fill="url(#g)" stroke="#e0a94a" stroke-width="2"
              d="M14 30c0-5 4-9 9-9h1V9c0-2 2-4 4-4s4 2 4 4v10h2V8c0-2 2-4 4-4s4 2 4 4v11h2V11c0-2 2-4 4-4s4 2 4 4v22
                 c0 9-7 16-16 16H28c-7 0-14-6-14-13v-6z"/>
        <circle cx="10" cy="14" r="3" fill="#ffd666"/>
      </svg>
      <h1 class="brand">꼬마손</h1>
    </div>

    <nav class="nav">
      <a href="GoSl-learn.do" name="Learn">학습하기</a>
      <a href="GoSl-test.do" name="Test">테스트</a>
      <a href="#" name="Ranking">랭킹</a>
      <a href="Gomypage.do" name="Mypage">마이페이지</a>
    </nav>

    <div class="user">
      <span>${loginVO.nickname}</span>
      <button class="btn btn--primary" name="Logout">로그아웃</button>
    </div>
  </header>

  <!-- 메인 -->
  <main class="container">
  
  
  
  
    <!-- 캘린더 -->
<%-- ====== 동적 달력: 이번 달 + 오늘 강조 + 월 이동 ====== --%>
<%
    // Java 8+ java.time 사용
    java.time.LocalDate today = java.time.LocalDate.now();

    // 쿼리 파라미터(y, m)가 있으면 해당 월/년으로, 없으면 오늘 기준
    String py = request.getParameter("y");
    String pm = request.getParameter("m");

    int year  = (py != null && py.matches("\\d{1,4}")) ? Integer.parseInt(py) : today.getYear();
    int month = (pm != null && pm.matches("\\d{1,2}")) ? Integer.parseInt(pm) : today.getMonthValue();

    // 범위 보정 (1~12)
    if (month < 1) { month = 1; }
    if (month > 12){ month = 12; }

    java.time.LocalDate first = java.time.LocalDate.of(year, month, 1);
    int lengthOfMonth = first.lengthOfMonth();                          // 해당 월의 총 일수
    int firstDow = first.getDayOfWeek().getValue();                     // 1=월 ... 7=일 (우리 요일 헤더와 맞음)
    int leadingBlanks = firstDow - 1;                                   // 앞쪽 빈 칸 수
    int totalCells = leadingBlanks + lengthOfMonth;
    int trailingBlanks = (7 - (totalCells % 7)) % 7;                    // 뒤쪽 빈 칸 수 (모듈러 보정)

    // 이전/다음 월 계산
    java.time.LocalDate prevMonth = first.minusMonths(1);
    java.time.LocalDate nextMonth = first.plusMonths(1);

    // 현재 페이지 URI (월 이동 버튼 링크용)
    String self = request.getContextPath() + "/Gomain.do";
%>

<section class="calendar-section card">
  <!-- 헤더 (제목 + 오늘 버튼) -->
  <div class="cal__titlebar">
    <h2 class="card__title">출석 캘린더</h2>
    <a class="today-btn"
       href="<%= self %>?y=<%= today.getYear() %>&m=<%= today.getMonthValue() %>">오늘</a>
  </div>




  <div class="cal">
    <!-- 상단: 월 이동 헤더 -->
    <div class="cal__header">
      <a class="icon-btn" aria-label="이전 달"
         href="<%= self %>?y=<%= prevMonth.getYear() %>&m=<%= prevMonth.getMonthValue() %>">
        <span class="chev chev--left"></span>
      </a>

      <div class="cal__month">
        <%= month %> 월
      </div>

      <a class="icon-btn" aria-label="다음 달"
         href="<%= self %>?y=<%= nextMonth.getYear() %>&m=<%= nextMonth.getMonthValue() %>">
        <span class="chev chev--right"></span>
      </a>
    </div>

    <!-- 요일 헤더 -->
    <div class="cal__week" align="center">
      <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span class="sun">일</span>
    </div>

    <!-- 날짜 그리드(동적 생성) -->
    <div class="cal__grid">
      <%-- 앞쪽 빈 칸 --%>
      <% for (int i = 0; i < leadingBlanks; i++) { %>
        <span></span>
      <% } %>

      <%-- 1일부터 말일까지 --%>
      <%
        for (int d = 1; d <= lengthOfMonth; d++) {
            boolean isToday = (year == today.getYear()
                              && month == today.getMonthValue()
                              && d == today.getDayOfMonth());
      %>
          <button class="<%= isToday ? "today" : "" %>"><%= d %></button>
      <%
        }
      %>

      <%-- 뒤쪽 빈 칸 --%>
      <% for (int i = 0; i < trailingBlanks; i++) { %>
        <span></span>
      <% } %>
    </div>
  </div>
</section>




    <!-- KPI -->
    <aside class="kpi-wrap">
      <div class="card kpi">
        <h3 class="card__title">오늘의 목표</h3>
        <div class="donut" data-percent="80">
          <div class="donut__ring"></div>
          <div class="donut__label">80%</div>
        </div>
      </div>

      <div class="card kpi">
        <h3 class="card__title">전체 진행률</h3>
        <div class="donut" data-percent="70">
          <div class="donut__ring"></div>
          <div class="donut__label">70%</div>
        </div>
      </div>
    </aside>
  </main>

  <!-- 퍼센트 값 주입 -->
  <script>
    document.querySelectorAll('.donut').forEach(el => {
      el.style.setProperty('--percent', +el.dataset.percent || 0);
    });
  </script>
</body>
</html>