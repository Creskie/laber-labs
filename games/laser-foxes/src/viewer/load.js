module.exports = {
    init: function () {
    },

    loadingLabel: function () {
        //Here we add a label to let the user know we are loading everything
        //This is the "Loading" phrase in pixel art
        //You can just as easily change it for your own art :)
        this.loading =
            game.add.sprite(game.world.centerX, game.world.centerY - 20,
                            'loading');
        this.loading.anchor.setTo(0.5, 0.5);
        //This is the bright blue bar that is hidden by the dark bar
        this.barBg =
            game.add.sprite(game.world.centerX, game.world.centerY + 40,
                            'load_progress_bar');
        this.barBg.anchor.setTo(0.5, 0.5);
        //This bar will get cropped by the setPreloadSprite function as the
        // game loads!
        this.bar =
            game.add.sprite(game.world.centerX - 192, game.world.centerY + 40,
                            'load_progress_bar_dark');
        this.bar.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(this.bar);
    },

    preload: function () {
        this.loadingLabel();
        //Add here all the assets that you need to game.load
        game.load.image('bg', 'assets/arena.png');
        game.load.image('menu_bg', 'assets/backgroundMenu2.png');
        game.load.image('lf_logo', 'assets/laserfoxes.png');
        game.load.image('header', 'assets/header2.png');
        game.load.image('sidePanel', 'assets/sidePanelAI.png');
        game.load.image('energy', 'assets/energy2.png');
        game.load.image('pupstack', 'assets/pupstack.png');
        game.load.image('penetrate', 'assets/penetrate.png');
        game.load.image('scatter', 'assets/scatter.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('shield', 'assets/shield.png');
        game.load.image('pulsar', 'assets/pulsar.png');
        game.load.image('p1', 'assets/cattron.png');
        game.load.image('p2', 'assets/cattron2.png');
        game.load.image('blue', 'assets/blue.png');
        game.load.image('orange', 'assets/orange.png');
        game.load.image('red', 'assets/red.png');
        game.load.image('white', 'assets/white.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('block_hit1', 'assets/block_hit1.png');
        game.load.image('block_hit2', 'assets/block_hit2.png');
        game.load.image('block2', 'assets/block2.png');
        game.load.image('block2_hit1', 'assets/block2_hit1.png');
        game.load.image('block2_hit2', 'assets/block2_hit2.png');
        game.load.image('fullscreen', 'assets/fullscreen.png');
        game.load.image('downscreen', 'assets/downscreen.png');
        game.load.image('rabbit', 'assets/rabbit2.png');
        game.load.image('rhino', 'assets/rhino2.png');
        game.load.image('squirrel', 'assets/squirrel2.png');
        game.load.image('mouse', 'assets/mouse2.png');
        game.load.image('electric_field', 'assets/electric_field.png');
        game.load.image('p1_helmet', 'assets/helmet_blue.png');
        game.load.image('p2_helmet', 'assets/helmet_orange.png');

        // need the text to ensure font loaded
        game.add.text(0, 0, "fix",
                      {font: '1px "alarm clock"', fill: "#FFFFFF"});
        game.add.text(0, 0, "fix", {font: '1px Orbitron', fill: "#FFFFFF"});
        game.add.text(0, 0, "fix", {font: '1px TR2N', fill: "#FFFFFF"});
    },

    create: function () {
        game.state.start('menu');
    }
};
