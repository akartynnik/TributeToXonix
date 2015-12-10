/*-------------------GLOABAL FARIABLE START-----------------------*/
/*--- Temp variables---*/
var popup = null;
var previousCleared = 0;
var currentNumberFaults = 0;
var currentLevel;
var music = null;
var musicFail = new Audio("music/fault.wav");
var musicInfo = new Audio("music/info.mp3");
var musicErasure = new Audio("music/erasure-all.wav");
var currentMusicFileName;
var warderImg;
var ballImg;
var cur1Img;
var cur2Img;
var openPopupType = null;
var gameStatus = "play";
var startLevelTime = 0;
var nTimeLevel = 0;
var levelImage = new Image();

/*--- Config variables---*/
var elCanvas = $('#graphics');
var elTime = $('#status-time');
var w = 1360;
var h = 800;
var allowedFails = 3; //default = 3
var percentToWin = 80; //default = 80
var canvasPopupPositionX = Math.floor((w- 700)/ 2)
var canvasPopupPositionY = Math.floor((h- 200)/ 2);

/*--- Arrays of elemens ---*/
var levels = [
        {
			"number": "1", 
			"ballsCount": 1, 
			"wardsNumber": 0, 
			"levelName": "Level I", 
			"coeff": 100},
        {
			"number": "2", 
			"ballsCount": 1, 
			"wardsNumber": 1, 
			"levelName": "Level II", 
			"coeff": 120},
        {
			"number": "3", 
			"ballsCount": 2, 
			"wardsNumber": 1, 
			"levelName": "Level III", 
			"coeff": 160},
        {
			"number": "4", 
			"ballsCount": 2, 
			"wardsNumber": 2, 
			"levelName": "Level IV", 
			"coeff": 240},
        {
			"number": "5", 
			"ballsCount": 1, 
			"wardsNumber": 1, 
			"levelName": "BONUS LEVEL: <span class='bonus-level-exp'>exp: x2</span>", 
			"coeff": 480, "lavelMusic": "bonus-mario.mp3", 
			"warderImg": "warder-mario.png", 
			"ballImg": "ball-mario.png", 
			"cur1Img": "cursor1-mario.png", 
			"cur2Img": "cursor2-mario.png"},
        {
			"number": "6", 
			"ballsCount": 3, 
			"wardsNumber": 2, 
			"levelName": "Level VI", 
			"coeff": 320},
        {
			"number": "7", 
			"ballsCount": 4, 
			"wardsNumber": 2, 
			"levelName": "Level VII", 
			"coeff": 480},
        {
			"number": "8", 
			"ballsCount": 5, 
			"wardsNumber": 2,
			"levelName": "Level VIIL", 
			"coeff": 800},
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
        {"image": "images/pic1.jpg"},
        {"image": "images/pic2.jpg"},
        {"image": "images/pic3.jpg"},
        {"image": "images/pic4.jpg"},
        {"image": "images/pic5.jpg"},
        {"image": "images/pic6.jpg"},
        {"image": "images/pic7.jpg"},
        {"image": "images/pic8.jpg"},
        {"image": "images/pic9.jpg"},
        {"image": "images/pic10.jpg"},
        {"image": "images/pic11.jpg"},
        {"image": "images/pic12.jpg"},
        {"image": "images/pic13.jpg"}
    ];
	
var keyHash = {37: 'left', 39: 'right', 38: 'up', 40: 'down'};
/*-------------------GLOABAL FARIABLE END-----------------------*/

// Обработчик выхода приложения в background режим. Не сработало на эмуляторе. Проверить на телевизоре.
document.addEventListener ('visibilityChange', function() {
    if (document.hidden)
       PauseOn();
    else
        PauseOff();
}, true);


