var gameObj = require("./gameObj.js");
var util = require("./utilities.js");
var powerUps = require("./powerUps.js");

function Block(centerx, centery, evm) {
    gameObj.GameObj.call(this, centerx, centery, evm);

    this._lives = this.maxLives;
    this._powerUpDrop = null;
}

Block.prototype = Object.create(gameObj.GameObj.prototype);
Block.prototype.constructor = Block;

Block.prototype.width = 300;
Block.prototype.height = 300;

Block.prototype.maxLives = 3;
Block.prototype._dropProb = 0.45;
Block.prototype.respawnProb = 1.0 / 600.0;

Block.prototype.lives = function () {
    return this._lives;
};

Block.prototype.powerUpDrop = function () {
    return this._powerUpDrop;
};

Block.prototype.hit = function () {
    console.assert(this.alive(), "hit when not alive");

    this._lives -= 1;

    if (this._lives <= 0) {
        this._alive = false;
        this._evm.deadObj.put(this);

        if (util.rand() < this._dropProb) {
            var powerUpCls = powerUps.randomPowerUp();
            this._powerUpDrop = new powerUpCls(this.rect().centerx,
                this.rect().centery, this._evm);
        }
        return true;
    } else {
        return false;
    }
};

Block.prototype.respawn = function () {
    console.assert(!this.alive(), "respawn when not dead");
    this._alive = true;
    this._powerUpDrop = null;
    this._lives = this.maxLives;
    this._evm.newObj.put(this);
};

Block.prototype.tick = function (info) {
};

function MovingBlock(centerx, centery, xlim, ylim, moveUp, moveRight, evm) {
    Block.call(this, centerx, centery, evm);
    this.xlim = xlim;
    this.ylim = ylim;

    this.moveUp = moveUp;
    this.moveRight = moveRight;
    this._up = false;
    this._right = false;
    this._move = true;
    this._upf = 6;
    this._added = false;
}

MovingBlock.prototype = Object.create(Block.prototype);
MovingBlock.prototype.constructor = MovingBlock;

MovingBlock.prototype.tick = function (info) {
    if (this._move && this._added && this._alive)
        this.motion(info);
    else if (!this._added)
        this._added = true;
};

MovingBlock.prototype.motion = function (info) {
    info.pn.release(this.rect());

    for (var i = 0; i < info.players.length; i++) {
        if (this.rect().collide(info.players[i].rect())) {
            this._move = false;
            info.pn.occupy(this.rect());
            return;
        }
    }

    if (this.moveRight) {
        if (this._right && this.rect().centerx >= this.xlim[1])
            this._right = false;

        if (!this._right && this.rect().centerx <= this.xlim[0])
            this._right = true;

        if (this._right)
            this.rect().centerx += this._upf;
        else
            this.rect().centerx -= this._upf;
    }

    if (this.moveUp) {
        if (this._up && this.rect().centery >= this.ylim[1])
            this._up = false;

        if (!this._up && this.rect().centery <= this.ylim[0])
            this._up = true;

        if (this._up)
            this.rect().centery += this._upf;
        else
            this.rect().centery -= this._upf;
    }

    info.pn.occupy(this.rect());
};

MovingBlock.prototype.respawn = function () {
    console.assert(!this.alive(), "respawn when not dead");
    this._move = true;
    this._alive = true;
    this._powerUpDrop = null;
    this._lives = this.maxLives;
    this._evm.newObj.put(this);
};

MovingBlock.prototype.hit = function () {
    console.assert(this.alive(), "hit when not alive");

    this._lives -= 1;

    if (this._lives <= 0) {
        this._alive = false;
        this._added = false;
        this._evm.deadObj.put(this);

        if (util.rand() < this._dropProb) {
            var powerUpCls = powerUps.randomPowerUp();
            this._powerUpDrop = new powerUpCls(this.rect().centerx,
                this.rect().centery, this._evm);
        }
        return true;
    } else {
        return false;
    }
};

