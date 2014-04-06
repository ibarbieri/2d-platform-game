var canvasPlayer = document.getElementById('player'),
	canvasBackground = document.getElementById('background'),
	canvasExtras = document.getElementById('extras'),
	contextPlayer = canvasPlayer.getContext('2d'),
	contextBackground = canvasBackground.getContext('2d'),
	contextExtras = canvasExtras.getContext('2d'),
	onObstacle,
	playerOnObstacle,
	playerLife = $('#playerLife'),
	playerScore = $('#playerScore'),
	playerHeartsDragon = $('#playerHeartsDragon'),
	controls = document.getElementById('controls'),
	mobileJump,
	mobileLeft,
	mobileRight,
	mobileAttack;



(function (win) {
	// requestAnimationFrame fallback
    var requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
    win.requestAnimationFrame = requestAnimationFrame;

	var canvasWidth = win.innerWidth,
    	canvasHeight = win.innerHeight + 200, // plus 230 to fix the space withe that leaves the rotation diagonal of the canvas
    	playerWidth,
    	playerHeight,
		player = {
			x : canvasWidth / 2,
			y : canvasHeight - 300, // y position of the player: 230 + the heigth of the player
			playerWidth : 86,
			playerHeight : 102,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false,
			life : 5100,
			score : 0,
			heartsDragon : 0,
			attack : false,
			aggressive : 25
		},
		background = {
			x : 0,
			y : 0,
			backgroundWidth : canvasWidth,
			backgroundHeight : canvasHeight,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false
		},
		keys = [],
		friction = 0.9,
		gravity = 0.25;
		// extras = {
		// 	x : 0,
		// 	y : 0,
		// 	backgroundWidth : canvasWidth,
		// 	backgroundHeight : canvasHeight,
		// 	speed: 4,
		// 	velX: 0,
		// 	velY: 0,
		// }

	// Set the canvas dimentions equal to the window dimentions
	canvasPlayer.width = canvasWidth;
	canvasPlayer.height = canvasHeight;

	canvasBackground.width = canvasWidth;
	canvasBackground.height = canvasHeight;

	canvasExtras.width = canvasWidth;
	canvasExtras.height = canvasHeight;

	// Rotate the background canvas
	contextPlayer.rotate(-3.3 * Math.PI / 180);
	contextBackground.rotate(-3.3 * Math.PI / 180);
	contextExtras.rotate(-3.3 * Math.PI / 180);

	// Create images objects to use in the game.
	// ATTENTION, for testing, the images must have the url with ip. Does' t work with localhost
	var backgroundImage1 = new Image(),
		backgroundImage2 = new Image(),

		wolfImage = new Image(),
		warlockImage = new Image(),

		playerImage = new Image(),

		smallRockObstacle = new Image(),
		bigRockObstacle = new Image(),
		waterObstacle = new Image(),

		bigPlantExtra = new Image();


	// backgrounds images
	backgroundImage1.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/background-1.jpg';
	// backgroundImage1.onload = function () {
	// 	// Create a pattern with this image, and set it to "repeat".
	// 	backgroundPattern1 = contextBackground.createPattern(backgroundImage1, 'repeat');
	// }

	backgroundImage2.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/background-1.jpg';

	// enemies images
	wolfImage.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/enemie.png';
	warlockImage.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/warlock.png';

	// player images
	playerImage.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/player.png';

	// obstacles images
	smallRockObstacle.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/small-rock.png';
	bigRockObstacle.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/big-rock.png';

	waterObstacle.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/water.png';

	// extras images
	bigPlantExtra.src = 'http://ibdesigns.com.ar/clients/lesath/game/img/big-plant.png';


	/**
	 * Class constructor of obstacles
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120 -(the height of the image plus 230 of the canvas), 150, 150);
	 */
	function Extras (image, x, y, width, height) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	// Array to add and remove obstacles in the game
	var extrasArray = [];

	// Push obstacles into the array
	extrasArray.push(
				  new Extras(bigPlantExtra, canvasWidth + 300, canvasHeight - 310, 501, 188)
				  //new Extras(waterObstacle, canvasWidth + 50, canvasHeight - 220, 222, 70)
				  );

	/**
	 * Class constructor of obstacles
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120 -(the height of the image plus 230 of the canvas), 150, 150);
	 */
	function Obstacles (name, image, x, y, width, height, differenceY) {
		this.name = name;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.differenceY = differenceY;
	}

	// Array to add and remove obstacles in the game
	var obstaclesArray = [];

	// Push obstacles into the array
	obstaclesArray.push(
				  new Obstacles('rock', smallRockObstacle, canvasWidth + 700, canvasHeight - 280, 159, 125, 50),
				  new Obstacles('rock', bigRockObstacle, canvasWidth + 1100, canvasHeight - 302, 247, 194, 92),
				  new Obstacles('water', waterObstacle, canvasWidth + 1500, canvasHeight - 220, 222, 70, 70)
				  );

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
	function pushEnemies () {
		enemiesArray.push(
					  new Enemies(400, 'wolf', wolfImage, canvasWidth + (-(background.x)), canvasHeight -250, 50, 50, 0, 0.9, 2, 50)
					  );
	}

	// Add random enemies
	var randomTimeEnemies = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

	setInterval(function() {
		pushEnemies();
	}, randomTimeEnemies);


    /**
	 * Move the players and the enemies and update it with requesAnimationFrame.
	 * @returns {renders(), requestAnimationFrame(update)}
	 * @function
	 * @example
	 * update();
	 */
	function update () {
		// up arrow or space
		if (keys[38] || keys[32] || mobileJump) {
			onObstacle = false;
			if (!background.jumping) {
				background.jumping = true;
				background.velY =+ background.speed * 2;
			}
		}

		// left arrow
		if (keys[37] || mobileLeft) {
			if (background.velX < background.speed) {
				// Here i plus the velX becouse the gravity is rotated.
				background.velX++;
			}
		}

		// right arrow
		if (keys[39] || mobileRight) {
			if (background.velX >- background.speed) {
				// Here i less the velX becouse the gravity is rotated.
				background.velX--;
			}
		}

		// reset the player attack to false when the user drop the key a
		player.attack = false;

		// a key
		if (keys[65] || mobileAttack) {
			// run the sprite animation for the attack
			player.attack = true;
		}

		// apply friction to the horizontal movement of the background
		background.velX *= friction;

		// apply gravity to the up movement of the background
		if (onObstacle) {
			background.velY = 0;
		} else {
			background.velY -= gravity;
		}

		// Move the the background
		background.x += background.velX;
		background.y += background.velY;

		// reset the jump property when the background hits the ground
		if (background.y <= canvasHeight - background.backgroundHeight) {
			background.y = canvasHeight - background.backgroundHeight;
			background.jumping = false;
		}

		// the player stop and not go outside of the canvas and add the last enemie
		// plus the with images that i add for the background
		var backgroundPlusImages = background.x + backgroundImage1.width;

		if (background.x > 0) {
			background.x = 0;
		} else if (backgroundPlusImages < -(backgroundImage2.width - canvasWidth)) {
			background.x = -(backgroundImage1.width + backgroundImage2.width - canvasWidth);

			// add the final enemie
			addFinalEnemie();
		}


		// render all the game
		renders();


		var lengthEnemiesArray = enemiesArray.length,
			lengthobstaclesArray = obstaclesArray.length,
			j,
			k,
			h;

		// move the enemies
		for (j = 0; lengthEnemiesArray > j; j += 1) {
			// Check if the velocityX is less that the speed. If this condition is true continuous substracting the velocityX.
			if (enemiesArray[j].velocityX >- enemiesArray[j].speed) {
				enemiesArray[j].velocityX--;
			}

			enemiesArray[j].velocityX *= friction;

			enemiesArray[j].x += enemiesArray[j].velocityX;
		};

		onObstacle = false;

		// check the collision whit the enemies and if the enemie is out the canvas
		for (k = 0; lengthEnemiesArray > k; k += 1) {

			checkCollision(player, enemiesArray[k]);

			// if (lengthEnemiesArray > 5) {
			// 	enemiesIsOutTheCanvas(enemiesArray[k]);
			// }
		}

		// check the collision with the obstacles
		for (h = 0; lengthobstaclesArray > h; h += 1) {
			if (obstaclesArray[h].name == 'rock') {
				checkCollision(player, obstaclesArray[h]);
			}
		}

		// Update player life
		playerLife.html('PLAYER LIFE :' + player.life);

		// Update player score
		playerScore.html('PLAYER SCORE :' + player.score);

		// Update player hearts dragon
		playerHeartsDragon.html('PLAYER HEARTS DRAGON :' + player.heartsDragon);

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);
	}

	/**
	 * Render the player in the middle of the scene game
	 * @function
	 * @example
	 * renderBackground();
	 */
	function renderPlayer () {
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
	 * Render the background in the game
	 * @function
	 * @example
	 * renderBackground();
	 */
	function renderBackground () {
		// Less the canvasHeight to the height of the image to position the y positon of the image in the bottom of the page.
		var backgroundImage1Difference = backgroundImage1.height - canvasHeight;

		contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		contextBackground.drawImage(backgroundImage1, background.x, background.y - backgroundImage1Difference, backgroundImage1.width, backgroundImage1.height);

		// draw the second image when the player arrive to determinada position of x.
		contextBackground.drawImage(backgroundImage2, background.x + backgroundImage1.width, background.y - backgroundImage1Difference, backgroundImage2.width, backgroundImage2.height);
	}

	/**
	 * Render all the enemies in the game
	 * @function
	 * @example
	 * renderObstacles();
	 */
	function renderEnemies () {

		var wolfImageDifference = canvasHeight - wolfImage.height,
		lengthEnemiesArray = enemiesArray.length,
		i;

		for (i = 0; lengthEnemiesArray > i; i += 1) {
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
	 * Render all the obstacles in the game
	 * @function
	 * @example
	 * renderObstacles();
	 */
	function renderObstacles () {

		var lengthObstaclesArray = obstaclesArray.length,
		n;

		for (n = 0; lengthObstaclesArray > n; n += 1) {
			contextBackground.drawImage(
					obstaclesArray[n].image,
					obstaclesArray[n].x + background.x,
					obstaclesArray[n].y + background.y,
					obstaclesArray[n].width,
					obstaclesArray[n].height);
		}
	}

	/**
	 * Render all the extras in the game
	 * @function
	 * @example
	 * renderExtras();
	 */
	function renderExtras () {
		var lengthExtrasArray = extrasArray.length,
		l;

		// Clean the context para que no se vayan agregando una imagen arriba de la otra
		contextExtras.clearRect(0, 0, canvasWidth, canvasHeight);

		for (l = 0; lengthExtrasArray > l; l += 1) {
			//console.log('extrasArray[l].x', extrasArray[l].x , 'background.x', background.x, 'position of extra', extrasArray[l].x + background.x);
			contextExtras.drawImage(
					extrasArray[l].image,
					extrasArray[l].x + background.x,
					extrasArray[l].y + background.y,
					extrasArray[l].width,
					extrasArray[l].height);
		}
	}

	/**
	 * Add the final enemie to the game.
	 * @function
	 * @example
	 * addFinalEnemie();
	 */
	function addFinalEnemie () {
		enemiesArray.push(
				new Enemies(100, 'warlock', warlockImage, backgroundImage1.width + backgroundImage2.width - warlockImage.width, canvasHeight -508, 245, 258, 0, 0, 0, 150)
				);
	}

	/**
	 * Check the right/left top/button collisions between the player and enemies or obstacles.
	 * @param {object} player, {object} enemie or obstacle array position. Later i get the position of the array with indexOF
	 * @returns {collisionDirection}
	 * @function
	 * @example
	 * checkCollision(player, enemiesArray[k]);
	 */
	function checkCollision(player, enemieOrObstacle) {
		// get the vectors to check against
		// Here less the background.x to the player.x becouse the player.x is allways the same. The player isn't animated. The background is animated.
		var distanceToCollisionX = (player.x - background.x + (player.playerWidth / 2)) - (enemieOrObstacle.x + (enemieOrObstacle.width / 2)),
			distanceToCollisionY = (player.y - background.y + (player.playerHeight / 2)) - (enemieOrObstacle.y + (enemieOrObstacle.height / 2)),

			// add the half widths and half heights of the objects
			halfWidths = (player.playerWidth / 2) + (enemieOrObstacle.width / 2),
			halfHeights = (player.playerHeight / 2) + (enemieOrObstacle.height / 2),
			collisionDirection = null;

		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(distanceToCollisionX) < halfWidths && Math.abs(distanceToCollisionY) < halfHeights) {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = halfWidths - Math.abs(distanceToCollisionX),
				oY = halfHeights - Math.abs(distanceToCollisionY);

			if (oX >= oY) {
				if (onObstacle == false) {
					if (distanceToCollisionY > 0) {
						collisionDirection = "BUTTON";
					} else {
						// Block de background
						collisionDirection = "TOP";

						// if the collision come from wolf
						if (enemieOrObstacle.name == 'wolf') {

							background.y = enemieOrObstacle.height;

						// when te collision is with obstacle
						} else if (enemieOrObstacle.name == 'rock') {

							background.y = enemieOrObstacle.height - enemieOrObstacle.differenceY;
							onObstacle = true;
						}
												// } else if (enemieOrObstacle.name == 'water') {
						// 	//console.log('estoy sobre water');
						// 	background.velX -= 0.5;
						// 	onObstacle = true;
						// }
					}
				}

			} else {
				if (distanceToCollisionX > 0) {
					// Block de background
					collisionDirection = "LEFT";
					background.velX = 0;
					background.velX--;

					// if the collision come from wolf
					if (enemieOrObstacle.name == 'wolf') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							// cuando el jugador esta atacando tengo que hace que no le saque vida al jugador
							enemieOrObstacle.life -= player.aggressive;
						} else {
							//remove player life
							player.life -= enemieOrObstacle.aggressive;
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

					} else if (enemieOrObstacle.name == 'warlock') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;

						} else {
							//remove player life
							player.life -= enemieOrObstacle.aggressive;
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

					}
					// else if (enemieOrObstacle.name == 'water') {
 				// 		console.log('left');
 				// 		onObstacle = true;
					// }


				} else {
					// Block de background
					collisionDirection = "RIGHT";
					background.velX = 0;
					background.velX++;

					// If the collision come from enemie remove player life
					if (enemieOrObstacle.name == 'wolf') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;

						} else {
							//remove player life
							player.life -= enemieOrObstacle.aggressive;
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

					} else if (enemieOrObstacle.name == 'warlock') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;
						} else {
							//remove player life
							player.life -= enemieOrObstacle.aggressive;
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

 					}
 				// 	else if (enemieOrObstacle.name == 'water') {
 				// 		background.velX -= 0.5;
 				// 		onObstacle = true;
					// }

				}
			}
		}

		return collisionDirection;
	}


	/**
	 * Check the right/left top/button collisions between the player and enemies or obstacles.
	 * @param {object} player, {object} enemie array
	 * @returns {collisionDirection}
	 * @function
	 * @example
	 * checkCollision(player, enemies);
	 */
	function entityIsAlive (player, enemies) {

		var enemiesArrayPosition = enemiesArray.indexOf(enemies);

		if (player.life < 0) {

			console.log('GAME OVER');

			// Display inline or block to an element in the html that is diplay none and z-index -100 whit the menu desing and buttons.
			// Player a la position 0.
			// Enemies and obstacles reset the array.
			// Life player set to 100%.

		} else if (enemies.life < 0) {
			//get the position of the enemie died;
			var enemiesArrayPosition = enemiesArray.indexOf(enemies);
			//remove the enemie died;
			enemiesArray.splice(enemiesArrayPosition, 1);

			// The player get 100 points becouse kill one enemie
			playerUpdateScore(100);
		}
	}

	function playerUpdateScore (scoreGet) {
		player.score += scoreGet;
	}

	function enemiesIsOutTheCanvas (enemies) {
		var positionXOfEnemie = enemiesArray[enemiesArray.indexOf(enemies)].x;
		if (positionXOfEnemie < 100) {
			//no me deja eliminarlo porque todavía esta chequeando si tiene colition
			//enemiesArray.splice(enemiesArray[enemiesArray.indexOf(enemies)], 1);
			console.log(enemiesArray.indexOf(enemies));
			enemiesArray.splice(enemiesArray.indexOf(enemies), 1);
		}
	}


	/* Sprite animation */
	var playerSprite = new Image();

		playerSprite.src = 'http://localhost/2d-platform-game/img/player-animation.png';




	/**
	 * Render all the game's component.
	 * @returns {renderPlayer(), renderBackground(), renderEnemies(), renderObstacles()}
	 * @function
	 * @example
	 * renders();
	 */
	function renders () {
		// Call the function tha render the player
		renderPlayer();

		// Call the function tha render the background image
		renderBackground();

		// Call the function tha render the enemies. I have to call this function random or when y want to a enemie appear.
		renderEnemies();

		// Call the function tha render the obstacles. I have to call this function random or when y want to a obstacle appear.
		renderObstacles();

		// Call the function tha render the extras.
		renderExtras();
	}


	// Run the function renderExtras() each 9 seconds
	// setInterval(function() {
	// 	// Clean the context para que no se vayan agregando una imagen arriba de la otra
	// 	contextExtras.clearRect(0, 0, canvasWidth, canvasHeight);

	// 	// Call the function tha render the extras.
	// 	renderExtras();
	// }, 9000);


	// ATENCION: VER SI SETEANDO ALGUN FLAGA ACA PUEDO ARREGLAR LO DE DEJAR DE SALTAR OBSTACLES
	// listen when a key is pressed
	document.body.addEventListener("keydown", function (event) {
		keys[event.keyCode] = true;
	});

	// listen when a key is dropped
	document.body.addEventListener("keyup", function (event) {
		keys[event.keyCode] = false;
	});

	// listen when a mobile button is pressed
	controls.addEventListener("touchstart", function (event) {
		switch (event.target.className) {
            case 'top-arrow':
          		mobileJump = true;
            break;

            case 'left-arrow':
            	mobileLeft = true;
            break;

            case 'right-arrow':
            	mobileRight = true;
            break;

            case 'attack-key':
            	mobileAttack = true;
            break;
        }
	});

	// listen when a mobile button is pressed
	controls.addEventListener("touchend", function (event) {
		switch (event.target.className) {
            case 'top-arrow':
          		mobileJump = false;
            break;

            case 'left-arrow':
            	mobileLeft = false;
            break;

            case 'right-arrow':
            	mobileRight = false;
            break;

            case 'attack-key':
            	mobileAttack = false;
            break;
        }
	});

	//Call de update function when the page load.
	win.addEventListener("load", function(){
		update();
	});

})(this);