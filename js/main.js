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


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - $('.header_image1').height() - 40 * (getRandomArbitrary(10, 20));
    var w = $(window).width() - $('.header_image1').width() * getRandomArbitrary(10, 100)
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
	var i = 1;
	var angle = 0;
	while(true){
	    var newq = makeNewPosition();
	    var oldq = $('.header_image'+i.toString()).offset();
	    var speed = calcSpeed([oldq.top, oldq.left], newq);
	    $('.header_image'+i.toString()).animate({ top: newq[0], left: newq[1] }, speed, function(){
	      animateDiv();        
	    });
	    i++;
	}
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.03;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}

// Smooth scrolling
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });


