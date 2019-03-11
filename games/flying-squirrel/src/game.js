var startX = 100.0;
var startY = 10.0;
var gravity = 250.0;
var restitution = 0.01;
var PTM = 15.0; // conversion ratio
var cursors;
var background;
var background2;
var squirrelSprite;
var squirrel;
var squirrel2;
var terrain;
var terrain2;
var player;
var player2;
var features;

var machine;
var isDiving = 0;
var k = 5;

var zoom = 1;
var zoom2 = 1;


var Game = {
  preload: function(){
    game.load.image('Forest','imgs/Flying Squirrel Forest L1.png')
    game.load.image('Squirrel', 'imgs/Squirrel Cape 01.png')

    //game2.load.image('Forest2','C:/Users/Eric/Documents/Games/flyingsquirrelsjs/imgs/Flying Squirrel Forest L1.png')
    //game2.load.image('Squirrel2', 'C:/Users/Eric/Documents/Games/flyingsquirrelsjs/imgs/Squirrel Cape 01.png')

  },
  create: function(){
    game.stage.backgroundColor = '#000000';

    background = game.add.tileSprite(0, 0, 4608, 2307,'Forest'); //Image is 4808x2307
    background.scale.setTo(screen1Width/4608,screen1Height/2307);
    background.fixedToCamera = true;


    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = gravity;
    game.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();


    //squirrel.init('Squirrel');
    //fixedTerrain.init(1);

    squirrel = new Squirrel(game, 'Squirrel');
    terrain = new Terrain(game, 1);
    player = new Player(game, squirrel, terrain);
    machine = new kNear(5);


    //squirrelSprite = game.add.sprite(startX, startY, 'Squirrel');

    game.camera.bounds = null;
    game.camera.y = -screen1Height/2;
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

  },
  update: function(){
    //squirrelSprite.kill();

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      squirrel.dive();
      isDiving = 1;
    } else{
      isDiving = 0;
    }

    squirrelX = squirrel.getPositionX();
    squirrelY = squirrel.getPositionY();

    terrain.updateKnots(squirrelX/PTM);

    //adjHill = terrain.hillPoints.map(function (i) {
    //    return [terrain.hillPoints[i] + shift, terrain.hillPoints[i]];
    //});

    squirrel.updatePosition();

    currFeatures = player.stateToFeatures();

    machine.learn(currFeatures, isDiving);


    // Code for Displaying Squirrel
    //squirrelSprite = game.add.sprite(squirrelX-25, squirrelY-12.5, 'Squirrel'); //Adjusted so squirrel centered on ball
    //squirrelSprite.scale.setTo(50/415,25/219); //Scale to appropriate size

    //angle = Math.atan(squirrel._body.velocity.y/squirrel._body.velocity.x);
    //console.log(angle*(180/Math.PI));
    //xadj = 27.95*Math.sin(angle);
    //yadj = 27.95*Math.cos(angle);
    //squirrelSprite = game.add.sprite(squirrelX-xadj, squirrelY-yadj, 'Squirrel'); //Adjusted so squirrel centered on ball
    //squirrelSprite.scale.setTo(50/415,25/219);
    //squirrelSprite.angle = angle*(180/Math.PI);


    //newSquirrelPos = squirrel.getPosition();
    //background.tilePosition.x += (newSquirrelPos - squirrelPos);
    //console.log(newSquirrelPos - squirrelPos);

    zoom = Math.min(1, Math.pow((screen1Height-30)/(250-squirrelY),0.75));

    game.world.scale.setTo(zoom);
    background.scale.setTo((1/zoom)*screen1Width/4608,(1/zoom)*screen1Height/2307);
    game.camera.x = squirrelX*zoom - 100;
    game.camera.y = -screen1Height/2 - screen1Height + screen1Height*zoom;
    //game.camera.scale.setTo(0.5);
    //game.camera.focusOnXY(squirrelX + 400.0, squirrelY);
  },
  render: function(){
    //game.debug.box2dWorld();
    //game.debug.cameraInfo(game.camera, 32, 32);
  }
};