/*------------------- KEY PRESS PROCESSOR START -------------------------*/
$(document).keydown(function(e) {
	var key = e.which;	
	
	//Обработка нажатий стрелок (управление)
	if (key in keyHash) {
        e.preventDefault();
        picxonix('cursorDir', keyHash[key]);
	}
	
	//Если не открыт ни один попап и нажата BLUE BTN и мы еще играем - вызываем PauseOn()
	if((key === 32 || key === 406) && openPopupType === null && gameStatus === "play"){
		PauseOn();
		return false; //заканчиваем выполнение функции, если удовлетворили условию
	}
	
	//Если открыт попап "pause" и нажата BLUE BTN и мы еще играем - вызываем PauseOff() 
	if((key === 32 || key === 406) && openPopupType === "pause" && gameStatus === "play"){
		PauseOff();
		return false;
	}
	
	//Если не открыт ни один попап и нажата RED BTN и мы еще играем - вызываем GameInfoShow()
	if((key === 73 || key === 403) && openPopupType === null && gameStatus === "play"){
		GameInfoShow();
		return false;

	}
	
	//Если открыт попап "info" и нажата RED BTN и мы еще играем - вызываем GameInfoHide() 
	if((key === 73 || key === 403) && openPopupType === "info" && gameStatus === "play"){
		GameInfoHide();
		return false;
	}
	
	//Если не открыт ни один попап и нажата BACK BTN и мы еще играем - вызываем GameInfoShow()
	if ((key === 8 || key === 27) && openPopupType === null && gameStatus === "play") {
		BackPopupShow();
		return false;
	}
	
	//Если открыт попап "back" и нажата BACK BTN и мы еще играем - вызываем GameInfoHide() 
	if ((key === 8 || key === 27) && openPopupType === "back" && gameStatus === "play") {
		BackPopupHide();
		return false;
	}
	
	//Если открыт попап "back" и нажата GREEN BTN и мы еще играем - вызываем RestartGame()
	if((key === 13 || key === 404) && openPopupType === "back" && gameStatus === "play"){
		RestartGame();
		return false;
	}
	
	//Если нажата GREEN BTN и мы ждем переход на сл. уровень - вызываем NextLavelLoad()
	if((key === 13 || key === 404) && gameStatus === "next"){
		NextLavelLoad();
		return false;
	}
	
	//Если нажата GREEN BTN и мы проиграли - вызываем RestartGame()
	if((key === 13 || key === 404) && gameStatus === "lose"){
		RestartGame();
		return false;
	}
	
	//Если нажата GREEN BTN и мы выиграли - вызываем RestartGame()
	if((key === 13 || key === 404) && gameStatus === "win"){
		RestartGame();
		return false;
	}
});
/*------------------- KEY PRESS PROCESSOR START -------------------------*/



/*------------------- MOUSE CLICK PROCESSOR START -------------------------*/
elCanvas.click(function(e) {
	var pos0 = elCanvas.offset();
	var x = e.pageX, y = e.pageY,
		xc = x - pos0.left, yc = y - pos0.top;
	console.log('ON-click: pos0=(%d,%d); pos(click)=(%d,%d); pos(canvas)=(%d,%d)',pos0.left,pos0.top,x,y,xc,yc);
	picxonix('cursorDir', [xc, yc]);
});
/*------------------- MOUSE CLICK PROCESSOR END -------------------------*/


