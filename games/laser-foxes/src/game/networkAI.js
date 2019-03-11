var util = require("./utilities.js");
var players = require("./players.js");
var lasers = require("./lasers.js");
var bombs = require("./bombs.js");
var controllers = require("./controllers.js");
var powerUps = require("./powerUps.js");
var blocks = require("./blocks.js");
var energyBars = require("./energyBars.js");
var rects = require("./rects.js");
var $ = require("jquery");

function GoalData(hasGoal, dest, obj, path,
                  lastZeroInd, workOnGoal,
                  updateForGoal, shootCounter,
                  lastTopLeft, stuckCounter,
                  threats, direction, shoot, dash) {
    // boolean
    this.hasGoal = hasGoal;

    // (x,y)
    this.dest = dest;

    // Can be many things...
    // igraph.Vertex if going to a point
    // Player if targetting a player
    // Block if targetting a block
    // etc
    this.obj = obj;

    // ((x0,y0),(x1,y1),...,(xn,yn))
    this.path = path;
    this.lastZeroInd = lastZeroInd;

    // function
    this.workOnGoal = workOnGoal;

    // function
    this.updateForGoal = updateForGoal;

    // limit number of consecutive shots
    this.shootCounter = shootCounter;

    // check if not moving
    this.lastTopLeft = lastTopLeft;
    this.stuckCounter = stuckCounter;

    this.threats = threats;

    // player moves
    this.direction = direction;
    this.shoot = shoot;
    this.dash = dash;
}

GoalData.prototype.copy = function () {
    return new GoalData(
        this.hasGoal,
        this.dest,
        $.extend(true, {}, this.obj),
        $.extend(true, {}, this.path),
        this.lastZeroInd,
        $.extend(true, {}, this.workOnGoal),
        this.updateForGoal,
        this.shootCounter,
        this.lastTopLeft,
        this.stuckCounter,
        this.threats,
        this.direction,
        this.shoot,
        this.dash);
};

function NetworkAI(player) {
    controllers.Controller.call(this, player);

    this._shootLimit = 12;
    this._stuckLimit = 6;
    this._gd = new GoalData(false, null, null, null, null, null, null, this._shootLimit, null, this._stuckLimit,
        [[], null], [0, 0], false, false);
}

NetworkAI.prototype = Object.create(controllers.Controller.prototype);
NetworkAI.prototype.constructor = NetworkAI;

NetworkAI.prototype.reset = function () {
    // super.reset(); // not sure if this is supported everywhere??
    controllers.Controller.prototype.reset.call(this);

    this._player.setDirection([0, 0]);
    this.clearGoal(this._gd);
};

NetworkAI.prototype.clearGoal = function (gd) {
    gd.hasGoal = false;
    gd.dest = false;
    gd.obj = null;
    gd.path = null;
    gd.lastZeroInd = null;
    gd.workOnGoal = null;
    gd.updateForGoal = null;
    gd.lastTopLeft = null;
    gd.stuckCounter = this._stuckLimit;

    gd.direction = [0, 0];
    gd.shoot = false;
    gd.dash = false;
};

NetworkAI.prototype.setGoal = function (gd, dest, obj, workOnGoal,
                                        updateForGoal, pn) {
    this.clearGoal(gd);
    gd.hasGoal = true;
    gd.dest = dest;
    gd.obj = obj;
    gd.path = this.getPath(this.topleft(), dest, pn);
    gd.lastZeroInd = 0;
    gd.workOnGoal = workOnGoal;
    gd.updateForGoal = updateForGoal;
};

NetworkAI.prototype.getPath = function (start, dest, pn) {
    var startNode = pn.closestNodeTo(start[0], start[1]);
    var destNode = pn.closestNodeTo(dest[0], dest[1]);
    var path = pn.shortestPath(startNode.index, destNode.index);
    var path0 = [];
    for (var p in path) {
        path0.push(pn.vs[path[p]]["xy"]);
    }
    path0.push(dest);
    return path0;
};

