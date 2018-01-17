var level = {
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

	create: function () {


			// Stretch to full screen 
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			game.input.onDown.add(this.gofull);
			//
			game.add.tileSprite(0,0, game.width, game.height, 'menu');
			game.add.text(450, 300, "Level Up!", {fontSize: '48px', fill: "#FFF", align: "center"});
			game.add.text(425, 360, "Press ENTER to keep playing", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(425, 400, "Press CONTROL to shop", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(425, 440, "Press SHIFT for LeaderBoard", {fontSize: '24px', fill: "#FFF", align: "center"});

			cat = game.add.sprite(game.world.width / 2 - 140, game.world.height / 2 - 200, 'cat');
			cat.animations.add('float');
			cat.animations.play('float', 1, true);
		},

	update: function() {
			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.start('Game');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				game.state.start('Shop');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
				game.state.start('Board');
			}
		}
};
