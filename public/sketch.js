var socket = io();

var renderer;

// Position Variables
let myPosX = 0;
let myPosY = 0;

// Speed - Velocity
let myVelX = 0;
let myVelY = 0;

// Acceleration
let myAccX = 0;
let myAccY = 0;

let vMultiplier = 0.007;
let bMultiplier = 0.6;

function setup() 
{
  // IO
	socket.on('accelerometer', ReceivingNewDrawingAcc);
	socket.on('mouse', ReceivingNewDrawingMouse)

	// set canvas size
	renderer = createCanvas(windowWidth, windowHeight);
}

function draw() 
{
  AccBallMove();

  fill(255, 0, 0); // WHITE drawing local Acc ellipse
	ellipse(myPosX, myPosY, 40);

  emmitAccelerometer(myPosX, myPosY, 0);	
}

function AccBallMove() {
  myAccX = acelerationX;
  myAccY = accelerationY;

  myVelX = myVelX + myAccX;
  myVelY = myVelY + myAccY;
  myPosY = myPosY + myVelY * vMultiplier;
  myPosX = myPosX + myVelX * vMultiplier;

  // Bounce when touch the edge of the canvas
  if (myPosX < 0) {
    myPosX = 0;
    myVelX = -myVelX * bMultiplier;
  }
  if (myPosY < 0) {
    myPosY = 0;
    myVelY = -myVelY * bMultiplier;
  }
  if (myPosX > width - 20) {
    myPosX = width - 20;
    myVelX = -myVelX * bMultiplier;
  }
  if (myPosY > height - 20) {
    myPosY = height - 20;
    myVelY = -myVelY * bMultiplier;
  }
}

function emmitAccelerometer (INx, INy, INz)
{
	// IO
	let data = 
	{
		x: INx,
		y: INy,
		z: INz
	}

	socket.emit('accelerometer', data);
  console.log('sendingAccelerometer:', INx +',', INy + ',', 0);
}

function mousePressed()
{
	mouseDragged();
}

function mouseDragged() 
{	
	renderer.canvas.style.display = 'block';
	emmitMouse(mouseX, mouseY);

	fill(255, 255, 0); // yellow drawing local Mouse ellipse20
	ellipse(mouseX, mouseY, 15);
}

function emmitMouse(INx, INy)
{
	let data = 
	{
		x: INx,
		y: INy,
		z: 0
	}
	socket.emit('mouse', data);	
}

function ReceivingNewDrawingAcc(data)
{
	console.log('receivingAcc :', data.x +', ', data.y + ', ', data.z);
	fill(255, 0, 0); // red drawing received Acc ellipse
	ellipse(data.x, data.y, 40);
}

function ReceivingNewDrawingMouse(data)
{
	console.log('receivingMouse :', data.x +', ', data.y);
	fill(0, 255, 255); // cyan drawing received Mouse ellipse
	ellipse(data.x, data.y, 40);
}