NetworkAI.prototype.moveAlongPath = function (gd, pn) {
    var currTopLeft = this.topleft();
    if (gd.lastTopLeft != undefined &&
        gd.lastTopLeft[0] == currTopLeft[0]
        && gd.lastTopLeft[1] == currTopLeft[1]){
        gd.stuckCounter -= 1;
    } else {
        gd.stuckCounter = this._stuckLimit;
    }

    gd.lastTopLeft = this.topleft();

    if (gd.stuckCounter <= 0) {
        gd.stuckCounter = this._stuckLimit;
        this.clearGoal(gd);
    } else {
        var zeroInd = gd.lastZeroInd;
        var zero = gd.path[zeroInd];
        var zeroDist = util.l2dist(this.topleft(), zero);

        for (var i = 0; i < gd.path.length; i++) {
            var point = gd.path[i];
            if (i >= zeroInd) {
                var dist = util.l2dist(point, this.topleft());
                if (dist <= zeroDist) {
                    zeroDist = dist;
                    zero = point;
                    zeroInd = i;
                } else {
                    break;
                }
            }
        }

        gd.lastZeroInd = zeroInd;

        var me = this.topleft();

        var heading = null;
        if ((zeroInd + 2) < gd.path.length) {
            var two = gd.path[parseInt(zeroInd + 2)];
            heading = util.subtract(two, me);
        } else if ((zeroInd + 1) < gd.path.length) {
            var one = gd.path[parseInt(zeroInd + 1)];
            heading = util.subtract(one, me);
        } else {
            heading = util.subtract(zero, me);
        }

        if (heading.reduce(function (a, b) {
                return Math.abs(a) + Math.abs(b);
            }) < 0.01) {
            gd.direction = [0., 0.];
        } else {
            var d = [[0., 1.], [0., -1.], [1., 0.], [1., 1.], [1., -1.],
                     [-1., 0.], [-1., 1.], [-1., -1]];
            var angles = [];
            for (var a = 0; a < d.length; a++) {
                angles.push(util.angle(d[a], heading));
            }
            gd.direction = d[angles.indexOf(Math.min.apply(null, angles))];
        }
    }
};

NetworkAI.prototype.getThreats = function (gd, info) {
    // check if laser is inline with player
    var r = new rects.Rect(0, this.top(),
                           players.Player.prototype.maxX, this.h());

    var inPlayerRect = [];
    for (var laser in info.lasers) {
        if (r.collide(info.lasers[laser].rect())) {
            inPlayerRect.push(info.lasers[laser]);
        }
    }

    var indirection = [];
    for (var laser in inPlayerRect) {
        var l = inPlayerRect[laser];
        if (l.faceRight() && l.rect().right <= this.left()) {
            indirection.push(l)
        } else if ((!l.faceRight()) && l.rect().left >= this.right()) {
            indirection.push(l);
        }
    }

    if (this.faceRight()) {
        var topRect = new rects.Rect(this.left(), this.top() - this.h(),
            3 * this.w(), this.h());
        var botRect = new rects.Rect(this.left(), this.bottom(),
            3 * this.w(), this.h());
    } else {
        var topRect = new rects.Rect(this.left() - 2 * this.w(),
                                     this.top() - this.h(),
            3 * this.w(), this.h());
        var botRect = new rects.Rect(this.left() - 2 * this.w(), this.bottom(),
            3 * this.w(), this.h());
    }

    // check if laser is near player but above
    // check if laser is near player but below
    var inTopRect = [];
    var inBotRect = [];
    for (var laser in info.lasers) {
        var l = info.lasers[laser];
        if (topRect.collide(l.rect())) {
            inTopRect.push(l);
        } else if (botRect.collide(l.rect())) {
            inBotRect.push(l);
        }
    }

    var laserThreats = inTopRect.concat(inBotRect);
    for (var laser in indirection) {
        var l = indirection[laser];
        if (l.faceRight()) {
            var r = new rects.Rect(l.rect().right, l.rect().top,
                this.left() - l.rect().right, l.rect().height);
        } else {
            var r = new rects.Rect(this.right(), l.rect().top,
                l.rect().left - this.right(), l.rect().height);
        }

        if (info.blocks.every(function (b) {
                return !r.collide(b.rect())
            }) || (l instanceof lasers.PenetratingLaser)) {
            laserThreats.push(l);
        }
    }

    var bombThreats = null;
    // now check if bomb is a threat
    if (info.bombs.length != 0) {
        for (var bomb in info.bombs) {
            var b = info.bombs[bomb];
            if (util.l2dist(this.center(), b.rect().center) <=
                (1.25 * bombs.Bomb.prototype.width
                 * bombs.Bomb.prototype.explodeScale)) {
                bombThreats = b;
            }
        }
    }
    gd.threats = [laserThreats, bombThreats];
};

