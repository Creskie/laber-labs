var game;

var screenHeight = 720
var screenWidth = 1280

var screen1Height = 720; //720
var screen1Width = 854;  //854
var screen2Height = 360;
var screen2Width = 427;
var screen3Height = 360;
var screen3Width = 427;

var gravity = 400;
var friction = 0.15;

game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'game');

game.state.add('Tutorial', Tutorial);
game.state.add('tutorialMenu', tutorialMenu);
game.state.add('credits', credits);
game.state.add('tutorialComplete', tutorialComplete);
game.state.add('Level1', Level1);
game.state.add('Level2', Level2);
game.state.add('Level3', Level3);
game.state.add('Level', Level);
game.state.add('menu', menu);
game.state.add('levelFailed', levelFailed);
game.state.add('level1Complete', level1Complete);
game.state.add('level2Complete', level2Complete);
game.state.add('level3Complete', level3Complete);
game.state.add('levelComplete', levelComplete);
game.state.add('autoLevelComplete', autoLevelComplete);

game.state.start('menu');

// game.state.start('Level1');
