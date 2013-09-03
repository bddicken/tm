
/**
 * Popup 
 */
function Popup(pname) {
    
    this.name = pname;

    this.show = function() {
        document.getElementById(this.name).display = 'block';
        document.getElementById(this.name).style.visibility="visible";;
    }
    
    this.hide = function() {
        document.getElementById(this.name).display = 'none';
        document.getElementById(this.name).style.visibility="hidden";;
    }
    
    this.flip = function() {
        var d = document.getElementById(this.name).style.visibility;
        if(d == 'hidden' || d == "") {
            this.show();
            console.log("popup switched on");
        }
        else {
            this.hide();
            console.log("popup switched off");
        }
    }
}

/**
 * Create initial popups
 */
var helpPop = new Popup('help');
