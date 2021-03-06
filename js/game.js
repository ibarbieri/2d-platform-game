(function (win) {

	/* requestAnimationFrame fallback
	---------------------------------------------------------------*/
	var lastTime = 0,
		vendors = ['webkit', 'moz'];

	for(var x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
		win.requestAnimationFrame = win[vendors[x]+'RequestAnimationFrame'];
		win.cancelAnimationFrame =
		win[vendors[x]+'CancelAnimationFrame'] || win[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!win.requestAnimationFrame)
	    win.requestAnimationFrame = function(callback, element) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = win.setTimeout(function() { callback(currTime + timeToCall); },
	          timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };

	if (!win.cancelAnimationFrame)
	    win.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	    };


	/* game objects declaration; Player, Background, Extras
	---------------------------------------------------------------*/
    var playerWidth,
    	playerHeight,
		player = {
			x : (canvasWidth / 2) - 84, // Less the middel of the width of the image player
			y : canvasHeight - 190, // Less the height of the image player
			playerWidth : 90,
			playerHeight : 180,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false,
			life : 4500,
			score : 0,
			heartsDragon : 0,
			potions : 0,
			attack : false,
			aggressive : 50
		},
		background = {
			x : 0,
			y : 0,
			backgroundWidth : canvasWidth,
			backgroundHeight : canvasHeight,
			speed: 3.8,
			velX: 0,
			velY: 0,
			friction: 0.77,
			jumping : false
		},
		extras = {
			x : 0,
			y : 0,
			extrasWidth : canvasWidth,
			extrasHeight : canvasHeight,
			speed: 4,
			velX: 0,
			velY: 0,
			friction: 0.75,
			jumping : false
		},
		keys = [],
		gravity = 0.20;


	/* game elements, sounds, extras and flags
	---------------------------------------------------------------*/
	var onObstacle,
		playerOnObstacle,
		adarhaLife = $('#adarhaLife'),
		playerSelectedLife,
		adarhaScore = $('#adarhaScore'),
		adarhaHeartsDragon = $('#adarhaHeartsDragon'),
		potionWasAdded = false,
		controls = document.getElementById('controls'),
		mobileJump,
		mobileCrouch,
		mobileLeft,
		mobileRight,
		mobileAttack,
		walkingLeft = false,
		walkingRight = false,
		walkingRightDirection = false,
		walkingLeftDirection = false,
		playerAttackRight = false,
		playerAttackLeft = false,
		playerCrouchRight = false,
		playerCrouchLeft = false,
		crouch = false,
		crouchKeyDropRight = false,
		crouchKeyDropLeft = false,
		jump = false,
		attacking = false,
		attackRightSprite = false,
		attackLeftSprite = false,
		extrasPlusImages,
		wolfPush = true,
		warlockShooting = false,
		warlockShootingAnimation = false,
		playerWin = false,
		playerLoose = false,
		shootDelay = false,
		warlokIsDraw = false,
		movingEnemie = true,
		removePotionElement = false,
		panelGameOver = $('#panelGameOver'),
		playAgainLoose = $('#playAgainLoose'),
		panelWin = $('#panelWin'),
		getScoreWin = $('#getScoreWin'),
		getScoreLoose = $('#getScoreLoose'),
		stopEnemiesAndObstacles = false;
		mute = $('#mute'),
		noMute = $('#noMute'),
		backgroundSoundEnable = true,
		pauseGame = $('#pauseGame');


	/* images
	---------------------------------------------------------------*/
	var backgroundImage1 = new Image(),
		backgroundImagePatter = new Image(),
		backgroundImageAndroid = new Image(),
		playerSpriteRight = new Image(),
		playerSpriteLeft = new Image(),
		extrasCave = new Image(),
		wolfImage = new Image(),
		rockObstacle = new Image(),
		warlock = new Image(),
		shoot1 = new Image(),
		potion = new Image(),
		heartDragon = new Image();

		backgroundImage1.src = urlBackgroundImage1.src;
		backgroundImagePatter.src = urlBackgroundImagePatter.src;
		backgroundImageAndroid.src = urlBackgroundImageAndroid.src;
		extrasCave.src = urlExtrasCave.src;
		wolfImage.src = urlWolfImage.src;
		rockObstacle.src = urlRockObstacle.src;
		warlock.src = urlWarlock.src;
		shoot1.src = urlShoot1.src;
		potion.src = urlPotion.src;
		heartDragon.src = urlHeartDragon.src;


		if (playerSelected == 'adhara') {

			playerSelectedLife = $('#adarhaLife');
			playerSelectedLife.toggleClass('display-none');

			playerSpriteRight.src = playerSpriteRightAdhara.src;
			playerSpriteLeft.src = playerSpriteLeftAdhara.src;

		} else if (playerSelected == 'aidem') {

			playerSelectedLife = $('#aidenLife')
			playerSelectedLife.toggleClass('display-none');

			playerSpriteRight.src = playerSpriteRightAiden.src;
			playerSpriteLeft.src = playerSpriteLeftAiden.src;

		}


	/* sounds: .wav or .ogg
	---------------------------------------------------------------*/
	var backgroundSound = new Audio("http://spidersofmirkwood.thehobbit.com/media/sounds/loop.ogg"),
		backgroundSoundIos = new Audio("sounds/loop-ios.mp3"),
		finalSound = new Audio('http://spidersofmirkwood.thehobbit.com/media/sounds/loop_boss.ogg'),
		winSound = new Audio("http://spidersofmirkwood.thehobbit.com/media/sounds/_/win.ogg"),
		looseSound = new Audio("http://spidersofmirkwood.thehobbit.com/media/sounds/_/lose.ogg"),
		getHeartSound = new Audio("http://spidersofmirkwood.thehobbit.com/media/sounds/bilbo_health.ogg"),
		getPotionSound = new Audio('http://spidersofmirkwood.thehobbit.com/media/sounds/dwarf_badge_2.ogg'),
		playerSufferAttackSoundAiden = new Audio("http://spidersofmirkwood.thehobbit.com/media/sounds/bilbo_hurt.ogg"),
		playerSufferAttackSoundAdhara = new Audio("sounds/golpeAdhara2.ogg"),
		playerAttackSound = new Audio('http://spidersofmirkwood.thehobbit.com/media/sounds/bilbo_stone.ogg'),
		playerJumpSound = new Audio('http://spidersofmirkwood.thehobbit.com/media/sounds/bilbo_jump.ogg'),
		warlockShootSound = new Audio('sounds/warlok-shoot.ogg');



   	/* Panel device adaptations
	---------------------------------------------------------------*/
    if (userAgent.indexOf('Android') > -1) {

    	// Game over panel
    	panelGameOver.css('width', canvasWidth).css('height', canvasHeight);
		panelGameOver.css('background-size', canvasWidth, canvasHeight);
		$('#panelGameOver .content').css('margin-top', 130);
		$('#panelGameOver p').css('margin-top', 15).css('margin-bottom', 15);

	    // Win panel
    	panelWin.css('width', canvasWidth).css('height', canvasHeight);
		panelWin.css('background-size', canvasWidth, canvasHeight);
		$('#panelWin .content').css('margin-top', 130);


    } else if (userAgent.indexOf('iPad') > -1) {

    	// Game over panel
    	panelGameOver.css('width', canvasWidth).css('height', canvasHeight).css('background-size', canvasWidth, canvasHeight).css('margin-top', 90);
		$('#panelGameOver .content').css('margin-top', 160);
		$('#panelGameOver p').css('margin-top', 14).css('margin-bottom', 10);
		$('#panelGameOver .score').css('margin-bottom', 30);


	    // Win panel
    	panelWin.css('width', canvasWidth).css('height', canvasHeight).css('background-size', canvasWidth, canvasHeight).css('margin-top', 90);
		$('#panelWin .content').css('margin-top', 160);
		$('#panelWin p').css('margin-top', 14).css('margin-bottom', 10);
		$('#panelWin .score').css('margin-bottom', 10);


    } else if (userAgent.indexOf('iPhone') > -1) {

    	// Game over panel
    	panelGameOver.css('width', canvasWidth).css('height', canvasHeight);
		panelGameOver.css('background-size', canvasWidth, canvasHeight);
		$('#panelGameOver .content').css('margin-top', 120);

	    // Win panel
    	panelWin.css('width', canvasWidth).css('height', canvasHeight);
		panelWin.css('background-size', canvasWidth, canvasHeight);
		$('#panelWin .content').css('margin-top', 130);

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

		//alert(requestAnimationFrame);

		// run through the loop again to refresh the game all time
		// VER SI ESTO ME ESTA BAANDO LA PERFORMANCE. QUE TODO EL TIEMPO VAYA A WIN.
		// LO HICE ASI PORQUE EN SAFARI ES LA UNICA FORMA QUE ANDE.
		// PARA EL RESTO ANDA SIN WIN. PERO ARRIBA LE DECLARO UNA VARIABLE QUE SEA IGUAL A WIN.REQUES...
		win.requestAnimationFrame(update);

		// Add background sound
		if (backgroundSoundEnable) {
			if (userAgent.indexOf('iPad') > -1) {
				backgroundSoundIos.play();
			} else {
				backgroundSound.play();
			}
		}

		if (playerLoose) {
			backgroundSound.pause();
			looseSound.play();

		} else if (playerWin) {
			backgroundSound.pause();
			winSound.play();
		}


		// Render the background
		if (userAgent.indexOf('iPad') > -1) {
			// do nothing
		} else if (userAgent.indexOf('Android') > -1) {
			// do nothing
		} else {
			// secondaryCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			// double buffering
			secondaryCtx.drawImage(backgroundImagePatter, background.x, background.y, backgroundImagePatter.width, backgroundImagePatter.height);
	 	}


		// If the player is on the start position
		if (!walkingLeftDirection && !walkingRightDirection) {
			setFramesSpriteAnimation('walkingStopRight', 0, 9, 100);
		}

		// right arrow
		if (keys[39] || mobileRight) {
			walkingRightDirection = true;
			walkingLeftDirection = false;
		}


		// left arrow
		if (keys[37] || mobileLeft) {
			walkingRightDirection = false;
			walkingLeftDirection = true;
		}

		// RIGHT ACTIONS
		if (walkingRightDirection) {

			// Walking right
			if (keys[39] || mobileRight) {
				if (background.velX >- background.speed && extras.velX >- extras.speed) {

					background.velX--;

					extras.velX--;

					if (!background.jumping) {
						setFramesSpriteAnimation('walkingRight', 0, 9, 100);
					}

					walkingRight = true;
				}
			}

			// jumping right
			if (keys[38] || keys[32] || mobileJump) {

				onObstacle = false;

				if (!background.jumping) {

					background.jumping = true;

					setFramesSpriteAnimation('jumpingRight', 0, 9, 30);

					background.velY =+ (background.speed * 2);

					playerJumpSound.play();
				}
			}

			// crouch right
			if (keys[40] || mobileCrouch) {

				crouchKeyDropRight = false;

				setFramesSpriteAnimation('crouchRight', 0, 9, 50);

				if (frame >= 5) {
					setFramesSpriteAnimation('crouchRight', 5, 1, 50);
				}
			}

			// If down arrow is drop
			if (!crouchKeyDropRight) {
				if (keys[40] == false) {
					// Reset the player dimentions.
					player.y = canvasHeight - 190;
					player.playerHeight = 180;

					crouchKeyDropRight = true;
				}
			}

			// a key
			if (keys[65] || mobileAttack) {

				playerAttackRight = true;
				player.attack = true;
				attacking = true;
				attackRightSprite = true;

				//setFramesSpriteAnimation('attackRight', 0, 9, 65);
				animationSprite();

				playerAttackSound.play();
			}

			if (!walkingRight && !background.jumping && !playerCrouchRight && !playerAttackRight) {
				setFramesSpriteAnimation('walkingStopRight', 0, 9, 90);
			}

			walkingRight = false;
			playerCrouchRight = false;
			playerAttackRight = false;


		} else if (walkingLeftDirection) {

			// Walking left
			if (keys[37] || mobileLeft) {
				if (background.velX < background.speed  ||  extras.velX < extras.speed) {

					background.velX++;
					extras.velX++;
					walkingLeft = true;

					if (!background.jumping) {
						setFramesSpriteAnimation('walkingLeft', 0, 9, 100);
					}

				}
			}

			// jumping left
			if (keys[38] || keys[32] || mobileJump) {

				onObstacle = false;

				if (!background.jumping) {

					background.jumping = true;
					setFramesSpriteAnimation('jumpingLeft', 0, 9, 30);
					background.velY =+ (background.speed * 2);

					playerJumpSound.play();
				}
			}

			// crouch left
			if (keys[40] || mobileCrouch) {

				crouchKeyDropLeft = false;

				setFramesSpriteAnimation('crouchLeft', 0, 9, 50);

				if (frame >= 5) {
					setFramesSpriteAnimation('crouchLeft', 5, 1, 50);
				}
			}

			// If down arrow is drop
			if (!crouchKeyDropLeft) {
				if (keys[40] == false) {
					// Reset the player dimentions.
					player.y = canvasHeight - 190;
					player.playerHeight = 180;

					crouchKeyDropLeft = true;
				}
			}

			// a key
			if (keys[65] || mobileAttack) {

				playerAttackLeft = true;
				player.attack = true;
				attacking = true;
				attackLeftSprite = true;

				//setFramesSpriteAnimation('attackLeft', 0, 9, 65);
				animationSprite();

				playerAttackSound.play();
			}

			if (!walkingLeft && !background.jumping && !playerCrouchLeft && !playerAttackLeft) {
				setFramesSpriteAnimation('walkingStopLeft', 0, 9, 90);
			}

			walkingLeft = false;
			playerCrouchLeft = false;
			playerAttackLeft = false;


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

		} else if (-(background.x) > 850 && -(background.x) >= backgroundImage1.width - canvasWidth - deviceDiferenceImage) {

			// Add the final sound. Hacer que este sonido empieza antes igual que los disparos del warloc.
			// Para eso hay que hacer que la condicion de arriba se de antes.
			backgroundSound.pause();
			finalSound.play();


			//obstaclesArray.length = 0;
			// Stop the wolf push
			wolfPush = false;

			// Stop the rocks and enable the shoots
			warlockShooting = true;

			// add the final enemie
			if (warlokIsDraw == false) {
				addFinalEnemie();
			}

			if ( -(background.x) >= backgroundImage1.width - canvasWidth - deviceDiferenceImage) {
				// Stop the player
				background.x = -(backgroundImage1.width - canvasWidth - deviceDiferenceImage);
			}


		}


		onObstacle = false;


		var lengthEnemiesArray = enemiesArray.length,
			lengthobstaclesArray = obstaclesArray.length,
			lengthPotionsArray = potionsArray.length,
			lengthHeartDragonArray = heartDragonArray.length,
			j,
			k,
			h,
			p,
			r;

		// move the enemies
		for (j = 0; lengthEnemiesArray > j; j += 1) {
			// Check if the velocityX is less that the speed. If this condition is true continuous substracting the velocityX.
			if (enemiesArray[j].velocityX >- enemiesArray[j].speed) {

				if (enemiesArray[j].name == 'warlock') {

					if (movingEnemie) {
						enemiesArray[j].velocityX--;
					}

					// Set the 9300 for each device. It can CHANGE depense of the with of the device
					if (enemiesArray[j].x < 9300) {
						// Stop de final enemie
						movingEnemie = false;
					}

				} else {
					enemiesArray[j].velocityX--;
				}
			}

			enemiesArray[j].velocityX *= enemiesArray[j].friction;

			enemiesArray[j].x = enemiesArray[j].x + enemiesArray[j].velocityX;
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

			if (obstaclesArray[j].name == 'rock') {

				obstaclesArray[j].velocityX *= 0.85;

			} else if (obstaclesArray[j].name == 'shoot1') {

				obstaclesArray[j].velocityX *= 1.01;

			}

			obstaclesArray[j].x += obstaclesArray[j].velocityX;
		};

		//check the collision with the obstacles
		for (h = 0; lengthobstaclesArray > h; h += 1) {
			// if (obstaclesArray[h].name == 'rock') {
				checkCollision(player, obstaclesArray[h]);
			// }
		}

		//check the collision with the potions
		for (p = 0; lengthPotionsArray > p; p += 1) {
			checkCollision(player, potionsArray[p]);
		}


		//check the collision with the hearts dragon
		for (r = 0; lengthHeartDragonArray > r; r += 1) {
			checkCollision(player, heartDragonArray[r]);
		}

		// Game pause
		if (stopEnemiesAndObstacles) {
			enemiesArray.length = 0;
			obstaclesArray.length = 0;
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

		renderHeartDragon();

		renderPotion();
	}



	/* Animation Sprite
	---------------------------------------------------------------*/
	function animationSprite () {

		requestAnimationFrame(animationSprite);

		if (attackRightSprite) {

			player.attack = true;
			setFramesSpriteAnimation('attackRight', 0, 9, 65);

		} else if (attackLeftSprite) {

			player.attack = true;
			setFramesSpriteAnimation('attackLeft', 0, 9, 65);

		}

		if (frame >= 8) {
			if (attackRightSprite) {
				attackRightSprite = false;
			} else if (attackLeftSprite) {
				attackLeftSprite = false;
			}
		}

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
          		contextPlayer.drawImage(playerSpriteRight, frame * 167, 0, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'walkingStopRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 167, 192, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'crouchRight':
            	// Con esto hago que cuando se agacha el espacio del player sea menos alto para que no le colisiones los disparos.
	            player.y = canvasHeight - 90;
				player.playerHeight = 90;
            	contextPlayer.drawImage(playerSpriteRight, frame * 167, 384, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'jumpingRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 167, 576, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'attackRight':
            	contextPlayer.drawImage(playerSpriteRight, frame * 167, 769, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 169, 196);
            break;

            case 'walkingLeft':
          		contextPlayer.drawImage(playerSpriteLeft, frame * 167, 0, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'walkingStopLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 167, 192, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'crouchLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 167, 384, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'jumpingLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 167, 576, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 172, 196);
            break;

            case 'attackLeft':
            	contextPlayer.drawImage(playerSpriteLeft, frame * 167, 769, 167, 191, (canvasWidth / 2) - 84, canvasHeight - 210, 170, 196);
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
	function Obstacles (life, name, yFramePosition, image, x, y, width, height, frameCuantity, velocityX, friction, speed, aggressive) {
		this.life = life;
		this.name = name;
		this.yFramePosition = yFramePosition;
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
		if (warlockShooting == false) {
			// new Obstacles('rock', bigRockObstacle, canvasWidth + 1100, canvasHeight - 302, 247, 194, 92),
			// new Obstacles('water', waterObstacle, canvasWidth + 1500, canvasHeight - 220, 222, 70, 70)
			obstaclesArray.push(new Obstacles(400, 'rock', 0, rockObstacle, canvasWidth + (-(background.x)), canvasHeight - 110, 163, 98, 9, 0, 2, 15, 50));
		}
	}


	// Push obstacles shoot into the array each x seconds que vienen del set interval que dispara la animacion shooting del warlok
	function pushObstacleEachSeconds () {
		obstaclesArray.push(new Obstacles(600, 'shoot1', 0, shoot1, warlokShootPosition, canvasHeight - 200, 142, 71, 9, 0, 0.9, 3, 150));

		warlockShootSound.play();
	}


	//Add random obstacles
	var randomTimeObstacles = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

	setInterval(function() {
		if (playerWin == false) {
			pushObstacle();
		}
	}, randomTimeObstacles);


	function renderObstacles () {
		var o;

		for (o = 0; obstaclesArray.length > o; o += 1) {

			if (obstaclesArray[o].name == 'rock') {

				setFramesSpriteAnimationEnemies(contextBackground, rockObstacle, 0, 155, 148, 0, obstaclesArray[o].frameCuantity, obstaclesArray[o].x + background.x, obstaclesArray[o].y + background.y);

			} else if (obstaclesArray[o].name == 'shoot1') {

				setFramesSpriteAnimationEnemies(contextBackground,
					shoot1,
					0,
					obstaclesArray[o].width,
					obstaclesArray[o].height,
					0,
					obstaclesArray[o].frameCuantity,
					obstaclesArray[o].x + background.x,
					obstaclesArray[o].y + background.y
				);

			}
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
	function Enemies (life, name, yFramePosition, image, x, y, width, height, frameCuantity, velocityX, friction, speed, aggressive) {
		this.life = life;
		this.name = name;
		this.yFramePosition = yFramePosition;
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
	var enemiesArray = [];

	// Push enemies into the array
	function pushEnemies () {
		enemiesArray.push(new Enemies(400, 'wolf', 0, wolfImage, canvasWidth + (-(background.x)), canvasHeight - 110, 162, 98, 9, 4, 0.8, 100, 75));
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

			if (enemiesArray[i].name == 'wolf') {

				setFramesSpriteAnimationEnemies(contextBackground, enemiesArray[i].image, enemiesArray[i].yFramePosition, enemiesArray[i].width, enemiesArray[i].height, 0, enemiesArray[i].frameCuantity, enemiesArray[i].x + background.x, enemiesArray[i].y + background.y);

			} else if (enemiesArray[i].name == 'warlock') {

				if (warlockShootingAnimation == true) {
					setFramesSpriteAnimationEnemies(contextBackground, enemiesArray[i].image, 0, enemiesArray[i].width, enemiesArray[i].height, 0, enemiesArray[i].frameCuantity, enemiesArray[i].x + background.x, enemiesArray[i].y + background.y);
				} else {
					setFramesSpriteAnimationEnemies(contextBackground, enemiesArray[i].image, 230, enemiesArray[i].width, enemiesArray[i].height, 0, enemiesArray[i].frameCuantity, enemiesArray[i].x + background.x, enemiesArray[i].y + background.y);
				}
			}

		};
	}

	//Add random enemies
	var randomTimeEnemies = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

	setInterval(function() {

		// Remove the opacity of the player
		removeOpacity();

		if (wolfPush) {
			pushEnemies();
		}

		// run the shotting warlok animation
		warlockShootingAnimation = true;

	}, randomTimeEnemies);


	setInterval(function() {

		// push the shoot with 1 second delay to fix with de animation.
		if (warlockShooting == true && playerWin == false) {
			pushObstacleEachSeconds();
		}

	}, (randomTimeEnemies + 10));


	/**
	 * Add the final enemie to the game.
	 * @function
	 * @example
	 * addFinalEnemie();
	 */
	function addFinalEnemie () {
		enemiesArray.push(new Enemies(4000, 'warlock', 0, warlock, canvasWidth + (-(background.x)), canvasHeight - 210, 150, 226, 9, 0, 0.7, 100, 200));
		warlokIsDraw = true;
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

			if (frameSecond >= 8) {
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



	/* pozimas y hearts dragons
	---------------------------------------------------------------*/
	/**
	 * Class constructor of Potions
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120 -(the height of the image plus 230 of the canvas), 150, 150);
	 */
	function Potions (energy, name, yFramePosition, image, x, y, width, height, frameCuantity) {
		this.energy = energy;
		this.name = name;
		this.yFramePosition = yFramePosition;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.frameCuantity = frameCuantity;
	}

	// Array to add and remove potions
	var potionsArray = [];

	// Push potion
	function addPotion () {
		if (player.potions <= 2) {
			potionsArray.push(new Potions(5000, 'potion', 0, potion, canvasWidth + (-(background.x)), canvasHeight - 65, 50, 50, 9));
			removePotionElement = true;
		}
	}

	// Render potion
	function renderPotion () {

		var x;

		for (x = 0; potionsArray.length > x; x += 1) {
			setFramesSpriteAnimationEnemies(contextBackground, potionsArray[x].image, potionsArray[x].yFramePosition, potionsArray[x].width, potionsArray[x].height, 0, potionsArray[x].frameCuantity, potionsArray[x].x + background.x, potionsArray[x].y + background.y);
		}

	}

	// Remove the potion with the collition with the player or 4 second after
	function removePotion () {
		potionsArray.splice(0, 1);
	}

	// Run the remove function 4 second after the push
	setInterval(function() {

		if (removePotionElement) {

			removePotion();

			removePotionElement = false;
		}

	}, 7000);


	/**
	 * Class constructor of heart's dragons
	 * @function
	 * @params {image, x, y, width, height}
	 * @example
	 * new Obstacles(rockObstacle, canvasWidth, canvasHeight -120 -(the height of the image plus 230 of the canvas), 150, 150);
	 */
	function HeartDragon (score, name, yFramePosition, image, x, y, width, height, frameCuantity) {
		this.score = score;
		this.name = name;
		this.yFramePosition = yFramePosition;
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.frameCuantity = frameCuantity;
	}

	// Array to add and remove HeartDragon
	var heartDragonArray = [];

	// Push heart dragon
	function addHeartDragon () {
		heartDragonArray.push(new HeartDragon(1000, 'heartDragon', 0, heartDragon, canvasWidth + (-(background.x)), canvasHeight - 300, 50, 50, 9));
	}

	// Render Heart Dragon
	function renderHeartDragon () {

		var z;

		for (z = 0; heartDragonArray.length > z; z += 1) {
			setFramesSpriteAnimationEnemies(contextBackground, heartDragonArray[z].image, 0, heartDragonArray[z].width, heartDragonArray[z].height, 0, heartDragonArray[z].frameCuantity, heartDragonArray[z].x + background.x, heartDragonArray[z].y + background.y);
		}
	}

	// Remove heart dragon
	function removeHeartDragon () {
		heartDragonArray.splice(0, 1);
	}

	setInterval(function() {
		// Push a heart dragon
		if (heartDragonArray.length <= 10) {
			addHeartDragon();
		}
	}, randomTimeEnemies + 9000);




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

					// Block de background
					background.velX = 0;
					background.velX++;

					// Block de extras canvas
					extras.velX = 0;
					extras.velX++;

					// If the collision come from enemie remove player life
					if (enemieOrObstacle.name == 'wolf' || enemieOrObstacle.name == 'warlock' || enemieOrObstacle.name == 'rock') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;

							if (enemieOrObstacle.name == 'warlock' && enemieOrObstacle.life <= 0) {
								playerUpdateScore(2555);
								showWinPanel();
							};

						} else {
							// Add and remove the opacity class to the player
							$('#player').toggleClass('player-opacity');

							// Enemie attack sound
							if (playerSelected == 'aidem') {
								playerSufferAttackSoundAiden.play();
							} else {
								playerSufferAttackSoundAdhara.play();
							}

							//remove player life
							player.life -= enemieOrObstacle.aggressive;
							playerUpdateScore(enemieOrObstacle.aggressive);
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

					} else if (enemieOrObstacle.name == 'shoot1') {

						// if the player is attacking
						if (player.attack) {
							//remove enemie life
							enemieOrObstacle.life -= player.aggressive;
						} else {
							// Add and remove the opacity class to the player
							$('#player').toggleClass('player-opacity');

							// Enemie attack sound
							if (playerSelected == 'aidem') {
								playerSufferAttackSoundAiden.play();
							} else {
								playerSufferAttackSoundAdhara.play();
							}


							//remove player life
							player.life -= enemieOrObstacle.aggressive; // the agresive of the warlok //enemieOrObstacle.aggressive;

							playerUpdateScore(-25);
						}

						// check if the player or enemie is alive
						entityIsAlive(player, enemieOrObstacle);

 					} else if (enemieOrObstacle.name == 'potion') {

 						//player.life = enemieOrObstacle.energy;
 						// Uso el 3000 para que caiga justo en el swich case de 3000
 						player.life = 3500;

 						entityIsAlive(player, enemieOrObstacle);

 						getPotionSound.play();

 						potionWasAdded = false;

 						movePotionImage();

 						removePotion();

 						playerUpdateScore(50);

 					} else if (enemieOrObstacle.name == 'heartDragon') {

 						playerUpdateScore(enemieOrObstacle.score);

 						getHeartSound.play();

 						plusHeartsDragon(1);

 						playerUpdateScore(125);

 						removeHeartDragon();
 					}
				}
			}
		}


		// If no hay colition
		// Remove the opacity class to the player
		//$('#player').removeClass('player-opacity');

		return collisionDirection;
	}


	function removeOpacity () {
		$('#player').removeClass('player-opacity');
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

		var yPosition = 0;

		if (player.life <= 4000 && player.life > 3501) {

			playerSelectedLife.css({'background-position':-widthOfSpriteEnergy+'px '+yPosition+'px'});

		} else if (player.life <= 3500 && player.life > 3001) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*2)+'px '+yPosition+'px'});


		} else if (player.life <= 3000 && player.life > 2501) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*3)+'px '+yPosition+'px'});


		} else if (player.life <= 2500 && player.life > 2001) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*4)+'px '+yPosition+'px'});

		} else if (player.life <= 2000 && player.life > 1501) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*5)+'px '+yPosition+'px'});


		} else if (player.life <= 1500 && player.life > 1001) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*6)+'px '+yPosition+'px'});

			if (!potionWasAdded) {
				addPotion();
				potionWasAdded = true;
			}

		} else if (player.life <= 1000 && player.life > 501) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*7)+'px '+yPosition+'px'});


		} else if (player.life <= 500) {

			playerSelectedLife.css({'background-position':-(widthOfSpriteEnergy*8)+'px '+yPosition+'px'});

			if (!potionWasAdded) {
				addPotion();
				potionWasAdded = true;
			}
		}



		if (player.life < 0) {

			// Post score
			$('.buttonShareScore').on('click', function () {
				postScore(player.score);
			});

			// Show the Game Over panel
			panelGameOver.removeClass('display-none');
			getScoreLoose.html(player.score);

			enemiesArray.length = 0;
			obstaclesArray.length = 0;
			heartDragonArray.length = 0;
			potionsArray.length = 0;
			warlockShooting = false;
			playerWin = true;
			wolfPush = false;
			playerLoose = true;

			//looseSound.play();

			// Play again. Reset all the values
			playAgainLoose.on('click', function () {
				enemiesArray.length = 0;
				obstaclesArray.length = 0;
				heartDragonArray.length = 0;
				potionsArray.length = 0;
				background.x = 0;
				player.life = 4500;
				playerLoose = false;
				playerWin = false;
				wolfPush = true;
				warlokIsDraw = false;
				player.score = 0;
				player.potions = 0;
				player.heartsDragon = 0;
				plusHeartsDragon(0);
				stopEnemiesAndObstacles = false;

				playerSelectedLife.css({'background-position':0+'px '+0+'px'});
				$('#adarhaPotion').css({'background-position':0+'px '+0+'px'});

				potionWasAdded = false;

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


	function movePotionImage (playerGetPotion) {

		player.potions += 1;

		switch (player.potions) {
			case 1:
				$('#adarhaPotion').css({'background-position':-widthOfSpritePotion+'px '+0+'px'});
			break;

			case 2:
				$('#adarhaPotion').css({'background-position':-(widthOfSpritePotion*2)+'px '+0+'px'});
			break;

			case 3:
				$('#adarhaPotion').css({'background-position':-(widthOfSpritePotion*3)+'px '+0+'px'});
			break;
		}

	}



	/* Game actions
	---------------------------------------------------------------*/

	// Game continue
	buttonReanudar.click( function () {
		panelPause.toggleClass('display-none');
		stopEnemiesAndObstacles = false;
	});

	buttonInstructions.click( function () {
		panelPause.toggleClass('display-none');
		panelReadInstructionsPause.toggleClass('display-none');
	});

	buttonBack.click( function () {
		panelPause.toggleClass('display-none');
		panelReadInstructionsPause.toggleClass('display-none');
	});


	// Game pause
	pauseGame.on('click', function () {
		// Show the panel pause
		panelPause.toggleClass('display-none');
		stopEnemiesAndObstacles = true;
	});

	// Play again or resmen
	buttonResumen.on('click', function () {
		// Show the play again panel
		panelPause.toggleClass('display-none');
		panelPlayAgain.toggleClass('display-none');
	});

	buttonPlayAgain.on('click', function () {
		enemiesArray.length = 0;
		obstaclesArray.length = 0;
		heartDragonArray.length = 0;
		potionsArray.length = 0;
		background.x = 0;
		player.life = 4500;
		playerLoose = false;
		playerWin = false;
		wolfPush = true;
		player.score = 0;
		player.potions = 0;
		player.heartsDragon = 0;
		plusHeartsDragon(0);
		stopEnemiesAndObstacles = false;


		playerSelectedLife.css({'background-position':0+'px '+0+'px'});
		$('#adarhaPotion').css({'background-position':0+'px '+0+'px'});

		potionWasAdded = false;
		panelPlayAgain.toggleClass('display-none');
	});


	buttonBackResumen.on('click', function () {
		panelPause.toggleClass('display-none');
		panelPlayAgain.toggleClass('display-none');
	});


	//Game mute
	mute.on('click', function () {
		backgroundSoundEnable = false;
		backgroundSound.pause();

		mute.toggleClass('display-none');
		noMute.toggleClass('display-none');
	});

	noMute.on('click', function () {
		backgroundSound.play();

		noMute.toggleClass('display-none');
		mute.toggleClass('display-none');
	});


	/* Show win panel
	---------------------------------------------------------------*/
	function showWinPanel () {
		// Post score
		$('.buttonShareScore').on('click', function () {
			postScore(player.score);
		});


		// Show the Win panel
		panelWin.removeClass('display-none');
		getScoreWin.html(player.score);

		winSound.play();

		enemiesArray.length = 0;
		obstaclesArray.length = 0;
		heartDragonArray.length = 0;
		potionsArray.length = 0;
		warlockShooting = false;
		playerWin = true;

		$('#playAgainWin').on('click', function () {
			heartDragonArray.length = 0;
			potionsArray.length = 0;
			background.x = 0;
			player.life = 4500;
			playerLoose = false;
			playerWin = false;
			wolfPush = true;

			playerSelectedLife.css({'background-position':0+'px '+0+'px'});
			$('#adarhaPotion').css({'background-position':0+'px '+0+'px'});

			potionWasAdded = false;

			player.score = 0;
			player.potions = 0;
			player.heartsDragon = 0;
			plusHeartsDragon(0);

			panelWin.toggleClass('display-none');
		});

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



	/* hearts dragns
	---------------------------------------------------------------*/
	/**
	 * Update the player score when the player kill an enemie.
	 * @param {number} score,
	 * @function
	 * @example
	 * playerUpdateScore(100);
	 */
	function plusHeartsDragon (heartGet) {
		player.heartsDragon += heartGet;

		$('#adarhaHeartsDragon').html(player.heartsDragon);
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



	/* post the score
	---------------------------------------------------------------*/
	function postScore (score) {

		/* make the API call */
	    FB.api(
	        "/" + fbUserId + "/scores",
	        "POST",
	        {
	            "score": score

	        },

	        function (response) {
	          if (response && !response.error) {

				FB.ui({
		            method:             'stream.publish',
		            message:            'Yo hice '+score+' en este juego!',
		            attachment: {
		                name:           'Lesath Game',
		                caption:        'Supera la marca de tus amigos',
		                description:    'Yo hice '+score+' puntos!!!',
		                media: 			[{'type':'image', 'src': 'http://www.lesathtrilogy.com/game/img/share-score-btn-facebook.jpg', 'href':'http://www.lesathtrilogy.com/game/index.html'}],
		                href:           'http://www.lesathtrilogy.com/game/index.html'
		            },
		            action_links: [
		                { text: 'Juga Lesath', href: 'http://www.lesathtrilogy.com/game/index.html' }
		            ],
		            user_message_prompt:    'Tell your friends about Game'
		        },
		        function(response) {
		            if ( response && response.post_id ) {
		                //alert( 'Post was published.' );
		            } else {
		                //alert( 'Post wasn\'t published.' );
		            }
		        });

	          }
	        }

	    ); // end FB.api
	}





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


	// Prevent the scroll in the page
	$('body').on('touchmove', function (event) {
		event.preventDefault();
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


	controls.addEventListener("touchEvent.targetTouches", function (event) {
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


	// listen when a mobile button is dropped
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