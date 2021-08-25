var socket = io();

var x, y, z;
var xpos, ypos;

function setup() 
{
  // set canvas size
  createCanvas(400, 400);

  // default values
  xpos = 200;
  ypos = 200;
  x = 0;
  y = 0;
}

function draw() 
{
  // set background color to white
  background(255);

  // add/subract xpos and ypos
  xpos = xpos + x;
  ypos = ypos - y;

  // wrap ellipse if over bounds
  if(xpos > 400) { xpos = 0; }
  if(xpos < 0) { xpos = 400; }
  if(ypos > 400) { ypos = 0; }
  if(ypos < 0) { ypos = 400; }

  // draw ellipse
  fill(255, 0, 0);
  ellipse(xpos, ypos, 25, 25);

  // display variables
  fill(0);
  noStroke();
  text("x: " + x, 25, 25);
  text("y: " + y, 25, 50);
  text("z: " + z, 25, 75);
  var data = 
  {
    posX: xpos,
    posY: ypos
  };

  // Send that object to the socket
  socket.emit('mobileData', data);

  socket.on('mobileData',  (msg) => 
  {
    fill(255,0,0);
    ellipse(msg.posX, msg.posY, 30, 30);
  });

}

// accelerometer Data
window.addEventListener('devicemotion', function(e) 
{
  // get accelerometer values
  x = parseInt(e.accelerationIncludingGravity.x);
  y = parseInt(e.accelerationIncludingGravity.y);
  z = parseInt(e.accelerationIncludingGravity.z); 
});

