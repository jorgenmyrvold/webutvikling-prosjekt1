const DT = 0.1; // Speed of circles
const SVG_HEIGHT_WIDTH = 100;
const CANVAS_HEIGHT_WIDTH = 1000;
const CANVAS_CIRCLE_RADIUS = 100;
const CANVAS_MAX_SPEED = 40;
const NUM_CIRCLES = 6;
const SVG_CIRCLE_RADIUS = 5;
const SVG_MAX_SPEED = 5;

let randomHue = [180, 180, 180, 180, 180];
let posAngle = 0;

let requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

// For showing and hiding documentation in accordion using jQuery
$(".accordion-header").click(function () {
  $(this).toggleClass("active");
});

// From https://css-tricks.com/converting-color-spaces-in-javascript/
// Utility function to convert from HSL to Hex
function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

let svgCircles = [];

function svgCirclesInit(svgCircles) {
  const maxXY = SVG_HEIGHT_WIDTH - SVG_CIRCLE_RADIUS;
  const minXY = SVG_CIRCLE_RADIUS;

  for (let i = 0; i < NUM_CIRCLES; i++) {
    let newCircle = {
      id: i,
      radius: SVG_CIRCLE_RADIUS,
      x: Math.floor(Math.random() * (maxXY - minXY + 1) + minXY),
      y: Math.floor(Math.random() * (maxXY - minXY + 1) + minXY),
      vx: -SVG_MAX_SPEED + Math.random() * 2 * SVG_MAX_SPEED,
      vy: -SVG_MAX_SPEED + Math.random() * 2 * SVG_MAX_SPEED,
      fill: HSLToHex(Math.random() * 360, 100, 50),
    };
    svgCircles.push(newCircle);
  }
}
svgCirclesInit(svgCircles);

function createSVGCircles(item, index, array) {
  const svgns = "http://www.w3.org/2000/svg";
  const svgWrapper = document.getElementById("svg-animation");
  const newCircle = document.createElementNS(svgns, "circle");

  newCircle.setAttribute("id", "svg-circle" + item.id);
  newCircle.setAttribute("cx", item.x.toString());
  newCircle.setAttribute("cy", item.y.toString());
  newCircle.setAttribute("r", item.radius.toString());
  newCircle.setAttribute("fill", item.fill);
  svgWrapper.append(newCircle);
}
svgCircles.forEach(createSVGCircles);

function changeRandomHue(item, index, array) {
  const circle = document.getElementById("svg-circle" + item.id);
  circle.addEventListener("click", function () {
    item.fill = HSLToHex(Math.random() * 360, 100, 50);
  });
}
svgCircles.forEach(changeRandomHue);

function collisionWithWall(circle, wallX, wallY) {
  // On the form circle1 = {radius: 20, x: 5, y: 5, vx: 5, vy: 5};
  if (circle.x <= 0 + circle.radius || circle.x >= wallX - circle.radius) {
    circle.vx = -circle.vx;
  }

  if (circle.y <= 0 + circle.radius || circle.y >= wallY - circle.radius) {
    circle.vy = -circle.vy;
  }
}

function collisionDetection(circle1, circle2) {
  // On the form circle1 = {radius: int, x: int, y: int, ...};

  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.radius + circle2.radius) {
    // collision detected!
  }
}

function drawSVGCircles(item, index, array) {
  let htmlCircle = document.getElementById("svg-circle" + item.id);

  item.x += item.vx * DT;
  item.y += item.vy * DT;

  htmlCircle.setAttribute("cx", item.x.toString());
  htmlCircle.setAttribute("cy", item.y.toString());
  htmlCircle.setAttribute("fill", item.fill);
}
svgCircles.forEach(drawSVGCircles);

