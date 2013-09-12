/* misc constants */
var STEP_TIME = 150;
var HEAD_TIME = 40;
var WIN_SIZE = [800,120];
var CELL_SIZE = [50, 50];
var HEAD_SIZE = [6, 50];

/* canvas elements */
var c;
var ctx;
var animationHasStarted = false;
var tmState;

var tmAnim;

function TMAnimator(m) {

    this.machine = m;
    this.animationQueue = [];

    /* raphael variables */
    this.paper = new Raphael(document.getElementById('tmCanvas'), WIN_SIZE[0], WIN_SIZE[1]);
    this.tapeCells = new Array();
    this.tapeChars = new Array();
    this.tapeHead;
    this.inputLength = 10;

    /* Ternary semaphore for animation execution 
     *
     *  1 = not animating
     *  0 = closing current animation
     * -1 = currently animating
     *
     */
    this.runSem = 1;

    this.animate = function () {
            
        /* If currently animating, stop animation */
        if(this.runSem == -1 || this.runSem == 0) {
            this.runSem = 0;
            return;
        }

        /* grab semaphore on animatior and begin animation */
        this.runSem = -1;

        /* Reset machine */
        tapeCells = [];
        tapeChars = [];
        animationQueue = [];

        this.machine.saveStartTape();
        this.paper.remove();
        this.paper = new Raphael(document.getElementById('tmCanvas'), WIN_SIZE[0], WIN_SIZE[1]);
        var build = this.buildAnimationQueue(this.machine);

        document.getElementById('finalTape').innerHTML = this.machine.getFinalTape();
    
        if(build) {
            this.inputLength = this.machine.inputTape.length;
            this.drawCells(this.machine);
            this.tapeHead = this.paper.rect(175, 15, HEAD_SIZE[0], HEAD_SIZE[1]);
            this.tapeHead.attr({ color: '#000000' });
            this.animateTape();
        }
    }

    this.buildAnimationQueue = function() {
        //try {
            while(true) {
                var d, c;
                var r = this.machine.currentState.rules[this.machine.inputTape[this.machine.currentCell]];
                if(r) { }
                else {
                    this.machine.appendSpace();
                    r = this.machine.currentState.rules[this.machine.inputTape[this.machine.currentCell]];
                }
                
                c = r.newSymbol;
                d = r.direction;

                var animCall = new AnimationStep(d.toUpperCase(), c, this.machine.currentCell);
                this.animationQueue.push(animCall);

                if(r.nextState == 'halt')
                    break;
    
                this.machine.step();
            }
        //} catch(err) {
        //    tmERRPop.flip();
        //    this.runSem = 1;
        //    return false;
       // }
        return true;
    }

    this.animateTape = function() {
  
        var command = this.animationQueue.shift();
    
        /* Animation queue empty, set semaphore to 0 so that the 
         * animateTape function knows to reset.
         */
        if(command == undefined) {
            this.runSem = 0;
        }

        /* continue animating */
        if(command != undefined && this.runSem == -1) {
            //console.log("animating: " + command);
            this.shiftTape(command.direction, command.symbol, command.index);
        } 
    
        /* Stop animation */
        else if (this.runSem == 0) {
            this.tapeCells = [];
            this.tapeChars = [];
            this.animationQueue = [];
            this.parser = new defParser();
            this.tm = new TM();
    
            /* Animation is now cleared. Ready to start a new one. */
            this.runSem = 1;
        }
    }

    this.clear = function() {
        this.paper.remove();
    }
   
    this.shiftTape = function (direction, sym, index) {
        var funcVar = function(){};
   
        /* New symbol on tape */
        var tempChar = this.paper.text(this.tapeChars[index].attrs.x, this.tapeChars[index].attrs.y, sym);
        this.tapeChars[index].remove();
        this.tapeChars[index] = tempChar;
        this.tapeChars[index].attr({
            'font-size': '20px',
            color: '#FFFFFF',
            fill: '#FFFFFF'
        });
    
        if(direction == "L") {
            for(var i=0; i < this.inputLength;i++) {
                if(i+1 == this.inputLength) {
                    funcVar = this.animateTapeHead.bind(this);
                }
                this.tapeCells[i].animate({
                    x: this.tapeCells[i].attrs.x+50,
                    y: this.tapeCells[i].attrs.y
                }, STEP_TIME, '<>' );
                this.tapeChars[i].animate({
                    x: this.tapeChars[i].attrs.x+50,
                    y: this.tapeChars[i].attrs.y
                }, STEP_TIME, '<>', funcVar );
            }
        }
        else if(direction == "R") {
            for(var i=0; i < this.inputLength;i++) {
                if(i+1 == this.inputLength) {
                    funcVar = this.animateTapeHead.bind(this);
                }
                this.tapeCells[i].animate({
                    x: this.tapeCells[i].attrs.x-50,
                    y: this.tapeCells[i].attrs.y
                }, STEP_TIME, '<>');
                this.tapeChars[i].animate({
                    x: this.tapeChars[i].attrs.x-50,
                    y: this.tapeChars[i].attrs.y
                }, STEP_TIME, '<>', funcVar );
            }
        }
    }

    /**
     * Draw the cells of the model machine.
     */
    this.drawCells = function() {
    
        for(var i=0; i < this.machine.startTape.length; i++) {

            /* Create a cell */
            this.tapeCells[i] = this.paper.rect(150+i*(CELL_SIZE[0]), 50, CELL_SIZE[0], CELL_SIZE[0]);
            this.tapeCells[i].attr({
                stroke: '#ffaf4f',
                fill: 'grey'
            });

            /* Set the character on the cell */
            this.tapeChars[i] = this.paper.text(150+i*(CELL_SIZE[0])+25, 50+25, this.machine.startTape[i]);
            this.tapeChars[i].attr({
                'font-size': '20px',
                color: '#FFFFFF',
                fill: '#FFFFFF'
            });
        }
    }

    this.tapeHeadUp = function() {
        this.tapeHead.animate({
            x: this.tapeHead.attrs.x,
            y: this.tapeHead.attrs.y-15
        }, HEAD_TIME, '<>', this.animateTape.bind(this) );
    }

    this.tapeHeadDown = function() {
        this.tapeHead.animate({
            x: this.tapeHead.attrs.x,
            y: this.tapeHead.attrs.y+15
        }, HEAD_TIME, '<>', this.tapeHeadUp.bind(this) );
    }

    this.animateTapeHead = function() {
        console.log(this.inputLength);
        //var funcV = this.tapeHeadDown;
        //funcV();
        this.tapeHeadDown();
    }

} /* End TMAnimator */


/** 
 * 1 Step of animation.
 */
function AnimationStep(d, s, i) {
    this.direction = d;
    this.symbol = s;
    this.index = i;
}
