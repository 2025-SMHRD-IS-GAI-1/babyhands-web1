<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <meta charset="UTF-8">
    <title>지난 학습결과</title>
<style>
    :root {
        --bg: #edf4ff;              /* 화면 전체 연한 파랑 */
        --header-bg: #ffffff;       /* 상단바 흰색 */
        --main-blue: #2f80ff;       /* 포인트 블루 (버튼, 가운데 막대) */
        --bar-blue: rgba(47,128,255,0.28);  /* 옆 막대들 연파랑 */
        --card: #ffffff;
        --green-box: #dff1d9;       /* 위에 “총 학습일 수” 박스 */
        --border-dash: rgba(71, 111, 142, 0.12);
    }

    * {
        box-sizing: border-box;
        font-family: "Pretendard", "Noto Sans KR", sans-serif;
    }

    body {
        margin: 0;
        background: radial-gradient(circle at top, #f4f8ff 0%, #eaf2ff 60%, #e4efff 100%);
    }

    /* 상단바 - 흰색 */
    .topbar {
        height: 68px;
        background: var(--header-bg);
        display: flex;
        align-items: center;
        padding: 0 30px;
        gap: 30px;
        color: #222;
        box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
    }
    .logo-badge {
        width: 42px;
        height: 42px;
        border-radius: 16px;
        background: #ffd95a;           /* 노란 손 아이콘 배경 */
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    .menu {
        display: flex;
        gap: 38px;
        flex: 1;
        justify-content: center;
    }

    .menu-item {
        font-weight: 500;
        cursor: pointer;
        color: #0f3554;
    }

    .nickname {
        margin-right: 14px;
        font-weight: 500;
        color: #0f3554;
    }

    .logout-btn {
        background: #58aefe;
        color: #fff;
        border: none;
        border-radius: 14px;
        padding: 7px 18px;
        font-weight: 500;
        cursor: pointer;
    }

    /* 전체 컨테이너 */
    .page {
        padding: 24px 32px 32px;
    }

    /* 제목 */
    .title {
        font-size: 20px;
        font-weight: 700;
        border-bottom: 1px dashed var(--border-dash);
        padding-bottom: 10px;
        margin-bottom: 20px;
        color: #152f42;
    }

    /* 위쪽 2개 박스 */
    .top-boxes {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    }

    .top-box {
        background: var(--green-box);
        border-radius: 14px;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 30px;
        flex: 1;
        font-weight: 600;
        font-size: 15px;
        color: #1f3f25;
        border: 1px solid rgba(209,229,210,0.2);
    }

    /* 메인 영역 2컬럼 */
    .main-grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 26px;
    }

    /* 왼쪽 리스트 */
    .left-panel {
        background: #ffffff;
        border-radius: 20px;
        min-height: 520px;
        padding: 22px 20px;
        border: 1px solid rgba(232, 241, 252, 0.9);
        box-shadow: 0 10px 25px rgba(195,214,236,0.25);
    }

    .day-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 26px;
    }

    .day-text {
        font-size: 14px;
        color: #222;
    }

    .move-btn {
        background: var(--main-blue);
        color: #fff;
        border: none;
        border-radius: 999px;
        width: 72px;
        height: 35px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 3px 8px rgba(47,128,255,0.35);
    }

    /* 오른쪽 그래프 카드 */
    .right-panel {
        background: #ffffff;
        border-radius: 20px;
        min-height: 520px;
        padding: 22px 24px 32px;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(232, 241, 252, 0.9);
        box-shadow: 0 10px 25px rgba(195,214,236,0.25);
    }

    .panel-title {
        font-weight: 600;
        margin-bottom: 30px;
    }

    .chart {
        flex: 1;
        display: flex;
        align-items: flex-end;
        gap: 26px;
        justify-content: center;
        padding-bottom: 20px;
    }

    .bar-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .bar {
        width: 52px;
        border-radius: 18px 18px 18px 18px;
        background: var(--bar-blue);     /* 기본 막대는 연파랑 */
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    /* 각 요일 높이 - 너 예시와 비슷하게 */
    .bar.mon { height: 140px; }
    .bar.tue { height: 175px; }
    .bar.wed { height: 210px; background: var(--main-blue); }  /* 가운데만 진하게 */
    .bar.thu { height: 185px; }
    .bar.fri { height: 165px; }
    .bar.sat { height: 130px; }
    .bar.sun { height: 115px; }

    .day-name {
        font-size: 13px;
        letter-spacing: 0.04em;
    }

    /* 전체 폭 고정 느낌 주려고 */
    .wrapper-center {
        max-width: 1150px;
        margin: 0 auto;
    }
</style>
</head>
<body>
    <!-- 상단바 -->
    <div class="topbar">
        <div class="logo">
            <div class="logo-badge">✋</div>
            <div>꼬마손</div>
        </div>
        <div class="menu">
            <div class="menu-item">학습하기</div>
            <div class="menu-item">테스트</div>
            <div class="menu-item">랭킹</div>
            <div class="menu-item">마이페이지</div>
        </div>
        <div class="nickname">수정필요한부분</div>
        <button class="logout-btn">로그아웃</button>
    </div>

    <div class="page wrapper-center">
        <div class="title">지난 학습결과</div>

        <div class="top-boxes">
            <div class="top-box">총 학습일 수 : 수정필요한부분</div>
            <div class="top-box">평균 : 수정필요한부분</div>
        </div>

        <div class="main-grid">
            <!-- 왼쪽 -->
            <div class="left-panel">
                <div class="day-row">
                    <div class="day-text">수정이-필요한-부분 · 1 / 10</div>
                    <button class="move-btn">이동</button>
                </div>
                <div class="day-row">
                    <div class="day-text">수정이-필요한-부분 · 1 / 10</div>
                    <button class="move-btn">이동</button>
                </div>
                <div class="day-row">
                    <div class="day-text">수정이-필요한-부분 · 1 / 10</div>
                    <button class="move-btn">이동</button>
                </div>
            </div>

            <!-- 오른쪽 -->
            <div class="right-panel">
                <div class="panel-title">주간 학습량</div>
                <div class="chart">
                    <div class="bar-col">
                        <div class="bar mon"></div>
                        <div class="day-name">월</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar tue"></div>
                        <div class="day-name">화</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar wed"></div>
                        <div class="day-name">수</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar thu"></div>
                        <div class="day-name">목</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar fri"></div>
                        <div class="day-name">금</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar sat"></div>
                        <div class="day-name">토</div>
                    </div>
                    <div class="bar-col">
                        <div class="bar sun"></div>
                        <div class="day-name">일</div>
                    </div>
                </div>
            </div>
        </div> <!-- /main-grid -->
    </div> <!-- /page -->
</body>
