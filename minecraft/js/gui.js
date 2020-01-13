
canvas.addEventListener("mousedown",function() {
	mouseup.x = null;
	mouseup.y = null;

	mousedown.x = event.x;
	mousedown.y = event.y;
	mousedown.button = event.button;
	
    mousedown.x -= canvas.offsetLeft;
    mousedown.y -= canvas.offsetTop;
	
	mousedown.x = Math.floor((mousedown.x / parseInt(canvas.style.width)) * canvas.width);
	mousedown.y = Math.floor((mousedown.y / parseInt(canvas.style.height)) * canvas.height);
	
	mousedown.column = Math.floor((-1 * map.x + mousedown.x) / tile.width);
	mousedown.row = Math.floor((-1 * map.y + mousedown.y) / tile.height);
	
	if(!gui.inv.state) {
		if(mousedown.button == 0) {
			if(player.array[0].tile.cur == null && getTileInfo(map.array[mousedown.row][mousedown.column]).breakable) { 
				player.array[0].tile.cur = getTileObject(mousedown.column, mousedown.row);
				player.array[0].tile.percent = 0;
			}
		}
		if(mousedown.button == 2) {
			//Repeater State
			if(map.array[mousedown.row][mousedown.column] >= tile.left_repeater1 && map.array[mousedown.row][mousedown.column] <= tile.right_repeater4) {
				if(map.array[mousedown.row][mousedown.column] == tile.right_repeater4) {
					map.array[mousedown.row][mousedown.column] = tile.left_repeater1;
				} else {
					map.array[mousedown.row][mousedown.column] += 1;
				}
				deletePower(mousedown.row,mousedown.column);
			}
			if(map.array[mousedown.row][mousedown.column] >= tile.flat_redtorch && map.array[mousedown.row][mousedown.column] <= tile.right_redtorch) {
				if(map.array[mousedown.row][mousedown.column] == tile.right_redtorch) {
					map.array[mousedown.row][mousedown.column] = tile.flat_redtorch;
				} else {
					map.array[mousedown.row][mousedown.column] += 1;
				}
				deletePower(mousedown.row,mousedown.column);
			}
			
			
			
			if(map.array[mousedown.row][mousedown.column] == tile.craft) {
				gui.inv.state = true;
				gui.craft3.state = true;
				for(var i=0; i<tile.entity.craft.array.length; i++) {
					if(tile.entity.craft.array[i].x == mousedown.column * tile.width && tile.entity.craft.array[i].y == mousedown.row * tile.height) {
						gui.craft3.open = tile.entity.craft.array[i];
					}
				}
			}
			if(map.array[mousedown.row][mousedown.column] == tile.chest) {
				gui.inv.state = true;
				gui.chest.state = true;
				for(var i=0; i<tile.entity.chest.array.length; i++) {
					if(tile.entity.chest.array[i].x == mousedown.column * tile.width && tile.entity.chest.array[i].y == mousedown.row * tile.height) {
						gui.chest.open = tile.entity.chest.array[i];
					}
				}
			}
			if(map.array[mousedown.row][mousedown.column] == tile.furnace) {
				gui.inv.state = true;
				gui.furnace.state = true;
				for(var i=0; i<tile.entity.furnace.array.length; i++) {
					if(tile.entity.furnace.array[i].x == mousedown.column * tile.width && tile.entity.furnace.array[i].y == mousedown.row * tile.height) {
						gui.furnace.open = tile.entity.furnace.array[i];
					}
				}
			}
			if(map.array[mousedown.row][mousedown.column] <= tile.water + 1) {
				if(getTileInfo(gui.bar.array[gui.bar.selected].type).placeable) { 
					
					if(gui.bar.array[gui.bar.selected].type == tile.craft) {
						createTileEntity(tile.craft,mousedown.row,mousedown.column);
					}
					if(gui.bar.array[gui.bar.selected].type == tile.chest) {
						createTileEntity(tile.chest,mousedown.row,mousedown.column);
					}
					if(gui.bar.array[gui.bar.selected].type == tile.furnace) {
						createTileEntity(tile.furnace,mousedown.row,mousedown.column);
					}
				
					map.array[mousedown.row][mousedown.column] = gui.bar.array[gui.bar.selected].type;
					
					if(gui.bar.array[gui.bar.selected].type == tile.redwire) {
						if(getTileInfo(map.array[mousedown.row+1][mousedown.column]).solid) {
							map.array[mousedown.row][mousedown.column] = tile.flat_redwire;
						} else {
							gui.bar.array[gui.bar.selected].amt += 1;
							map.array[mousedown.row][mousedown.column] = tile.air;
						}
					}
					if(gui.bar.array[gui.bar.selected].type == tile.flat_redtorch) {
						if(getTileInfo(map.array[mousedown.row+1][mousedown.column]).solid || getTileInfo(map.array[mousedown.row][mousedown.column-1]).solid || getTileInfo(map.array[mousedown.row][mousedown.column+1]).solid) {
							map.array[mousedown.row][mousedown.column] = tile.flat_redtorch;
						} else {
							gui.bar.array[gui.bar.selected].amt += 1;
							map.array[mousedown.row][mousedown.column] = tile.air;
						}
					}
					if(gui.bar.array[gui.bar.selected].type == tile.left_repeater1) {
						if(getTileInfo(map.array[mousedown.row+1][mousedown.column]).solid) {
							map.array[mousedown.row][mousedown.column] = tile.left_repeater1;
						} else {
							gui.bar.array[gui.bar.selected].amt += 1;
							map.array[mousedown.row][mousedown.column] = tile.air;
						}
					}
					
					gui.bar.array[gui.bar.selected].amt -= 1;
					if(gui.bar.array[gui.bar.selected].amt < 1) {
						gui.bar.array[gui.bar.selected].type = tile.air;
						gui.bar.array[gui.bar.selected].amt = 0;
					}
				}
			}
		}
	}
	
},false);

