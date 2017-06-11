//Graphics Context
var canvas = document.getElementById("Canvas");
var cxt = canvas.getContext("2d");

/*Global Game Object*/
var game = {
	running: false,
	
	ups: 60,
	fps: 0,
	
	alpha: 0,
	
	highscore: 0,
	
	sprites: new Image()
}

/*Global Player Object*/
var player = {
	x: canvas.width / 2 - 96,
	y: canvas.height / 2 - 32,
	
	width: 17 * 4,
	height: 12 * 4,
	
	velocity: 0,
	gravity: .5,
	
	angle: 0,
	
	score: 0,
	
	animation: {
		frames: 0,
		max: 10,
		index: 0
	}
}

/*Global Pipe Object*/
var pipe = {
	array: new Array(),
	velocity: 2
}

//Detect Mouse Click
canvas.addEventListener("mousedown",function() {
	
	/*If User Clicks the Screen and the Game Isn't Running, Then Start the Game*/
	if(!game.running) {
		game.running = true;
	}
	
	/*If User Clicks the Screen, Set Player Velocity to 10*/
	player.velocity = 10;
	
},false);

/*Update Function Updates the Game 60 Times a Second*/
function update() {
	
	/*Update Player Animation*/
	if(player.animation.frames < player.animation.max) {
		player.animation.frames += 1;
	} else{
		player.animation.frames = 0;
		if(player.animation.index < 3) {
			player.animation.index += 1;
		} else{ 
			player.animation.index = 0;
		}
	}
	
	/*Update Player Angle*/
	if(!game.running) {
		player.angle = 0;
	} else if(player.velocity > 0 && player.angle > -60) {
		if(player.angle > 0) {
			player.angle -=4;
		} else{
			player.angle  -= 3;
		}
	} else if(player.velocity < 0 && player.angle < 80) {
		if(player.angle < 0) {
			player.angle += 4;
		} else{
			player.angle += 3;
		}
	}
	
	/*If the Game Isn't Running Exit Update Function*/
	if(!game.running) {
		return;
	}
	
	/*If Player Hits the Ground, Then Game Over*/
	if(player.y + player.height > (canvas.height/8) * 6.5) {
		gameover();
	}
	
	/*Move Player Up or Down According to Player Velocity*/
	if(player.y - player.velocity > -8 && player.y + player.height < (canvas.height/8) * 6.5) {
		player.y -= player.velocity;
	}
	
	/*Player Gravity Reduces Player Velocity*/
	if(player.velocity > -20) {	
		player.velocity -= player.gravity;
	}
	
	/*For Every Pipe, Do the Following*/
	for(var i=0; i<pipe.array.length; i++) {
		
		/*If Pipe is Off Screen, Then Delete the Pipe*/
		if(pipe.array[i].top.x < pipe.array[i].top.width * -1) {
			pipe.array.splice(i,1);
		}
		
		/*If Player Passes the Middle of the Pipe, Add 1 to Player Score*/
		if(pipe.array[i].top.x + (pipe.array[i].top.width / 4) == player.x) {
			player.score += 1;
		}
		
		/*If Player Touches the Top or Bottom Pipe, Then Game Over*/
		if(rectCollision(player, pipe.array[i].top) || rectCollision(player, pipe.array[i].bottom)) {
			gameover();
		}
		
		/*Try to Update or Create a New Pipe*/
		try {
			
			/*If Current Pipe is Almost Off the Screen, Then Create a New Pipe*/
			if(pipe.array[i].top.x == 0 + (pipe.array[i].top.width * 3)) {
				createPipe();
			}
			
			/*Move Top and Bottom Pipes According to it's X-axis Velocity*/
			pipe.array[i].top.x -= pipe.velocity;
			pipe.array[i].bottom.x -= pipe.velocity;
		}
		/*If an Error Occurs, Exit Update Function*/
		catch(err) {
			return;
		}
	}
	
}

/*createPipe Function Creates and Initializes a New Pipe*/
function createPipe() {
	/*Get Integer 1 Through 3*/
	var type = getRandomInt(1, 3);
	
	/*Add a New Pipe to the "pipe.array" Array*/
	pipe.array.push({
		/*Variables for the Top Half*/
		top: {
			x: canvas.width + 96,
			y: (-1 * (135 * 5)) + (96 * type),
			width: 96,
			height: 135 * 5
		},
		/*Variables for the Bottom Half*/
		bottom: {
			x: canvas.width + 96,
			y: 96 * type + 192,
			width: 96,
			height: 120 * 5
		}
	});
}

