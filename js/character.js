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
			y : canvasHeight - 130, // the same value of playerHeight
			playerWidth : 64,
			playerHeight : 130,
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
	var backgroundImage = new Image(),
		backgroundPattern,

		playerImage = new Image(),
		playerPattern;

	backgroundImage.src = 'http://localhost/2d-platform-game/img/background.png';
	backgroundImage.onload = function () {
		// Create a pattern with this image, and set it to "repeat".
		backgroundPattern = contextBackground.createPattern(backgroundImage, 'repeat');
	}

	playerImage.src = 'http://localhost/2d-platform-game/img/player.png';
	playerImage.onload = function () {
		// Create a pattern with this image, and set it to "repeat".
		playerPattern = contextPlayer.createPattern(playerImage, 'no-repeat');
	}


    /**
	 * Create the caracter and update it with requesAnimationFrame.
	 * @returns {Function}
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

		// right arrow
		if (keys[39]) {
			if (background.velX < background.speed) {
				background.velX++;
			}
		}

		//left arrow
		if (keys[37]) {
			if (background.velX >- background.speed) {
				background.velX--;
			}
		}

		// apply friction to the horizontal movement
		background.velX *= friction;
		background.velX *= friction;

		// apply friction to the up movement
		background.velY -= gravity;

		// Move the character
		background.x += background.velX;
		background.y += background.velY;


		//The player stop and not go outside of the canvas
		// if (background.x >= canvasWidth - background.backgroundWidth) {
		// 	background.x = canvasWidth - background.backgroundWidth;
		// } else if (background.x <= 0) {
		// 	background.x = 0;
		// }

		// reset the jump property when the background hits the ground
		if (background.y <= canvasHeight - background.backgroundHeight) {
			background.y = canvasHeight - background.backgroundHeight;
			background.jumping = false;
		}


		// render all the game
		renders();

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);
	}


	function renderPlayer () {
		//clearRect(x, y, width, height);
		contextPlayer.clearRect(0, 0, canvasWidth, canvasHeight);
		// Used for specifying fill color for any closed path/figure/text
		contextPlayer.fillStyle = 'red';
		// contextPlayer.fillRect(x, y, width, height);
		contextPlayer.fillRect(player.x, player.y, player.playerWidth, player.playerHeight);
	}

	function renderBackground () {
		contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		contextBackground.fillStyle = 'red';
		contextBackground.drawImage(backgroundImage, background.x, background.y, background.backgroundWidth, background.backgroundHeight);


		//contextBackground.fillStyle = backgroundPattern;
		//contextBackground.fillRect(background.x, background.y, background.backgroundWidth, background.backgroundHeight);
	}

	function renders () {
		// Call the function tha render the player
		renderPlayer();

		// Call the function tha render the background image
		renderBackground();
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