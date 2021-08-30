
var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);

//////////////////////////

//var socket = io();

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

let hasSensorPermission = !(DeviceOrientationEvent.requestPermission || DeviceMotionEvent.requestPermission);

function begPermission(){
  if (DeviceOrientationEvent.requestPermission){
    DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        if (DeviceMotionEvent.requestPermission){
          DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response == 'granted') {
              hasSensorPermission = true;
            }
          })
          .catch(alert)
        }
      }
    })
    .catch(alert)
  }
}

function touchEnded() {
  if (!hasSensorPermission){
    begPermission();
  }
}


// IO
ws.onmessage = function (event) 
{
		//var stringyfiedMsg = JSON.stringify(event);
		var parsedMsg = JSON.parse(event.data);
		console.log('received from server, parsed : ', parsedMsg);
		console.log('received from server, raw : %s', event);
		//console.log('received from server str : %s', stringyfiedMsg);


		switch(parsedMsg.type) {
			case "accelerometer":
				var newX = parsedMsg.accX;
				var newY = parsedMsg.accY;
				var newZ = parsedMsg.accZ;
				ReceivingNewDrawingAcc(newX, newY, newZ);
				break;
			case "mouse":
				var newX = parsedMsg.mX;
				var newY = parsedMsg.mY;
				ReceivingNewDrawingMouse(newX, newY);
				break;
		}
	
   

};

// Envoi d'un texte à tous les utilisateurs à travers le serveur
function sendAcc(INx, INy, INz) 
{
	// Création d'un objet msg qui contient les données
	// dont le serveur a besoin pour traiter le message
	var msg = 
	{
	  type: "accelerometer",
	  accX: INx,
	  accY:	INy,
	  accZ:	INz
	};
  
	// Envoi de l'objet msg à travers une chaîne formatée en JSON
	ws.send(JSON.stringify(msg));
}

// Envoi d'un texte à tous les utilisateurs à travers le serveur
function sendMouse(INx, INy) 
{
	// Création d'un objet msg qui contient les données
	// dont le serveur a besoin pour traiter le message
	var msg = 
	{
	  type: "mouse",
	  mX:	INx,
	  mY:	INy
	};
  
	// Envoi de l'objet msg à travers une chaîne formatée en JSON
	ws.send(JSON.stringify(msg));
}

function setup() 
{
	// set canvas size
	renderer = createCanvas(windowWidth, windowHeight);
}

function draw() 
{
  if (hasSensorPermission){
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

	sendAcc(myPosX, myPosY, myAccZ);
	
	//console.log('sendingAccelerometer:', myPosX +',', myPosY + ',', myAccZ);
	fill(255, 0, 0); // red drawing local Acc ellipse
  	ellipse(myPosX, myPosY, 40);
  }
  
}

function mousePressed()
{
	mouseDragged();
}

function mouseDragged() 
{	
	renderer.canvas.style.display = 'block';
	sendMouse(mouseX, mouseY);

	fill(255, 255, 0); // yellow drawing local Mouse ellipse20
	ellipse(mouseX, mouseY, 15);
}

function ReceivingNewDrawingAcc(INx, INy, INz)
{
	console.log('receivingAcc :', INx +', ', INy + ', ', INz);
	fill(0, 0, 255); // blue drawing received Acc ellipse
	ellipse(INx, INy, 40);
}

function ReceivingNewDrawingMouse(INx, INy)
{
	console.log('receivingMouse :', INx +', ', INy);
	fill(0, 255, 255); // cyan drawing received Mouse ellipse
	ellipse(INx, INy, 40);
}
