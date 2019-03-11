var energyBars = require("../game/energyBars.js");
var energyMeters = require("../game/energyMeters.js");
var util = require("../game/utilities.js");
var rects = require("../game/rects.js");
var powerUps = require("../game/powerUps.js");
var lasers = require("../game/lasers.js");
var players = require("../game/players.js");
var bombs = require("../game/bombs.js");
var blocks = require("../game/blocks.js");
var sprites = require("../game/sprites.js");

module.exports = {
    create: function () {
        game.globals.v.init(); // need to do after loading imgs

        // game.time.advancedTiming = true;
        // game.time.desiredFps = 30;


    },
    update: function () {
        // console.log(game.time.frames);
        // if(game.time.frames % 2 == 0)
        if (!game.globals.status.gameover) {
            var rc = game.globals.lf.loop();
            var outOfTime = game.globals.v._clockCountDown.delay -
                game.globals.v._clockTime.ms <= 500; // .5 seconds
            if (rc.p1_lives == 0 || rc.p2_lives == 0 || outOfTime) {
                game.globals.status.gameover = true;
                if (rc.p2_lives < rc.p1_lives)
                // player 1 wins
                    game.globals.status.winner = 1;
                else if (rc.p1_lives < rc.p2_lives)
                // player 2 wins
                    game.globals.status.winner = 2;
                else
                // tie
                    game.globals.status.winner = 0;
            }
            game.globals.summary.p1 = rc.p1_summary;
            game.globals.summary.p2 = rc.p2_summary;
        } else if (game.globals.status.winner >= 0) {
            game.state.start('gameover');
        }
    },
    render: function () {
        // game.debug.text(game.time.fps || '--',2,14,"#00ff00");
    }
};
