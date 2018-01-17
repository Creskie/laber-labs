var Shop= {
	preload: function() {
			 game.load.image('menu', 'assets/menu.png');
			 game.load.image('star', 'assets/Background_Star2.png');
			 game.load.image('heart', 'assets/Heart1.png');
			 game.load.spritesheet('cat', 'assets/BigCat.png', 260, 210);
			 game.load.image('shootingStar', 'assets/Star1.png');
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
	create: function() {


			// Stretch to full screen 
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.input.onDown.add(this.gofull);

			game.add.tileSprite(0,0, game.width, game.height, 'menu');
			game.add.image(400, 300,  'heart');
			extraLiveText = game.add.text(400, 350, '10 Coins', {fontSize: '20px', fill: '#FFF'});
			game.add.image(600, 300,  'shootingStar');
			extraShootingText = game.add.text(600, 350, '5 Coins', {fontSize: '20px', fill: '#FFF'});
			game.add.text(400, 100, "Press ENTER to Exit Shop", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.image(800, 300,  'shootingStar');
			game.add.text(760, 310, '3 \xD7', {fontSize: '20px', fill: '#FFF'});
			extraShootingText = game.add.text(780, 350, '12 Coins', {fontSize: '20px', fill: '#FFF'});
			
			game.add.text(400, 130, "Press SHIFT for Leaderboard", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(400, 480, "Press A for Extra Live", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(400, 510, "Press B for One Shooting Star", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(400, 540, "Press C for Three Shooting Stars", {fontSize: '24px', fill: "#FFF", align: "center"});

		//	cat = game.add.sprite(game.world.width / 2 - 140, game.world.height / 2 - 250, 'cat');
		//	cat.animations.add('float');
		//	cat.animations.play('float', 1, true);

             // var extraliv = game.add.button(game.world.centerX - 586, game.world.centerY - 182, 'heart', Shop.clickHeart, this);

			coinText = game.add.text(16, 16, 'Lives: 0', {fontSize: '20px', fill: '#FFF'});
			curCounter = 1;
			prevCounter = -100;
		},

      clickHeart: function() {
       lives += 1;
      },



	update: function() {

			curCounter = curCounter + 1;
			coinText.text = "   Lives: " + lives + "   Coins: " + ncoins + "   Stars: " + asteroidBlaster;

			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.start('Game');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
				game.state.start('Board');
			}


			if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				if(ncoins >= 10 && curCounter > prevCounter + 10) {
				 ncoins = ncoins - 10;
				 lives = lives + 1;
				 prevCounter = curCounter;
				}
			}
			
			if (game.input.keyboard.isDown(Phaser.Keyboard.B)) {
				if(ncoins >= 5 && curCounter > prevCounter + 10) {
				 ncoins = ncoins - 5;
				 asteroidBlaster += 1;
				 prevCounter = curCounter;
				}
			}
			
			if (game.input.keyboard.isDown(Phaser.Keyboard.C)) {
				if(ncoins >= 12 && curCounter > prevCounter + 10) {
				 ncoins = ncoins - 12;
				 asteroidBlaster += 3;
				 prevCounter = curCounter;
				}
			}
		}
};
