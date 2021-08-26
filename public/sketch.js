var socket = io();
var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) || false;
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
let myAccZ = 0;

let vMultiplier = 0.07;
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
  // get accelerometer values
  myAccX = accelerationX;
  myAccY = accelerationY;
	myAccZ = accelerationZ; 
	  
	// // add/subract xpos and ypos
	myPosX = myPosX + myAccX;
	myPosY = myPosY - myAccY;
  
	// wrap ellipse if over bounds
	if(myPosX > windowWidth) { myPosX = 0; }
	if(myPosX < 0) { myPosX = windowWidth; }
	if(myPosY > windowHeight) { myPosY = 0; }
	if(myPosY < 0) { myPosY = windowHeight; }

	emmitAccelerometer(myPosX, myPosY, myAccZ);
	console.log('sendingAccelerometer:', myPosX +',', myPosY + ',', myAccZ);
	fill(255, 0, 0); // red drawing local Acc ellipse
  ellipse(myPosX, myPosY, 40);
}

// accelerometer Data
// window.addEventListener('devicemotion', function(e) 
// {
//   // get accelerometer values
//   myAccX = parseInt(e.accelerationIncludingGravity.x);
//   myAccY = parseInt(e.accelerationIncludingGravity.y);
// 	myAccZ = parseInt(e.accelerationIncludingGravity.z); 
	  
// 	// // add/subract xpos and ypos
// 	myPosX = myPosX + myAccX;
// 	myPosY = myPosY - myAccY;
  
// 	// // wrap ellipse if over bounds
// 	// if(myPosX > windowWidth) { myPosX = 0; }
// 	// if(myPosX < 0) { myPosX = windowWidth; }
// 	// if(myPosY > windowHeight) { myPosY = 0; }
// 	// if(myPosY < 0) { myPosY = windowHeight; }

// 	emmitAccelerometer(myPosX, myPosY, myAccZ);
// 	console.log('sendingAccelerometer:', myPosX +',', myPosY + ',', myAccZ);
// 	fill(255, 0, 0); // red drawing local Acc ellipse
//   ellipse(myPosX, myPosY, 40);
// });

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
  console.log('sendingAccelerometer:', INx +',', INy + ',', INz);
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
