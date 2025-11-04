// 마이페이지 전용 미니 스크립트 (공통 header.js 뒤에 로드됨)

// 1) null/빈 값 대비: 안전 표시
document.addEventListener('DOMContentLoaded', () => {
  const safe = (v, alt = '-') => (v === null || v === undefined || v === '' ? alt : v);

  const nicknameEl = document.querySelector('.meta__row:nth-child(1) dd');
  const emailEl    = document.querySelector('.meta__row:nth-child(2) dd');
  const scoreEl    = document.querySelector('.stat__item:nth-child(1) .stat__value');
  const rankEl     = document.querySelector('.stat__item:nth-child(3) .stat__value');

  if (nicknameEl) nicknameEl.textContent = safe(nicknameEl.textContent, '게스트');
  if (emailEl)    emailEl.textContent    = safe(emailEl.textContent, 'email@unknown');
  if (scoreEl)    scoreEl.textContent    = safe(scoreEl.textContent, '0');
  if (rankEl)     rankEl.textContent     = safe(rankEl.textContent, '-');

  // 2) 버튼 포커스 접근성
  document.querySelectorAll('.quick-list .btn').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.currentTarget.click();
      }
    });
  });

  // 3) 살짝 애니메이션 (첫 진입 느낌)
  const cards = document.querySelectorAll('.mypage-container .card');
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(6px)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        c.style.transition = 'opacity .35s ease, transform .35s ease';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, 60 + i * 100);
    });
  });
});
