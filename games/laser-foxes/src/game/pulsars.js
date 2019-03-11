var gameObj = require("./gameObj.js");
var util = require("./utilities.js");

function Pulsar(centerx, centery, evm) {
    gameObj.GameObj.call(this, centerx, centery, evm);

    this._warmUpTime = 120;
    this._stunTime = 180;
    this._evm = evm;
}

Pulsar.prototype = Object.create(gameObj.GameObj.prototype);
Pulsar.prototype.constructor.Pulsar;

Pulsar.prototype.width = 200;
Pulsar.prototype.height = 200;
Pulsar.prototype.range = 400;


Pulsar.prototype.tick = function (info) {
    if (this._warmUpTime == 0 && this._stunTime > 0) {
        for (var i = 0; i < info["players"].length; i++) {
            if (util.l2dist(this._rect.center, info["players"][i].center())
                < this.range) {
                if (!info["players"][i]._hasShield) {
                    info["players"][i]._isStunned = true;
                    new ElectricField(this._rect.centerx, this._rect.centery,
                        this._evm, this._stunTime);
                }
            }
        }

        --this._stunTime;
    } else if (this._warmUpTime > 0) {
        --this._warmUpTime;
    } else {
        this._evm.deadObj.put(this);
    }
};


function ElectricField(centerx, centery, evm, endTime) {
    gameObj.GameObj.call(this, centerx, centery, evm);
    this.endTime = endTime;
}

ElectricField.prototype = Object.create(gameObj.GameObj.prototype);
ElectricField.prototype.constructor.ElectricField;

ElectricField.prototype.width = 400;
ElectricField.prototype.height = 400;

ElectricField.prototype.tick = function (info) {
    if (this.endTime > 0)
        --this.endTime;
    else
        this._evm.deadObj.put(this);
};

exports.Pulsar = Pulsar;
exports.ElectricField = ElectricField;
