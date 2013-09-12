/* WTF should I do when the window loads??? Here is your answer. */
window.onload = init;

function init() {
    // do nothing right now    
}

function startStop() {
    if(tmAnim == undefined || tmAnim.runSem == 1) {
        parser.file = (document.getElementById('deftextbox').value);
        parser.parse();
    } else {
        tmAnim.runSem = 0;
    }
}

