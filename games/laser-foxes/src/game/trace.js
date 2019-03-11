// coef
// AI,var,coef
// CamperAI,intercept,-6.90092040397532
// EvaderAI,intercept,-0.725160275121313
// ForagerAI,intercept,-8.62749310862299
// CamperAI,numLasersShot,-2.60074627739227
// EvaderAI,numLasersShot,0.40853109674087
// ForagerAI,numLasersShot,0.389669254751035
// CamperAI,distanceMoved,0.00288194141000557
// EvaderAI,distanceMoved,-0.00602854564493498
// ForagerAI,distanceMoved,-0.00399956425806645
// CamperAI,initialDist,0.00304026998646009
// EvaderAI,initialDist,0.000787997178168538
// ForagerAI,initialDist,0.00295029952227136
// CamperAI,finalDist,0.00434563600358985
// EvaderAI,finalDist,0.00310725735638807
// ForagerAI,finalDist,0.00536384990270504
// CamperAI,powerUp,1.34864788493106
// EvaderAI,powerUp,-2.02166545291659
// ForagerAI,powerUp,13.5269706633219
// CamperAI,Die,-2.43086333679225
// EvaderAI,Die,2.14090789084058
// ForagerAI,Die,1.72991213146611
// CamperAI,Kill,0.243066292689125
// EvaderAI,Kill,1.29979471194779
// ForagerAI,Kill,-0.716635051791829
// CamperAI,minDistOpp,-0.0030360902731916
// EvaderAI,minDistOpp,-0.00188240108709152
// ForagerAI,minDistOpp,-0.00500921158781616
// CamperAI,maxDistOpp,-0.0095808933439847
// EvaderAI,maxDistOpp,0.0033514513211764
// ForagerAI,maxDistOpp,-0.00582342235795203
// CamperAI,avgDistOpp,0.0195011176203527
// EvaderAI,avgDistOpp,0.00867240523137838
// ForagerAI,avgDistOpp,0.014475432800043
// CamperAI,initialEnergy,2.4751040065613
// EvaderAI,initialEnergy,-0.244168769349783
// ForagerAI,initialEnergy,-0.00209435817653978
// CamperAI,finalEnergy,-0.860970254798156
// EvaderAI,finalEnergy,0.772100366528056
// ForagerAI,finalEnergy,-0.642828562161174
// CamperAI,avgEnergy,0.390515569068892
// EvaderAI,avgEnergy,1.07224410584388
// ForagerAI,avgEnergy,0.668002435708739
// CamperAI,minEnergy,-1.88635056157423
// EvaderAI,minEnergy,-0.39881443463601
// ForagerAI,minEnergy,-1.86156246692104
// CamperAI,maxEnergy,0.115727432638796
// EvaderAI,maxEnergy,-1.60391838319882
// ForagerAI,maxEnergy,2.99676503301007

// new coefs
//AI,var,coef
//CamperAI,intercept,-6.78791539654315
//EvaderAI,intercept,-0.694637379947268
//ForagerAI,intercept,-10.5654958558226
//CamperAI,numLasersShot,1.23472041534036
//EvaderAI,numLasersShot,-1.48668350143176
//ForagerAI,numLasersShot,2.02650762606869
//CamperAI,distanceMoved,0.000357693342868917
//EvaderAI,distanceMoved,-0.0011582451564536
//ForagerAI,distanceMoved,0.000313131850970846
//CamperAI,initialDist,0.00113904114259956
//EvaderAI,initialDist,0.000328776863627776
//ForagerAI,initialDist,0.000427685202497312
//CamperAI,finalDist,0.00143641328295778
//EvaderAI,finalDist,0.000707734583221011
//ForagerAI,finalDist,0.000741584269380282
//CamperAI,powerUp,-5.24058996790606
//EvaderAI,powerUp,-1.13355124843791
//ForagerAI,powerUp,3.33070087691569
//CamperAI,Die,1.43589533591616
//EvaderAI,Die,-0.88158134066574
//ForagerAI,Die,0.927195722950725
//CamperAI,Kill,0.489849744897929
//EvaderAI,Kill,-0.235644942976023
//ForagerAI,Kill,-1.3929760506654
//CamperAI,minDistOpp,-0.000179256330532149
//EvaderAI,minDistOpp,-0.000130709018500373
//ForagerAI,minDistOpp,0.000781550389614494
//CamperAI,maxDistOpp,-0.000852509987097388
//EvaderAI,maxDistOpp,-0.000698352724113577
//ForagerAI,maxDistOpp,-0.000442769475103759
//CamperAI,avgDistOpp,6.73288987602575e-05
//EvaderAI,avgDistOpp,0.000647216353839848
//ForagerAI,avgDistOpp,-0.000481296091232781
//CamperAI,initialEnergy,0.40017153844159
//EvaderAI,initialEnergy,1.85945287107181
//ForagerAI,initialEnergy,0.276923594098839
//CamperAI,finalEnergy,2.14324069478775
//EvaderAI,finalEnergy,1.18529926703457
//ForagerAI,finalEnergy,2.5755977682625
//CamperAI,avgEnergy,0.541152474480037
//EvaderAI,avgEnergy,0.722526796240755
//ForagerAI,avgEnergy,0.722374969737186
//CamperAI,minEnergy,-0.39180112714794
//EvaderAI,minEnergy,-2.62945593304387
//ForagerAI,minEnergy,-1.45056612526276
//CamperAI,maxEnergy,-2.02328919464434
//EvaderAI,maxEnergy,-0.948495578000628
//ForagerAI,maxEnergy,-0.544782266135044

