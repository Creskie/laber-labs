function Terrain(game, level, player, hillCol, cloud1, cloud2, cloud3, acorn, snake) {
  this.game = game;
  this.hillGraphics = null;
  this.hillColor = hillCol;
  this.knotsX = [0];
  this.knotsY = [10];
  if (player == 1){
    this.maxKnotBuffer = 140; //120
    this.maxKnotAlarm = 120; //100
  } else{
    this.maxKnotBuffer = 100; //100
    this.maxKnotAlarm = 80; //80
  };
  this.minKnotTrim = -15;
  this.minKnotAlarm = -30;
  this.pointsX = [0];
  this.pointsY = [10];
  this.high = false;
  this.pointsPerMeter = 1.0;
  //this.hillPoints = [{'x': terrain.pointsX, 'y': terrain.pointsY}];
  //this.hillKnots = [{'x': terrain.knotsX, 'y': terrain.knotsY}];
  this.hillFn = null;
  this.level = level;

  this.cloud1Sprite = cloud1;
  this.cloud2Sprite = cloud2;
  this.cloud3Sprite = cloud3;

  this.acornSprite = acorn;
  this.acornProb = 0.05;
  this.acorns = [];

  this.snakeSprite = snake;
  this.snakeProb = 0.2;
  //this.snakes = this.game.add.physicsGroup();
  //this.snakes.enableBody = true;
  //this.snakes.physicsBodyType = Phaser.Physics.BOX2D;
  this.snakes = [];

  this._body = new Phaser.Physics.Box2D.Body(game, null, -300, 0);
  this._body.static = true;
  this._fixtures = [];

  this.hillGraphics = this.game.add.graphics(0, 0);
  //this.hillGraphics.beginFill(0x3E8C67);
  //this.hillGraphics.lineStyle(5, 0x3E8C67, 1);

  this.updateKnots(0.0);

};

Terrain.prototype.updateKnots = function (x) {
    updated = false;
    if (this.knotsX[0] < x + this.minKnotAlarm) {
        this.trim(x);
        updated = true;
    }

    if (this.knotsX[this.knotsX.length - 1] < x + this.maxKnotAlarm) {
        this.fill(x);
        //console.log(this.knotsX[this.knotsX.length - 1]);
        updated = true;
        //console.log(this.pointsX)
    }

    if (updated) {
        this.points = [{'x': this.pointsX, 'y': this.pointsY}];
        this.knots = [{'x': this.knotsX, 'y': this.knotsY}];
    }
};

Terrain.prototype.trim = function (x) {
    //console.log(this.knotsX)
    //console.log(x)
    //console.log(x + this.minKnotTrim)
    trimAt = bisect_left(this.knotsX, x + this.minKnotTrim, 0, this.knotsX.length);
    //console.log(trimAt)
    if (trimAt) {
        this.knotsX = this.knotsX.slice(trimAt);
        this.knotsY = this.knotsY.slice(trimAt);
    }

    //console.log(this.pointsX)
    //console.log(x)
    //console.log(x + this.minKnotTrim)
    trimAt = bisect_left(this.pointsX,x + this.minKnotTrim, 0, this.pointsX.length);
    //console.log(trimAt)
    //console.log(this.pointsX.length)
    //console.log(this._fixtures.length)
    if (trimAt) {
        this.pointsX = this.pointsX.slice(trimAt);
        this.pointsY = this.pointsY.slice(trimAt);
        for (i = 0; i < trimAt; ++i) {
            this._body.removeFixture(this._fixtures[i]);
        }
        this._fixtures = this._fixtures.slice(trimAt);
    }
    //console.log(this.pointsX)
};

