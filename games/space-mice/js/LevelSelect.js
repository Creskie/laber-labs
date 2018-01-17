/**
 * Created by npkapur on 10/19/16.
 */

// Predeclared variables
var level1, level2, level3;



var LevelSelect = {
    preload: function() {
        game.load.image('background', 'assets/menu.png');
        game.load.image('level1', 'assets/level1.png');
        game.load.image('level2', 'assets/level2.png');
        game.load.image('level3', 'assets/level3.png');
    },

    gofull: function() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(false);
        }
    },

    create: function() {
        // Full screen mode options.  MAY WANT TO CHANGE FROM ON DOWN TO CLICKING F FOR FULL SCREEN
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.input.onDown.add(LevelSelect.gofull);

        // Add the background and the buttons for each of the first three levels to the game.
        game.add.tileSprite(0, 0, game.width, game.height, 'background');
        level1 = game.add.button(game.world.centerX - 586, game.world.centerY - 182, 'level1', LevelSelect.clickOne, this);
        level2 = game.add.button(game.world.centerX - 162, game.world.centerY - 182, 'level2', LevelSelect.clickTwo, this);
        level3 = game.add.button(game.world.centerX + 262, game.world.centerY - 182, 'level3', LevelSelect.clickThree, this);
    },

    // Functions for each of the buttons to start the desired game state.
    clickOne: function() {
        game.state.start('Level1');
    },

    clickTwo: function() {
        game.state.start('Level2');
    },

    clickThree: function() {
        game.state.start('Level3');
    }
};
