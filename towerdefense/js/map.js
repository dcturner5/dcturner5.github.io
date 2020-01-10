/*
Creates a randomly generated map
*/

var grass = 0;
var dirt = 1;
var lead = 2;
var concrete = 3;

var direction = 0;
var north = 1;
var east = 2;
var south = 3;
var west = 4;

function createMap() {
				
	// Create a Blank Array 
	for(var i = 0; i < map.height; i++) {
		map.array[i] = new Array();
		for(var j = 0; j < map.width; j++) {
			map.array[i][j] = grass;
		}
	}
	
	map.array[getRandomInt(4, map.height - 4)][0] = lead;
	direction = east;
	
	var maxPathLength = (map.height * (map.width/2)) + map.width/2;
	
	for(var x = 0; x < maxPathLength; x++) {
		
		for(var i = 0; i < map.height; i++) {
			for(var j = 0; j < map.width; j++) { 
				
				var row = i;
				var column = j;
				
				var tile = map.array[i][j];
				
				if(tile == lead && checkTileLength(i, j, dirt)) {
					
					map.array[i][j] = dirt;
					
					var random = getRandomInt(1, 8);
					if(random < 8 && !checkTileDiag(i, j)) {
					
						if(random <= 5 && direction != south) {
							map.array[i - 1][j] = lead;
							direction = north;
						}
						else if(random <= 5 && direction == south) {
							map.array[i][j + 1] = lead;
							direction = east;
						}
						
						if(random >= 6 && random <= 9 && direction != north) {
							map.array[i + 1][j] = lead;
							direction = south;
						}
						else if(random >= 6 && random <= 9 && direction == north) {
							map.array[i][j + 1] = lead;
							direction = east;
						}
						
					}else {
						map.array[i][j + 1] = lead;
						direction = east;
					}
				//Continue Path if no turn
				}else if(tile == lead){
				
					/*enemy.path.array.push({
						x: column * tile.width,
						y: row * tile.height
					});*/
					
					map.array[i][j] = dirt;
					try { 
						if(direction == north) {
							map.array[i - 1][j] = lead;
						}
						else if(direction == east) {
							map.array[i][j + 1] = lead;
						}
						else if(direction == south) {
							map.array[i + 1][j] = lead;
						}
					}
					catch(err) { 
						//DO NOTHING
					}
				}
				
				if(map.array[i][map.width - 1] == dirt) {
					if(map.array[i][map.width - 2] == dirt) {
						map.array[i][map.width - 1] = concrete;
						if(i <= 1 || i >= map.height - 3) {
							createMap();
						}
					}else { 
						map.array[i][map.width - 1] = grass;
					}
				}
				
			}
		}
	}
	
}

function checkTileDiag(row, column) {
	try { 
		var d45 = map.array[row - 1][column + 1];
		var d135 = map.array[row + 1][column + 1];
		var d225 = map.array[row + 1][column - 1];
		var d315 = map.array[row - 1][column - 1];
	}
	catch(err) {
		return true;
	}
	
	if(d45 == dirt || d135 == dirt || d225 == dirt || d315 == dirt) {
		return true;
	}else {
		return false;
	}
}

function checkTileLength(row, column, tile) {
	try { 
		if((map.array[row - 1][column] == tile && map.array[row - 2][column] == tile && map.array[row - 3][column] == tile) ||
		(map.array[row + 1][column] == tile && map.array[row + 2][column] == tile && map.array[row + 3][column] == tile) ||
		(map.array[row][column - 1] == tile && map.array[row][column - 2] == tile && map.array[row][column - 3] == tile)) {
			return true;
		}else {
			return false;
		}
	}
	catch(err) {
		return true;
	}
}
