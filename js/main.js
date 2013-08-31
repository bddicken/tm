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

var animationQueue = [];

function init() {
    paper = new Raphael(document.getElementById('tmCanvas'), winSize[0], winSize[1]);
}

function animate(machine) {
   
    paper.remove();
    
    paper = new Raphael(document.getElementById('tmCanvas'), winSize[0], winSize[1]);
    
    machine.saveStartTape();
    buildAnimationQueue(machine);
    inputLength = machine.inputTape.length;
    drawCells(machine);
    tapeHead = paper.rect(175, 15, headSize[0], headSize[1]);
    tapeHead.attr({ color: '#000000' });
    animateTape();

}

function buildAnimationQueue(machine) {
    while(true) {
        
        /* begin debug */
        console.log("---");
        console.log("main current cell:" + machine.currentCell);
        console.log("current tape symbol:" + machine.inputTape[machine.currentCell]);
        console.log("current state:" + machine.currentState.stateSymbol);
        var r = machine.currentState.rules.length;
        console.log("number of rules: " + r );
        console.log("---");
        /* end debug */
        
        var d, c;
        var r = machine.currentState.rules[machine.inputTape[machine.currentCell]];
        if(r) { }
        else {
            machine.appendSpace();
            r = machine.currentState.rules[machine.inputTape[machine.currentCell]];
            console.log("-new-");
        }
        c = r.newSymbol;
        d = r.direction;

        animCall = "shiftTape('" + d.toUpperCase() + "', '" + c + "', " + machine.currentCell + ");"
        animationQueue.push(animCall);

        if(r.nextState == 'halt')
            break;

        machine.step();
    }
}

function animateTape() {
    animateNextOnQueue();
}
    
function animateNextOnQueue() {
    var command = animationQueue.shift();
    if(command != undefined) {
        console.log("evalling: " + command);
        eval(command);
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
    
    /* Head animation */

    if(direction == "L") {
        for(var i=0; i < inputLength;i++) {
            if(i+1 == inputLength)
                funcVar = animateTapeHead;
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
            if(i+1 == inputLength)
                funcVar = animateTapeHead;
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
    }, HEAD_TIME, '<>', animateNextOnQueue );
}

function tapeHeadDown () {
    tapeHead.animate({
        x: tapeHead.attrs.x,
        y: tapeHead.attrs.y+15
    }, HEAD_TIME, '<>', tapeHeadUp );
}
