UpSlide.js
==========

jQuery image / webpage slider plugin is easy to implement and resizes nicely with the window.

I am currently in the process of using __UpSlide.js__ to create a __remote web presentation__ builder!

**VERSION 2.0.0**

- Added the ability to have child slides
- Added the ability to have different transition effects instead of just sliding up!

Working example -- http://upslide.michaeldahlke.com  <-- Currently Using Version 1.5.0

### Simple use
__HTML__
```html
<div id="us1" class="upslide">
	<ul>
		<li style="background:url('path/to/image.jpg') no-repeat;">
			<div>
				<h2 class="upslide-bannerText">This is the slides title</h2>
				<div class="content">
					<h4>You can put any HTML inside the slide that you want!</h4>
				</div>
			</div>
			<ul class='upslideHorizontal'>
				<li style="background:url('img/slide5.jpg');" data-effect="slide" data-from="left">
					<div>
						<h2 class="upslide-bannerText">Second 1</h2>
						<div class="upslide-content">
							<p>
								HI!
							</p>
						</div>
					</div>
				</li>
				<li style="background:url('img/slide3.jpg');">
					<div>
						<h2 class="upslide-bannerText">Second 2</h2>
					</div>
				</li>
				<li style="background:url('img/slide1.jpg');" data-effect="fade" data-from="bottom">
					<div>
						<h2 class="upslide-bannerText">Second 3</h2>
					</div>
				</li>
			</ul>
		<li>
		<li style="background:url('path/to/image.jpg') no-repeat;">
			<div>
				<h2 class="upslide-bannerText">This title belongs to the second slide!</h2>
				<div class="content">
					<!-- this slide does not contain any text in the slide, only the title (you can also remove the slide title if you want!) -->
				</div>
			</div>
		<li>
	</ul>
</div>
```

__JavaScript__
```javascript
$(document).ready(function(){
	$('.upslide > ul').upslide({
		fullscreen: true
	});
});
```

__CSS__
css is in the css folder

### All UpSlide options

__JavaScript__
```javascript
// how fast the slide will transition
speed: 2000,

// delay between slide transitions
delay: 3000,

// effect to use for slide transition
easing: 'linear',

// fade headers in during slide transition
fadingHeaders: false,

// how fast to fade in headers during transition
fadingHeadersSpeed: 2000,

// hide the header text (useful if you want the header text on the thumbnails but not the slide)
headerHideText: false,

// transaparency of the header background
headerBackgroundTransparency: 0.5,

// colors to apply to the header's background
headerBackgroundColor: ['red', 'green'],

// generate colors that are not assigned a color (if false then it will cycle through "headerBackgroundColor")
headerGenerateBackgroundColor: true,

// make the thumbnail indicator the same color as the current slide's header background
sameSlideAndHeaderColor: true,

// make it fullscreen
fullscreen: false,

// slide automatically
autoSlide: true,

// allow users to use "up" and "down" arrows to navigate the slides
arrowControl: false,

// allow users to use the scrolling on the mouse to navigate (requires: mousewheel.js)
scrollControl: false,

// thumbnail attributes
thumbnail: {
	// show thumbnails
	show: true,
	// position of thumbnails ( left or right )
	position: 'left',
	// show header on thumbnail
	header: false,
	// width of the thumbnails
	width: 10%,
	// height of the thumbnails ( 'auto' sets the height so they fill the plugin window )
	height: 'auto',
	// allow the thumbnails to go past the plugin limits and make that area scrollable
	scrollable: false
},
// indicator attributes
indicator: {
	// speed that the indicator transitions
	speed: 2000,
	// transition effect
	easing: 'linear',
	// color of the indicator
	backgroundColor: [],
	// thickness of the indicator
	width: '2px',
	// transparency
	transparency: '0.5',
	// positioning of the indicator
	position: {
		// the side that the indicator will be on
		side: 'right',
		// inside the thumbnail wrapper or outside
		inOrOut: 'in'
	},
},
// if you don't like using the unordered list structure you can change it to something
// like <article> and <div> or <section> and <article>
// if you prefer
ulAlternative: 'ul',
liAlternative: 'li',
// function to execute when the slide is sliding
onSlide: function(){};
// function to execute when the slide starts sliding
onSlideStart: function(){};
// function to execute when the slide has finished sliding
onSlideFinish: function(){};

```
