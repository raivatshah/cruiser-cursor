console.log("Hello World");
var x = null;
var y = null;
var queue = [];

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mousewheel", onMouseUpdate, false);

cruiserDiv = document.createElement("div");
cruiserDiv.setAttribute("id", "cruiser");
document.body.appendChild(cruiserDiv);

function createLineElement(x, y, length, angle) {
  var line = document.createElement("div");
  var styles =
    "border: 1px solid black; " +
    "width: " +
    length +
    "px; " +
    "height: 0px; " +
    "-moz-transform: rotate(" +
    angle +
    "rad); " +
    "-webkit-transform: rotate(" +
    angle +
    "rad); " +
    "-o-transform: rotate(" +
    angle +
    "rad); " +
    "-ms-transform: rotate(" +
    angle +
    "rad); " +
    "position: absolute; " +
    "top: " +
    y +
    "px; " +
    "left: " +
    x +
    "px; ";
  line.setAttribute("style", styles);
  return line;
}

function createLine(x1, y1, x2, y2) {
  var a = x1 - x2,
    b = y1 - y2,
    c = Math.sqrt(a * a + b * b);

  var sx = (x1 + x2) / 2,
    sy = (y1 + y2) / 2;

  var x = sx - c / 2,
    y = sy;

  var alpha = Math.PI - Math.atan2(-b, a);

  return createLineElement(x, y, c, alpha);
}
/**
 * Event triggered every 10ms
 */
setInterval(function () {
    if (queue.length >= 20) {
        queue.shift()
    }
    queue.push([x, y])

    if (queue.length > 1) {
        var firstCoord = queue[0];
        var lastCoord = queue[queue.length - 1];

        var cd = document.getElementById("cruiser");
        cd.innerHTML = "";
        cd.appendChild(createLine(firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]));
    }

    /*
    if(queue.length > 0) {
        startX = queue[0][0];
        startY = queue[0][1];
        endX = queue[queue.length - 1][0]
        endY = queue[queue.length - 1][1]
        arrow = document.createElement('img');
        document.body.appendChild(arrow);
        arrow.src = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Red_rectangle.svg";
        arrow.style.position = "fixed";
        arrow.style.top = startY + 'px';
        arrow.style.left = startX + 'px';
        arrow.style.width = '10px';
        arrow.style.height = '10px';
        console.log(queue[0])
    }
    */
}, 10);

function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
    //console.log(x, y);
}

// https://stackoverflow.com/questions/2601097/how-to-get-the-mouse-position-without-events-without-moving-the-mouse

function get_rectangles() {
    rects = [];
    var clickables = ["A", "BUTTON", "INPUT", "SUMMARY"];
    var all = document.getElementsByTagName("*");
    for(var i = 0; i < all.length; i++) {
        var is_clickable = false;
        for(var j = 0; j < clickables.length; j++) {
            if(all[i].tagName == clickables[j]) is_clickable = true;
        }
        if(is_clickable) {
            rects.push(all[i]);
        }
    }
    console.log(rects);
    return rects;
}

function show_rectangle(rect) {
    if(rect.tagName == "A") {
        rect.classList.add('animated_atag');
        
    } else if (rect.tagName != "INPUT") {
        rect.classList.add('animated_scale');
    }
    else {
        rect.classList.add('animated_bold');
    } 
}

function show_rectangles(rects) {
    for(var i = 0; i < rects.length; i++) {
        show_rectangle(rects[i]);
    }
}

rects = get_rectangles();
console.log("Get Rectangles");
show_rectangles(rects);
console.log("Shown Rectangles");