$(function () {	
	currentLevel  = localStorage.getItem("level");
	
	//small hack
	if(ParseUrl("level") !== null){
		currentLevel = ParseUrl("level");
		localStorage.setItem("level",currentLevel);
		//замена истории и ссылки, для корректной работы location.reload()
		history.replaceState("Index", "Index", "index.html");
	}
	
	if(currentLevel  === null){
		currentLevel = 1;
		localStorage.setItem("level",currentLevel);
	}
	
	//Инициализация и установка current score и high score в local-storage
	if(localStorage.getItem("cScore") === null || currentLevel==1)
		localStorage.setItem("cScore",0);
	if(localStorage.getItem("hScore") === null)
		localStorage.setItem("hScore",0);
	
	$("#allowed-fails").text(allowedFails);
	$("#percent-to-win").text(percentToWin);
	$("#pause").blink();
	$("#h_score").text(localStorage.getItem("hScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	$("#c_score").text(localStorage.getItem("cScore").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	if(currentLevel <= levels.length){
		$("#level-name").html(levels[currentLevel-1].levelName);
	}
		
	if(typeof levels[(currentLevel - 1)] === 'undefined'){
		FinishGame();
	} else {
		//Инициализация музыки
		if(typeof levels[currentLevel-1].lavelMusic !== 'undefined')
			currentMusicFileName = levels[currentLevel-1].lavelMusic;
		else
			currentMusicFileName = levelMusicsArray[Math.floor((Math.random() * levelMusicsArray.length))].music;
		music = new Audio("music/"+ currentMusicFileName);
		music.loop = true;
		music.play();
		
		//Set bonus game images
		if(typeof levels[currentLevel-1].warderImg !== 'undefined')
			warderImg = levels[currentLevel-1].warderImg;
		else
			warderImg = "warder.png";
		
		if(typeof levels[currentLevel-1].ballImg !== 'undefined')
			ballImg = levels[currentLevel-1].ballImg;
		else
			ballImg = "ball.png";
		
		if(typeof levels[currentLevel-1].cur1Img !== 'undefined')
			cur1Img = levels[currentLevel-1].cur1Img;
		else
			cur1Img = "cursor1.png";
		
		if(typeof levels[currentLevel-1].cur2Img !== 'undefined')
			cur2Img = levels[currentLevel-1].cur2Img;
		else
			cur2Img = "cursor2.png";
		
		//Game core initialization
		picxonix(elCanvas[0], {
			width: w,
			height: h,
			nBalls: levels[currentLevel-1].ballsCount,
			nWarders: levels[currentLevel-1].wardsNumber,
			speedCursor: 7,
			callback: function(iEvent) {
				switch (iEvent) {
					case 0: // animation frame
						return UpdateTime();
					case 1: // collision
						return RaiseFaults();
					case 2: // conquer
						return RaiseConquer();
					default:
				}
			},
			callbackOnFrame: true,
			warderImgSrc: "images/" + warderImg,
			ballImgSrc: "images/" + ballImg,
			cur1ImgSrc: "images/" + cur1Img,
			cur2ImgSrc: "images/" + cur2Img,
		});
		elCanvas.css({width: w, height: h});

		//Если заходим в игру впервые - выводим инфоокно
		if(sessionStorage.getItem("isFirstRunTime") === null){
			GameInfoShow();
		} 
	
		//стартуем игру
		StartLevel();
	}

});


/* ----------------------- GLOBAL FUNCTIONS -------------------------*/
//Функция инициализации и старта игры
function StartLevel() {
	var randomImageNumber = Math.floor((Math.random() * levelImagesArray.length));
	picxonix('level', levelImagesArray[randomImageNumber]);
	startLevelTime = Date.now(); 
	nTimeLevel = 0;
}

//Функция инициализации и старта игры
function FinishGame() {
	var musicWin = new Audio("music/win.mp3");
	musicWin.loop = true;
	musicWin.play();
	SetHighScore();
	ShowPopup("win");
}

//Функиция, срабатывающая после fails
function RaiseFaults() {
	$('#status-faults').html(++currentNumberFaults);
	//Stop background music and play fail music
	music.pause();
	music.currentTime = 0; 
	//Проигрываем музыку уровня дальше, если всё еще играем (с задержкой, что бы успела проиграться музыка фейла)
	if(currentNumberFaults < allowedFails) {
		setTimeout(function() { 
				music.play(); 
		}, 1500);
		return;
	}
	//показываем popup lose, если столкнулись больше, чем allowedFails раз
	SetHighScore();
	ShowPopup("lose");
	musicFail.play();
	picxonix('end', false);
}

//Функиция, срабатывающая после отрезания куска поля
function RaiseConquer() {
	var data = picxonix('state');
	if (!data) 
		return false;
	//Рассчет полученых очков за отрезанный кусок
	CalculateScore(data.cleared, levels[currentLevel-1].coeff);
	$('#status-cleared').html(Math.round(parseFloat(data.cleared)));
	if (data.cleared < percentToWin) 
		return false;
	//Если наотрезали на победу - выполняем следующий код
	gameStatus = "next"
	setTimeout(function() {
		picxonix('end', true);
	}, 200);
	music.pause();
	musicErasure.play();
	setTimeout(function() {NextLavelLoad();}, 4000);
	return true;
}

//Функция обновления таймера
function UpdateTime() {
	var n = Math.floor((Date.now() - startLevelTime) / 1000);
	if (n - nTimeLevel < 1) return;
	nTimeLevel = n;
	function str_pad(s) {
		return Array(3 - s.length).join('0') + s;
	}
	var nm = String(Math.floor(n / 60)), ns = String(n % 60);
	elTime.html(str_pad(nm)+':'+str_pad(ns));
}

function CalculateScore(cleared, coeff){
	var diff = cleared - previousCleared;
	var time =$("#status-time");
	var minutes = parseInt(time.text().split(":")[0]);
	var seconds = parseInt(time.text().split(":")[1]);
	var secondsFromStartLevel = minutes*60+seconds
	var timeCoeff = Math.round((secondsFromStartLevel/30))+1;
	
	var currentScore=Math.round(parseInt(localStorage.getItem("cScore"))+(diff*coeff)/timeCoeff);
	localStorage.setItem("cScore", currentScore);
	$("#c_score").text(currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	previousCleared = cleared;
	return;
}

function SetHighScore(){
	var currentScore = parseInt(localStorage.getItem("cScore"));
	var highScore = parseInt(localStorage.getItem("hScore"));
	if(currentScore>highScore){
		localStorage.setItem("hScore",currentScore);
		$("#h_score").text(currentScore.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
	}
}

function NextLavelLoad(){
	localStorage.setItem("level",parseInt(currentLevel) + 1);
	window.location.reload();
}

function ShowPopup(popupType){
	picxonix('play', false);
	popup = $('#popup')
		.css({left: canvasPopupPositionX+'px', top:canvasPopupPositionY+'px'})
		.appendTo(elCanvas)
		.show();
	switch (popupType) {
		case "win": 
			$("#you-lose").css("display","none");
			$("#you-win").css("display","block"); 
			$("#pause").css("display","none");
			$("#new-game").css("display","none");
			$("#info").css("display","none");
			$("#your-score").css("display","block");
			$("#you-win-btn").css("display","block");
			$("#pause-btn").css("display","none");
			$("#you-lose-btn").css("display","none");
			$("#new-game-btn").css("display","none");
			//$("#info-btn").css("display","none");
			gameStatus = "win";	
			break;
		case "lose": 
			$("#you-lose").css("display","block");
			$("#you-win").css("display","none");
			$("#pause").css("display","none");
			$("#new-game").css("display","none");
			$("#info").css("display","none");
			$("#your-score").css("display","block");
			$("#you-lose-btn").css("display","block");
			$("#you-win-btn").css("display","none");
			$("#pause-btn").css("display","none");
			$("#new-game-btn").css("display","none");
			//$("#info-btn").css("display","none");
			gameStatus = "lose";
			break;
		case "pause": 
			$("#you-lose").css("display","none");
			$("#you-win").css("display","none");
			$("#pause").css("display","block");
			$("#new-game").css("display","none");
			$("#info").css("display","none");
			$("#your-score").css("display","none");
			$("#you-lose-btn").css("display","none");
			$("#you-win-btn").css("display","none");
			$("#pause-btn").css("display","block");
			$("#new-game-btn").css("display","none");
			//$("#info-btn").css("display","none");
			break;
		case "back": 
			$("#you-lose").css("display","none");
			$("#you-win").css("display","none");
			$("#pause").css("display","none");
			$("#new-game").css("display","block");
			$("#info").css("display","none");
			$("#your-score").css("display","none");
			$("#you-lose-btn").css("display","none");
			$("#you-win-btn").css("display","none");
			$("#pause-btn").css("display","none");
			$("#new-game-btn").css("display","block");
			//$("#info-btn").css("display","none");
			break;
		case "info":
			$("#you-lose").css("display","none");
			$("#you-win").css("display","none");
			$("#pause").css("display","none");
			$("#new-game").css("display","none");
			$("#info").css("display","block");
			$("#your-score").css("display","none");
			$("#you-lose-btn").css("display","none");
			$("#you-win-btn").css("display","none");
			$("#pause-btn").css("display","none");
			$("#new-game-btn").css("display","none");
			//$("#info-btn").css("display","block");
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
	openPopupType = popupType;
}

function HidePopup(){
	popup.hide();
    openPopupType = null;
	picxonix('play', true);
}

function RestartGame(){
	localStorage.setItem("level",1);
	window.location.reload();
}

function PauseOn(){
	ShowPopup("pause");
	music.pause();
}

function PauseOff(){
	HidePopup();
	music.play();
}

function GameInfoShow(){
	$('#info').load("info.html");
	music.pause();
	musicInfo.play();
	musicInfo.loop = true;
	ShowPopup("info");
}

function GameInfoHide(){
	$('#info').html("");
	musicInfo.pause();
	musicInfo.currentTime = 0; 
	music.play();
	HidePopup();
}

function BackPopupShow(){
	ShowPopup("back");
}

function BackPopupHide(){
	HidePopup();
}


function ParseUrl(val) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
    return result;
}
    