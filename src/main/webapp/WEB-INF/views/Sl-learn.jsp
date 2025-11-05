<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>랭킹</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />

    <!-- CSS 연결 -->
    <link rel="stylesheet" href="${ctx}/assets/css/header.css" />
    <link rel="stylesheet" href="${ctx}/assets/css/Ranking.css" />
</head>
<body>
    <div class="rk-viewport">
        <div class="rk-container">
            <jsp:include page="/WEB-INF/views/header.jsp">
                <jsp:param name="nav" value="learn" />
            </jsp:include>

            <div class="rk-wrapper">
                <div class="rk-title">랭킹</div>

                <div class="rk-board">
                    <div class="rk-header-row">
                        <div>순위</div>
                        <div>닉네임</div>
                        <div>누적점수</div>
                    </div>

                    <c:choose>
                        <c:when test="${not empty rankList}">
                            <c:forEach var="r" items="${rankList}">
                                <c:choose>
                                    <c:when test="${r.rankNo == 1}">
                                        <div class="rk-row rk-top1">
                                            <div class="rk-rank-num">1</div>
                                            <div class="rk-nick-wrap">
                                                <div class="rk-medal rk-gold">🥇</div>
                                                <div class="rk-nickname">${r.memberId}</div>
                                            </div>
                                            <div class="rk-score">${r.totalScore}</div>
                                        </div>
                                    </c:when>
                                    <c:when test="${r.rankNo == 2}">
                                        <div class="rk-row rk-top2">
                                            <div class="rk-rank-num">2</div>
                                            <div class="rk-nick-wrap">
                                                <div class="rk-medal rk-silver">🥈</div>
                                                <div class="rk-nickname">${r.memberId}</div>
                                            </div>
                                            <div class="rk-score">${r.totalScore}</div>
                                        </div>
                                    </c:when>
                                    <c:when test="${r.rankNo == 3}">
                                        <div class="rk-row rk-top3">
                                            <div class="rk-rank-num">3</div>
                                            <div class="rk-nick-wrap">
                                                <div class="rk-medal rk-bronze">🥉</div>
                                                <div class="rk-nickname">${r.memberId}</div>
                                            </div>
                                            <div class="rk-score">${r.totalScore}</div>
                                        </div>
                                    </c:when>
                                    <c:otherwise>
                                        <div class="rk-row">
                                            <div class="rk-rank-num">${r.rankNo}</div>
                                            <div class="rk-nickname">${r.memberId}</div>
                                            <div class="rk-score">${r.totalScore}</div>
                                        </div>
                                    </c:otherwise>
                                </c:choose>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <div class="rk-row">
                                <div class="rk-rank-num">-</div>
                                <div class="rk-nickname">랭킹 데이터가 없습니다.</div>
                                <div class="rk-score">0</div>
                            </div>
                        </c:otherwise>
                    </c:choose>

                    <div class="rk-dots">
                        <div class="rk-dot"></div>
                        <div class="rk-dot"></div>
                        <div class="rk-dot"></div>
                    </div>

                    <div class="rk-my">
                        <div class="rk-my-left">${loginVO.nickname}님의순위</div>
                        <div class="rk-my-right">${myRank}위/${myScore}점</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.APP_CTX = '${ctx}';
    </script>
    <script src="${ctx}/assets/js/header.js"></script>
</body>
</html>
