/* ---------- 상태 ---------- */
var questions = [];                         // 서버에서 채움
var currentIndex = 0;
var total = 0;
var answers = [];                           // 각 문항의 선택값(1~4) 저장
var score = 0;
var ids = [];

/* ---------- DOM ---------- */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

var videoEl, subtitleEl, formEl, radios, labels, btnPrev, btnNext;

document.addEventListener('DOMContentLoaded', function() {
	videoEl = $('#question_video');
	subtitleEl = $('#question-subtitle');
	formEl = $('.answer-form');
	radios = $all('input[name="answer"]');
	labels = [$('#ans1 + label'), $('#ans2 + label'), $('#ans3 + label'), $('#ans4 + label')];
	btnPrev = $('#btnPrev');
	btnNext = $('#btnNext');

	// 필수 요소 체크
	if (!videoEl || !subtitleEl || !formEl || radios.length !== 4 || labels.some(function(l) { return !l; }) || !btnPrev || !btnNext) {
		console.error('필수 DOM 요소를 찾지 못했습니다.');
		return;
	}

	// 폼 submit 막기(엔터 방지)
	formEl.addEventListener('submit', function(e) { e.preventDefault(); });

	// 라디오 변경 → 다음/제출 버튼 활성화 갱신
	for (var i = 0; i < radios.length; i++) {
		radios[i].addEventListener('change', updateNavButtons);
	}

	// 네비게이션
	btnPrev.addEventListener('click', function() {
		if (currentIndex === 0) return;
		persistSelection();
		currentIndex--;
		render();
	});

	btnNext.addEventListener('click', function() {
		if (isLast()) {
			persistSelection();
			submitResult();
		} else {
			persistSelection();
			currentIndex++;
			render();
		}
	});

	// 데이터 로드 → 로드가 끝난 뒤 첫 render
	getQuestionList();
});

/* ---------- 유틸 ---------- */
function isLast() { return currentIndex === total - 1; }

function getLabelText(input) {
	let label = input.nextElementSibling;
	if (!label || label.tagName !== 'LABEL') {
		label = document.querySelector('label[for="' + input.id + '"]');
	}
	return label ? label.textContent.trim() : '';
}

function persistSelection() {
	const checked = document.querySelector('input[name="answer"]:checked');
	answers[currentIndex] = checked ? getLabelText(checked) : null; // ← 텍스트 저장
}

function restoreSelection() {
	const val = answers[currentIndex]; // 저장된 텍스트
	for (let i = 0; i < radios.length; i++) {
		const txt = getLabelText(radios[i]);
		radios[i].checked = (val != null && txt === val); // ← 텍스트로 비교
	}
	updateNavButtons();
}

function render() {
	// 방어
	if (!questions.length) return;

	var q = questions[currentIndex];

	// 제목
	subtitleEl.textContent = '문제 영상 ' + (currentIndex + 1) + ' / ' + total;

	// 비디오
	if (q && q.videoUrl) {
		videoEl.src = q.videoUrl;
		videoEl.load();
		var p = videoEl.play();
		if (p && typeof p.then === 'function') { p.catch(function() { }); }
	}

	// 보기 텍스트 채우기
	for (var i = 0; i < 4; i++) {
		if (q.options && q.options[i]) {
			labels[i].textContent = q.options[i];
			labels[i].style.display = '';
			if (labels[i].previousElementSibling) { // 해당 라디오
				labels[i].previousElementSibling.style.display = '';
				labels[i].previousElementSibling.value = String(i + 1);
			}
		} else {
			labels[i].textContent = '';
			labels[i].style.display = 'none';
			if (labels[i].previousElementSibling) {
				labels[i].previousElementSibling.style.display = 'none';
			}
		}
	}

	// 선택 복원/버튼 상태
	restoreSelection();
	updateNavButtons();
}

function updateNavButtons() {
	if (btnPrev) btnPrev.disabled = (currentIndex === 0);
	if (btnNext) btnNext.textContent = isLast() ? '제출하기' : '다음';
	var checked = $('input[name="answer"]:checked');
	if (btnNext) btnNext.disabled = !checked;
}

function submitResult() {

	// 채점(텍스트 비교)
	score = 0;
	var details = [];

	for (var i = 0; i < total; i++) {
		var userText = answers[i] || '';
		var correctText = questions[i].meaning; // 서버에서 내려준 meaning 포함돼야 함
		var ok = (userText.trim() === correctText.trim()); // 정책에 맞게 equalsIgnoreCase 등 적용
		if (ok) score++;

		details.push({
			slId: questions[i].id,
			answerText: userText,
			correctText: correctText,
			correct: ok
		});
	}

	fetch(APP_CTX + '/SubmitTest.do', {
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: new URLSearchParams({ ids: ids, answers: answers }),
		credentials: 'same-origin'
	})
		.then(function(res) { return res.json(); })
		.then(function(data) {
			if (data && data.ok) {
				alert('제출 완료! 점수: ' + score + ' / ' + total);
				location.replace(data.redirect);
			} else {
				alert(data.message);
			}
		})
		.catch(function(err) {
			console.error(err);
			alert('네트워크 오류가 발생했습니다.');
		});

}

function joinUrl(base, path) {
	if (!base) base = '';
	if (!path) path = '';
	if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1);
	if (!base.endsWith('/') && !path.startsWith('/')) return base + '/' + path;
	return base + path;
}

function getQuestionList() {
	var body = new URLSearchParams(); // 필요 파라미터 있으면 append

	fetch(APP_CTX + '/GetQuestionList.do', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
		body: body,
		credentials: 'same-origin'
	})
		.then(function(res) { return res.json(); })
		.then(function(data) {
			if (!data || !data.ok) { alert('불러오기 실패'); return; }

			questions = (data.questionList || []).map(function(q) {
				return {
					id: q.slId,
					videoUrl: joinUrl(window.APP_CTX || '', '/assets/video/' + q.videoPath),
					options: q.answers,
					correctAnswer: q.answers ? (q.answers.indexOf(q.meaning) + 1) : null,
					meaning: q.meaning
				};
			});

			ids = (data.questionList || []).map(function(q) { return q.slId; });
			total = questions.length;
			answers = Array(total).fill(null);
			currentIndex = 0;
			render();

		})
		.catch(function(err) {
			console.error(err);
			alert('네트워크 오류가 발생했습니다.');
		});

}

