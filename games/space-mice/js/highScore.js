var HighScore = {
	preload: function() {
			 game.load.image('menu', 'assets/menu.png');
			 game.load.image('star', 'assets/Background_Star2.png');
			 game.load.spritesheet('cat', 'assets/BigCat.png', 260, 210);
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
			game.add.text(380, 300, "NEW HIGH SCORE", {fontSize: '48px', fill: "#FFF", align: "center"});
			game.add.text(435, 360, " Press ENTER to Play Again", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(435, 390, "Press SPACE for Main Menu", {fontSize: '24px', fill: "#FFF", align: "center"});

			game.add.text(435, 420, "Press SHIFT for Leaderboard", {fontSize: '24px', fill: "#FFF", align: "center"});

			cat = game.add.sprite(game.world.width / 2 - 140, game.world.height / 2 - 200, 'cat');
			cat.animations.add('float');
			cat.animations.play('float', 1, true);


			// Reset the score and lives
			score = 0;
			prevscore = 0;
			lives = 9;
			ncoins = 0;
			asteroidBlaster = 0;
			curlevel = 1;
		},

	update: function() {
			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.start('Game');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
				game.state.start('Board');
			}



			if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				game.state.start('Menu');
			}
		}
};
