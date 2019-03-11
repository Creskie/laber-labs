var gameObj = require("./gameObj.js");

function Laser(centerx, centery, evm, faceRight, owner) {
    gameObj.GameObj.call(this, centerx, centery, evm);
    this._faceRight = faceRight;
    this._owner = owner;
}

Laser.prototype = Object.create(gameObj.GameObj.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.width = 70;
Laser.prototype.height = 13;
Laser.prototype._upf = 80;

Laser.prototype.faceRight = function () {
    return this._faceRight;
};

Laser.prototype.hitPlayers = function (players) {
    // check for collisions with players
    // record if it hit anything to know if the laser should die
    var hitSomething = false;
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.alive && this._owner != p) {
            if (this.rect().collide(p.rect())) {
                hitSomething = true;
                p.hit()
            }
        }
    }
    return hitSomething;
};

Laser.prototype.hitBlocks = function (blocks) {
    // check for collisions with players
    // record if it hit anything to know if the laser should die
    // override this for penetrating lasers to just return False
    var hitSomething = false;
    for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (b.alive() && this.rect().collide(b.rect())) {
            hitSomething = true;
            var killedBlock = b.hit();
            if (killedBlock && this._owner)
                this._owner.summary['blocksDestroyed']++;
        }
    }
    return hitSomething;
};

Laser.prototype.tick = function (info) {
    if (this._faceRight) {
        this._x += this._upf;
    }
    else {
        this._x -= this._upf;
    }

    this._rect.x = this._x;

    var hitSomething = false;
    hitSomething |= this.hitPlayers(info.players);
    hitSomething |= this.hitBlocks(info.blocks);

    if (hitSomething) {
        // Set alive to False.  Then on next round kill it.  don't
        // want to kill it now cause then the viewer won't see it
        // hit anything.  It would vanish before it actually hit
        // the object.
        this._alive = false;
        this._evm.deadObj.put(this);
    }
    else if (this.rect().left > this.maxX || this.rect().right < 0) {
        this._alive = false;
        this._evm.deadObj.put(this);
    }
};

Laser.shoot = function (centerx, centery, evm, owner, info) {
    new Laser(centerx, centery, evm, owner.faceRight(), owner);
};


function MultiLaser(centerx, centery, evm, owner) {
    Laser.call(this, centerx, centery, evm, owner);

}
MultiLaser.prototype = Object.create(Laser.prototype);
MultiLaser.prototype.constructor = MultiLaser;

MultiLaser.shoot = function (centerx, centery, evm, owner, info) {
    new MultiLaser(centerx, centery, evm, owner.faceRight(), owner);
    new MultiLaser(centerx, centery +
        2 * this.prototype.height, evm, owner.faceRight(), owner);
    new MultiLaser(centerx, centery -
        2 * this.prototype.height, evm, owner.faceRight(), owner);
};


function PenetratingLaser(centerx, centery, evm, owner) {
    Laser.call(this, centerx, centery, evm, owner);
}

PenetratingLaser.prototype = Object.create(Laser.prototype);
PenetratingLaser.prototype.constructor = PenetratingLaser;

PenetratingLaser.prototype.hitBlocks = function (blocks) {
    return false;
};

PenetratingLaser.shoot = function (centerx, centery, evm, owner, info) {
    new PenetratingLaser(centerx, centery, evm, owner.faceRight(), owner);
};

exports.Laser = Laser;
exports.MultiLaser = MultiLaser;
exports.PenetratingLaser = PenetratingLaser;