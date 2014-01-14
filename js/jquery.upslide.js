/**
 * Name: upslide.js
 * Author: Michael Dahlke
 * Contact: madahlke27@gmail.com
 * Date: 1/5/2013
 * Description: 
 *		UpSlide.js is a jQuery plugin for any and all to use. I only ask that
 *		this comment remains intact because even though I am allowing you to
 *		use my code, I do want the credit for my time and effort.
 *		Other than that enjoy! 
 *		
 *		If you run into trouble you may email me
 *			Make sure you put UpSlider.js in the subject
 *			
 */
/*
 * HTML must be formatted like the following...( class names can differ )
<div class="upslide">
	<ul>	
		<li style="display: block;background:url('img/slide1.jpg') no-repeat;background-position:center">
			<div>
				<p>Slide 1 - This is the first slide!</p>
			</div>
		</li>
	</ul>
</div>
*/

;(function ($) {
	
	function generateColor(t){
		var r = Math.floor(Math.random() * 255) + 1;
		var g = Math.floor(Math.random() * 255) + 1;
		var b = Math.floor(Math.random() * 255) + 1;

		return 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + t + ')';
	}

	function init( obj, options ) {
		var _ = this;
		this.opts = $.extend({
			speed: 2000,
			delay: 3000,
			easing: 'linear',
			fadingHeaders: false,
			fadingHeadersSpeed: 2000,
			headerHideText: false,
			headerBackgroundTransparency: 0.5,
			headerBackgroundColor: ['red', 'green'],
			headerGenerateBackgroundColor: true,
			sameSlideAndHeaderColor: true,
			fullscreen: false,
			autoSlide: true,
			arrowControl: false,
			scrollControl: false,
			thumbnail: true,
			thumbnailPosition: 'left',
			thumbnailHeader: false,
			thumbnailBorderSize: '0',
			thumbnailWidth: '10%',
			thumbnailHeight: 'auto',
			thumbnailWrapperScrollable: false,
			thumbnailIndicator: {
				speed: 2000,
				easing: 'linear',
				backgroundColor: [],
				width: '2px',
				position: {
					side: 'right',
					inOrOut: 'in'
				}
			},
			onSlide: function() { return false; },
			onSlideStart: function() { return false; },
			onSlideComplete: function() { return false; }
		}, options);
		
		this.calculateSizes = function(){
		
			if ( _.opts.fullscreen ){
				$(obj).parent().width( $(window).width() );
				$(obj).parent().height( $(window).height() );
				this.slideHeight = $(window).height();
				this.slideWidth = $(window).width();			
				this.slideWrapperWidth = $(window).width();
				
				if(this.opts.thumbnail){
					this.thumbnailWrapperHeight = $(window).height();				
					this.thumbnailWrapperWidth = ( $(window).width() * (parseFloat(this.opts.thumbnailWidth) / 100) );
				}
				
				this.slideHeight = $(window).height();
				this.slideWidth = this.slideWrapperWidth - this.thumbnailWrapperWidth;

				if( this.opts.thumbnailHeight === 'auto' || !this.thumbnailWrapperScrollable){
					this.thumbnailHeight = ( ( this.slideHeight / this.numberOfSlides ) - this.opts.thumbnailBorderSize );
					console.log(this.thumbnailHeight);
					console.log(this.slideHeight);
					console.log(this.numberOfSlides);
					console.log(this.opts.thumbnailBorderSize);
				}
				else {
					this.thumbnailHeight = this.opts.thumbnailHeight;
				}

			}
			else {
				this.slideWrapperWidth = $(obj).parent().width();
				if(this.opts.thumbnail){
					this.thumbnailWrapperHeight = $(obj).height();
					this.thumbnailWrapperWidth = ( $(obj).parent().width() * (parseFloat(this.opts.thumbnailWidth) / 100) );
				}
				this.slideHeight = $(obj).height();
				this.slideWidth = this.slideWrapperWidth - this.thumbnailWrapperWidth;
				
				if( this.opts.thumbnailHeight === 'auto' || !this.thumbnailWrapperScrollable){
					this.thumbnailHeight = ( ( this.slideHeight / this.numberOfSlides )  - this.opts.thumbnailBorderSize  );
				}
				else {
					this.thumbnailHeight = this.opts.thumbnailHeight;
				}
			}
			
			if(this.opts.thumbnailPosition === 'right'){
				this.thumbnailMargin = '0';
			}
			else {
				this.thumbnailMargin = this.thumbnailWrapperWidth;
			}
			
			if(_.opts.thumbnail){
				this.thumbnailWidthPX = $(window).width() * parseFloat( '.' + this.opts.thumbnailWidth );
				this.sliderWidth = parseInt( this.opts.thumbnailWidth );
			}
			
			this.thumbnailWrapperHeight = this.slideHeight;
			this.thumbnailWidth = ( ( this.slideWidth / this.numberOfSlides ) );
		};
	
		this.resizePlugin = function(){
			this.calculateSizes();

			if(this.opts.thumbnail){
				this.createThumbnailWrapper();
			}

			this.startTheCreationProcess();
			this.createSlides();

			if(this.opts.thumbnail){
				this.createThumbnailAndAddToArray();
				}
			if(this.opts.thumbnail){
				this.createThumbnailIndicator();
			}
		};
		
		this.startTheCreationProcess = function() {
		
		if(_.opts.thumbnail){
			$('.' + this.thumbnailWrapper).empty();
		}
		$(obj).css({
			'margin-left': this.thumbnailMargin + 'px',
			'width': this.slideWrapperWidth + 'px'
		});

		};
			
		this.createThumbnailWrapper = function(){
			var overflow = this.opts.thumbnailWrapperScrollable === true ? 'auto' : 'hidden';
			if( $('.' + this.thumbnailWrapper).length === 0 ){
				$(obj).parent().prepend($('<div />', {
						class: 'upslide-thumbnailWrapper ' + this.thumbnailWrapper
					}).css({
						'width': this.thumbnailWrapperWidth + 'px', 
						'height': this.thumbnailWrapperHeight + 'px',
						'overflow': overflow
					}).css(_.opts.thumbnailPosition, '0px')
				);
			}
			else {
				var overflow = this.opts.thumbnailWrapperScrollable === true ? 'auto' : 'hidden';
				$('.' + this.thumbnailWrapper).css({
					'width': this.thumbnailWrapperWidth + 'px', 
					'height': this.thumbnailWrapperHeight + 'px',
					'overflow': overflow
				});
			}
		};
		
		this.createThumbnailIndicator = function(){
			var bgc, positionValue;
			if(_.opts.thumbnailIndicator.position.side === 'left') {
				positionValue = _.opts.thumbnailIndicator.position.inOrOut === 'out' ? '-' + _.opts.thumbnailIndicator.width : '0px';
				if( typeof this.opts.thumbnailIndicator.backgroundColor === 'object' ){
					bgc = this.opts.thumbnailIndicator.backgroundColor[_.currentSlide];
				}
				else {
					bgc = this.opts.thumbnailIndicator.backgroundColor;
				}

				this.newThumbnailIndicator = $('<div />', {
					class: this.thumbnailIndicator + ' upslide-thumbnailIndicator'
				}).css({
					'background-color': bgc,
					'width': _.opts.thumbnailIndicator.width,
					'height': this.thumbnailHeight + 'px',
					'left': positionValue
				});
			}
			else {
				positionValue = _.opts.thumbnailIndicator.position.inOrOut === 'out' ? '-' + _.opts.thumbnailIndicator.width : '0px';

				if( typeof this.opts.thumbnailIndicator.backgroundColor === 'object' ){
					bgc = this.opts.thumbnailIndicator.backgroundColor[_.currentSlide];
				}
				else {
					bgc = this.opts.thumbnailIndicator.backgroundColor;
				}
				this.newThumbnailIndicator = $('<div />', {
					class: this.thumbnailIndicator + ' upslide-thumbnailIndicator'
				}).css({
					'background-color': bgc,
					'width': _.opts.thumbnailIndicator.width,
					'height': this.thumbnailHeight + 'px',
					'right': positionValue
				});
			}
			$('.' + this.thumbnailWrapper).append(this.newThumbnailIndicator);
		};
		
		this.createSlides = function(backupText){
			this.thumbnailsObject = [];
			this.slideLookup = [];
			$('.' + this.thumbnailWrapper).empty();
			var hci = 0;
			$(obj).children('li').each(function(i, el){
				
				var color = i === 2 ? 'white' : 'white';
				if( typeof _.opts.headerBackgroundColor[hci] === 'undefined' ){
					if( _.opts.headerGenerateBackgroundColor ){
						_.opts.headerBackgroundColor.push( generateColor(_.opts.headerBackgroundTransparency) );
					}
					else {
						hci = 0;
					}
				}

				$(el).attr(_.slideNumber, i)
					.addClass(_.slideClass)
					.css({
						'width': _.slideWidth,
						'height': _.slideHeight + 'px',
						'overflow': 'hidden'
					});
				_.slideLookup.push( $(el).offset().top - _.parentOffsetTop );
				
				_.thumbnailsObject.push({
					clone: $(this)[0],
					image: $(this).css('background-image') || $(this).css('background-color'),
					index: i
				});
				if(_.opts.headerHideText && backupText) {
					_.backupText.push( $(el).children().children('.upslide-bannerText').text() );
					$(el).children().children('.upslide-bannerText').text("");
				}

				if( typeof _.thumbnailsObject.backupText === 'undefined' ){
					_.thumbnailsObject[i].backupText = _.backupText[i];
				}
				$(el).children('div').children('.upslide-bannerText').css({
					'background-color': _.opts.headerBackgroundColor[hci],
					'color': color
				});

				_.slideTracker[i] = 0;
				hci++;
			});
			$('.' + this.thumbnailWrapper).append(this.newThumbnailIndicator);
			
			
		};
		
		this.createThumbnailAndAddToArray = function(){
			for(var i = 0, thumbs = this.thumbnailsObject; i < thumbs.length; i++){
				var thumb = thumbs[i];
				var header;
				
				if( _.opts.thumbnailHeader && typeof $(thumb.clone).children().children('.upslide-bannerText').text() !== 'undefined'){
					header = $(thumb.clone).children().children('.upslide-bannerText').text();
				}
				else {
					header = '';
				}
				
				if(this.opts.headerHideText){
					header = header === '' ? thumb.backupText : header;
				}
				var newThumb = $('<div />', { 
					class: this.thumbnailClass + ' upslide-thumbnail',
					title: header,
					'data-title': $(thumb.clone).attr('data-title')
				})
				.attr(this.thumbnailSlideNumber, thumb.index)
				.html( '<span class="upslide-thumbnailTitle textOutline">' + header + '</span>' )
				.css({
					'background-image': thumb.image,
					'background-size': '100% 100%',
					'background-position': '50%',
					'float': 'left'
				}).height(this.thumbnailHeight);
				$('.' + this.thumbnailWrapper).append(newThumb);
			}
		};

		this.start = function(){
			this.interval( 'start' );
		};
		this.stop = function(){
			this.interval( 'stop' );
		};

		this.interval = function( action ){
			if(action === 'start') {
				this.intervalVar = setInterval(
					function(){
						_.move( "up" );
					}, _.opts.delay);
			}
			else {
				clearInterval( this.intervalVar );
			}

		};
		
		this.fadingHeaders = function( ) {
			$('.' + this.slideClass).each(function(i, el){
				if( parseInt( $(el).attr(_.slideNumber) ) !== _.currentSlide && parseInt( $(el).attr(_.slideNumber) ) !== _.previousSlide ) {
					$(el).children().children('.upslide-bannerText').stop().hide();
				}
				else if (parseInt( $(el).attr(_.slideNumber) ) === _.currentSlide) {
					$(el).children().children('.upslide-bannerText').stop().fadeIn(_.opts.fadingHeadersSpeed);
				}
			});
		};

		this.move = function( dir, animation ) {
			this.previousSlide = _.currentSlide;
			if( !isNaN( parseInt( dir ) ) ) {
				this.currentSlide = dir;
			}
			else {
				if( dir === 'down' ){
					_.currentSlide -= 1;
					if( this.currentSlide < 0 ){
						this.currentSlide = (_.numberOfSlides - 1);
					}
				}
				else if( dir === 'up' ){
					_.currentSlide += 1;
					if( this.currentSlide >= _.numberOfSlides ){
						this.currentSlide = 0;
					}
				}
			}
			
			if( this.opts.thumbnail ){
				this.moveThumbnailToSlide(this.currentSlide);
			}
			this.moveToSlide(this.currentSlide, animation);

			return this;
		};

		this.moveToSlide = function( number, animation ){
			var pos = _.slideLookup[number];
			if(typeof animation === 'undefined'){
				animation = true;
			}
			else {
				animation = false;
			}
			var duration = animation === false ? 0: this.opts.speed;
			
			$(obj).stop().animate({
				'top': '-' + pos + 'px',
				'opacity': 1
			}, {
				easing: _.opts.easing,
				duration: duration,
				start: function(){
					if(_.opts.fadingHeaders){
						_.fadingHeaders();
					}
					_.stop();
					_.opts.onSlideStart();
				},
				complete: function() {
					if(_.opts.autoSlide){
						_.start();
					}
					_.slideTracker[_.currentSlide]++;
					_.opts.onSlideComplete();
				},
				always: function(){
					_.opts.onSlide();
				},
				queue: false
			});
		};
		
		this.moveThumbnailToSlide = function( slideNumber, animation ){
			var pos = $('*[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]').offset().top - this.parentOffsetTop;
			var bgc;
			if( typeof this.opts.thumbnailIndicator.backgroundColor === 'object' ){
				bgc = this.opts.thumbnailIndicator.backgroundColor[slideNumber];
			}
			else {
				bgc = this.opts.thumbnailIndicator.backgroundColor;
			}
			if( typeof bgc === 'undefined' ){
				bgc = this.opts.headerBackgroundColor[slideNumber];
			}
			if(typeof animation === 'undefined'){
				animation = true;
			}
			else {
				animation = false;
			}
			var duration = animation === false ? 0: this.opts.speed;
		$('.' + this.thumbnailIndicator).stop().animate({
					'top': ( pos - 1 ) + 'px',
					'background-color': bgc
				}, {
					easing: _.opts.thumbnailIndicator.easing,
					duration: _.opts.thumbnailIndicator.speed,
					queue: false
				});
			
		};
		
		this.objParentID = typeof $(obj).parent().attr('id') === 'undefined' ? Math.round(Math.random(1 * 100)) + 1 : $(obj).parent().attr('id');
		this.intervalVar = "";
		this.slideWrapperWidth = 0;
		this.parentOffsetTop = $(obj).parent().offset().top;
		this.currentSlide = 0;
		this.previousSlide = 0;
		this.numberOfSlides = $(obj).children('li').length;
		this.slideClass = 'upslide-slide_' + this.objParentID;
		this.slideNumber = 'data-slideNumber_' + this.objParentID;
		this.slideOffsetTop = 'data-offsetTop_' + this.objParentID;
		this.slideLookup = [];
		this.slides = [];
		this.backupText = [];
		this.thumbnailsObject = [];
		this.thumbnailClass = 'thumb_' + this.objParentID;
		this.thumbnailSlideNumber = 'data-slideNumberThumb_' + this.objParentID;
		this.thumbnailWrapper = 'thumbnailWrapper_' + this.objParentID;
		this.thumbnailIndicator = 'thumbnailIndicator_' + this.objParentID;
		this.slideThumbnails = [];
		this.thumbnailHeight = 0;
		this.thumbnailWidth = 0;
		this.thumbnailMargin = 0;
		this.newThumbnailIndicator = "";
		this.maxTop = 0;
		this.slideTracker = [];
		
		console.log($(obj).parent().offset());
		if( this.opts.sameSlideAndHeaderColor ) {
			if( this.opts.headerBackgroundColor.length !== 0 ) {
				this.opts.thumbnailIndicator.backgroundColor = this.opts.headerBackgroundColor;
			}
			else if( _.opts.headerBackgroundColor.length === 0 && this.opts.thumbnailIndicator.backgroundColor.length !== 0) {
				this.opts.headerBackgroundColor = this.opts.thumbnailIndicator.backgroundColor;
			}
			else {
				this.opts.headerBackgroundColor = [];
			}
		}
		
		this.calculateSizes();
		
		if(this.opts.thumbnail){
			this.createThumbnailWrapper();
		}
		
		this.startTheCreationProcess();
		this.createSlides(true);
		
		if(this.opts.thumbnail){
			this.createThumbnailAndAddToArray();
			}
		if(this.opts.thumbnail){
			this.createThumbnailIndicator();
		}


		/**
		 * 
		 * Friendly check if plugin isn't fullscreen to make sure you set a height
		 * 
		 */
		if( this.slideHeight === 0 ){
			alert('If you don\'t want the plugin to be fullscreen make sure you set a height for the parent of the <ul> it in your css!\n\n The current height for the slides is: ' + this.slideHeight + 'px.');
		}
		
		/***********************************************************************
		 * 
		 *							EVENT HANDLERS
		 * 
		 **********************************************************************/
		$('.prev').on('click', function(){
			_.move('down');
		});
		$('.next').on('click', function(){
			_.move('up');
		});

		if( this.opts.arrowControl ){
			$('body').keydown(function(e){
				var code = e.keyCode || e.which;
				if( code === 38 || code === 40 ){
					e.preventDefault();
				}
				if ( code === 38){
					_.move('down');
				}
				else if ( e.keyCode === 40){
					_.move('up');
				}
			});
		}
		
		if( this.opts.scrollControl ){
			
			$('.' + this.thumbnailClass).mousewheel(function(e,d){
				e.preventDefault();
				d = d < 0 ? 'up' : 'down';
				_.move(d);
			});
		}

		$(document).on('click', '.' + this.thumbnailClass, function(e){
			e.preventDefault();
			_.move( parseInt( $(this).attr(_.thumbnailSlideNumber) ) );
		});

		$(window).resize(function(){
			$(obj).css({
				'top': '0px'
			});
			_.resizePlugin();
			_.move(_.currentSlide, false);
		});

		if( this.opts.autoSlide ){
			this.start();
		}
		
		return this;
	}
	
	$.fn.upslide = function( options ){
		 return new init( this, options );
	};

})( jQuery );