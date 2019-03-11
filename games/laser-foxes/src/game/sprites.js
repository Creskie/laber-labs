var util = require("./utilities.js");

Sprite = function (obj, maxX, maxY) {
    var rect = obj.rect();
    Phaser.Sprite.call(this, game, rect.x, rect.y);
    this._obj = obj;
    this.lf_rect = this._obj.rect();
    this._scaleX = maxX / obj.maxX;
    this._scaleY = maxY / obj.maxY;
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.makeRect = function () {
    //this.rect = new Phaser.Rectangle(rect.x * this._scaleX, rect.y *
    // this._scaleY, rect.width * this._scaleX, rect.height * this._scaleY);

    this.x = this.lf_rect.x * this._scaleX;
    this.y = this.lf_rect.y * this._scaleY;
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
};

function PlayerSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this._isHuman = this._obj.isHuman();
    if (this._isHuman) {
        this.loadTexture('p1');
    }
    else {
        this.loadTexture('p2');
    }

    this._shieldUp = false;
    this.makeRect();

    if (this._obj.faceRight()) {
        this.width = -(this.lf_rect.width * this._scaleX);
    }
    else {
        this.width = this.lf_rect.width * this._scaleX;
    }
}
PlayerSprite.prototype = Object.create(Sprite.prototype);
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.prototype.update = function () {
    if (this._obj.hasShield() && !this._shieldUp) {
        if (this._isHuman)
            this.loadTexture("p1_helmet");
        else
            this.loadTexture("p2_helmet");
        this._shieldUp = true;
    }

    if (this._shieldUp && !this._obj.hasShield()) {
        if (this._isHuman) {
            this.loadTexture('p1');
        }
        else {
            this.loadTexture('p2');
        }
        this._shieldUp = false;
    }

    var rect = this._obj.rect();

    this.x = rect.x * this._scaleX;
    this.y = rect.y * this._scaleY;

    if (this._obj.faceRight()) {
        //need to move it right to fix the negative width
        this.x += rect.width * this._scaleX;
        this.width = -(rect.width * this._scaleX);
    }
    else {
        this.width = rect.width * this._scaleX;
    }

    this.height = rect.height * this._scaleY;
};


function BlockSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.orange = util.rand() < 0.5;
    this.makeRect();
    if (this.orange) {
        this.loadTexture('block');
    } else {
        this.loadTexture('block2');
    }

    var rect = this._obj.rect();
    this.width = rect.width * this._scaleX;
    this.height = rect.height * this._scaleY;

    this.lastLives = this._obj.lives();

}
BlockSprite.prototype = Object.create(Sprite.prototype);
BlockSprite.prototype.constructor = BlockSprite;

BlockSprite.prototype.update = function () {
    this.makeRect();
    var hit = this.lastLives != this._obj.lives();
    this.lastLives = this._obj.lives();

    if (this.orange && hit) {
        if (this._obj.lives() == 3) {
            this.loadTexture('block');
        }
        else if (this._obj.lives() == 2) {
            this.loadTexture('block_hit1');
        }
        else if (this._obj.lives() == 1) {
            this.loadTexture('block_hit2');
        }
    }
    else if (hit) {
        if (this._obj.lives() == 3) {
            this.loadTexture('block2');
        }
        else if (this._obj.lives() == 2) {
            this.loadTexture('block2_hit1');
        }
        else if (this._obj.lives() == 1) {
            this.loadTexture('block2_hit2');
        }
    }

    var rect = this._obj.rect();
    this.width = rect.width * this._scaleX;
    this.height = rect.height * this._scaleY;
};


function LaserSprite(laser, maxX, maxY) {
    Sprite.call(this, laser, maxX, maxY);
    this.makeRect();
    this.loadTexture('red');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}
LaserSprite.prototype = Object.create(Sprite.prototype);
LaserSprite.prototype.constructor = LaserSprite;

LaserSprite.prototype.update = function () {
    this.makeRect();
};


function MultiLaserSprite(laser, maxX, maxY) {
    LaserSprite.call(this, laser, maxX, maxY);

    this.makeRect();
    this.loadTexture('blue');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;

}
MultiLaserSprite.prototype = Object.create(LaserSprite.prototype);
MultiLaserSprite.prototype.constructor = MultiLaserSprite;


function PenetratingLaserSprite(player, maxX, maxY) {
    LaserSprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('orange');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}
PenetratingLaserSprite.prototype = Object.create(LaserSprite.prototype);
PenetratingLaserSprite.prototype.constructor = PenetratingLaserSprite;


function PenetratingPowerUpSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('penetrate');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}

PenetratingPowerUpSprite.prototype = Object.create(Sprite.prototype);
PenetratingPowerUpSprite.prototype.constructor = PenetratingPowerUpSprite;
PenetratingPowerUpSprite.prototype.update = function () {
    this.makeRect();
};


function MultiPowerUpSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('scatter');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}
MultiPowerUpSprite.prototype = Object.create(Sprite.prototype);
MultiPowerUpSprite.prototype.constructor = MultiPowerUpSprite;
MultiPowerUpSprite.prototype.update = function () {
    this.makeRect();
};


function BombPowerUpSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('bomb');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}


BombPowerUpSprite.prototype = Object.create(Sprite.prototype);
BombPowerUpSprite.prototype.constructor = BombPowerUpSprite;
BombPowerUpSprite.prototype.update = function () {
    this.makeRect();
};


function BombSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this._colors = [0x27AE60, 0xE74C3C,
                    0xF1C40F, 0x8E44AD, 0x3498DB];
    this.loadTexture('bomb'); //todo
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
    this.swap = false;
}
BombSprite.prototype = Object.create(Sprite.prototype);
BombSprite.prototype.constructor = BombSprite;
BombSprite.prototype.update = function () {
    this.makeRect();
    if (this._obj.exploding()) {
        if (!this.swap) {
            this.loadTexture('white');
            this.makeRect();
            this.swap = true;
        }

        this.tint = util.randchoice(this._colors);
    }
};

function GrenadePowerUpSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('bomb');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}


GrenadePowerUpSprite.prototype = Object.create(Sprite.prototype);
GrenadePowerUpSprite.prototype.constructor = GrenadePowerUpSprite;
GrenadePowerUpSprite.prototype.update = function () {
    this.makeRect();
};


function GrenadeSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this._colors = [0x27AE60, 0xE74C3C,
                    0xF1C40F, 0x8E44AD, 0x3498DB];
    this.loadTexture('white');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
    this.swap = false;
}
GrenadeSprite.prototype = Object.create(Sprite.prototype);
GrenadeSprite.prototype.constructor = GrenadeSprite;
GrenadeSprite.prototype.update = function () {
    this.makeRect();
    if (this._obj.exploding()) {
        if (!this.swap) {
            this.loadTexture('white');
            this.makeRect();
            this.swap = true;
        }

        this.tint = util.randchoice(this._colors);
    } else if (this._obj.isActivated()) {
        this.tint = util.randchoice(this._colors);
    } else {
        this.tint = 0xFF0000;
    }
};

function ShieldPowerUpSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture("shield");
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}

ShieldPowerUpSprite.prototype = Object.create(Sprite.prototype);
ShieldPowerUpSprite.prototype.constructor = ShieldPowerUpSprite;
ShieldPowerUpSprite.prototype.update = function () {
    this.makeRect();
};


function PulsarSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture("pulsar");
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}

PulsarSprite.prototype = Object.create(Sprite.prototype);
PulsarSprite.prototype.constructor = PulsarSprite;
PulsarSprite.prototype.update = function () {
    this.makeRect();
};

function ElectricFieldSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture("electric_field");
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}

ElectricFieldSprite.prototype = Object.create(Sprite.prototype);
ElectricFieldSprite.prototype.constructor = ElectricFieldSprite;
ElectricFieldSprite.prototype.update = function () {
    this.makeRect();
};

function EnergyBarSprite(player, maxX, maxY) {
    Sprite.call(this, player, maxX, maxY);

    this.makeRect();
    this.loadTexture('energy');
    this.lf_rect = this._obj.rect();
    this.width = this.lf_rect.width * this._scaleX;
    this.height = this.lf_rect.height * this._scaleY;
}
EnergyBarSprite.prototype = Object.create(Sprite.prototype);
EnergyBarSprite.prototype.constructor = EnergyBarSprite;
EnergyBarSprite.prototype.update = function () {
    this.makeRect();
};


exports.Sprite = Sprite;
exports.PlayerSprite = PlayerSprite;
exports.BlockSprite = BlockSprite;
exports.LaserSprite = LaserSprite;
exports.MultiLaserSprite = MultiLaserSprite;
exports.PenetratingLaserSprite = PenetratingLaserSprite;
exports.PenetratingPowerUpSprite = PenetratingPowerUpSprite;
exports.MultiPowerUpSprite = MultiPowerUpSprite;
exports.BombPowerUpSprite = BombPowerUpSprite;
exports.BombSprite = BombSprite;
exports.GrenadePowerUpSprite = GrenadePowerUpSprite;
exports.GrenadeSprite = GrenadeSprite;
exports.ShieldPowerUpSprite = ShieldPowerUpSprite;
exports.PulsarSprite = PulsarSprite;
exports.EnergyBarSprite = EnergyBarSprite;
exports.ElectricFieldSprite = ElectricFieldSprite;