var Board = {
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

			game.add.text(335, 50, "Leaderboard", {fontSize: '48px', fill: "#FFF", align: "center"});
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

					scoreboard = xmlhttp.responseText;
					var style = { font: "20px Courier", fill: "#fff", tabs: 264 };
					game.add.text(225, 150, "Rank\tName\tScore", style);
					game.add.text(225, 190, scoreboard, style);
				}
			}

			xmlhttp.open("GET","readboard.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send();


			game.add.text(335, 360, " Press ENTER to Play Again", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(335, 390, "Press SPACE for Main Menu", {fontSize: '24px', fill: "#FFF", align: "center"});
			game.add.text(335, 420, "Press CONTROL to Shop", {fontSize: '24px', fill: "#FFF", align: "center"});

		},

	update: function() {
			if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
				game.state.start('Game');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				game.state.start('Menu');
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				game.state.start('Shop');
			}
		}
};
