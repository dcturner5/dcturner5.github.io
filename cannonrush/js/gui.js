var mousedown = {
	button: 0,
	x: 0,
	y: 0,
	column: 0,
	row: 0
}

var mousemove = {
	x: 0,
	y: 0,
	column: 0,
	row: 0
}

//Mouse Click Detector
canvas.addEventListener("mousedown",function() {
	mousedown.button = event.button;
	mousedown.x = event.x;
	mousedown.y = event.y;
	
    mousedown.x -= canvas.offsetLeft;
    mousedown.y -= canvas.offsetTop;
	
	mousedown.x = Math.floor((mousedown.x / parseInt(canvas.style.width)) * canvas.width);
	mousedown.y = Math.floor((mousedown.y / parseInt(canvas.style.height)) * canvas.height);
	
	mousedown.column = Math.floor(mousedown.x / tile.width);
	mousedown.row = Math.floor(mousedown.y / tile.height);
	
	if(gui.shop.cannon.select || gui.shop.mortar.select || gui.shop.catapult.select || gui.shop.ballista.select) {
		placeTower();
	} else {
		mouseDown();
	}
},false);

function placeTower() {
	if(map.array[mousemove.row][mousemove.column] == tile.grass) {
			
		if(tower.array.length < 1) {
			if(gui.shop.cannon.select && player.money - gui.shop.cannon.value >= 0) {
				gui.shop.cannon.select = false;
				player.money -= gui.shop.cannon.value;
				createTower(tower.cannon.id);
			}
			else if(gui.shop.mortar.select && player.money - gui.shop.mortar.value >= 0) {
				gui.shop.mortar.select = false;
				player.money -= gui.shop.mortar.value;
				createTower(tower.mortar.id);
			}
			else if(gui.shop.catapult.select && player.money - gui.shop.catapult.value >= 0) {
				gui.shop.catapult.select = false;
				player.money -= gui.shop.catapult.value;
				createTower(tower.catapult.id);
			}
			else if(gui.shop.ballista.select && player.money - gui.shop.ballista.value >= 0) {
				gui.shop.ballista.select = false;
				player.money -= gui.shop.ballista.value;
				createTower(tower.ballista.id);
			} else {
				gui.shop.cannon.select = false;
				gui.shop.mortar.select = false;
				gui.shop.catapult.select = false;
				gui.shop.ballista.select = false;
			}
				
			/*Else, Cycle through Towers and Make Sure There is not a Tower in Desired Position*/
		} else {
			if(checkTowers()) {
				/*If Not, Create Tower*/
				if(gui.shop.cannon.select && player.money - gui.shop.cannon.value >= 0) {
					gui.shop.cannon.select = false;
					player.money -= gui.shop.cannon.value;
					createTower(tower.cannon.id);
					return;
				}
				else if(gui.shop.mortar.select && player.money - gui.shop.mortar.value >= 0) {
					gui.shop.mortar.select = false;
					player.money -= gui.shop.mortar.value;
					createTower(tower.mortar.id);
					return;
				}
				else if(gui.shop.catapult.select && player.money - gui.shop.catapult.value >= 0) {
					gui.shop.catapult.select = false;
					player.money -= gui.shop.catapult.value;
					createTower(tower.catapult.id);
					return;
				}
				else if(gui.shop.ballista.select && player.money - gui.shop.ballista.value >= 0) {
					gui.shop.ballista.select = false;
					player.money -= gui.shop.ballista.value;
					createTower(tower.ballista.id);
					return;
				} else {
					gui.shop.cannon.select = false;
					gui.shop.mortar.select = false;
					gui.shop.catapult.select = false;
					gui.shop.ballista.select = false;
					return;
				}
			} else {
				gui.shop.cannon.select = false;
				gui.shop.mortar.select = false;
				gui.shop.catapult.select = false;
				gui.shop.ballista.select = false;
				return;
			}
		}
	} else {
		gui.shop.cannon.select = false;
		gui.shop.mortar.select = false;
		gui.shop.catapult.select = false;
		gui.shop.ballista.select = false;
		return;
	}
	
}

