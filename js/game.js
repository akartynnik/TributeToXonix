/*-------------------GLOABAL FARIABLE START-----------------------*/
/*--- Temp variables---*/
var flag = true;
var popup = null;
var gameIsFinish = false;
var currentPercent=0;
var currentLevel = ParseUrl("clevel");

/*--- Config variables---*/
var elCanvas = $('#graphics');
var w = 1360;
var h = 800;
var allowedFails = 3; //default = 3
var percentToWin = 85; //default =  85
var canvasPopupPositionX = Math.floor((w- 700)/ 2)
var canvasPopupPositionY = Math.floor((h- 200)/ 2);

/*--- Arrays of elemens ---*/
var levels = [
        {"number": "1", "ballsCount": 1, "wardsNumber": 0, "levelName": "Level I", "coeff": 100},
        {"number": "2", "ballsCount": 1, "wardsNumber": 1, "levelName": "Level II", "coeff": 120},
        {"number": "3", "ballsCount": 2, "wardsNumber": 1, "levelName": "Level III", "coeff": 160},
        {"number": "4", "ballsCount": 2, "wardsNumber": 2, "levelName": "Level IV", "coeff": 240},
        {"number": "5", "ballsCount": 3, "wardsNumber": 2, "levelName": "Level V", "coeff": 320},
    ];
	
var levelMusicsArray = [
        {"music": "2.mp3"},
        {"music": "3.mp3"},
        {"music": "4.mp3"},
        {"music": "5.mp3"},
        {"music": "6.mp3"},
        {"music": "7.mp3"},
        {"music": "8.mp3"},
        {"music": "9.mp3"},
        {"music": "10.mp3"},
        {"music": "11.mp3"},
        {"music": "12.mp3"}
    ];	
	
var levelImagesArray = [
        {"image": "pic1.jpg"},
        {"image": "pic2.jpg"},
        {"image": "pic3.jpg"},
        {"image": "pic4.jpg"},
        {"image": "pic5.jpg"},
        {"image": "pic6.jpg"},
        {"image": "pic7.jpg"},
        {"image": "pic8.jpg"},
        {"image": "pic9.jpg"},
        {"image": "pic10.jpg"},
        {"image": "pic11.jpg"},
        {"image": "pic12.jpg"},
        {"image": "pic13.jpg"}
    ];
/*-------------------GLOABAL FARIABLE END-----------------------*/


/*------------------- KEY PRESS PROCESSOR START -------------------------*/
$(document).keydown(function(e) {
	var key = e.which;
	//Enter или Red Button и игра закончена  - выходим
	if((key === 13 || key === 404) && gameIsFinish){
		e.preventDefault();
		e.stopPropagation();
		window.location.href = "index.html";
	}
	
	//Enter или Blue Button - обработка паузы
	if((key === 32 || key === 404) && !gameIsFinish){
		e.preventDefault();
		e.stopPropagation();
		if(flag){
			flag = false;
			picxonix('play', flag);
			DisplayPopup("pause");
		} else {
			flag = true;
			picxonix('play', flag);
			HidePopup();
		}
	}
});
/*------------------- KEY PRESS PROCESSOR START -------------------------*/


