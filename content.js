console.log("Hello World");
var x = null;
var y = null;
var queue = [];
var prev_id = null;
const xbox = 50;
const ybox = 50;

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mousewheel", onMouseUpdate, false);
document.addEventListener("mousedown", onMouseClick, false);

/**
 * div that stores cursor line
 */
cruiserDiv = document.createElement("div");
cruiserDiv.setAttribute("id", "cruiser");
document.body.appendChild(cruiserDiv);

/**
 * div that stores rectangle boundary
 */
rectDiv = document.createElement("div");
rectDiv.setAttribute("id", "rectDiv");
document.body.appendChild(rectDiv);

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

function add_boundary(x1, y1, x2, y2) {
    var rectangle = document.createElement("div");

    var height = Math.abs(x1 - x2);
    var width = Math.abs(y1 - y2);
    var styles =
        "border: 1px solid black; " +
        "width: " +
        width +
        "px; " +
        "height: " +
        height +
        "px; " +
        "position: absolute; " +
        "top: " +
        Math.min(y1, y2) +
        "px; " +
        "left: " +
        Math.min(x1, x2) +
        "px; ";
    rectangle.setAttribute("style", styles);
    remove_boundary();
    var rd = document.getElementById("rectDiv");
    rd.appendChild(rectangle);
}

function remove_boundary() {
     var rd = document.getElementById("rectDiv");
     rd.innerHTML = "";
}

function get_center(rect) {
    coords = rect.getBoundingClientRect();
    x0 = (coords.left + coords.right) / 2.0;
    y0 = (coords.top + coords.bottom) / 2.0;
    return [x0, y0];
}

function get_tangent_dist(x0, y0, a, b, c) {
    num = Math.abs(a*x0 + b*y0 + c);
    den = Math.sqrt(a*a + b*b);
    return (num / den);
}

function predict_rect_id(rects, x1, y1, x2, y2) {
    best_dist = null;
    best_id = null;
    a = y1 - y2;
    b = x2 - x1;
    c = (x1 - x2)*y1 + (y2 - y1)*x1;
    for(var i = 0; i < rects.length; i++) {
        temp = get_center(rects[i]);
        x0 = temp[0];
        y0 = temp[1];
        dist = get_tangent_dist(x0, y0, a, b, c);
        if((best_dist == null) || dist < best_dist) {
            best_dist = dist;
            best_id = i;
        }
    }
    return best_id;
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
    add_boundary(firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]);
    if((Math.abs(firstCoord[0] - lastCoord[0]) <= xbox) && (Math.abs(firstCoord[1] - lastCoord[1]) <= ybox)) {
      console.log("IDLE");
    }

    id = predict_rect_id(rects, firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]);
    if(id != prev_id && id != null) {
      if(prev_id != null) {
        remove_anim(rects[prev_id]);
      }
      add_anim(rects[id]);
      prev_id = id;
    }
  }
}, 10);

function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
  //console.log(x, y);
}

function onMouseClick(e) {
  console.log("Click");
  console.log(prev_id);
  if(prev_id != null) {
    rects[prev_id].click();
  }
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

function add_anim(rect) {
  if(rect.tagName == "A") {
    rect.classList.add('animated_atag');

  } else if (rect.tagName != "INPUT") {
    rect.classList.add('animated_scale');
  }
  else {
    rect.classList.add('animated_bold');
  } 
}


function remove_anim(rect) {
  if(rect.tagName == "A") {
    rect.classList.remove('animated_atag');

  } else if (rect.tagName != "INPUT") {
    rect.classList.remove('animated_scale');
  }
  else {
    rect.classList.remove('animated_bold');
  } 

}

function add_anims(rects) {
  for(var i = 0; i < rects.length; i++) {
    add_anim(rects[i]);
  }
}

rects = get_rectangles();
console.log("Get Rectangles");
//add_anims(rects);
console.log("Shown Rectangles");
