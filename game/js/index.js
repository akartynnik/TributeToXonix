$(function () {
	$(document).keydown (function(e) {
		var key = e.which;
		//��������� ������� Enter
		if(key === 13 || key === 404){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "game.html";
		}
		
		if(key === 38){
			e.preventDefault();
			e.stopPropagation();
			$("#up").addClass("selected");
		}
		
		if(key === 40){
			e.preventDefault();
			e.stopPropagation();
			$("#down").addClass("selected");
		}
		
		if(key === 37){
			e.preventDefault();
			e.stopPropagation();
			$("#left").addClass("selected");
		}
		
		if(key === 39){
			e.preventDefault();
			e.stopPropagation();
			$("#right").addClass("selected");
		}
		
		if(key === 32 || key === 406){
			e.preventDefault();
			e.stopPropagation();
			$("#btn-blue").addClass("underlined-blue");
		}
		
		if(key === 29 || key === 403){
			e.preventDefault();
			e.stopPropagation();
			$("#btn-red").addClass("underlined-red");
		}
		
		if ((key === 8 || key === 27) && !$(e.target).is("input, textarea")) {
			e.preventDefault();
			e.stopPropagation();
			$("#btn-back").addClass("underlined-back");
		}
		
		$("#debug-info").text("key pressed: " + key );
	});
	
	$(document).keyup (function(e) {
		var key = e.which;
		
		if(key === 38){
			e.preventDefault();
			e.stopPropagation();
			$("#up").removeClass("selected");
		}
		
		if(key === 40){
			e.preventDefault();
			e.stopPropagation();
			$("#down").removeClass("selected");
		}
		
		if(key === 37){
			e.preventDefault();
			e.stopPropagation();
			$("#left").removeClass("selected");
		}
		
		if(key === 39){
			e.preventDefault();
			e.stopPropagation();
			$("#right").removeClass("selected");
		}
		
		if(key === 32 || key === 406){
			e.preventDefault();
			e.stopPropagation();
			$("#btn-blue").removeClass("underlined-blue");
		}
		
		if(key === 403){
			e.preventDefault();
			e.stopPropagation();
			$("#btn-red").removeClass("underlined-red");
		}
		
		if ((key === 8 || key === 27)  && !$(e.target).is("input, textarea")) {
			e.preventDefault();
			e.stopPropagation();
			$("#btn-back").removeClass("underlined-back");
		}
		
		
		$("#debug-info").text("");
	});
});