var htmlCanvas = document.getElementById('canvas'),
	// Obtain a graphics context on the canvas element for drawing.
	context = htmlCanvas.getContext('2d');

(function (win) {

	// requestAnimationFrame fallback
    var requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
    win.requestAnimationFrame = requestAnimationFrame;

	var width = win.innerWidth,
    	height = win.innerHeight,
		player = {
			x : width / 2,
			y : height - 5,
			width : 15,
			height : 75,
			speed: 4,
			velX: 0,
			velY: 0,
			jumping : false
		},
		keys = [],
		friction = 0.8,
		gravity = 0.25;

	// Set the canvas dimentions equal to the window dimentions
	htmlCanvas.width = width;
	htmlCanvas.height = height;


	// Create new image object to use as pattern for the background game.
	var img = new Image();

	img.src = 'http://www.samskirrow.com/client-kyra/images/main-bg.jpg';

	img.onload = function(){
		// create pattern
		var pattern = context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
		context.fillStyle = pattern;
		context.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
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
		if (player.x >= width - player.width) {
			player.x = width - player.width;
		} else if (player.x <= 0) {
			player.x = 0;
		}

		// reset the jump property when the player hits the ground
		if (player.y >= height - player.height) {
			player.y = height - player.height;
			player.jumping = false;
		}

		// render all the game
		render();

		// run through the loop again to refresh the game all time
		requestAnimationFrame(update);
	}


	function render() {
		// render our player
		context.clearRect(0, 0, width, height);
		context.fillStyle = "red";
		context.fillRect(player.x, player.y, player.width, player.height);

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