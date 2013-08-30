
function TM() {
	
    // An array of characters
    this.inputTape = new Array();
    this.startTape = new Array();

    this.currentCell = 0;
    this.currentState = null;

    // An array of states
    this.states = new Array();

    this.addState = function(s) {
        this.states[s.stateSymbol] = s;
    }

    this.getState = function(stateSym) {
        return this.states[stateSym];
    }

    this.step = function() {

        var cr = this.currentState.rules[this.inputTape[this.currentCell]];

        /* Update current character */
        this.inputTape[this.currentCell] = cr.newSymbol;

        /* Move tape head */
        if(cr.direction == 'r')
            ++this.currentCell;
        else if (this.currentCell > 0)
            --this.currentCell;

        /* Change state */
        this.currentState = this.states[cr.nextState];
    }

    this.init = function() {
        
    }

    this.saveStartTape = function() {
        this.startTape = clone(this.inputTape);
    }

    this.appendSpace = function() {
        this.inputTape.push('_');
        this.startTape.push('_');
    }

}

function State(stateStm) {
    this.stateSymbol = null;
    this.rules = new Array();
    this.addRule = function(sym, r) {
        this.rules[sym] = r;
    }
}

function Rule(d, nState, nSym) {
    this.direction = d;         // 'R' or 'L'
    this.nextState = nState;    // a State name
    this.newSymbol = nSym;      // A char
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
