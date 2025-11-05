(function() {
	const chart = document.querySelector('.lr-chart');
	if (!chart) return;

	const GOAL_PER_DAY = Number(chart.dataset.goal) || 5; // 퍼센트 계산 기준 (예: 하루 목표 5)
	const MIN_BAR_PX = 4;

	const cols = Array.from(chart.querySelectorAll('.bar-col'));
	const bars = cols.map(c => c.querySelector('.bar'));
	const values = bars.map(b => Number(b.dataset.value) || 0);

	function getInnerHeight(el) {
		const cs = getComputedStyle(el);
		const pt = parseFloat(cs.paddingTop) || 0;
		const pb = parseFloat(cs.paddingBottom) || 0;
		return Math.max(0, el.clientHeight - pt - pb);
	}

	function render() {
		const innerH = getInnerHeight(chart);  // 점선 내부 콘텐츠 영역 높이
		const topInsetForLabel = 8;            // 라벨이 막대 안쪽에서 차지하는 최소 상단 여백
		const usableH = Math.max(0, innerH - topInsetForLabel);

		// 높이 정규화 기준: 주간 최대값
		const maxRaw = Math.max(1, ...values);

		bars.forEach((bar, i) => {
			const count = values[i];

			// 계산된 높이가 점선 영역을 절대로 넘지 않도록 캡
			let h = count === 0 ? MIN_BAR_PX
				: Math.round((count / maxRaw) * usableH);
			h = Math.min(h, usableH);

			// 적용
			bar.style.height = h-20 + 'px';

			// 퍼센트(목표 대비)
			const pctOfGoal = Math.max(0, Math.round((count / GOAL_PER_DAY) * 100));
			bar.setAttribute('data-percent', String(pctOfGoal));

			// 상태 클래스
			bar.classList.toggle('is-max', count === maxRaw && maxRaw > 0);
			bar.classList.toggle('is-zero', count === 0);

			// 접근성 툴팁
			bar.title = `개수 ${count}개 · 목표 대비 ${pctOfGoal}%`;
		});
	}

	render();
	window.addEventListener('resize', render);
})();