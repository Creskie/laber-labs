var util = require("./utilities.js");
var controllers = require("./controllers.js");
var foragerAI = require("./foragerAI.js");
var camperAI = require("./camperAI.js");
var evaderAI = require("./evaderAI.js");
var aggressorAI = require("./aggressorAI.js");
var players = require("./players.js");
var energyMeters = require("./energyMeters.js");
var bombs = require("./bombs.js");
var lasers = require("./lasers.js");
var rects = require("./rects.js");

function argmax(arr) {
    return Object.keys(arr).reduce(function (a, b) {
        return arr[a] > arr[b] ? a : b;
    });
}

function FeatureController(player, coef) {
    controllers.Controller.call(this, player);

    this._faces = [];
    this._faces.push(new foragerAI.ForagerAI(player));
    this._faces.push(new aggressorAI.AggressorAI(player));
    this._faces.push(new camperAI.CamperAI(player));
    this._faces.push(new evaderAI.EvaderAI(player));

    this._coef = coef;

    console.assert(coef.length == this._faces.length, "coef length != num ai");

    this._switchLimit = 300; // 150 in python
    this._switchCounter = this._switchLimit;


    this.current = this._faces[1];
}

FeatureController.prototype = Object.create(controllers.Controller.prototype);
FeatureController.prototype.constructor = FeatureController;

// FeatureController.prototype.controlPlayer = function (player) {
//
// };

FeatureController.prototype.numFeatures = function () {
    return 7;
};

FeatureController.prototype.getThreats = function (info) {
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
    return [laserThreats, bombThreats];
};


FeatureController.prototype.getFeatures = function (info) {
    // intercept
    var feat = [1.0];

    // opp alive and dist
    if (this.opp()._alive) {
        feat.push(0.0);

        var start = info.pn.closestNodeTo(this.topleft()[0], this.topleft()[1]);
        var end = info.pn.closestNodeTo(this.opp().topleft()[0],
                                        this.opp().topleft()[1]);


        var path = info.pn.shortestPath(start.index, end.index);
        var dist = 0.0;

        for (var i = 0; i < (path.length - 1); i++) {
            dist += util.l2dist(info.pn.vs[path[i]].xy,
                                info.pn.vs[path[i + 1]].xy);
        }

        // center and scale distance
        var maxDist = players.Player.prototype.maxX +
                      players.Player.prototype.maxY;

        dist /= maxDist; // scale
        dist -= 0.5; // center

        feat.push(dist);
    } else {
        feat.push(1.0);
        feat.push(0.0);
    }

    // holding a powerup
    if (this._player._powerUpType == null) {
        feat.push(0.0);
    } else {
        feat.push(1.0);
    }

    // your energy
    feat.push(parseFloat(this._player.energy()) /
              parseFloat(energyMeters.EnergyMeter.prototype.maxEnergy) - .5);

    // their energy
    feat.push(parseFloat(this._player.opp().energy()) /
              parseFloat(energyMeters.EnergyMeter.prototype.maxEnergy) - .5);


    // threatened
    var threats = this.getThreats(info);
    var lasers = threats[0];
    var bomb = threats[1];

    if (lasers == null || bomb != null)
        feat.push(1.0);
    else
        feat.push(0.0);

    console.assert(feat.length == this.numFeatures());

    return feat;
};

FeatureController.prototype.switch = function (info) {
    var feat = this.getFeatures(info);

    var probs = [];
    for (var c in this._coef)
        probs.push(util.dot(this._coef[c], feat));


    for (var i = 0; i < probs.length; i++) {
        if (probs[i] == Infinity) {
            this.current = this._faces[argmax(probs)];
            return;
        }
    }

    for (var i = 0; i < probs.length; i++) {
        probs[i] = Math.exp(probs[i]);
    }


    for (var i = 0; i < probs.length; i++) {
        if (probs[i] == Infinity || probs.reduce(util.add, 0)) {
            this.current = this._faces[argmax(probs)];
            return;
        }
    }

    var sump = probs.reduce(util.add, 0);
    var probs = probs.map(function (x) {
        return x / sump;
    });

    this.current = util.randchoice_w(this._faces, probs);
};

FeatureController.prototype.tick = function (info) {
    if (this._switchCounter == 0) {
        this.current.reset();
        this.switch(info);
        this._switchCounter = this._switchLimit;
    } else
        this._switchCounter -= 1;

    this.current.tick(info);
};

FeatureController.prototype.reset = function() {
    controllers.Controller.prototype.reset.call(this);
    for(var i = 0; i < faces.length; ++i) {
        this._faces[i].reset();
    }
}

exports.FeatureController = FeatureController;
