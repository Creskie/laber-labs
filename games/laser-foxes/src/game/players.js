var gameObj = require("./gameObj.js");
var util = require("./utilities.js");
var lasers = require("./lasers.js");
var bombs = require("./bombs.js");
var energyMeters = require("./energyMeters.js");
var rects = require("./rects.js");
var blocks = require("./blocks.js");

function Player(centerx, centery, evm, isHuman) {
    gameObj.GameObj.call(this, centerx, centery, evm);

    this._faceRight = true;

    this._opp = null;

    this._direction = [0, 0];
    this._shoot = false;
    this._dash = false;
    this._hit = false;
    this._pickedUpPowerUp = false;
    this._powerUpType = null;
    this._pickedUpEnergy = false;

    this._hasShield = false;
    this._shieldTime = 0;

    this._triggerTime = 0;
    this._bombTime = 0;

    this._isStunned = false;

    this._dashFor = 0;

    this._speed = this._upf;
    this._lives = this._maxLives;
    this._weapon = lasers.Laser;
    this._weaponUses = Infinity;
    this._weaponObj = null;


    this._em = new energyMeters.EnergyMeter;

    this._isHuman = isHuman;

    this.summary = {
        'livesLeft': this._maxLives,
        'pixelsTravelled': 0,
        'lasersShot': 0,
        'blocksDestroyed': 0,
        'pupsCollected': 0
    };
}

Player.prototype = Object.create(gameObj.GameObj.prototype);
Player.prototype.constructor = Player;

Player.prototype.width = 200;
Player.prototype.height = 150;

Player.prototype._maxLives = 10;
Player.prototype._upf = 40;
Player.prototype._dashBoost = 5.0;
Player.prototype._dashLen = 3;

Player.prototype._respawnTime = 60;

Player.prototype.x = function () {
    return this.rect().x;
};

Player.prototype.y = function () {
    return this.rect().y;
};

Player.prototype.w = function () {
    return this.rect().w;
};

Player.prototype.h = function () {
    return this.rect().h;
};

Player.prototype.topleft = function () {
    return [this.rect().x, this.rect().y];
};

Player.prototype.top = function () {
    return this.rect().y;
};

Player.prototype.topright = function () {
    return [this.rect().x + this.rect().w, this.rect().y];
};

Player.prototype.right = function () {
    return this.rect().x + this.rect().w;
};

Player.prototype.bottomright = function () {
    return [this.rect().x + this.rect().w, this.rect().y + this.rect().h]
};

Player.prototype.bottom = function () {
    return this.rect().y + this.rect().h;
};

Player.prototype.bottomleft = function () {
    return [this.rect().x, this.rect().y + this.rect().h];
};

Player.prototype.left = function () {
    return this.rect().x;
};

Player.prototype.center = function () {
    return [this.rect().x + 0.5 * this.rect().w,
            this.rect().y + 0.5 * this.rect().h];
};

Player.prototype.centerx = function () {
    return this.rect().x + 0.5 * this.rect().w;
};

Player.prototype.centery = function () {
    return this.rect().y + 0.5 * this.rect().h;
};

Player.prototype.midtop = function () {
    return [this.rect().centerx, this.rect().top];
};

Player.prototype.midright = function () {
    return [this.rect().right, this.rect().centery];
};

Player.prototype.midbottom = function () {
    return [this.rect().centerx, this.rect().bottom];
};

Player.prototype.midleft = function () {
    return [this.rect().left, this.rect().centery];
};

Player.prototype.lives = function () {
    return this._lives;
};

Player.prototype.isHuman = function () {
    return this._isHuman;
};

Player.prototype.faceRight = function () {
    return this._faceRight;
};

Player.prototype.opp = function () {
    return this._opp;
};

Player.prototype.weapon = function () {
    return this._weapon;
};

Player.prototype.pickedUpPowerUp = function () {
    return this._pickedUpPowerUp;
};

Player.prototype.powerUpType = function () {
    return this._powerUpType;
};

Player.prototype.weaponUses = function () {
    return this._weaponUses;
};

Player.prototype.em = function () {
    return this._em;
};

Player.prototype.energy = function () {
    return this._em.energy();
};

Player.prototype.setOpp = function (opp) {
    this._opp = opp;
    this.updateFaceRight();
};

Player.prototype.setDirection = function (direction) {
    this._direction = direction;
};

