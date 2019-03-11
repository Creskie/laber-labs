var futureSquirrelX;
var futureSquirrelY;
var futureHillY;
var t;

function Player(game, squirrel, terrain, level){
  this.game = game;
  this.squirrel = squirrel;
  this.terrain = terrain;
  this.level = level;
  //this.prevAction = 0;
  //this.consecActions = 0;
};

Player.prototype.stateToFeatures = function() {
  features = [];

  squirrelX = this.squirrel.getPositionX();
  squirrelY = this.squirrel.getPositionY();

  hillY = this.terrain.hillFn.at((squirrelX+300)/PTM);

  // Adjusted for radius of squirrel
  if (squirrelY/PTM  < hillY - 2){
    grounded = 0;
  }
  else{
    grounded = 1;
  }
  //console.log('Grounded: ' + grounded);
  features.push(grounded);

  velX = this.squirrel.getVelocityX()/PTM;
  velY = this.squirrel.getVelocityY()/PTM;
  hypVel = Math.sqrt(Math.pow(velX,2) + Math.pow(velY,2));

  features.push((velX-35)/16.5, (velY+8)/23.8, (hypVel-43)/19.7);

  angle = Math.atan(velY/velX);
  features.push((angle+0.2)/0.5);

  bisect = bisect_left(this.terrain.knotsX, (squirrelX+300)/PTM, 0, this.terrain.knotsX.length);

  knot1 = this.terrain.knotsX[bisect];
  knot2 = this.terrain.knotsX[bisect + 1];

  midpt = (knot1 + knot2)/2;
  xKnots = [knot1, midpt, knot2];
  for (i = 0; i < xKnots.length; i++){
    deriv = this.terrain.hillFn.diff().at(xKnots[i]);
    val = this.terrain.hillFn.at(xKnots[i]);
    dx = xKnots[i] - (squirrelX+300)/PTM;
    dy = val - squirrelY/PTM;
    knotAngle = Math.atan(dy/dx);
    // console.log('Knot ' + i + ' Height ' +  val);
    // console.log('Knot ' + i + ' Derviative: ' + deriv);
    // console.log('Knot ' + i + ' DX: ' +  dx);
    // console.log('Knot ' + i + ' DY: ' + dy);
    // console.log('Knot ' + i + ' Angle: ' + knotAngle);
    features.push(deriv/0.5, (knotAngle-0.7)/0.5);
  };

  heightKnot1 = this.terrain.knotsY[bisect];
  heightKnot2 = this.terrain.knotsY[bisect + 1];
  if (heightKnot1 < heightKnot2){
    distToApex = knot1 - (squirrelX+300)/PTM;
    distToVall = knot2 - (squirrelX+300)/PTM;
  } else {
    distToApex = knot2 - (squirrelX+300)/PTM;
    distToVall = knot1 - (squirrelX+300)/PTM;
  };
  // console.log('Dist to Apex: ' + distToApex);
  // console.log('Dist to Valley: ' + distToVall);

  features.push((distToVall-13)/7.5, (distToApex-12)/7);

  distToSnake = 0;
  angToSnake = 0;
  if (this.level > 2){
    if (this.terrain.snakes.length != 0){
      nearestSnake = 0

      while((this.terrain.snakes[nearestSnake].position.x < squirrelX)&(this.terrain.snakes.length > nearestSnake + 1)){
        nearestSnake += 1;
      };
      if (this.terrain.snakes[nearestSnake].position.x < squirrelX){
        distToSnake = 0;
      } else{
        // console.log('Snake X: ' + this.terrain.snakes[nearestSnake].position.x);
        // console.log('Squirrel X: ' + squirrelX);
        // console.log('Snake Y: ' + this.terrain.snakes[nearestSnake].position.y);
        // console.log('Squirrel Y: ' + squirrelY);
        distToSnake = Math.sqrt(Math.pow(this.terrain.snakes[nearestSnake].position.x - squirrelX,2) + Math.pow(this.terrain.snakes[nearestSnake].position.y - squirrelY,2));
        dx = this.terrain.snakes[nearestSnake].position.x - squirrelX;
        dy = this.terrain.snakes[nearestSnake].position.y - squirrelY;
        angToSnake = angle - Math.atan(dy/dx);
      }
    };
  };
  if (distToSnake == 0){
    noSnakes = 1;
  } else {
    noSnakes = 0;
  };
  features.push(noSnakes);

  // console.log('Snake Indicator: ' + noSnakes);
  // console.log('Dist To Snake: ' + distToSnake);

  features.push((distToSnake-331)/439);
  features.push(angToSnake);

  distToAcorn = 0;
  angToAcorn = 0;
  if (this.level > 1){
    if (this.terrain.acorns.length != 0){
      nearestAcorn = 0

      while((this.terrain.acorns[nearestAcorn].position.x < squirrelX)&(this.terrain.acorns.length > nearestAcorn + 1)){
        nearestAcorn += 1;
      };
      if (this.terrain.acorns[nearestAcorn].position.x < squirrelX){
        distToAcorn = 0;
      } else{
        distToAcorn = Math.sqrt(Math.pow(this.terrain.acorns[nearestAcorn].position.x - squirrelX,2) + Math.pow(this.terrain.acorns[nearestAcorn].position.y - squirrelY,2));
        dx = this.terrain.acorns[nearestAcorn].position.x - squirrelX;
        dy = this.terrain.acorns[nearestAcorn].position.y - squirrelY;
        angToAcorn = angle - Math.atan(dy/dx);
      }
    };
  };
  if (distToAcorn == 0){
    noAcorns = 1;
  } else {
    noAcorns = 0;
  };

  features.push(noAcorns);
  features.push((distToAcorn-325)/532);
  features.push(angToAcorn);

  //In air Dive
  //futureSquirrelXVel = 2*t + velX
  //Inair don't dive
  //futureSquirrelXVel = velX

  hillDeriv = this.terrain.hillFn.diff().at((squirrelX+300)/PTM);
  theta = Math.atan(hillDeriv);
  sinTheta = -Math.sin(theta);
  // console.log('Deriv ' + hillDeriv);
  // console.log('Theta ' + theta);
  // console.log('Sine ' + sinTheta);

  if (grounded == 0){
     chngXDive = 2;
     chngXNoDive = 0;
  } else {
    chngXDive = (gravity/PTM+8)*sinTheta;
    chngXNoDive = (gravity/PTM)*sinTheta;
  };
  diffDiveX = chngXNoDive - chngXDive;
  //console.log('Diff X Vel Dive: ' + diffDiveX);
  features.push((diffDiveX-1.1)/2.3);

  altitude = squirrelY/PTM - hillY;
  features.push((altitude+18)/16);

  // if (prevAction == this.prevAction){
  //   this.consecActions += 1;
  // } else {
  //   this.consecActions = 0;
  // }
  // features.push(this.consecActions);
  // this.prevAction = prevAction;


  //On ground

  // console.log(squirrelX);
  // console.log(squirrelY);
  // console.log(velY);
  // futureSquirrelY = squirrelY;
  // futureHillY = futureSquirrelY + 10;
  // t = 0
  // console.log(futureSquirrelY);
  // console.log(futureHillY);
  // while(futureSquirrelY < futureHillY){
  //   t += 1;
  //   console.log(t)
  //   futureSquirrelX = 0.5*2*Math.pow(t,2) + velX*t + squirrelX;
  //   futureSquirrelY = 0.5*2*Math.pow(t,2) + velY*t + squirrelY;
  //   futureHillY = this.terrain.hillFn.at(futureSquirrelX/PTM)*PTM;
  // };
  // console.log(futureSquirrelX);
  // console.log(futureSquirrelY);
  // console.log(this.terrain.hillFn.at(futureSquirrelX/PTM)*PTM);
  //diveLandingPoint =

  return features;

};