Terrain.prototype.fill = function (x) {
    lastX = this.knotsX[this.knotsX.length - 1];
    lastY = this.knotsY[this.knotsY.length - 1];

    while (lastX < (x + this.maxKnotBuffer)) {
        nextX = lastX + 12.0 + Math.random() * this.pointsPerMeter; //7.0

        if (this.high) {
            nextY = 1.0 + rbeta(0.5, 3.0) * 8.0; //.5, 3.0   +2.0
            this.high = false;
        } else{
            nextY = 3.0 + rbeta(3.0, 0.5) * 8.0;    //+2.0
            this.high = true;
            if (this.level > 2){
              p = Math.random();
              if (p < this.snakeProb){
                snake = this.game.add.sprite(nextX*PTM - 300 - 15, nextY*PTM - 20, this.snakeSprite);
                //snake.scale.setTo(35/160,30/144);
                this.game.physics.box2d.enable(snake);
                snake.body.setCollisionCategory(2);
                snake.body.static = true;
                frontGroup.add(snake);
                this.snakes.push(snake);
              };
            };
        };

        cloudP = Math.random();
        if (cloudP < 0.1){
          cloud = this.game.add.sprite(nextX*PTM - 300, -490-Math.random()*20, this.cloud1Sprite);
          backgroundGroup.add(cloud);
          //cloud.scale.setTo(0.5,0.5);
        } else if (cloudP < 0.2){
          cloud = this.game.add.sprite(nextX*PTM - 300, -490-Math.random()*20, this.cloud2Sprite);
          backgroundGroup.add(cloud);
          //cloud.scale.setTo(0.5,0.5);
        } else if (cloudP < 0.3){
          cloud = this.game.add.sprite(nextX*PTM - 300, -490-Math.random()*20, this.cloud3Sprite);
          backgroundGroup.add(cloud);
          //cloud.scale.setTo(0.8,0.8);
        }

        if (this.level > 1){
          acornP = Math.random();
          if (acornP < this.acornProb){
            acorn = this.game.add.sprite(nextX*PTM - 300, -Math.random()*300, this.acornSprite);
            //acorn.scale.setTo(0.3,0.3);
            this.game.physics.box2d.enable(acorn);
            acorn.body.setCollisionCategory(3);
            acorn.body.static = true;
            acorn.body.sensor = true;
            frontGroup.add(acorn);
            this.acorns.push(acorn);
          };
        };

        this.knotsX.push(nextX);
        this.knotsY.push(nextY);

        lastX = nextX;
        lastY = nextY;
    }

    //newKnots = terrain.knotsX.map(function (e, i) {
    //    return [terrain.knotsX[i], terrain.knotsY[i]];
    //});

    //terrain.hillFn = new BSpline(newKnots, 3, true);

    this.hillFn = numeric.spline(this.knotsX, this.knotsY);
    minX = this.pointsX[this.pointsX.length - 1]; // + 0.01?
    //minX = terrain.knotsX[0];
    maxX = this.knotsX[this.knotsX.length - 3];
    spanX = Math.floor((maxX - minX) * this.pointsPerMeter);
    newPointsX = numeric.linspace(minX, maxX, spanX);
    //console.log(minX)
    //console.log(maxX)
    //console.log(this.knotsX)
    newPointsY = this.hillFn.at(newPointsX);
    //console.log(newPointsY)

    lastX = this.pointsX[this.pointsX.length - 1];
    lastY = this.pointsY[this.pointsY.length - 1];

    hillColor = this.hillColor;
    hillLineColor = this.hillColor;
    this.hillGraphics.beginFill(hillColor);
    this.hillGraphics.lineStyle(5, hillLineColor, 1);
    this.hillGraphics.moveTo(lastX*PTM-300, 250);

    for (i = 0; i < newPointsX.length; ++i) {
        fixture = this._body.addEdge(lastX * PTM, lastY * PTM, newPointsX[i] * PTM, newPointsY[i] * PTM);
        this._fixtures.push(fixture);

        this.hillGraphics.lineTo(newPointsX[i]*PTM-300,newPointsY[i]*PTM);

        lastX = newPointsX[i];
        lastY = newPointsY[i];
    }

    this.hillGraphics.lineTo(newPointsX[newPointsX.length-1]*PTM-250,newPointsY[newPointsY.length-1]*PTM+200);
    this.hillGraphics.lineTo(newPointsX[newPointsX.length-1]*PTM-250, 250);
    this.hillGraphics.endFill();

    this.pointsX = this.pointsX.concat(newPointsX.map(function (x) {
        return x;
    }));
    this.pointsY = this.pointsY.concat(newPointsY.map(function (x) {
        return x;
    }));
};


/// BISECT FUNCTION ///
function bisect_left(a, x, lo, hi) {
    while (lo < hi) {
        mid = Math.floor((lo + hi) / 2.);
        if (a[mid] < x) {
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    return lo;
}


///////////////////////// BETA DRAWS ///////////////////////////
function rbeta(alpha, beta) {
    var alpha_gamma = rgamma(alpha, 1);
    return alpha_gamma / (alpha_gamma + rgamma(beta, 1));
}

// From Python source, so I guess it's PSF Licensed
var SG_MAGICCONST = 1 + Math.log(4.5);
var LOG4 = Math.log(4.0);

function rgamma(alpha, beta) {
    // does not check that alpha > 0 && beta > 0
    if (alpha > 1) {
        // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
        // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
        var ainv = Math.sqrt(2.0 * alpha - 1.0);
        var bbb = alpha - LOG4;
        var ccc = alpha + ainv;

        while (true) {
            var u1 = Math.random();
            if (!((1e-7 < u1) && (u1 < 0.9999999))) {
                continue;
            }
            var u2 = 1.0 - Math.random();
            v = Math.log(u1 / (1.0 - u1)) / ainv;
            x = alpha * Math.exp(v);
            var z = u1 * u1 * u2;
            var r = bbb + ccc * v - x;
            if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
                return x * beta;
            }
        }
    }
    else if (alpha == 1.0) {
        var u = Math.random();
        while (u <= 1e-7) {
            u = Math.random();
        }
        return -Math.log(u) * beta;
    }
    else { // 0 < alpha < 1
        // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
        while (true) {
            var u3 = Math.random();
            var b = (Math.E + alpha) / Math.E;
            var p = b * u3;
            if (p <= 1.0) {
                x = Math.pow(p, (1.0 / alpha));
            }
            else {
                x = -Math.log((b - p) / alpha);
            }
            var u4 = Math.random();
            if (p > 1.0) {
                if (u4 <= Math.pow(x, (alpha - 1.0))) {
                    break;
                }
            }
            else if (u4 <= Math.exp(-x)) {
                break;
            }
        }
        return x * beta;
    }
}
