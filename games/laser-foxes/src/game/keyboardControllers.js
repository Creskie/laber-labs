var controllers = require("./controllers.js");

function KeyboardController(player, up, down, left, right, shoot, dash) {
    controllers.Controller.call(this, player);

    up = typeof up !== 'undefined' ? up : Phaser.Keyboard.UP;
    down = typeof down !== 'undefined' ? down : Phaser.Keyboard.DOWN;
    left = typeof left !== 'undefined' ? left : Phaser.Keyboard.LEFT;
    right = typeof right !== 'undefined' ? right : Phaser.Keyboard.RIGHT;
    shoot = typeof shoot !== 'undefined' ? shoot : Phaser.Keyboard.SPACEBAR;
    dash = typeof dash !== 'undefined' ? dash : Phaser.Keyboard.SHIFT;

    this._up = up;
    this._down = down;
    this._left = left;
    this._right = right;
    this._shoot = shoot;
    this._dash = dash;

    this._currUp = undefined;
    this._currDown = undefined;
    this._lastLeft = undefined;
    this._lastRight = undefined;

    this._lastUp = undefined;
    this._lastDown = undefined;
    this._lastLeft = undefined;
    this._lastRight = undefined;

    this._lastDirectionX = 0;
    this._lastDirectionY = 0;

    this._directionX = 0;
    this._directionY = 0;

    this._ready = false;
    this.lastLaser = 0;
    this.lastDash = 0;

    this.pad = null;

    this._shootAlreadyDown = false;
    this._dashAlreadyDown = false;
}

KeyboardController.prototype = Object.create(controllers.Controller.prototype);
KeyboardController.prototype.constructor = KeyboardController;

KeyboardController.prototype.setUpKeys = function () {
    //KeyboardController.prototype.setUpKeys = function(){};
    this._up = game.input.keyboard.addKey(this._up);
    this._up.onDown.add(function () {
        this._currUp = true;
    }, this);
    this._up.onUp.add(function () {
        this._currUp = false;
    }, this);

    this._down = game.input.keyboard.addKey(this._down);
    this._down.onDown.add(function () {
        this._currDown = true;
    }, this);
    this._down.onUp.add(function () {
        this._currDown = false;
    }, this);

    this._left = game.input.keyboard.addKey(this._left);
    this._left.onDown.add(function () {
        this._currLeft = true;
    }, this);
    this._left.onUp.add(function () {
        this._currLeft = false;
    }, this);

    this._right = game.input.keyboard.addKey(this._right);
    this._right.onDown.add(function () {
        this._currRight = true;
    }, this);
    this._right.onUp.add(function () {
        this._currRight = false;
    }, this);


    this._down = game.input.keyboard.addKey(this._down);
    this._left = game.input.keyboard.addKey(this._left);
    this._right = game.input.keyboard.addKey(this._right);
    this._shoot = game.input.keyboard.addKey(this._shoot);
    this._dash = game.input.keyboard.addKey(this._dash);

    this._shoot.onDown.add(this.makeShot, this); // only fires once per press
    this._dash.onDown.add(this.makeDash, this);
};

KeyboardController.prototype.makeShot = function () {
    if (this._player.alive()) {
        this._player.shoot();
    }
};

KeyboardController.prototype.makeDash = function () {
    if (this._player.alive()) {
        this._player.dash();
    }
};

KeyboardController.prototype.tick = function (info) {
    if (!this._ready) {
        game.input.gamepad.start();
        if (game.input.gamepad.supported && game.input.gamepad.active)
            this.pad = game.input.gamepad.pad1;

        this.setUpKeys();
        this._ready = true;
    } // should only run once per player

    if (this.pad != null && this.pad.connected) {
        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this._currLeft = true;
        } else {
            this._currLeft = false;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            this._currRight = true;
        } else {
            this._currRight = false;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
            this._currUp = true;
        } else {
            this._currUp = false;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
            this._currDown = true;
        } else {
            this._currDown = false;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER) ||
            this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER))
        {
            if (!this._shootAlreadyDown) {
                this._shootAlreadyDown = true;
                this.makeShot();
            }
        } else {
            this._shootAlreadyDown = false;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER) ||
            this.pad.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER))
        {
            if (!this._dashAlreadyDown) {
                this._dashAlreadyDown = true;
                this.makeDash();
            }
        } else {
            this._dashAlreadyDown = false;
        }

    }


    if (this._currUp && (this._currUp != this._lastUp)) {
        this._directionY = -1;
    } else if (this._currDown && (this._currDown != this._lastDown)) {
        this._directionY = 1;
    } else if ((this._currUp == this._lastUp)
        && (this._currDown == this._lastDown)) {
        this._directionY = this._lastDirectionY;
    } else if (this._currUp) {
        this._directionY = -1;
    } else if (this._currDown) {
        this._directionY = 1;
    } else {
        this._directionY = 0;
    }

    if (this._currLeft && (this._currLeft != this._lastLeft)) {
        this._directionX = -1;
    } else if (this._currRight && (this._currRight != this._lastRight)) {
        this._directionX = 1;
    } else if ((this._currLeft == this._lastLeft)
        && (this._currRight == this._lastRight)) {
        this._directionX = this._lastDirectionX;
    } else if (this._currLeft) {
        this._directionX = -1;
    } else if (this._currRight) {
        this._directionX = 1;
    } else {
        this._directionX = 0;
    }

    if (this._player.alive()) {
        this._player.setDirection([this._directionX, this._directionY]);
    }

    this._lastUp = this._currUp;
    this._lastDown = this._currDown;
    this._lastLeft = this._currLeft;
    this._lastRight = this._currRight;

    this._lastDirectionX = this._directionX;
    this._lastDirectionY = this._directionY;

};

exports.KeyboardController = KeyboardController;
