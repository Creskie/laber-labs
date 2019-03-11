var util = require("./utilities.js");

function Controller(player) {
    this._player = player;
}

Controller.prototype._directions = [[-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]];

Controller.prototype.reset = function () {
    this._player.setDirection([0, 0]);
};

Controller.prototype.tick = function (info) {
    this.reset();
};

Controller.prototype.x = function () {
    return this._player.x();
};

Controller.prototype.y = function () {
    return this._player.y();
};

Controller.prototype.w = function () {
    return this._player.w();
};

Controller.prototype.h = function () {
    return this._player.h();
};


Controller.prototype.topleft = function () {
    return [this._player.x(), this._player.y()];
};

Controller.prototype.top = function () {
    return this._player.y();
};

Controller.prototype.topright = function () {
    return [this._player.x() + this._player.w(), this._player.y()];
};

Controller.prototype.right = function () {
    return this._player.x() + this._player.w();
};

Controller.prototype.bottomright = function () {
    return [this._player.x() + this._player.w(),
        this._player.y() + this._player.h()];
};

Controller.prototype.bottom = function () {
    return this._player.y() + this._player.h();
};

Controller.prototype.bottomleft = function () {
    return [this._player.x(), this._player.y() + this._player.h()];
};

Controller.prototype.left = function () {
    return this._player.x();
};

Controller.prototype.center = function () {
    return [this._player.x() + 0.5 * this._player.w(),
        this._player.y() + 0.5 * this._player.h()];
};

Controller.prototype.centerx = function () {
    return this._player.x() + 0.5 * this._player.w();
};

Controller.prototype.centery = function () {
    return this._player.y() + 0.5 * this._player.h();
};

Controller.prototype.midtop = function () {
    return [this._player.centerx(), this._player.top()];
};

Controller.prototype.midright = function () {
    return [this._player.right(), this._player.centery()];
};

Controller.prototype.midbottom = function () {
    return [this._player.centerx(), this._player.bottom()];
};

Controller.prototype.midleft = function () {
    return [this._player.left(), this._player.centery()];
};

Controller.prototype.faceRight = function () {
    return this._player.faceRight();
};

Controller.prototype.weapon = function () {
    return this._player.weapon();
};

Controller.prototype.player = function () {
    return this._player;
};

Controller.prototype.opp = function () {
    return this._player.opp();
};


function RandomController(player) {
    Controller.call(this, player);
    this._skipEvery = 50; // skip every 50 frames
    this._curDirection = [0, 0];
}

RandomController.prototype = Object.create(Controller.prototype);
RandomController.prototype.constructor = RandomController;

RandomController.prototype.tick = function (info) {
    this._skipEvery -= 1;

    if (this._skipEvery == 0) {
        this._curDirection = util.randchoice(this._directions);
        this._skipEvery = 50;
    }
    this._player.setDirection(this._curDirection);

    if (util.rand() < 0.1) {
        this._player.shoot();
    }
};

exports.Controller = Controller;
exports.RandomController = RandomController;