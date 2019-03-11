var util = require("./utilities.js");
var controllers = require("./controllers.js");
var foragerAI = require("./foragerAI.js");
var camperAI = require("./camperAI.js");
var evaderAI = require("./evaderAI.js");
var aggressorAI = require("./aggressorAI.js");


function LoadingController(player, weights) {
    controllers.Controller.call(this, player);

    weights = typeof weights !== 'undefined' ? weights : [0.25, 0.25, 0.25,
    0.25];
    // weights = typeof weights !== 'undefined' ? weights : [.34, .33, .33];

    this._w = weights;

    this._faces = [];
    this._faces.push(new foragerAI.ForagerAI(player));
    this._faces.push(new aggressorAI.AggressorAI(player));
    this._faces.push(new camperAI.CamperAI(player));
    this._faces.push(new evaderAI.EvaderAI(player));
    this._switchCounter = 300;
    this._counter = this._switchCounter;

    this.current = util.randchoice_w(this._faces, this._w)

}

LoadingController.prototype = Object.create(controllers.Controller.prototype);
LoadingController.prototype.constructor = LoadingController;

LoadingController.prototype.switchFace = function () {
    this.current = util.randchoice_w(this._faces, this._w);
    this.current.clearGoal(this.current._gd);
    // console.log(this.current);
};

LoadingController.prototype.currentPlayer = function () {
    return this.current;
};

LoadingController.prototype.tick = function (info) {
    this._counter -= 1;

    if (this._counter == 0) {
        this.switchFace();
        this._counter = this._switchCounter;
    }

    this.current.tick(info);
};

exports.LoadingController = LoadingController;
