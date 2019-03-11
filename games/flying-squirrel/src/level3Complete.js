var level3Complete = {
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
      text1 = game.add.text(440, 300, "Level 3 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      text2 = game.add.text(470, 380, "Press ENTER to start Level 4", {fontSize: '24px', fill: "#FFF", align: "center"});
      text1.scale.setTo(1/zoom);
      text1.fixedToCamera = true;
      text2.scale.setTo(1/zoom);
      text2.fixedToCamera = true;

      window.sendPcaTrim();
      var newData = [];
      var newTraining = [];
      var newY = [];
      var toClean = [];
      for (i = 1 + prevDataLength; i < X.length; i++){
          var prevXVel =  X[i-1][1];
          var currXVel = X[i][1];
          if (currXVel - prevXVel < -0.5){
            toClean.push(i);
          };
      };
      //console.log(toClean);
      for (i = 0, j = X.length; i < j; i++){
        toInclude = true;
        for (l = 0; l < toClean.length; l++){
          if ((i + 60 > toClean[l])&(i < toClean[l])){
            toInclude = false;
          };
        };
        if (toInclude){
          newData.push(X[i]);
          newTraining.push(machine.training[i]);
          newY.push(Y[i]);
        };
      };
      if (newData.length > 8000){
        newData = newData.splice(newData.length - 8000, 8000);
        newY = newY.splice(newY.length - 8000, 8000);
        newTraining = newTraining.splice(newTraining.length - 8000, 8000);
      };
      X = newData;
      Y = newY;
      machine.training = newTraining;

      var kmeans = new KMeans(machine.principalPoints);
      var clusters = kmeans.cluster(X, numPrinPoints);
      machine.principalPoints = kmeans.centroids;
      machine.updateClusters();

  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      level += 1;
      game.state.start('Level');
    }
  }
};
