console.log("Hello World");
var x = null;
var y = null;
document.addEventListener('mousemove', onMouseUpdate, false);

document.getElementById('hplogo').classList.add('animated');

function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
    console.log(x, y);
}

// https://stackoverflow.com/questions/2601097/how-to-get-the-mouse-position-without-events-without-moving-the-mouse
