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
var sprites = require("./sprites.js");


function PhaserViewer(scale, fps, debug) {
    debug = typeof debug !== 'undefined' ? debug : false;
    window.game = new Phaser.Game(scale * 16, scale * 9, Phaser.AUTO);
    this._scale = scale;
    this._debug = debug;
}

PhaserViewer.prototype.init = function () {
    //game.time.desiredFps = fps;

    /*
     Arena
     */
    this._arenaXPos = 0;
    this._arenaYPos = 2 * this._scale;
    this._arenaXDim = 13 * this._scale;
    this._arenaYDim = 7 * this._scale;

    this._arenaGroup = game.add.group();
    this._arenaGroup.position =
        new Phaser.Point(this._arenaXPos, this._arenaYPos);
    this._arenaDict = {};

    /*
     Header
     */
    this._headerXPos = 0;
    this._headerYPos = 0;
    this._headerXDim = 13 * this._scale;
    this._headerYDim = 2 * this._scale;

    this._headerGroup = game.add.group();

    /*
     Side panel
     */
    this._sideXPos = 13 * this._scale;
    this._sideYPos = 0;
    this._sideXDim = 3 * this._scale;
    this._sideYDim = 9 * this._scale;

    this._sideGroup = game.add.group();

    this._arenaImg = game.add.sprite(this._arenaXPos, this._arenaYPos, 'bg');
    this._arenaImg.width = this._arenaXDim;
    this._arenaImg.height = this._arenaYDim;


    this._headerImg =
        game.add.sprite(this._headerXPos, this._headerYPos, 'header');
    this._headerImg.width = this._headerXDim;
    this._headerImg.height = this._headerYDim;

    this._sideImg =
        game.add.sprite(this._sideXPos, this._sideYPos, 'sidePanel');
    this._sideImg.width = this._sideXDim;
    this._sideImg.height = this._sideYDim;

    this._backgroundGroup = game.add.group();
    this._backgroundGroup.add(this._arenaImg);
    this._backgroundGroup.add(this._headerImg);
    this._backgroundGroup.add(this._sideImg);
    game.world.sendToBack(this._backgroundGroup);

    //////////////////////// energy
    this._energyImgWidth = parseInt(this._scale * 0.15);
    this._energyImgHeight = parseInt(this._scale * 0.45);
    this._energyImgSep = parseInt(this._scale * 0.012);
    this._energyBarMeterXDim =
        ((this._energyImgWidth + this._energyImgSep) * 8) +
        parseInt(this._scale * 0.1);
    this._energyBarMeterYDim = parseInt(this._scale * 0.5);

    this._energyPos = [[parseInt(.15 * this._scale),
                        this._headerYDim - this._energyBarMeterYDim -
                        parseInt(this._scale * 0.1)],
        [this._headerXDim - this._energyBarMeterXDim,
         this._headerYDim - this._energyBarMeterYDim -
         parseInt(0.15 * this._scale)]];
    this._energyBarMeterLeft =
        game.add.sprite(this._energyPos[0][0], this._energyPos[0][1],
                        'pupstack');
    this._energyBarMeterLeft.width = this._energyBarMeterXDim;
    this._energyBarMeterLeft.height = this._energyBarMeterYDim;

    this._energyBarMeterRight =
        game.add.sprite(this._energyPos[1][0], this._energyPos[1][1],
                        'pupstack');
    this._energyBarMeterRight.width = this._energyBarMeterXDim;
    this._energyBarMeterRight.height = this._energyBarMeterYDim;

    this._pupDim = parseInt(this._scale * 0.19);
    this._pupPos = [[this._energyPos[0][0] + this._energyBarMeterXDim +
                     parseInt(this._scale * 0.2),
                     this._energyPos[0][1] +
                     parseInt((this._energyBarMeterYDim - this._pupDim) * 0.5)],
        [this._energyPos[1][0] - this._pupDim - parseInt(this._scale * 0.2),
         this._energyPos[1][1] +
         parseInt((this._energyBarMeterYDim - this._pupDim) * 0.5)]];

    ///////// clock
    // clock
    this._clockTime = game.time.create();
    this._clockCountDown =
        this._clockTime.add(Phaser.Timer.MINUTE * 3 + Phaser.Timer.SECOND * 30,
                            util.end_time(this._clockTime), this);
    this._p1LivesText = game.add.text(this._scale, parseInt(this._scale * 0.5),
                                      players.Player.prototype._maxLives,
                                      {
                                          font: parseInt(0.5 * this._scale)
                                                    .toString() + "px" + " \"" +
                                                "alarm clock" + "\"",
                                          fill: "#DF740C"
                                      });
    this._p2LivesText =
        game.add.text(this._headerXDim - parseInt(2 * this._scale),
                      parseInt(this._scale * 0.5),
                      players.Player.prototype._maxLives,
                      {
                          font: parseInt(0.5 * this._scale).toString() + "px" +
                                " \"" + "alarm clock" + "\"", fill: "#DF740C"
                      });

    this._clockTimeText =
        game.add.text(parseInt(6.5 * this._scale), this._scale,
                      util.format_time(Math.round(
                          (this._clockCountDown.delay - this._clockTime.ms) /
                          1000)),
                      {
                          font: parseInt(0.7 * this._scale).toString() + "px" +
                                " \"" + "alarm clock" + "\"", fill: "#DF740C"
                      });
    this._clockTimeText.anchor.set(0.5, 0);

    this._energiesLeft = game.add.group();
    this._powerupsLeft = game.add.group();
    this.makeSprites(this._energyPos[0][0], this._energyPos[0][1],
                     this._pupPos[0][0], this._pupPos[0][1], this._energiesLeft,
                     this._powerupsLeft);

    this._spritesRight = game.add.group();
    this._energiesRight = game.add.group();
    this._powerupsRight = game.add.group();
    this.makeSprites(this._energyPos[1][0], this._energyPos[1][1],
                     this._pupPos[1][0], this._pupPos[1][1],
                     this._energiesRight, this._powerupsRight);


    /// add full screen button
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this._fullscreen = game.add.button(game.world.width - (this._scale * .6),
                                       game.world.height - (this._scale * .6),
                                       'fullscreen', this.goFullscreen, this);
    this._fullscreen.anchor.setTo(0.5, 0.5);
    this._fullscreen.width = parseInt(0.4 * this._scale);
    this._fullscreen.height = parseInt(0.4 * this._scale);
    this._fullscreen.onInputOver.add(this.hoverFullScreen, this);
    this._fullscreen.onInputOut.add(this.noHoverFullScreen, this);
    this._fullscreen.inputEnabled = true;
    this._fullscreen.input.useHandCursor = true;

    // add sliders
    this._sliderXPos = this._sideXPos + this._scale * 0.08;
    this._sliderYPos = this._arenaYPos + this._arenaYDim / 3.2;
    this._sliderMinWidth = this._scale * 0.4;
    this._sliderMaxWidth =
        game.world.width - this._sliderXPos - this._scale * 0.8;
    this.sliders =
        [game.add.sprite(this._sliderXPos, this._sliderYPos, 'orange'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * .8), 'orange'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * 1.6), 'orange'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * 2.4), 'orange')];
    this.faces =
        [game.add.sprite(this._sliderXPos, this._sliderYPos, 'squirrel'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * .8), 'rhino'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * 1.6), 'mouse'),
         game.add.sprite(this._sliderXPos, this._sliderYPos +
                                           (this._scale * 2.4), 'rabbit')];

    for (var i = 0; i < this.sliders.length; i++) {
        this.sliders[i].height = this._scale * 0.08;
        this.faces[i].height = this._scale * 0.6;
        this.faces[i].width = this._scale * 0.6;
        this.faces[i].anchor.setTo(0.5, 0.5);
    }

    // gameover stuff
    this._gameover_bg = game.add.sprite(0, 0, 'bg');
    this._gameover_text = game.add.text(parseInt(8 * this._scale),
                                        parseInt(4.5 * this._scale),
                                        "GAME OVER!",
                                        {font: "45px Arial", fill: "#ffffff"});
    this._gameover_text.anchor.set(0.5);
    this._gameover_bg.visible = false;
    this._gameover_text.visible = false;

    // add debug lines

    this._startNode = game.add.graphics(this._arenaXPos, this._arenaYPos);
    this._startNode.beginFill(0x3498DB, 1);
    this._startNode.drawCircle(this._arenaXPos, this._arenaYPos,
                               this._scale * 0.15);

    this._endPoint = game.add.graphics(this._arenaXPos, this._arenaYPos);
    this._endPoint.beginFill(0x8E44AD, 1);
    this._endPoint.drawCircle(this._arenaXPos, this._arenaYPos,
                              this._scale * 0.15);

    this._pathLines = game.add.graphics(this._arenaXPos, this._arenaYPos);
    this._pathLines.lineStyle(1, 0xffd900, 1);
    this._pathLines.beginFill(0xFF700B, 1);

    this._scaleX = this._arenaXDim / players.Player.prototype.maxX;
    this._scaleY = this._arenaYDim / players.Player.prototype.maxY;
    this._gridPoints = [];
    this._alreadyDrawGrid = false;


