//	ARREGLAR ESTE CODIGO UE ES EL QUE ESTA BIEN
// (function (game, $) {
// 	'use strict';

// 	/**
//      * Component definition
//      */
//     var resize = {};

// 	/**
// 	 * Display custom canvas
// 	 * @function
// 	 * @example
// 	 * redraw();
// 	 */
// 	resize.redrawCanvas = function () {
// 		context.strokeStyle = 'blue';
// 		context.lineWidth = '1';
// 		context.strokeRect(0, 0, game.innerWidth, game.innerHeight);
// 	}

// 	/**
// 	 * Runs each time the DOM window resize event fires.
// 	 * Resets the canvas dimensions to match window, then draws the new borders accordingly.
// 	 * @returns {Function}
// 	 * @function
// 	 * @example
// 	 * resizeCanvas();
// 	 */
// 	resize.resizeCanvas = function () {
// 		canvas.width = game.innerWidth;
// 		canvas.height = game.innerHeight;
// 		resize.redrawCanvas();
// 	}

// 	/**
// 	 * Listen the resize event and resize the canvas the first time
// 	 * Resets the canvas dimensions to match window, then draws the new borders accordingly.
// 	 * @returns {Function}
// 	 * @function
// 	 * @example
// 	 * resizeCanvas();
// 	 */
// 	resize.initialize = function () {
// 		console.log('entra acá');

// 		// Register an event listener to call the resizeCanvas() function each time the window is resized.
// 		game.addEventListener('resize', resizeCanvas, false);
// 		// Draw canvas border for the first time if not when the page load the event resize dosen't pass.
// 		return resize.resizeCanvas();
// 	}


// 	/**
//      * Expose component
//      */
//     game.resize = resize;

// })(game, $);


(function(win) {

	initialize();
	/**
	 * Start listening to resize events and draw canvas.
	 * @function
	 * @returns {Function}
	 * @example
	 * initialize();
	 */
	function initialize() {
		// Register an event listener to call the resizeCanvas() function each time the window is resized.
		win.addEventListener('resize', resizeCanvas, false);

		// Draw canvas border for the first time if not when the page load the event resize dosen't pass.
		resizeCanvas();
	}

	/**
	 * Display custom canvas
	 * @function
	 * @example
	 * redraw();
	 */
	function redraw() {
		context.strokeStyle = 'blue';
		context.lineWidth = '1';
		context.strokeRect(0, 0, win.innerWidth, win.innerHeight);
	}

	/**
	 * Runs each time the DOM window resize event fires.
	 * Resets the canvas dimensions to match window, then draws the new borders accordingly.
	 * @returns {Function}
	 * @function
	 * @example
	 * resizeCanvas();
	 */
	function resizeCanvas() {
		canvas.width = win.innerWidth;
		canvas.height = win.innerHeight;
		redraw();
	}

})(this);