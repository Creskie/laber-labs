var lf_game = require("./game/games.js");
var players = require("./game/players.js");
var blocks = require("./game/blocks.js");
var eventManagers = require("./game/eventManagers.js");
var kb_controllers = require("./game/keyboardControllers.js");
var checkListController = require("./game/checkListController.js");
var loadingController = require("./game/loadingController");
var foragerAI = require("./game/foragerAI.js");
var camperAI = require("./game/camperAI.js");
var aggressorAI = require("./game/aggressorAI.js");
var evaderAI = require("./game/evaderAI.js");
var trace = require("./game/trace.js");
var featureController = require("./game/featureController.js");
var util = require("./game/utilities.js");
//var csvWriter = require("csv-write-stream");
const fs = require('fs');
//
//writer = csvWriter({
//                       headers: ["game", "frame",
//                                 "playerClass",
//                                 "playerX", "playerY", "playerShotLaser",
//                                 "playerPickedUpPowerUp",
//                                 "playerEnergy", "playerGotHit",
// "playerAlive", "enemyClass", "enemyX", "enemyY", "enemyShotLaser",
// "enemyPickedUpPowerUp", "enemyEnergy", "enemyGotHit", "enemyAlive"] });

//writer.pipe(fs.createWriteStream('out.csv'));

function runRep(humanFace, counter, seed) {
    var human;
    switch(humanFace){
    case "forager":
        human = foragerAI.ForagerAI;
        break;
    case "aggressor":
        human = aggressorAI.AggressorAI;
        break;
    case "camper":
        human = camperAI.CamperAI;
        break;
    case "evader":
        human = evaderAI.EvaderAI;
        break;
    }

    util.seed = seed;
    var evm = new eventManagers.EventManager();
    var p1 = new players.Player(200, 1400, evm, true);
    //var c1 = new loadingController.LoadingController(p1);
    var c1 = new human(p1);
    var p1trace = new trace.Trace(null, 0);
    p1trace.tracePlayer(p1);

    var p2 = new players.Player(5000, 1400, evm, false);
    var c2 = new featureController.FeatureController(p2, counter);
    //var c2 = new faces[i](p2);
    //var p2trace = new trace.Trace(writer, nGames);
    //p2trace.tracePlayer(p2);

    p1.setOpp(p2);
    p2.setOpp(p1);
    var blockList = [];
    var g = new lf_game.Game(c1, c2, p1, p2, blockList, evm);

    var viewer = null;
    g.run(viewer, 9000, [], false, p1trace, null); // exit after 9000 frames

    return parseFloat(p2.lives() - p1.lives());
}


function genCounters(numCounter) {
    var numFeatures = featureController.FeatureController.prototype.numFeatures();

    var counters = [];
    for (var i = 0; i < numCounter; i++) {
        var c = [];
        for (var j = 0; j <= 3; j++) {
            var f = [];
            for (var k = 0; k < numFeatures; k++) {
                f.push(util.randn_bm());
            }
            f[0] = util.randn_bm() * 5.0;
            c.push(f);
        }
        counters.push(c);
    }
    return counters;
}

exports.runRep = runRep;
exports.genCounters = genCounters;