//Mouse Up Detector
canvas.addEventListener("mouseup",function() {
	gui.select.ready = true;
	mousedown.x = null;
	mousedown.y = null;
	
	mouseup.x = event.x;
	mouseup.y = event.y;
	mouseup.button = event.button;
	
    mouseup.x -= canvas.offsetLeft;
    mouseup.y -= canvas.offsetTop;
	
	mouseup.x = Math.floor((mouseup.x / parseInt(canvas.style.width)) * canvas.width);
	mouseup.y = Math.floor((mouseup.y / parseInt(canvas.style.height)) * canvas.height);
	
	mouseup.column = Math.floor((-1 * map.x + mouseup.x) / tile.width);
	mouseup.row = Math.floor((-1 * map.y + mouseup.y) / tile.height);
	
	if(player.array[0].tile.cur != null) {
		player.array[0].tile.cur = null;
		player.array[0].tile.percent = 0;
	}
},false);

//Mouse Move Detector
canvas.addEventListener("mousemove",function() {
	mousemove.x = event.x;
	mousemove.y = event.y;
	
    mousemove.x -= canvas.offsetLeft;
    mousemove.y -= canvas.offsetTop;
	
	mousemove.x = Math.floor((mousemove.x / parseInt(canvas.style.width)) * canvas.width);
	mousemove.y = Math.floor((mousemove.y / parseInt(canvas.style.height)) * canvas.height);
	
	mousemove.column = Math.floor((-1 * map.x + mousemove.x) / tile.width);
	mousemove.row = Math.floor((-1 * map.y + mousemove.y) / tile.height);
},false);

canvas.addEventListener("mousewheel",function() {
	if(event.wheelDeltaY < 0) {
		if(gui.bar.selected < 8) {
			gui.bar.selected += 1;
		} else {
			gui.bar.selected = 0;
		}
	}
	if(event.wheelDeltaY > 0) {
		if(gui.bar.selected > 0) {
			gui.bar.selected -= 1;
		} else {
			gui.bar.selected = 8;
		}
	}
},false);

//Key Listener
var keys = [];
window.addEventListener("keydown",function(e) {
    keys[e.keyCode] = true;
},false);
window.addEventListener("keyup",function(e) {
	if(e.keyCode == 69) {
		gui.inv.ready = true;
	}
	if(e.keyCode == 81) {
		gui.bar.ready = true;
	}
    delete keys[e.keyCode];
},false);



