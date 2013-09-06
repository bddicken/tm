/* Constants */
var END_SEQUENCE = 'FFF';

/** parser */
var parser = new defParser();

/** The turing machine model */
var tm = new TM();

/**
 * File parsing object which parses a Turing Machine definition
 * 
 * @author Benjamin Dicken (bddicken@gmail.com)
 */

function defParser(parseString) 
{
    this.file = parseString; 
    this.error = false;
    this.errorMessage = "Errors found on line(s)";
    this.okMessage = "No errors found";
    this.line = 1;

    /**
     * @description
     * The parseAll function parses the entire string (this.file) line-by-line.
     * This function relies on other function such as determineCommand and
     * getLine in FileParser.
     */
    this.parse = function() {

        try {

            tm = new TM();
            this.file = this.file + '\nFFF\n';
            var lines = this.file.split("\n").length;  
            var com = this.getLine();
        
            while(com.indexOf(END_SEQUENCE) == -1){
                console.log("parse: " + com);
                this.determineCommand(com);
                com = this.getLine();
                this.line++;
            }

            /* Run animation based off of the model */
            animate(tm);

        } catch(err) {
            parseERRPop.flip();
        }
    }

    /**
     * @description
     * This function determines the type of command that is passed to it. Once
     * The type is determined, it is executed.  If any command is determined
     * to be syntactically incorrect, this.error is set to true, and the lines
     * that contain errors are kept track of.
     */
    this.determineCommand = function(command) {
        
        // command is adding a comment
        if(command.indexOf("#") != -1){
            try {
                command = command.substring(0, command.indexOf("#"));
            } catch(err) {
                this.error = true;
                console.log('error: ' + err.message);
                this.errorMessage = this.errorMessage.concat(', ' + this.line);
                return;
            }
            return;
        }
        
        /* command is setting initial tape */
        if(command.indexOf("$INITIAL_TAPE") != -1){
            var index = command.indexOf('$INITIAL_TAPE');
            var parse = command.substring(index+14).split('');
            for(var x=0; x < parse.length; x++)
                tm.inputTape[x] = parse[x];
            return;
        } 
        
        /* initial state of the TM */
        if(command.indexOf("$INITIAL_STATE") != -1){
            var index = command.indexOf('$INITIAL_STATE');
            var parse = command.substring(index+15);
            console.log(index);
            console.log(parse);
            tm.currentState = tm.states[parse];
            return;
        } 

        /* command is whitespace */
        else if(command == '\n' || 
                command == ' '  ||
                command == ''  ||
                command == '\t') {
        }
        
        /* else, command is adding a state */
        else {
                /* Parse command */
                var parse = command.split(' ');

                /* Get next state */
                var nextState = null
                if(tm.getState(parse[4]) == null)
                    nextState = new State();
                else 
                    nextState = tm.getState(parse[4]);
               
                /* create new rule */
                var tR = new Rule();
                tR.direction = parse[3];
                tR.nextState = parse[4];
                tR.newSymbol = parse[2];
              
                var tS;
                if( tm.getState(parse[0]) == null || tm.getState(parse[0]) == undefined ) {
                    tS = new State();
                } 
                else {
                    tS = tm.getState(parse[0]);
                }
                
                tS.addRule(parse[1], tR);
                tS.stateSymbol = parse[0];
                tm.addState(tS);
        }
    }

    /**
     * @description
     * Gets the next line from the this.file string.
     */
    this.getLine = function() {
        if(this.file.length < 1)
            return 'F';
        var index = this.file.indexOf('\n');
        var ret = this.file.substring(0, index);
        this.file = this.file.substring(index+1, this.file.length+1);
        return ret;
    }
}

