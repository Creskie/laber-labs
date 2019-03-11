var rects = require("./rects.js");
var uniqueID = 0;

var GameObj = function (centerx, centery, evm) {

    this._x = centerx - 0.5 * this.width;
    this._y = centery - 0.5 * this.height;

    this._evm = evm;
    evm.newObj.put(this);

    this._rect = new rects.Rect(this._x, this._y, this.width, this.height);
    this._alive = true;
    this.id = uniqueID++;

};

GameObj.prototype.height = null;
GameObj.prototype.width = null;
GameObj.prototype.maxX = 13 * 400;
GameObj.prototype.maxY = 7 * 400;

GameObj.prototype.alive = function () {
    return this._alive;
};

GameObj.prototype.rect = function () {
    return this._rect;
};

exports.GameObj = GameObj;