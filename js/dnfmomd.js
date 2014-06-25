var dnfmomd = new function () {
	var me = this;

	var $loader,
	    currentImage = 0;


	me.init = function () {

		var s = [];

		for (var i = 1; i <= 2; i++) {
			s.push('../img/background-1.jpg');
		}
		$loader = $('#loader');

		$loader.max = s.length;
		imageCache.pushArray(s, loadImageEvent, loadAllEvent);

	}

	function loadImageEvent() {
		val = parseInt($loader.attr('value'));
		val++;

		$loader.attr('value', val);
	}

	function loadAllEvent() {

		$('body').addClass('loaded');
		showImage(1, true);
	}

	function showImage(num, isStart) {
		var previousNum = num -1;

		if (previousNum == 0) {
			previousNum=28;
		}

		var s = '<img src="images/dnfmomd/' + num + '.jpg" class="notShown" />';

		if (!isStart) {
			s = s + '<img src="images/dnfmomd/' + previousNum + '.jpg" class="shown" />';
		}

		$('#images').html(s);

		var $shown = $('#images .shown');
		var nextImage = num + 1;
		if (nextImage > 28) {
			nextImage = 1;
		}

		if ($shown.length > 0) {
			$shown.animate({
				opacity: 0
			}, 2000, function () {

				setTimeout(function(){
					showImage(nextImage, false);
				}, 1000);
			});
		} else {
			setTimeout(function(){
				showImage(nextImage, false);
			}, 1000);
		}
	}


}

/*
 *  Use $(window).load() instead of $(document).ready() because we wan't to start caching images
 *  as soon as the progress bar images are loaded.
 */

$(window).load(dnfmomd.init)