var Deque = require("collections/deque");
var util = require("./utilities");


function Stats(maxlen) {
    this.maxlen = maxlen;
    this.d = new Deque([]);
}

Stats.prototype.add = function (val) {
    if (this.d.length == this.maxlen) {
        this.d.shift();
    }
    this.d.push(val);
};

Stats.prototype.c = function () {
    return this.d.toArray();
};

function Trace(writer, gameNum, filename, nFrames, log) {
    filename = typeof filename !== 'undefined' ? filename : "trace";
    nFrames = typeof nFrames !== 'undefined' ? nFrames : 150;
    log = typeof log !== 'undefined' ? log : false;
    writer = typeof writer !== 'undefined' ? writer : null;

    this._filename = filename;
    this._log = log;
    this._nFrames = nFrames;
    this._writer = writer;

    this._player = null;
    this._game = null;
    this._gameNum = gameNum;
    this._playerName = null;
    this._playerOppName = null;
    this._data = [];


    this.header = ["game", "frame",
                   "playerClass",
                   "playerX", "playerY", "playerShotLaser",
                   "playerPickedUpPowerUp", "playerPowerUpType",
                   "playerEnergy", "playerGotHit", "playerAlive",
                   "enemyClass",
                   "enemyX", "enemyY", "enemyShotLaser",
                   "enemyPickedUpPowerUp", "enemyPowerUpType",
                   "enemyEnergy", "enemyGotHit", "enemyAlive"];

    this.playerX = new Stats(this._nFrames);
    this.playerY = new Stats(this._nFrames);
    this.playerShotLaser = new Stats(this._nFrames);
    this.playerShotLaserAtBlocks = new Stats(this._nFrames);
    this.playerPickedUpPowerUp = new Stats(this._nFrames);
    this.playerPowerUpType = new Stats(this._nFrames);
    this.playerEnergy = new Stats(this._nFrames);
    this.playerGotHit = new Stats(this._nFrames);
    this.playerAlive = new Stats(this._nFrames);
    this.enemyClass = new Stats(this._nFrames);
    this.enemyX = new Stats(this._nFrames);
    this.enemyY = new Stats(this._nFrames);
    this.enemyShotLaser = new Stats(this._nFrames);
    this.enemyShotLaserAtBlocks = new Stats(this._nFrames);
    this.enemyPickedUpPowerUp = new Stats(this._nFrames);
    this.enemyPowerUpType = new Stats(this._nFrames);
    this.enemyEnergy = new Stats(this._nFrames);
    this.enemyGotHit = new Stats(this._nFrames);
    this.enemyAlive = new Stats(this._nFrames);

    this.feat = {
        "intercept": 1.0,
        "avgNumLasersShot": null,
        "avgNumLasersShotAtBlocks": null,
        "avgDistanceMoved": null,
        "initialDist": null,
        "finalDist": null,
        "diffDist": null,
        "powerUp": null,
        "minDistOpp": null,
        "maxDistOpp": null,
        "avgDistOpp": null,
        "initialEnergy": null,
        "finalEnergy": null,
        "changeEnergy": null,
        "avgEnergy": null,
        "minEnergy": null,
        "maxEnergy": null
    };

    this.ai = ["ForagerAI", "AggressorAI", "CamperAI", "EvaderAI"];

    this.coef = {
        "ForagerAI": {
            "intercept" : -16.9644096801708,
            "avgNumLasersShot" : -0.488556407472865,
            "avgNumLasersShotAtBlocks" : 475.271312996487,
            "avgDistanceMoved" : 0.0380964209595049,
            "initialDist" : 0.000760342213439909,
            "finalDist" : 0.00102687536081285,
            "diffDist" : 0.000260720216931824,
            "powerUp" : 347.735902259628,
            "minDistOpp" : 0.000564786817399003,
            "maxDistOpp" : -0.000670116979372183,
            "avgDistOpp" : -0.00055966924160758,
            "initialEnergy" : 0.447133551862106,
            "changeEnergy" : 0.306087503261953,
            "finalEnergy" : 0.753221059809497,
            "avgEnergy" : 0.495907309668167,
            "minEnergy" : -0.322336404945554,
            "maxEnergy" : 1.11680842606184
        },
        "AggressorAI": {
            "intercept": 0.0,
            "avgNumLasersShot": 0.0,
            "avgNumLasersShotAtBlocks": 0.0,
            "avgDistanceMoved": 0.0,
            "initialDist": 0.0,
            "finalDist": 0.0,
            "diffDist": 0.0,
            "powerUp": 0.0,
            "minDistOpp": 0.0,
            "maxDistOpp": 0.0,
            "avgDistOpp": 0.0,
            "initialEnergy": 0.0,
            "changeEnergy": 0.0,
            "finalEnergy": 0.0,
            "avgEnergy": 0.0,
            "minEnergy": 0.0,
            "maxEnergy": 0.0
        },
        "CamperAI": {
            "intercept" : -7.79304657224967,
            "avgNumLasersShot" : 7.96097122232042,
            "avgNumLasersShotAtBlocks" : -77.2172435537539,
            "avgDistanceMoved" : 0.0139739308670471,
            "initialDist" : 0.000676174374330908,
            "finalDist" : 0.00092828306856102,
            "diffDist" : 0.000248689295221708,
            "powerUp" : -37.009444159775,
            "minDistOpp" : -3.14221737400369e-05,
            "maxDistOpp" : -0.00026501097858325,
            "avgDistOpp" : 0.000130779990860114,
            "initialEnergy" : 0.427939454928229,
            "changeEnergy" : -0.137688550988574,
            "finalEnergy" : 0.290250914361878,
            "avgEnergy" : 1.5521488264805,
            "minEnergy" : 0.126099560673173,
            "maxEnergy" : -1.38385592765049
        },
        "EvaderAI": {
            "intercept" : -0.426674212571771,
            "avgNumLasersShot" : 4.73309056284538,
            "avgNumLasersShotAtBlocks" : -288.533318067604,
            "avgDistanceMoved" : -0.110629879745096,
            "initialDist" : 0.000261357027205029,
            "finalDist" : 0.00040692450177674,
            "diffDist" : 0.000158017842144711,
            "powerUp" : -30.1277165821347,
            "minDistOpp" : 0.000570221032448191,
            "maxDistOpp" : 0.000532993190463009,
            "avgDistOpp" : -0.000863528242354564,
            "initialEnergy" : 0.316538789815682,
            "changeEnergy" : -0.305419854396934,
            "finalEnergy" : 0.0111189317511796,
            "avgEnergy" : 0.389756491488942,
            "minEnergy" : -0.439010485384694,
            "maxEnergy" : -0.210468469440129
        }
    };
}

