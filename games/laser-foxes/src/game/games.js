var energyBars = require("./energyBars.js");
var energyMeters = require("./energyMeters.js");
var util = require("./utilities.js");
var rects = require("./rects.js");
var powerUps = require("./powerUps.js");
var lasers = require("./lasers.js");
var players = require("./players.js");
var bombs = require("./bombs.js");
var blocks = require("./blocks.js");
var pulsars = require("./pulsars.js");
var pointNetwork = require("./pointNetwork.js");
var Set = require("es6-set");


function Game(c1, c2, p1, p2, blocks, evm) {
    this._c1 = c1;
    this._c2 = c2;
    this._p1 = p1;
    this._p2 = p2;

    this._blocks = [];
    this._deadBlocks = [];
    this._lasers = [];
    this._bombs = [];
    this._pulsars = [];
    this._electricFields = [];
    this._powerUps = [];
    this._energyBars = [];
    this._pn = new pointNetwork.PointNetwork();
    this._pn.generate(50, 40, this._blocks);
    //this._pn = null;

    this._evm = evm;

    //this._info = {
    //    "players": [this._p1, this._p2],
    //    "controllers": [this._c1, this._c2],
    //    "blocks": this._blocks,
    //    "lasers": this._lasers,
    //    "bombs": this._bombs,
    //    "powerUps": this._powerUps,
    //    "energyBars": this._energyBars,
    //    "pn": this._pn,
    //    "frame": 0
    //};

    this._info = {
        "players": [],
        "controllers": [this._c1, this._c2],
        "blocks": this._blocks,
        "lasers": this._lasers,
        "bombs": this._bombs,
        "pulsars": this._pulsars,
        "electricFields": this._electricFields,
        "powerUps": this._powerUps,
        "energyBars": this._energyBars,
        "pn": this._pn,
        "frame": 0
    };
    this._viewer = null;
    this._frameCap = null;
    this._extraFn = null;
}

Game.prototype.frame = function () {
    return this._info.frame;
};

Game.prototype.addNew = function () {
    var objList = [];

    while (!this._evm.newObj.empty()) {
        var obj = this._evm.newObj.remove();

        if (obj instanceof lasers.Laser) {
            this._info.lasers.push(obj);
        }
        else if (obj instanceof bombs.Bomb) {
            this._info.bombs.push(obj);
        }
        else if (obj instanceof blocks.Block) {
            var idx = this._info.blocks.indexOf(obj);
            if (idx == -1) {
                this._info.blocks.push(obj);

                this._info.pn.occupy(obj.rect());
            }
        }
        else if (obj instanceof pulsars.Pulsar) {
            this._info.pulsars.push(obj);
        }
        else if (obj instanceof players.Player) {
            this._info.players.push(obj);
        }
        else if (obj instanceof powerUps.PowerUp) {
            this._info.powerUps.push(obj);
        }
        else if (obj instanceof energyBars.EnergyBar) {
            this._info.energyBars.push(obj);
        }
        else if (obj instanceof pulsars.ElectricField) {
            this._info.electricFields.push(obj);
        }
        else {
            alert("Do not know how to handle object of type " +
                  obj.constructor.name)
        }

        objList.push(obj);
    }

    return objList;
};