/*Generate a Random Integer*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Collision Detection*/
function rectCollision(firstEntity,secondEntity) {
    if (firstEntity.x >= secondEntity.x - firstEntity.width && firstEntity.x <= secondEntity.x + secondEntity.width &&
            firstEntity.y >= secondEntity.y - firstEntity.height && firstEntity.y <= secondEntity.y + secondEntity.height) {
        return true;
    }else {
        return false;
    }
}

/*Render Function Draws Game Sprites About 60 Times a Second*/
function render() {	

	/*Clear Screen*/
	cxt.clearRect(0, 0, canvas.width, canvas.height);
	
	/*Render Background*/
	cxt.drawImage(game.sprites, 0, 0, 143, 256, 0, 0, canvas.width, canvas.height);
	
	/*Render All Pipes*/
	for(var i=0; i<pipe.array.length; i++) {
		cxt.drawImage(game.sprites, 302, 0, 26, 135, pipe.array[i].top.x, pipe.array[i].top.y, pipe.array[i].top.width, pipe.array[i].top.height);
		cxt.drawImage(game.sprites, 330, 0, 26, 120, pipe.array[i].bottom.x, pipe.array[i].bottom.y, pipe.array[i].bottom.width, pipe.array[i].bottom.height);
	}
	
	/*Render Floor*/
		cxt.drawImage(game.sprites, 146, 0, 299 - 146, 55, 0, (canvas.height/8) * 6.5, canvas.width, 55 * 5);
		
	/*Render Player*/
	cxt.save();
	cxt.translate(player.x + player.width/2, player.y + player.height/2);
	cxt.rotate(player.angle*(Math.PI/180));
	switch(player.animation.index) {
		case 0: cxt.drawImage(game.sprites, 264, 64, 17, 12, -1 * (player.width/2), -1 * (player.height/2), player.width, player.height); break;
		case 1: cxt.drawImage(game.sprites, 264, 90, 17, 12, -1 * (player.width/2), -1 * (player.height/2), player.width, player.height); break;
		case 2: cxt.drawImage(game.sprites, 223, 124, 17, 12,  -1 * (player.width/2), -1 * (player.height/2), player.width, player.height); break;
		case 3: cxt.drawImage(game.sprites, 264, 90, 17, 12, -1 * (player.width/2), -1 * (player.height/2), player.width, player.height); break;
	}
	cxt.restore();
	
	
	/*Render Score, Game Over, and High Score*/
	cxt.font="30px Arial";
	cxt.fillText(player.score,canvas.width/2 - 16,100);
	
	if(game.alpha > 0) {
		cxt.fillStyle = "rgba(0, 0, 0, " + game.alpha + ")";
		cxt.fillText("Game Over", canvas.width/2 - 84, 300);
		cxt.fillText("High Score: " + game.highscore, canvas.width/2 - 96, 340);
		game.alpha -=.01;
	}
	cxt.fillStyle = "black";
	
	/*Call Render Function Again*/
	requestAnimationFrame(render);
	
}

/*Gameover Function Resets Variables and Ends Current Game*/
function gameover() {
	if(player.score > game.highscore) {
		game.highscore = player.score;
	}
	
	player.score = 0;
	game.alpha = 1;
	player.angle = 0;
	player.y = canvas.height / 2 - 32;
	player.velocity = 0;
	pipe.array = [];
	createPipe();
	game.running = false;
}

/*Initialize Game*/
function init() {
	/*Resize Screen, Load Sprites, and Create the First Pipe*/
	resize();
	game.sprites.src = "res/spritesheet.png";
	createPipe();
	
	/*Start Game Loops*/
	var UpdateLoop = setInterval(function() {update();},1000/game.ups);
    var RenderLoop = requestAnimationFrame(render);
    /*var FPSCounter = setInterval(function() {game.FPS=game.frames;game.frames=0;},1000);*/
}

/*Resize Game to Fit Screen*/
function resize() {
	canvas.width = 480;
	canvas.height = 800;
	
	canvas.style.height = window.innerHeight - 32 + "px";
	canvas.style.width = ((window.innerHeight - 32) / canvas.height) * canvas.width + "px";
}