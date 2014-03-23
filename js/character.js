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
			y : canvasHeight - 5,
			playerWidth : 15,
			playerHeight : 75,
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
		friction = 0.8,
		gravity = 0.25;

	// Set the canvas dimentions equal to the window dimentions
	canvasPlayer.width = canvasWidth;
	canvasPlayer.height = canvasHeight;

	canvasBackground.width = canvasWidth;
	canvasBackground.height = canvasHeight;


	// Create new image object to use as pattern for the background game.
	var backgroundImage = new Image(),
		pattern;

	// if (canvasBackground.width >= 800 || canvasBackground.height >= 700) {
	// 	return backgroundImage.src = 'http://localhost/2d-platform-game/img/background-scene-small.jpg';
	// 	console.log('mayor que 800');
	// } else {
	// 	return backgroundImage.src = 'http://localhost/2d-platform-game/img/background-scene-big.jpg';
	// }

	backgroundImage.src = 'http://localhost/2d-platform-game/img/background-scene-big.jpg';

	backgroundImage.onload = function (){
		// Create a pattern with this image, and set it to "repeat".
		pattern = contextBackground.createPattern(backgroundImage, 'repeat');
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
			if (!player.jumping) {
				player.jumping = true;
				player.velY =- player.speed * 2;
			}
		}

		// right arrow
		if (keys[39]) {
			if (player.velX < player.speed) {
				player.velX++;
			}
		}

		//left arrow
		if (keys[37]) {
			if (player.velX >- player.speed) {
				player.velX--;
			}
		}

		// apply friction to the horizontal movement
		player.velX *= friction;

		// apply friction to the up movement
		player.velY += gravity;

		// Move the character
		player.x += player.velX;
		player.y += player.velY;

		// The player stop and not go outside of the canvas
		if (player.x >= canvasWidth - player.playerWidth) {
			player.x = canvasWidth - player.playerWidth;
		} else if (player.x <= 0) {
			player.x = 0;
		}

		// reset the jump property when the player hits the ground
		if (player.y >= canvasHeight - player.playerHeight) {
			player.y = canvasHeight - player.playerHeight;
			player.jumping = false;
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
		contextPlayer.fillStyle = "red";

		// contextPlayer.fillRect(x, y, width, height);
		contextPlayer.fillRect(player.x, player.y, player.playerWidth, player.playerHeight);
	}

	function renderBackground () {
		contextBackground.clearRect(0, 0, canvasWidth, canvasHeight);
		contextBackground.fillStyle = pattern;
		contextBackground.fillRect(0, 0, canvasWidth, canvasHeight);
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