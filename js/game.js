(function (win) {

	/* requestAnimationFrame fallback
	---------------------------------------------------------------*/
    var requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
    win.requestAnimationFrame = requestAnimationFrame;

    var cancelAnimationFrame = win.cancelAnimationFrame || win.mozCancelAnimationFrame;


    /* full screen function
	---------------------------------------------------------------*/
    var element = document.documentElement;

    function fullScreen (element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();

		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();

		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();

		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		}
	}


    /* devices adaptations
	---------------------------------------------------------------*/
	var userAgent = window.navigator.userAgent,
		canvasWidth,
    	canvasHeight;

	if (userAgent.indexOf('iPad') > -1) {

		$('#extras').css('top', 90);
		$('#player').css('top', 90);
		$('#background').css('top', 90);

		$('#playerOptions').css('width', 800).css('top', 80);
		$('#panelGame').css('width', 800).css('top', 500);
		$('#controls').css('display', 'block').css('bottom', 200).css('width', 800);

		// $('.walk-controls').css('margin-left', 20);
		// $('.jump-attack-controls').css('right', 30);

		$('#adarhaLife').css('width', 270).css('margin-left', 30);
		$('#adarhaPotion').css('margin-right', 10);
		$('#adarhaHeartsDragon').css('margin-right', 10);

		canvasWidth = 800;
		canvasHeight = 410;

	} else if (userAgent.indexOf('Android') > -1) {

		//$('#panelStartMobile').toggleClass('display-none');

		// $('#starGameMobile').on('click', function () {
		// 	//fullScreen(element);
		// 	$('#panelStartMobile').toggleClass('display-none');
		// });

		// Start panel
		$('#panelStarGrame').css('display', 'none');




		$('#extras').css('top', 0);
		$('#player').css('top', 0);
		$('#background').css('top', 0);
		$('#panelGame').css('display', 'none');
		$('#playerOptions').css('width', win.outerWidth);
		$('#controls').css('width', win.innerWidth -20).css('display', 'block').css('padding-left', 15).css('padding-right', 5).css('padding-bottom', 0);
		$('.jump-attack-controls').css('right', 10).css('float', 'none');

		$('#adarhaLife').css('background-size', '180px', '100px').css('margin-top', 10);
		$('#adarhaPotion').css('background-size', '110px', '100px').css('top', 8).css('width', 115);
		$('#adarhaHeartsDragon').css('background-size', '75px', '90px').css('top', 50).css('width', 84);

		canvasWidth = win.outerWidth;
    	canvasHeight = win.screen.height;


	} else if (userAgent.indexOf('iPhone') > -1) {

		$('#panelStartMobile').toggleClass('display-none');

		$('#starGameMobile').on('click', function () {
			fullScreen(element);
			$('#panelStartMobile').toggleClass('display-none');
		});

		$('#extras').css('top', 0);
		$('#player').css('top', 0);
		$('#background').css('top', 0);
		$('#panelGame').css('display', 'none');
		$('#playerOptions').css('width', win.innerWidth);

		$('#controls').css('width', win.innerWidth).css('display', 'block').css('padding-left', 15).css('padding-right', 5).css('padding-bottom', 0);
		$('.down-arrow').css('background-size', 40);
		$('.right-arrow').css('background-size', 40);
		$('.left-arrow').css('background-size', 40);
		$('.top-arrow').css('background-size', 40);

		$('.jump-attack-controls').css('float', 'none');
		$('.attack-key').css('background-size', 40);


		$('#adarhaLife').css('background-size', '130px', '100px').css('margin-top', 10);
		$('#adarhaPotion').css('background-size', '80px', '100px').css('top', 8).css('width', 85);
		$('#adarhaHeartsDragon').css('background-size', '50px', '90px').css('top', 35).css('width', 56);

		canvasWidth = win.innerWidth;
    	//canvasHeight = win.screen.height;
    	canvasHeight = 320;//win.innerHeight + 100;


	} else {
		// Desktop
		canvasWidth = 950;
		canvasHeight = 755;
	}


    /* canvas dimentions and declarations
	---------------------------------------------------------------*/
    var canvasBackground = document.getElementById('background'),
    	contextBackground = canvasBackground.getContext('2d'),

    	canvasPlayer = document.getElementById('player'),
    	contextPlayer = canvasPlayer.getContext('2d'),

    	canvasExtras = document.getElementById('extras'),
    	contextExtras = canvasExtras.getContext('2d');

    	canvasExtrasStatic = document.getElementById('extrasStatic'),
    	contextExtrasStatic = canvasExtrasStatic.getContext('2d');

    	canvasBackground.width = canvasWidth;
		canvasBackground.height = canvasHeight;

		canvasPlayer.width = canvasWidth;
		canvasPlayer.height = canvasHeight;

		canvasExtras.width = canvasWidth;
		canvasExtras.height = canvasHeight;

		canvasExtrasStatic.width = canvasWidth;
		canvasExtrasStatic.height = canvasHeight;


	/* game objects declaration; Player, Background, Extras
	---------------------------------------------------------------*/
    var playerWidth,
    	playerHeight,
		player = {
			x : (canvasWidth / 2) - 135, // Less the middel of the width of the image player
			y : canvasHeight - 240, // Less the height of the image player
			playerWidth : 90,
			playerHeight : 185,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false,
			life : 4500,
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
			friction: 0.75,
			jumping : false
		},
		extras = {
			x : 0,
			y : 0,
			extrasWidth : canvasWidth,
			extrasHeight : canvasHeight,
			speed: 6,
			velX: 0,
			velY: 0,
			friction: 0.82,
			jumping : false
		},
		keys = [],
		gravity = 0.20;


	/* game elements, extras and flags
	---------------------------------------------------------------*/
	var onObstacle,
		playerOnObstacle,
		adarhaLife = $('#adarhaLife'),
		adarhaScore = $('#adarhaScore'),
		adarhaHeartsDragon = $('#adarhaHeartsDragon'),
		controls = document.getElementById('controls'),
		mobileJump,
		mobileCrouch,
		mobileLeft,
		mobileRight,
		mobileAttack,
		walkingLeft = false,
		walkingRight = false,
		crouch = false,
		jump = false,
		attacking = false,
		extrasPlusImages,
		warlockShooting = false,
		warlockShootingAnimation = false,
		panelGameOver = $('#panelGameOver'),
		playAgain = $('#playAgain');


	/* images
	---------------------------------------------------------------*/
	var backgroundImage1 = new Image(),
		backgroundImagePatter = new Image(),
		backgroundImagePatterIpad = new Image(),
		backgroundImageAndroid = new Image(),
		playerSpriteRight = new Image(),
		playerSpriteLeft = new Image(),
		extrasCave = new Image(),
		wolfImage = new Image(),
		rockObstacle = new Image(),
		warlock = new Image(),
		shoot1 = new Image();

		backgroundImage1.src = 'img/background-1.jpg';
		backgroundImagePatter.src = 'img/background-pattern.jpg';
		backgroundImagePatterIpad.src = 'img/background-pattern-ipad.jpg';
		backgroundImageAndroid.src = 'img/background-android.jpg';
		extrasCave.src = 'img/extrasCave.png';
		wolfImage.src = 'img/wolf-animation.png';
		rockObstacle.src = 'img/small-rock.png';
		warlock.src = 'img/warlock.png';
		shoot1.src = 'img/shoot-1.png';


		if (playerSelected == 'adhara') {

			playerSpriteRight.src = 'img/player-actions-right-adhara.png';
			playerSpriteLeft.src = 'img/player-actions-left-adhara.png';

		} else if (playerSelected == 'aidem') {

			playerSpriteRight.src = 'img/player-actions-right-aidem.png';
			playerSpriteLeft.src = 'img/player-actions-left-aidem.png';

		}



	/* cache content in new canvas, double buffer
	---------------------------------------------------------------*/
	var secondaryCanvas = document.createElement('canvas');

		secondaryCanvas.setAttribute('id', 'secondaryCanvas');

		secondaryCanvas.width = canvasWidth;
    	secondaryCanvas.height = canvasHeight;

    var	secondaryCtx = secondaryCanvas.getContext("2d");


	/* canvas rotation
	---------------------------------------------------------------*/
	contextPlayer.rotate(-5.3 * Math.PI / 180);
	contextBackground.rotate(-5.3 * Math.PI / 180);
	contextExtras.rotate(-5.3 * Math.PI / 180);


	/* update function
	---------------------------------------------------------------*/
	function update () {

		if (userAgent.indexOf('iPad') > -1) {
			// do nothing
		} else if (userAgent.indexOf('Android') > -1) {
			// do nothing
		} else {
			// secondaryCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			// double buffering
			secondaryCtx.drawImage(backgroundImagePatter, background.x, background.y, backgroundImagePatter.width, backgroundImagePatter.height);
	 	}

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);

		// up arrow or space
		if (keys[38] || keys[32] || mobileJump) {

			onObstacle = false;

			if (!background.jumping) {
				background.jumping = true;

				setFramesSpriteAnimation('jumpingRight', 0, 9, 55);

				if (frame == 6) {

					background.velY =+ (background.speed * 2);

				}
				// This run when the character touch the land.
				// if (background.velY <= 0) {
				//   	//frame = 0;
				// }
			}
		}

		// down arrow
		if (keys[40] || mobileCrouch) {
			// Function OK when the player only walk from right
			setFramesSpriteAnimation('crouchRight', 0, 9, 100);

			if (frame == 4) {
				// Only show the 6 frame becouse my animation start in 6 and have 1 frame of lenght
				setFramesSpriteAnimation('crouchRight', 4, 1, 100);
			}
		}

		// If down arrow is drop
		// if (keys[40] == false) {

		// 	if (frame >= 4) {

		// 		setFramesSpriteAnimation('crouch', 5, 9, 100);

		// 		if (frame == 8) {
		// 			//setFramesSpriteAnimation('crouch', 8, 1, 100);
		// 			setFramesSpriteAnimation('walkingRight', 0, 9, 100);
		// 		}
		// 	}
		// }

		// left arrow
		if (keys[37] || mobileLeft) {
			if (background.velX < background.speed  ||  extras.velX < extras.speed) {

				background.velX++;

				extras.velX++;

				walkingLeft = true;

				setFramesSpriteAnimation('walkingLeft', 0, 9, 100);
			}
		}

		// right arrow
		if (keys[39] || mobileRight) {
			if (background.velX >- background.speed && extras.velX >- extras.speed) {

				background.velX--;

				extras.velX--;

				walkingRight = true;

				setFramesSpriteAnimation('walkingRight', 0, 9, 100);
			}

			// if (!walkingRight) {

			// 	background.x = -3;
			// 	walkingRight = true;
			// }

			// setFramesSpriteAnimation('walkingRight', 0, 9, 100);

		}

		// If the player is on the start position
		if (walkingLeft == false && walkingRight == false) {
			if (crouch == false) {
				setFramesSpriteAnimation('walkingStopRight', 0, 9, 100);
			}
		}

		// If left arrow is drop
		if (keys[37] == false) {
			if (!walkingRight) {
				setFramesSpriteAnimation('walkingStopLeft', 0, 9, 100);
			}
		}

		// If right arrow is drop
		if (keys[39] == false) {

			if (!walkingLeft) {
				setFramesSpriteAnimation('walkingStopRight', 0, 9, 100);
			}
		}

		// a key
		if (keys[65] || mobileAttack) {
			player.attack = true;

			setFramesSpriteAnimation('attackRight', 0, 9, 100);
			attacking = true;
		}

		// reset the player attack to false when the user drop the key a or the mobile button attack
		if (keys[65] == false || mobileAttack == false) {
			player.attack = false;
		}


		// apply friction to the horizontal movement of the background
		background.velX *= background.friction;

		extras.velX *= extras.friction;


		// apply gravity to the up movement of the background
		if (onObstacle) {
			background.velY = 0;
		} else {
			background.velY -= gravity;
		}

		// Move the background
		background.x += background.velX;
		background.y += background.velY;

		// Move the the extras
		extras.x += extras.velX;

		// reset the jump property when the background hits the ground
		if (background.y <= canvasHeight - background.backgroundHeight) {
			background.y = canvasHeight - background.backgroundHeight;
			background.jumping = false;
		}


		// the player stop and not go outside of the canvas and add the last enemie
		if (background.x > 0) {

			background.x = 0;
			extras.x = 0;

		} else if (-(background.x) > 850 && -(background.x) >= backgroundImage1.width - canvasWidth - 900) {

			// Draw the front of the rock
			//contextExtrasStatic.clearRect((canvasWidth / 2), 0, (canvasWidth / 2), canvasHeight);
			//contextExtrasStatic.drawImage(extrasCave, background.x + backgroundImage1.width - 130, background.y + 100, extrasCave.width, extrasCave.height);

			// stop enemies and rocks
			//enemiesArray.length = 0;
			warlockShooting = true;
			obstaclesArray.length = 0;

			// add the final enemie
			addFinalEnemie();

			// check de collitions with the final enemie
			checkCollision(player, finalEnemieArray[0]);

			if ( -(background.x) >= backgroundImage1.width - canvasWidth + 100) {
				// Stop the player
				background.x = -(backgroundImage1.width - canvasWidth + 100);
				extras.velX = 0;
			}
		}


		onObstacle = false;


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

			enemiesArray[j].velocityX *= background.friction;

			enemiesArray[j].x += enemiesArray[j].velocityX;
		};

		//check the collision whit the enemies and if the enemie is out the canvas
		for (k = 0; lengthEnemiesArray > k; k += 1) {

			checkCollision(player, enemiesArray[k]);

			if (lengthEnemiesArray > 5) {
				//enemiesIsOutTheCanvas(enemiesArray[k]);
			}
		}

		// move the obstacles
		for (j = 0; lengthobstaclesArray > j; j += 1) {
			// Check if the velocityX is less that the speed. If this condition is true continuous substracting the velocityX.
			if (obstaclesArray[j].velocityX >- obstaclesArray[j].speed) {
				obstaclesArray[j].velocityX--;
			}

			obstaclesArray[j].velocityX *= background.friction;

			obstaclesArray[j].x += obstaclesArray[j].velocityX;
		};

		//check the collision with the obstacles
		for (h = 0; lengthobstaclesArray > h; h += 1) {
			if (obstaclesArray[h].name == 'rock') {
				checkCollision(player, obstaclesArray[h]);
			}
		}


		// render all the game
		renders();
	}


	/* renders
	---------------------------------------------------------------*/
	function renders () {
		renderBackground();

		renderEnemies();

		renderObstacles();
	}


	/* player
	---------------------------------------------------------------*/
	var frame = 0,
		delta,
		lastUpdateTime = 0,
		updateDelta = 0,
		msPerFrame = 100;

	/**
	 * Set the frames amount and speed.
	 * @param {String} walkingRight,
	 * @function
	 * @example
	 * setFramesSpriteAnimation('walkingRight', 9, 0, 100);
	 */
	function setFramesSpriteAnimation (walkingDirection, frameStartPosition, frameCuantity, msPerFrame) {
		delta = Date.now() - lastUpdateTime;

		if (updateDelta > msPerFrame) {
			updateDelta = 0;

			drawSpriteAnimation(walkingDirection);

			frame += 1;

			if (frame >= frameCuantity) {
				frame = frameStartPosition;
			}

		} else {
			updateDelta += delta;
		}

		lastUpdateTime = Date.now();

	}

	/**
	 * Draw the sprite animation depending on the direction of the arrow down
	 * @param {String} walkingRight,
	 * @function
	 * @example
	 * drawSpriteAnimation('walkingRight');
	 */
	function drawSpriteAnimation (walkingDirection) {
		contextPlayer.clearRect(0, 0, canvasWidth, canvasHeight);

		switch (walkingDirection) {
            case 'walkingRight':
            	// En -135 estoy restando: los 90 del ancho del personaje + 45 de la mitad del ancho del personaje para que quede perfectamente en la mitad.
          		contextPlayer.drawImage(playerSpriteRight, frame * 149, 0, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'walkingStopRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 148, 190, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'crouchRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 149, 380, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'jumpingRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 149, 570, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 226, 140, 240);
            break;

            case 'attackRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 151, 778, 151, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'walkingLeft':
          		contextPlayer.drawImage(playerSpriteLeft, frame * 149, 0, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'walkingStopLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 148, 190, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'crouchLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 149, 380, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;

            case 'jumpingLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 149, 570, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 226, 140, 240);
            break;

            case 'attackLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 151, 778, 149, 202, (canvasWidth / 2) - 135, canvasHeight - 210, 140, 240);
            break;
        }
	}



	/* obstacles
	---------------------------------------------------------------*/
	/**
	 * Class constructor of obstacles
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120 -(the height of the image plus 230 of the canvas), 150, 150);
	 */
	function Obstacles (life, name, image, x, y, width, height, frameCuantity, velocityX, friction, speed, aggressive) {
		this.life = life;
		this.name = name;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.frameCuantity = frameCuantity;
		this.velocityX = velocityX;
		this.friction = friction;
		this.speed = speed;
		this.aggressive = aggressive;
	}

	//Array to add and remove obstacles in the game
	var obstaclesArray = [];

	// Push obstacles into the array
	function pushObstacle () {
		obstaclesArray.push(
			new Obstacles(400, 'rock', rockObstacle, canvasWidth + (-(background.x)), canvasHeight - 110, 163, 98, 9, 0, 0.9, 3, 50)
			// new Obstacles('rock', bigRockObstacle, canvasWidth + 1100, canvasHeight - 302, 247, 194, 92),
			// new Obstacles('water', waterObstacle, canvasWidth + 1500, canvasHeight - 220, 222, 70, 70)
		);
	}

	//Add random obstacles
	var randomTimeObstacles = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

	setInterval(function() {
		pushObstacle();
	}, randomTimeObstacles);


	function renderObstacles () {
		var o;

		for (o = 0; obstaclesArray.length > o; o += 1) {
			setFramesSpriteAnimationEnemies(contextBackground, rockObstacle, 0, 155, 148, 0, obstaclesArray[o].frameCuantity, obstaclesArray[o].x + background.x, obstaclesArray[o].y + background.y);
		};
	}



	/* enemies
	---------------------------------------------------------------*/
	/**
	 * Class constructor of enemies
	 * @function
	 * @params {image, x, y, width, height, velX}
	 * @example
	 * new Enemies(100, 'wolf', wolfImage, canvasWidth, canvasHeight -80, 50, 50, 0, 0.9, 2, 50);
	 */
	function Enemies (life, name, image, x, y, width, height, frameCuantity, velocityX, friction, speed, aggressive) {
		this.life = life;
		this.name = name;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.frameCuantity = frameCuantity;
		this.velocityX = velocityX;
		this.friction = friction;
		this.speed = speed;
		this.aggressive = aggressive;
	}

	//Array to add and remove enemies in the game
	var enemiesArray = [],
		finalEnemieArray = [];

	finalEnemieArray.push(new Enemies(1000, 'Warlok', wolfImage, (background.x + backgroundImage1.width - 450), canvasHeight - 110, 163, 98, 9, 0, 0.9, 100, 100));

	// Push enemies into the array
	function pushEnemies () {
		if (warlockShooting == true) {
			console.log('push hechizo');
			console.log(enemiesArray.length);
			enemiesArray.push(new Enemies(400, 'shoot1', shoot1, (background.x + backgroundImage1.width - 450) + (-(background.x)), canvasHeight - 180, 142, 71, 9, 0, 0.9, 3, 0));
		} else {
			console.log('push wolf');
			enemiesArray.push(new Enemies(400, 'wolf', wolfImage, canvasWidth + (-(background.x)), canvasHeight - 110, 163, 98, 9, 0, 0.9, 100, 0));
		}
	}

	/**
	 * Render all the enemies in the game
	 * @function
	 * @example
	 * renderEnemies();
	 */
	function renderEnemies () {

		var i;
		for (i = 0; enemiesArray.length > i; i += 1) {
			setFramesSpriteAnimationEnemies(contextBackground, enemiesArray[i].image, 0, enemiesArray[i].width, enemiesArray[i].height, 0, enemiesArray[i].frameCuantity, enemiesArray[i].x + background.x, enemiesArray[i].y + background.y);
		};
	}

	//Add random enemies
	var randomTimeEnemies = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

	setInterval(function() {

		pushEnemies();

		warlockShootingAnimation = true;

	}, randomTimeEnemies);




	/**
	 * Add the final enemie to the game.
	 * @function
	 * @example
	 * addFinalEnemie();
	 */
	function addFinalEnemie () {

		secondaryCtx.drawImage(wolfImage, background.x + backgroundImage1.width - 500, background.y + 100, extrasCave.width, extrasCave.height);

		if (warlockShootingAnimation == true) {
			setFramesSpriteAnimationEnemies(secondaryCtx, warlock, 0, 150, 226, 0, 9, background.x + backgroundImage1.width - 450, background.y + 480);
		} else {
			setFramesSpriteAnimationEnemies(secondaryCtx, warlock, 230, 150, 226, 0, 9, background.x + backgroundImage1.width - 400, background.y + 460);
		}
	}

	var fps = 60,
		now,
		then = Date.now(),
		interval = 60/fps,
		delta,
		counter = 0,
		first = then,
		frameSecond = 0;

	function setFramesSpriteAnimationEnemies (context, spriteImage, yFramePosition, frameWidth, frameHeight, frameStartPosition, frameCuantity, xPosition, yPosition) {

		now = Date.now();
		delta = now - then;

		if (delta > interval) {
		    then = now - (delta % interval);

		    var time_el = 5;

			counter++;

			frameSecond = parseInt(counter/time_el);

			if (frameSecond >= frameCuantity) {
				counter = 1;
				frameSecond = frameSecond - 8;
			}

			// if (frameSecond < 8) {
			// 	warlockShooting = true;
			// }

			if (frameSecond >= 8) {
				//console.log('stops shotting animation');
				// Stop de shooting animation
				warlockShootingAnimation = false;
			}

		}
		context.drawImage(
			spriteImage,
			frameSecond * frameWidth,
			yFramePosition,
			frameWidth,
			frameHeight,
			xPosition,
			yPosition,
			frameWidth,
			frameHeight
		);
	}


	/* background render
	---------------------------------------------------------------*/
	function renderBackground () {

		 if (userAgent.indexOf('iPad') > -1) {
		 	//contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		 	contextBackground.drawImage(backgroundImage1, background.x - 200, background.y - 155, backgroundImage1.width, 1270);

		  } else if (userAgent.indexOf('Android') > -1) {
		  	// contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		  	contextBackground.drawImage(backgroundImage1, background.x - 200, background.y - 355);

		  } else if (userAgent.indexOf('iPhone') > -1) {
		  	contextBackground.drawImage(backgroundImage1, background.x - 200, background.y - 150, backgroundImage1.width, backgroundImage1.height + 250);

		  } else {
			// Desktop
			// contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
			contextBackground.drawImage(secondaryCanvas, - 100, 50, canvasWidth + 200, backgroundImage1.height);
		 }
	}


	/* colitions
	---------------------------------------------------------------*/
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
				// if (onObstacle == false) {
				// 	if (distanceToCollisionY > 0) {
				// 		collisionDirection = "BUTTON";
				// 	} else {
				// 		// Block de background
				// 		collisionDirection = "TOP";

				// 		// if the collision come from wolf
				// 		if (enemieOrObstacle.name == 'wolf') {

				// 			background.y = 60;//enemieOrObstacle.height;

				// 		// when te collision is with obstacle
				// 		} else if (enemieOrObstacle.name == 'rock') {

				// 			background.y = enemieOrObstacle.height - enemieOrObstacle.differenceY;
				// 			onObstacle = true;
				// 		}
				// 		// } else if (enemieOrObstacle.name == 'water') {
				// 		// 	//console.log('estoy sobre water');
				// 		// 	background.velX -= 0.5;
				// 		// 	onObstacle = true;
				// 		// }
				// 	}
				// }

			} else {
				if (distanceToCollisionX > 0) {
					// collisionDirection = "LEFT";

					// // Block de background
					// background.velX = 0;
					// background.velX--;

					// // Block de extras canvas
					// extras.velX = 0;
					// extras.velX--;

					// // if the collision come from wolf
					// if (enemieOrObstacle.name == 'wolf') {

					// 	// if the player is attacking
					// 	if (player.attack) {
					// 		//remove enemie life
					// 		// cuando el jugador esta atacando tengo que hace que no le saque vida al jugador
					// 		enemieOrObstacle.life -= player.aggressive;
					// 	} else {
					// 		//remove player life
					// 		player.life -= enemieOrObstacle.aggressive;
					// 	}

					// 	// check if the player or enemie is alive
					// 	entityIsAlive(player, enemieOrObstacle);

					// } else if (enemieOrObstacle.name == 'warlock') {

					// 	// if the player is attacking
					// 	if (player.attack) {
					// 		//remove enemie life
					// 		enemieOrObstacle.life -= player.aggressive;

					// 	} else {
					// 		//remove player life
					// 		player.life -= enemieOrObstacle.aggressive;
					// 	}

					// 	// check if the player or enemie is alive
					// 	entityIsAlive(player, enemieOrObstacle);

					// }
					// else if (enemieOrObstacle.name == 'water') {
 					// console.log('left');
 					// onObstacle = true;
					// }


				} else {
					collisionDirection = "RIGHT";
					console.log(collisionDirection);

					// Block de background
					background.velX = 0;
					background.velX++;

					// Block de extras canvas
					extras.velX = 0;
					extras.velX++;

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

					} else if (enemieOrObstacle.name == 'shoot1') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;
						} else {
							//remove player life
							player.life -= enemieOrObstacle.aggressive; // the agresive of the warlok //enemieOrObstacle.aggressive;
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


	/* check the life of the entities
	---------------------------------------------------------------*/
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


		switch (player.life) {
			case 4000:
				$('#adarhaLife').css('background-position-x', -275);
			break;

			case 3500:
				$('#adarhaLife').css('background-position-x', -550);
			break;

			case 3000:
				$('#adarhaLife').css('background-position-x', -825);
			break;

			case 2500:
				$('#adarhaLife').css('background-position-x', -1100);
			break;

			case 2000:
				$('#adarhaLife').css('background-position-x', -1375);
			break;

			case 1500:
				$('#adarhaLife').css('background-position-x', -1650);
			break;

			case 1000:
				$('#adarhaLife').css('background-position-x', -1925);
			break;

			case 500:
				$('#adarhaLife').css('background-position-x', -2200);
			break;
		}


		if (player.life < 0) {

			// Show the Game Over panel
			panelGameOver.removeClass('display-none');

			// Play again. Reset all the values
			playAgain.on('click', function () {
				enemiesArray.length = 0;
				obstaclesArray.length = 0;
				background.x = 0;
				player.life = 4500;
				player.score = 0;
				player.heartsDragon = 0;
				panelGameOver.addClass('display-none');
			});

		} else if (enemies.life < 0) {
			//get the position of the enemie died;
			var enemiesArrayPosition = enemiesArray.indexOf(enemies);
			//remove the enemie died;
			enemiesArray.splice(enemiesArrayPosition, 1);

			// The player get 100 points becouse kill one enemie
			playerUpdateScore(100);
		}



	}


	/* player score
	---------------------------------------------------------------*/
	/**
	 * Update the player score when the player kill an enemie.
	 * @param {number} score,
	 * @function
	 * @example
	 * playerUpdateScore(100);
	 */
	function playerUpdateScore (scoreGet) {
		player.score += scoreGet;
	}


	/* enemie is out the canvas
	---------------------------------------------------------------*/
	/**
	 * Chek if the enemie is out the canvas
	 * @param {Array} enemiesArray[j],
	 * @function
	 * @example
	 * enemiesIsOutTheCanvas(enemiesArray[j]);
	 */
	function enemiesIsOutTheCanvas (enemies) {
		var positionXOfEnemie = enemiesArray[enemiesArray.indexOf(enemies)].x;
		if (positionXOfEnemie < 100) {
			//no me deja eliminarlo porque todavía esta chequeando si tiene colition
			//enemiesArray.splice(enemiesArray[enemiesArray.indexOf(enemies)], 1);
			enemiesArray.splice(enemiesArray.indexOf(enemies), 1);
		}
	}


	/* Game pause and start
	---------------------------------------------------------------*/
	var pauseGame = $('#pauseGame');

	pauseGame.on('click', function () {
		console.log('denter juego');

		cancelAnimationFrame(requestAnimationFrame(update));

		panelPause.toggleClass('display-none');

	});


	/* controls and keys. Event listeners
	---------------------------------------------------------------*/
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

            case 'down-arrow':
          		mobileCrouch = true;
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

            case 'down-arrow':
          		mobileCrouch = false;
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
	// win.addEventListener("load", function(){
	update();
	// });

})(this);