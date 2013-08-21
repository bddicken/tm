/* WTF should I do when the window loads??? Here is your answer. */
window.onload = init;

var c;
var ctx;
var animationHasStarted = false;
var tmState;

// raphael variable
var paper;
var tapeCells = new Array();
var tapeHead;
var inputLength = 10;

/* Keep track of the window dimention */
var winSize = [1000,600];
var cellSize = [50, 50];
var headSize = [6, 50];

var animationQueue = [];

function init() {

    paper = new Raphael(document.getElementById('tmCanvas'), winSize[0], winSize[1]);

    //var circle = paper.circle(100, 100, 80);

    // Draw machine head
    tapeHead = paper.rect((winSize[0]/2)-3, 65, headSize[0], headSize[1]);

    // Draw machine cells
    for(var i=0; i<inputLength;i++) {
        tapeCells[i] = paper.rect(i*(cellSize[0]), 100, cellSize[0], cellSize[0]);
        tapeCells[i].attr({
            stroke: '#ffaf4f',
            fill: 'blue'
        });
    }

    animationQueue.push("shiftTape('R');");
    animationQueue.push("shiftTape('L');");
    animationQueue.push("shiftTape('R');");
    animationQueue.push("shiftTape('R');");
    animationQueue.push("shiftTape('L');");

    animateTape();

}

function animateTape() {
    var command = animationQueue.shift();
    if(command != undefined) {
        console.log("evalling: " + command);
       eval(command);
    }
}
    
function animateNextOnQueue() {
    var command = animationQueue.shift();
    if(command != undefined) {
        console.log("evalling: " + command);
        eval(command);
    }
}
   
function shiftTape(direction) {
    var funcVar = function(){};
    if(direction == "L") {
        for(var i=0; i < inputLength;i++) {
            if(i+1 == inputLength)
                funcVar = animateNextOnQueue;
            tapeCells[i].animate({
                x: tapeCells[i].attrs.x-50,
                y: tapeCells[i].attrs.y
            }, 300, '<>', funcVar );
        }
    }
    else if(direction == "R") {
        for(var i=0; i < inputLength;i++) {
            if(i+1 == inputLength)
                funcVar = animateNextOnQueue;
            tapeCells[i].animate({
                x: tapeCells[i].attrs.x+50,
                y: tapeCells[i].attrs.y
            }, 300, '<>', funcVar );
        }
    }
} 