function updateGui() {
    if(keys[49]) gui.bar.selected = 0;
    if(keys[50]) gui.bar.selected = 1;
    if(keys[51]) gui.bar.selected = 2;
    if(keys[52]) gui.bar.selected = 3;
    if(keys[53]) gui.bar.selected = 4;
    if(keys[54]) gui.bar.selected = 5;
    if(keys[55]) gui.bar.selected = 6;
    if(keys[56]) gui.bar.selected = 7;
    if(keys[57]) gui.bar.selected = 8;

	if(keys[69]) {
		if(!gui.inv.state && gui.inv.ready) {
			gui.inv.ready = false;
			gui.inv.state = true;
			gui.craft2.state = true;
		}
		if(gui.inv.state && gui.inv.ready) {
			gui.inv.ready = false;
			gui.inv.state = false;
			gui.craft2.state = false;
			gui.craft3.state = false;
			gui.craft3.open = {};
			gui.chest.state = false;
			gui.chest.open = {};
			gui.furnace.state = false;
			gui.furnace.open = {};
		}
	}
	
	if(keys[81] && gui.bar.ready) {
		gui.bar.ready = false;
		var p = player.array[0];
		var g = gui.bar.array[gui.bar.selected];
		if(g.type != tile.air) {
			createItem(g.type, getTileObject(p.col - 2, p.row));
			g.amt -= 1;
			if(g.amt < 1) {
				g.type = tile.air;
				g.amt = 0;
			}
		}	
	}
	
	if(keys[27]) {
		gui.inv.state = false;
		gui.craft2.state = false;
		gui.craft3.state = false;
		gui.craft3.open = {};
		gui.chest.state = false;
		gui.chest.open = false;
		gui.furnace.state = false;
		gui.furnace.open = {};
	}
	
	var s = gui.select;
	if(gui.inv.state) {
	
		if(gui.craft2.state) {
			for(var i=0; i<gui.craft2.array.length; i++) {
				var g = gui.craft2.array[i];
				var info = getTileInfo(g.type);
				if(!s.state && s.ready) {
					if(getCollision(g,mousedown) && g.type != tile.air) {
						s.state = true;
						s.ready = false;
						s.origin = g;
						s.type = g.type;
						s.amt = g.amt;
						g.type = tile.air;
						g.amt = 0;
						if(i == gui.craft2.array.length - 1) {
							for(var j=0; j<gui.craft2.array.length-1; j++) {
								var g = gui.craft2.array[j];
								g.amt -= 1;
								if(g.amt < 1) {
									g.type = tile.air;
									g.amt = 0;
								}
							}
						}
					}
				}
				if(s.state && s.ready) {
					if(getCollision(g,mousedown) && i != gui.craft2.array.length - 1) {
						if(mousedown.button == 0) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += s.amt;
								if(g.amt <= info.stack) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								if(g.amt > info.stack) {
									s.amt = g.amt - info.stack;
									g.amt = info.stack;
								}
								s.ready = false;
							}
						}
						if(mousedown.button == 2) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += 1;
								s.amt -= 1;
								if(g.amt > info.stack) {
									s.amt += 1;
									g.amt = info.stack;
								}
								if(s.amt < 1) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								s.ready = false;
							}
						}
					}
				}
			}
			gui.craft2.array[4].type = updateRecipe(gui.craft2.array).output;
			gui.craft2.array[4].amt = updateRecipe(gui.craft2.array).amt;
		}
		
		if(gui.craft3.state) {
			for(var i=0; i<gui.craft3.open.array.length; i++) {
				var g = gui.craft3.open.array[i];
				var info = getTileInfo(g.type);
				if(!s.state && s.ready) {
					if(getCollision(g,mousedown) && g.type != tile.air) {
						s.state = true;
						s.ready = false;
						s.origin = g;
						s.type = g.type;
						s.amt = g.amt;
						g.type = tile.air;
						g.amt = 0;
						if(i == gui.craft3.open.array.length - 1) {
							for(var j=0; j<gui.craft3.open.array.length-1; j++) {
								var g = gui.craft3.open.array[j];
								g.amt -= 1;
								if(g.amt < 1) {
									g.type = tile.air;
									g.amt = 0;
								}
							}
						}
					}
				}
				if(s.state && s.ready) {
					if(getCollision(g,mousedown) && i != gui.craft3.open.array.length - 1) {
						if(mousedown.button == 0) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += s.amt;
								if(g.amt <= info.stack) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								if(g.amt > info.stack) {
									s.amt = g.amt - info.stack;
									g.amt = info.stack;
								}
								s.ready = false;
							}
						}
						if(mousedown.button == 2) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += 1;
								s.amt -= 1;
								if(g.amt > info.stack) {
									s.amt += 1;
									g.amt = info.stack;
								}
								if(s.amt < 1) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								s.ready = false;
							}
						}
					}
				}
			}
			gui.craft3.open.array[9].type = updateRecipe(gui.craft3.open.array).output;
			gui.craft3.open.array[9].amt = updateRecipe(gui.craft3.open.array).amt;
		}
		
		if(gui.chest.state) {
			for(var i=0; i<gui.chest.open.array.length; i++) {
				var g = gui.chest.open.array[i];
				var info = getTileInfo(g.type);
				if(!s.state && s.ready) {
					if(getCollision(g,mousedown) && g.type != tile.air) {
						s.state = true;
						s.ready = false;
						s.origin = g;
						s.type = g.type;
						s.amt = g.amt;
						g.type = tile.air;
						g.amt = 0;
					}
				}
				if(s.state && s.ready) {
					if(getCollision(g,mousedown)) {
						if(mousedown.button == 0) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += s.amt;
								if(g.amt <= info.stack) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								if(g.amt > info.stack) {
									s.amt = g.amt - info.stack;
									g.amt = info.stack;
								}
								s.ready = false;
							}
						}
						if(mousedown.button == 2) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += 1;
								s.amt -= 1;
								if(g.amt > info.stack) {
									s.amt += 1;
									g.amt = info.stack;
								}
								if(s.amt < 1) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								s.ready = false;
							}
						}
					}
				}
			}
		}
		
		if(gui.furnace.state) {
			
			for(var i=0; i<gui.furnace.open.array.length; i++) {
				var g = gui.furnace.open.array[i];
				var info = getTileInfo(g.type);
				if(!s.state && s.ready) {
					if(getCollision(g,mousedown) && g.type != tile.air) {
						s.state = true;
						s.ready = false;
						s.origin = g;
						s.type = g.type;
						s.amt = g.amt;
						g.type = tile.air;
						g.amt = 0;
					}
				}
				if(s.state && s.ready) {
					if(getCollision(g,mousedown) && i != gui.furnace.open.array.length - 1) {
						if(mousedown.button == 0) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += s.amt;
								if(g.amt <= info.stack) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								if(g.amt > info.stack) {
									s.amt = g.amt - info.stack;
									g.amt = info.stack;
								}
								s.ready = false;
							}
						}
						if(mousedown.button == 2) {
							if(g.type == tile.air || g.type == s.type) {
								g.type = s.type;
								g.amt += 1;
								s.amt -= 1;
								if(g.amt > info.stack) {
									s.amt += 1;
									g.amt = info.stack;
								}
								if(s.amt < 1) {
									s.state = false;
									s.origin = null;
									s.type = tile.air;
									s.amt = 0;
								}
								s.ready = false;
							}
						}
					}
				}
			}
		}
		
		for(var i=0; i<gui.inv.array.length; i++) {
			var g = gui.inv.array[i];
			var info = getTileInfo(g.type);
			if(!s.state && s.ready) {
				if(getCollision(g,mousedown) && g.type != tile.air) {
					s.state = true;
					s.ready = false;
					s.origin = g;
					s.type = g.type;
					s.amt = g.amt;
					g.type = tile.air;
					g.amt = 0;
				}
			}
			if(s.state && s.ready) {
				if(getCollision(g,mousedown)) {
					if(mousedown.button == 0) {
						if(g.type == tile.air || g.type == s.type) {
							g.type = s.type;
							g.amt += s.amt;
							if(g.amt <= info.stack) {
								s.state = false;
								s.origin = null;
								s.type = tile.air;
								s.amt = 0;
							}
							if(g.amt > info.stack) {
								s.amt = g.amt - info.stack;
								g.amt = info.stack;
							}
							s.ready = false;
						}
					}
					if(mousedown.button == 2) {
						if(g.type == tile.air || g.type == s.type) {
							g.type = s.type;
							g.amt += 1;
							s.amt -= 1;
							if(g.amt > info.stack) {
								s.amt += 1;
								g.amt = info.stack;
							}
							if(s.amt < 1) {
								s.state = false;
								s.origin = null;
								s.type = tile.air;
								s.amt = 0;
							}
							s.ready = false;
						}
					}
				}
			}
		}
		
		for(var i=0; i<gui.bar.array.length; i++) {
			var g = gui.bar.array[i];
			var info = getTileInfo(g.type);
			var s = gui.select;
			if(!s.state && s.ready) {
				if(getCollision(g,mousedown) && g.type != tile.air) {
					s.state = true;
					s.ready = false;
					s.origin = g;
					s.type = g.type;
					s.amt = g.amt;
					g.type = tile.air;
					g.amt = 0;
				}
			}
			if(s.state && s.ready) {
				if(getCollision(g,mousedown)) {
					if(mousedown.button == 0) {
						if(g.type == tile.air || g.type == s.type) {
							g.type = s.type;
							g.amt += s.amt;
							if(g.amt <= info.stack) {
								s.state = false;
								s.origin = null;
								s.type = tile.air;
								s.amt = 0;
							}
							if(g.amt > info.stack) {
								s.amt = g.amt - info.stack;
								g.amt = info.stack;
							}
							s.ready = false;
						}
					}
					
					if(mousedown.button == 2) {
						if(g.type == tile.air || g.type == s.type) {
							g.type = s.type;
							g.amt += 1;
							s.amt -= 1;
							if(g.amt > info.stack) {
								s.amt += 1;
								g.amt = info.stack;
							}
							if(s.amt < 1) {
								s.state = false;
								s.origin = null;
								s.type = tile.air;
								s.amt = 0;
							}
							s.ready = false;
						}
						
					}
				}
			}
		}
	} else {
		if(s.origin != null) {
			s.origin.type = s.type;
			s.origin.amt = s.amt;
			s.state = false;
			s.ready = true;
			s.origin = null;
			s.type = tile.air;
			s.amt = 0;
		}
	}
}