$(function () {
	if(currentLevel === "Not found"){
		currentLevel = 1;
	}
	
	//Set current score and hight score to local storage
	if(localStorage.getItem("cScore") === null || currentLevel===1)
		localStorage.setItem("cScore",0);
	if(localStorage.getItem("hScore") === null)
		localStorage.setItem("hScore",0);
	
	$("#allowed-fails").text(allowedFails);
	$("#percent-to-win").text(percentToWin);
	$("#pause").blink();
	$("#h_score").text(localStorage.getItem("hScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	$("#c_score").text(localStorage.getItem("cScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	if(currentLevel <= levels.length){
		$("#level-name").text(levels[currentLevel-1].levelName);
	}
	
	//Если человек перешел на несуществующий левел, считаем что он выиграл :)
	if(currentLevel > levels.length){
		DisplayPopup("win");
		return;
	}
	
	//Запуск фоновой музыки
	var music = new Audio("music/"+ levelMusicsArray[Math.floor((Math.random() * levelMusicsArray.length))].music);
	music.loop = true;
	music.play();
	
	//Game core initialization
    var size = picxonix(elCanvas[0], {
        width: w,
        height: h,
        nBalls: levels[currentLevel-1].ballsCount,
        nWarders: levels[currentLevel-1].wardsNumber,
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
    var nLevels = levelImagesArray.length;
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
		var randomImageNumber = Math.floor((Math.random() * levelImagesArray.length));
        oLevel = levelImagesArray[randomImageNumber];
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
		DisplayPopup("lose");	
        picxonix('end', false);
    }

	//Проверка на то, выиграли ли
    function raiseConquer() {
        var data = picxonix('state');
        console.log('raiseConquer(): data=%o',data);
        if (!data) return false;
        var val = data.cleared;
        console.log(' val=%f',val);
        currentPercent = val - currentPercent; //величина отрезанного блока в процентах
        $('#status-cleared').html(parseFloat(val).toPrecision(2));
        Score(currentPercent, levels[currentLevel-1].coeff);
        currentPercent = val;
        if (val < percentToWin) return false;
        setTimeout(function() {
            picxonix('end', true);
        }, 200);
		setTimeout(function() {NextLavelLoad(currentLevel);}, 3000);
        return true;
    }
});


/* ----------------------- GLOBAL FUNCTIONS -------------------------*/

function Score(val, coeff){
	var time =$("#status-time");
	var minutes = parseInt(time.text().split(":")[0]);
	var seconds = parseInt(time.text().split(":")[1]);
	var secondsFromStartLevel = minutes*60+seconds
	var timeCoeff = Math.round((secondsFromStartLevel/30))+1;
	
	var currentScore=Math.round(parseInt(localStorage.getItem("cScore"))+(val*coeff)/timeCoeff);
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

function RestartGame(){
	window.location.href = "index.html";
}

function PauseGame(){
	flag = false;
	picxonix('play', flag);
	DisplayPopup("pause");
}

function StartGame(){
	flag = true;
	picxonix('play', flag);
	HidePopup();
}

function HidePopup(){
	popup.hide();
}

function DisplayPopup(loseOrWin){
	popup = $('#popup')
		.css({left: canvasPopupPositionX+'px', top:canvasPopupPositionY+'px'})
		.appendTo(elCanvas)
		.show();
	switch (loseOrWin) {
		case "win": 
			$("#you-lose").css("display","none");
			$("#you-win").css("display","block"); 
			$("#pause").css("display","none");
			$("#your-score").css("display","block");
			$("#you-win-btn").css("display","block");
			$("#pause-btn").css("display","none");
			$("#you-lose-btn").css("display","none");
			gameIsFinish = true;	
			break;
		case "lose": 
			$("#you-lose").css("display","block");
			$("#you-win").css("display","none");
			$("#pause").css("display","none");
			$("#your-score").css("display","block");
			$("#you-lose-btn").css("display","block");
			$("#pause-btn").css("display","none");
			$("#you-win-btn").css("display","none");
			gameIsFinish = true;	
			break;
		case "pause": 
			$("#pause").css("display","block");
			$("#you-lose").css("display","none");
			$("#you-win").css("display","none");
			$("#your-score").css("display","none");
			$("#pause-btn").css("display","block");
			$("#you-lose-btn").css("display","none");
			$("#you-win-btn").css("display","none");
			break;
		default:
	}
	var highScore = parseInt(localStorage.getItem("hScore"));
	var currentScore = parseInt(localStorage.getItem("cScore"));
	if(currentScore === highScore){
		$("#your-score").html("NEW RECORD: <span style='color: red;'>" + currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + "</span>");
	} else {
		$("#your-score").html("YOUR SCORE: " + currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	}
}
    