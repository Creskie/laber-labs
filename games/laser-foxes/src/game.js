var lf_game = require("./game/games.js");
var players = require("./game/players.js");
var blocks = require("./game/blocks.js");
var eventManagers = require("./game/eventManagers.js");
var kb_controllers = require("./game/keyboardControllers.js");
var checkListController = require("./game/checkListController.js");
var controllers = require("./game/controllers.js");
var phaserViewer = require("./game/phaserViewer.js");
var foragerAI = require("./game/foragerAI.js");
var camperAI = require("./game/camperAI.js");
var aggressorAI = require("./game/aggressorAI.js");
var evaderAI = require("./game/evaderAI.js");
var loadingController = require("./game/loadingController.js");
var solPathController = require("./game/solPathController.js");
var trace = require("./game/trace.js");


var evm = new eventManagers.EventManager();
var p1 = new players.Player(200, 1400, evm, true);
var c1 = new kb_controllers.KeyboardController(p1);

var p1trace = new trace.Trace();
p1trace.tracePlayer(p1);

//var c1 = new controllers.RandomController(p1);

var p2 = new players.Player(5000, 1400, evm, false);
// var c2 = new checkListController.CheckListController(p2);
var c2 = new solPathController.SolPathController(p2, p1trace, 100);
var p2trace = new trace.Trace();
p2trace.tracePlayer(p2);


p1.setOpp(p2);
p2.setOpp(p1);
var blockList = [];
var g = new lf_game.Game(c1, c2, p1, p2, blockList, evm);
var w = window.innerWidth;
var h = window.innerHeight;
var SCALE = Math.floor(Math.min(h / 9, w / 16));
var viewer = new phaserViewer.PhaserViewer(SCALE, 30, false);

game.globals = {
    status: {
        "level": 0,
        "gameover": false,
        "winner": -1,
        "restart": false
    },
    summary: {
        "p1": null,
        "p2": null
    },
    lf: g,
    v: viewer
};

g.run(viewer, 30, [], false, p1trace, p2trace);


function restartGame() {
    evm = new eventManagers.EventManager();
    p1 = new players.Player(200, 1400, evm, true);
    c1 = new kb_controllers.KeyboardController(p1);
    var p1trace = new trace.Trace();
    p1trace.tracePlayer(p1);

    p2 = new players.Player(5000, 1400, evm, false);
    c2 = new checkListController.CheckListController(p2);
    var p2trace = new trace.Trace();
    p2trace.tracePlayer(p2);

    p1.setOpp(p2);
    p2.setOpp(p1);

    if (game.globals.status.level == 1)
        blockList = blocks.Block.level1(evm);
    else if (game.globals.status.level == 2)
        blockList = blocks.Block.level2(evm);
    else
        blockList = blocks.Block.level3(evm);

    g = new lf_game.Game(c1, c2, p1, p2, blockList, evm);

    //var viewer = new phaserViewer.PhaserViewer(SCALE, 30, false);
    game.globals = {
        status: {
            "gameover": false,
            "winner": -1,
            "restart": true
        },
        summary: {
            "p1": null,
            "p2": null
        },
        lf: g,
        v: viewer
    };
    g.run(viewer, 30, [], true, p1trace, p2trace);
}

exports.restartGame = restartGame;
