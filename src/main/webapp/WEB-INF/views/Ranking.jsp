<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>랭킹</title>
    <style>
        :root {
            --bg: #edf4ff;
            --card: #ffffff;
            --header: #ffffff;
            --row-top: #e9ffe4;
            --footer: #d4ebff;
        }
        * { box-sizing: border-box; font-family: "Pretendard","Noto Sans KR",sans-serif; }
        body { margin: 0; background: radial-gradient(circle at top, #f4f8ff 0%, #eaf2ff 60%, #e4efff 100%); }
        .wrapper { max-width: 950px; margin: 20px auto 40px; }
        .title { font-weight: 700; margin-bottom: 12px; }
        .board { background: var(--card); border-radius: 18px; padding: 18px 20px 24px; }
        .header-row {
            display: grid;
            grid-template-columns: 110px 1fr 130px;
            padding: 6px 15px 14px;
            border-bottom: 1px solid rgba(0,0,0,0.04);
            font-weight: 600;
            color: #555;
        }
        .rank-row {
            display: grid;
            grid-template-columns: 110px 1fr 130px;
            align-items: center;
            margin-top: 10px;
            background: #fff;
            border-radius: 14px;
            min-height: 55px;
            padding: 0 15px;
        }
        /* 1~3등 색 */
        .rank-row.top1 { background: #e9ffe4; }
        .rank-row.top2 { background: #f1ffe9; }
        .rank-row.top3 { background: #f9ffef; }

        .rank-num { font-size: 18px; font-weight: 700; }
        .nick-wrap { display: flex; align-items: center; gap: 10px; }
        .medal {
            width: 28px; height: 28px; border-radius: 50%;
            background: #ffb300; display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: #fff; font-weight: 700;
        }
        .medal.silver { background: #d0d5de; }
        .medal.bronze { background: #d79a5c; }
        .score { text-align: right; font-weight: 600; }

        /* 중간 ... 점 */
        .dots {
            display: flex;
            justify-content: center;
            gap: 14px;
            margin: 26px 0 20px;
        }
        .dot {
            width: 10px; height: 10px; background: #000; border-radius: 50%;
        }

        /* 내 순위 박스 */
        .my-rank {
            background: #d4ebff;
            border-radius: 16px;
            padding: 14px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
        }
        .my-rank-title { font-weight: 600; }
        .my-rank-score { font-weight: 700; }

    </style>
</head>
<body>
<div class="wrapper">
    <div class="title">랭킹</div>
    <div class="board">

        <!-- 헤더 -->
        <div class="header-row">
            <div>순위</div>
            <div>닉네임</div>
            <div>누적점수</div>
        </div>

        <!-- 리스트 -->
        <!-- rankList: [{rank:1, nickname:'...', score:...}, ...] 라고 가정 -->
        <c:forEach var="r" items="${rankList}">
            <c:choose>
                <c:when test="${r.rank == 1}">
                    <div class="rank-row top1">
                        <div class="rank-num">1</div>
                        <div class="nick-wrap">
                            <div class="medal">🥇</div>
                            <div>${r.nickname}</div>
                        </div>
                        <div class="score">${r.score}</div>
                    </div>
                </c:when>
                <c:when test="${r.rank == 2}">
                    <div class="rank-row top2">
                        <div class="rank-num">2</div>
                        <div class="nick-wrap">
                            <div class="medal silver">🥈</div>
                            <div>${r.nickname}</div>
                        </div>
                        <div class="score">${r.score}</div>
                    </div>
                </c:when>
                <c:when test="${r.rank == 3}">
                    <div class="rank-row top3">
                        <div class="rank-num">3</div>
                        <div class="nick-wrap">
                            <div class="medal bronze">🥉</div>
                            <div>${r.nickname}</div>
                        </div>
                        <div class="score">${r.score}</div>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="rank-row">
                        <div class="rank-num">${r.rank}</div>
                        <div>${r.nickname}</div>
                        <div class="score">${r.score}</div>
                    </div>
                </c:otherwise>
            </c:choose>
        </c:forEach>

        <!-- 점 3개 영역 -->
        <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>

        <!-- 내 순위 -->
        <div class="my-rank">
            <div class="my-rank-title">
                ${LoginMember.nickname} 님의 순위
            </div>
            <div class="my-rank-score">
                ${myRank}위 / ${myScore}점
            </div>
        </div>

    </div>
</div>
</body>
</html>