Player.prototype.updateFaceRight = function () {
    this._faceRight = this.rect().centerx < this._opp.rect().centerx;
};

Player.prototype.hasPowerUp = function () {
    return this._weapon != lasers.Laser || this._hasTrigger || this._hasShield;
};

Player.prototype.hit = function () {
    if (!this._hasShield) {
        this._lives -= 1;
        this.summary['livesLeft']--;

        if (this._alive) {
            this._evm.deadObj.put(this);
        }

        this._alive = false;

        this._deadFor = this._respawnTime; //todo: did not init

        this._hit = true;
    }
};

Player.prototype.respawn = function (info) {
    if (!this._alive && this._lives > 0) {
        if (this._deadFor == 0) {
            var safe = false;

            checksafety:
                while (!safe) {
                    var topleft = util.randchoice(info.pn.vs)['xy'];
                    var rect = new rects.Rect(topleft[0], topleft[1],
                        this.width, this.height);

                    if (rect.collide(this._opp.rect())
                        || (util.l2dist(rect.topleft, this._opp.topleft())
                            < this.maxX * 0.25)) {
                        continue;
                    }
                    // the safest way to iterate over lists... :(

                    for (var i = 0; i < info.blocks.length; i++) {
                        if (rect.collide(info.blocks[i].rect())) {
                            continue checksafety;
                        }
                    }

                    for (var i = 0; i < info.powerUps.length; i++) {
                        if (rect.collide(info.powerUps[i].rect())) {
                            continue checksafety;
                        }
                    }

                    for (var i = 0; i < info.bombs.length; i++) {
                        if (rect.collide(info.bombs[i].rect())) {
                            continue checksafety;
                        }
                    }

                    for (var i = 0; i < info.lasers.length; i++) {
                        if (rect.collide(info.lasers[i].rect())) {
                            continue checksafety;
                        }
                    }

                    for (var i = 0; i < info.energyBars.length; i++) {
                        if (rect.collide(info.energyBars[i].rect())) {
                            continue checksafety;
                        }
                    }
                    safe = true;
                }

            this.rect().x = rect.x;
            this.rect().y = rect.y;

            this._x = this.rect().x;
            this._y = this.rect().y;

            this._alive = true;
            this._evm.newObj.put(this);
        }
        else {
            this._deadFor -= 1;
        }
    }
};

Player.prototype.shoot = function () {
    this._shoot = true;
    this.summary['lasersShot']++;
};

Player.prototype.dash = function () {
    if (this._em.avail(1)) {
        this._em.use(1);
        this._dash = true;
        this._dashFor = this._dashLen;
    }
};

Player.prototype.makeDash = function () {
    if ((this._dash && this._em.avail(1)) || this._dashFor > 0) {
        this._speed = this._upf * this._dashBoost;
        this._dashFor -= 1;
    }
    else if (this._dashFor == 0) {
        this._speed = this._upf;
    }
};

Player.prototype.hasShield = function () {
    return this._hasShield;
}

Player.prototype.pickup = function (weapon, uses, energy) {
    if (weapon == "shield") {
        this._hasShield = true;
        this._shieldTime = 300; // 5 seconds
        this._em.setUnlimited(300); // fill energy
        this._powerUpType = "shield";
    } else {
        console.assert(uses > 0, "powerup uses < 0");

        if (this._weapon != lasers.Laser) { // todo: not sure if right syntax??
            return false;
        }

        this._weapon = weapon;
        this._weaponUses = uses;
        this._em.add(energy);

        this._pickedUpPowerUp = true;
        this._powerUpType = this._weapon;
        this.summary['pupsCollected']++;

        if (this._weapon == bombs.Bomb) {
            this._bombTime = 60;
        }
    }

    return true;
};

Player.prototype.add = function (amount) {
    amount = typeof amount !== 'undefined' ? amount : 1;
    this._em.add(amount);
    this._pickedUpEnergy = true;
};

Player.prototype.makeShot = function (info) {
    if (this._shoot && this._weaponUses > 0 && this._em.avail(1)) {
        this._em.use(1);


        if (this.faceRight()) {
            var centerx = this.rect().right +
                          0.5 * this._weapon.prototype.width;
            var centery = this.rect().centery;
        }
        else {
            var centerx = this.rect().left - 0.5 * this._weapon.prototype.width;
            var centery = this.rect().centery;
        }

        if (this._weapon == bombs.Grenade && this._weaponUses == 1) {
            this._weaponObj.activate();
            this._weaponObj = null;
        } else {
            this._weaponObj =
                this._weapon.shoot(centerx, centery, this._evm, this, info);

            if (this._weapon == bombs.Grenade) {
                this._hasTrigger = true;
                this._triggerTime = 60;
            }
        }

        this._weaponUses -= 1;

        if (this._weaponUses == 0) {
            this._weapon = lasers.Laser;
            this._weaponUses = Infinity;
        }
    }
};

