var util = require("./utilities.js");
var networkAI = require("./networkAI.js");
var pointNetwork = require("./pointNetwork.js");
var lasers = require("./lasers.js");
var blocks = require("./blocks.js");


function ForagerAI(player) {
		networkAI.NetworkAI.call(this,player);

		// have to bind functions....
    this._workOnPoint = this.workOnPoint.bind(this);
    this._updateForPoint = this.updateForPoint.bind(this);
    this._workOnThreat = this.workOnThreat.bind(this);
    this._updateForThreat = this.updateForThreat.bind(this);
    this._workOnPlayer = this.workOnPlayer.bind(this);
    this._updateForPlayer = this.updateForPlayer.bind(this);
		this._workOnEnergy = this.workOnEnergy.bind(this);
		this._updateForEnergy = this.updateForEnergy.bind(this);
		this._workOnBlock = this.workOnBlock.bind(this);
		this._updateForBlock = this.updateForBlock.bind(this);
		this._workOnPowerUp = this.workOnPowerUp.bind(this);
		this._updateForPowerUp = this.updateForPowerUp.bind(this);

}

ForagerAI.prototype = Object.create(networkAI.NetworkAI.prototype);
ForagerAI.prototype.constructor = ForagerAI;


ForagerAI.prototype.getGoal = function (gd, info) {
		if(util.l2dist(this.topleft(),this.opp().topleft()) < (4*this.h())){
				var x,y,grid;
				x = [this.left() - 6*this.w(),
						 this.right() + 6*this.w(),
						 this.centerx()]

				y = [this.top() + 6*this.h(),
						 this.bottom() + 6*this.h(),
						 this.centery()]


				grid = util.product(x,y);

				var nodes = new Array();
				for(var g in grid) {
						var gIter = grid[g];
						gIter[0] -= 0.5*this.w();
						gIter[1] -= 0.5*this.h();

						nodes.push(info.pn.closestNodeTo(gIter[0],gIter[1]));
				}


				nodes = Array.from(nodes).sort(function (a, b) {
						return a.index - b.index;
				});

				var nodedists = [];
				for (var nx in nodes) {
						nodedists.push(util.l2dist(nodes[nx].xy,this.opp().topleft()));
				}
				var dest = nodes[nodedists.indexOf(Math.max.apply(null,nodedists))];
				this.setGoal(gd, dest["xy"], dest, this._workOnPoint,
										 this._updateForPoint,info.pn);

				return;
		}

		if(info.energyBars.length > 0 && !this.player().em().full()) {
				var xy = this.center();

				var minDist = Infinity;
				var target = undefined;
				for(var e in info.energyBars) {
						var eDist = util.l2dist(info.energyBars[e].rect().center,xy);
						if(eDist < minDist) {
								minDist = eDist;
								target = info.energyBars[e];
						}
				}
				console.assert(target != undefined);

				var point = target.rect().center;

				point[0] -= this.w()/2.0;
				point[1] -= this.h()/2.0;

				if(util.l2dist(point,this.opp().topleft()) > (5*this.w())) {
						this.setGoal(gd,point,target,this._workOnEnergy,
												 this._updateForEnergy,info.pn);
						return;
				}
		}

		if((this.weapon() == lasers.Laser)
			 && this.player().em().avail(blocks.Block.prototype.maxLives)) {
				var blockRects = [];
				for(var b in info.blocks) {
						var block = info.blocks[b];
						blockRects.push(block.rect());
				}

				var openPoints = [];
				for(var b in info.blocks) {
						var block = info.blocks[b];
						var left = [block.rect().centerx - block.rect().w,
												block.rect().centery];
						var right = [block.rect().centerx + block.rect().w,
												 block.rect().centery];

						var allNotLeft = true;
						var allNotRight = true;
						for(var br in blockRects) {
								var r = blockRects[br];
								if(allNotLeft && r.collidepoint(left)){
										allNotLeft = false;
								}

								if(allNotRight && r.collidepoint(right)){
										allNotRight = false;
								}

								if(!allNotRight && !allNotLeft)
										break;
						}

						if(allNotLeft)
								openPoints.push({"point":left,
																 "target":block,
																 "right":false});
						if(allNotRight)
								openPoints.push({"point":right,
																 "target":block,
																 "right":true});
				}

				var openDist = [];
				for(var p in openPoints) {
						openDist.push(util.l2dist(openPoints[p]["point"],
																			this.opp().center()));
				}

				var index = openDist.indexOf(Math.max.apply(null,openDist));

				if(index >= 0) {
						var point = openPoints[index]["point"];
						var target = openPoints[index]["target"];
						var right = openPoints[index]["right"];

						if (right) {
								point = [point[0],point[1] - this.h()/2.0];
						} else {
								point = [point[0] - this.w(),
												 point[1] - this.h()/2.0];
						}

						this.setGoal(gd,point,target,this._workOnBlock,
												 this._updateForBlock,info.pn);

						return;
				}
		}
}


ForagerAI.prototype.breakGoal = function (gd, info) {
		if(gd.obj.hasOwnProperty("pnVertex")
			 && (util.l2dist(this.topleft(),this.opp().topleft())
					 < (4*this.h()))) {
				return true;
		} else if (gd.obj.hasOwnProperty("pnVertex")
							 && (util.l2dist(this.topleft(),this.opp().topleft())
									 >= (8*this.h()))) {
				return true;
		} else if (gd.obj instanceof blocks.Block) {
				if(util.l2dist(this.topleft(),gd.dest) < (0.5*this.h())) {
						var dx = this.centerx() - gd.obj.rect().centerx;
						if(dx > 0 && this.player().faceRight()) {
								this.clearGoal(gd);
								return true;
						} else if (dx < 0 && !this.player().faceRight()) {
								this.clearGoal(gd);
								return true;
						}
				}
		}
		return false;
}




exports.ForagerAI = ForagerAI;
