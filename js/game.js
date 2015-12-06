$(function () {
	var elCanvas = $('#graphics');
    var w = 1360;
	var h = 800;
	var allowedFails = 3; //default = 3
	var percentToWin = 85; //default =  85
	var canvasPopupPositionX = Math.floor((w- 700)/ 2)
	var canvasPopupPositionY = Math.floor((h- 200)/ 2);
	$("#allowed-fails").text(allowedFails);
	$("#percent-to-win").text(percentToWin);
	
	var CurrentPercent=0;
	
	var gameFinish = false;
	var gameLavels = [
        {"number": "1", "ballsCount": 1, "wardsNumber": 0, "levelName": "Level I", "coef": 1000, "music":"11.mp3"},
        {"number": "2", "ballsCount": 1, "wardsNumber": 1, "levelName": "Level II", "coef": 1200, "music":"10.mp3"},
        {"number": "3", "ballsCount": 2, "wardsNumber": 1, "levelName": "Level III", "coef": 1600, "music":"9.mp3"},
        {"number": "4", "ballsCount": 3, "wardsNumber": 1, "levelName": "Level IV", "coef": 2400, "music":"8.mp3"},
        {"number": "5", "ballsCount": 3, "wardsNumber": 2, "levelName": "Level V", "coef": 3200, "music":"7.mp3"},
    ];

	var currentLavel = ParseUrl("clevel");
	if(currentLavel === "Not found"){
		currentLavel = 1;
	}
	
	$("#music").attr("src", "music/"+ gameLavels[currentLavel-1].music);
	var music = new Audio("music/"+ gameLavels[currentLavel-1].music);
	music.loop = true;
	music.play();
	
	//Если текущий счет не установлен, либо игра началась заново - обнуляем его.
	if(localStorage.getItem("cScore") === null || currentLavel===1){
		localStorage.setItem("cScore",0);
	} 
	
	if(localStorage.getItem("hScore") === null){
		localStorage.setItem("hScore",0);
	} 
	
	$("#h_score").text(localStorage.getItem("hScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	$("#c_score").text(localStorage.getItem("cScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	
	//если игра закончена и нажат Enter или GreenButton - выходим
	$(document).keydown(function(e) {
        var key = e.which;
		if((key === 13 || key === 404) && gameFinish){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "index.html";
		}
    });
	
	//Если человек перешел на несуществующий левел, считаем что он выиграл :)
	if(currentLavel > gameLavels.length){
		displayPopup("win");
		return;
	}
	
	
	$("#level-name").text(gameLavels[currentLavel-1].levelName);
	
	
    var size = picxonix(elCanvas[0], {
        width: w,
        height: h,
        nBalls: gameLavels[currentLavel-1].ballsCount,
        nWarders: gameLavels[currentLavel-1].wardsNumber,
        speedCursor: 7,
        callback: function(iEvent) {
            switch (iEvent) {
                case 0: // animation frame
                    return updateTime();
                case 1: // collision
                    return raiseFaults();
                case 2: // conquer
                    return raiseConquer();
                default:
            }
        },
        callbackOnFrame: true
    });
    if (!size) return;

    elCanvas.css({width: w, height: h});
    console.log(' size(contr)=(%d,%d);',w,h);

    var imagesArray = [
        {"image": "pic1.png"},
        {"image": "pic2.png"},
        {"image": "pic3.jpg"},
        {"image": "pic4.png"},
        {"image": "pic5.png"},
        {"image": "pic6.png"},
        {"image": "pic7.png"},
        {"image": "pic8.png"},
        {"image": "pic9.png"},
        {"image": "pic10.png"},
        {"image": "pic11.png"},
        {"image": "pic12.png"},
        //{"image": "pic13.png"},
        //{"image": "pic14.png"},
        //{"image": "pic15.png"},
        {"image": "pic16.png"}
        //{"image": "pic17.png"},
        //{"image": "pic18.png"}
    ];
    var nLevels = imagesArray.length;
	//задаем рандомную картинку на старте
    var tLevel = 0;
    var nTimeLevel = 0;
    var nTimeTotal = 0;
    var nPoints = 0;
    var nFaults = 0;
    var bStarted = false;
	var bPlay = false;
    var oLevel;
    var elTime = $('#status-time');
	
    preloadLevel();
	startLevel();

    var keyHash = {37: 'left', 39: 'right', 38: 'up', 40: 'down', 80: 'stop'};
    $(document).keydown(function(e) {
        var key = e.which;
        if (!bPlay || !(key in keyHash)) return;
        e.preventDefault();
        picxonix('cursorDir', keyHash[key]);
    });
    elCanvas.click(function(e) {
        if (!bPlay) return;
        var pos0 = elCanvas.offset();
        var x = e.pageX, y = e.pageY,
            xc = x - pos0.left, yc = y - pos0.top;
        console.log('ON-click: pos0=(%d,%d); pos(click)=(%d,%d); pos(canvas)=(%d,%d)',pos0.left,pos0.top,x,y,xc,yc);
        picxonix('cursorDir', [xc, yc]);
    });


    function preloadLevel() {
		var randomImageNumber = Math.floor((Math.random() * imagesArray.length));
        oLevel = imagesArray[randomImageNumber];
        var img = new Image();
        img.src = oLevel.image = 'images/'+oLevel.image;
    }

    function startLevel() {
        if (!oLevel) return;
        if (!bStarted)
            $('.my-panel').removeClass('hidden');
        bStarted = bPlay = true; 
        picxonix('level', oLevel);
        tLevel = Date.now(); 
		nTimeLevel = 0;
    }

    function updateTime() {
        var n = Math.floor((Date.now() - tLevel) / 1000);
        if (n - nTimeLevel < 1) return;
        console.log('updateTime(): nTimeLevel=%d(%d)',n,nTimeLevel);
        nTimeLevel = n;
        function str_pad(s) {
            return Array(3 - s.length).join('0') + s;
        }
        n = nTimeLevel+ nTimeTotal;
        var nm = String(Math.floor(n / 60)), ns = String(n % 60);
        elTime.html(str_pad(nm)+':'+str_pad(ns));
    }

	//Проверка на то, столкнулись ли (Fail)
    function raiseFaults() {
        $('#status-faults').html(++nFaults);
        if (nFaults < allowedFails) return;
		//показываем popup, если столкнулись больше, чем allowedFails раз (проиграли)
		displayPopup("lose");	
        picxonix('end', false);
    }

	//Проверка на то, выиграли ли
    function raiseConquer() {
        var data = picxonix('state');
        console.log('raiseConquer(): data=%o',data);
        if (!data) return false;
        var val = data.cleared;
        console.log(' val=%f',val);
        CurrentPercent = val - CurrentPercent; //величина отрезанного блока в процентах
        $('#status-cleared').html(parseFloat(val).toPrecision(2));
        Score(CurrentPercent, gameLavels[currentLavel-1].coef);
        CurrentPercent = val;
        if (val < percentToWin) return false;
        setTimeout(function() {
            picxonix('end', true);
        }, 200);
		setTimeout(function() {NextLavelLoad(currentLavel);}, 3000);
        return true;
    }
	
	//Функция отображения попапа и биндинг
	function displayPopup(loseOrWin){
		$($('#overlay-popup-template').html())
			.css({left: canvasPopupPositionX+'px', top:canvasPopupPositionY+'px'})
			.appendTo(elCanvas)
			.show();
			
			switch (loseOrWin) {
                case "win": 
                    $("#you-lose").css("display","none");
					$("#you-win").css("display","block"); 
					$("#you-lose-btn").css("display","none");
					$("#you-win-btn").css("display","block");
					break;
                case "lose": 
                    $("#you-lose").css("display","block");
					$("#you-win").css("display","none");
                    $("#you-lose-btn").css("display","block");
					$("#you-win-btn").css("display","none");
					break;
                default:
            }
			var highScore = parseInt(localStorage.getItem("hScore"));
			var currentScore = parseInt(localStorage.getItem("cScore"));
			if(currentScore > highScore){
				$("#you-score").html("NEW RECORD: <span style='color: red;'>" + currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + "</span>");
			} else {
				$("#you-score").html("YOU SCORE: " + currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
			}
			gameFinish = true;	
	}

});


/* ----------------------- GLOBAL FUNCTIONS -------------------------*/

function Score(val, coef){
	var time =$("#status-time");
	var minutes = parseInt(time.text().split(":")[0]);
	var seconds = parseInt(time.text().split(":")[1]);
	var secondsFromStartLevel = (minutes*60)+seconds;
	
	var currentScore=Math.round(parseInt(localStorage.getItem("cScore"))+(val*coef)/secondsFromStartLevel);
	localStorage.setItem("cScore", currentScore);
	$("#c_score").text(currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	
	var highScore = parseInt(localStorage.getItem("hScore"));
	if(currentScore>highScore){
		localStorage.setItem("hScore",currentScore);
		$("#h_score").text(currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	}
	return;
}

function ParseUrl(val) {
    var result = "Not found",
        tmp = [];
    location.search
    //.replace ( "?", "" ) 
    // this is better, there might be a question mark inside
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

function NextLavelLoad(cLevel){
	var url = window.location.href;
	console.log("ololo" + window.location.href);
	var nLevel = parseInt(cLevel)+1;
	if (url.indexOf('?') > -1){
		url =window.location.href.split('?')[0];
	}
	url += '?clevel='+nLevel;
	window.location.href = url;
}

function RestartStartGame(){
	window.location.href = "index.html";
}
    