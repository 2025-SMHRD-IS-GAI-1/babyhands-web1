<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>손누리 서버 연결 테스트</title>
<style>
body {
	font-family: sans-serif;
	line-height: 1.4;
}

.toolbar {
	margin-bottom: 12px;
	display: flex;
	gap: 8px;
	align-items: center;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 16px;
}

.card {
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 12px;
}

.word {
	font-weight: 700;
	margin-bottom: 6px;
}

.type {
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
}

video {
	width: 100%;
	border-radius: 8px;
	outline: none;
}
</style>
</head>
<body>

	<h2>손누리 서버 연결 테스트</h2>

	<div class="toolbar">
		<button id="btn">불러오기</button>
		<input id="q" type="text" placeholder="검색: 단어/유형" />
	</div>

	<div id="grid" class="grid"></div>
	<pre id="debug" style="display: none;"></pre>

	<script>
const API_BASE = 'http://localhost:8000';

let rawData = [];

async function fetchLearn() {
  try {
    const res = await fetch(`${API_BASE}/learn`, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    rawData = await res.json();
    render(rawData);
  } catch (err) {
    alert('로드 실패: ' + err.message);
    console.error(err);
  }
}

function render(list) {
  const grid = document.getElementById('grid');
  grid.innerHTML = list.map(function(item) {
    // video_url이 '/static/...' 형태면 풀 URL로 변환
    var url = (item.video_url && item.video_url.startsWith('/'))
      ? (API_BASE + item.video_url)
      : (item.video_url || '');
    // 템플릿 리터럴은 유지하되, JSP EL 충돌은 위의 isELIgnored로 방지됨
    return `
      <div class="card">
        <div class="word">${escapeHtml(item.word || '')}</div>
        <div class="type">${escapeHtml(item.type || '')} • id: ${item.id ?? ''}</div>
        ${url ? `<video src="${url}" controls crossorigin="anonymous"></video>` : `<div style="color:#999;">동영상 없음</div>`}
      </div>
    `;
  }).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

document.getElementById('btn').addEventListener('click', fetchLearn);

// 간단 검색(단어/유형에 포함되면 표시)
document.getElementById('q').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return render(rawData);
  const filtered = rawData.filter(it => 
    (it.word || '').toLowerCase().includes(q) ||
    (it.type || '').toLowerCase().includes(q)
  );
  render(filtered);
});
</script>













<hr>
<h3>실시간 따라하기 (카메라 정확도)</h3>
<div class="toolbar">
  <button id="camStart">카메라 시작</button>
  <button id="camStop" disabled>정지</button>
  <span id="liveLabel" style="margin-left:8px; font-weight:700;"></span>
</div>

<video id="cam" autoplay playsinline style="width:480px; max-width:100%; border-radius:8px; background:#000"></video>
<canvas id="camCanvas" width="224" height="224" style="display:none;"></canvas>

<div style="margin-top:8px;">
  정확도: <span id="scoreText">-</span>
  <div style="height:10px; background:#eee; border-radius:6px; overflow:hidden; width:480px; max-width:100%; margin-top:6px;">
    <div id="scoreBar" style="height:100%; width:0%; background:#4caf50;"></div>
  </div>
</div>

<script>
// 이미 위에 API_BASE가 있음
const API2 = (typeof API_BASE !== 'undefined') ? API_BASE : 'http://localhost:8000';

let stream = null;
let timer = null;

async function startCam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const v = document.getElementById('cam');
    v.srcObject = stream;
    document.getElementById('camStart').disabled = true;
    document.getElementById('camStop').disabled = false;

    // 300ms마다 프레임 전송
    timer = setInterval(captureAndSend, 300);
  } catch (e) {
    alert('카메라 시작 실패: ' + e.message);
    console.error(e);
  }
}

function stopCam() {
  if (timer) { clearInterval(timer); timer = null; }
  const v = document.getElementById('cam');
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  v.srcObject = null;
  document.getElementById('camStart').disabled = false;
  document.getElementById('camStop').disabled = true;
}

async function captureAndSend() {
  const v = document.getElementById('cam');
  const c = document.getElementById('camCanvas');
  const ctx = c.getContext('2d');

  // 224x224로 다운스케일 (전송량↓, 추론속도↑)
  ctx.drawImage(v, 0, 0, c.width, c.height);

  // JPEG로 인코딩해서 서버로 보내기
  const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.7));
  const fd = new FormData();
  fd.append('frame', blob, 'frame.jpg');

  try {
    const r = await fetch(`${API2}/score`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json(); // { label, score: 0~1 }
    updateScoreUI(data);
  } catch (e) {
    console.error('score error', e);
    // 네트워크가 잠깐 끊겨도 루프는 계속
  }
}

function updateScoreUI(data) {
  const label = data.label || '예측중';
  const score = typeof data.score === 'number' ? data.score : 0;
  document.getElementById('liveLabel').textContent = `예측: ${label}`;
  document.getElementById('scoreText').textContent = `${(score*100).toFixed(1)}%`;
  document.getElementById('scoreBar').style.width = `${Math.max(0, Math.min(100, score*100))}%`;
}

document.getElementById('camStart').addEventListener('click', startCam);
document.getElementById('camStop').addEventListener('click', stopCam);
</script>








</body>
</html>
