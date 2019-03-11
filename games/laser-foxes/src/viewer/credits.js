module.exports = {
    create: function () {
        var x = parseInt(game.world.width / 2);
        var y = parseInt(game.world.height / 2) - game.globals.v._scale * 2;
        var credits = game.add.text(x, y, "Created by Laber-Labs\n", {
            font: parseInt(game.globals.v._scale).toString() + 'px Orbitron',
            fill: "#27ADCA",
            align: "center"
        });


        credits.anchor.set(0.5);

        var names = game.add.text(x, y + game.globals.v._scale * 2,
                                  "Nick Meyer \t Maria" +
                                  " Jahja\nEric" +
                                  " Rose" +
                                  "\t Marshall Wang \n Eric Laber", {
                                      font: parseInt(game.globals.v._scale * .5)
                                          .toString() + 'px Orbitron',
                                      fill: "#27ADCA",
                                      align: "center"
                                  });

        names.anchor.set(0.5);

        var exit = game.add.text(x, y + game.globals.v._scale * 4, "RETURN", {
            font: parseInt(game.globals.v._scale * .8).toString() + 'px TR2N',
            fill: "#27ADCA",
            align: "center"
        });
        exit.anchor.set(0.5);
        exit.inputEnabled = true;
        exit.events.onInputUp.add(this.returnToMenu, this);
        exit.events.onInputOver.add(this.select, this);
        exit.input.useHandCursor = true;

        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(function (key) {
            this.returnToMenu();
        }, this);
    },
    update: function () {

    },
    select: function (target) {
        target.fill = "#27ADCA";
    },
    returnToMenu: function () {
        game.state.start('menu');
    }
};
