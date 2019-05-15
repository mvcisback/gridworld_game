nunjucks.configure('views/', {web: {async: true}});
const { Machine, actions, interpret } = XState;
const MAX_BATTERY = 20;
const MOVE_TIME = 500;
const x0 = 21;
const y0 = 21;
const dx = 38.5;
const xmax = 20;

var curr_vue;
var gridworld_snap;
var agent_snap;

// ---------------------------------------------------------------------------
//                           State Transitions
// ---------------------------------------------------------------------------

const stage_machine = Machine({
    id: 'toggle',
    initial: 'landing',
    states: {
        landing: { on: { TOGGLE: 'intro' } },
        intro: { on: { TOGGLE: 'expo' } },
        expo: { on: { TOGGLE: 'learning' } },
        learning: { on: { TOGGLE: 'testing' } },
        testing: { on: { TOGGLE: 'results', }},
        results: { on: { 
            TOGGLE: 'learning',
            END: 'done',
        }},
        done: { type: 'final' },
    },
});

stage_service = interpret(stage_machine).onTransition(
    function(state) {
        page(`/${state.value}`);
    }
);

state = {
    stage: stage_machine.initial,
    stage_service: stage_service,

    x: 0,  // Agent position.
    y: 0,

    bx: 0,  // Bump delta.
    by: 0,

    battery: MAX_BATTERY,
    max_battery: MAX_BATTERY,

    ui_disabled: false,
    asked_query: false,
    controllable: true,
    testing: false,
    trial_num: 1,
    max_trials: 3,
};

function send(event){
    state.stage_service.send(event);
};

// ---------------------------------------------------------------------------
//                           Routing
// ---------------------------------------------------------------------------

function update_page(path, callback){
    return function(){
        nunjucks.render(path, function (err, res){
            if (curr_vue != null){ delete curr_vue; }
            el = document.getElementById('app');
            el.innerHTML = res;
            callback();
        });
    };
};

page.base('/gridworld_game');
page('/landing', update_page("landing.html", function(){}));
page('/done', update_page("done.html", function(){}));
page('/intro', update_page("intro_1.html", gridworld_binder(true)));
page('/learning', update_page("learning_1.html", gridworld_binder(false)));
page('/testing', update_page("testing_1.html", function(){
    gridworld_binder(true)();
    state.testing = true;
    state.battery = MAX_BATTERY;
    state.x = 0;
    state.y = 0;
}));
page('/expo', update_page("expo.html", function(){
    var CONTAINER = new Snap('#robot2human');
    Snap.load('imgs/robot2human.svg', function (response) {
        CONTAINER.append(response);
    });
}));
page('/results', update_page("results.html", function(){
    curr_vue = new Vue({
        data: state,
        el: "#app",
    });
}));

page();


// ---------------------------------------------------------------------------
//                         Keyboard Bindings
// ---------------------------------------------------------------------------
function is_recharge(state){
    return (state.x == 7 && state.y == 0) 
        || (state.x == 7 && state.y == 7);
}


document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    move(keyName);
    redraw();
    if (is_recharge(state) || state.battery < 0){
        if (state.testing){
            if (state.trial_num == state.max_trials){
                send("TOGGLE");
            }
            state.trial_num = Math.min(state.max_trials, state.trial_num + 1);
        }
        state.battery = state.max_battery;
        state.x = 0;
        state.y = 5;
        window.setTimeout(redraw, 800);
    }

}, false);

// ---------------------------------------------------------------------------
//                                 Queries
// ---------------------------------------------------------------------------

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


// ---------------------------------------------------------------------------
//                         Gridworld UI
// ---------------------------------------------------------------------------

const gridworld_actions = new Set([
    'ArrowRight',
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown'
]);

function gridworld_binder(controllable){
    return function(){
        state.controllable = controllable;
        curr_vue = new Vue({
            data: state,
            el: "#app",
            computed: {
                cant_advance: function(){
                    return this.ui_disabled || (!this.asked_query);
                }
            },
            methods: {
                send: send,
                positive_demo: positive_demo,
                negative_demo: negative_demo,
            },
        });
        if (gridworld_snap != null){
            gridworld_snap.remove();
        }
        gridworld_snap = new Snap('#gridworld');

        Snap.load("imgs/gridworld.svg", function (response) {
            gridworld_snap.append(response);
            if (agent_snap != null) {
                agent_snap.remove();
            }
            agent_snap = Snap('#agent1');
            redraw();
            
        });
    }
};

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
};


function move(keyName){
    if (!gridworld_actions.has(keyName)) {
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


stage_service.start();
