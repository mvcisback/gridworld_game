const MOVE_TIME = 500;
const BUTTONS = {
    posDemo: document.getElementById("posDemo"),
    negDemo: document.getElementById("negDemo"),
    ready: document.getElementById("ready-button"),
};
const REMAINING_QUERIES_FIELD = document.getElementById('remaining-queries');

var REMAINING_QUERIES = 10;
var UI_DISABLED = false;

function mover(pos, i){
    window.setTimeout(function (){
        state.x = pos.x;
        state.y = pos.y;
        state.time += 1;
        redraw();
    }, i*MOVE_TIME);
}


function dec_query_count(){
    REMAINING_QUERIES = Math.max(0, REMAINING_QUERIES - 1);
    REMAINING_QUERIES_FIELD.textContent = REMAINING_QUERIES;
}


function enable_ui(){
    UI_DISABLED = false;
    for (var p in BUTTONS){
        BUTTONS[p].classList.remove('is-disabled');
        BUTTONS[p].disabled = false;
    }
}


function disable_ui(){
    UI_DISABLED = true;
    for (var p in BUTTONS){
        BUTTONS[p].classList.add('is-disabled');
        BUTTONS[p].disabled = true;
    }
}


function replay(positions){
    if (UI_DISABLED){
        return;
    }
    disable_ui()
    state.time = -1;
    for (var i = 0; i < positions.length; i++) { 
        mover(positions[i], i); 
    }
    window.setTimeout(enable_ui, (positions.length + 0.1)*MOVE_TIME);
}


BUTTONS.posDemo.onclick = function positive_demo(){
    if (REMAINING_QUERIES <= 0){ return; }
    dec_query_count();
    replay([
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
        {x: 4, y: 0},
        {x: 5, y: 0},
        {x: 6, y: 0},
        {x: 7, y: 0},

        {x: 7, y: 1},
        {x: 7, y: 2},
        {x: 7, y: 3},
        {x: 7, y: 4},
        {x: 7, y: 5},
        {x: 7, y: 6},
        {x: 7, y: 7},
    ]);
}

BUTTONS.negDemo.onclick = function negative_demo(){
    if (REMAINING_QUERIES <= 0){ return; }
    dec_query_count();
    replay([
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 0, y: 5},
        {x: 0, y: 6},
        {x: 0, y: 7},
        {x: 1, y: 7},
        {x: 2, y: 7},
        {x: 3, y: 7},
        {x: 4, y: 7},
        {x: 5, y: 7},
        {x: 6, y: 7},
        {x: 7, y: 7},
    ]);
}

BUTTONS.ready.disabled = true;
BUTTONS.ready.onclick = function (){
    console.log("READY!");
    location.href = "./testing.html";
}


Snap.load('imgs/world1.svg', function (response) {
    gridworld_s.append(response);
    agent = Snap('#agent1');
    redraw();
});
