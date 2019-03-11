var lf_game = require("../game.js");

module.exports = {
    create: function () {
        var x = parseInt(game.world.width / 2);
        var y = parseInt(game.world.height / 2) - game.globals.v._scale * 2;

        var bg = game.add.sprite(0, 0, 'menu_bg');
        bg.width = game.world.width;
        bg.height = game.world.height;

        this.gameover_msg =
            game.add.text(x, y - game.globals.v._scale * 1.2, "GAMEOVER", {
                font: parseInt(game.globals.v._scale).toString() + 'px' +
                ' TR2N',
                fill: "#27ADCA",
                align: "center"
            });

        this.gameover_msg.anchor.set(0.5);

        var winner_text;
        if (game.globals.status.winner == 0) {
            winner_text = "Tie Game!";
        } else if (game.globals.status.winner == 1) {
            winner_text = "Player 1 Wins!";
        } else if (game.globals.status.winner == 2) {
            winner_text = "Player 2 Wins!";
        }

        this.win_msg =
            game.add.text(x, y, winner_text, {
                font: parseInt(game.globals.v._scale * .9).toString() + 'px' +
                ' Orbitron',
                fill: "#27ADCA",
                align: "center"
            });

        this.win_msg.anchor.set(0.5);


        var sum_text = "Lives left:\nLasers shot:\nPowerups" +
            " collected:\nPixels travelled:\nBlocks destroyed:";

        this.sum_msg = game.add.text(x - 3.5 * game.globals.v._scale,
                                     y + game.globals.v._scale * 2.45, sum_text,
                                     {
                                         font: parseInt(
                                             game.globals.v._scale * .32)
                                             .toString() + 'px' +
                                         ' Orbitron',
                                         fill: "#DF740C",
                                         align: "right"
                                     });
        this.sum_msg.anchor.set(0.5);

        var sum_style = {
            font: parseInt(game.globals.v._scale * .32).toString() + 'px' +
            ' Orbitron',
            fill: "#DF740C",
            align: "left"
        };

        var p1_text = "Player 1\n" + game.globals.summary.p1.livesLeft + "\n" +
            game.globals.summary.p1.lasersShot +
            "\n" + game.globals.summary.p1.pupsCollected +
            "\n" + parseInt(game.globals.summary.p1.pixelsTravelled) +
            "\n" + game.globals.summary.p1.blocksDestroyed;
        this.p1_msg = game.add.text(x - game.globals.v._scale * .7,
                                    y + game.globals.v._scale * 2.2,
                                    p1_text, sum_style);
        this.p1_msg.anchor.set(0.5);


        var p2_text = "Player 2\n" + game.globals.summary.p2.livesLeft + "\n" +
            game.globals.summary.p2.lasersShot +
            "\n" + game.globals.summary.p2.pupsCollected +
            "\n" + parseInt(game.globals.summary.p2.pixelsTravelled) +
            "\n" + game.globals.summary.p2.blocksDestroyed;
        this.p2_msg = game.add.text(x + 2.5 * game.globals.v._scale,
                                    y + game.globals.v._scale * 2.2,
                                    p2_text, sum_style);
        this.p2_msg.anchor.set(0.5);


        this.options = [];
        this.options.push(this.addMenuOption(x, y + (game.globals.v._scale *
                                             4.5), "PLAY AGAIN",
                                             this.restartGame));
        this.options.push(this.addMenuOption(x, y + (game.globals.v._scale *
                                             5.3), "MENU",
                                             this.returnToMenu));
        this.current = 0;
        this.select(this.options[this.current]);
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        this.upKey.onDown.add(function (key) {
            this.deselect(this.options[this.current]);
            this.current = Math.max(0, this.current - 1);
            this.select(this.options[this.current]);
        }, this);
        this.downKey.onDown.add(function (key) {
            this.deselect(this.options[this.current]);
            this.current = Math.min(this.options.length, this.current + 1);
            this.select(this.options[this.current]);
        }, this);

        this.enterKey.onDown.add(function (key) {
            if (this.current == 0)
                this.restartGame();
            else if (this.current == 1)
                this.returnToMenu();
        }, this);
    },
    update: function () {

    },
    addMenuOption: function (x, y, text, callback) {
        var new_option = game.add.text(x, y, text, {
            font: parseInt(game.globals.v._scale * .8).toString() + 'px TR2N',
            fill: "#0A2E36",
            align: "center"
        });
        new_option.anchor.set(0.5);
        new_option.inputEnabled = true;
        new_option.events.onInputUp.add(callback, this);
        new_option.events.onInputOver.add(this.select, this);
        new_option.events.onInputOut.add(this.deselect, this);
        new_option.input.useHandCursor = true;
        return new_option;
    },
    select: function (target) {
        target.fill = "#27ADCA";
    },
    deselect: function (target) {
        target.fill = "#0A2E36";
    },
    returnToMenu: function () {
        game.globals.status.restart = true;
        game.state.start('menu');
    },
    restartGame: function () {
        game.globals.status.restart = true;
        lf_game.restartGame();
    }
};
