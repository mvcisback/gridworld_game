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


var state = {
    x: 0,
    y: 0,
    bx: 0,
    by: 0,
    time: 0,
    testing: false,
};


var agent;
var gridworld_s = new Snap('#gridworld');

function move(keyName){
    if (!actions.has(keyName)) {
        return;
    }
    state.time += 1;

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
    agent.animate(
        {cx: x0 + dx*state.x + state.bx, cy: x0 + dx*state.y + state.by},
        100, 
        mina.ease,
        () => {
            agent.animate(
                {cx: x0 + dx*state.x, cy: x0 + dx*state.y},
                100, 
                mina.bounce
            );
        }
    );
    state.bx = 0;
    state.by = 0;
    step_counter.textContent = state.time;
    step_counter.setAttribute("value", 20 - state.time);
}
