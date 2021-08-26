var socket = io();

var renderer;

var AccX, AccY, AccZ;
var xpos = 200;
var ypos = 200;
var zpos = 0;
var acc = true;

function setup() 
{
  // IO
	socket.on('accelerometer', ReceivingNewDrawingAcc);
	socket.on('mouse', ReceivingNewDrawingMouse)

	// set canvas size
	renderer = createCanvas(windowWidth, windowHeight);

	// default values
	xpos = 200;
	ypos = 200;
	zpos = 0;
	AccX = 0;
	AccY = 0;
	AccZ = 0;
}

function draw() 
{

}

function displayDotAccelerometer(xx, yy, zz)
{
	
	if(xx > windowWidth) {xx = xx % windowWidth; }
	if(xx < 0) { xx = windowWidth - ((-1 * xx) % windowWidth); }
	if(yy > windowHeight) { yy = yy % windowHeight; }
	if(yy < 0) { yy = windowHeight - ((-1 * yy) % windowHeight); }
	
	// draw ellipse
	ellipse(xx, yy, 40);
}

function displayDotMouse(x, y)
{
	ellipse(x, y, 15);
}

// accelerometer Data
window.addEventListener('devicemotion', function(e) 
{
  	// get accelerometer values
  	AccX = parseInt(e.accelerationIncludingGravity.x);
  	AccY = parseInt(e.accelerationIncludingGravity.y);
	  AccZ = parseInt(e.accelerationIncludingGravity.z); 
	  
	// // add/subract xpos and ypos
	xpos = xpos + AccX;
	ypos = ypos - AccY;

	emmitAccelerometer(xpos, ypos, zpos);
	console.log('sendingAccelerometer:', AccX +',', AccY + ',', AccZ);
	fill(255, 255, 255); // WHITE drawing local Acc ellipse
	displayDotAccelerometer(xpos, ypos, zpos);
});

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
}

function mousePressed()
{
	mouseDragged();
}

function mouseDragged() 
{	
	renderer.canvas.style.display = 'block';

	emmitMouse(mouseX, mouseY);
	console.log('sendingMouse:', mouseX +',', mouseY);
	fill(255, 255, 0); // yellow drawing local Mouse ellipse20
	displayDotMouse(mouseX, mouseY);
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
	displayDotAccelerometer(data.x, data.y, data.z);
}

function ReceivingNewDrawingMouse(data)
{
	console.log('receivingMouse :', data.x +', ', data.y);
	fill(0, 255, 255); // cyan drawing received Mouse ellipse
	displayDotMouse(data.x, data.y);
}
