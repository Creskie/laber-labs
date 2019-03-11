var gameObj = require("./gameObj.js");
var util = require("./utilities.js");
var lasers = require("./lasers.js");
var bombs = require("./bombs.js");

function PowerUp(centerx, centery, evm) {
    gameObj.GameObj.call(this, centerx, centery, evm);
}


PowerUp.prototype = Object.create(gameObj.GameObj.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.width = 80;
PowerUp.prototype.height = 80;
PowerUp.prototype.uses = null;
PowerUp.prototype.weapon = null;
PowerUp.prototype.energy = 2;

PowerUp.prototype.tick = function (info) {
    for (var i = 0; i < info.players.length; i++) {
        var p = info.players[i];
        if (this.rect().collide(p.rect())) {
            if (p.pickup(this.weapon, this.uses, this.energy)) {
                this._alive = false;
                this._evm.deadObj.put(this);
                break;
            }
        }
    }
};


function PenetratingPowerUp(centerx, centery, evm) {
    PowerUp.call(this, centerx, centery, evm);
    this.weapon = lasers.PenetratingLaser;
    this.uses = 3;
}

PenetratingPowerUp.prototype = Object.create(PowerUp.prototype);
PenetratingPowerUp.prototype.constructor = PenetratingPowerUp;


function MultiPowerUp(centerx, centery, evm) {
    PowerUp.call(this, centerx, centery, evm);
    this.weapon = lasers.MultiLaser;
    this.uses = 3;
}

MultiPowerUp.prototype = Object.create(PowerUp.prototype);
MultiPowerUp.prototype.constructor = MultiPowerUp;

function BombPowerUp(centerx, centery, evm) {
    PowerUp.call(this, centerx, centery, evm);
    this.weapon = bombs.Bomb;
    this.uses = 1;
}

BombPowerUp.prototype = Object.create(PowerUp.prototype);
BombPowerUp.prototype.constructor = BombPowerUp;

function GrenadePowerUp(centerx, centery, evm) {
    PowerUp.call(this, centerx, centery, evm);
    this.weapon = bombs.Grenade;
    this.uses = 2;
}

GrenadePowerUp.prototype = Object.create(PowerUp.prototype);
GrenadePowerUp.prototype.constructor = GrenadePowerUp;

function ShieldPowerUp(centerx, centery, evm) {
    PowerUp.call(this, centerx, centery, evm);
    this.weapon = "shield";
    this.uses = undefined;
}

ShieldPowerUp.prototype = Object.create(PowerUp.prototype);
ShieldPowerUp.prototype.constructor = ShieldPowerUp;

function randomPowerUp() {
    return util.randchoice(
        [PenetratingPowerUp, MultiPowerUp, GrenadePowerUp, ShieldPowerUp]);
}

exports.PowerUp = PowerUp;
exports.PenetratingPowerUp = PenetratingPowerUp;
exports.MultiPowerUp = MultiPowerUp;
exports.BombPowerUp = BombPowerUp;
exports.GrenadePowerUp = GrenadePowerUp;
exports.ShieldPowerUp = ShieldPowerUp;
exports.randomPowerUp = randomPowerUp;
