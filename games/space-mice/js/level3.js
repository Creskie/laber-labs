/**
 * Created by npkapur on 10/19/16.
 */

var mice;
var player;
var cursors;

// The following four  variables requires reset in gameOver.js and highScore.js
// for different level implementation
var score = 0;
var prevscore = 0;
var curlevel = 1;
var scoreText;
var lasers;
var laserTime = 0;
var laser;
var lives = 3000;
var counter;
var starCounter = 0;
var rats;
var asteroids, asteroids45, asteroids90, asteroids135, asteroids180, asteroids225, asteroids270, asteroids315;
var shootingStars, bigLaser, big;
var mouse;
var rat;
var asteroid, asteroid45, asteroid90, asteroid135, asteroid180, asteroid225, asteroid270, asteroid315;
var shootingStar;
var pos;
var music;
var shoot;
var star1, star2, star3, star4, star5, star6, star7, star8;
var starSet = 1;
var starInc = true;
var hit = false;
var hitCounter = 0;
var run = 0;
var highScore = -1000000000000;
var asteroidBlaster = false;


//var sumU;
var Level3 = {
    preload: function() {
        game.load.image('background', 'assets/menu.png');
        game.load.spritesheet('cat', 'assets/newCats.png', 67, 50);
        game.load.image('laser', 'assets/Laser.png');
        game.load.spritesheet('mouse', 'assets/newMice.png', 77, 61);
        game.load.spritesheet('rat', 'assets/rats.png', 169, 130);
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.image('bigLaser', 'assets/bigLaser.png');
        game.load.spritesheet('asteroid', 'assets/asteroids.png', 236.67, 100);
        game.load.spritesheet('asteroid45', 'assets/asteroids45.png', 230, 225);
        game.load.spritesheet('asteroid90', 'assets/asteroids90.png', 105, 220);
        game.load.spritesheet('asteroid135', 'assets/asteroids135.png', 230, 225);
        game.load.spritesheet('asteroid180', 'assets/asteroids180.png', 236.67, 100);
        game.load.spritesheet('asteroid225', 'assets/asteroids225.png', 230, 225);
        game.load.spritesheet('asteroid270', 'assets/asteroids270.png', 105, 220);
        game.load.spritesheet('asteroid315', 'assets/asteroids315.png', 230, 225);
        game.load.spritesheet('shootingStar', 'assets/shootingStar.png', 80, 45);
        game.load.audio('music', ['assets/sounds/music.ogg', 'assets/sounds/music.mp3']);
        game.load.audio('shoot', ['assets/sounds/shoot_laser.ogg', 'assets/sounds/shoot_laser.wav']);
    },

    gofull: function() {

        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }

    },

    create: function () {


        // Stretch to full screen
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.input.onDown.add(this.gofull);
        //
        //         // Keep original size
        //             // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
        //
        //                 // Maintain aspect ratio
        //                     // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        //

        music = game.add.audio('music');
        shoot = game.add.audio('shoot');
        music.loop = true;
        music.play();

        // Start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add the background
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        // Add the cat to the board in the correct place
        player = game.add.sprite(game.world.width - 150, game.world.height - 150, 'cat');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        // Add the lasers as a group
        lasers = game.add.physicsGroup();
        lasers.createMultiple(30, 'laser', false);
        lasers.setAll('checkWorldBounds', true);
        lasers.setAll('outOfBoundsKill', true);

        mice = game.add.physicsGroup();
        mice.createMultiple(30, 'mouse', false);
        mice.setAll('checkWorldBounds', true);
        mice.setAll('outOfBoundsKill', true);
        // Mouse generation speed for different levels
        micespeed = Math.ceil(50 / (1 + 0.1*(curlevel-1)));

        rats = game.add.physicsGroup();
        rats.createMultiple(30, 'rat', false);
        rats.setAll('checkWorldBounds', true);
        rats.setAll('outOfBoundsKill', true);

        asteroids = game.add.physicsGroup();
        asteroids.createMultiple(30, 'asteroid', false);
        asteroids.setAll('checkWorldBounds', true);
        asteroids.setAll('outOfBoundsKill', true);

        asteroids45 = game.add.physicsGroup();
        asteroids45.createMultiple(30, 'asteroid45', false);
        asteroids45.setAll('checkWorldBounds', true);
        asteroids45.setAll('outOfBoundsKill', true);

        asteroids90 = game.add.physicsGroup();
        asteroids90.createMultiple(30, 'asteroid90', false);
        asteroids90.setAll('checkWorldBounds', true);
        asteroids90.setAll('outOfBoundsKill', true);

        asteroids135 = game.add.physicsGroup();
        asteroids135.createMultiple(30, 'asteroid135', false);
        asteroids135.setAll('checkWorldBounds', true);
        asteroids135.setAll('outOfBoundsKill', true);

        asteroids180 = game.add.physicsGroup();
        asteroids180.createMultiple(30, 'asteroid180', false);
        asteroids180.setAll('checkWorldBounds', true);
        asteroids180.setAll('outOfBoundsKill', true);

        asteroids225 = game.add.physicsGroup();
        asteroids225.createMultiple(30, 'asteroid225', false);
        asteroids225.setAll('checkWorldBounds', true);
        asteroids225.setAll('outOfBoundsKill', true);

        asteroids270 = game.add.physicsGroup();
        asteroids270.createMultiple(30, 'asteroid270', false);
        asteroids270.setAll('checkWorldBounds', true);
        asteroids270.setAll('outOfBoundsKill', true);

        asteroids315 = game.add.physicsGroup();
        asteroids315.createMultiple(30, 'asteroid315', false);
        asteroids315.setAll('checkWorldBounds', true);
        asteroids315.setAll('outOfBoundsKill', true);

        shootingStars = game.add.physicsGroup();
        shootingStars.createMultiple(10, 'shootingStar', false);
        shootingStars.setAll('checkWorldBounds', true);
        shootingStars.setAll('outOfBoundsKill', true);

        bigLaser = game.add.physicsGroup();
        bigLaser.createMultiple(2, 'bigLaser', false);
        bigLaser.setAll('checkWorldBounds', true);
        bigLaser.setAll('outOfBoundsKill', true);

        stars = game.add.group();
        stars.createMultiple(8, 'star', false);

        // Starting # of lives
        //		lives = 3;
        //		score = 0;

        // Allow the user to input movement
        cursors = game.input.keyboard.createCursorKeys();
        // In addition to the arrow keys create the shift key as one that can be recognized
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SHIFT]);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        // Create a scoreboard
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '20px', fill: '#FFF'});

        // Create a counter for generating mice and rats.  SHOULD MAYBE SWITCH LASERS TO THIS GENERATION
        counter = 1;
        player.animations.add('float', [0, 2], 1.5, true);
        player.animations.add('hit', [1, 3], 1.5, false);
        player.animations.play('float');


        // load the entry score for leaderboard
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {

                lscore = xmlhttp.responseText; // entry score
            }
        }

        xmlhttp.open("POST","phpwrite2.php",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send();
        //End of load the entry score


        //  Load the High Score
        highScore = Game.getCookie("Hscore");
        if (highScore == "") {
            highScore = -99999999
        }




    },


    update: function() {
        if (highScore == -99999999) {
            // Update the score and lives
            scoreText.text = "Score: " + score + "   Lives: " + lives + "   Level: " + curlevel;
        } else {
            scoreText.text = "Score: " + score + "   Lives: " + lives + "   Level: " + curlevel +
                "  High Score: " + Game.getCookie("Hscore");
        }

        // Update the leaderboard if the score is greater the lowest score of leadboard
        if (lives <=0 && score > lscore){
            //alert(lscore);
            var name = prompt("Submit your score to leaderboard? Type your name:", "Cat Cat");
            if (name != null) {

                // load the entry score for leaderboard
                var xmlhttp;
                if (window.XMLHttpRequest)
                {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else
                {// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange=function()
                {
                    if (xmlhttp.readyState==4 && xmlhttp.status==200)
                    {

                    }
                }

                xmlhttp.open("POST","phpwrite2.php",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.send("name="+name+"&score="+score);

            }


        }


        if (lives <= 0 && score > highScore) {
            run++;
            highScore = score;


            Game.setCookie("Hscore", highScore, 30);
            game.state.start('HighScore');
        } else if (lives <= 0) {
            run++;
            game.state.start('GameOver');
        }

        // If current score is 100 higher then prescore, then
        // move to the next level
        // console.log(prevscore);
        // console.log(curlevel);
        if (score  >= prevscore + 100) {
            prevscore = score;
            curlevel = curlevel + 1;
            game.state.start('level');
        }

        // If no buttons are pressed the player is not moving
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        // Move according to the presses of the buttons
        if (cursors.left.isDown) {
            player.body.velocity.x = -500;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 500;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y = -500;
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 500;
        }
        if (cursors.left.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.x = -1000;
        }
        if (cursors.right.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.x = 1000;
        }
        if (cursors.up.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = -1000;
        }
        if (cursors.down.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = 1000;
        }

        // Continuously firing lasers according to this function
        Game.fireLaser();

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if (asteroidBlaster) {
                asteroidBlaster = false;
                Game.blastAsteroid();
            }
        }

        // Check for any collisions between objects and send them to their functions accordingly.
        game.physics.arcade.overlap(lasers, mice, this.killMouse, null, this);
        game.physics.arcade.overlap(lasers, rats, this.hitRat, null, this);
        game.physics.arcade.overlap(lasers, asteroids, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids45, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids90, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids135, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids180, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids225, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids270, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(lasers, asteroids315, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(player, shootingStars, this.shotByStar, null, this);
        game.physics.arcade.overlap(lasers, shootingStars, this.shootStar, null, this);
        game.physics.arcade.overlap(bigLaser, mice, this.bigHitMouse, null, this);
        game.physics.arcade.overlap(bigLaser, rats, this.bigHitRat, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids45, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids90, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids135, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids180, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids225, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids270, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids315, this.bigHitAsteroid, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids, this.bigHitAsteroid, null, this);

        // Keep time moving
        counter += 1;
        starCounter += 1;

        // Generate rats and mice based on the counter
        Game.genMouse();
        Game.genRat();

        // After the second level, generate Asteroid
        // and Shooting Star
        //if(curlevel > 1) {
        Game.genAsteroid();
        Game.genShootingStar();
        //}


        Game.genStars();
        if (counter % 2 == 0) {
            Game.starBright();
        }

        pos = Game.getPositions(player, mice.children, rats.children, lasers.children);
        for (var i = 2; i < pos.length; i++) {
            if (pos[i] > 1190) {
                score -= 3;
            }
        }

        if (!hit) {
            hitCounter = 0;
            player.animations.play('float');
            game.physics.arcade.overlap(player, mice, this.loseLife, null, this);
            game.physics.arcade.overlap(player, rats, this.ratCollide, null, this);
            game.physics.arcade.overlap(player, asteroids, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids45, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids90, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids135, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids180, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids225, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids270, this.asteroidHit, null, this);
            game.physics.arcade.overlap(player, asteroids315, this.asteroidHit, null, this);
        } else {
            hitCounter++;
            if (hitCounter == 5) {
                player.animations.play('float');
            } else if (hitCounter == 10) {
                player.animations.play('hit');
            } else if (hitCounter == 15) {
                player.animations.play('float');
            }
            if (hitCounter == 30) {
                hit = false;
            }
        }

    },





    setCookie: function(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    },


    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return  c.substring(name.length, c.length);
            }
        }
        return "";
    },


    fireLaser: function() {
        if (game.time.time > laserTime) {
            laser = lasers.getFirstExists(false);

            if (laser) {
                laser.reset(player.x - 6, player.y + 10);
                laser.body.velocity.x = -1050;
                laserTime = game.time.time + 250;
            }
        }
    },

    blastAsteroid: function() {
        big = bigLaser.getFirstExists(false);

        if (big) {
            big.reset(player.x - 6, player.y + 10);
            big.body.velocity.x = -1050;
        }
    },

    bigHitMouse: function(big, mouse) {
        mouse.kill();
        shoot.play();
        score += Math.round((1000 - player.x)/100);
    },

    bigHitRat: function(big, rat) {
        rat.kill();
        shoot.play();
        score += Math.round(4 + (1000 - player.x)/100);
    },

    bigHitAsteroid: function(big, asteroid) {
        asteroid.kill();
        shoot.play();
        score += 10;
    },

    killMouse: function(laser, mouse) {
        mouse.kill();
        laser.kill();
        shoot.play();
        score += Math.round((1000 - player.x)/100);
        //  console.log(score);
        //console.log(palyer.x);
    },

    loseLife: function(player, mouse) {
        mouse.kill();
        score -= 5;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    hitRat: function(laser, rat) {
        rat.life -= 1;
        laser.kill();
        if (rat.life <= 0) {
            shoot.play();
            rat.kill();
            score += Math.round(4 + (1000 - player.x)/100);
        }
    },

    ratCollide: function(player, rat) {
        rat.kill();
        score -= 5;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    asteroidHit: function(player, asteroid) {
        asteroid.kill();
        score -= 10;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    shootAsteroid: function(laser) {
        laser.kill();
    },

    shotByStar: function(player, shootingStar) {
        shootingStar.kill();
        score += 2;
        asteroidBlaster = true;
    },

    shootStar: function(laser) {
        laser.kill()
    },

    genMouse: function() {
        //	console.log(micespeed);
        if (counter % micespeed == 0) {
            mouse = mice.getFirstExists(false);

            if (mouse) {
                mouse.reset(-50, Math.min(Math.random()*game.height, game.height - 100), 'mouse');
                mouse.body.velocity.x = 500;
                mouse.animations.add('attack');
                mouse.animations.play('attack', 1.5, true);
            }
        }
    },

    genRat: function() {
        if (counter % 212 == 0) {
            rat = rats.getFirstExists(false);

            if (rat) {
                rat.reset(-100, Math.min(Math.random()*game.height, game.height - 200), 'rat');
                rat.body.velocity.x = 300;
                rat.life = 4;
                rat.immovable = true;
                rat.animations.add('attack');
                rat.animations.play('attack', 1.5, true);
            }
        }
    },

    genAsteroid: function() {
        if (counter % 617 == 0) {
            var dir = Math.random();
            if (dir <= 0.125) {
                asteroid = asteroids.getFirstExists(false);

                if (asteroid) {
                    asteroid.reset(-200, Math.min(Math.random() * game.height, game.height - 200), 'asteroid');
                    asteroid.body.velocity.x = 200;
                    asteroid.immovable = true;
                    asteroid.animations.add('fly');
                    asteroid.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.25) {
                asteroid45 = asteroids45.getFirstExists(false);

                if (asteroid45) {
                    asteroid45.reset(Math.random()*game.width, -100, 'asteroid45');
                    asteroid45.body.velocity.x = 200;
                    asteroid45.body.velocity.y = 100;
                    asteroid45.immovable = true;
                    asteroid45.animations.add('fly');
                    asteroid45.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.375) {
                asteroid90 = asteroids90.getFirstExists(false);

                if (asteroid90) {
                    asteroid90.reset(Math.random()*game.width, -100, 'asteroid90');
                    asteroid90.body.velocity.y = 100;
                    asteroid90.immovable = true;
                    asteroid90.animations.add('fly');
                    asteroid90.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.5) {
                asteroid135 = asteroids135.getFirstExists(false);

                if (asteroid135) {
                    asteroid135.reset(Math.random()*game.width, -100, 'asteroid135');
                    asteroid135.body.velocity.x = -200;
                    asteroid135.body.velocity.y = 100;
                    asteroid135.immovable = true;
                    asteroid135.animations.add('fly');
                    asteroid135.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.625) {
                asteroid180 = asteroids180.getFirstExists(false);

                if (asteroid180) {
                    asteroid180.reset(1200, Math.random()*game.height, 'asteroid180');
                    asteroid180.body.velocity.x = -200;
                    asteroid180.immovable = true;
                    asteroid180.animations.add('fly');
                    asteroid180.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.75) {
                asteroid225 = asteroids225.getFirstExists(false);

                if (asteroid225) {
                    asteroid225.reset(Math.random()*game.width, 600, 'asteroid225');
                    asteroid225.body.velocity.x = -200;
                    asteroid225.body.velocity.y = -100;
                    asteroid225.immovable = true;
                    asteroid225.animations.add('fly');
                    asteroid225.animations.play('fly', 1.5, true);
                }
            } else if (dir <= 0.875) {
                asteroid270 = asteroids270.getFirstExists(false);

                if (asteroid270) {
                    asteroid270.reset(Math.random()*game.width, 600, 'asteroid270');
                    asteroid270.body.velocity.y = -100;
                    asteroid270.immovable = true;
                    asteroid270.animations.add('fly');
                    asteroid270.animations.play('fly', 1.5, true);
                }
            } else {
                asteroid315 = asteroids315.getFirstExists(false);

                if (asteroid315) {
                    asteroid315.reset(Math.random()*game.width, 600, 'asteroid315');
                    asteroid315.body.velocity.x = 200;
                    asteroid315.body.velocity.y = -100;
                    asteroid315.immovable = true;
                    asteroid315.animations.add('fly');
                    asteroid315.animations.play('fly', 1.5, true);
                }
            }
        }
    },

    genShootingStar: function() {
        if (counter % 1007 == 0) {
            shootingStar = shootingStars.getFirstExists(false);

            if (shootingStar) {
                shootingStar.reset(-50, Math.min(Math.random()*game.height, game.height - 100), 'shootingStar');
                shootingStar.body.velocity.x = 1000;
                shootingStar.body.velocity.y = 50;
                shootingStar.immovable = true;
                shootingStar.animations.add('fly');
                shootingStar.animations.play('fly', 2, true);
            }
        }
    },

    getPositions: function(player, mice, rats) {
        var data_array = [];
        data_array.push(player.position.x, player.position.y);
        for (var i = 0; i < mice.length; i++) {
            if (mice[i].alive == true) {
                data_array.push(mice[i].position.x, mice[i].position.y);
            }
        }
        for (i = 0; i < rats.length; i++) {
            if (rats[i].alive == true) {
                data_array.push(rats[i].position.x, rats[i].position.y);
            }
        }
        return data_array;
    },

    starBright: function() {
        if(star1 && star2 && star3 && star4 && star5 && star6 && star7 && star8) {
            if (Math.abs(star8.alpha - 1.0) < 0.01) {
                starInc = false;
            }
            if (starInc) {
                //console.log("starInc: " + star1.alpha);
                star1.alpha += 0.05;
                star2.alpha += 0.05;
                star3.alpha += 0.05;
                star4.alpha += 0.05;
                star5.alpha += 0.05;
                star6.alpha += 0.05;
                star7.alpha += 0.05;
                star8.alpha += 0.05;
            } else {
                //console.log("starDec: " + star1.alpha);
                star1.alpha -= 0.1;
                star2.alpha -= 0.1;
                star3.alpha -= 0.1;
                star4.alpha -= 0.1;
                star5.alpha -= 0.1;
                star6.alpha -= 0.1;
                star7.alpha -= 0.1;
                star8.alpha -= 0.1;
            }
        }
    },

    genStars: function() {
        if (starCounter % 50 == 0) {
            //console.log(starSet % 4);
            if (starSet % 4 == 0) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(62.5, 62.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(312.5, 187.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(562.5, 62.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(812.5, 187.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(187.5, 312.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(437.5, 437.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(687.5, 312.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(937.5, 437.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 1) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(187.5, 187.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(437.5, 62.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(687.5, 187.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(937.5, 62.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(62.5, 437.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(312.5, 312.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(562.5, 437.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(812.5, 312.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 2) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(187.5, 62.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(437.5, 187.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(687.5, 62.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(937.5, 187.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(62.5, 312.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(312.5, 437.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(562.5, 312.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(812.5, 437.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 3) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(62.5, 187.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(312.5, 62.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(562.5, 187.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(812.5, 62.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(187.5, 437.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(437.5, 312.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(687.5, 437.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(937.5, 312.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            }
        } else if (starCounter == 99) {
            starCounter = 0;
            stars.callAll('kill');
        }
    }
};

/**
 * Created by npkapur on 10/19/16.
 */
