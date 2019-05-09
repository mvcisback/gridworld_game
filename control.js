document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    move(keyName);
    redraw();
}, false);


var keys_s = new Snap('#keys');
Snap.load('imgs/Qwerty.svg', function (response) {
    keys_s.append(response);
});
