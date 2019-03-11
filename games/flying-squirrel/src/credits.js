var credits = {
  preload: function() {
    game.stage.backgroundColor = '#000000';
    game.load.image('backgroundImg','imgs/Flying Squirrel Title Screen L0.png')
  },
  create: function() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    keyF.onDown.add(goFull, this);
    keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    keyQ.onDown.add(quitGame, this);
    keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
    keyM.onDown.add(mute, this);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(returnToMenu, this);

    game.input.onDown.add(returnToMenu, self);

    background = game.add.tileSprite(0, 0, 4608, 2307,'backgroundImg'); //Image is 4808x2307
    background.scale.setTo(screenWidth/4608,screenHeight/2307);
    background.fixedToCamera = true;

    text1 = game.add.text(250, 230, "Eric Rose", {fontSize: '30px', fill: "#FFF", align: "center"});
    text2 = game.add.text(250, 270, "Graphics: Lisa Wong", {fontSize: '30px', fill: "#FFF", align: "center"});
    text3 = game.add.text(250, 310, "Music: Kamaria Fyffe", {fontSize: '30px', fill: "#FFF", align: "center"});
    text6 = game.add.text(250, 470, "Press ENTER or click the screen to return to the menu", {fontSize: '30px', fill: "#FFF", align: "center"});
  }
};

function returnToMenu(){
  game.state.start('tutorialMenu')
};
