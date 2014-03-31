(function (game, $) {

	var player = {
		playerWidth : playerWidth,
		playerHeight : playerHeight,
		x : game.canvasWidth / 2,
		y : game.canvasHeight - 140, // y position of the player
		playerWidth : 86,
		playerHeight : 102,
		speed : 4,
		velX : 0,
		velY : 0,
		jumping : false,
		life : 5100,
		attack : false,
		aggressive : 25,
		playerImage : new Image(),
		// player images
		playerImageSrc : 'http://localhost/2d-platform-game/img/player.png'
	}



	/**
	 * Render the player in the middle of the scene game
	 * @function
	 * @example
	 * renderBackground();
	 */
	player.render = function () {
		//contextPlayer.drawImage(imageSrc, x, y, width, height);
		contextPlayer.drawImage(
			playerImage,
			player.x,
			player.y,
			player.playerWidth,
			player.playerHeight
			);
	}

	/**
     * Expose component
     */
	game.player = player;

})(game, $);