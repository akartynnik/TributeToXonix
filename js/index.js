$(function () {
	$(document).keydown (function(e) {
		var key = e.which;
		//��������� ������� Enter
		if(key === 13){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "game.html";
		}
		$("#olol").text(key);
	});
});