NetworkAI.prototype.openShot = function (info) {
    if (this.weapon() == bombs.Bomb) {
        if (this._player._bombTime > 0) {
            --this._player._bombTime;
        }

        if (util.l2dist(this.topleft(), this.opp().topleft())
            < (0.75 * bombs.Bomb.prototype.width
               * bombs.Bomb.prototype.explodeScale)
            || this._player._bombTime == 0) {
            return true;
        } else {
            return false;
        }
    } else if (this.weapon() == bombs.Grenade) {
        if (this._player._triggerTime > 0) {
            --this._player._triggerTime;
            return false;
        } else {
            return true;
        }
    } else if (this.faceRight() && this.centerx() > this.opp().centerx()) {
        // if facing right and to the right
        return false;
    } else if (!this.faceRight() && this.centerx() < this.opp().centerx()) {
        // if facing left and to the left
        return false;
    } else if (this.opp().bottom() < this.centery()) {
        // if above
        return false;
    } else if (this.opp().top() > this.centery()) {
        // if below
        return false;
    } else {
        // if have penetrating lasers
        if (this.weapon() == lasers.PenetratingLaser) {
            return true;
        }
        // check blocks in the way
        else {
            var dx = this._player.centerx() - this.opp().centerx();
            var r;
            if (dx > 0) {
                r = new rects.Rect(this.opp().centerx(),
                                   (this.centery()
                                    - lasers.Laser.prototype.height),
                                   dx, 2 * lasers.Laser.prototype.height);
            } else {
                r = new rects.Rect(this.centerx(), this.
                                   centery() - lasers.Laser.prototype.height,
                    -dx, 2 * lasers.Laser.prototype.height);
            }
            if (info.blocks.every(function (b) {
                    return !r.collide(b.rect())
                })) {
                return true;
            } else {
                return false;
            }
        }
    }
};

NetworkAI.prototype.shoot = function (gd) {
    if (gd.shootCounter <= 0) {
        gd.shoot = true;
        gd.shootCounter = this._shootLimit;
    }
};

NetworkAI.prototype.workOnPoint = function (gd, info) {
    // move to the point
    this.moveAlongPath(gd, info.pn);
};

NetworkAI.prototype.updateForPoint = function (gd, info) {
    // check if at the point
    // if at the point, then reset the goal
    if (util.l2dist(this.topleft(), gd.dest)
        < 0.25 * players.Player.prototype.height) {
        this.clearGoal(gd);
    }
};

NetworkAI.prototype.workOnPlayer = function (gd, info) {
    // move to the player
    this.moveAlongPath(gd, info.pn);
};

NetworkAI.prototype.updateForPlayer = function (gd, info) {
    // check if current dest is too far from player
    // if too far, recalculate the path

    // check if opponent has died
    if (!this.opp().alive()) {
        this.clearGoal(gd);
    } else {
        var destLeft = [parseInt(this.opp().left() - 1.5 * this.opp().width),
            this.opp().top()];
        var destRight = [parseInt(this.opp().right() - 0.5 * this.opp().width),
            this.opp().top()];

        var distToOpp = Math.min(util.l2dist(gd.dest, destLeft),
                                 util.l2dist(gd.dest, destRight));

        if (distToOpp > (0.5 * players.Player.prototype.width)) {
            var nodeLeft = info.pn.closestNodeTo(destLeft[0], destLeft[1]);
            var nodeRight = info.pn.closestNodeTo(destRight[0], destRight[1]);

            var distToLeft = util.l2dist(nodeLeft['xy'], destLeft);
            var distToRight = util.l2dist(nodeRight['xy'], destRight);

            if (Math.abs(distToLeft - distToRight) < (0.5 * players.Player.prototype.width)) {
                if (util.l2dist(gd.dest, destLeft) < util.l2dist(gd.dest, destRight)) {
                    this.setGoal(gd, destLeft, this.opp(), this._workOnPlayer, this._updateForPlayer,
                        info.pn);
                } else {
                    this.setGoal(gd, destRight, this.opp(), this._workOnPlayer, this._updateForPlayer,
                        info.pn);
                }
            } else if (distToLeft < distToRight) {
                this.setGoal(gd, destLeft, this.opp(), this._workOnPlayer, this._updateForPlayer,
                    info.pn);
            } else {
                this.setGoal(gd, destRight, this.opp(), this._workOnPlayer, this._updateForPlayer,
                    info.pn);
            }
        }
    }
};

NetworkAI.prototype.workOnBlock = function (gd, info) {
    console.assert(gd.obj instanceof blocks.Block, "goal is not a block");

    // move to the block
    if (util.l2dist(this.topleft(), gd.dest) > (0.25 * players.Player.prototype.height)) {
        this.moveAlongPath(gd, info.pn);
    } else {
        gd.direction = [0.0, 0.0];
    }

    // shoot the block when close
    if (util.l2dist(this.topleft(), gd.dest) < (0.5 * players.Player.prototype.height)) {
        this.shoot(gd);
    }
};