Trace.prototype.probs = function () {
    var p = Array.apply(null, Array(this.ai.length))
                 .map(Number.prototype.valueOf, 0);
    for (var i = 0; i < this.ai.length; i++) {
        var coefsInAI = this.coef[this.ai[i]];
        for (var j in coefsInAI) {
            console.assert(coefsInAI.hasOwnProperty(j));
            p[i] += this.feat[j] * coefsInAI[j];
        }
    }

    var maxP = Math.max.apply(null, p);
    for (var k = 0; k < p.length; k++) {
        // subtract max for stability (analytically doesn't change result)
        p[k] = Math.exp(p[k] - maxP);
    }

    // need to take sum before for loop, otherwise sum changes during each loop
    var sumP = p.reduce(util.add, 0);
    for (var l = 0; l < p.length; l++) {
        p[l] = p[l] / sumP;
    }

    return p;
};

Trace.prototype.tracePlayer = function (player) {
    this._player = player;
};

Trace.prototype.nextGame = function (game, name, oppname) {
    this._game = game;
    this._playerName = name;
    this._playerOppName = oppname;
};

Trace.prototype.updateSummary = function () {

    var avgNumLasersShot = this.playerShotLaser.c().reduce(function (a, b) {
        return Number(a) + Number(b);
    }, 0);
    if (this.playerShotLaser.d.length > 0) {
        avgNumLasersShot /= this.playerShotLaser.d.length;
    }

    var avgNumLasersShotAtBlocks = this.playerShotLaserAtBlocks.c().reduce(
        function (a, b) {
            return Number(a) + Number(b);
        }, 0);

    if (this.playerShotLaserAtBlocks.d.length > 0) {
        avgNumLasersShotAtBlocks /= this.playerShotLaserAtBlocks.d.length;
    }

    var pickedUpPowerUp = Math.max.apply(Math, this.playerPickedUpPowerUp.c());

    var playerAliveList = this.playerAlive.c();
    var alive = [];
    var dead = [];
    for (var i = 0; i < playerAliveList.length; i++) {
        if (playerAliveList[i]) {
            alive.push(i);
        } else {
            dead.push(i);
        }
    }

    var die;
    if (dead.length > 0) {
        if (Math.min.apply(Math, alive) < Math.max.apply(Math, dead)) {
            die = 1.0;
        } else {
            die = 0.0;
        }
    } else {
        die = 0.0;
    }

    var enemyAliveList = this.enemyAlive.c();
    var alive = [];
    var dead = [];
    for (var i = 0; i < enemyAliveList.length; i++) {
        if (enemyAliveList[i]) {
            alive.push(i);
        } else {
            dead.push(i);
        }
    }

    var kill;
    if (dead.length > 0) {
        if (Math.min.apply(Math, alive) < Math.max.apply(Math, dead)) {
            kill = 1.0;
        } else {
            kill = 0.0;
        }
    } else {
        kill = 0.0;
    }

    console.assert(die == 0.0 || die == 1.0);
    console.assert(kill == 0.0 || kill == 1.0);

    var px = this.playerX.c();
    var dx = [];
    for (var i = 0; i < (px.length - 1); i++) {
        dx.push(px[i] - px[i + 1]);
    }
    var py = this.playerY.c();
    var dy = [];
    for (var i = 0; i < (py.length - 1); i++) {
        dy.push(py[i] - py[i + 1]);
    }

    console.assert(dx.length == dy.length);
    var distanceMoved = 0;
    for (var j = 0; j < dx.length; j++) {
        distanceMoved += Math.sqrt(Math.pow(dx[j], 2) + Math.pow(dy[j], 2));
    }
    var avgDistanceMoved = 0;
    if (dx.length > 0) {
        avgDistanceMoved = distanceMoved / dx.length;
    }

    var ex = this.enemyX.c();
    var ey = this.enemyY.c();
    var distanceOppX = util.subtract(px, ex);
    var distanceOppY = util.subtract(py, ey);

    var distanceOpp = [];
    for (var j = 0; j < distanceOppX.length; j++) {
        distanceOpp.push(Math.sqrt(
            Math.pow(distanceOppX[j], 2) + Math.pow(distanceOppY[j], 2)));
    }

    var minDistanceOpp = Math.min.apply(Math, distanceOpp);
    var maxDistanceOpp = Math.max.apply(Math, distanceOpp);
    var avgDistanceOpp = distanceOpp.reduce(util.add, 0);
    if (distanceOpp.length > 0) {
        avgDistanceOpp /= distanceOpp.length;
    }
    var initialDistanceOpp = distanceOpp[0];
    var finalDistanceOpp = distanceOpp[distanceOpp.length - 1];
    var diffDistanceOpp = finalDistanceOpp - initialDistanceOpp;

    var energy = this.playerEnergy.c();
    var initialEnergy = energy[0];
    var finalEnergy = energy[energy.length - 1];
    var changeEnergy = finalEnergy - initialEnergy;
    var avgEnergy = energy.reduce(util.add, 0);
    if (energy.length > 0) {
        avgEnergy /= energy.length;
    }
    var minEnergy = Math.min.apply(Math, energy);
    var maxEnergy = Math.max.apply(Math, energy);

    this.feat["avgNumLasersShot"] = avgNumLasersShot;
    this.feat["avgNumLasersShotAtBlocks"] = avgNumLasersShotAtBlocks;
    this.feat["avgDistanceMoved"] = avgDistanceMoved;
    this.feat["initialDist"] = initialDistanceOpp;
    this.feat["finalDist"] = finalDistanceOpp;
    this.feat["diffDist"] = diffDistanceOpp;
    this.feat["powerUp"] = pickedUpPowerUp;
    this.feat["Die"] = die;
    this.feat["Kill"] = kill;
    this.feat["minDistOpp"] = minDistanceOpp;
    this.feat["maxDistOpp"] = maxDistanceOpp;
    this.feat["avgDistOpp"] = avgDistanceOpp;
    this.feat["initialEnergy"] = initialEnergy;
    this.feat["finalEnergy"] = finalEnergy;
    this.feat["changeEnergy"] = changeEnergy;
    this.feat["avgEnergy"] = avgEnergy;
    this.feat["minEnergy"] = minEnergy;
    this.feat["maxEnergy"] = maxEnergy;


     // console.log(this.feat);
};