function renderGui() {
	cxt.font="10px Arial Black";
	cxt.fillStyle = "black";
	cxt.fillText("2D Minecraft", 8, 8);
	//cxt.fillText("FPS: " + game.fps, 8, 18);
	/*cxt.fillText("Player Column: " + player.array[0].col, 8, 28);
	cxt.fillText("Player Row " + player.array[0].row, 8, 38);
	cxt.fillText("Entities: " + (enemy.array.length + item.array.length + tile.entity.craft.array.length + tile.entity.chest.array.length + tile.entity.furnace.array.length), 8, 48);
	cxt.fillText("Power: " + (power.source.length + power.block.length), 8, 58);
	cxt.fillText("Power Delay: " + (power.delay.length), 8, 68);*/
	cxt.fillStyle = "black";
	
	if(gui.inv.state) {
		cxt.fillStyle = "rgba(0,0,0,.5)";
		cxt.fillRect(0,0,canvas.width,canvas.height);
		cxt.fillStyle = "black";
	}
	
	cxt.drawImage(gui.bar.sprite, tile.width * 7.5, canvas.height - tile.height * 2, 324, 36);
	for(var i=0; i<gui.bar.array.length; i++) {
		var g = gui.bar.array[i];
		var id = g.type;
		var amt = g.amt;
		var sx = id * 32;
		var sy = 0;
		g.x = tile.width * 7.5 + (i * 36) + 2;
		g.y = canvas.height - tile.height * 2 + 2;
		
		if(id != 0) {
			if(id < 100) {
				cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
			} else if(id < 200) {
				cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
			} else {
				cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
			}
			cxt.font="14px Arial Black";
			cxt.fillText(amt,g.x + 2, g.y + 30);
		}
		
	}
	cxt.strokeStyle = "black";
	cxt.lineWidth = "2";
	cxt.strokeRect(tile.width * 7.5 + (gui.bar.selected * 36 + 2), canvas.height - tile.height * 2 + 2, tile.width, tile.height);
		
	if(gui.inv.state) {
	
		if(gui.craft2.state) {
			cxt.drawImage(gui.craft2.sprite, tile.width * 7.5 + 180, canvas.height - tile.height * 2 - 224, 144, 72);
			for(var i=0; i<gui.craft2.array.length; i++) {
				var g = gui.craft2.array[i];
				var id = g.type;
				var amt = g.amt;
				var sx = id * 32;
				var sy = 0;
				if(i < 2) {
					g.x = tile.width * 7.5 + (i * 36) + 182;
					g.y = canvas.height - tile.height * 2 - 222;
				}
				if(i >= 2 && i < 4) {
					g.x = tile.width * 7.5 + ((i-2) * 36) + 182;
					g.y = canvas.height - tile.height * 2 - 222 + 36;
				}
				if(i == 4) {
					g.x = tile.width * 7.5 + ((i - 1) * 36) + 182;
					g.y = canvas.height - tile.height * 2 - 222 + 18;
				}
				if(id != 0) {
					if(id < 100) {
						cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else if(id < 200) {
						cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else {
						cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					}
					cxt.font="14px Arial Black";
					cxt.fillText(amt, g.x + 2, g.y + 30);
				}
			}
		}
		
		if(gui.craft3.state) {
			cxt.drawImage(gui.craft3.sprite, tile.width * 7.5 + 72, canvas.height - tile.height * 2 - 260, 180, 108);
			for(var i=0; i<gui.craft3.open.array.length; i++) {
				var g = gui.craft3.open.array[i];
				var id = g.type;
				var amt = g.amt;
				var sx = id * 32;
				var sy = 0;
				if(i < 3) {
					g.x = tile.width * 7.5 + (i * 36) + 74;
					g.y = canvas.height - tile.height * 2 - 258;
				}
				if(i >= 3 && i < 6) {
					g.x = tile.width * 7.5 + ((i-3) * 36) + 74;
					g.y = canvas.height - tile.height * 2 - 258 + 36;
				}
				if(i >= 6 && i < 9) {
					g.x = tile.width * 7.5 + ((i-6) * 36) + 74;
					g.y = canvas.height - tile.height * 2 - 258 + 72;
				}
				if(i == 9) {
					g.x = tile.width * 7.5 + ((i-5) * 36) + 74;
					g.y = canvas.height - tile.height * 2 - 258 + 36;
				}
				if(id != 0) {
					if(id < 100) {
						cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else if(id < 200) {
						cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else {
						cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					}
					cxt.font="14px Arial Black";
					cxt.fillText(amt, g.x + 2, g.y + 30);
				}
			}
		}
		
		if(gui.chest.state) {
			cxt.drawImage(gui.chest.sprite, tile.width * 7.5, canvas.height - tile.height * 2 - 148 - 148, 324, 144);
			for(var i=0; i<gui.chest.open.array.length; i++) {
				var g = gui.chest.open.array[i];
				var id = g.type;
				var amt = g.amt;
				var sx = id * 32;
				var sy = 0;
				if(i < 9) {
					g.x = tile.width * 7.5 + (i * 36) + 2;
					g.y = canvas.height - tile.height * 2 - 146 - 148;
				}
				if(i >= 9 && i < 18) {
					g.x =	tile.width * 7.5 + ((i-9) * 36) + 2;
					g.y = canvas.height - tile.height * 2 - 146 + 36 -148;
				}
				if(i >= 18 && i < 27) {
					g.x =	tile.width * 7.5 + ((i-18) * 36) + 2;
					g.y = canvas.height - tile.height * 2 - 146 + 36 * 2 - 148;
				}
				if(i >= 27 && i < 36) {
					g.x =	tile.width * 7.5 + ((i-27) * 36) + 2;
					g.y = canvas.height - tile.height * 2 - 146 + 36 * 3 - 148;
				}
				
				if(id != 0) {
					if(id < 100) {
						cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else if(id < 200) {
						cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else {
						cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					}
					cxt.font="14px Arial Black";
					cxt.fillText(amt, g.x + 2, g.y + 30);
				}
				
			}
		}
		
		if(gui.furnace.state) {
			cxt.fillStyle = "rgba(195,195,195,1)";
			cxt.fillRect(tile.width * 7.5 + 108,canvas.height - tile.height * 2 - 240,108, 88);
			cxt.fillStyle = "red";
			cxt.fillRect(tile.width * 7.5 + 110,canvas.height - tile.height * 2 - 201 + 10 - (gui.furnace.open.fuel * 10) / 100,tile.width,10);
			cxt.fillStyle = "white";
			cxt.fillRect(tile.width * 7.5 + 152,canvas.height - tile.height * 2 - 211,(gui.furnace.open.percent * 18) / 100,tile.height);
			cxt.fillStyle = "black";
			cxt.drawImage(gui.furnace.sprite, tile.width * 7.5 + 108, canvas.height - tile.height * 2 - 240, 108, 88);
			for(var i=0; i<gui.furnace.open.array.length; i++) {
				var g = gui.furnace.open.array[i];
				var id = g.type;
				var amt = g.amt;
				var sx = id * 32;
				var sy = 0;
				if(i == 0) {
					g.x = tile.width * 7.5 + 110;
					g.y = canvas.height - tile.height * 2 - 238;
				}
				if(i == 1) {
					g.x = tile.width * 7.5 + 110;
					g.y = canvas.height - tile.height * 2 - 186;
				}
				if(i == 2) {
					g.x = tile.width * 7.5 + 182;
					g.y = canvas.height - tile.height * 2 - 211;
				}
				if(id != 0) {
					if(id < 100) {
						cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else if(id < 200) {
						cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					} else {
						cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
					}
					cxt.font="14px Arial Black";
					cxt.fillText(amt, g.x + 2, g.y + 30);
				}
			}
		}
		
		cxt.drawImage(gui.inv.sprite, tile.width * 7.5, canvas.height - tile.height * 2 - 148, 324, 144);
		for(var i=0; i<gui.inv.array.length; i++) {
			var g = gui.inv.array[i];
			var id = g.type;
			var amt = g.amt;
			var sx = id * 32;
			var sy = 0;
			if(i < 9) {
				g.x = tile.width * 7.5 + (i * 36) + 2;
				g.y = canvas.height - tile.height * 2 - 146;
			}
			if(i >= 9 && i < 18) {
				g.x =	tile.width * 7.5 + ((i-9) * 36) + 2;
				g.y = canvas.height - tile.height * 2 - 146 + 36;
			}
			if(i >= 18 && i < 27) {
				g.x =	tile.width * 7.5 + ((i-18) * 36) + 2;
				g.y = canvas.height - tile.height * 2 - 146 + 36 * 2;
			}
			if(i >= 27 && i < 36) {
				g.x =	tile.width * 7.5 + ((i-27) * 36) + 2;
				g.y = canvas.height - tile.height * 2 - 146 + 36 * 3;
			}
			
			if(id != 0) {
				if(id < 100) {
					cxt.drawImage(tile.sprite,sx,sy,32,32,g.x,g.y, tile.width, tile.height);
				} else if(id < 200) {
					cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
				} else {
					cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,g.x,g.y, tile.width, tile.height);
				}
				cxt.font="14px Arial Black";
				cxt.fillText(amt, g.x + 2, g.y + 30);
			}
			
		}
		
		var s = gui.select;
		if(s.state) {
			var id = s.type;
			var sx = s.type * 32;
			var sy = 0;
			if(id != 0) {
				if(id < 100) {
					cxt.drawImage(tile.sprite,sx,sy,32,32,mousemove.x - tile.width/2, mousemove.y - tile.height/2, tile.width, tile.height);
				} else if(id < 200) {
					cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,mousemove.x - tile.width/2, mousemove.y - tile.height/2, tile.width, tile.height);
				} else {
					cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,mousemove.x - tile.width/2, mousemove.y - tile.height/2, tile.width, tile.height);
				}
				cxt.font="14px Arial Black";
				cxt.fillText(s.amt, mousemove.x - tile.width/2 + 2, mousemove.y - tile.height/2 + 30);
			}
		}
	}
	if(gui.select.type != tile.air && gui.inv.state) {
		//cxt.fillText(getTileInfo(gui.select.type).name, mousemove.x - 16, mousemove.y - 24);
	}
}

function initGui() {
	for(var i=0; i<9; i++) {
		gui.bar.array.push({
			type: 0,
			amt: 0,
			x: 0,
			y: 0,
			width: 32,
			height: 32
		});
	}
	
	gui.bar.array[0].type = tile.wood;
	gui.bar.array[0].amt = 64;
	gui.bar.array[1].type = tile.cobble;
	gui.bar.array[1].amt = 64;
	gui.bar.array[2].type = tile.furnace;
	gui.bar.array[2].amt = 64;
	gui.bar.array[3].type = tile.craft;
	gui.bar.array[3].amt = 64;
	gui.bar.array[4].type = tile.chest;
	gui.bar.array[4].amt = 64;
	gui.bar.array[5].type = tile.diamondbar;
	gui.bar.array[5].amt = 64;
	gui.bar.array[6].type = tile.flat_redtorch;
	gui.bar.array[6].amt = 64;
	gui.bar.array[7].type = tile.redwire;
	gui.bar.array[7].amt = 64;
	gui.bar.array[8].type = tile.left_repeater1;
	gui.bar.array[8].amt = 64;
	
	for(var i=0; i<36; i++) {
		gui.inv.array.push({
			type: 0,
			amt: 0,
			x: 0,
			y: 0,
			width: 32,
			height: 32
		});
	}
	for(var i=0; i<5; i++) {
		gui.craft2.array.push({
			type: 0,
			amt: 0,
			x: 0,
			y: 0,
			width: 32,
			height: 32
		});
	}
}

function updateRecipe(input) {
	var result = {
		output: 0,
		amt: 0
	};

	var temp = [];
	var temp2 = [];
	var temp3 = [];
	var temp4 = [];
	var temp5 = [];
	
	if(input.length == 5) {
		temp[0] = input[0].type;
		temp[1] = input[1].type;
		temp[2] = 0;
		temp[3] = input[2].type;
		temp[4] = input[3].type;
		temp[5] = 0;
		temp[6] = 0;
		temp[7] = 0;
		temp[8] = 0;
	} else {
		temp[0] = input[0].type;
		temp[1] = input[1].type;
		temp[2] = input[2].type;
		temp[3] = input[3].type;
		temp[4] = input[4].type;
		temp[5] = input[5].type;
		temp[6] = input[6].type;
		temp[7] = input[7].type;
		temp[8] = input[8].type;
	}
	
	if(temp[0] == 0 && temp[1] == 0 && temp[2] == 0) {
		temp2[0] = temp[3];
		temp2[1] = temp[4];
		temp2[2] = temp[5];
		temp2[3] = temp[6];
		temp2[4] = temp[7];
		temp2[5] = temp[8];
		temp2[6] = temp[0];
		temp2[7] = temp[1];
		temp2[8] = temp[2];
	} else {
		temp2 = temp;
	}
	
	if(temp2[0] == 0 && temp2[3] == 0 && temp2[6] == 0) {
		temp3[0] = temp2[1];
		temp3[1] = temp2[2];
		temp3[2] = temp2[0];
		temp3[3] = temp2[4];
		temp3[4] = temp2[5];
		temp3[5] = temp2[3];
		temp3[6] = temp2[7];
		temp3[7] = temp2[8];
		temp3[8] = temp2[6];
	} else {
		temp3 = temp2;
	}
	
	if(temp3[0] == 0 && temp3[1] == 0 && temp3[2] == 0) {
		temp4[0] = temp3[3];
		temp4[1] = temp3[4];
		temp4[2] = temp3[5];
		temp4[3] = temp3[6];
		temp4[4] = temp3[7];
		temp4[5] = temp3[8];
		temp4[6] = temp3[0];
		temp4[7] = temp3[1];
		temp4[8] = temp3[2];
	} else {
		temp4 = temp3;
	}
	
	if(temp4[0] == 0 && temp4[3] == 0 && temp4[6] == 0) {
		temp5[0] = temp4[1];
		temp5[1] = temp4[2];
		temp5[2] = temp4[0];
		temp5[3] = temp4[4];
		temp5[4] = temp4[5];
		temp5[5] = temp4[3];
		temp5[6] = temp4[7];
		temp5[7] = temp4[8];
		temp5[8] = temp4[6];
	} else {
		temp5 = temp4;
	}
	
	var exit = false;
	for(var i=0; i<recipe.craft.length; i++) {
		if(!exit) {
			var list = recipe.craft[i];
			for(var j=0; j<temp5.length; j++){
				if(!exit) {
					if(temp5[j] != list.input[j]) {
						exit = true;
					}
				}
			}
			if(!exit) {
				result.output = list.output;
				result.amt = list.amt;
				exit = true;
			} else {
				exit = false;
			}
		}
	}
	
	return result;
}

function loadSprites() {
	tile.sprite.src = "res/tiles/spritesheet.png";
	tile.itemsprite.src = "res/tiles/itemspritesheet.png";
	tile.redsprite.src = "res/tiles/redspritesheet.png";
	tile.brksprite.src = "res/tiles/breakani.png";
	player.sprite.src = "res/entities/playerspritesheet.png";
	enemy.sprite.src="res/entities/zombiespritesheet.png";
	gui.bar.sprite.src = "res/gui/playerbar.png";
	gui.inv.sprite.src = "res/gui/playerinv.png";
	gui.craft2.sprite.src = "res/gui/playercraft2.png";
	gui.craft3.sprite.src = "res/gui/playercraft3.png";
	gui.chest.sprite.src = "res/gui/playerinv.png";
	gui.furnace.sprite.src = "res/gui/playerfurnace.png";
}