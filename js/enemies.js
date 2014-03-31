(function (game) {

	var enemies = {},
		wolfImage = new Image(),
		warlockImage = new Image();

	// enemies images
	wolfImage.src = 'http://localhost/2d-platform-game/img/enemie.png';
	warlockImage.src = 'http://localhost/2d-platform-game/img/warlock.png';

	/**
	 * Class constructor of enemies
	 * @function
	 * @params {image, x, y, width, height, velX}
	 * @example
	 * new Enemies(100, 'wolf', wolfImage, canvasWidth, canvasHeight -80, 50, 50, 0, 0.9, 2, 50);
	 */
	function Enemies (life, name, image, x, y, width, height, velocityX, friction, speed, aggressive) {
		this.life = life;
		this.name = name;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velocityX = velocityX;
		this.friction = friction;
		this.speed = speed;
		this.aggressive = aggressive;
	}

	// Array to add and remove enemies in the game
	var enemiesArray = [];

	// Push enemies into the array
	enemiesArray.push(
				  new Enemies(400, 'wolf', wolfImage, game.canvasWidth, game.canvasHeight -80, 50, 50, 0, 0.9, 2, 50),
				  new Enemies(400, 'wolf', wolfImage, game.canvasWidth, game.canvasHeight -80, 50, 50, 0, 0.9, 4, 50),
				  new Enemies(400, 'wolf', wolfImage, game.canvasWidth + 800, game.canvasHeight -80, 50, 50, 0, 0.9, 3, 50),
				  new Enemies(400, 'wolf', wolfImage, game.canvasWidth + 1400, game.canvasHeight -80, 50, 50, 0, 0.9, 2, 50)
				  );

	/**
	 * Render all the enemies in the game
	 * @function
	 * @example
	 * renderObstacles();
	 */
	function renderEnemies () {
		var wolfImageDifference = canvasHeight - wolfImage.height;

		for (var i = 0; enemiesArray.length > i; i++) {
			// plus this: enemiesArray[i].x + background.x: becouse i need to know all time where the background.x is and plus it to the positio of the enemie.
			contextBackground.drawImage(
				enemiesArray[i].image,
				enemiesArray[i].x + background.x,
				enemiesArray[i].y + background.y,
				enemiesArray[i].width,
				enemiesArray[i].height);
		};

	}

	/**
	 * Add the final enemie to the game.
	 * @function
	 * @example
	 * addFinalEnemie();
	 */
	function addFinalEnemie () {
		enemiesArray.push(
				new Enemies(100, 'warlock', warlockImage, backgroundImage1.width + backgroundImage2.width - warlockImage.width, canvasHeight -275, 245, 258, 0, 0, 0, 150)
				);
	}

	/**
     * Expose component
     */
	game.enemies = enemies;

})(game);