var gameObj = require("./gameObj.js");

function EnergyBar(centerx, centery, evm) {
    gameObj.GameObj.call(this, centerx, centery, evm);
}

EnergyBar.prototype = Object.create(gameObj.GameObj.prototype);
EnergyBar.prototype.constructor = EnergyBar;

EnergyBar.prototype.width = 60;
EnergyBar.prototype.height = 156;

EnergyBar.prototype.tick = function (info) {
    for (var i = 0; i < info.players.length; i++) {
        if (this.rect().collide(info.players[i].rect())) {
            this._alive = false;
            this._evm.deadObj.put(this);
            info.players[i].add(1);

            break;
        }
    }

    for (var i = 0; i < info.blocks.length; i++) {
        var b = info.blocks[i];
        if (this.rect().collide(b.rect())) {
            this._alive = false;
            this._evm.deadObj.put(this);
            break;
        }
    }
};

exports.EnergyBar = EnergyBar;
