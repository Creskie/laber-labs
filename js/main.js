// Quote Generator for simple science
var quotes = [
  '\"My work centers around using information to make better choices especially when information is big, has noise, and is gathering over time. Also, I yell at students.\"',
  '\"The tiny creatures are planning to take over the world. They enter into your body and make you sick. Even worse, they can spread to anyone near you. They take over your friends, family, and even strangers you meet on the street. Before long, more and more people are sick, and it may be too late to stop the creatures. The good thing is, we humans created guards to fight off the creatures before it has a chance to make you sick. Since there are not many guards around, only a small group of human can be helped at a time. Our work is to find out which humans to help at different time such that there will be fewest sick people in the long run.\"',
  '\"Some information changes over time. We want to take this information to help choose good stuff to give to people who are sick.\"',
  '\"I want to control things spreading in space because they make people and animals sick.\"',
  '\"Information comes in all the time and we’re figuring out how to use them to make good choices. Learning is important. Usually kids can learn or kids can play. Why don’t we have both?\"',
  '\"As the world is becoming colorful, people may feel lost because of too many choices they can do. I am trying to lead one to the right choice for his/her own good and understand the world better at the same time.\"',
  '\"I try to find the best way to stop bad things from spreading.\"',
  '\"Small things live in the dust in your house, and I want to guess where each of those small things lives across the country. This is hard because there are a lot of small things, and they may be nice or mean to each other.\"',
  '\"Some people are mean and steal other people so we try to stop them with numbers. There are also cats in space… don’t ask me why.\"',
  '\"We want to find out how many sick people we need to try to help in order to discover the best way to help all sick people in the future.\"',
]
function newQuote() {
  var randomNumber = Math.floor(Math.random() * (quotes.length));
  document.getElementById('quoteDisplay').innerHTML = quotes[randomNumber];
}

// Shift hands around
$(document).ready(function(){
    animateDiv();
    
});

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - $('.header-image').height() - 40;
    var w = $(window).width() - $('.header-image').width();

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(){
    var newq = makeNewPosition();
    var oldq = $('.header-image').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('.header-image').animate({ top: newq[0], left: newq[1] }, speed, function(){
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

// Images with .img class fade in //
function showImages(el) {
    var windowHeight = jQuery( window ).height();
    $(el).each(function(){
        var thisPos = $(this).offset().top;

        var topOfWindow = $(window).scrollTop();
        if (topOfWindow + windowHeight - 75 > thisPos ) {
            $(this).addClass("fadeIn");
        }
    });
}

// if the image in the window of browser when the page is loaded, show that image
$(document).ready(function(){
        showImages('.fade-img');
});

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function() {
        showImages('.fade-img');
});