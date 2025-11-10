// ranking.js — 스크롤 계산 안정판 (초기 자동 로드 X)
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("ranking-list");
  const loaderEl = document.getElementById("loader");
  const endEl    = document.getElementById("end");
  const totalCountInput = document.getElementById("totalCount");
  const dotsEl = document.querySelector(".rk-dots");
  const scroll = document.querySelector(".rk-scroll");
  const myRank = document.querySelector(".my-rank");
  

  if (!listEl || !loaderEl || !endEl) {
    console.error("[ranking.js] 필수 요소 누락");
    return;
  }

  let offset = listEl.children.length; // 초기 5
  const limit = 20;
  let loading = false;
  let ended   = false;

  const totalCount = totalCountInput ? Number(totalCountInput.value) : 0;

  const seen = new Set(Array.from(listEl.children).map(el => String(el.dataset.id || "")));

  function createRow(it) {
    const row = document.createElement("div");
    row.className   = "rk-row";
    row.dataset.id  = String(it.memberId);
    row.dataset.rank= String(it.rankNo);

    const cRank = document.createElement("div");
    cRank.className = "rk-rank-num";
    cRank.textContent = String(it.rankNo);
    row.appendChild(cRank);

    if (it.rankNo <= 3) {
      const wrap = document.createElement("div");
      wrap.className = "rk-nick-wrap";
      const medal = document.createElement("div");
      const medalClass = it.rankNo === 1 ? "rk-gold" : (it.rankNo === 2 ? "rk-silver" : "rk-bronze");
      medal.className = "rk-medal " + medalClass;
      medal.textContent = it.rankNo === 1 ? "🥇" : (it.rankNo === 2 ? "🥈" : "🥉");
      const nick = document.createElement("div");
      nick.className = "rk-nickname";
      nick.textContent = it.nickname;
      wrap.appendChild(medal);
      wrap.appendChild(nick);
      row.appendChild(wrap);
    } else {
      const nick = document.createElement("div");
      nick.className = "rk-nickname";
      nick.textContent = it.nickname;
      row.appendChild(nick);
    }

    const score = document.createElement("div");
    score.className = "rk-score";
    score.textContent = String(it.totalScore);
    row.appendChild(score);

    return row;
  }

  async function fetchMore() {
    if (loading || ended) return;
    loading = true;
    loaderEl.style.display = "block";

    try {
      const url = rankingApi + "?offset=" + offset + "&limit=" + limit;
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      const items = Array.isArray(data.items) ? data.items : [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const key = String(it.memberId || "");
        if (!key || seen.has(key)) continue;
        seen.add(key);
        listEl.appendChild(createRow(it));
      }

	    offset += items.length;  // ✅ 여기까지 기존 코드

	    // ✅ 이 아래에 새로 추가!
	    const total = typeof data.total === "number" ? data.total : totalCount;

	    if (offset >= total || items.length < limit) {
	      ended = true;
	      loaderEl.style.display = "none";
	      endEl.style.display = "block";
	      if (dotsEl) dotsEl.style.display = "none"; // 🔥 마지막이면 점 숨기기
	    } else {
	      if (dotsEl) dotsEl.style.display = "flex"; // 👀 아직 더 있을 땐 다시 보이게
	    }

	  } catch (e) {
	    console.error("[ranking.js] 로드 실패:", e);
	  } finally {
	    loading = false;
	  }
  }

  // ---------- 무한 스크롤 트리거 (초기 강제 로드 없음) ----------
  function isScrollable(el){
    if (!el) return false;
    const cs = getComputedStyle(el);
    const hasScroll = el.scrollHeight > el.clientHeight;
    return hasScroll && cs.overflowY !== "visible" && cs.overflowY !== "hidden";
  }

  let activated = false;                               // 유저가 실제로 스크롤 시도했는지
  let box = document.querySelector(".rk-scroll");       // 내부 스크롤 컨테이너
  let useWindow = !box || !isScrollable(box);          // 스크롤 상자가 아니면 window 사용
  const target = useWindow ? window : box;             // 이벤트 대상

  function getScrollState() {
    if (useWindow) {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const ch = window.innerHeight;
      const sh = document.documentElement.scrollHeight;
      return { st, ch, sh };
    } else {
      const st = box.scrollTop;
      const ch = box.clientHeight;
      const sh = box.scrollHeight;
      return { st, ch, sh };
    }
  }

  function onScroll() {
    if (ended || loading) return;
    if (!activated) return;                            // 스크롤 시도 전이면 동작 X
    const { st, ch, sh } = getScrollState();
    if (st + ch >= sh - 300) fetchMore();
  }

  function firstKick() {
    if (activated) return;
    activated = true;
    // 컨테이너가 아직 스크롤 불가면 1번 로드해서 키워주기
    if (!useWindow && !isScrollable(box)) fetchMore();
    else onScroll();
  }

  target.addEventListener("scroll", onScroll, { passive: true });
  target.addEventListener("wheel", firstKick, { passive: true });
  target.addEventListener("touchstart", firstKick, { passive: true });
  target.addEventListener("keydown", (e) => {
    const keys = ["PageDown", " ", "ArrowDown", "End"];
    if (keys.includes(e.key)) firstKick();
  });
  
  
  if (scroll && myRank) {
    const applyHeight = () => {
      const h = Math.ceil(myRank.getBoundingClientRect().height);
      scroll.style.setProperty("--my-rank-h", (h) + "px");
      /* ⬇️ 내 순위를 더 위로 올리고 싶으면 여기 숫자만 바꿔줘 */
      scroll.style.setProperty("--my-rank-offset", "32px"); // 16px ↑ 띄우기 (원하는 값)
    };

    applyHeight();

    const ro = new ResizeObserver(applyHeight);
    ro.observe(myRank);

    document.addEventListener("rank:list:updated", applyHeight);
  }
});
