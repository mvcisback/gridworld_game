const x0 = 21;
const y0 = 21;
const dx = 38.5;
const xmax = 20;
const actions = new Set([
    'ArrowRight',
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown'
]);

const step_counter = document.getElementById('step-count');
const MAX_BATTERY = 20;
var gridworld_snap = null;
var agent_snap = null;


function load_world(name){
    if (name == null){ return; }
    path = `imgs/${name}.svg`;
    console.log(path);
    if (gridworld_snap == null){
        gridworld_snap = new Snap('#gridworld');
    }

    Snap.load(path, function (response) {
        gridworld_snap.append(response);
        if (agent_snap != null) {
            agent_snap.remove();
        }
        agent_snap = Snap('#agent1');

        state.y = 5;
        state.x = 0;
        redraw();
        
    });
}


var state = {
    x: 0,  // Agent position.
    y: 0,

    bx: 0,  // Bump delta.
    by: 0,

    battery: MAX_BATTERY,
    max_battery: MAX_BATTERY,

    screen: "landing",
    world: null,

    testing: false,
    trial_num: 1,
    max_trials: 3,

    ui_disabled: false,
    asked_query: false,
};


function positive_demo(){
    state.asked_query = true;
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


function negative_demo(){
    state.asked_query = true;
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

function get_tested(){
    console.log("HERE!");
    location.href = "./testing.html";
}

var gridworld_vue = new Vue({
    el: '#game-container',
    data: state,
    watch: { world: load_world, },
    computed: {
        cant_advance: function(){
            return this.ui_disabled || (!this.asked_query);
        }
    }
});


function move(keyName){
    if (!actions.has(keyName)) {
        return;
    }
    state.battery -= 1;

    switch (keyName) {
    case 'ArrowRight':
        state.x += 1;
        break;
    case'ArrowLeft':
        state.x -= 1;
        break;
    case'ArrowUp':
        state.y -= 1;
        break;
    case'ArrowDown':
        state.y += 1;
        break;
    }

    // TODO: Animate bump.
    if (state.x > 7) {
        state.bx = +12;
        state.x = 7;
    }
    else if (state.y > 7) {
        state.by = +12;
        state.y = 7;
    }
    else if (state.y < 0) {
        state.by = -12;
        state.y = 0;
    }
    else if (state.x < 0) {
        state.bx = -12;
        state.x = 0;
    }
}


function redraw(){
    agent_snap.animate(
        {cx: x0 + dx*state.x + state.bx, cy: x0 + dx*state.y + state.by},
        100, 
        mina.ease,
        () => {
            agent_snap.animate(
                {cx: x0 + dx*state.x, cy: x0 + dx*state.y},
                100, 
                mina.bounce
            );
        }
    );
    state.bx = 0;
    state.by = 0;
}
