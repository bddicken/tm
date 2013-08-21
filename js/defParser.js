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
    this.file = parseString + '\n';
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

        tm = new TM();

        var lines = this.file.split("\n").length;  

        var com = this.getLine();
        while(com !== 'F'){
            console.log("parse")
            this.determineCommand(com);
            com = this.getLine();
            this.line++;
        }

        var pAlert = document.getElementById('parseStatus');
        
        if(this.error || this.line < lines) {
            pAlert.style.color = "rgb(150, 20, 20)";
            pAlert.innerHTML = this.errorMessage;
        } else  {
            pAlert.style.color = "rgb(120, 220, 120)";
            pAlert.innerHTML = this.okMessage;
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
        //var cType = command.charAt(0);
        
        // command is adding an edge
        if(command.indexOf("$INITIAL_TAPE") != -1){
            // Parse command
            var index = command.indexOf('$INITIAL_TAPE');
            var parse = command.substring(index+14).split('');

            // Populate cells
            for(var x=0; x < parse.length; x++)
                tm.inputTape[x] = parse[x];

            return;
        } 
        
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
        }

        // command is whitespace
        else if(command == '\n' || 
                command == ' '  ||
                command == ''  ||
                command == '\t') {
        }
        
        // else, command is adding a state
        else {
            //try {
                // Parse command
                var parse = command.split(' ');

                // Get next state
                var nextState = null
                if(tm.getState(parse[4]) == null)
                    nextState = new State();
                else 
                    nextState = tm.getState(parse[4]);
               
                // create new rule
                var tR = new Rule();
                tR.direction = parse[3];
                tR.nextState = nextState;
                tR.newSymbol = parse[2];
                
                var tS = new State();
                tS.addRule(parse[1], tR);
                tS.stateSymbol = parse[0];
                tm.addState(tS);

            //} catch(err) {
            //    this.error = true;
            //    console.log('other error >>>' + command + '<<<');
            //    this.errorMessage = this.errorMessage.concat(', ' + this.line);
            //    return;
            //}
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

