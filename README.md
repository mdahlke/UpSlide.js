UpSlide.js
==========

jQuery image / webpage slider plugin is easy to implement and resizes nicely with the window.

We are currently in the process of using __UpSlide.js__ to create a __remote web presentation__ builder!

Working example -- http://upslide.michaeldahlke.com

### Simple use
__HTML__
```html
<div id="us1" class="upslide">
	<ul>
		<li style="background:url('path/to/image.jpg') no-repeat;">
			<p class="upslide-bannerText">This is the slides title</p>

			<div class="content">
				<h4>You can put any HTML inside the slide that you want!</h4>
			</div>
		<li>
		<li style="background:url('path/to/image.jpg') no-repeat;">
			<p class="upslide-bannerText">This title belongs to the second slide!</p>
			<!-- this slide does not contain any text in the slide, only the title (you can also remove the slide title if you want!) -->
		<li>
	</ul>
</div>
```

__JavaScript__
```javascript
$(document).ready(function(){
	$('#us1 > ul').upslide({
		fullscreen: true
	});
});
```

__CSS__
```css
.upslide {
	position: relative;
	background-color: white;
	margin:0 auto;
	text-align: center;
	width: 85%;
	height:500px;
	overflow: auto;
	clear: both;
	overflow: hidden;
}

.upslide-arrow {
	display: block;
	position: absolute;
	left: 50%;
	width: 40px;
	height: 40px;
	opacity: .4;
	transition: all 0.5s 0s;
	-webkit-transition: all 0.5s 0s;
	-moz-transition: all 0.5s 0s;
	-ms-transition: all 0.5s 0s;
	-o-transition: all 0.5s 0s;
	z-index: 99;
}
.upslide-arrow:nth-of-type(odd) {
	top: 0px;
}

.upslide-arrow:nth-of-type(even) {
	bottom: 0px;
}

.upslide ul {
	position: absolute;
	box-sizing:border-box;
	margin: 0;
	padding: 0;
	height:100%;
	float:left;
}

.upslide li {
	background-repeat: no-repeat;
	background-position: center;
	height:100%;
}

.upslide-bannerBackground {
	position: relative;
	background-size:100% 100% !important;
	color: white;
	width: 100%;
	height:100%;
}

.upslide-bannerText {
	position: absolute;
	box-sizing:border-box;
	background-color: #0086A0;
	margin:0;
	padding: 2% 1% 2% 1%;
	color: white;
	width: 100%;
	z-index: 9;
	
	color: white;
	text-shadow:
   -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;
}

.upslide-thumbnailWrapper {
	position:absolute;
	box-sizing:border-box;
	border-right:1px solid black;
	border-top:1px solid black;
	border-bottom:1px solid black;
	width:10%;
	float:left;
	z-index:9999;
}

.upslide-thumbnail {
	box-sizing:border-box;
	background-size:100% 100%;
	background-repeat:no-repeat;
	border-bottom:5px solid black;
	cursor:pointer;
	width:100%;
	float:left;
	overflow:hidden;
}

.upslide-thumbnail:last-of-type {
	border-bottom:none !important;
}

.upslide-thumbnailIndicator {
	position:absolute;
	top:0px;
	z-index:99999;
}

.upslide-thumbnailTitle {
	position:relative;
	top:20px;
	font-size:1.3em;
	font-weight:bold;
}
```

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

// show thumbnails of the slides
thumbnail: true,

// position of the thumbnails
thumbnailPosition: 'left',

// show the header text on the thumbnails
thumbnailHeader: false,

// border size (if any) of the thumbnails to adjust for the height of the slides
thumbnailBorderSize: '0',

// width of the thumbnails in relation to the parent of the slide (if fullscreen, then in relation to the width of the screen)
thumbnailWidth: '10%',

// desired height of the thumbnails
thumbnailHeight: 'auto',

// allow scrolling the thumbnails (does not control the slider, think of it as allowing you to browse)
thumbnailWrapperScrollable: false,

// thumbnail indicator options
thumbnailIndicator: {
	// speed at which it moves to the next slide
	speed: 2000,
	// effect to use for the transition
	easing: 'linear',
	// color for the slider (if "sameSlideAndHeaderColor" is true, then this gets ignored)
	backgroundColor: [],
	// width of the indidcator
	width: '2px',
	// position of the slider
	position: {
		// the side of the thumbnails it is on
		side: 'right',
		// put it on the inside of the thumbnail (overlap the thumbnail) or outside (show all of the thumbnail)
		inOrOut: 'in'
	}
},
// call a function when a slide slides
onSlide: function() { return false; },
// call a function when the slide starts to slide
onSlideStart: function() { return false; },
// call a function when the slide completes its slide
onSlideComplete: function() { return false; }
```
