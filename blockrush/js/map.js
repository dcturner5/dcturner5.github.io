
function initMap() {
	map.array = createMap(map.width, map.height);
	map.seed = new Date().getTime();
	map.smooth = 32;
	seedMap(0, 128);
	refineMap(map.smooth);
	tileMap();
	createSea();
	for(var i=0; i<50; i++) {	
		createTree();
	}
	for(var i=0; i<100; i++) {
		createOre(tile.redore,12);
		createOre(tile.ironore,8);
		createOre(tile.goldore,6);
		createOre(tile.diamondore,4);
	}
}

function createMap(width, height) {
    var map = [];
   for(var i=0; i<height; i++) {
		map[i] = [];
		 for(var j=0; j<width; j++) {
			map[i][j] = 0;
		}    
    }  	
    return map;
}

function seedMap(min, max) {
    max = max || 1;
    min = min || 0;
	for (var row= 0; row<map.height; row++) {
		for (var col=0; col<map.width; col++) {
			map.seed = (map.seed * 9301 + 49297) % 233280;
			var rnd = map.seed / 233280;
			var alt = ~~(min + rnd * (max - min));
			map.array[row][col] = alt;
		}
	}
}

function refineMap(smoothness) {
	var totalavg = 0;
	for(var i=0; i<smoothness; i++) {
		for (var row=0; row<map.height; row++) {
			for (var col=0; col<map.width; col++) {
				var avg = 0;
				avg += map.array[Math.min(row+1,map.height-1)][col];
				avg += map.array[row][Math.min(col+1,map.width-1)];
				avg += map.array[Math.min(row+1,map.height-1)][Math.min(col+1,map.width-1)];
				avg = ~~(avg / 3);
				map.array[row][col] = avg;
			}
		}
	}
}

function tileMap() {
	var newmap = [];
	for(var i=0; i<map.width; i++) {
		newmap[i] = map.array[0][i];
	}
	map.array = createMap(map.width, map.height);
	for(var i=0; i<newmap.length; i++) {
		var h = map.height - newmap[i] - 10;
		map.array[h][i] = tile.grass;
		for(var j=h; j<map.height; j++) {
			if(j > h) {
				map.array[j][i] = tile.dirt;
			}
			if(j > h + 3) {
				map.array[j][i] = tile.stone;
			}
		}
	}
}

function createSea() {
	for(var row=0; row<map.height; row++) {
		for(var col=0; col<map.width; col++) {
			if(row >= 70 && map.array[row][col] == tile.air) {
				map.array[row][col] = tile.water;
				if(map.array[row+1][col] != tile.air) {
					map.array[row+1][col] = tile.sand;
					map.array[row+2][col] = tile.sand;
				}
			}
		}
	}
}

function createTree() {
	var coord = getRandomTile(tile.grass);
	var col = coord[0];
	var row = coord[1] - 1;
	
	if(row >= 190) return;
	
	map.array[row][col] = tile.wood;
	map.array[row - 1][col] = tile.wood;
	map.array[row - 2][col - 1] = tile.leaf;
	map.array[row - 2][col] = tile.wood;
	map.array[row - 2][col + 1] = tile.leaf;
	map.array[row - 3][col - 1] = tile.leaf;
	map.array[row - 3][col] = tile.leaf;
	map.array[row - 3][col + 1] = tile.leaf;
	map.array[row - 4][col] = tile.leaf;
}

function createOre(type, size) {
	var coord = getRandomTile(tile.stone);
	var col = coord[0];
	var row = coord[1];
	for(var i=0; i<size; i++) {
		map.array[Math.max(0,Math.min(row,map.height-1))][Math.max(0,Math.min(col,map.width-1))] = type;
		switch(getRandomInt(0,3)) {
			case 0: row++; break;
			case 1: row--; break;
			case 2: col++; break;
			case 3: col--; break;
		}
	}
}

