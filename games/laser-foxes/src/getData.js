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
var csvWriter = require("csv-write-stream");
const fs = require('fs');

writer = csvWriter({
                       headers: ["game", "frame",
                                 "playerClass",
                                 "playerX", "playerY", "playerShotLaser",
                                 "playerShotLaserAtBlock",
                                 "playerPickedUpPowerUp",
                                 "playerEnergy", "playerGotHit", "playerAlive",
                                 "enemyClass",
                                 "enemyX", "enemyY", "enemyShotLaser",
                                 "enemyShotLaserAtBlock",
                                 "enemyPickedUpPowerUp",
                                 "enemyEnergy", "enemyGotHit", "enemyAlive"]
                   });

writer.pipe(fs.createWriteStream('out.csv'));

var faces = [foragerAI.ForagerAI, aggressorAI.AggressorAI,
             camperAI.CamperAI, evaderAI.EvaderAI];

var framesToGet = 100000;
var nGames = 0;
for (var i = 0; i < faces.length; i++) {
    var nFrames = 0;
    while (nFrames < framesToGet) {
        var evm = new eventManagers.EventManager();
        var p1 = new players.Player(200, 1400, evm, true);
        var c1 = new loadingController.LoadingController(p1);
        var p1trace = new trace.Trace(writer, nGames);
        p1trace.tracePlayer(p1);

        var p2 = new players.Player(5000, 1400, evm, false);
        var c2 = new faces[i](p2);
        var p2trace = new trace.Trace(writer, nGames);
        p2trace.tracePlayer(p2);

        p1.setOpp(p2);
        p2.setOpp(p1);
        var blockList = [];
        var g = new lf_game.Game(c1, c2, p1, p2, blockList, evm);

        var viewer = null;

        g.run(viewer, 10800, [], false, p1trace, p2trace);

        //p1trace.write();
        p2trace.write();

        nFrames += g._info.frame;
        nGames += 1;
        console.log(faces[i], nFrames);
    }
}

writer.end();
