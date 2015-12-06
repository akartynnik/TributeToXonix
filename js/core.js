$(function game() {
	var elCanvas = $('#graphics');
    var w = 1360;
	var h = 800;
	var HelpScore=0;
	localStorage.setItem("Score",0);
	
	var gameFinish = false;
	var gameLavels = [
        {"number": "1", "ballsCount": 1, "wardsNumber": 0, "levelName": "Level I", "coef": 1},
        {"number": "2", "ballsCount": 1, "wardsNumber": 1, "levelName": "Level II", "coef": 1.2},
        {"number": "3", "ballsCount": 2, "wardsNumber": 1, "levelName": "Level III", "coef": 1.4},
        {"number": "4", "ballsCount": 3, "wardsNumber": 1, "levelName": "Level IV", "coef": 1.6},
        {"number": "5", "ballsCount": 3, "wardsNumber": 2, "levelName": "Level V", "coef": 1.8},
    ];
	var currentLavel = ParseUrl("clevel");
	if(currentLavel === "Not found"){
		currentLavel = 1;
	}
	
	//очередной костыль, дублирование =- выкосить надо
	$(document).keydown(function(e) {
        var key = e.which;
		
		//обработка нажатия Enter
		if(key === 13 && gameFinish){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = window.location.href.split('?')[0];
		}
    });
	
	if(currentLavel > gameLavels.length){
		var newGameButtonPositionX = Math.floor((w- 310)/ 2)
		var newGameButtonPositionY = Math.floor((h- 60)/ 2);
		$($('#overlay-new-game-template').html())
			.css({left: newGameButtonPositionX+'px', top:newGameButtonPositionY+'px'})
			.appendTo(elCanvas)
			.show()
			.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				window.location.href = window.location.href.split('?')[0];
			});
			gameFinish = true;	
		return;
	}
	
	
	$("#level-name").text(gameLavels[currentLavel-1].levelName);
	
	var allowedFails = 3; //default = 3
	var percentToWin = 85; //default =  85
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
        {"image": "pic3.jpg"}
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
	
	var restartButtonPositionX = Math.floor((w- 310)/ 2)
	var restartButtonPositionY = Math.floor((h- 60)/ 2);
	var restartBtn = $($('#overlay-restart-template').html())
			.css({left: restartButtonPositionX+'px', top:restartButtonPositionY+'px'})
			.appendTo(elCanvas).hide()
			.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				window.location.href = window.location.href.split('?')[0];
			});
    preloadLevel();
	startLevel();

    var keyHash = {37: 'left', 39: 'right', 38: 'up', 40: 'down', 80: 'stop'};
    $(document).keydown(function(e) {
        var key = e.which;
        console.log('ON-keydown: key=%d',key);
		
		//обработка нажатия Enter
		if(key === 13 && gameFinish){
			e.preventDefault();
			e.stopPropagation();
			window.location.href = window.location.href.split('?')[0];
		}
		
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
		restartBtn.hide(500);
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
        console.log('raiseFaults():');
        $('#status-faults').html(++nFaults);
        if (nFaults < allowedFails) return;
		//показываем копку Restart, если столкнулись больше, чем allowedFails раз
		restartBtn.show(500);	
		gameFinish = true;		
        picxonix('end', false);
    }

	//Проверка на то, выиграли ли
    function raiseConquer() {
        var data = picxonix('state');
        console.log('raiseConquer(): data=%o',data);
        if (!data) return false;
        var val = data.cleared;
        console.log(' val=%f',val);
        HelpScore=val-HelpScore;
        $('#status-cleared').html(parseFloat(val).toPrecision(2));
        Score(HelpScore,gameLavels[currentLavel-1].coef);
        HelpScore=val;
        if (val < percentToWin) return false;
        setTimeout(function() {
            picxonix('end', true);
        }, 200);
		setTimeout(function() {NextLavelLoad(currentLavel);}, 3000);
        return true;
    }

});

function Score(val, coef){
	var count=parseInt(localStorage.getItem("Score"))+val*coef;
	localStorage.setItem("Score", count);
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
    