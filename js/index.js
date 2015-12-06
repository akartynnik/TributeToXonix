$(function () {
	$(document).keydown (function(e) {
		var key = e.which;
		//обработка нажатия Enter
		if(key === 13 || key === 404){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "game.html";
		}
		
		if(key === 38){
			e.preventDefault();
			e.stopPropagation();
			$("#up").addClass("selected");
			$("#down").removeClass("selected");
			$("#left").removeClass("selected");
			$("#right").removeClass("selected");
		}
		
		if(key === 40){
			e.preventDefault();
			e.stopPropagation();
			$("#down").addClass("selected");
			$("#up").removeClass("selected");
			$("#left").removeClass("selected");
			$("#right").removeClass("selected");
		}
		
		if(key === 37){
			e.preventDefault();
			e.stopPropagation();
			$("#left").addClass("selected");
			$("#up").removeClass("selected");
			$("#down").removeClass("selected");
			$("#right").removeClass("selected");
		}
		
		if(key === 39){
			e.preventDefault();
			e.stopPropagation();
			$("#right").addClass("selected");
			$("#up").removeClass("selected");
			$("#left").removeClass("selected");
			$("#down").removeClass("selected");
		}
	});
});