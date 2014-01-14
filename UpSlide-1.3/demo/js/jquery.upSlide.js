/**
 * Name: upSlide.js
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
<div class="upSlide">
	<ul>	
		<li>
			<div style="display: block;background:url('img/slide1.jpg') no-repeat;background-position:center">
				<p>Slide 1 - This is the first slide!</p>
			</div>
		</li>
	</ul>
</div>
*/

;(function ($) {

	function init( obj, options ) {
		var _ = this;
		this.opts = $.extend({
			speed: 2000,
			delay: 3000,
			easing: 'linear',
			bsColorList: [],
			fadingHeaders: false,
			fadingHeadersSpeed: 2000,
			headerTransparency: 1,
			sameSlideAndHeaderColor: false,
			fullscreen: false,
			autoSlide: true,
			arrowControl: false,
			thumbnails: true,
			thumbnailsPosition: 'left',
			thumbnailWidth: '10%',
			thumbHeader: false,
			thumbBorderSize: '1',
			thumbIndicator: {
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
						
			if(_.opts.thumbnails){
				this.thumbnailWidthPX = $(window).width() * parseFloat( '.' + this.opts.thumbnailWidth );
				this.sliderWidth = parseInt( this.opts.thumbnailWidth );
				$('.' + this.thumbnailWrapper).css({
					'width': this.thumbnailWidthPX + 'px'
				});
			}
		
			if ( _.opts.fullscreen ){
				this.sliderWidth = parseInt( $(window).width() - this.thumbnailWidthPX );
				if(this.opts.thumbnailsPosition === 'right'){
					this.thumbnailMarginPX = '0';
				}
				else {
					this.thumbnailMarginPX = this.thumbnailWidthPX;
				}
				
				$(obj).parent().width( $(window).width() );
				$(obj).css({
					'margin-left': this.thumbnailMarginPX + 'px',
					'width': this.sliderWidth + 'px'
				});
				$(obj).parent().height( $(window).height() );
				this.slideHeight = $(window).height();
			}
			else {
				this.slideHeight = $(obj).height();
			}
			this.thumbnailHeight = ( ( this.slideHeight / this.numberOfSlides ) - this.opts.thumbBorderSize );
			console.log(this.thumbnailHeight)
		};
	
		this.resizePlugin = function(){
			console.log(this.thumbnailIndicator);
			this.calculateSizes();
			$('.' + this.thumbnailClass).height(this.thumbnailHeight);
			$('.' + this.thumbnailIndicator).height(this.thumbnailHeight);
			$(obj).parent().height(this.slideHeight);
			this.createSlides();
		};
		
		this.startTheCreationProcess = function() {
			
			$('.' + this.thumbnailWrapper).empty()
			this.numberOfSlides = 0;
			$(obj).children('li').each(function(i, e){
				var color = i === 2 ? 'white' : 'white';
				if(typeof _.opts.bsColorList[i] === 'undefined'){
					var r = Math.floor(Math.random() * 255) + 1;
					var g = Math.floor(Math.random() * 255) + 1;
					var b = Math.floor(Math.random() * 255) + 1;

					_.opts.bsColorList[i] = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + _.opts.headerTransparency + ')';
				}

				$(this).attr(this.slideNumber, i);

				if(_.opts.thumbnails){
					var thumbImage = $(this).css('background-image');
					_.createThumbnailAndAddToArray($(this), thumbImage, _.numberOfSlides);
				}

				_.numberOfSlides++;

				$(this).children('div').children('p').css({
					'background-color': _.opts.bsColorList[i],
					'color': color
				});


				_.slideTracker[i] = 0;
			});

			if(_.opts.thumbIndicator.position.side === 'left') {
				var positionValue = _.opts.thumbIndicator.position.inOrOut === 'out' ? '-' + _.opts.thumbIndicator.width : '0px';
				if( typeof this.opts.thumbIndicator.backgroundColor === 'object' ){
					var bgc = this.opts.thumbIndicator.backgroundColor[_.currentSlide];
				}
				else {
					var bgc = this.opts.thumbIndicator.backgroundColor;
				}

				this.newThumbIndicator = $('<div />', {
					class: this.thumbnailIndicator + ' upSlide-thumbIndicator'
				}).css({
					'background-color': bgc,
					'width': _.opts.thumbIndicator.width,
					'height': this.thumbnailHeight + 'px',
					'left': positionValue
				});
			}
			else {
				var positionValue = _.opts.thumbIndicator.position.inOrOut === 'out' ? '-' + _.opts.thumbIndicator.width : '0px';

				if( typeof this.opts.thumbIndicator.backgroundColor === 'object' ){
					var bgc = this.opts.thumbIndicator.backgroundColor[_.currentSlide];
				}
				else {
					var bgc = this.opts.thumbIndicator.backgroundColor;
				}
				this.newThumbIndicator = $('<div />', {
					class: this.thumbnailIndicator + ' upSlide-thumbIndicator'
				}).css({
					'background-color': bgc,
					'width': _.opts.thumbIndicator.width,
					'height': this.thumbnailHeight + 'px',
					'right': positionValue
				});
			}
			$('.' + this.thumbnailWrapper).append(this.newThumbIndicator);
		};
	
		this.createSlides = function(){
			this.slideLookup = [];
			
			$(obj).children('li').each(function(i, el){
				$(el).attr(_.slideNumber, i)
					.addClass(_.slideClass)
					.css({
						'width': '100%',
						'height': _.slideHeight + 'px',
						'float': 'left',
						'overflow': 'hidden'
					});
				_.slideLookup.push( $(el).offset().top - _.parentOffsetTop );
			});
			
			$('.' + this.thumbnailClass).height( this.thumbnailHeight );
		};
		
		this.createThumbnailAndAddToArray = function(obj, image, index){
			var header;
			if( _.opts.thumbHeader ){
				header = $(obj).children().children('.upSlide-bannerText').text();
			}
			else {
				header = '';
			}
			
			var newThumb = $('<div />', { 
				class: this.thumbnailClass + ' upSlide-thumbnail',
				title: $(obj).children().children('.upSlide-bannerText').text(),
				'data-title': $(obj).attr('data-title')
			})
			.attr(this.thumbnailSlideNumber, index)
			.html( '<span class="upSlide-thumbTitle textOutline">' + header + '</span>' )
			.css({
				'background-image': image,
				'background-size': '100% 100%',
				'background-position': '50%',
				'width': '100%;'
			}).height(this.thumbnailHeight);
			$('.' + this.thumbnailWrapper).append(newThumb);
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
//			$(obj).children('li').children().children('.upSlide-bannerText').eq(_.currentSlide).hide().fadeIn(_.opts.speed);
			$('.' + this.slideClass).each(function(i, el){
				if( parseInt( $(el).attr(_.slideNumber) ) !== _.currentSlide && parseInt( $(el).attr(_.slideNumber) ) !== _.previousSlide ) {
					$(el).children().children('.upSlide-bannerText').stop().hide();
				}
				else if (parseInt( $(el).attr(_.slideNumber) ) === _.currentSlide) {
					$(el).children().children('.upSlide-bannerText').stop().fadeIn(_.opts.fadingHeadersSpeed);
				}
			});
		};

		this.move = function( dir, animation ) {
			this.previousSlide = _.currentSlide;
			if( !isNaN( parseInt( dir ) ) ) {
				_.currentSlide = dir;
			}
			else {
				if( dir === 'down' ){
					_.currentSlide -= 1;
					if( _.currentSlide < 0 ){
						_.currentSlide = (_.numberOfSlides - 1);
					}
				}
				else if( dir === 'up' ){
					_.currentSlide += 1;
					if( _.currentSlide > _.numberOfSlides ){
						_.currentSlide = 0;
					}
				}
			}
			
			if( this.opts.thumbnails ){
				this.moveThumbnailToSlide(_.currentSlide);
			}
			this.moveToSlide(_.currentSlide, animation);

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
		
		this.moveThumbnailToSlide = function(slideNumber){
			var pos = $('[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]').offset().top - this.parentOffsetTop;
			
			if( typeof this.opts.thumbIndicator.backgroundColor === 'object' ){
				var bgc = this.opts.thumbIndicator.backgroundColor[slideNumber];
			}
			else {
				var bgc = this.opts.thumbIndicator.backgroundColor;
			}
			if( typeof bgc === 'undefined' ){
				bgc = this.opts.bsColorList[slideNumber];
			}
			$('.' + this.thumbnailIndicator).stop().animate({
					'top': ( pos - 1 ) + 'px',
					'background-color': bgc
				}, {
					easing: _.opts.thumbIndicator.easing,
					duration: _.opts.thumbIndicator.speed,
					queue: false
				});
			
		};
		
		var objParentID = $(obj).parent().attr('id');
		this.intervalVar;
		this.parentOffsetTop = $(obj).parent().offset().top;
		this.currentSlide = 0;
		this.previousSlide = 0;
		this.numberOfSlides = 0;
		this.slideClass = 'upSlide-slide_' + objParentID;
		this.slideNumber = 'data-slideNumber_' + objParentID;
		this.slideOffsetTop = 'data-offsetTop_' + objParentID;
		this.slideLookup;
		this.slides = [];
		this.thumbnailClass = 'thumb_' + objParentID;
		this.thumbnailSlideNumber = 'data-slideNumberThumb_' + objParentID;
		this.thumbnailWrapper = 'thumbnailWrapper_' + objParentID;
		this.thumbnailIndicator = 'thumbnailIndicator_' + objParentID;
		this.slideThumbnails = [];
		this.thumbnailHeight;
		this.thumbnailWidthPX;
		this.thumbnailMarginPX;
		this.newThumbIndicator;
		this.maxTop = 0;
		this.firstSlideTopPosition = $(obj).children('li:first-child').offset().top;
		this.slideTracker = [];
		
		if(_.opts.thumbnails){
			this.thumbnailWidthPX = $(window).width() * parseFloat( '.' + this.opts.thumbnailWidth );
			$(obj).parent().prepend($('<div />', {
					class: 'upSlide-thumbnailWrapper ' + this.thumbnailWrapper
				}).css(this.opts.thumbnailsPosition, '0px',{
					'width': this.thumbnailWidthPX + 'px'
				})
			);
		}
		
		if ( _.opts.fullscreen ){
			this.sliderWidth = parseInt( $(window).width() - this.thumbnailWidthPX );
			if(this.opts.thumbnailsPosition === 'right'){
				this.thumbnailMarginPX = '0';
			}
			else {
				this.thumbnailMarginPX = this.thumbnailWidthPX;
			}
			$(obj).parent().width( $(window).width() );
			$(obj).css({
				'margin-left': this.thumbnailMarginPX + 'px',
				'width': this.sliderWidth + 'px'
			});
			$(obj).parent().height( $(window).height() );
			this.slideHeight = $(window).height();
		}
		else {
			this.slideHeight = $(obj).height();
		}
		
		if( this.opts.sameSlideAndHeaderColor && this.opts.headerTransparency !== 0 ) {
			if( _.opts.bsColorList.length === 0 && _.opts.thumbIndicator.backgroundColor.length !== 0) {
				_.opts.bsColorList = _.opts.thumbIndicator.backgroundColor;
			}
			else if( _.opts.bsColorList.length === 0 && _.opts.thumbIndicator.backgroundColor.length !== 0) {
				_.opts.bsColorList = _.opts.thumbIndicator.backgroundColor;
			}
		}
	
		this.startTheCreationProcess();

		for(var i = 0; i < this.slideThumbnails.length; i++){
			$('.' + this.thumbnailWrapper).append(this.slideThumbnails[i]);
		}		

		$(obj).children('li').each(function(i, el){
			$(el).attr(_.slideNumber, i);
			_.slides.push(el);
			_.maxTop += $(el).height();
		});

		this.calculateSizes();
		this.createSlides();
		this.resizePlugin();
			
		/**
		 * 
		 * Friendly check if plugin isn't fullscreen to make sure you set a height
		 * 
		 */
		if( this.slideHeight === 0 ){
			alert('If you don\'t want the plugin to be fullscreen make sure you set a height for the parent of the <ul> it in your css!\n\n The current height for the slides is: ' + this.slideHeight + 'px.');
		}
		

		$('.prev').on('click', function(){
			_.move('down');
		});
		$('.next').on('click', function(){
			_.move('up');
		});

		if( _.opts.arrowControl ){
			$('body').keydown(function(e){
				var code = e.keyCode || e.which;
				if( code !== 116 ){
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
		
		if( _.opts.scrollControl ){
			
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

		if( _.opts.autoSlide ){
			this.start();
		}
		
	};
	
	$.fn.upSlide = function( options ){
		return new init( this, options );
	};

})( jQuery );