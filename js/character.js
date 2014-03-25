var canvasPlayer = document.getElementById('player'),
	canvasBackground = document.getElementById('background'),
	contextPlayer = canvasPlayer.getContext('2d'),
	contextBackground = canvasBackground.getContext('2d');

(function (win) {

	// requestAnimationFrame fallback
    var requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
    win.requestAnimationFrame = requestAnimationFrame;

	var canvasWidth = win.innerWidth,
    	canvasHeight = win.innerHeight,
    	playerWidth,
    	playerHeight,
		player = {
			x : canvasWidth / 2,
			y : canvasHeight - 140, // y position of the player
			playerWidth : 86,
			playerHeight : 102,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false
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
		}
		keys = [],
		friction = 0.9,
		gravity = 0.25;

	// Set the canvas dimentions equal to the window dimentions
	canvasPlayer.width = canvasWidth;
	canvasPlayer.height = canvasHeight;

	canvasBackground.width = canvasWidth;
	canvasBackground.height = canvasHeight;


	// Create new image object to use as pattern for the background game.
	var backgroundImage1 = new Image(),
		backgroundImage2 = new Image(),
		enemiesImage = new Image(),
		playerImage = new Image();

	backgroundImage1.src = 'http://localhost/2d-platform-game/img/background-1.jpg';
	// backgroundImage1.onload = function () {
	// 	// Create a pattern with this image, and set it to "repeat".
	// 	backgroundPattern1 = contextBackground.createPattern(backgroundImage1, 'repeat');
	// }

	backgroundImage2.src = 'http://localhost/2d-platform-game/img/background-2.jpg';

	enemiesImage.src = 'http://localhost/2d-platform-game/img/enemie.png';

	playerImage.src = 'http://localhost/2d-platform-game/img/player.png';


	/**
	 * Class constructor of enemies
	 * @function
	 * @params {image, x, y, width, height, velX}
	 * @example
	 * new Enemies(enemiesImage, canvasWidth, canvasHeight - 130, 100, 100, 0, 0.9, 5);
	 */
	function Enemies (image, x, y, width, height, velocityX, friction, speed) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velocityX = velocityX;
		this.friction = friction;
		this.speed = speed;
	}

	// Array to add and remove enemies in the game
	var enemiesArray = [];

	// Push enemies into the array
	enemiesArray.push(
					  new Enemies(enemiesImage, canvasWidth, canvasHeight -80, 50, 50, 0, 0.9, 2)
					  );


    /**
	 * Move the player and the enemies and update it with requesAnimationFrame.
	 * @returns {renders(), requestAnimationFrame(update)}
	 * @function
	 * @example
	 * update();
	 */
	function update(){
		// up arrow or space
		if (keys[38] || keys[32]) {
			if (!background.jumping) {
				background.jumping = true;
				background.velY =+ background.speed * 2;
			}
		}

		// left arrow.
		if (keys[37]) {
			if (background.velX < background.speed) {
				// Here i plus the velX becouse the gravity is rotated.
				background.velX++;
			}
		}

		// right arrow
		if (keys[39]) {
			if (background.velX >- background.speed) {
				// Here i less the velX becouse the gravity is rotated.
				background.velX--;
			}
		}

		// apply friction to the horizontal movement of the background
		background.velX *= friction;

		// apply friction to the up movement of the background
		background.velY -= gravity;

		// Move the the background
		background.x += background.velX;
		background.y += background.velY;

		// reset the jump property when the background hits the ground
		if (background.y <= canvasHeight - background.backgroundHeight) {
			background.y = canvasHeight - background.backgroundHeight;
			background.jumping = false;
		}

		//The player stop and not go outside of the canvas
		//console.log(background.x);
		// if (background.x >= canvasWidth - background.backgroundWidth) {
		// 	background.x = canvasWidth - background.backgroundWidth;
		// } else if (background.x <= 0) {
		// 	background.x = 0;
		// }


		// Moving the enemies
		for (var j = 0; enemiesArray.length > j; j++) {

			// Check if the velocityX is less that the speed. If this condition is true continuous substracting the velocityX.
			if (enemiesArray[j].velocityX >- enemiesArray[j].speed) {
				enemiesArray[j].velocityX--;
			}

			enemiesArray[j].velocityX *= friction;

			enemiesArray[j].x += enemiesArray[j].velocityX;
		};


		// render all the game
		renders();

		// check the collision of two objects
		checkCollision(player, enemiesArray[0]);

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);
	}


	function renderPlayer () {
		//clearRect(x, y, width, height);
		//contextPlayer.clearRect(0, 0, canvasWidth, canvasHeight);

		//contextPlayer.drawImage(imageSrc, x, y, width, height);
		contextPlayer.drawImage(
			playerImage,
			player.x,
			player.y,
			player.playerWidth,
			player.playerHeight
			);
	}


	function renderBackground () {
		// Less the canvasHeight to the height of the image to position the y positon of the image in the bottom of the page.
		var backgroundImage1Difference = backgroundImage1.height - canvasHeight;

		contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		contextBackground.drawImage(backgroundImage1, background.x, background.y - backgroundImage1Difference, backgroundImage1.width, backgroundImage1.height);

		// I have to draw this image when the player arrive to determinada position of x.
		// contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		// contextBackground.fillStyle = backgroundPattern2;
		// contextBackground.drawImage(backgroundImage2, backgroundImage1.width, background.y, backgroundImage2.width, backgroundImage2.height);
	}


	function renderEnemies () {
		var enemiesImageDifference = canvasHeight - enemiesImage.height;

		// Loop though the enemiesArray and draw all the enemies
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



	function checkCollision(player, enemies) {
		// get the vectors to check against
		// Here less the background.x to the player.x becouse the player.x is allways the same. The player isn't animated. The background is animated.
		var distanceToCollisionX = (player.x - background.x + (player.playerWidth / 2)) - (enemies.x + (enemies.width / 2)),
			distanceToCollisionY = (player.y - background.y + (player.playerHeight / 2)) - (enemies.y + (enemies.height / 2)),

			// add the half widths and half heights of the objects
			halfWidths = (player.playerWidth / 2) + (enemies.width / 2),
			halfHeights = (player.playerHeight / 2) + (enemies.height / 2),
			collisionDirection = null;

		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(distanceToCollisionX) < halfWidths && Math.abs(distanceToCollisionY) < halfHeights) {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = halfWidths - Math.abs(distanceToCollisionX),
				oY = halfHeights - Math.abs(distanceToCollisionY);
			if (oX >= oY) {
				if (distanceToCollisionY > 0) {
					collisionDirection = "top";
				} else {
					collisionDirection = "button";
				}
			} else {
				if (distanceToCollisionX > 0) {
					collisionDirection = "left";
				} else {
					collisionDirection = "rigth";
				}
			}
		}
		return collisionDirection;
	}



	function renders () {
		// Call the function tha render the player
		renderPlayer();

		// Call the function tha render the background image
		renderBackground();

		// Call the function tha render the enemies. I have yo call this function random or when y want to a enemie apear.
		renderEnemies();
	}

	// Listen when a key is pressed
	document.body.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
	});

	// Listen when a key is dropped
	document.body.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
	});

	//Call de update function when the page load.
	win.addEventListener("load", function(){
		update();
	});

})(this);