////////start!
    this._clockTime.start();
}
;

PhaserViewer.prototype.makeSprites = function (x, y, xp, yp, egroup, pgroup) {
    x += parseInt(0.05 * this._scale);
    y += parseInt((this._energyBarMeterYDim - this._energyImgHeight) * 0.5);
    for (var i = 0; i < energyMeters.EnergyMeter.prototype.maxEnergy; i++) {
        var e = game.add.sprite(x, y, 'energy');
        e.width = this._energyImgWidth;
        e.height = this._energyImgHeight;
        egroup.add(e);
        x += this._energyImgWidth + this._energyImgSep;
    }

    var ml = game.add.sprite(xp, yp, 'scatter');
    var pl = game.add.sprite(xp, yp, 'penetrate');
    var bm = game.add.sprite(xp, yp, 'bomb');
    pgroup.addMultiple([ml, pl, bm]);
    pgroup.setAll('width', this._pupDim);
    pgroup.setAll('height', this._pupDim);
};

PhaserViewer.prototype.goFullscreen = function () {
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
        this._fullscreen.loadTexture('fullscreen');
    }
    else {
        game.scale.startFullScreen(false);
        this._fullscreen.loadTexture('downscreen');
    }
};

PhaserViewer.prototype.hoverFullScreen = function () {
    this._fullscreen.width = parseInt(0.3 * this._scale);
    this._fullscreen.height = parseInt(0.3 * this._scale);
};

