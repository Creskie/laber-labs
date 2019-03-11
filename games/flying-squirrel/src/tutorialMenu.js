
var selection = 1;

var tutorialMenu = {
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

    background = game.add.tileSprite(0, 0, 4608, 2307,'backgroundImg'); //Image is 4808x2307
    background.scale.setTo(screenWidth/4608,screenHeight/2307);
    background.fixedToCamera = true;

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(selectOption, this);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    upKey.onDown.add(changeOptionUp, this);
    downKey.onDown.add(changeOptionDown, this);

    textOption1 = game.add.text(430, 280, "Watch Tutorial", {fontSize: '60px', fill: "#FFF", align: "center"});
    textOption2 = game.add.text(520, 360, "Start Level 1", {fontSize: '60px', fill: "#D3D3D3", align: "center"});
    textOption3 = game.add.text(560, 420, "Credits", {fontSize: '60px', fill: "#D3D3D3", align: "center"});
    textOption1.inputEnabled = true;
    textOption2.inputEnabled = true;
    textOption3.inputEnabled = true;
    textOption1.events.onInputOver.add(changeOptionTo1,this);
    textOption2.events.onInputOver.add(changeOptionTo2,this);
    textOption3.events.onInputOver.add(changeOptionTo3,this);
    textOption1.events.onInputDown.add(selectOption, this);
    textOption2.events.onInputDown.add(selectOption, this);
    textOption3.events.onInputDown.add(selectOption, this);
    textOption2.scale.setTo(0.6);
    textOption3.scale.setTo(0.6);

    triangleGraphics = game.add.graphics(0,0);
    triangleGraphics.beginFill(0xFFFFFF);
    triangleGraphics.drawTriangle([420,315, 390,295,390,335]);
    triangleGraphics.endFill();
  }
};


function changeOptionUp(){
  if (selection == 1){
    changeOptionTo3();
  } else if (selection == 2){
    changeOptionTo1();
  } else {
    changeOptionTo2();
  }
};

function changeOptionDown(){
  if (selection == 1){
    changeOptionTo2();
  } else if (selection == 2){
    changeOptionTo3();
  } else {
    changeOptionTo1();
  }
};

function changeOptionTo1(){
  textOption1.fill = '#FFF';
  textOption2.fill = '#D3D3D3';
  textOption3.fill = '#D3D3D3';
  textOption1.scale.setTo(1);
  textOption2.scale.setTo(0.6);
  textOption3.scale.setTo(0.6);
  textOption1.x = 430;
  textOption1.y = 280;
  textOption2.x = 520;
  textOption2.y = 360;
  textOption3.x = 560;
  textOption3.y = 420;
  selection = 1;

  triangleGraphics.destroy();
  triangleGraphics = game.add.graphics(0,0);
  triangleGraphics.beginFill(0xFFFFFF);
  triangleGraphics.drawTriangle([420,315, 390,295,390,335]);
  triangleGraphics.endFill();
};

function changeOptionTo2(){
  textOption1.fill = '#D3D3D3';
  textOption2.fill = '#FFF';
  textOption3.fill = '#D3D3D3';
  textOption1.scale.setTo(0.6);
  textOption2.scale.setTo(1);
  textOption3.scale.setTo(0.6);
  textOption1.x = 500;
  textOption1.y = 295;
  textOption2.x = 460;
  textOption2.y = 345;
  textOption3.x = 560;
  textOption3.y = 420;
  selection = 2;

  triangleGraphics.destroy();
  triangleGraphics = game.add.graphics(0,0);
  triangleGraphics.beginFill(0xFFFFFF);
  triangleGraphics.drawTriangle([450,380, 420,360,420,400]);
  triangleGraphics.endFill();
};

function changeOptionTo3(){
  textOption1.fill = '#D3D3D3';
  textOption2.fill = '#D3D3D3';
  textOption3.fill = '#FFF';
  textOption1.scale.setTo(0.6);
  textOption2.scale.setTo(0.6);
  textOption3.scale.setTo(1);
  textOption1.x = 500;
  textOption1.y = 295;
  textOption2.x = 520;
  textOption2.y = 360;
  textOption3.x = 520;
  textOption3.y = 415;
  selection = 3;

  triangleGraphics.destroy();
  triangleGraphics = game.add.graphics(0,0);
  triangleGraphics.beginFill(0xFFFFFF);
  triangleGraphics.drawTriangle([510,450, 480,430,480,470]);
  triangleGraphics.endFill();
};

function selectOption(){
  if (selection == 1){
    game.state.start('Tutorial');
  } else if (selection == 2) {
    game.state.start('Level1');
  } else {
    game.state.start('credits')
  }
};
