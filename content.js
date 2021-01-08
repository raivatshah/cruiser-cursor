console.log("Hello World");
var x = null;
var y = null;
var queue = [];
var prev_id = null;
var cntr = 0;
const LIMIT = 10;

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mousewheel", onMouseUpdate, false);
document.addEventListener("mousedown", onMouseClick, false);

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

function get_center(rect) {
    coords = rect.getBoundingClientRect();
    x0 = ((coords.left + coords.right) / 2.0) + window.scrollX;
    y0 = ((coords.top + coords.bottom) / 2.0) + window.scrollY;
    return [x0, y0];
}

function get_dist(x1, y1, x2, y2) {
  dx = x2 - x1;
  dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function rotated_point(x1, y1, degree, x0, y0) {
  angle = degree * (Math.PI / 180);
  xx = ((x1 - x0) * Math.cos(angle) - (y1 - y0) * Math.sin(angle)) + x0;
  yy = ((x1 - x0) * Math.sin(angle) + (y1 - y0) * Math.cos(angle)) + y0;
  return [xx, yy];
}

function get_line(x1, y1, x2, y2) {
  a = y1 - y2;
  b = x2 - x1;
  c = (x1 - x2)*y1 + (y2 - y1)*x1;
  return [a, b, c];
}

function sign_of(x) {
  if(x == 0) {
    return 0;
  } else if(x > 0) {
    return 1;
  } else if(x < 0) {
    return -1;
  }
}

function on_same_side(l, x1, y1, x2, y2) {
  a = l[0], b = l[1], c = l[2];
  k1 = a*x1 + b*y1 + c;
  k2 = a*x2 + b*y2 + c;
  return (sign_of(k1) == sign_of(k2));
}

function predict_rect_id(rects, x1, y1, x2, y2) {
    if(get_dist(x1, y1, x2, y2) < LIMIT) {
        return null;
    }

    best_dist = null;
    best_id = null;
    dx = x2 - x1;
    dy = y2 - y1;
    x3 = x2 + dx;
    y3 = y2 + dy;
    tmp1 = rotated_point(x3, y3, 15, x2, y2);
    tmp2 = rotated_point(x3, y3, -15, x2, y2);
    l1 = get_line(x2, y2, tmp1[0], tmp1[1]);
    l2 = get_line(x2, y2, tmp2[0], tmp2[1]);

    var cd = document.getElementById("cruiser");
    cd.innerHTML = "";
    cd.appendChild(createLine(x2, y2, tmp1[0], tmp1[1]));
    cd.appendChild(createLine(x2, y2, tmp2[0], tmp2[1]));

    for(var i = 0; i < rects.length; i++) {
        temp = get_center(rects[i]);
        x0 = temp[0];
        y0 = temp[1];
        if(on_same_side(l1, x3, y3, x0, y0) == true && on_same_side(l2, x3, y3, x0, y0)) {
          dist = get_dist(x2, y2, x0, y0);
          if((best_dist == null) || dist < best_dist) {
              best_dist = dist;
              best_id = i;
          }
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

    if(cntr == 0) {
      id = predict_rect_id(rects, firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]);
      if(id != prev_id && id != null) {
        if(prev_id != null) {
          remove_anim(rects[prev_id]);
        }
        cntr = 50;
        add_anim(rects[id]);
        prev_id = id;
      }
    } else {
      cntr--;
    }
  }
}, 5);

function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
  //console.log(x, y);
}

function is_inside(x, y, rect) {
  coords = rect.getBoundingClientRect();
  return (x >= coords.left && x <= coords.right && y >= coords.top && y <= coords.bottom);
}

function onMouseClick(e) {
  var clicked = false;
  for(var i = 0; i < rects.length; i++) {
    if(is_inside(x, y, rects[i])) {
      rects[i].click();
      clicked = true;
    }
  }
  if(clicked == false && prev_id != null) {
    console.log("Click");
    console.log(prev_id);
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
