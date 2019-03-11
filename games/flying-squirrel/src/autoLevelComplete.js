var autoLevelComplete = {
    preload: function(){
      game.stage.backgroundColor = '#000000';
      game.load.image('backgroundImg','imgs/Flying Squirrel Title Screen L0.png')
    },
    create: function(){
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      game.input.onDown.add(goFull, this);

      background = game.add.tileSprite(0, 0, 4608, 2307,'backgroundImg'); //Image is 4808x2307
      background.fixedToCamera = true;
      background.scale.setTo((1/zoom)*screenWidth/4608,(1/zoom)*screenHeight/2307);

      text = game.add.text(440, 300, "Level "+ level + " Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      countdownText = game.add.text(450, 380, "Next Level Starting", {fontSize: '32px', fill: "#FFF", align: "center"});
      text.fixedToCamera = true;
      countdownText.fixedToCamera = true;
      text.scale.setTo(1/zoom);
      countdownText.scale.setTo(1/zoom);

      window.sendPcaTrim();
      var newData = [];
      var newTraining = [];
      var newY = [];
      var toClean = [];
      for (i = 1 + prevDataLength; i < X.length; i++){
          var prevXVel =  X[i-1][1];
          var currXVel = X[i][1];
          if (currXVel - prevXVel < -0.3){
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

      timer = game.time.create();
      timerEvent = timer.add(Phaser.Timer.MINUTE*0 + Phaser.Timer.SECOND*5);
      timer.start();

    },
    update: function(){
      s = Math.round((timerEvent.delay - timer.ms) / 1000);
      var minutes = "0" + Math.floor(s / 60);
      var seconds = "0" + (s - minutes * 60);
      if (s == 0){
        if (level == 1){
          game.state.start('Level2');
        } else if (level == 2){
          game.state.start('Level3');
        } else {
          scenery = getRandomInt(1,3);
          level += 1;
          game.state.start('Level');
        }
      };
      countdownText.text = "Next Level Starting in: " + seconds.substr(-2);
    }
};
