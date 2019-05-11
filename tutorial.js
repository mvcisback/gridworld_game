const MOVE_TIME = 500;
const BUTTONS = {
    ready: document.getElementById("ready-button"),
};
var REMAINING_QUERIES = 10;

function mover(pos, i){
    window.setTimeout(function (){
        state.x = pos.x;
        state.y = pos.y;
        state.battery -= 1;
        redraw();
    }, i*MOVE_TIME);
}


function dec_query_count(){
    REMAINING_QUERIES = Math.max(0, REMAINING_QUERIES - 1);
}


function enable_ui(){
    state.ui_disabled = false;
    for (var p in BUTTONS){
        BUTTONS[p].classList.remove('is-disabled');
        //BUTTONS[p].disabled = false;
    }
}


function disable_ui(){
    state.ui_disabled = true;
    for (var p in BUTTONS){
        //BUTTONS[p].classList.add('is-disabled');
        //BUTTONS[p].disabled = true;
    }
}


function replay(positions){
    if (state.ui_disabled){
        return;
    }
    disable_ui()
    state.battery = MAX_BATTERY + 1;
    for (var i = 0; i < positions.length; i++) { 
        mover(positions[i], i); 
    }
    window.setTimeout(enable_ui, (positions.length + 0.1)*MOVE_TIME);
}



state.world = "world1";
