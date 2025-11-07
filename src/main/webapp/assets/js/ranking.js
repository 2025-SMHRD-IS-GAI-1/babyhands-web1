// ranking.js (스크롤 계산 안정판) — IO 사용 안 함
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("ranking-list");
  const loaderEl = document.getElementById("loader");
  const endEl = document.getElementById("end");
  const sentinel = document.getElementById("sentinel");
  const totalCountInput = document.getElementById("totalCount");

  if (!listEl || !loaderEl || !endEl || !sentinel) {
    console.error("[ranking.js] 필수 요소 누락");
    return;
  }

  // 스크롤 컨테이너(.rk-board)를 루트로 고정
  const root = document.querySelector(".rk-board");
  if (!root) {
    console.error("[ranking.js] .rk-board 를 못 찾음");
    return;
  }

  let offset = listEl.children.length; // 초기 5
  const limit = 20;
  let loading = false;
  let ended = false;

  const totalCount = totalCountInput ? Number(totalCountInput.value) : 0;

  // 초기 5개에서 memberId 수집 (각 행 data-id 필수)
  const seen = new Set(Array.from(listEl.children).map(el => String(el.dataset.id || "")));

  function createRow(it) {
    const row = document.createElement("div");
    row.className = "rk-row";
    row.dataset.id = String(it.memberId);
    row.dataset.rank = String(it.rankNo);

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

      offset += items.length;

      const total = typeof data.total === "number" ? data.total : totalCount;
      if (offset >= total || items.length < limit) {
        ended = true;
        loaderEl.style.display = "none";
        endEl.style.display = "block";
      }
    } catch (e) {
      console.error("[ranking.js] 로드 실패:", e);
    } finally {
      loading = false;
    }
  }

  // 바닥 근접 감지(루트는 .rk-board 고정)
  function onScroll() {
    if (ended || loading) return;
    const st = root.scrollTop;
    const ch = root.clientHeight;
    const sh = root.scrollHeight;
    if (st + ch >= sh - 300) fetchMore();
  }

  // 이벤트 + 초기 1회 강제 호출
  root.addEventListener("scroll", onScroll);
  // 레이아웃 계산 이후 한 번 호출
  setTimeout(() => {
    // 첫 화면에서 이미 바닥 근처면 즉시 로드
    onScroll();
    // 혹시 부족하면 한 번 더
    if (!loading && !ended) fetchMore();
  }, 0);
});
