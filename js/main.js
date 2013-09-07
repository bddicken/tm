/* WTF should I do when the window loads??? Here is your answer. */
window.onload = init;

/* misc constants */
STEP_TIME = 150;
HEAD_TIME = 40;

var c;
var ctx;
var animationHasStarted = false;
var tmState;

/* raphael variables */
var paper;
var tapeCells = new Array();
var tapeChars = new Array();
var tapeHead;
var inputLength = 10;

/* Keep track of the window dimention */
var winSize = [800,120];
var cellSize = [50, 50];
var headSize = [6, 50];

/* Queue of animation events*/
var animationQueue = [];

/* Ternary semaphore for animation execution 
 *
 *  1 = not animating
 *  0 = closing current animation
 * -1 = currently animating
 *
 */
var runSem = 1;

function init() {
    paper = new Raphael(document.getElementById('tmCanvas'), winSize[0], winSize[1]);
}

function animate(machine) {
 
    /* If currently animating, stop animation */
    if(runSem == -1 || runSem == 0) {
        runSem = 0;
        return;
    }

    /* grab semaphore on animatior and begin animation */
    runSem = -1;

    /* Reset machine */
    tapeCells = [];
    tapeChars = [];
    animationQueue = [];

    machine.saveStartTape();
    paper.remove();
    paper = new Raphael(document.getElementById('tmCanvas'), winSize[0], winSize[1]);
    var build = buildAnimationQueue(machine);
    console.log("hai3");

    document.getElementById('finalTape').innerHTML = machine.getFinalTape();
    console.log("hai4");
    
    if(build) {
        inputLength = machine.inputTape.length;
        drawCells(machine);
        tapeHead = paper.rect(175, 15, headSize[0], headSize[1]);
        tapeHead.attr({ color: '#000000' });
        animateTape();
    }

}

function buildAnimationQueue(machine) {
    try {
        while(true) {
            var d, c;
            var r = tm.currentState.rules[tm.inputTape[tm.currentCell]];
            if(r) { }
            else {
                tm.appendSpace();
                r = tm.currentState.rules[tm.inputTape[tm.currentCell]];
            }
            
            c = r.newSymbol;
            d = r.direction;

            animCall = "shiftTape('" + d.toUpperCase() + "', '" + c + "', " + tm.currentCell + ");"
            animationQueue.push(animCall);

            if(r.nextState == 'halt')
                break;
    
            tm.step();
        }
    } catch(err) {
        tmERRPop.flip();
        runSem = 1;
        return false;
    }
    return true;
}

function animateTape() {
  
    var command = animationQueue.shift();
    
    /* Animation queue empty, set semaphore to 0 so that the 
     * animateTape function knows to reset.
     */
    if(command == undefined) {
        runSem = 0;
    }

    /* continue animating */
    if(command != undefined && runSem == -1) {
        console.log("animating: " + command);
        eval(command);
    } 
    
    /* Stop animation */
    else if (runSem == 0) {
        tapeCells = [];
        tapeChars = [];
        animationQueue = [];
        parser = new defParser();
        tm = new TM();

        /* Animation is now cleared. Ready to start a new one. */
        runSem = 1;
    }
}
   
function shiftTape(direction, sym, index) {
    var funcVar = function(){};
   
    /* New symbol on tape */
    var tempChar = paper.text(tapeChars[index].attrs.x, tapeChars[index].attrs.y, sym);
    tapeChars[index].remove();
    tapeChars[index] = tempChar;
    tapeChars[index].attr({
        'font-size': '20px',
        color: '#FFFFFF',
        fill: '#FFFFFF'
    });
    
    if(direction == "L") {
        for(var i=0; i < inputLength;i++) {
            if(i+1 == inputLength) {
                funcVar = animateTapeHead;
            }
            tapeCells[i].animate({
                x: tapeCells[i].attrs.x+50,
                y: tapeCells[i].attrs.y
            }, STEP_TIME, '<>' );
            tapeChars[i].animate({
                x: tapeChars[i].attrs.x+50,
                y: tapeChars[i].attrs.y
            }, STEP_TIME, '<>', funcVar );
        }
    }
    else if(direction == "R") {
        for(var i=0; i < inputLength;i++) {
            if(i+1 == inputLength) {
                funcVar = animateTapeHead;
            }
            tapeCells[i].animate({
                x: tapeCells[i].attrs.x-50,
                y: tapeCells[i].attrs.y
            }, STEP_TIME, '<>');
            tapeChars[i].animate({
                x: tapeChars[i].attrs.x-50,
                y: tapeChars[i].attrs.y
            }, STEP_TIME, '<>', funcVar );
        }
    }
}

/**
 * Draw the cells of the model machine.
 */
function  drawCells(machine) {
    
    for(var i=0; i<machine.startTape.length;i++) {

        /* Create a cell */
        tapeCells[i] = paper.rect(150+i*(cellSize[0]), 50, cellSize[0], cellSize[0]);
        tapeCells[i].attr({
            stroke: '#ffaf4f',
            fill: 'grey'
        });

        /* Set the character on the cell */
        tapeChars[i] = paper.text(150+i*(cellSize[0])+25, 50+25, machine.startTape[i]);
        tapeChars[i].attr({
            'font-size': '20px',
            color: '#FFFFFF',
            fill: '#FFFFFF'
        });
    }
}

function animateTapeHead() {
    tapeHeadDown();
}

function tapeHeadUp () {
    tapeHead.animate({
        x: tapeHead.attrs.x,
        y: tapeHead.attrs.y-15
    }, HEAD_TIME, '<>', animateTape );
}

function tapeHeadDown () {
    tapeHead.animate({
        x: tapeHead.attrs.x,
        y: tapeHead.attrs.y+15
    }, HEAD_TIME, '<>', tapeHeadUp );
}

/**
 * clone an object
 */
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}
