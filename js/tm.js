
/**
 * The Turing machine model
 */
function TM() {
	
    /* An array of characters */
    this.finalTape = new Array();
    this.startTape = new Array();

    this.currentCell = 0;
    this.currentState = new State(null, null, null);
    
    this.startCell = 0;
    this.startState = new State(null, null, null);

    /* An array of states */
    this.states = new Array();
    
    this.maxIters = 100000000.0;

    this.addState = function(s) {
        this.states[s.stateSymbol] = s;
    }

    this.getCurrentRules = function() {
        console.log("cell: " + this.currentCell);
        console.log("cell char: " + this.finalTape[this.currentCell]);
        var cr = this.currentState.rules[this.finalTape[this.currentCell]];
        if (cr == undefined) {
            console.log('*undefined*');
            if (this.currentState.rules['*'] != undefined) {
                console.log('*star*');
                cr = this.currentState.rules['*'];
            }
        }
        return cr;
    }

    this.getFinalTape = function() {
        try {
            return tm.finalTape.toString().replace(/,/g, "");
        } catch(err) {
            return "N/A";
        }
    }

    this.getState = function(stateSym) {
        return this.states[stateSym];
    }

    this.step = function() {

        console.log("    symbol: " + this.finalTape[this.currentCell]);

        var cr = this.currentState.rules[this.finalTape[this.currentCell]];
        if (cr == undefined) {
            if (this.currentState.rules['*'] != undefined) {
                cr = this.currentState.rules['*'];
            } 
        } else {
            /* Update current character */
            this.finalTape[this.currentCell] = cr.newSymbol;
        }

        console.log("    cr sy: " + cr.newSymbol + " d: " + cr.direction + " st: " + cr.nextState);

        /* Move tape head */
        if(cr.direction == 'r') {
            ++this.currentCell;
        } else if(cr.direction == '*') {
            /* No direction change */
        } else if (cr.direction == 'l') {
            if (this.currentCell > 0) {
                --this.currentCell;
            } else {
                this.prependSpace();
            }
        }

        /* Add space if needed */
        if (this.finalTape[this.currentCell] == undefined) {
            this.appendSpace();
        }

        /* Change state */
        this.currentState = this.states[cr.nextState];
    }

    this.init = function() {
        
    }

    this.save = function() {
        this.startTape = clone(this.finalTape);
        this.startCell = clone(this.currentCell);
        this.startState = clone(this.currentState);
    }

    this.reset = function () {
        this.finalTape = clone(this.startTape);
        this.currentCell = clone(this.startCell);
        this.currentState = clone(this.startState);
    }

    this.appendSpace = function() {
        this.finalTape.push('_');
        this.startTape.push('_');
    }

    this.prependSpace = function() {
        console.log("prepend!");
        this.finalTape.unshift('_');
        this.startTape.unshift('_');
        this.startCell++;
    }
}

/**
 * State model
 */
function State(stateStm) {
    this.stateSymbol = null;
    this.rules = new Array();
    this.addRule = function(sym, r) {
        this.rules[sym] = r;
    }
}

/**
 * Rule model
 */
function Rule(d, nState, nSym) {
    this.direction = d;         // 'R' or 'L'
    this.nextState = nState;    // a State name
    this.newSymbol = nSym;      // A char
}

