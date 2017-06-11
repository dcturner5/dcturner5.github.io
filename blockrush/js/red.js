

function updateRed() {
	
	var tiles = getTiles(tile.flat_redwire, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_redwire, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_redwire, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.both_redwire, 32, player.array[0].col, player.array[0].row))));
	for(var i=0; i<tiles.length; i++) {
		var t = tiles[i];
		getProxTilePos(t);
		
		if(!(t.pos.upright.type >= tile.flat_redwire && t.pos.upright.type <= tile.both_redwire) &&  !(t.pos.upright.type >= tile.flat_redwire && t.pos.upright.type <= tile.both_redwire) || (getTileInfo(t.pos.up.type).solid)) {
			map.array[t.row][t.col] = tile.flat_redwire;
		}
		if((t.pos.upleft.type >= tile.flat_redwire && t.pos.upleft.type <= tile.both_redwire) && !(getTileInfo(t.pos.up.type).solid)) {
			map.array[t.row][t.col] = tile.left_redwire;
		}
		if((t.pos.upright.type >= tile.flat_redwire && t.pos.upright.type <= tile.both_redwire) && !(getTileInfo(t.pos.up.type).solid)) {
			map.array[t.row][t.col] = tile.right_redwire;
		}
		if((t.pos.upleft.type >= tile.flat_redwire && t.pos.upleft.type <= tile.both_redwire) && (t.pos.upright.type >= tile.flat_redwire && t.pos.upright.type <= tile.both_redwire) && !(getTileInfo(t.pos.up.type).solid)) {
			map.array[t.row][t.col] = tile.both_redwire;
		}
		if(!getTileInfo(t.pos.down.type).solid) {
			createItem(getTileInfo(t.pos.current.type).drop,t.pos.current);
			map.array[t.row][t.col] = tile.air;
		}
	}
	
	var tiles = getTiles(tile.flat_redtorch, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_redtorch, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_redtorch, 32, player.array[0].col, player.array[0].row)));
	for(var i=0; i<tiles.length; i++) {
		var t = tiles[i];
		getProxTilePos(t);
		
		if(t.pos.current.type == tile.flat_redtorch && !getTileInfo(t.pos.down.type).solid) {
			t.pos.current.type = tile.left_redtorch;
			map.array[t.row][t.col] = tile.left_redtorch;
		}
		if(t.pos.current.type == tile.left_redtorch && !getTileInfo(t.pos.left.type).solid) {
			t.pos.current.type = tile.right_redtorch;
			map.array[t.row][t.col] = tile.right_redtorch;
		}
		if(t.pos.current.type == tile.right_redtorch && !getTileInfo(t.pos.right.type).solid) {
			t.pos.current.type = tile.flat_redtorch;
			map.array[t.row][t.col] = tile.flat_redtorch;
		}
		if(t.pos.current.type == tile.flat_redtorch && !getTileInfo(t.pos.down.type).solid) {
			createItem(getTileInfo(t.pos.current.type).drop, t.pos.current);
			map.array[t.row][t.col] = tile.air;
		}
	}
	
	var tiles = getTiles(tile.left_repeater1, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater2, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater3, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater4, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater1, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater2, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater3, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater4, 32, player.array[0].col, player.array[0].row))))))));
	for(var i=0; i<tiles.length; i++) {
		var t = tiles[i];
		getProxTilePos(t);
		if(!getTileInfo(t.pos.down.type).solid) {
			createItem(getTileInfo(t.pos.current.type).drop, t.pos.current);
			map.array[t.row][t.col] = tile.air;
		}
	}
	
	//Redwire Tick Counter
	if(tick.current < tick.max) {
		tick.current++;
	} else {
		tick.current = 0;
		
		
		//Update Source Power
		var tiles = getTiles(tile.flat_redtorch, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_redtorch, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_redtorch, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater1, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater2, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater3, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.left_repeater4, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater1, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater2, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater3, 32, player.array[0].col, player.array[0].row).concat(getTiles(tile.right_repeater4, 32, player.array[0].col, player.array[0].row)))))))))));
		for(var i=0; i<tiles.length; i++) {
			var t = tiles[i];
			getProxTilePos(t);
			if((t.pos.current.type == tile.flat_redtorch && !isPowerBlock(t.pos.down.row,t.pos.down.col)) || (t.pos.current.type == tile.left_redtorch && !isPowerBlock(t.pos.left.row,t.pos.left.col)) || (t.pos.current.type == tile.right_redtorch && !isPowerBlock(t.pos.right.row,t.pos.right.col))) {
				createPower(0,15,t.pos.current.row, t.pos.current.col);
			}
			
			if(t.pos.current.type >= tile.left_repeater1 && t.pos.current.type <= tile.left_repeater4 && (isPowerSource(t.pos.right.row,t.pos.right.col) || isPowerBlock(t.pos.right.row,t.pos.right.col))) {
				if(!isPowerSource(t.pos.current.row, t.pos.current.col) && !isPowerDelay(t.pos.current.row, t.pos.current.col)) {
					if(t.pos.current.type == tile.left_repeater1) {
						createPowerDelay(0,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.left_repeater2) {
						createPowerDelay(1,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.left_repeater3) {
						createPowerDelay(2,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.left_repeater4) {
						createPowerDelay(3,t.pos.current.row, t.pos.current.col);
					}
				}
			}
			if(t.pos.current.type >= tile.right_repeater1 && t.pos.current.type <= tile.right_repeater4 && (isPowerSource(t.pos.left.row,t.pos.left.col) || isPowerBlock(t.pos.left.row,t.pos.left.col))) {
				if(!isPowerSource(t.pos.current.row, t.pos.current.col) && !isPowerDelay(t.pos.current.row, t.pos.current.col)) {
					if(t.pos.current.type == tile.right_repeater1) {
						createPowerDelay(0,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.right_repeater2) {
						createPowerDelay(1,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.right_repeater3) {
						createPowerDelay(2,t.pos.current.row, t.pos.current.col);
					}
					if(t.pos.current.type == tile.right_repeater4) {
						createPowerDelay(3,t.pos.current.row, t.pos.current.col);
					}
				}
			}
			
			if(t.pos.current.type == tile.flat_redtorch && isPowerBlock(t.pos.down.row,t.pos.down.col)) {
				deletePower(t.pos.current.row,t.pos.current.col);
			}
			else if(t.pos.current.type == tile.left_redtorch && isPowerBlock(t.pos.left.row,t.pos.left.col)) {
				deletePower(t.pos.current.row,t.pos.current.col);
			}
			else if(t.pos.current.type == tile.right_redtorch && isPowerBlock(t.pos.right.row,t.pos.right.col)) {
				deletePower(t.pos.current.row,t.pos.current.col);
			}
		}
		
		//Update Delay Power
		for(var i=0; i<power.delay.length; i++) {
			var pd = power.delay[i];
			getProxTilePos(pd);
			
			if(pd.pos.current.type >= tile.left_repeater1 && pd.pos.current.type <= tile.left_repeater4) {
				if(pd.current == pd.max) {
					createPower(0,15,pd.pos.current.row, pd.pos.current.col);
					deletePowerDelay(pd.pos.current.row,pd.pos.current.col);
				} else {
					pd.current++;
				}
			}
			
			if(pd.pos.current.type >= tile.right_repeater1 && pd.pos.current.type <= tile.right_repeater4) {
				if(pd.current == pd.max) {
					createPower(0,15,pd.pos.current.row, pd.pos.current.col);
					deletePowerDelay(pd.pos.current.row,pd.pos.current.col);
				} else {
					pd.current++;
				}
			}
		}
		
		//Update Block Power [ON]
		for(var i=0; i<power.source.length; i++) {
			var ps = power.source[i];
			getProxTilePos(ps);
			
			//Redtorch
			if(ps.pos.current.type >= tile.flat_redtorch && ps.pos.current.type <= tile.right_redtorch) {
				if((ps.pos.current.type == tile.flat_redtorch && !isPowerBlock(ps.pos.down.row,ps.pos.down.col)) || (ps.pos.current.type == tile.left_redtorch && !isPowerBlock(ps.pos.left.row,ps.pos.left.col)) || (ps.pos.current.type == tile.right_redtorch && !isPowerBlock(ps.pos.right.row,ps.pos.right.col))) {
					if(getTileInfo(ps.pos.up.type).solid) {
						createPower(1, 15, ps.pos.up.row, ps.pos.up.col);
					}
				}
				if(ps.pos.current.type == tile.flat_redtorch && isPowerBlock(ps.pos.down.row,ps.pos.down.col)) {
					//deletePower(ps.pos.current.row,ps.pos.current.col);
				}
				else if(ps.pos.current.type == tile.left_redtorch && isPowerBlock(ps.pos.left.row,ps.pos.left.col)) {
					//deletePower(ps.pos.current.row,ps.pos.current.col);
				}
				else if(ps.pos.current.type == tile.right_redtorch && isPowerBlock(ps.pos.right.row,ps.pos.right.col)) {
					//deletePower(ps.pos.current.row,ps.pos.current.col);
				}
			}
				
			//Left Repeater
			if(ps.pos.current.type >= tile.left_repeater1 && ps.pos.current.type <= tile.left_repeater4) {
				if(isPowerSource(ps.pos.right.row,ps.pos.right.col) || isPowerBlock(ps.pos.right.row,ps.pos.right.col)) {
					if(getTileInfo(ps.pos.left.type).solid) {
						createPower(1, 15, ps.pos.left.row, ps.pos.left.col);
					}
				} else {
					deletePower(ps.pos.current.row,ps.pos.current.col);
				}
			}
			
			//Right Repeater
			if(ps.pos.current.type >= tile.right_repeater1 && ps.pos.current.type <= tile.right_repeater4) {
				if(isPowerSource(ps.pos.left.row,ps.pos.left.col) || isPowerBlock(ps.pos.left.row,ps.pos.left.col)) {
					if(getTileInfo(ps.pos.right.type).solid) {
						createPower(1, 15, ps.pos.right.row, ps.pos.right.col);
					}
				} else {
					deletePower(ps.pos.current.row,ps.pos.current.col);
				}
			}
		}
		
		//Update Block Power [OFF]
		for(var i=0; i<power.block.length; i++) {
			var pb = power.block[i];
			getProxTilePos(pb);
			if(!((pb.pos.left.type >= tile.right_repeater1 && pb.pos.left.type <= tile.right_repeater4 && isPowerSource(pb.pos.left.row,pb.pos.left.col)) || (pb.pos.right.type >= tile.left_repeater1 && pb.pos.right.type <= tile.left_repeater4 && isPowerSource(pb.pos.right.row,pb.pos.right.col)) || (pb.pos.down.type >= tile.flat_redtorch && pb.pos.down.type <= tile.right_redtorch && isPowerSource(pb.pos.down.row,pb.pos.down.col)))) {
				deletePower(pb.pos.current.row,pb.pos.current.col);
			}
		}
	}
}

function isPowerSource(row, col) {
	for(var i=0; i<power.source.length; i++) {
		var ps = power.source[i];
		if(ps.row == row && ps.col == col) {
			return true;
		}
	}
	return false;
}

function isPowerBlock(row, col) {
	for(var i=0; i<power.block.length; i++) {
		var pb = power.block[i];
		if(pb.row == row && pb.col == col) {
			return true;
		}
	}
	return false;
}

function isPowerDelay(row, col) {
	for(var i=0; i<power.delay.length; i++) {
		var pd = power.delay[i];
		if(pd.row == row && pd.col == col) {
			return true;
		}
	}
	return false;
}

function deletePower(row, col) {
	for(var i=0; i<power.source.length; i++) {
		var p = power.source[i];
		if(p.row == row && p.col == col) {
			power.source.splice(i,1);
		}
	}
	for(var i=0; i<power.block.length; i++) {
		var p = power.block[i];
		if(p.row == row && p.col == col) {
			power.block.splice(i,1);
		}
	}
	for(var i=0; i<power.wire.length; i++) {
		var p = power.wire[i];
		if(p.row == row && p.col == col) {
			power.wire.splice(i,1);
		}
	}
}

function deletePowerDelay(row, col) {
	for(var i=0; i<power.delay.length; i++) {
		var p = power.delay[i];
		if(p.row == row && p.col == col) {
			power.delay.splice(i,1);
		}
	}
}

function createPowerDelay(time, row, col) {
	if(isPowerDelay(row, col)) {
		deletePowerDelay(row, col);
	}
	power.delay.push({
		x: col * tile.width,
		y: row * tile.height,
		width: tile.width,
		height: tile.height,
		row: row,
		col: col,
		current: 0,
		max: time
	});
}

function createPower(type, strength, row, col) {
	if(isPowerSource(row,col) || isPowerBlock(row,col)) {
		deletePower(row,col);
	}
	
	if(type == 0) {
		power.source.push({
			x: col * tile.width,
			y: row * tile.height,
			width: tile.width,
			height: tile.height,
			row: row,
			col: col,
			power: strength,
			delay: 0
		});
	}
	if(type == 1) {
		power.block.push({
			x: col * tile.width,
			y: row * tile.height,
			width: tile.width,
			height: tile.height,
			row: row,
			col: col,
			power: strength
		});
	}
	if(type == 2) {
		power.wire.push({
			x: col * tile.width,
			y: row * tile.height,
			width: tile.width,
			height: tile.height,
			row: row,
			col: col,
			power: strength
		});
	}
}