canvas.addEventListener("mousemove",function() {
	mousemove.x = event.x;
	mousemove.y = event.y;
	
    mousemove.x -= canvas.offsetLeft;
    mousemove.y -= canvas.offsetTop;
	
	mousemove.x = Math.floor((mousemove.x / parseInt(canvas.style.width)) * canvas.width);
	mousemove.y = Math.floor((mousemove.y / parseInt(canvas.style.height)) * canvas.height);
	
	mousemove.column = Math.floor(mousemove.x / tile.width);
	mousemove.row = Math.floor(mousemove.y / tile.height);
	
	mouseMove();
},false);

function mouseDown() {
	if(!game.running) {
		game.running = true;
		if(game.gameover) {
			game.gameover = false;
		}
	}
	
	if(mousedown.button == 0) {
		if(getCollision(mousedown, gui.shop.icon)) {
			if(gui.shop.select) {
				gui.shop.select = false;
			}else {
				gui.shop.select = true;
			}
		}
		
		if(gui.shop.select) {
			if(getCollision(mousedown, gui.shop.cannon)) {
				gui.shop.cannon.select = true;
			}
			if(getCollision(mousedown, gui.shop.mortar)) {
				gui.shop.mortar.select = true;
			}
			if(getCollision(mousedown, gui.shop.catapult)) {
				gui.shop.catapult.select = true;
			}
			if(getCollision(mousedown, gui.shop.ballista)) {
				gui.shop.ballista.select = true;
			}
		}
		
		if(getCollision(mousedown, gui.sButton.icon)) {
			if(!game.level.running) {
				startWave();
			}
		}
	}
	if(mousedown.button == 1) {
		for(var i=0; i < tower.array.length; i++) {
			if(tower.array[i].x / tile.width == mousemove.column && tower.array[i].y / tile.height == mousemove.row) {
				switch(tower.array[i].type) {
					case tower.cannon.id: player.money += gui.shop.cannon.value; break;
					case tower.mortar.id: player.money += gui.shop.mortar.value; break;
					case tower.catapult.id: player.money += gui.shop.catapult.value; break;
					case tower.ballista.id: player.money += gui.shop.ballista.value; break;
				}
				tower.array.splice(i, 1);
			}
		}
	}
}

function mouseMove() {
	if(gui.shop.select) {
		if(getCollision(mousemove, gui.shop.cannon)) {
			gui.shop.cannon.hover = true;
		} else {
			gui.shop.cannon.hover = false;
		}
		if(getCollision(mousemove, gui.shop.mortar)) {
			gui.shop.mortar.hover = true;
		} else { 
			gui.shop.mortar.hover = false;
		}
		if(getCollision(mousemove, gui.shop.catapult)) {
			gui.shop.catapult.hover = true;
		} else {
			gui.shop.catapult.hover = false;
		}
		if(getCollision(mousemove, gui.shop.ballista)) {
			gui.shop.ballista.hover = true;
		} else {
			gui.shop.ballista.hover = false;
		}
	}
}

function checkTowers() {
	for(var i=0; i < tower.array.length; i++) {
		if(tower.array[i].x / tile.width == mousemove.column && tower.array[i].y / tile.height == mousemove.row) {
			return false;
		}
	}
	return true;
}

