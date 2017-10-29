// Navigation bar fade while scrolling
(function setupNavbar() {
	var lastTimeoutHandle = null;
	var shouldFadeOut = true;

	function fadeNavbarOut() {
		$('.navbar').fadeOut();
	}

	function fadeNavbarIn() {
		$('.navbar').fadeIn();
		shouldFadeOut = true;
	}

	$(window).scroll(function onScroll() {
		if (shouldFadeOut) {
			shouldFadeOut = false;
			requestAnimationFrame(fadeNavbarOut);
		}

		if (lastTimeoutHandle) {
			clearTimeout(lastTimeoutHandle);
		}
		lastTimeoutHandle = setTimeout(fadeNavbarIn, 300);
	});
})();

// Shift hands around
$(document).ready(function(){
    animateDiv();
    
});

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - $('.header_image').height() - 40;
    var w = $(window).width() - $('.header_image').width();

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
    var newq = makeNewPosition();
    var oldq = $('.header_image').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.header_image').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
    
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.03;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}