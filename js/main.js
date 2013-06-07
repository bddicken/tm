/* WTF should I do when the window loads??? Here is your answer. */
window.onload = init;

var c;
var ctx;
var animationHasStarted = false;
var tmState;


/* Keep track of the window dimention */
var winSize = [1000,600];

function init() {
    //window.resizeTo(winSize[0],winSize[1]);
    //$("body").css("overflow", "hidden");

    c=document.getElementById("tmCanvas");
    ctx=c.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var w = $(window).width(),
        h = $(window).height();
    
    c.width = winSize[0]; c.height = winSize[1];

    ctx.font="24px Courier New";
    
    ctx.clearRect (0,0,winSize[0],winSize[1]);

    ctx.fillStyle="#BFBFBF";
    
    ctx.fillRect(0, 0, winSize[0], winSize[1]);
    
    ctx.fillStyle="#F0F000";

    ctx.fillRect(   ((screen.width/2) - window.screenX),
                    ((screen.height/2) - window.screenY),
                    32,
                    32);
    
    if(!animationHasStarted) {
        animationHasStarted = true;
        setInterval(animationLoop,20);
    }
}

var pis = function pointInSquare(x, y, en) {
    if(en.x < x && x < en.x+en.dimention) {
        if(en.y < y && y < en.y+en.dimention)
            return true;
    }
    return false;
}

function animationLoop() {
    // Main menu
    if(tmState == 0) {
    }
    // Playing the game
    else if(tmState == 1) {
    }
    // Lost the game
    else if(tmState == 2) {
    }
}

function toggleVisible(v) {
    if(v.style.display.indexOf("none") != -1) {
        v.style.display = "inline";
    }
    else {
        v.style.display = "none";
    }
}

