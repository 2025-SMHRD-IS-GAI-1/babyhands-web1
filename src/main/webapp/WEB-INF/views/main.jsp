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
      <a href="#" name="Learn">학습하기</a>
      <a href="#" name="Test">테스트</a>
      <a href="#" name="Ranking">랭킹</a>
      <a href="#" name="Mypage">마이페이지</a>
    </nav>

    <div class="user">
      <span>사용자 이름</span>
      <button class="btn btn--primary" name="Logout">로그아웃</button>
    </div>
  </header>

  <!-- 메인 -->
  <main class="container">
    <!-- 캘린더 -->
    <section class="calendar-section card">
      <h2 class="card__title">출석 캘린더</h2>

      <div class="cal">
        <div class="cal__header">
          <button class="icon-btn" aria-label="이전 달"><span class="chev chev--left"></span></button>
          <div class="cal__month">6    월</div>
          <button class="icon-btn" aria-label="다음 달"><span class="chev chev--right"></span></button>
        </div>

        <div class="cal__week" align="center">
          <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span class="sun">일</span>
        </div>

        <div class="cal__grid">
          <!-- 앞칸 2칸 비움 -->
          <span></span><span></span>
          <!-- 1~7 -->
          <button>1</button><button>2</button><button class="check">3</button><button>4</button><button>5</button><button class="check">6</button><button>7</button>
          <!-- 8~14 -->
          <button>8</button><button>9</button><button>10</button><button>11</button><button>12</button><button>13</button><button>14</button>
          <!-- 15~21 -->
          <button>15</button><button>16</button><button>17</button><button>18</button><button>19</button><button>20</button><button>21</button>
          <!-- 22~28 -->
          <button>22</button><button class="check">23</button><button class="check">24</button><button>25</button><button>26</button><button>27</button><button class="check">28</button>
          <!-- 29~30 -->
          <button>29</button><button>30</button>
          <!-- 남는칸 -->
          <span></span><span></span><span></span><span></span><span></span>
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