Block.level1 = function (evm) {
    var blockList = [];

    var midX = this.prototype.maxX / 2.0;
    var midY = this.prototype.maxY / 2.0;

    // center
    blockList.push(new Block(midX - 0.5 * this.prototype.width,
        midY - 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX + 0.5 * this.prototype.width,
        midY - 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX - 0.5 * this.prototype.width,
        midY + 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX + 0.5 * this.prototype.width,
        midY + 0.5 * this.prototype.height, evm));

    //topleft
    blockList.push(new Block(midX - 3.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 2.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 1.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 3.75 * this.prototype.width,
        midY - 1.75 * this.prototype.height, evm));

    //topright
    blockList.push(new Block(midX + 3.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 2.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 1.75 * this.prototype.width,
        midY - 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 3.75 * this.prototype.width,
        midY - 1.75 * this.prototype.height, evm));

    //bottomleft
    blockList.push(new Block(midX - 3.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 2.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 1.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX - 3.75 * this.prototype.width,
        midY + 1.75 * this.prototype.height, evm));

    //bottomright
    blockList.push(new Block(midX + 3.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 2.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 1.75 * this.prototype.width,
        midY + 2.75 * this.prototype.height, evm));

    blockList.push(new Block(midX + 3.75 * this.prototype.width,
        midY + 1.75 * this.prototype.height, evm));

    return blockList;
};

Block.level2 = function (evm) {
    var blockList = [];

    var midX = this.prototype.maxX / 2.0;
    var midY = this.prototype.maxY / 2.0;


    // left
    blockList.push(new MovingBlock(
        midX - parseInt(5 * this.prototype.width),
        midY - .75 * this.prototype.height,
        [midX - parseInt(5 * this.prototype.width),
         midX - parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 1.75 * this.prototype.height],
        true, false, evm));

    // right
    blockList.push(new MovingBlock(
        midX + parseInt(5 * this.prototype.width),
        midY - .75 * this.prototype.height,
        [midX + parseInt(5 * this.prototype.width),
         midX + parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 1.75 * this.prototype.height],
        true, false, evm));

    // top
    blockList.push(new MovingBlock(
        midX,
        midY - 2.75 * this.prototype.height,
        [midX - parseInt(1.75 * this.prototype.width),
         midX + parseInt(1.75 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY - 2.75 * this.prototype.height],
        false, true, evm));

    // bottom
    blockList.push(new MovingBlock(
        midX,
        midY + 2.75 * this.prototype.height,
        [midX - parseInt(1.75 * this.prototype.width),
         midX + parseInt(1.75 * this.prototype.width)],
        [midY + 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        false, true, evm));

    // center
    blockList.push(new Block(midX - 1.5 * this.prototype.width,
        midY - 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX + 1.5 * this.prototype.width,
        midY - 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX - 1.5 * this.prototype.width,
        midY + 0.5 * this.prototype.height, evm));

    blockList.push(new Block(midX + 1.5 * this.prototype.width,
        midY + 0.5 * this.prototype.height, evm));

    return blockList;
};

Block.level3 = function (evm) {
    var blockList = [];

    var midX = this.prototype.maxX / 2.0;
    var midY = this.prototype.maxY / 2.0;


    // left
    blockList.push(new MovingBlock(
        midX - parseInt(5 * this.prototype.width),
        midY - 2.75 * this.prototype.height,
        [midX - parseInt(5 * this.prototype.width),
         midX - parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));

    blockList.push(new Block(midX - 4 * this.prototype.width,
        midY, evm));

    // second from left
    blockList.push(new MovingBlock(
        midX - parseInt(3 * this.prototype.width),
        midY + 2.75 * this.prototype.height,
        [midX - parseInt(5 * this.prototype.width),
         midX - parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));

    blockList.push(new Block(midX - 2 * this.prototype.width,
        midY, evm));

    // third from left
    blockList.push(new MovingBlock(
        midX - parseInt(this.prototype.width),
        midY - 2.75 * this.prototype.height,
        [midX - parseInt(5 * this.prototype.width),
         midX - parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));

    blockList.push(new Block(midX, midY, evm));

    // right
    blockList.push(new MovingBlock(
        midX + parseInt(5 * this.prototype.width),
        midY + 2.75 * this.prototype.height,
        [midX + parseInt(5 * this.prototype.width),
         midX + parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));

    blockList.push(new Block(midX + 2 * this.prototype.width,
        midY, evm));

    // second from right
    blockList.push(new MovingBlock(
        midX + parseInt(3 * this.prototype.width),
        midY - 2.75 * this.prototype.height,
        [midX + parseInt(5 * this.prototype.width),
         midX + parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));

    blockList.push(new Block(midX + 4 * this.prototype.width,
        midY, evm));

    // third from right
    blockList.push(new MovingBlock(
        midX + parseInt(this.prototype.width),
        midY + 2.75 * this.prototype.height,
        [midX + parseInt(5 * this.prototype.width),
         midX + parseInt(5 * this.prototype.width)],
        [midY - 2.75 * this.prototype.height,
         midY + 2.75 * this.prototype.height],
        true, false, evm));


    return blockList;
};


exports.Block = Block;
exports.MovingBlock = MovingBlock;
