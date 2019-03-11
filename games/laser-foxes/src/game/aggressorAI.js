var util = require("./utilities.js");
var players = require("./players.js");
var lasers = require("./lasers.js");
var bombs = require("./bombs.js");
var networkAI = require("./networkAI.js");
var Set = require('es6-set');

function AggressorAI(player) {
    networkAI.NetworkAI.call(this, player);

    this._workOnPlayer = this.workOnPlayer.bind(this);
    this._updateForPlayer = this.updateForPlayer.bind(this);
    this._workOnThreat = this.workOnThreat.bind(this); // have to bind
                                                       // functions....
    this._updateForThreat = this.updateForThreat.bind(this);
}

AggressorAI.prototype = Object.create(networkAI.NetworkAI.prototype);
AggressorAI.prototype.constructor = AggressorAI;

AggressorAI.prototype.getGoal = function (gd, info) {
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

            grid = util.product(x, y);

            for (var g in grid) {
                var gIter = grid[g];
                gIter[0] -= 0.5 * this.w();
                gIter[1] -= 0.5 * this.h();
                gIter[0] = Math.min(Math.max(gIter[0], 0),
                                    players.Player.prototype.maxX);
                gIter[1] = Math.min(Math.max(gIter[1], 0),
                                    players.Player.prototype.maxY);
            }

            griddists = [];
            for (var pts in grid) {
                griddists.push(util.l2dist(grid[pts], bomb.rect().midleft));
            }
            endPoint = grid[griddists.indexOf(Math.max.apply(null, griddists))];
        } else { // opp to left
            // true is for int
            x = util.linspace(this.right(), players.Player.prototype.maxX,
                              5, true);
            y = util.linspace(0, players.Player.prototype.maxY, 5, true);

            grid = util.product(x, y);

            for (var g in grid) {
                var gIter = grid[g];
                gIter[0] -= 0.5 * this.w();
                gIter[1] -= 0.5 * this.h();
                gIter[0] = Math.min(Math.max(gIter[0], 0),
                                    players.Player.prototype.maxX);
                gIter[1] = Math.min(Math.max(gIter[1], 0),
                                    players.Player.prototype.maxY);
            }

            griddists = [];
            for (var pts in grid) {
                griddists.push(util.l2dist(grid[pts], bomb.rect().midright));
            }
            endPoint = grid[griddists.indexOf(Math.max.apply(null, griddists))];
        }

        this.setGoal(gd, endPoint.slice(), bomb, this._workOnThreat,
                     this._updateForThreat, info.pn);
    } else if (lasers.length > 0) {
        var laserdists = [];
        for (var l in lasers) {
            laserdists.push(
                util.l2dist(lasers[l].rect().center, this.center()));
        }
        var laser = lasers[laserdists.indexOf(
            Math.min.apply(null, laserdists))];

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
            var pNode = path[pNodeDists.indexOf(
                Math.min.apply(null, pNodeDists))];
            nodeDist.push(util.l2dist(pNode['xy'], laser.rect().center));
        }

        var end = nodes[nodeDist.indexOf(Math.max.apply(null, nodeDist))];

        this.setGoal(gd, end['xy'], laser, this._workOnThreat,
                     this._updateForThreat, info.pn);
    } else if (this.opp().alive()) {
        var destLeft = [parseInt(
            this.opp().left() - 1.75 * players.Player.prototype.width),
                        this.opp().top()];
        var destRight = [parseInt(
            this.opp().right() + 0.75 * players.Player.prototype.width),
                         this.opp().top()];

        var nodeLeft = info.pn.closestNodeTo(destLeft[0], destLeft[1]);
        var nodeRight = info.pn.closestNodeTo(destRight[0], destRight[1]);

        var distToLeft = util.l2dist(nodeLeft['xy'], destLeft);
        var distToRight = util.l2dist(nodeRight['xy'], destRight);

        // if (Math.abs(distToLeft - distToRight) <
        //     (0.25 * players.Player.prototype.width)) {
        //     if (util.l2dist(this.topleft(), destLeft) <
        //         util.l2dist(this.topleft(), destRight)) {
        //         this.setGoal(gd, destLeft, this.opp(), this._workOnPlayer,
        //                      this._updateForPlayer, info.pn);
        //     } else {
        //         this.setGoal(gd, destRight, this.opp(), this._workOnPlayer,
        //                      this._updateForPlayer, info.pn);
        //     }
        // } else
        if (distToLeft < distToRight) {
            this.setGoal(gd, destLeft, this.opp(), this._workOnPlayer,
                         this._updateForPlayer, info.pn);
        } else {
            this.setGoal(gd, destRight, this.opp(), this._workOnPlayer,
                         this._updateForPlayer, info.pn);
        }
    }
};


AggressorAI.prototype.breakGoal = function (gd, info) {
    var lsr = gd.threats[0];
    var bomb = gd.threats[1];

    if (((lsr.length > 0) || (bomb != null)) &&
        !(gd.obj instanceof lasers.Laser || gd.obj instanceof bombs.Bomb)) {
        this.clearGoal(gd);
        return true;
    }

    return false;
};

exports.AggressorAI = AggressorAI;