NetworkAI.prototype.updateForBlock = function (gd, info) {
    console.assert(gd.obj instanceof blocks.Block, "update goal is not a block");

    // check if block is alive
    // if block is dead, check for powerup underneath
    if (!gd.obj.alive()) {
        // check if powerup was dropped
        if (gd.obj.powerUpDrop() != null
            && this.weapon() == lasers.Laser) {
            var dest = gd.obj.powerUpDrop().rect().center;
            dest = [parseInt(dest[0] - 0.5 * this.w()),
                    parseInt(dest[1] - 0.5 * this.h())];
            this.setGoal(gd, dest, gd.obj.powerUpDrop(),
                         this._workOnPowerUp, this._updateForPowerUp, info.pn);
        } else {
            this.clearGoal(gd);
        }
    }
};

NetworkAI.prototype.workOnPowerUp = function (gd, info) {
    console.assert(gd.obj instanceof powerUps.PowerUp, "goal is not a pup");

    // move to powerup and pick it up
    this.moveAlongPath(gd, info.pn);
};

NetworkAI.prototype.updateForPowerUp = function (gd, info) {
    if (this.weapon() != lasers.Laser) {
        this.clearGoal(gd);
    }
};

NetworkAI.prototype.workOnEnergy = function (gd, info) {
    console.assert(gd.obj instanceof energyBars.EnergyBar, "goal is not a energy bar");

    // move towards energy
    this.moveAlongPath(gd, info.pn);
};

NetworkAI.prototype.updateForEnergy = function (gd, info) {
    // check if energy is alive
    // if its not alive (picked up), then reset the goal

    if (!gd.obj.alive()) {
        this.clearGoal(gd);
    }
};

NetworkAI.prototype.workOnThreat = function (gd, info) {
    console.assert((gd.obj instanceof lasers.Laser) || (gd.obj instanceof bombs.Bomb), "check workOnThreat");

    this.moveAlongPath(gd, info.pn);

    if (gd.obj instanceof lasers.Laser) {
        var d = 0.5 * (this.w() + gd.obj.rect().width);
        if (util.l2dist(gd.obj.rect().center, this.center()) < (1.5 * d)) {
            gd.dash = true;
        }
    }
};

NetworkAI.prototype.updateForThreat = function (gd, info) {
    if ((util.l2dist(gd.dest, this.topleft())
         < (0.3 * players.Player.prototype.height))
        || !gd.obj.alive()) {
        this.clearGoal(gd);
    }
};


NetworkAI.prototype.getGoal = function (gd, info) {
    // determine what the most important action is
    //
    // set the goal flag and related fields
    //
    // don't forget to assign workOnGoal to the appropriate
    // workOn* function
    throw {name: "NotImplementedError", message: "getGoal() must be overridden"};
};

NetworkAI.prototype.breakGoal = function (gd, info) {
    // check if more immediate actions are necesary
    // are there laser threats?
    // are there bomb threats?
    // is the player close by and I'm shooting a block?
    // etc.

    // also, check if stuck (i.e. can't reach a powerup)

    // reset goal flag and related fields
    throw {name: "NotImplementedError", message: "breakGoal() must be overridden"};
};

NetworkAI.prototype.tick = function (info, dryRun) {
    dryRun = typeof dryRun !== 'undefined' ? dryRun : false;

    var gd;
    if (dryRun) {
        console.log("cpy")
        gd = this._gd.copy();
        var state = util.seed; // store current seed number...
    } else {
        gd = this._gd;
    }


    if (this._player.alive()) {
        // set player actions to default
        gd.direction = [0, 0];
        gd.shoot = false;
        gd.dash = false;

        this.getThreats(gd, info);
        // if no goal or break goal, then get a new goal

        if (!gd.hasGoal || this.breakGoal(gd, info)) {
            this.getGoal(gd, info);
        } else if (gd.hasGoal) {
            // check for any updates on goal
            gd.updateForGoal(gd, info);
        }
        if (gd.hasGoal) {
            // work on the goal
            gd.workOnGoal(gd, info);
        }

        if (this.opp().alive()) {
            if (this.openShot(info)) {
                this.shoot(gd);
            }
        }
        gd.shootCounter -= 1;
    } else {
        this.clearGoal(gd);
    }

    if (dryRun) {
        util.seed = state; // reset seed
        return gd;
    } else {
        this.player().setDirection(gd.direction);
        if (gd.shoot) {
            this.player().shoot();
        }
        if (gd.dash) {
            this.player().dash();
        }
    }
};

exports.NetworkAI = NetworkAI;
exports.GoalData = GoalData;
