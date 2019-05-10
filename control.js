const MAX_TRIALS = 3;
var TRIAL_NUM = 1;


function is_recharge(state){
    return (state.x == 7 && state.y == 0) 
        || (state.x == 7 && state.y == 7);
}


Snap.load('imgs/gridworld.svg', function (response) {
    gridworld_s.append(response);
    agent = Snap('#agent1');
    state.y = 5;
    state.x = 0;
    redraw();
});


document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    move(keyName);
    redraw();
    if (is_recharge(state) || state.time > 20){
        if (state.testing){
            if (TRIAL_NUM == MAX_TRIALS){
                location.href = "./done.html";
            }
            TRIAL_NUM = Math.min(MAX_TRIALS, TRIAL_NUM + 1);

            document.getElementById("trial-num").textContent = TRIAL_NUM;
        }
        state.time = 0;
        state.x = 0;
        state.y = 5;
        redraw();
    }

}, false);


var keys_s = new Snap('#keys');
Snap.load('imgs/Qwerty.svg', function (response) {
    keys_s.append(response);
});