Game.prototype.removeDead = function () {
    var objList = [];

    while (!this._evm.deadObj.empty()) {
        var obj = this._evm.deadObj.remove();
        var idx = null;

        if (obj instanceof lasers.Laser) {
            idx = this._info.lasers.indexOf(obj); //will return -1 if not found
            if (idx != -1) {
                this._info.lasers.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof bombs.Bomb) {
            idx = this._info.bombs.indexOf(obj);
            if (idx != -1) {
                this._info.bombs.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof pulsars.Pulsar) {
            idx = this._info.pulsars.indexOf(obj);
            if (idx != -1) {
                this._info.pulsars.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof blocks.Block) {
            idx = this._info.blocks.indexOf(obj);
            if (idx != -1) {
                this._info.blocks.splice(idx, 1);
                this._deadBlocks.push(obj);

                // release the points in the network
                this._info.pn.release(obj.rect());
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof pulsars.ElectricField) {
            idx = this._info.electricFields.indexOf(obj);
            if (idx != -1) {
                this._info.electricFields.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof players.Player) {
            idx = this._info.players.indexOf(obj);
            if (idx != -1) {
                this._info.players.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof powerUps.PowerUp) {
            idx = this._info.powerUps.indexOf(obj);
            if (idx != -1) {
                this._info.powerUps.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else if (obj instanceof energyBars.EnergyBar) {
            idx = this._info.energyBars.indexOf(obj);
            if (idx != -1) {
                this._info.energyBars.splice(idx, 1);
            }
            else {
                alert("object not found in game list");
            }
        }
        else {
            alert("Do not know how to handle object of type " +
                  obj.constructor.name)
        }

        objList.push(obj);
    }
    return objList;
};

Game.prototype.swapBlocks = function (l) {
    if (l == 1) {
        this._blocks = blocks.Block.level1(this._evm);
    } else if (l == 2) {
        this._blocks = blocks.Block.level2(this._evm);
    } else if (l == 3) {
        this._blocks = blocks.Block.level3(this._evm);
    }
    else {
        alert("Invalid Level");
    }
};

Game.prototype.respawnBlocks = function () {
    for (var i = 0; i < this._deadBlocks.length; i++) {
        var b = this._deadBlocks[i];

        if (b.alive()) {
            var idx = this._deadBlocks.indexOf(b);
            if (idx != -1) { // means an alive block is in deadBlocks list
                this._deadBlocks.splice(idx, 1);
            }
            continue;
        }

        outercheck:
            if (util.rand() < b.respawnProb) {
                // make sure respawn is safe
                if (b.rect().collide(this._p1.rect())) {
                    break outercheck;
                }

                if (b.rect().collide(this._p2.rect())) {
                    break outercheck;
                }

                for (var j = 0; j < this._powerUps.length; j++) {
                    if (b.rect().collide(this._powerUps[j].rect())) {
                        break outercheck;
                    }
                }
                for (var j = 0; j < this._bombs.length; j++) {
                    if (b.rect().collide(this._bombs[j].rect())) {
                        break outercheck;
                    }
                }
                for (var j = 0; j < this._lasers.length; j++) {
                    if (b.rect().collide(this._lasers[j].rect())) {
                        break outercheck;
                    }
                }

                for (var j = 0; j < this._energyBars.length; j++) {
                    if (b.rect().collide(this._energyBars[j].rect())) {
                        break outercheck;
                    }
                }
                b.respawn();
            }
    }
};


Game.prototype.spawnEnergyBars = function () {
    var spawnProb = 2.0 / (80.0 + 75.0 * this._energyBars.length);
    if (util.rand() < .5 * spawnProb) {
        var safe = false;
        var maxX = energyBars.EnergyBar.prototype.maxX -
                   energyBars.EnergyBar.prototype.width;
        var maxY = energyBars.EnergyBar.prototype.maxY -
                   energyBars.EnergyBar.prototype.height;

        checksafespawn:
            while (!safe) {
                var rect = new rects.Rect(util.randint(0, maxX), util.randint(0,
                                                                              maxY),
                    energyBars.EnergyBar.prototype.width, energyBars.EnergyBar.prototype.height);

                if (rect.collide(this._p1.rect())) {
                    continue checksafespawn;
                }
                else if (rect.collide(this._p2.rect())) {
                    continue checksafespawn;
                }

                for (var i = 0; i < this._blocks.length; i++) {
                    if (rect.collide(this._blocks[i].rect())) {
                        continue checksafespawn;
                    }
                }

                for (var i = 0; i < this._powerUps.length; i++) {
                    if (rect.collide(this._powerUps[i].rect())) {
                        continue checksafespawn;
                    }
                }
                for (var i = 0; i < this._bombs.length; i++) {
                    if (rect.collide(this._bombs[i].rect())) {
                        continue checksafespawn;
                    }
                }
                for (var i = 0; i < this._lasers.length; i++) {
                    if (rect.collide(this._lasers[i].rect())) {
                        continue checksafespawn;
                    }
                }
                for (var i = 0; i < this._energyBars.length; i++) {
                    if (rect.collide(this._energyBars[i].rect())) {
                        continue checksafespawn;
                    }
                }
                safe = true;
                break;
            }
        new energyBars.EnergyBar(rect.centerx, rect.centery, this._evm);
    }
};


Game.prototype.spawnPulsars = function () {
    if (Math.random() < (1.0 / (60.0 * 10.0))) {
        var pulsar = new pulsars.Pulsar(0, 0, this._evm);
        var validSpot = false;
        while (!validSpot) {
            pulsar._rect.x = Math.random() * pulsars.Pulsar.prototype.maxX;
            pulsar._rect.y = Math.random() * pulsars.Pulsar.prototype.maxY;

            validSpot = true;

            if (validSpot && this._p1._rect.collide(pulsar._rect)) {
                validSpot = false;
            }

            if (validSpot && this._p2._rect.collide(pulsar._rect)) {
                validSpot = false;
            }

            if (validSpot) {
                for (var i = 0; i < this._blocks.length; ++i) {
                    //console.log(this._blocks[i]);
                    //console.log(pulsar);
                    if (this._blocks[i]._rect.collide(pulsar._rect)) {
                        validSpot = false;
                        break;
                    }
                }
            }
        }
    }
};


Game.prototype.loop = function () {
    // console.log("controllers");
    // update controllers
    this._c1.tick(this._info);
    this._c2.tick(this._info);


    // console.log("blocks");
    // update blocks
    for (var i = 0; i < this._blocks.length; i++) {
        this._blocks[i].tick(this._info);
    }

    // console.log("players");
    // update players
    this._p1.tick(this._info);
    this._p2.tick(this._info);


    // console.log("lasers");
    // update lasers
    for (var i = 0; i < this._lasers.length; i++) {
        this._lasers[i].tick(this._info);
    }

    // console.log("bombs");
    // update bombs
    for (var i = 0; i < this._bombs.length; i++) {
        this._bombs[i].tick(this._info);
    }

    // console.log("powerups");
    // update powerups
    for (var i = 0; i < this._powerUps.length; i++) {
        this._powerUps[i].tick(this._info);
    }

    // console.log("energy bars");
    // update energyBars
    for (var i = 0; i < this._energyBars.length; i++) {
        this._energyBars[i].tick(this._info);
    }

    this._p1._isStunned = false;
    this._p2._isStunned = false;
    for (var i = 0; i < this._pulsars.length; i++) {
        this._pulsars[i].tick(this._info);
    }

    for (var i = 0; i < this._electricFields.length; i++) {
        this._electricFields[i].tick(this._info);
    }

    // console.log("respawn blocks");
    this.respawnBlocks();

    // console.log("spawn energy");
    this.spawnEnergyBars();

    this.spawnPulsars();

    // console.log("new objects/dead objects");
    var newObj = this.addNew();
    var deadObj = this.removeDead();

    // console.log("viewer");
    if (this._viewer != null) {
        this._viewer.updateProfiles(this._trace1.probs());
        this._viewer.show(newObj, deadObj, this._info);
    }

    // console.log("extra functions");
    for (var j = 0; j < this._extraFn.length; j++) {
        this._extraFn[j](this._info);
    }

    // console.log("player reset");

    if (this._trace1 != null)
        this._trace1.update();

    if (this._trace2 != null)
        this._trace2.update();

    this._p1.reset();
    this._p2.reset();
    this._info.frame += 1;
    // console.log("end loop");

    //console.log(this._p1.rect());
    //console.log(this._p2.rect());

    return {
        "p1_lives": this._p1.lives(),
        "p2_lives": this._p2.lives(),
        "p1_summary": this._p1.summary,
        "p2_summary": this._p2.summary
    };
};

Game.prototype.run_no_viewer = function () {


    this.swapBlocks(1);
    while (this._p1.lives() > 0 && this._p2.lives() > 0 &&
           this._info.frame < this._frameCap) {
        this.loop();
    }
};

Game.prototype.run_viewer = function () {
    game.state.add('play', require('../viewer/play.js'));
    game.state.add('load', require('../viewer/load.js'));
    game.state.add('levels', require('../viewer/levels.js'));
    game.state.add('menu', require('../viewer/menu.js'));
    game.state.add('credits', require('../viewer/credits.js'));
    game.state.add('gameover', require('../viewer/gameover.js'));
    game.state.add('boot', require('../viewer/boot.js'));
    game.state.start('boot');
};

Game.prototype.restart_viewer = function () {
    game.state.start('play');
};


Game.prototype.run =
    function (viewer, frameCap, extraFn, restart, trace1, trace2) {
        frameCap = typeof frameCap !== 'undefined' ? frameCap : Infinity;
        viewer = typeof viewer !== 'undefined' ? viewer : null;
        extraFn = typeof extraFn !== 'undefined' ? extraFn : [];
        restart = typeof restart !== 'undefined' ? restart : false;
        trace1 = typeof trace1 !== 'undefined' ? trace1 : null;
        trace2 = typeof trace2 !== 'undefined' ? trace2 : null;

        this._frameCap = frameCap;
        this._viewer = viewer;
        this._extraFn = extraFn;

        this._trace1 = trace1;
        this._trace2 = trace2;

        if (this._trace1 != null) {
            this._trace1.nextGame(this, this._c1.constructor.name,
                                  this._c2.constructor.name);
        }

        if (this._trace2 != null) {
            this._trace2.nextGame(this, this._c2.constructor.name,
                                  this._c1.constructor.name);
        }

        if (restart)
            this.restart_viewer();
        else if (this._viewer != null)
            this.run_viewer();
        else
            this.run_no_viewer();
    };


exports.Game = Game;
