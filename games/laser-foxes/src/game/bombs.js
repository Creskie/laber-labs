var gameObj = require("./gameObj.js");
var rects = require("./rects.js");

function Bomb(centerx, centery, evm) {
    gameObj.GameObj.call(this, centerx, centery, evm);

    this._hitLog = [];
    this._exploding = false;
    this._explodeAfter = 75;

    this._dieAfter = 90;
}

Bomb.prototype = Object.create(gameObj.GameObj.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.width = 80;
Bomb.prototype.height = 80;
Bomb.prototype.explodeScale = 10;

Bomb.prototype.exploding = function () {
    return this._exploding;
};

Bomb.prototype.hitPlayers = function (players) {
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if ((this._hitLog.indexOf(p) == -1 ) && this.rect().collide(p.rect())) {
            p.hit();
            this._hitLog.push(p);
        }
    }
};

Bomb.prototype.hitBlocks = function (blocks) {
    for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if ((this._hitLog.indexOf(b) == -1 ) && (b.alive()) &&
            this.rect().collide(b.rect())) {
            b.hit();
            this._hitLog.push(b);
        }
    }
};


Bomb.prototype.tick = function (info) {
    if (this._explodeAfter == 0 && !this._exploding) {
        this._exploding = true;
        var center = this.rect().center;

        this.rect().w = this.rect().w * this.explodeScale;
        this.rect().h = this.rect().h * this.explodeScale;
        this.rect().center = center;
    }
    else if (!this._exploding) {
        this._explodeAfter -= 1;
    }
    else if (this._exploding) {
        this.hitPlayers(info.players);
        this.hitBlocks(info.blocks);

        if (this._dieAfter == 0) {
            this._alive = false;
            this._evm.deadObj.put(this);
        }
        else {
            this._dieAfter -= 1;
        }
    }
};

Bomb.shoot = function (centerx, centery, evm, owner, info) {
    new Bomb(centerx, centery, evm);
};


function Grenade(centerx, centery, evm, faceRight, owner) {
    Bomb.call(this, centerx, centery, evm);

    this._hitLog = [];
    this._exploding = false;
    this._explodeAfter = 75;

    this._activate = false;
    this._dieAfter = 90;
    this._speed = this.upf;
    this._goalX = -1;
    this._stop = false;
    this._faceRight = faceRight;
    this._owner = owner;
}

Grenade.prototype = Object.create(Bomb.prototype);
Grenade.prototype.constructor = Grenade;

Grenade.prototype.width = 80;
Grenade.prototype.height = 80;
Grenade.prototype.explodeScale = 10;
Grenade.prototype.maxThrowDist = 1400;
Grenade.prototype.upf = 20;

Grenade.prototype.activate = function () {
    this._activate = true;
};
Grenade.prototype.isActivated = function () {
    return this._activate;
};

Grenade.shoot = function (centerx, centery, evm, owner, info) {
    var grenade = new Grenade(centerx, centery, evm, owner.faceRight(), owner);
    if (owner.faceRight()) {
        grenade._goalX =
            Math.min(owner.topright()[0] + this.prototype.maxThrowDist,
                     gameObj.GameObj.prototype.maxX - this.prototype.width);
    } else {
        grenade._goalX =
            Math.max(owner.topleft()[0] - this.prototype.maxThrowDist, 0);
    }

    console.assert(grenade._goalX >= 0 &&
                   grenade._goalX <= gameObj.GameObj.prototype.maxX);
    return grenade;
};


Grenade.prototype.gHitPlayers = function (players) {
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.alive && this._owner != p) {
            if (this.rect().collide(p.rect())) {
                if (this._faceRight)
                    this._goalX =
                        Math.min(p.rect().left - Grenade.prototype.width,
                                 this._goalX);
                else
                    this._goalX =
                        Math.max(p.rect().right + Grenade.prototype.width,
                                 this._goalX);
                return true;
            }
        }
    }
    return false;
};

Grenade.prototype.gHitBlocks = function (blocks) {
    for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (b.alive() && this.rect().collide(b.rect())) {
            if (this._faceRight)
                this._goalX =
                    Math.min(b.rect().left - Grenade.prototype.width,
                             this._goalX);
            else
                this._goalX = Math.max(b.rect().right + Grenade.prototype.width,
                                       this._goalX);
            return true;
        }
    }
    return false;
};

Grenade.prototype.tick = function (info) {
    if (this._activate) {
        if (this._explodeAfter == 0 && !this._exploding) {
            this._exploding = true;
            var center = this.rect().center;

            this.rect().w = this.rect().w * this.explodeScale;
            this.rect().h = this.rect().h * this.explodeScale;
            this.rect().center = center;
        }
        else if (!this._exploding) {
            this._explodeAfter -= 1;
        }
        else if (this._exploding) {
            this.hitPlayers(info.players);
            this.hitBlocks(info.blocks);

            if (this._dieAfter == 0) {
                this._alive = false;
                this._evm.deadObj.put(this);
            }
            else {
                this._dieAfter -= 1;
            }
        }
    }

    if (this._x != this._goalX) {
        if (this._faceRight) {
            this._x += this._speed;
        }
        else {
            this._x -= this._speed;
        }

        this.rect().x = this._x;

        var hitSomething = false;
        hitSomething |= this.gHitPlayers(info.players);
        hitSomething |= this.gHitBlocks(info.blocks);

        if (hitSomething || this._x > gameObj.GameObj.prototype.maxX
            || this._x < 0) {
            this._x = this._goalX;
            this.rect().x = this._x;
        }
    }
};


exports.Bomb = Bomb;
exports.Grenade = Grenade;