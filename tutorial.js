const MOVE_TIME = 500;
const BUTTONS = {
    posDemo: document.getElementById("posDemo"),
    negDemo: document.getElementById("negDemo"),
    ready: document.getElementById("ready-button"),
};

var REMAINING_QUERIES = 100;
var UI_DISABLED = false;

function mover(pos, i){
    window.setTimeout(function (){
        state.x = pos.x;
        state.y = pos.y;
        state.time += 1;
        redraw();
    }, i*MOVE_TIME);
}


function enable_ui(){
    //UI_DISABLED = false;
    for (var p in BUTTONS){
        BUTTONS[p].classList.remove('is-disabled');
        BUTTONS[p].disabled = false;
    }
    console.log('ui enabled');
}


function disable_ui(){
    UI_DISABLED = true;
    for (var p in BUTTONS){
        BUTTONS[p].classList.add('is-disabled');
        BUTTONS[p].disabled = true;
    }
    console.log('ui disabled');
}


function replay(positions){
    if (UI_DISABLED){
        return;
    }
    disable_ui()
    state.time = -1;
    for (var i = 0; i < 8; i++) { mover(positions[i], i); }
    window.setTimeout(enable_ui, (positions.length + 1)*MOVE_TIME);
}


BUTTONS.posDemo.onclick = function positive_demo(){
    replay([
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
        {x: 4, y: 0},
        {x: 5, y: 0},
        {x: 6, y: 0},
        {x: 7, y: 0},
    ]);
}

BUTTONS.negDemo.onclick = function negative_demo(){
    replay([
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 0, y: 5},
        {x: 0, y: 6},
        {x: 0, y: 7},
    ]);
}

BUTTONS.ready.disabled = true;
BUTTONS.ready.onclick = function (){
    console.log("READY!");
    location.href = "/testing.html";
}
