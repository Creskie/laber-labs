var util = require("./utilities.js");
var networkAI = require("./networkAI.js");


function CamperAI(player) {
    networkAI.NetworkAI.call(this, player);

    this._workOnPoint = this.workOnPoint.bind(this); // have to bind functions....
    this._updateForPoint = this.updateForPoint.bind(this);
}

CamperAI.prototype = Object.create(networkAI.NetworkAI.prototype);
CamperAI.prototype.constructor = CamperAI;

CamperAI.prototype.getGoal = function (gd, info) {
    var end = info.pn.furthestNodeTo(this.opp().topleft()[0],
                                     this.opp().topleft()[1]);


    if (util.l2dist(end['xy'], this.topleft()) > (0.2 * this.w())) {
        this.setGoal(gd, end['xy'], end, this._workOnPoint, this._updateForPoint, info.pn);
    }
};

CamperAI.prototype.breakGoal = function (gd, info) {
    var end = info.pn.furthestNodeTo(this.opp().topleft()[0],
                                     this.opp().topleft()[1]);

    if (!(end[0] == gd.obj[0]
          || end[1] == gd.obj[1])) {
        this.clearGoal(gd);
        return true;
    } else {
        return false;
    }
};


exports.CamperAI = CamperAI;
