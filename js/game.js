(function (win) {
	// Define the context
    var game = {},
	    canvasPlayer = document.getElementById('player'),
		canvasBackground = document.getElementById('background'),
		contextPlayer = canvasPlayer.getContext('2d'),
		contextBackground = canvasBackground.getContext('2d'),
		onObstacle,
		playerLife = $('#playerLife'),
		controls = document.getElementById('controls'),
		mobileJump,
		mobileLeft,
		mobileRight,
		mobileAttack,
		canvasWidth = win.innerWidth,
    	canvasHeight = win.innerHeight,
		keys = [],
		friction = 0.9,
		gravity = 0.25,
		requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
    	win.requestAnimationFrame = requestAnimationFrame;

	// Set the canvas dimentions equal to the window dimentions
	canvasPlayer.width = canvasWidth;
	canvasPlayer.height = canvasHeight;

	canvasBackground.width = canvasWidth;
	canvasBackground.height = canvasHeight;

    /**
	 * Move the players and the enemies and update it with requesAnimationFrame.
	 * @returns {renders(), requestAnimationFrame(update)}
	 * @function
	 * @example
	 * update();
	 */
	function update () {
		// reset the player attack to false when the user drop the key a
		player.attack = false;

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
		var backgroundPlusImages = background.x + game.background.backgroundImage1.width;

		if (background.x > 0) {
			background.x = 0;
		} else if (backgroundPlusImages < -(game.background.backgroundImage2.width - canvasWidth)) {
			background.x = -(backgroundImage1.width + backgroundImage2.width - canvasWidth);

			// add the final enemie
			addFinalEnemie();
		}

		// render all the game
		renders();

		// move the enemies
		for (var j = 0; enemiesArray.length > j; j++) {
			// Check if the velocityX is less that the speed. If this condition is true continuous substracting the velocityX.
			if (enemiesArray[j].velocityX >- enemiesArray[j].speed) {
				enemiesArray[j].velocityX--;
			}

			enemiesArray[j].velocityX *= friction;

			enemiesArray[j].x += enemiesArray[j].velocityX;
		};

		// reset the flug to false before the check coollision
		onObstacle = false;

		// check the collision whit the enemies
		for (var k = 0; enemiesArray.length > k; k++) {
			checkCollision(player, enemiesArray[k]);
		}

		// check the collision with the obstacles
		for (var h = 0; obstaclesArray.length > h; h++) {
			checkCollision(player, obstaclesArray[h]);
		}

		// Update player's life
		playerLife.html(player.life);

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);
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
						collisionDirection = "button";
					} else {
						// Block de background
						collisionDirection = "top";

						background.y = enemieOrObstacle.height;
						onObstacle = true;

					}
				}

			} else {
				if (distanceToCollisionX > 0) {
					// Block de background
					collisionDirection = "left";
					background.velX = 0;
					background.velX--;

					// if the collision come from enemie
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
					};

				} else {
					// Block de background
					collisionDirection = "right";
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
					};

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
		}
	}


	/* Sprite animation */
	var playerSprite = new Image();

		playerSprite.src = 'http://localhost/2d-platform-game/img/enemie.png';




	/**
	 * Render all the game's component.
	 * @returns {renderPlayer(), renderBackground(), renderEnemies(), renderObstacles()}
	 * @function
	 * @example
	 * renders();
	 */
	function renders () {
		// Call the function tha render the player
		game.player.render();

		// Call the function tha render the background image
		renderBackground();

		// Call the function tha render the enemies. I have to call this function random or when y want to a enemie appear.
		renderEnemies();

		// Call the function tha render the obstacles. I have to call this function random or when y want to a obstacle appear.
		renderObstacles();
	}

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


    win.game = game;

}(window));