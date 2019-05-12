const x0 = 21;
const y0 = 21;
const dx = 38.5;
const xmax = 20;
const MAX_BATTERY = 20;
var gridworld_snap = null;
var agent_snap = null;
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
    replay("gridworld", {x: 3, y: 0}, [
        "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight",
    ]);
}

function negative_demo(){
    state.asked_query = true;
    replay("gridworld", {x: 0, y: 5}, [
        "ArrowRight", "ArrowRight", "ArrowRight",
        "ArrowRight", "ArrowRight", "ArrowRight",
        "ArrowDown", "ArrowDown",  "ArrowRight",
    ]);
}



// Gridworld Dynamics and rendering.

const actions = new Set([
    'ArrowRight',
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown'
]);


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

        redraw();
        
    });
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


// Replays for Teacher Demonstrations.

const MOVE_TIME = 500;
function mover(action, i){
    window.setTimeout(function (){
        move(action);
        redraw();
    }, i*MOVE_TIME);
}


function replay(world, start, actions){
    if (state.ui_disabled){ return; }
    state.world = "gridworld";
    state.ui_disabled = true;

    state.x = start.x;
    state.y = start.y;
    state.battery = MAX_BATTERY;
    redraw();

    for (var i = 0; i < actions.length; i++) { 
        mover(actions[i], i); 
        redraw();
    }

    window.setTimeout(
        function(){ state.ui_disabled = false; },
        (actions.length + 0.1)*MOVE_TIME
    );
}


// MISC.

function get_tested(){ location.href = "./testing.html"; }


// VUEJS

Vue.component('battery', {
    props: ["max", "value"],
    template: `
<div id="battery">
    <h2 style="text-align: center" class="title">Battery Level:</h2>
    <progress class="nes-progress is-primary"
              :max="max" :value="value"></progress> 
    <p style="text-align: center"> {{ value }} / {{ max }}</p> 
</div>`,
});

Vue.component('gridworld', {
    props: ["max", "value"],
    template: `
<div class="nes-container">
  <div id="gridworld-container">
    <svg height="8.05em" width="8.05em" id="gridworld"></svg>
  </div>
  <battery :value="value" :max="max"></battery>
</div>`
});

Vue.component('controls_ui', {
    template: `
<div class="nes-container">
  <h2>Controls</h2>
  <figure>
    <svg id="keys"></svg>
    <figcaption>Use arrow keys to move the agent.</figcaption>
  </figure>
</div>`
});

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
