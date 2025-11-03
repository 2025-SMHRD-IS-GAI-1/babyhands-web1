<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <meta charset="UTF-8">
    <title>지난 학습결과</title>
<link rel="stylesheet" href="${ctx}/assets/css/LastResult.css" />
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
        <div class="nickname">${loginVO.nickname}</div>
        <button class="logout-btn">로그아웃</button>
    </div>

    <div class="page wrapper-center">
        <div class="title">지난 학습결과</div>

        <div class="top-boxes">
    		<div class="top-box">총 학습일 수 : ${TotalDays}일</div>
    		<div class="top-box">평균 : ${AverageScore}점</div>
		</div>

        <div class="main-grid">
            <!-- 왼쪽 -->
            <div class="left-panel">
                <div class="day-row">
                    <div class="day-text">지난학습결과날짜뭐라적어야할까.. · 1 / 10</div>
                    <button class="move-btn">이동</button>
                </div>
                <div class="day-row">
                    <div class="day-text">지난학습결과날짜뭐라적어야할까..  · 1 / 10</div>
                    <button class="move-btn">이동</button>
                </div>
                <div class="day-row">
                    <div class="day-text">지난학습결과날짜뭐라적어야할까..  · 1 / 10</div>
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
