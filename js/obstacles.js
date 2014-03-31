(function (game) {

	var obstacles = {},
		rockObstacle = new Image();

	// obstacles images
	rockObstacle.src = 'http://localhost/2d-platform-game/img/rock.png';

	/**
	 * Class constructor of obstacles
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120, 150, 150);
	 */
	function Obstacles (image, x, y, width, height) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	// Array to add and remove obstacles in the game
	var obstaclesArray = [];

	// Push obstacles into the array
	obstaclesArray.push(
				  new Obstacles(rockObstacle, game.canvasWidth, game.canvasHeight -146, 247, 110)
				  );

	/**
	 * Render all the obstacles in the game
	 * @function
	 * @example
	 * renderObstacles();
	 */
	function renderObstacles () {
		for (var n = 0; obstaclesArray.length > n; n++) {
			contextBackground.drawImage(
					obstaclesArray[n].image,
					obstaclesArray[n].x + background.x,
					obstaclesArray[n].y + background.y,
					obstaclesArray[n].width,
					obstaclesArray[n].height);
		}
	}

	/**
     * Expose component
     */
	game.obstacles = obstacles;

})(game);