var level1Complete = {
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
      text1 = game.add.text(440, 280, "Level 1 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      text2 = game.add.text(280, 360, "You Can Now Press the Right Arrow for an Additional Boost", {fontSize: '24px', fill: "#FFF", align: "center"});
      text3 = game.add.text(370, 420, "Pick Up Acorns to Recharge Your Boost Faster", {fontSize: '24px', fill: "#FFF", align: "center"});
      text4 = game.add.text(460, 500, "Press ENTER to Start Level 2", {fontSize: '24px', fill: "#FFF", align: "center"});
      text1.fixedToCamera = true;
      text1.scale.setTo(1/zoom);
      text2.fixedToCamera = true;
      text2.scale.setTo(1/zoom);
      text3.fixedToCamera = true;
      text3.scale.setTo(1/zoom);
      text4.fixedToCamera = true;
      text4.scale.setTo(1/zoom);

      //console.log(prevDataLength);
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
      //console.log(newTraining.length);
      machine.training = newTraining;

      var kmeans = new KMeans();
      var clusters = kmeans.cluster(X, numPrinPoints);
      machine.principalPoints = kmeans.centroids;
      machine.updateClusters();

  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level2');
    }
  }
};

// function clean(data){
//   var newData = [];
//   var toClean = [];
//   for (i = 1; i < data.length; i++){
//       var prevXVel =  data[i-1][1];
//       var currXVel = data[i][1];
//       if (currXVel - prevXVel < -5){
//         toClean.push(i);
//       };
//   };
//   for (i = 0, j = data.length; i < j; i++){
//     toInclude = true;
//     for (k = 0; k < toClean.length; k++){
//       if ((i + 60 > toClean[k])&(i < toClean[k])){
//         toInclude = false;
//       };
//     };
//     if (toInclude){
//       newData.push(data[i]);
//     };
//   };
//   return newData
  //  for (i = toClean.length-1; i > -1; i--){
  //    var delNum = toClean[i] - toClean[i-1];
  //    if (delNum > 60){
  //      delNum = 60;
  //    }
    //  console.log("First " + testArray);
    //  var testArray = [1, 2, 3, [4, 5], [6,7]];
    //  console.log("Second " + testArray);
    //  var removed = testArray.splice(2,2);
    //  console.log("Third " + testArray);
    //  console.log(removed);
  //   console.log('DelNum: '+ delNum);
  //   console.log('toClean: '+ toClean[i]);
  //   console.log('Pre Data: ' + data);
  //   var removed = data.splice(toClean[i] - delNum + 1, delNum);
  //   console.log('Removed: ' + removed);
  //   console.log('Post Data: 'data);
  //  };
  //  return newData;
//}
