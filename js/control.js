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
                location.href = "./done.html";
            }
            state.trial_num = Math.min(state.max_trials, state.trial_num + 1);
        }
        state.battery = state.max_battery;
        state.x = 0;
        state.y = 5;
        window.setTimeout(redraw, 800);
    }

}, false);


var keys_s = new Snap('#keys');
Snap.load('imgs/Qwerty.svg', function (response) {
    keys_s.append(response);
});
