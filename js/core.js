$(function() {
    var elCanvas = $('#graphics');
    var size = picxonix(elCanvas[0], {
        width: 600,
        height: 500,
        nBalls: 2,
        nWarders: 1,
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

    var w = size.width, h = size.height;
    elCanvas.css({width: w, height: h});
    console.log(' size(contr)=(%d,%d); pos(playbtn)=(%d,%d)',w,h,x0,y0);

    var aAnswers = [
        "Argentina", "Australia", "Austria", "Brazil", "Cuba", "Greece", "India", "Japan"
    ];
    var aLevels = [
        {"image": "pic1.png", "answer": 0, "optionsout": []},
        {"image": "pic2.png", "answer": 1, "optionsout": []},
        {"image": "pic3.png", "answer": 5, "optionsout": []}
    ];
    var nAnswers = aAnswers.length;
    var nLevels = aLevels.length;
    var iLevel = 0;
    var tLevel = 0;
    var nTimeLevel = 0;
    var nTimeTotal = 0;
    var nPoints = 0;
    var nFaults = 0;
    var bStarted = false, bPlay = false, bConquer = false;
    $('#status-progress-total').html(nLevels);
    var oLevel;
    var x0 = Math.floor((w- 220)/ 2), y0 = Math.floor((h- 40)/ 2);
    var elBtnPlay = $($('#overlay-play-template').html())
        .css({left: x0+'px', top: y0+'px'})
        .appendTo(elCanvas).hide()
        .click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            startLevel();
        });
    console.log(' pos(playbtn)=(%d,%d)',x0,y0);
    var elTime = $('#status-time');
    var tplOptions = _.template($('#answeropts-template').html());
    preloadLevel();

    var keyHash = {37: 'left', 39: 'right', 38: 'up', 40: 'down', 32: 'stop'};
    $(document).keydown(function(e) {
        var key = e.which;
        console.log('ON-keydown: key=%d',key);
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
        oLevel = aLevels[iLevel++];
        var img = new Image();
        img.onload = function() {
            elBtnPlay.show();
        };
        img.src = oLevel.image = 'images/'+oLevel.image;
        var aOpts = [], k0 = oLevel.answer;
        for (var i = 0; i < 3; i++) {
            for (var j = 100; j > 0; j--) {
                var k = Math.floor(Math.random() * nAnswers);
                if (!(k != k0 && aOpts.indexOf(k) < 0)) continue;
                aOpts.push(k); break;
            }
            if (!j) return;
        }
        aOpts.splice(Math.floor(Math.random() * 4), 0, k0);
        console.log('preloadLevel(): iLevel=%d; k0=%d; aOpts=[%s]',iLevel,k0,aOpts);
        oLevel.optionsout = aOpts.map(function(k) { return [k, aAnswers[k]]; });
    }

    function startLevel() {
        if (!oLevel) return;
        elBtnPlay.hide();
        console.log('startLevel(): iLevel=%d; nAnswers=%d',iLevel,nAnswers);
        if (!bStarted)
            $('.my-panel').removeClass('hidden');
        bStarted = bPlay = true; bConquer = false;
        $('#status-progress-current').html(iLevel);
        picxonix('level', oLevel);
        tLevel = Date.now(); nTimeLevel = 0;
        $('#answeropts').empty().html(tplOptions(oLevel))
        .children().click(onClickAnswer);
        enableOptions(false);
    }

    function onClickAnswer() {
        $(this).blur();
        enableOptions(false);
        var id = $(this).data('optionid');
        var bOk = id == oLevel.answer;
        console.log('onClickAnswer(): id=%d; answer=%d; bOk=%d',id,oLevel.answer,bOk);
        picxonix('play', false);
        picxonix('end', true);
        updateTime();
        nTimeTotal += nTimeLevel;
        if (bOk) {
            nPoints++;
            console.log(' nPoints=%d',nPoints);
            $('#status-points').html(nPoints);
        }
        $(this).children('span').eq(bOk? 0 : 1).removeClass('hidden');
        if (iLevel < nLevels)
            preloadLevel();
        else {
            var score = 1000* nPoints/ nTimeLevel;
            outResult(0);
            $('#status-score > span').html(score.toFixed(0)).parent().removeClass('hidden');
        }
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

    function raiseFaults() {
        console.log('raiseFaults():');
        $('#status-faults').html(++nFaults);
        if (nFaults < 3) return;
        picxonix('end', false);
        enableOptions(false);
        outResult(1);
    }

    function raiseConquer() {
        var data = picxonix('state');
        console.log('raiseConquer(): data=%o',data);
        if (!data) return false;
        if (!bConquer) enableOptions(true);
        bConquer = true;
        var val = data.cleared;
        console.log(' val=%f',val);
        if (val < 75) return false;
        setTimeout(function() {
            picxonix('end', true);
        }, 1000);
        return true;
    }

    function enableOptions(bOn) {
        $('#answeropts > button').prop('disabled', !bOn);
    }

    function outResult(i) {
        $('#status-status').removeClass('hidden')
        .children('span').eq(i%2).removeClass('hidden');
    }
});
    