var Game2 = {
  preload: function(){
    game2.load.image('Forest','imgs/Flying Squirrel Forest L1.png')
    game2.load.image('Squirrel', 'imgs/Squirrel Cape 01.png')

    //game2.load.image('Forest2','C:/Users/Eric/Documents/Games/flyingsquirrelsjs/imgs/Flying Squirrel Forest L1.png')
    //game2.load.image('Squirrel2', 'C:/Users/Eric/Documents/Games/flyingsquirrelsjs/imgs/Squirrel Cape 01.png')

  },
  create: function(){
    game2.stage.backgroundColor = '#000000';

    background2 = game2.add.tileSprite(0, 0, 4608, 2307,'Forest'); //Image is 4808x2307
    background2.scale.setTo(screen2Width/4608,screen2Height/2307);
    background2.fixedToCamera = true;


    game2.physics.startSystem(Phaser.Physics.BOX2D);
    game2.physics.box2d.gravity.y = gravity;
    game2.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();


    //squirrel.init('Squirrel');
    //fixedTerrain.init(1);

    squirrel2 = new Squirrel(game2, 'Squirrel');
    terrain2 = new Terrain(game2, 1);
    player2 = new Player(game2, squirrel2, terrain2);

    //squirrelSprite = game.add.sprite(startX, startY, 'Squirrel');

    game2.camera.bounds = null;
    game2.camera.y = -screen2Height/2;
    cursors = game2.input.keyboard.createCursorKeys();

  },
  update: function(){
    //squirrelSprite.kill();

    squirrel2X = squirrel2.getPositionX();
    squirrel2Y = squirrel2.getPositionY();

    terrain2.updateKnots(squirrel2X/PTM);

    //adjHill = terrain.hillPoints.map(function (i) {
    //    return [terrain.hillPoints[i] + shift, terrain.hillPoints[i]];
    //});

    squirrel2.updatePosition();

    currFeatures2 = player2.stateToFeatures();
    dive = machine.classify(currFeatures2);
    console.log(dive);

    if (dive) {
        squirrel2.dive();
    };

    // Code for Displaying Squirrel
    //squirrelSprite = game.add.sprite(squirrelX-25, squirrelY-12.5, 'Squirrel'); //Adjusted so squirrel centered on ball
    //squirrelSprite.scale.setTo(50/415,25/219); //Scale to appropriate size

    //angle = Math.atan(squirrel._body.velocity.y/squirrel._body.velocity.x);
    //console.log(angle*(180/Math.PI));
    //xadj = 27.95*Math.sin(angle);
    //yadj = 27.95*Math.cos(angle);
    //squirrelSprite = game.add.sprite(squirrelX-xadj, squirrelY-yadj, 'Squirrel'); //Adjusted so squirrel centered on ball
    //squirrelSprite.scale.setTo(50/415,25/219);
    //squirrelSprite.angle = angle*(180/Math.PI);


    //newSquirrelPos = squirrel.getPosition();
    //background.tilePosition.x += (newSquirrelPos - squirrelPos);
    //console.log(newSquirrelPos - squirrelPos);

    zoom2 = Math.min(1, Math.pow((screen2Height-30)/(250-squirrel2Y),0.75));

    game2.world.scale.setTo(zoom2);
    background2.scale.setTo((1/zoom2)*screen2Width/4608,(1/zoom2)*screen2Height/2307);
    game2.camera.x = squirrel2X*zoom2 - 100;
    game2.camera.y = -screen2Height/2 - screen2Height + screen2Height*zoom2;

    //game2.camera.x = squirrel2X - 100;
    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    game2.debug.box2dWorld();
    game2.debug.cameraInfo(game2.camera, 32, 32);
  }
};
