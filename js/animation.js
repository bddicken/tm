/* misc constants */
var STEP_TIME = 150;
var HEAD_TIME = 40;
var WIN_SIZE = [800,120];
var CELL_SIZE = [50, 50];
var HEAD_SIZE = [6, 50];
var MAX_RENDER_CELLS = 20;
var MIN_RENDER_CELLS_RIGHT = 13;
var MIN_RENDER_CELLS_LEFT = 6;

/* canvas elements */
var c;
var ctx;
var animationHasStarted = false;
var tmState;
var timeout;

var tmAnim;

function TMAnimator(m) {

    this.lastPos = 0;
    this.realCellIndex = 0;

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

    this.stopAnimation  = function () {
        this.runSem = 0;
    }

    this.animate = function () {

        /* Set timeout for pre-simulation */
        timeout = setTimeout(this.stopAnimation.bind(this), 100); 
            
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

        this.machine.save();
        this.machine.reset();
        this.machine.save();
        this.paper.remove();
        this.paper = new Raphael(document.getElementById('tmCanvas'), WIN_SIZE[0], WIN_SIZE[1]);

        var build = this.runMachine(this.machine);
        
        document.getElementById('finalTape').innerHTML = this.machine.getFinalTape();
        this.inputLength = this.machine.finalTape.length;
      
        /* Turn off timeout if we made it this far */
        window.clearTimeout(timeout);
        this.runSem = -1;

        if(build) {
            this.machine.reset();
            this.drawCells(this.machine);
            this.tapeHead = this.paper.rect(222, 15, HEAD_SIZE[0], HEAD_SIZE[1]);
            this.tapeHead.attr({ color: '#000000' });
            console.log(">>>>> begin animation <<<<<");
            this.runAnimation();
        }
    }
   
    this.maxIters = 200.0;
    
    this.runMachine = function() {
        //try {
            while(true) {
                console.log("machine iteration tape:");
                console.log("    " + this.machine.finalTape + "\n");

                if (this.maxIters <= 0) {
                    this.maxIters = 200.0;
                    alert("too many iters");
                    return false;
                }

                this.maxIters--;

                var r = this.machine.getCurrentRules();
                if(r) { }
                else {
                    this.machine.appendSpace();
                    r = this.machine.getCurrentRules();
                }

                if(r.nextState == 'halt')
                    break;
    
                this.machine.step();
            }
        //} catch(err) {
        //    tmERRPop.flip();
        //    this.runSem = 1;
        //    return false;
        //}
        return true;
    }

    this.runAnimation = function() {
        console.log("    " + this.machine.finalTape + "\n");
                
        var d, c;
        var r = this.machine.getCurrentRules();
        if(!r) {
            this.machine.appendSpace();
            r = this.machine.getCurrentRules();
        }
                
        c = r.newSymbol;
        d = r.direction;

        var animCall = new AnimationStep(d.toUpperCase(), c, this.machine.currentCell);
        this.animationQueue.push(animCall);

        if(r.nextState == 'halt') {
            this.runSem = 1;
            return;
        }
                
        this.lastPos = this.machine.currentCell;
        this.machine.step();
                
        /* one animation step at a time */
        this.animateTape();
    }

    this.animateTape = function() {

        /* continue animating */
        if(this.runSem == -1) {
            this.animateTapeHead();
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
   
    this.shiftTape = function () {
        
        var command = this.animationQueue.shift();
        var sym = command.symbol;
        var direction = command.direction;
        
        /* Animation queue empty, set semaphore to 0 so that the 
         * animateTape function knows to reset.
         */
        if(command == undefined) {
            this.runSem = 0;
        }
        
        var funcVar = function(){};
        
        var shiftRealCells = (
            this.machine.currentCell >= MIN_RENDER_CELLS_LEFT+1
            && (this.inputLength - (this.machine.currentCell+1)) >= MIN_RENDER_CELLS_RIGHT
            && this.inputLength >= MAX_RENDER_CELLS
        );
   
        if(direction == "L") {
            /* Dynamically change tape */
            if(shiftRealCells) {

                /* Add new cell */
                var newCell = this.tapeCells.pop();
                newCell.attrs.x = this.tapeCells[0].attrs.x-50;
                this.tapeCells.unshift(newCell);

                /* Add new char */
                this.tapeChars.pop().remove();
                var newChar = this.paper.text(
                    this.tapeChars[0].attrs.x-50, 
                    this.tapeChars[0].attrs.y, 
                    this.machine.finalTape[this.machine.currentCell-7]
                );
                newChar.attr({
                    'font-size': '20px',
                    color: '#FFFFFF',
                    fill: '#FFFFFF'
                });
                this.tapeChars.unshift(newChar);
               
            } else {
                this.realCellIndex--;
            }
            for(var i=0; i < this.cellCount;i++) {
                if(i+1 == this.cellCount) {
                    funcVar = this.runAnimation.bind(this);
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
            /* Dynamicall change tape */
            if(shiftRealCells) {
                
                /* Add new cell */
                var newCell = this.tapeCells.shift();
                newCell.attrs.x = this.tapeCells[this.cellCount-2].attrs.x+50;
                this.tapeCells.push(newCell);

                /* Add new char */
                this.tapeChars.shift().remove();
                var newChar = this.paper.text(
                    this.tapeChars[this.cellCount-2].attrs.x+50, 
                    this.tapeChars[this.cellCount-2].attrs.y, 
                    this.machine.finalTape[this.machine.currentCell+13]
                );
                newChar.attr({
                    'font-size': '20px',
                    color: '#FFFFFF',
                    fill: '#FFFFFF'
                });
                this.tapeChars.push(newChar);
                
            } else {
                this.realCellIndex++;
            }

            for(var i=0; i < this.cellCount;i++) {
                if(i+1 == this.cellCount) {
                    funcVar = this.runAnimation.bind(this);
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

    this.cellCount = 0;

    /**
     * Draw the cells of the model machine.
     */
    this.drawCells = function() {
   
        this.cellCount = Math.min(MAX_RENDER_CELLS, this.machine.startTape.length);

        for(var i=0; i < this.cellCount; i++) {

            /* Create a cell */
            this.tapeCells[i] = this.paper.rect(200+i*(CELL_SIZE[0]), 50, CELL_SIZE[0], CELL_SIZE[0]);
            this.tapeCells[i].attr({
                stroke: '#ffaf4f',
                fill: 'grey'
            });

            /* Set the character on the cell */
            this.tapeChars[i] = this.paper.text(200+i*(CELL_SIZE[0])+25, 50+25, this.machine.startTape[i]);
            this.tapeChars[i].attr({
                'font-size': '20px',
                color: '#FFFFFF',
                fill: '#FFFFFF'
            });
        }
    }

    this.changeChar = function () {
        var tempChar = this.paper.text(this.tapeChars[this.realCellIndex].attrs.x, this.tapeChars[this.realCellIndex].attrs.y, this.animationQueue[0].symbol);
        this.tapeChars[this.realCellIndex].remove();
        this.tapeChars[this.realCellIndex]=tempChar;
        this.tapeChars[this.realCellIndex].attr({
            'font-size': '20px',
            color: 'blue',
            fill: '#ffffff'
        });

        this.tapeHeadUp();
    }

    this.tapeHeadUp = function() {
        this.tapeHead.animate({
            x: this.tapeHead.attrs.x,
            y: this.tapeHead.attrs.y-15
        }, HEAD_TIME, '<>', this.shiftTape.bind(this));
    }

    this.tapeHeadDown = function() {
        this.tapeHead.animate({
            x: this.tapeHead.attrs.x,
            y: this.tapeHead.attrs.y+15
        }, HEAD_TIME, '<>', this.changeChar.bind(this) );
    }

    this.animateTapeHead = function() {
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

