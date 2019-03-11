var util = require("./utilities.js");
var controllers = require("./controllers.js");
var players = require("./players.js");
var foragerAI = require("./foragerAI.js");
var camperAI = require("./camperAI.js");
var evaderAI = require("./evaderAI.js");
var aggressorAI = require("./aggressorAI.js");


function CheckListController(player, noiseLevel) {
    controllers.Controller.call(this, player);

    noiseLevel = typeof noiseLevel !== 'undefined' ? noiseLevel : 1.;
    this.noiseLevel = noiseLevel;


    this._faces = [];
    this._faces.push(new foragerAI.ForagerAI(player));
    this._faces.push(new aggressorAI.AggressorAI(player));
    this._faces.push(new camperAI.CamperAI(player));
    this._faces.push(new evaderAI.EvaderAI(player));
    this._switchCounter = 500;

    this._counter = this._switchCounter;
    this._lowEnergy = 2;
    this._highEnergy = 5;

    this.current = this._faces[0]; // aggressor
    this.currentIdx = 0;

}

CheckListController.prototype = Object.create(controllers.Controller.prototype);
CheckListController.prototype.constructor = CheckListController;

// CheckListController.prototype.switchFace = function () {
//     this.current = util.randchoice_w(this._faces, this._w);
//     this.current.clearGoal(this.current._gd);
//     // console.log(this.current);
// };

CheckListController.prototype.currentPlayer = function () {
    return this.current;
};

CheckListController.prototype.getFACE = function (info) {
    var newIdx = -1;
    if (util.randunif(0, 1) >= this.noiseLevel) {
        if (this.current.player().energy() <= this._lowEnergy) {
            var availEnergy = false;
            for (var i = 0; i < info.energyBars.length; i++) {
                if (util.l2dist(this.current.opp().center(),
                                info.energyBars[i]._rect.center) >
                    5 * players.Player.prototype.width) {
                    availEnergy = true;
                    break;
                }
            }

            if (availEnergy) {
                console.log("there was avail energy");
                newIdx = 0; // forager
            } else {

                console.log("all energy near opp");
                newIdx = 2; // camper
            }
        } else if (this.current.player().energy() >= this._highEnergy ||
            this.current.player().hasPowerUp()) {
            console.log("lots of energy or we have a powerup");
            newIdx = 1; // aggressor
        } else {
            console.log("defaulting to evader");
            newIdx = 3; // evader
        }
    } else {
        newIdx = parseInt(util.randunif(0, 4));
    }

    console.assert(newIdx >= 0 && newIdx < 4);

    if (newIdx != this.currentIdx) {
        this.current = this._faces[newIdx];
        this.current.clearGoal(this.current._gd);
        console.log(this.current);
        this.currentIdx = newIdx;
    }

};

CheckListController.prototype.tick = function (info) {
    this._counter -= 1;

    if (this._counter == 0) {
        this.getFACE(info);
        this._counter = this._switchCounter;
    }

    if (this.noiseLevel > 0) {
        this.noiseLevel -= 1 / 360.;
    }
    this.current.tick(info);
};

exports.CheckListController = CheckListController;
