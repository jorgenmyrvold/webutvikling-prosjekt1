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

let requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

function createSVGCircles() {
  const svgWrapper = document.getElementById("svg-animation");
  const newCircle = document.createElement("circle");
  newCircle.setAttribute("id", "svg-circle");
  newCircle.setAttribute("cx", "20");
  newCircle.setAttribute("cy", "20");
  newCircle.setAttribute("r", "5");
  svgWrapper.append(newCircle);
}
createSVGCircles();

let svgCircle = document.getElementById("svg-circle");
let svgCircles = [];
let randomHue = 180;
let posAngle = 0;

svgCircle.addEventListener("click", function () {
  randomHue = Math.random() * 360;
});

function animageSVG() {
  let svgAnimation = document.getElementById("svg-animation");
  let svgCircle = document.getElementById("svg-circle");
  svgAnimation.style.fill = HSLToHex(randomHue, 100, 50);

  posAngle += Math.PI / 100;
  //svgCircle.setAttribute("cx", 50 + Math.cos(posAngle) * 25);
  //svgCircle.setAttribute("cy", 50 + Math.sin(posAngle) * 25);

  requestAnimationFrame(animageSVG);
}
animageSVG();

// HTML canvas script
const CANVAS_WIDTH_HEIGHT = 1000;
const canvas = document.getElementById("canvas-animation");

canvas.width = CANVAS_WIDTH_HEIGHT;
canvas.height = CANVAS_WIDTH_HEIGHT;

const ctx = canvas.getContext("2d");

let fillColor = "hsl(180, 100%, 50%)";
let radiusAngle = 0;

// Draws and animates the circle
function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT);
  ctx.fillStyle = fillColor;

  radiusAngle += Math.PI / 70; // Alter this to alter speed of animation
  let radius = 150 + Math.cos(radiusAngle) * 100;
  let posX =
    CANVAS_WIDTH_HEIGHT / 2 + (Math.cos(posAngle) * CANVAS_WIDTH_HEIGHT) / 4;
  let posY =
    CANVAS_WIDTH_HEIGHT / 2 + (Math.sin(posAngle) * CANVAS_WIDTH_HEIGHT) / 4;

  ctx.beginPath();
  ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fill();
  requestAnimationFrame(draw);
}
draw();

// Changes color of the circle on the canvas when clicked
canvas.addEventListener("click", function () {
  fillColor = "hsl(" + Math.random() * 360 + ", 100%, 50%)";
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
