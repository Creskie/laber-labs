var util = require("./utilities.js");
var controllers = require("./controllers.js");
var foragerAI = require("./foragerAI.js");
var camperAI = require("./camperAI.js");
var evaderAI = require("./evaderAI.js");
var aggressorAI = require("./aggressorAI.js");
var networkAI = require("./networkAI.js");
var players = require("./players.js");
var energyMeters = require("./energyMeters.js");
var bombs = require("./bombs.js");
var lasers = require("./lasers.js");
var rects = require("./rects.js");

var FeatureController = require("./featureController.js").FeatureController;

var trainData = require("../train.json");

// process the trained data
var face_list = Object.keys(trainData);
for(var i = 0; i < face_list.length; ++i) {
    // iterate over each face
    var face = face_list[i];
    var face_data = trainData[face];

    // get the mean value for each counter strategy to this face
    for(var j = 0; j < face_data.length; j++) {
        var face_data_j = face_data[j];
        face_data_j.mean_value = face_data_j.values.reduce(function(a, b) {
            return a + b;
        }, 0.0) / face_data_j.values.length;
    }

    // sort the counter strategies by the mean value
    face_data.sort(function(data_a, data_b) {
        // sort in descending order
        return data_b.mean_value - data_a.mean_value;
    });
}


function argmax(arr) {
    return Object.keys(arr).reduce(function (a, b) {
        return arr[a] > arr[b] ? a : b;
    });
}


function SolPathController(player, trace, jumpBy) {
    FeatureController.call(this, player, [[null], [null], [null], [null]]);

    controllers.Controller.call(this, player);

    this._trace = trace;
    this._jumpEvery = 30;
    this._jumpCounter = this._jumpEvery;
    this._jumpNum = 0;
    this._jumpBy = jumpBy;

    this._face_list = Object.keys(trainData);
    this._solPath = trainData;
    this._counters = new Array();
    for(var i = 0; i < this._face_list.length; ++i) {
        var face = this._face_list[i];
        this._counters.push(this._solPath[face][this._jumpNum].counter);
    }
}

SolPathController.prototype = Object.create(FeatureController.prototype);
SolPathController.prototype.constructor = SolPathController;


SolPathController.prototype.tick = function(info) {
    if (this._jumpCounter == 0) {
        // reset jump counter
        this._jumpCounter = this._jumpEvery;

        // increment jump counter
        this._jumpNum += this._jumpBy;

        for(var i = 0; i < this._face_list.length; ++i) {
            var face = this._face_list[i];
            var numCounters = this._solPath[face].length;
            var counterIndex;
            if (this._jumpNum < numCounters) {
                counterIndex = this._jumpNum;
            } else {
                counterIndex = numCounters - 1;
            }
            this._counters[i] = this._solPath[face][counterIndex].counter;
        }
    } else {
        --this._jumpCounter;
    }

    if (this._switchCounter == 0) {
        this.current.reset();

        // classify human behavior
        var probs = this._trace.probs();
        var maxInd = argmax(probs);

        // assign counter strategy
        this._coef = this._counters[maxInd];

        this.switch(info);
        this._switchCounter = this._switchLimit;
    } else {
        --this._switchCounter;
    }

    this.current.tick(info);
}

exports.SolPathController = SolPathController;