function animageSVG() {
  for (let i = 0; i < svgCircles.length; i++) {
    let htmlCircle = document.getElementById("svg-circle" + svgCircles[i].id);

    svgCircles[i].x += svgCircles[i].vx * DT;
    svgCircles[i].y += svgCircles[i].vy * DT;

    collisionWithWall(svgCircles[i], SVG_HEIGHT_WIDTH, SVG_HEIGHT_WIDTH);

    htmlCircle.setAttribute("cx", svgCircles[i].x.toString());
    htmlCircle.setAttribute("cy", svgCircles[i].y.toString());
    htmlCircle.setAttribute("fill", svgCircles[i].fill);
  }
  requestAnimationFrame(animageSVG);
}
animageSVG();

// ---------------------- HTML canvas script --------------------------
const canvas = document.getElementById("canvas-animation");

canvas.width = CANVAS_HEIGHT_WIDTH;
canvas.height = CANVAS_HEIGHT_WIDTH;

const ctx = canvas.getContext("2d");
let canvasCircles = [];

function canvasCirclesInit(canvasCircles) {
  const maxXY = CANVAS_HEIGHT_WIDTH - CANVAS_CIRCLE_RADIUS;
  const minXY = CANVAS_CIRCLE_RADIUS;

  for (let i = 0; i < NUM_CIRCLES; i++) {
    let newCircle = {
      id: i,
      radius: CANVAS_CIRCLE_RADIUS,
      x: Math.floor(Math.random() * (maxXY - minXY + 1) + minXY),
      y: Math.floor(Math.random() * (maxXY - minXY + 1) + minXY),
      vx: -CANVAS_MAX_SPEED + Math.random() * 2 * CANVAS_MAX_SPEED,
      vy: -CANVAS_MAX_SPEED + Math.random() * 2 * CANVAS_MAX_SPEED,
      fill: HSLToHex(Math.random() * 360, 100, 50),
    };
    canvasCircles.push(newCircle);
  }
}
canvasCirclesInit(canvasCircles);

// Draws and animates the circle
function draw() {
  ctx.clearRect(0, 0, CANVAS_HEIGHT_WIDTH, CANVAS_HEIGHT_WIDTH);

  for (let i = 0; i < canvasCircles.length; i++) {
    canvasCircles[i].x += canvasCircles[i].vx * DT;
    canvasCircles[i].y += canvasCircles[i].vy * DT;

    collisionWithWall(
      canvasCircles[i],
      CANVAS_HEIGHT_WIDTH,
      CANVAS_HEIGHT_WIDTH
    );

    ctx.beginPath();
    ctx.fillStyle = canvasCircles[i].fill;
    ctx.arc(
      canvasCircles[i].x,
      canvasCircles[i].y,
      canvasCircles[i].radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

  const clickX = (evt.clientX - rect.left) * scaleX;
  const clickY = (evt.clientY - rect.top) * scaleY;

  for (let i = 0; i < canvasCircles.length; i++) {
    if (
      clickX < canvasCircles[i].x + canvasCircles[i].radius &&
      clickX > canvasCircles[i].x - canvasCircles[i].radius &&
      clickY < canvasCircles[i].y + canvasCircles[i].radius &&
      clickY > canvasCircles[i].y - canvasCircles[i].radius
    ) {
      canvasCircles[i].fill = HSLToHex(Math.random() * 360, 100, 50);
    }
  }
}

canvas.addEventListener("click", function (e) {
  getMousePos(e);
});

// Scaling SVG to parent
window.addEventListener("resize", function () {
  const svgAnimation = this.document.getElementById("svg-animation");
  const w = svgAnimation.parentElement.clientWidth;
  svgAnimation.setAttribute("width", w);
  svgAnimation.setAttribute("height", w);
});

// TODO: Check if there is a better way to solve this
window.onload = function () {
  const svgAnimation = this.document.getElementById("svg-animation");
  const w = svgAnimation.parentElement.clientWidth;
  svgAnimation.setAttribute("width", w);
  svgAnimation.setAttribute("height", w);
};
