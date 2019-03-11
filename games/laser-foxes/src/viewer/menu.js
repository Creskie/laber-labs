var lf_game = require("../game.js");

module.exports = {
    create: function () {
        var bg = game.add.sprite(0, 0, 'menu_bg');
        bg.width = game.world.width;
        bg.height = game.world.height;


        var lf_logoX = parseInt(game.world.width / 2);
        var lf_logoY = parseInt(game.world.height / 2) -
                       game.globals.v._scale * 2;
        var lf_logo = game.add.sprite(lf_logoX, lf_logoY, 'lf_logo');
        lf_logo.width = game.globals.v._scale * 7;
        lf_logo.height = game.globals.v._scale * 4.5;

        lf_logo.anchor.set(0.5);

        this.options = [];
        this.options.push(this.addMenuOption(lf_logoX, lf_logoY +
                                                       (game.globals.v._scale *
                                                        2.5), "START",
                                             this.startGame));
        this.options.push(this.addMenuOption(lf_logoX, lf_logoY +
                                                       (game.globals.v._scale *
                                                        3.3), "CREDITS",
                                             this.showCredits));

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
                this.startGame();
            else if (this.current == 1)
                this.showCredits();
        }, this);
    },
    update: function () {
    },
    startGame: function () {
        if (game.globals.restart)
            lf_game.restartGame();
        else
            game.state.start('levels');
    },
    showCredits: function () {
        game.state.start('credits');
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
    }
};
