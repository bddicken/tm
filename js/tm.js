
function TM() {
	
    // An array of characters
    this.inputTape = new Array();

    this.currentCell = 0;
    this.currentState = null;

    // An array of states
    this.states = new Array();

    this.addState(s) = function() {
        states[s.stateSymbol] = s;
    }

    this.getState(stateSym) = function() {
        retun states[stateSym];
    }

    this.step() = function() {

        var cr = currentState.rules[inputTape[currentCell]];

        // Update current character
        inputTape[currentCell] = cr.newSymbol;

        // Move tape head
        if(cr.direction == 'r')
            ++currentCell;
        else if (currentCell > 0)
            --currentCell;

        // Change state
        currentState = cr.nextState;

        // Animate
        // animateChange();
    }

}

function State(stateStm) {
    this.stateSymbol = null;
    this.rules = new Array();
    this.addRule(sym, r) = function() {
        rules[sym] = r;
    }
}

function Rule(d, nState, nSym) {
    this.direction = d;         // 'RIGHT' or 'LEFT'
    this.nextState = nState;    // a State object
    this.newSymbol = nSym;      // A char
}

