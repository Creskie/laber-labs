/**
 * Created by npkapur on 6/28/16.
 */

var game;

// This creates the game instance 1000px wide and 500px tall. 
game = new Phaser.Game(1200, 600, Phaser.CANVAS, 'game');

// First parameter is the name of the state. Second parameter is an object with the needed methods.
game.state.add('Menu', Menu);

// Adds the game state.
game.state.add('Game', Game);

// Adds the agent state.
game.state.add('Agent', Agent);

// Adds the game over state.
game.state.add('GameOver', GameOver);

// Adds the high score state.
game.state.add('HighScore', HighScore);

// Add the instructions.
game.state.add('Instructions', Instructions);

// Adds the credits.
game.state.add('Credits', Credits);

// Adds the Leaderboard.
game.state.add('Board', Board);

// Adds the Shop.
game.state.add('Shop', Shop);

// Adds the level select screen
game.state.add('level', level);

// Starts the menu state.
game.state.start('Menu');
