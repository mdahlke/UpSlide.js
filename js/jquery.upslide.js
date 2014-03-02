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
	function generateColor(ht, tt){
		var r = Math.floor(Math.random() * 255) + 1;
		var g = Math.floor(Math.random() * 255) + 1;
		var b = Math.floor(Math.random() * 255) + 1;
		return { 'header': 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + ht + ')', 'indicator': 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + tt + ')' };
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
			headerBackgroundColor: [],
			headerGenerateBackgroundColor: true,
			sameSlideAndHeaderColor: true,
			fullscreen: false,
			autoSlide: true,
			arrowControl: false,
			scrollControl: false,
			transition: {
				effect: 'slide',
				from: 'bottom'
			},
			thumbnail: {
				show: true,
				position: 'left',
				header: false,
				width: '10%',
				height: 'auto',
				scrollable: false
			},
			indicator: {
				speed: 2000,
				easing: 'linear',
				backgroundColor: [],
				width: '2px',
				transparency: '0.5',
				position: {
					side: 'right',
					inOrOut: 'in'
				}
			},
			ulAlternative: 'ul',
			liAlternative: 'li',
			onSlide: function() { return false; },
			onSlideStart: function() { return false; },
			onSlideComplete: function() { return false; }
		}, options);

		
		this.objParentID = typeof $(obj).parent().attr('id') === 'undefined' ? Math.round(Math.random(1 * 100)) + 1 : $(obj).parent().attr('id');
		this.parentOffsetTop = $(obj).parent().offset().top;
		this.slideWrapperClass = 'upslide-slideWrapper';
		this.slideClass = 'upslide-slide';
		this.childSlideClass = 'upslide-childSlide';
		this.slideNumber = 'data-slideNumber';
		this.childSlideNumber = 'data-childSlideNumber';
		this.slideOffsetTop = 'data-offsetTop';
		this.thumbnailClass = 'upslide-thumbnail';
		this.thumbnailChildClass = 'upslide-thumbnailChild';
		this.thumbnailSlideNumber = 'data-slideNumberThumb';
		this.thumbnailWrapperClass = 'upslide-thumbnailWrapper';
		this.thumbnailChildWrapperClass = 'upslide-thumbnailChildWrapper';
		this.indicator = 'upslide-indicator';
		this.intervalVar = "";
		this.slideWrapperWidth = 0;
		this.currentSlide = 0;
		this.currentChildSlide = 0;
		this.currentChildSlide = 0;
		//this.numberOfSlides = $(obj).children(this.opts.liAlternative).length;
		this.slideLookup = [];
		this.slides = [];
		this.childSlides = [];
		this.backupText = [];
		this.thumbnailsObject = [];
		this.thumbnailsChildObject = [];
		this.slideThumbnails = [];
		this.thumbnailHeight = 0;
		this.thumbnailWidth = 0;
		this.thumbnailMargin = 0;
		this.thumbnailIndicatorOffset = 0;
		this.newThumbnailIndicator = "";
		this.maxTop = 0;
		this.slideTracker = [];
		this.slideProps = {};

		this.calculateSizes = function(){

			if ( this.opts.fullscreen ){
				this.height = $(window).height();
				this.width = $(window).width();
				this.thumbnailWrapperWidth = ( $(window).width() * (parseFloat(this.opts.thumbnail.width) / 100) );
				this.slideWrapperWidth = $(window).width() - this.thumbnailWrapperWidth;

				this.thumbnailBorderWidth = parseInt( $(obj).children().first().css('border-bottom-width') );

				if( this.opts.thumbnail.height === 'auto' || !this.opts.thumbnail.scrollable){
					this.thumbnailHeight = ( ( this.slideHeight / this.numberOfSlides ) - this.thumbnailBorderWidth );
				}
				else {
					this.thumbnailHeight = this.opts.thumbnail.height;
				}

			}
			else {
				this.height = $(obj).parent().height();
				this.width = $(obj).parent().width();
				this.thumbnailWrapperWidth = ( $(obj).parent().width() * (parseFloat(this.opts.thumbnail.width) / 100) );
				this.slideWrapperWidth = $(obj).parent().width() - this.thumbnailWrapperWidth;

				if( this.opts.thumbnail.height === 'auto' || !this.opts.thumbnail.scrollable){
					this.thumbnailHeight = ( ( this.slideHeight / this.numberOfSlides )  - this.thumbnailBorderWidth  );
				}
				else {
					this.thumbnailHeight = this.opts.thumbnail.height;
				}
			}

			this.slideProps.height = this.height;
			this.slideProps.width = this.width;

			if( this.opts.indicator.position.side === 'left' ){
				this.thumbnailIndicatorOffset = '0px';
			}
			else {
				this.thumbnailIndicatorOffset = this.thumbnailWrapperWidth - parseInt( this.opts.indicator.width );
			}

			this.thumbnailMargin = this.opts.thumbnail.position === 'right' ? '0' : this.thumbnailWrapperWidth;

			if(_.opts.thumbnail.show){
				this.thumbnailWidthPX = $(window).width() * parseFloat( '.' + this.opts.thumbnail.width );
				this.sliderWidth = parseInt( this.opts.thumbnail.width );
			}

		};

		this.startTheCreationProcess = function() {
			var slideWrapper, thumbnailWrapper;

			// Create the thumbnail wrapper
			if(_.opts.thumbnail.show){
				$('.' + this.thumbnailWrapperClass).empty();

				var attr = {
					scrollable: this.opts.thumbnail.scrollable,
					class: this.thumbnailWrapperClass,
					position: _.opts.thumbnail.position,
					css: {
						width: this.thumbnailWrapperWidth,
						height: $(obj).height()
					}
				};

				this.thumbnailWrapper = new ThumbnailWrapper( attr );

			}

			// Create the slide wrapper
			attr = {
				class: this.slideWrapperClass,
				css: {
					'top': '0',
					'margin-left': this.thumbnailMargin + 'px',
					'width': this.slideWrapperWidth + 'px'
				}
			};
			this.slideWrapper = new SlideWrapper( attr );

			$(obj).parent().css({
				'width': this.width + 'px',
				'height': this.height + 'px'
			});

			this.createSlides();

			$(obj).parent('.upslide').append( this.thumbnailWrapper, this.slideWrapper ).children('ul').remove();

			this.createIndicator()

			console.log(this.thumbnailIndicatorOffset);

		};

		this.createIndicator = function(){
			var bgc, positionValue;
			var borderWidth = this.thumbnailBorderWidth || 0;
			this.indicatorHeight = parseInt(this.thumbnailHeight) - borderWidth;
				positionValue = _.opts.indicator.position.inOrOut === 'out' ? '-' + _.opts.indicator.width : '0px';
				if( typeof this.opts.indicator.backgroundColor === 'object' ){
					bgc = this.opts.indicator.backgroundColor[_.currentSlide];
				}
				else {
					bgc = this.opts.indicator.backgroundColor;
				}
				this.newThumbnailIndicator = $('<div />', {
					class: this.indicator + ' upslide-indicator'
				}).css({
					'background-color': bgc,
					'width': _.opts.indicator.width,
					'height': this.indicatorHeight,
					'left': this.thumbnailIndicatorOffset + 'px'
				});


			$('.' + this.thumbnailWrapperClass).append(this.newThumbnailIndicator);
		};

		this.createSlides = function(){
			$('.' + this.thumbnailWrapperClass).empty();
			$('.' + this.thumbnailChildWrapperClass).empty();
			var backgroundColors;

			var slideNumber = 0;

			this.thumbnailsObject = [];
			this.childThumbnails = [];
			this.slideLookup = [];
			this.slides = [];
			this.childSlidesRelatedToParent = [];

			$(obj).children(this.opts.liAlternative).each(function( i, el ){
				// figure out background colors for headers
				if( typeof _.opts.headerBackgroundColor[slideNumber] === 'undefined' ){
					if( _.opts.headerGenerateBackgroundColor ){
						backgroundColors = generateColor(_.opts.headerBackgroundTransparency, _.opts.indicator.transparency);
						_.opts.headerBackgroundColor.push( backgroundColors.header );
						_.opts.indicator.backgroundColor.push( backgroundColors.indicator );
					}
				}

				// create slides and push them to an array
				var slideAttributes = {
					class: _.slideClass,
					index: slideNumber,
					css: {
						backgroundColor: _.opts.headerBackgroundColor[slideNumber]
					},
					text: ''
				};
				var slide = new Slide( el, slideAttributes ),
					thumbnailText = $(slide.element).children('div').children('.upslide-bannerText').text(),
					thumbnailAttributes = {
						name: _.thumbnailSlideNumber,
						value: slideNumber,
						class: _.thumbnailClass,
						css: {
							backgroundImage: $(slide.element).css('background-image'),
							height: _.opts.thumbnail.height
						},
						text: thumbnailText
					},
					slideThumbnail = new Thumbnail( thumbnailAttributes );
				_.thumbnailWrapper.append( $(slideThumbnail) );

				_.slides.push( slide );

				// check if they have child slides
				if( $(el).children().hasClass('upslideHorizontal') ) {
					_.thumbnailsChildObject[i] = [];
					_.childSlidesRelatedToParent[i] = [];

					var thumbnailWrapperAttributes = {
						scrollable: _.opts.thumbnail.scrollable,
						class: _.thumbnailChildWrapperClass,
						position: _.opts.thumbnail.position,
						css: {
							width: _.thumbnailWrapperWidth,
							height: '60px'
						}
					};
					var thumbnailWrapper = new ThumbnailWrapper( thumbnailWrapperAttributes ),
						numberOfChildren = $(el).children('.upslideHorizontal').children('li').length,
						childWidth = _.thumbnailWrapperWidth / numberOfChildren;

					$(el).children('.upslideHorizontal').children().each(function(ii, e) {
						slideNumber++;
						if( typeof _.opts.headerBackgroundColor[slideNumber] === 'undefined' ){
							if( _.opts.headerGenerateBackgroundColor ){
								backgroundColors = generateColor(_.opts.headerBackgroundTransparency, _.opts.indicator.transparency);
								_.opts.headerBackgroundColor.push( backgroundColors.header );
								_.opts.indicator.backgroundColor.push( backgroundColors.indicator );
							}
						}

						var childAttributes = {
							class: _.slideClass,
							index: slideNumber,
							css: {
								backgroundColor: _.opts.headerBackgroundColor[slideNumber]
							},
							text: ''
						};
						var childSlide = new Slide( e, childAttributes, true );
						var thumbAttributes = {
							name: _.thumbnailSlideNumber,
							value: slideNumber,
							class: _.thumbnailChildClass,
							css: {
								backgroundImage: $(childSlide.element).css('background-image'),
								height: '100%',
								width: childWidth + 'px'
							},
							text: '',
							headerBackgroundColor: _.opts.headerBackgroundColor[slideNumber]
						};


						var childThumbnail = new Thumbnail(thumbAttributes, true);

						_.childThumbnails.push( childThumbnail );

						_.slides.push( childSlide );
						_.slideWrapper.append( childSlide.element );
						thumbnailWrapper.append( childThumbnail );

					});

					$(slideThumbnail).append( thumbnailWrapper );

				}

				_.slideWrapper.append( slide.element );
				 slideNumber++;
			});

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
						_.move(  );
					}, _.opts.delay);
			}
			else {
				clearInterval( this.intervalVar );
			}

		};

		this.move = function( dir, animation ) {
			var nextSlide,
				previousSlideNumber = this.currentSlide;
			this.previousSlide = this.slides[previousSlideNumber].element;
			
			if( typeof dir === 'undefined' || 
				( dir !== 'next' && dir !== 'prev' && isNaN(dir) ) ){
				dir = 'next';
			}

			if( !isNaN( dir ) ) {
				this.currentSlide = dir;
				this.moveToSlide(this.currentSlide, animation);
				if( this.opts.thumbnail.show ){
					this.moveThumbnailToSlide(this.currentSlide);
				}
			}
			else {
				if( dir === 'next' ){
					this.currentSlide += 1;
					if( this.currentSlide >= this.slides.length ){
						this.currentSlide = 0;
					}
					nextSlide = this.currentSlide;
					this.currentChildSlide = 0;
				}
				else if( dir === 'prev' ){
					this.currentSlide -= 1;
					if( this.currentSlide < 0 ){
						this.currentSlide = (this.slides.length - 1);
					}
					nextSlide = this.currentSlide;
				}

				if( this.currentSlide !== previousSlideNumber ){
					this.moveToSlide(this.currentSlide, animation);
					if( this.opts.thumbnail.show ){
						this.moveThumbnailToSlide(this.currentSlide);
					}
				}
			}

			return this;
		};

		this.moveToSlide = function( number, animation ){

			_.stop();
			var duration,
				bannerText,
				el = _.slides[number].element,
				effect = $(el).attr('data-effect') || 'slide',
				from = $(el).attr('data-from') || 'bottom',
				getProps = returnEffectsAndAnimations(this.slideProps, effect, from),
				css = getProps.css,
				anim = getProps.anim,

			bannerText = $(el).children().children('.upslide-bannerText')[0];

			animation = typeof animation === 'undefined' ? true : false;
			duration = animation === false ? 0: this.opts.speed;

			
			$(el).stop().css(css).animate(anim, {
				easing: _.opts.easing,
				duration: duration,
				start: function(){
					if(_.opts.fadingHeaders){
						fadeInElement( bannerText, _.opts.fadingHeadersSpeed );
					}
					if( effect === 'slide' ){
						var pos;
						if( from === 'bottom' ){
							pos = '-' + this.height + 'px';
						}
						else if( from === 'top' ) {
							pos = this.height + 'px';
						}
						$( this.previousSlide ).animate({
							top: pos
						}, {
							duration: _.opts.speed
						});
					}
					$(_.previousSlide).css({
						zIndex: '1'
					});
					_.opts.onSlideStart();
				},
				complete: function() {
					_.slideTracker[_.currentSlide]++;
					_.opts.onSlideComplete();
					$(_.previousSlide).css({
						display: 'none',
						zIndex: '-1'
					});

				},
				always: function(){
					_.opts.onSlide();
				},
				queue: false
			});
			if(_.opts.autoSlide){
				_.start();
			}
		};

		this.moveThumbnailToSlide = function( slideNumber, animation ){
			var pos, bgc, anim, duration;
			var thumb = $('*[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]');
			var isChild = this.slides[slideNumber].child;
			
			bgc = typeof this.opts.indicator.backgroundColor === 'object' ? this.opts.indicator.backgroundColor[slideNumber] : this.opts.indicator.backgroundColor;
			if( typeof bgc === 'undefined' ){
				bgc = this.opts.headerBackgroundColor[slideNumber];
			}
			
			animation = typeof animation === 'undefined' ? true : false;			
			duration = animation === false ? 0: this.opts.speed;

			if( isChild ){
				pos = thumb.offset().top - this.parentOffsetTop + $('*[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]').parent().parent().parent().scrollTop();
				var thumbOffset = thumb.offset().left - thumb.parent().parent().offset().left;
				anim = {
					top: ( pos - 1 ) + 'px',
					backgroundColor: bgc,
					left: thumbOffset + 'px',
					width: thumb.width(),
					height: this.opts.indicator.width
				};
				anim[this.opts.indicator.position.side] = thumb.offset()[this.opts.indicator.position.side];
			}
			else {
				pos = thumb.offset().top - this.parentOffsetTop + $('*[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]').parent().scrollTop();
				anim = {
					top: ( pos - 1 ) + 'px',
					backgroundColor: bgc,
					left: this.thumbnailIndicatorOffset,
					width: this.opts.indicator.width,
					height: this.thumbnailHeight
				};

			}

			$('.' + this.indicator).stop()
				.css(this.opts.indicator.position.side, '0px')
				.animate(anim, {
					easing: _.opts.indicator.easing,
					duration: duration,
					queue: true
				});


		};

		if( this.opts.sameSlideAndHeaderColor ) {
			if( this.opts.headerBackgroundColor.length !== 0 ) {
				this.opts.indicator.backgroundColor = this.opts.headerBackgroundColor;
			}
			else if( _.opts.headerBackgroundColor.length === 0 && this.opts.indicator.backgroundColor.length !== 0) {
				this.opts.headerBackgroundColor = this.opts.indicator.backgroundColor;
			}
		}

		this.calculateSizes();
		this.startTheCreationProcess();

		$(this.slides[0].element).css({
			zIndex: 1
		});

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
//				console.log(code);
				if (code === 37 || code === 38 || code === 39 || code === 40) {
					e.preventDefault();
					console.log(code);
				}
				if (code === 37 || code === 38) {
					// 37 = left arrow && 38 = up arrow
					_.move('prev');
				}
				else if (code === 39 || e.keyCode === 40) {
					// 39 = right arrow && 40 = down arrow
					_.move('next');
				}
			});
		}

		if( this.opts.scrollControl ){
			$(document).on('mousewheel DOMMouseScroll', function(e){
				_.move( e.deltaY === 1 ? 'prev' : 'next' );
			});
		}

		$(document).on('click', '.' + this.thumbnailClass, function(e){
			e.preventDefault();
			e.stopPropagation();
			_.move( parseInt( $(this).attr(_.thumbnailSlideNumber) ) );
		});

		$(document).on('click', '.' + this.thumbnailChildClass, function(e){
			e.preventDefault();
			e.stopPropagation();
			_.move( parseInt( $(this).attr(_.thumbnailSlideNumber) ) );
		});

		$(window).resize(function(){
			$(obj).css({
				'top': '0px'
			});
			//_.resizePlugin();
			_.move(_.currentSlide, false);
		});

		if( this.opts.autoSlide ){
			this.start();
		}

		return this;
	}

	/***************************************************************************
	 *
	 *					Non upslide dependent functions
	 *
	 **************************************************************************/

	/**
	 *
	 * @param {object} attr attributes the slide wrapper will have, class & css
	 * @returns {HTML[object]} HTML[object] of the slideWrapper
	 */
	function SlideWrapper( attr ){
		var slideWrapper = $('<div/>', {
			class: attr.class
		}).css(
			attr.css
		);

		return slideWrapper;

	}

	function ThumbnailWrapper( attr ) {
		var overflow = attr.scrollable === true ? 'auto' : 'hidden',
			thumbnailWrapper;
	
		attr.css.overflow = overflow;

		thumbnailWrapper = $('<div/>', {
				class: attr.class
			}).css( attr.css ).css(attr.position, '0px');

		return thumbnailWrapper;

	}

	 /**
	 * Create a new slide
	 *
	 * @param {element} obj
	 * @param {object} attribute object holding { class, index, cssObject }
	 * @param {boolean} isChild is this a child slide of a slide?
	 * @returns {object} slide returns an object containing slide details
	 */
	function Slide( obj, attribute, isChild ){
		if( typeof isChild === 'undefined' ){
			isChild = false;
		}

		var trans = {
			effect: $(obj).attr('data-effect') || 'slide',
			from: $(obj).attr('data-from') || 'bottom'
		};
		$(obj).addClass(attribute.class)
			  .attr(this.slideNumber, attribute.index)
			  .children('div').children('.upslide-bannerText')
			  .css(attribute.css);
		var slide = {
			id: attribute.index,
			element: obj,
			child: isChild,
			transition: trans
		};
		return slide;
	}

	function Thumbnail( attribute, isChild ){
		if( typeof isChild === 'undefined' ){
			isChild = false;
		}

		var thumbnail = $('<div/>', {
			class: attribute.class
		}).attr( attribute.name, attribute.value )
			.css( attribute.css )
			.html('<p class="upslide-thumbnailHeader">' + attribute.text + '</p');

		return thumbnail;
	}

	/**
	 * Fade an element in
	 *
	 * @param {object} el element to perfom the fade on
	 * @param {int} sp speed to fade element in at
	 * @returns {void}
	 */
	function fadeInElement(el, sp) {
		$(el).hide().fadeIn(sp);
//			if( typeof parent === 'undefined' ){
//				$('.' + this.slideClass).each(function(i, el){
//					if( parseInt( $(el).attr(_.slideNumber) ) !== _.currentSlide && parseInt( $(el).attr(_.slideNumber) ) !== _.previousSlide ) {
//						$(el).children().children('.upslide-bannerText').stop().hide();
//					}
//					else if (parseInt( $(el).attr(_.slideNumber) ) === _.currentSlide) {
//						$(el).children().children('.upslide-bannerText').stop().fadeIn(_.opts.fadingHeadersSpeed);
//					}
//				});
//			}
//			else {
//
//			}
	};

	/**
	 * Produce object for .css() and .animate()
	 *
	 * @param {object} slideProps holds slide properties (width, height)
	 * @param {string} effect desired effect (slide, grow)
	 * @param {string} from position the effects originates from (top, left, right, etc...)
	 * @returns {object} css and animation objects
	 */
	function returnEffectsAndAnimations(slideProps, effect, from) {
		css = {
			display: 'block',
			opacity: 0,
			zIndex: '2'
		};
		anim = {
			top: '0px',
			left: '0px',
			opacity: 1
		};
		switch (effect) {
			case 'slide':
				switch (from) {
					case 'bottom':
						css.top = slideProps.height + 'px';
					break;
					case 'top':
						css.top = '-' + slideProps.height + 'px';
					break
					case 'left':
						css.left = '-' + slideProps.width + 'px';
					break;
					case 'right':
						css.dipslay = 'block';
						css.left = slideProps.width + 'px';
					break;
					case 'bottomLeft':
						css.top = slideProps.height + 'px';
						css.left = '-' + slideProps.width + 'px';
					break;
					case 'bottomRight':
						css.top = slideProps.height + 'px';
						css.left = slideProps.width + 'px';
					break;
					case 'topLeft':
						css.top = '-' + slideProps.height + 'px';
						css.left = '-' + slideProps.width + 'px';
					break;
					case 'topRight':
						css.top = '-' + slideProps.height + 'px';
						css.left = slideProps.width + 'px';
					break;
					default:
						css.top = $(window).height() + slideProps.height + 'px';
					break;
				}
			break;
			case 'grow':
				css.width = '0px';
				css.height = '0px';
				anim.width = '100%';
				anim.height = '100%';

				switch (from) {
					case 'center':
						css.top = '50%';
						css.left = '50%';
					break;
					case 'left':
						css.top = '50%';
					break;
					case 'right':
						css.top = '50%';
						css.left = slideProps.width + 'px';
					break;
					case 'top':
						css.left = '50%';
						css.top = '0px';
					break;
					case 'bottom':
						css.left = '50%';
						css.top = slideProps.height + 'px';
					break;
					case 'bottomLeft':
						css.top = slideProps.height + 'px';
						css.left = '-' + slideProps.width + 'px';
					break;
					case 'bottomRight':
						css.top = slideProps.height + 'px';
						css.left = slideProps.width + 'px';
					break;
					case 'topLeft':
						css.top = '-' + slideProps.height + 'px';
						css.left = '-' + slideProps.width + 'px';
					break;
					case 'topRight':
						css.top = '0px';
						css.left = slideProps.width + 'px';
					break;

				}
			break;
		}

		return {
			css: css,
			anim: anim
		};
	}


	$.fn.upslide = function( options ){
		 return  new init( this, options );
	};

})( jQuery );