PhaserViewer.prototype.noHoverFullScreen = function () {
    this._fullscreen.width = parseInt(0.4 * this._scale);
    this._fullscreen.height = parseInt(0.4 * this._scale);
};

PhaserViewer.prototype.drawPointNetworkPath = function (c) {
    this._pathLines.clear();
    this._pathLines.lineStyle(1, 0xffd900, 1);
    if (c != undefined && c._gd.hasGoal) {
        if (c._gd.path.length > 2) {

            this._startNode.x = c._gd.path[0][0] * this._scaleX;
            this._startNode.y = c._gd.path[0][1] * this._scaleY;

            this._pathLines.moveTo(c._gd.path[0][0] * this._scaleX,
                                   c._gd.path[0][1] * this._scaleY);
            for (var p in c._gd.path) {
                var path = c._gd.path[p];
                this._pathLines.lineTo(path[0] * this._scaleX,
                                       path[1] * this._scaleY)
            }
        }
        this._endPoint.x = c._gd.dest[0] * this._scaleX;
        this._endPoint.y = c._gd.dest[1] * this._scaleY;
    } else {
        this._endPoint.x = -100; // move somewhere off screen
        this._endPoint.y = -100;
    }
};


PhaserViewer.prototype.drawGrid = function (pn) {

    if (!this._alreadyDrawGrid) {
        for (var i = 0; i < pn.vs.length; i++) {
            var point = pn.vs[i].xy;
            var pointSprite = game.add.graphics(0, 0);
            pointSprite.beginFill(0xFF0000, 1);
            pointSprite.drawCircle(point[0] * this._scaleX,
                                   point[1] * this._scaleY + this._arenaYPos,
                                   this._scale * 0.05);
            this._gridPoints.push(pointSprite);
        }
        this._alreadyDrawGrid = true;
    }

    for (var i = 0; i < pn.vs.length; i++) {
        // console.log(this._gridPoints[i]);
        if (!pn.vs[i].active) {
            this._gridPoints[i].tint = 0xFF0000;
        } else {
            this._gridPoints[i].tint = 0x27AE60;
        }
    }
};

