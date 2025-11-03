document.querySelectorAll('.donut').forEach(el => {
	el.style.setProperty('--percent', +el.dataset.percent || 0);
});