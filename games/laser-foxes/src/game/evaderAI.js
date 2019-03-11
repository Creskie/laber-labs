var util = require("./utilities.js");
var networkAI = require("./networkAI.js");
var pointNetwork = require("./pointNetwork.js");
var players = require("./players.js");

function EvaderAI(player) {
    networkAI.NetworkAI.call(this, player);

    // have to bind functions....
    this._workOnPoint = this.workOnPoint.bind(this);
    this._updateForPoint = this.updateForPoint.bind(this);
    this._workOnThreat = this.workOnThreat.bind(this);
    this._updateForThreat = this.updateForThreat.bind(this);
    this._workOnPlayer = this.workOnPlayer.bind(this);
    this._updateForPlayer = this.updateForPlayer.bind(this);
}

EvaderAI.prototype = Object.create(networkAI.NetworkAI.prototype);
EvaderAI.prototype.constructor = EvaderAI;

EvaderAI.prototype.getGoal = function (gd, info) {
    var lasers = gd.threats[0];
    var bomb = gd.threats[1];

    if (bomb != null) {

        var x,
            y,
            grid,
            griddists,
            endPoint;
        if (this.faceRight()) { // then opponent is to your right
            x = util.linspace(0, this.left(), 5, true); // true is for int
            y = util.linspace(0, players.Player.prototype.maxY, 5, true);
            // get unique values
            x = x.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });
            y = y.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });

            grid = util.product(x, y);

            for (var g in grid) {
                var gIter = grid[g];
                gIter[0] -= 0.5 * this.w();
                gIter[1] -= 0.5 * this.h();
            }

            griddists = [];
            for (var pts in grid) {
                griddists.push(util.l2dist(grid[pts], bomb.rect().midleft));
            }
            endPoint = grid[griddists.indexOf(Math.max.apply(null, griddists))];
        } else { // opp to left
            x = util.linspace(this.right(), players.Player.prototype.maxX, 5, true); // true is for int
            y = util.linspace(0, players.Player.prototype.maxY, 5, true);
            // get unique values
            x = x.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });
            y = y.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });

            grid = util.product(x, y);

            for (var g in grid) {
                var gIter = grid[g];
                gIter[0] -= 0.5 * this.w();
                gIter[1] -= 0.5 * this.h();
            }

            griddists = [];
            for (var pts in grid) {
                griddists.push(util.l2dist(grid[pts], bomb.rect().midright));
            }
            endPoint = grid[griddists.indexOf(Math.max.apply(null, griddists))];
        }

        var end = info.pn.closestNodeTo(endPoint[0], endPoint[1]);
        this.setGoal(gd, endPoint, bomb, this._workOnThreat, this._updateForThreat, info.pn);
    } else if (lasers.length > 0) {
        var laserdists = [];
        for (var l in lasers) {
            laserdists.push(util.l2dist(lasers[l].rect().center, this.center()));
        }
        var laser = lasers[laserdists.indexOf(Math.min.apply(null, laserdists))];

        var x = [this.left(), this.centerx(), this.right()];
        var y = [this.top() - 2 * this.h(), this.bottom() + 2 * this.h()];
        var grid = util.product(x, y);

        var nodes = new Set();
        for (var g in grid) {
            var gIter = grid[g];
            gIter[0] -= 0.5 * this.w();
            gIter[1] -= 0.5 * this.h();

            nodes.add(info.pn.closestNodeTo(gIter[0], gIter[1]));
        }
        nodes = Array.from(nodes).sort(function (a, b) {
            return a.index - b.index
        });

        var start = info.pn.closestNodeTo(this.topleft()[0], this.topleft()[1]);
        var nodeDist = [];
        for (var n in nodes) {
            var nd = nodes[n];
            var paths = info.pn.shortestPath(start.index, nd.index);
            var path = [];
            for (var p in paths) {
                path.push(info.pn.vs[paths[p]]);
            }

            var pNodeDists = [];
            for (var p in path) {
                pNodeDists.push(util.l2dist(path[p].xy, laser.rect().center));
            }

            var pNode = path[pNodeDists.indexOf(Math.min.apply(null, pNodeDists))];
            nodeDist.push(util.l2dist(pNode['xy'], laser.rect().center));
        }

        var end = nodes[nodeDist.indexOf(Math.max.apply(null, nodeDist))];

        this.setGoal(gd, end['xy'], laser, this._workOnThreat, this._updateForThreat, info.pn);
    } else if (util.l2dist(this.topleft(), this.opp().topleft()) < (6 * this.h())) {
        x = [this.left() - 6 * this.w(), this.right() + 6 * this.w(), this.centerx()];
        y = [this.top() + 6 * this.h(), this.bottom() - 6 * this.h(), this.centery()];

        grid = util.product(x, y);

        var nodes = new Set();
        for (var g in grid) {
            var gIter = grid[g];
            gIter[0] -= 0.5 * this.w();
            gIter[1] -= 0.5 * this.h();

            nodes.add(info.pn.closestNodeTo(gIter[0], gIter[1]));
        }
        nodes = Array.from(nodes).sort(function (a, b) {
            return a.index - b.index
        });
        var nodedists = [];
        for (var nx in nodes) {
            nodedists.push(util.l2dist(nodes[nx].xy, this.opp().topleft()));
        }
        var dest = nodes[nodedists.indexOf(Math.max.apply(null, nodedists))];
        this.setGoal(gd, dest['xy'], dest, this._workOnPoint, this._updateForPoint, info.pn)
    }

};

EvaderAI.prototype.breakGoal = function (gd, info) {
    var lsr = gd.threats[0];
    var bomb = gd.threats[1];

    if (((lsr.length > 0) || (bomb != null))
        && (gd.obj.hasOwnProperty("pnVertex"))) {
        this.clearGoal(gd);
        return true;
    }
    return false;
};


exports.EvaderAI = EvaderAI;