PhaserViewer.prototype.adjustPlayerMeters = function (p, egroup, pgroup) {
    for (var i = 0; i < energyMeters.EnergyMeter.prototype.maxEnergy; i++) {
        if (i < p.em().energy()) {
            egroup.getAt(i).visible = true;
        }
        else {
            egroup.getAt(i).visible = false;
        }
    }

    if (p.weapon() == lasers.Laser) {
        pgroup.setAll('visible', false);
    } else if (p.weapon() == lasers.MultiLaser) {
        pgroup.getAt(0).visible = true;
    } else if (p.weapon() == lasers.PenetratingLaser) {
        pgroup.getAt(1).visible = true;
    } else if (p.weapon() == bombs.Bomb) {
        pgroup.getAt(2).visible = true;
    } else if (p.weapon() == bombs.Grenade) {
        pgroup.getAt(2).visible = true;
    } else {
        console.log(p.weapon());
        alert("invalid weapon");
    }
};


PhaserViewer.prototype.show = function (newObj, deadObj, info) {
    for (var i = 0; i < newObj.length; i++) {
        var obj = newObj[i];
        var spriteCls = null;
        if (obj instanceof players.Player) {
            spriteCls = sprites.PlayerSprite;
        }
        else if (obj instanceof blocks.Block) {
            spriteCls = sprites.BlockSprite;
        }
        else if (obj instanceof lasers.Laser) {
            if (obj instanceof lasers.MultiLaser)
                spriteCls = sprites.MultiLaserSprite;
            else if (obj instanceof lasers.PenetratingLaser)
                spriteCls = sprites.PenetratingLaserSprite;
            else
                spriteCls = sprites.LaserSprite;
        }
        else if (obj instanceof bombs.Bomb) {
            if (obj instanceof bombs.Grenade)
                spriteCls = sprites.GrenadeSprite;
            else
                spriteCls = sprites.BombSprite;
        }
        else if (obj instanceof powerUps.MultiPowerUp) {
            spriteCls = sprites.MultiPowerUpSprite;
        }
        else if (obj instanceof powerUps.PenetratingPowerUp) {
            spriteCls = sprites.PenetratingPowerUpSprite;
        }
        else if (obj instanceof powerUps.BombPowerUp) {
            spriteCls = sprites.BombPowerUpSprite;
        }
        else if (obj instanceof powerUps.GrenadePowerUp) {
            spriteCls = sprites.GrenadePowerUpSprite;
        }
        else if (obj instanceof powerUps.ShieldPowerUp) {
            spriteCls = sprites.ShieldPowerUpSprite;
        }
        else if (obj instanceof pulsars.Pulsar) {
            spriteCls = sprites.PulsarSprite;
        }
        else if (obj instanceof energyBars.EnergyBar) {
            spriteCls = sprites.EnergyBarSprite;
        } else if (obj instanceof pulsars.ElectricField) {
            spriteCls = sprites.ElectricFieldSprite;
        }
        else {
            alert("Unknown type of sprite.")
        }
        var sprite = new spriteCls(obj, this._arenaXDim, this._arenaYDim);

        game.add.existing(sprite);
        this._arenaGroup.add(sprite);
        this._arenaDict[obj.id] = sprite;
    }

    for (var j = 0; j < deadObj.length; j++) {
        var deadobj = deadObj[j];
        this._arenaDict[deadobj.id].destroy();
        delete this._arenaDict[deadobj.id];
    }

    for (var k = 0; k < info.players.length; k++) {
        var p = info.players[k];
        if (p.isHuman()) {
            this.adjustPlayerMeters(p, this._energiesLeft, this._powerupsLeft);
            this._p1LivesText.text = p.lives().toString();
        }
        else {
            this.adjustPlayerMeters(p, this._energiesRight,
                                    this._powerupsRight);
            this._p2LivesText.text = p.lives().toString();
        }
    }
    if (this._debug) {
        this.drawGrid(info.pn);
        if (info.controllers[1].current != undefined)
            this.drawPointNetworkPath(info.controllers[1].current); // c2 controller
        else {
            this.drawPointNetworkPath(info.controllers[1]);
        }
    }
    this._clockTimeText.text = util.format_time(
        Math.round((this._clockCountDown.delay - this._clockTime.ms) / 1000));
};


PhaserViewer.prototype.updateProfiles = function (p) {
    for (var i = 0; i < this.sliders.length; i++) {
        this.sliders[i].width =
            (p[i] * this._sliderMaxWidth) + this._sliderMinWidth;
        this.faces[i].x = this.sliders[i].width + this._sliderXPos;
    }
};
exports.PhaserViewer = PhaserViewer;
