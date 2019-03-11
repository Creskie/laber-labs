var hillGraphics;

function FixedTerrain(game, level){
  this.game = game;
  this.levelLen = 1000;
  this.knotsX = [0];
  this.knotsY = [20];
  this.pointsX = [0];
  this.pointsY = [20];
  this.pointsPerMeter = 5.0;

  this._body = new Phaser.Physics.Box2D.Body(game, null, -300, 0);
  this._body.static = true;
  this._fixtures = [];

  hillGraphics = game.add.graphics(0, 0);

  this.fill(this.levelLen);

};

FixedTerrain.prototype.fill = function (levelLen) {
    lastX = this.knotsX[0];
    lastY = this.knotsY[0];

    while (lastX < (levelLen + 100.0)) {
        nextX = lastX + 7.0 + Math.random() * this.pointsPerMeter;

        if (this.high) {
            nextY = 3.0 + rbeta(0.5, 3.0) * 8.0;
            this.high = false;
        }
        else {
            nextY = 3.0 + rbeta(3.0, 0.5) * 8.0;
            this.high = true;
        }

        this.knotsX.push(nextX);
        this.knotsY.push(nextY);

        lastX = nextX;
        lastY = nextY;
    }

    console.log(this.knotsY);
    this.hillFn = numeric.spline(this.knotsX, this.knotsY);
    //minX = terrain.pointsX[terrain.pointsX.length - 1] + 0.01;
    minX = this.knotsX[0];
    maxX = this.knotsX[this.knotsX.length - 1];
    spanX = Math.floor((maxX - minX) * this.pointsPerMeter);
    newPointsX = numeric.linspace(minX, maxX, spanX);
    newPointsY = this.hillFn.at(newPointsX);

    //newPointsX.push(newPointsX[newPointsX.length-1]+0.01);
    //newPointsY.push(20);

    //lastX = newPointsX[newPointsX.length-1]+0.01;
    //lastY = 20;
    lastX = this.pointsX[0];
    lastY = this.pointsY[0];

    //console.log(newPointsY);

    hillGraphics.beginFill(0x3E8C67);
    hillGraphics.lineStyle(5, 0x3E8C67, 1);
    hillGraphics.moveTo(lastX*PTM-300, lastY*PTM)

    for (i = 0; i < newPointsX.length; ++i) {
        fixture = this._body.addEdge(lastX * PTM, lastY * PTM, newPointsX[i] * PTM, newPointsY[i] * PTM);
        //fixture = this._body.addEdge(lastX,  lastY, newPointsX[i], newPointsY[i]);
        this._fixtures.push(fixture);

        hillGraphics.lineTo(newPointsX[i]*PTM-300,newPointsY[i]*PTM);

        //hillGraphics.quadraticCurveTo(lastX * PTM, lastY * PTM, newPointsX[i] * PTM, newPointsY[i] * PTM);

        lastX = newPointsX[i];
        lastY = newPointsY[i];
    }
    hillGraphics.lineTo(newPointsX[newPointsX.length-1]*PTM-250,newPointsY[newPointsY.length-1]*PTM+200);
    hillGraphics.lineTo(newPointsX[newPointsX.length-1]*PTM-250, 250);
    hillGraphics.endFill();


    //this.pointsX = this.pointsX.concat(newPointsX.map(function (x) {
    //    return x * PTM;
    //    //return x;
    //}));
    //this.pointsY = this.pointsY.concat(newPointsY.map(function (x) {
    //    return x * PTM;
    //    //return x;
    //}));
    //console.log(this.pointsX)
};


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
