function Squirrel(game, sqImg, boostImg1, boostImg2, boostImg3, initX, initY) {
    this.game = game;
    this._radius = 0.8;
    this._prevPosition = null;
    this._currPosition = {x: startX, y: startY};

    this.boostImg1 = boostImg1;
    this.boostImg2 = boostImg2;
    this.boostImg3 = boostImg3;
    this.sqImg = sqImg;

    this.squirrelSprite = game.add.sprite(10, 10, sqImg);
    //this.squirrelSprite.tint = 0xEE2B2A;
    //this.squirrelSprite.scale.setTo(50/415,25/219);
    this.game.physics.box2d.enable(this.squirrelSprite);
    this.squirrelSprite.body.setCircle(this._radius*PTM);
    this.squirrelSprite.body.dynamic = true;
    this.squirrelSprite.body.bullet = true;
    this.squirrelSprite.body.density = 1.0;
    this.squirrelSprite.body.friction = friction; //0.15
    this.squirrelSprite.body.restitution = 0.0;
    this.squirrelSprite._minXVel = 10.0 * PTM;

    // this._body = new Phaser.Physics.Box2D.Body(game, null, squirrel._currPosition.x, squirrel._currPosition.y);
    // this._body.dynamic = true;
    // this._body.bullet = true;
    // this._body.setCircle(squirrel._radius * PTM);
    // this._body.density = 1.0;
    // this._body.friction = 0.15;
    // this._body.restitution = 0.0;
    // this._minXVel = 10.0 * PTM;

};

//Squirrel.prototype = Object.create(gameObj.Gameobj.prototype);

Squirrel.prototype.updatePosition = function () {
    // this._prevPosition = this._currPosition;
    // this._currPosition = {x: this._body.x, y: this._body.y};
    // this._body.velocity.x = Math.max(this._body.velocity.x, this._minXVel);

    this._prevPosition = this._currPosition;
    this._currPosition = {x: this.squirrelSprite.body.x, y: this.squirrelSprite.body.y};
    this.squirrelSprite.body.velocity.x = Math.max(this.squirrelSprite.body.velocity.x, this.squirrelSprite._minXVel);
    angle = Math.atan(this.squirrelSprite.body.velocity.y/this.squirrelSprite.body.velocity.x);
    this.squirrelSprite.body.angle = angle*(180/Math.PI) - 45;

};

Squirrel.prototype.dive = function () {
    //this._body.applyForce(2.0, 10.0);
    this.squirrelSprite.body.applyForce(2.0, 8.0);

    //this.squirrelSprite.body.applyForce(2.0, -10.0);
};

Squirrel.prototype.boost = function (timeBoost){
    if (timeBoost < boostLength/3){
      this.squirrelSprite.loadTexture(this.boostImg1);
    } else if (timeBoost < 2*boostLength/3) {
      this.squirrelSprite.loadTexture(this.boostImg2);
    } else if (timeBoost < boostLength) {
      this.squirrelSprite.loadTexture(this.boostImg3);
    } else {
      this.squirrelSprite.loadTexture(this.sqImg);
    }
    velX = this.squirrelSprite.body.velocity.x/PTM;
    velY = this.squirrelSprite.body.velocity.y/PTM;
    normVel = Math.sqrt(Math.pow(velX,2) + Math.pow(velY,2));
    this.squirrelSprite.body.applyForce(1.5*velX/normVel, 1.5*velY/normVel);
};

Squirrel.prototype.parachute = function(){
    velY = this.squirrelSprite.body.velocity.y/PTM;
    // this.squirrelSprite.body.applyForce(0, -3.37*Math.abs(velY));
    if (velY < -1){
      this.squirrelSprite.body.applyForce(0, -0.5*Math.abs(velY));
    } else {
      this.squirrelSprite.body.applyForce(0, -3.5*Math.abs(velY));
    }
}

Squirrel.prototype.getPositionX = function () {
    return this._currPosition.x;
};
Squirrel.prototype.getPositionY = function () {
    return this._currPosition.y;
};

Squirrel.prototype.setPositionX = function (x) {
    this._currPosition.x = x;
};
Squirrel.prototype.setPositionY = function (y) {
    this._currPosition.y = y;
};

Squirrel.prototype.getVelocityX = function(){
  return this.squirrelSprite.body.velocity.x;
};
Squirrel.prototype.getVelocityY = function(){
  return this.squirrelSprite.body.velocity.y;
};

// Squirrel.prototype.respawn = function(initX, initY, sqImg){
//   this._currPosition = {x: initX, y: initY};
//
//   this.squirrelSprite = game.add.sprite(initX, initY, sqImg);
//   this.squirrelSprite.scale.setTo(50/415,25/219);
//   this.game.physics.box2d.enable(this.squirrelSprite);
//   this.squirrelSprite.body.setCircle(this._radius*PTM);
//   this.squirrelSprite.body.dynamic = true;
//   this.squirrelSprite.body.bullet = true;
//   this.squirrelSprite.body.density = 1.0;
//   this.squirrelSprite.body.friction = 0.15;
//   this.squirrelSprite.body.restitution = 0.0;
//   this.squirrelSprite._minXVel = 10.0 * PTM;
// };
