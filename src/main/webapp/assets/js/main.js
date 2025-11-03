(function() {

	// ===== KPI 도넛 초기화 =====
	document.querySelectorAll('.donut').forEach(el => {
		el.style.setProperty('--percent', +el.dataset.percent || 0);
	});

	// ===== 유틸 =====
	const qs = (sel, el = document) => el.querySelector(sel);

	// 오늘
	const today = new Date();
	const attendance = [];

	// --- 초기값: localStorage 복원(있으면), 없으면 오늘 ---
	const ySaved = parseInt(localStorage.getItem("cal:y"), 10);
	const mSaved = parseInt(localStorage.getItem("cal:m"), 10);

	let curYear = Number.isInteger(ySaved) ? ySaved : today.getFullYear();
	let curMonth = Number.isInteger(mSaved) ? mSaved : (today.getMonth() + 1); // 1~12

	// 요소 참조
	const monthLabel = qs("#monthLabel");
	const grid = qs("#calGrid");
	const btnPrev = qs("#btnPrev");
	const btnNext = qs("#btnNext");
	const btnToday = qs("#btnToday");

	if (!monthLabel || !grid) {
		// 이 페이지에 캘린더가 없으면 조용히 종료
		return;
	}

	// 월 길이/첫 요일 계산 (월=1..일=7 기준)
	function getMonthInfo(year, month1to12) {
		const first = new Date(year, month1to12 - 1, 1);
		const last = new Date(year, month1to12, 0); // day=0 -> 이전 달 말일
		const lengthOfMonth = last.getDate();

		// JS: 0=일, 1=월, ... 6=토  -> 우리 규칙(월=1..일=7)로 변환
		const jsDow = first.getDay(); // 0~6
		const firstDow = jsDow === 0 ? 7 : jsDow; // 1~7 (월=1, ..., 일=7)
		const leadingBlanks = firstDow - 1; // 앞쪽 빈 칸 수
		const totalCells = leadingBlanks + lengthOfMonth;
		const trailingBlanks = (7 - (totalCells % 7)) % 7;

		return { lengthOfMonth, leadingBlanks, trailingBlanks };
	}

	// (선택) 상태 저장: 새로고침 후에도 유지하고 싶다면 사용
	function saveState() {
		localStorage.setItem("cal:y", String(curYear));
		localStorage.setItem("cal:m", String(curMonth));
	}

	// 렌더링
	function renderCalendar(year, month1to12) {
		const { lengthOfMonth, leadingBlanks, trailingBlanks } = getMonthInfo(year, month1to12);

		// 라벨
		monthLabel.textContent = `${year}년 ${month1to12}월`;

		// 그리드 비우고 다시 채우기
		grid.innerHTML = "";

		// 앞쪽 빈 칸
		for (let i = 0; i < leadingBlanks; i++) {
			grid.appendChild(document.createElement("span"));
		}

		// 날짜 버튼
		for (let d = 1; d <= lengthOfMonth; d++) {
			const btn = document.createElement("button");
			btn.dataset.day = String(d);

			// 오늘 강조
			if (
				year === today.getFullYear() &&
				month1to12 === today.getMonth() + 1 &&
				d === today.getDate()
			) {
				btn.className = "today";
			}
			btn.textContent = String(d);

			// 필요 시 클릭 핸들러(출석/메모 등) 달기
			// btn.addEventListener("click", () => { ... });

			grid.appendChild(btn);
		}

		// 뒤쪽 빈 칸
		for (let i = 0; i < trailingBlanks; i++) {
			grid.appendChild(document.createElement("span"));
		}

		// (선택) 상태 저장
		saveState();

		// 출석 날짜 불러오기
		getAttendanceDay();
	}

	// 월 이동
	function changeMonth(offset) {
		let m = curMonth + offset; // 1~12 범위를 벗어날 수 있음
		let y = curYear;

		if (m < 1) {
			m = 12;
			y -= 1;
		} else if (m > 12) {
			m = 1;
			y += 1;
		}
		curYear = y;
		curMonth = m;
		renderCalendar(curYear, curMonth);
	}

	function goToday() {
		curYear = today.getFullYear();
		curMonth = today.getMonth() + 1;
		renderCalendar(curYear, curMonth);
	}

	function getAttendanceDay() {
		const body = new URLSearchParams({ curYear: curYear, curMonth: curMonth });

		fetch(`${APP_CTX}/GetAttendanceDay.do`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body,
			credentials: "same-origin",
		})
			.then(function(res) {
				return res.json();
			})
			.then((data) => {
				if (data && data.ok) {
					applyAttendance(data.days);
				} else {
					alert(data.message);
				}
			})
			.catch(function(err) {
				console.error(err);
				alert("네트워크 오류가 발생했습니다.");
			})
	}

	function applyAttendance(dayArray) {
		// 이전 표시 제거
		grid.querySelectorAll('button.check').forEach(b => b.classList.remove('check'));

		// 숫자 Set로 변환
		const days = new Set((dayArray || []).map(n => parseInt(n, 10)).filter(Number.isInteger));

		// 버튼들 순회하며 해당 일자에 check 클래스 추가
		grid.querySelectorAll('button').forEach(btn => {
			const d = parseInt(btn.dataset.day, 10);
			if (days.has(d)) btn.classList.add('check');   // ← 네 CSS에 맞춤
		});
	}

	// 이벤트
	if (btnPrev) btnPrev.addEventListener("click", () => changeMonth(-1));
	if (btnNext) btnNext.addEventListener("click", () => changeMonth(1));
	if (btnToday) btnToday.addEventListener("click", goToday);

	// 초기 렌더
	renderCalendar(curYear, curMonth);

})();