Player.prototype.move = function (info, dryrun) {
    dryrun = typeof dryrun !== 'undefined' ? dryrun : false;

    var x = this._x;
    var y = this._y;

    var rect = new rects.Rect(this.rect().x, this.rect().y,
        this.rect().w, this.rect().h);

    if (Math.abs(this._direction[0] + this._direction[1]) == 2) {
        this._speed *= Math.sqrt(2.0) / 2.0;
    }

    var lastX = x;
    var lastY = y;

    x += this._speed * this._direction[0];
    y += this._speed * this._direction[1];

    x = Math.max(Math.min(x, this.maxX - this.width), 0);
    y = Math.max(Math.min(y, this.maxY - this.height), 0);

    // move in x direction
    rect.x = x;

    var adjX = 0;
    for (var i = 0; i < info.blocks.length; i++) {
        var b = info.blocks[i];
        if (b.alive() && rect.collide(b.rect())) {
            if (b instanceof blocks.MovingBlock && b._move) {
                continue;
            }

            if (this._direction[0] == 1) {
                // need to move leftwards (negative value)
                adjX = -Math.max(Math.abs(adjX),
                                 Math.abs(b.rect().left - rect.right));
            }
            else if (this._direction[0] == -1) {
                adjX = Math.max(Math.abs(adjX),
                                Math.abs(b.rect().right - rect.left))
            }
        }
    }

    if (this._opp.alive() && rect.collide(this._opp.rect())) {
        if (this._direction[0] == 1) {
            adjX = -Math.max(Math.abs(adjX),
                             Math.abs(this._opp.rect().left - rect.right))
        }
        else if (this._direction[0] == -1) {
            adjX = Math.max(Math.abs(adjX),
                            Math.abs(this._opp.rect().right - rect.left))
        }
    }

    if (adjX != 0) {
        rect.x = rect.x + adjX;
        x = rect.x;
    }

    // move in y direction
    rect.y = y;

    var adjY = 0;
    for (var i = 0; i < info.blocks.length; i++) {
        var b = info.blocks[i];
        if (b.alive() && rect.collide(b.rect())) {
            if (b instanceof blocks.MovingBlock && b._move) {
                continue;
            }

            if (this._direction[1] == 1) {
                adjY = -Math.max(Math.abs(adjY),
                                 Math.abs(b.rect().top - rect.bottom))
            }
            else if (this._direction[1] == -1) {
                adjY = Math.max(Math.abs(adjY),
                                Math.abs(b.rect().bottom - rect.top))
            }
        }
    }

    if (this._opp.alive() && rect.collide(this._opp.rect())) {
        if (this._direction[1] == 1) {
            adjY = -Math.max(Math.abs(adjY),
                             Math.abs(this._opp.rect().top - rect.bottom))
        }
        else if (this._direction[1] == -1) {
            adjY = Math.max(Math.abs(adjY),
                            Math.abs(this._opp.rect().bottom - rect.top))
        }
    }

    if (adjY != 0) {
        rect.y = rect.y + adjY;
        y = rect.y;
    }

    if (!dryrun) {
        this._rect = rect;
        this._x = x;
        this._y = y;
        this.summary['pixelsTravelled'] += util.l2dist([x, y], [lastX, lastY]);
    }
    else {
        return [[x, y], rect];
    }

};


Player.prototype.reset = function () {
    this._shoot = false;
    this._dash = false;
    this._hit = false;
    this._pickedUpPowerUp = false;
    this._pickedUpEnergy = false;
    this.setDirection([0, 0]);
};

Player.prototype.tick = function (info) {
    this.respawn(info);

    this._em.tick(info);

    if (!this._isStunned) {
        this.makeShot(info);
        this.makeDash();

        this.move(info);
    }

    this.updateFaceRight();

    if (this._hasShield) {
        --this._shieldTime;
        if (this._shieldTime == 0) {
            this._hasShield = false;
        }
    }
};

exports.Player = Player;
