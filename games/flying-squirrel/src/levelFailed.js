var levelFailed = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game.load.image('backgroundImg','imgs/Flying Squirrel Title Screen L0.png')
  },
  create: function() {
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
      keyF.onDown.add(goFull, this);

      background = game.add.tileSprite(0, 0, 4608, 2307,'backgroundImg'); //Image is 4808x2307
      background.fixedToCamera = true;
      background.scale.setTo((1/zoom)*screenWidth/4608,(1/zoom)*screenHeight/2307);

      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      text1 = game.add.text(500, 300, "You Lost!", {fontSize: '48px', fill: "#FFF", align: "center"});
      text2 = game.add.text(480, 380, "Press ENTER to Restart", {fontSize: '24px', fill: "#FFF", align: "center"});
      text1.scale.setTo(1/zoom);
      text1.fixedToCamera = true;
      text2.scale.setTo(1/zoom);
      text2.fixedToCamera = true;
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level1');
    }
  }
};