function loadSprites() {
	gui.startscreen.sprite.src = "res/gui/startScreen.png";
	gui.gameover.sprite.src = "res/gui/gameover.png";
	
	tile.sprite.sheet.src = "res/tiles/tileSprite.png";
	
	tower.cannon.sprite.src = "res/entities/cannonSprite.png";
	tower.mortar.sprite.src = "res/entities/mortarSprite.png";
	tower.catapult.sprite.src = "res/entities/catapultSprite.png";
	tower.ballista.sprite.src = "res/entities/ballistaSprite.png";
	enemy.sprite.src = "res/entities/zombiespritesheet.png";
	tower.bullet.sprite.src = "res/entities/bulletSprite.png";
	
	gui.sButton.icon.sprite.src = "res/gui/sButtonIcon.png";
	
	gui.shop.icon.sprite.src = "res/gui/shopIcon.png";
	gui.shop.sprite.src = "res/gui/shopGUI.png";
	gui.shop.cannon.sprite.src = "res/gui/cannonSprite.png";
	gui.shop.mortar.sprite.src = "res/gui/mortarSprite.png";
	gui.shop.catapult.sprite.src = "res/gui/catapultSprite.png";
	gui.shop.ballista.sprite.src = "res/gui/ballistaSprite.png";
}

function renderGui() {
	cxt.fillStyle = "rgba(255,255,255,.3)";
	cxt.fillRect(0, 0, tile.width * 6, tile.height);
	cxt.fillStyle = "black";
	cxt.strokeRect(0, 0, tile.width * 6, tile.height);
	cxt.font = "14px arial black";
	cxt.fillText("Wave: " + game.level.wave, 8, 24);
	cxt.fillText("Gold: " + player.money, tile.width * 3, 24);
	
	if(!gui.shop.select) {
		cxt.drawImage(gui.shop.icon.sprite, gui.shop.icon.x, gui.shop.icon.y, gui.shop.icon.width, gui.shop.icon.height);
	}
	if(gui.shop.select) {
		cxt.drawImage(gui.shop.sprite, gui.shop.x, gui.shop.y, gui.shop.width, gui.shop.height);
		
		cxt.drawImage(gui.shop.cannon.sprite, gui.shop.cannon.x, gui.shop.cannon.y, gui.shop.cannon.width, gui.shop.cannon.height);
		cxt.drawImage(gui.shop.mortar.sprite, gui.shop.mortar.x, gui.shop.mortar.y, gui.shop.mortar.width, gui.shop.mortar.height);
		cxt.drawImage(gui.shop.catapult.sprite, gui.shop.catapult.x, gui.shop.catapult.y, gui.shop.catapult.width, gui.shop.catapult.height);
		cxt.drawImage(gui.shop.ballista.sprite, gui.shop.ballista.x, gui.shop.ballista.y, gui.shop.ballista.width, gui.shop.ballista.height);
	}
	
	if(gui.shop.cannon.select) {
		cxt.drawImage(gui.shop.cannon.sprite, mousemove.x - gui.shop.cannon.width / 2, mousemove.y - gui.shop.cannon.height / 2, gui.shop.cannon.width, gui.shop.cannon.height);
	}
	if(gui.shop.mortar.select) {
		cxt.drawImage(gui.shop.mortar.sprite, mousemove.x - gui.shop.mortar.width / 2, mousemove.y - gui.shop.mortar.height / 2, gui.shop.mortar.width, gui.shop.mortar.height);
	}
	if(gui.shop.catapult.select) {
		cxt.drawImage(gui.shop.catapult.sprite, mousemove.x - gui.shop.catapult.width / 2, mousemove.y - gui.shop.catapult.height / 2, gui.shop.catapult.width, gui.shop.catapult.height);
	}
	if(gui.shop.ballista.select) {
		cxt.drawImage(gui.shop.ballista.sprite, mousemove.x - gui.shop.ballista.width / 2, mousemove.y - gui.shop.ballista.height / 2, gui.shop.ballista.width, gui.shop.ballista.height);
	}
	
	if(gui.shop.cannon.hover) {
		cxt.fillStyle = "rgba(255,255,255,.3)";
		cxt.fillRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.strokeRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.fillStyle = "black";
		cxt.font = "bold 10px arial black";
		cxt.fillText("Cannon", tile.height + 8, tile.height * 2 + 20);
		cxt.fillText("Price: " + gui.shop.cannon.value, tile.height * 3 + 4, tile.height * 2 + 20);
		cxt.fillText("Rate: " + tower.cannon.rate + " s", 3, tile.height * 3 + 20);
		cxt.fillText("Range: " + tower.cannon.range, tile.height * 2 - 8, tile.height * 3 + 20);
		cxt.fillText("Power: " + tower.cannon.damage, tile.height * 3 + 12 , tile.height * 3 + 20);
		cxt.drawImage(gui.shop.cannon.sprite, 0, tile.height * 2, gui.shop.cannon.width, gui.shop.cannon.height);
	}
	if(gui.shop.mortar.hover) {
		cxt.fillStyle = "rgba(255,255,255,.3)";
		cxt.fillRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.strokeRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.fillStyle = "black";
		cxt.font = "bold 10px arial black";
		cxt.fillText("Mortar", tile.height + 8, tile.height * 2 + 20);
		cxt.fillText("Price: " + gui.shop.mortar.value, tile.height * 3 + 4, tile.height * 2 + 20);
		cxt.fillText("Rate: " + tower.mortar.rate + " s", 3, tile.height * 3 + 20);
		cxt.fillText("Range: " + tower.mortar.range, tile.height * 2 - 8, tile.height * 3 + 20);
		cxt.fillText("Power: " + tower.mortar.damage, tile.height * 3 + 12 , tile.height * 3 + 20);
		cxt.drawImage(gui.shop.mortar.sprite, 0, tile.height * 2, gui.shop.mortar.width, gui.shop.mortar.height);
	}
	if(gui.shop.catapult.hover) {
		cxt.fillStyle = "rgba(255,255,255,.3)";
		cxt.fillRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.strokeRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.fillStyle = "black";
		cxt.font = "bold 10px arial black";
		cxt.fillText("Catapult", tile.height + 8, tile.height * 2 + 20);
		cxt.fillText("Price: " + gui.shop.catapult.value, tile.height * 3 + 4, tile.height * 2 + 20);
		cxt.fillText("Rate: " + tower.catapult.rate + " s", 3, tile.height * 3 + 20);
		cxt.fillText("Range: " + tower.catapult.range, tile.height * 2 - 8, tile.height * 3 + 20);
		cxt.fillText("Power: " + tower.catapult.damage, tile.height * 3 + 12 , tile.height * 3 + 20);
		cxt.drawImage(gui.shop.catapult.sprite, 0, tile.height * 2, gui.shop.catapult.width, gui.shop.catapult.height);
	}
	if(gui.shop.ballista.hover) {
		cxt.fillStyle = "rgba(255,255,255,.3)";
		cxt.fillRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.strokeRect(0, tile.height * 2, tile.width * 5, tile.height * 2);
		cxt.fillStyle = "black";
		cxt.font = "bold 10px arial black";
		cxt.fillText("Ballista", tile.height + 8, tile.height * 2 + 20);
		cxt.fillText("Price: " + gui.shop.ballista.value, tile.height * 3 + 4, tile.height * 2 + 20);
		cxt.fillText("Rate: " + tower.ballista.rate + "s", 3, tile.height * 3 + 20);
		cxt.fillText("Range: " + tower.ballista.range, tile.height * 2 - 8, tile.height * 3 + 20);
		cxt.fillText("Power: " + tower.ballista.damage, tile.height * 3 + 12 , tile.height * 3 + 20);
		cxt.drawImage(gui.shop.ballista.sprite, 0, tile.height * 2, gui.shop.ballista.width, gui.shop.ballista.height);
	}
	
	if(!gui.sButton.state) {
		cxt.drawImage(gui.sButton.icon.sprite, gui.sButton.icon.x, gui.sButton.icon.y, gui.sButton.icon.width, gui.sButton.icon.height);
	}
}