Trace.prototype.update = function () {
    if (this._game == null) {
        return;
    }
    this.playerX.add(this._player.rect().x);
    this.playerY.add(this._player.rect().y);

    var inFrontOfBlock = false;
    var inFrontPoint;
    if (this._player.faceRight()) {
        inFrontPoint = [this._player.rect().right + this._player.rect().width,
                        this._player.rect().centery];
    } else {
        inFrontPoint = [this._player.rect().left - this._player.rect().width,
                        this._player.rect().centery];
    }
    for(var i = 0; i < this._game._info.blocks.length; ++i) {
        if (this._game._info.blocks[i].rect().collidepoint(inFrontPoint)) {
            inFrontOfBlock = true;
            break;
        }
    }

    var playerShotLaser_temp;
    var playerShotLaserAtBlocks_temp;
    if (inFrontOfBlock) {
        playerShotLaserAtBlocks_temp = this._player._shoot;
        this.playerShotLaserAtBlocks.add(this._player._shoot);
        playerShotLaser_temp = false;
        this.playerShotLaser.add(false);
    } else {
        playerShotLaser_temp = this._player._shoot;
        this.playerShotLaser.add(this._player._shoot);
        playerShotLaserAtBlocks_temp = false;
        this.playerShotLaserAtBlocks.add(false);
    }
    this.playerPickedUpPowerUp.add(this._player._pickedUpPowerUp);
    // this.playerPowerUpType.add(this._player.power)
    this.playerEnergy.add(this._player.energy());
    this.playerGotHit.add(this._player._hit);
    this.playerAlive.add(this._player._alive);
    this.enemyX.add(this._player.opp().rect().x);
    this.enemyY.add(this._player.opp().rect().y);

    inFrontOfBlock = false;
    if (this._player.opp().faceRight()) {
        inFrontPoint = [this._player.opp().rect().right
                        + this._player.opp().rect().width,
                        this._player.opp().rect().centery];
    } else {
        inFrontPoint = [this._player.opp().rect().left
                        - this._player.opp().rect().width,
                        this._player.opp().rect().centery];
    }
    for(var i = 0; i < this._game._info.blocks.length; ++i) {
        if (this._game._info.blocks[i].rect().collidepoint(inFrontPoint)) {
            inFrontOfBlock = true;
            break;
        }
    }

    if (inFrontOfBlock) {
        enemyShotLaserAtBlocks_temp = this._player.opp()._shoot;
        this.enemyShotLaserAtBlocks.add(this._player.opp()._shoot);
        enemyShotLaser_temp = false;
        this.enemyShotLaser.add(false);
    } else {
        enemyShotLaser_temp = this._player.opp()._shoot;
        this.enemyShotLaser.add(this._player.opp()._shoot);
        enemyShotLaserAtBlocks_temp = false;
        this.enemyShotLaserAtBlocks.add(false);
    }
    this.enemyPickedUpPowerUp.add(this._player.opp()._pickedUpPowerUp);
    this.enemyEnergy.add(this._player.opp().energy());
    this.enemyGotHit.add(this._player.opp()._hit);
    this.enemyAlive.add(this._player.opp()._alive);

    var obs = [this._gameNum, this._game._info.frame];
    obs.push(this._playerName,
             this._player.rect().x,
             this._player.rect().y,
             playerShotLaser_temp,
             playerShotLaserAtBlocks_temp,
             this._player._pickedUpPowerUp,
             this._player.energy(),
             this._player._hit,
             this._player._alive,
             this._playerOppName,
             this._player.opp().rect().x,
             this._player.opp().rect().y,
             enemyShotLaser_temp,
             enemyShotLaserAtBlocks_temp,
             this._player.opp()._pickedUpPowerUp,
             this._player.opp().energy(),
             this._player.opp()._hit,
             this._player.opp()._alive
            );

    this._data.push(obs);

    this.updateSummary();
};

Trace.prototype.write = function () {
    for (var i = 0; i < this._data.length; i++) {
        this._writer.write(this._data[i]);
    }
};

exports.Stats = Stats;
exports.Trace = Trace;
