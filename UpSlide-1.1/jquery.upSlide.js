/*
 * HTML must be formatted like the following...( class names can differ )
<div class="upSlide">
	<ul>	
		<li>
			<div style="display: block;background:url('img/slide1.jpg') no-repeat;background-position:center">
				<p>Slide 1 - This is the first slide!</p>
			</div>
		</li>

		<li>
			<div style="display: block;background:url('img/slide2.jpg') no-repeat;background-position:center">
				<p>Slide 2 - This is the second slide!</p>
			</div>
		</li>
	</ul>
</div>
*/

(function ($) {
	/*
	 * ulHeight / numberOfSlides
	 */

	function init( obj, options ) {
		var _ = this;
		obj.opts = $.extend({
			speed: 2000,
			delay: 3000,
			easing: 'linear',
			bsColorList: [],
			fadingHeaders: false,
			headerTransparency: 1,
			fullscreen: false,
			autoSlide: true,
			arrowControl: false,
			thumbnails: true,
			thumbHeader: false,
			thumbIndicator: {
				'speed': 2000,
				'easing': 'linear',
				'backgroundColor': 'white',
				'width': '2px',
				position: {
					side: 'right',
					inOrOut: 'in'
				}
			},
			onSlide: function() { return false; }
		}, options);

		this.calculateSizes = function(){
						
			if ( obj.opts.fullscreen ){
				$(this).parent().height( $(window).height() );
				$(this).parent().css( 'width', '100%' );
			}
			
			this.slideHeight = $(obj).children('li:first-child').height();
			$(obj).children('li').each(function(i, el){
				$(el).attr(_.slideOffsetTop, ($(el).offset().top - _.parentOffsetTop) )
					.css({
						'height': $(window).height()
					});
			});
			
			this.thumbnailHeight = ( this.slideHeight / this.numberOfSlides );
			$('.' + this.thumbnailClass).css({
				'background-size': 'cover',
				'height': this.thumbnailHeight + 'px'
			});
			
		};
	
		this.createSlides = function(){
			for(i = 0; i < this.slides.length; i++) {
				$(this.slides[i]).attr(this.slideNumber, i);
				$(this.slides[i]).css({
					'width': $(obj).width() + 'px',
					'float': 'left',
					'overflow': 'hidden'
				});
			}
		};
		
		this.createThumbnailAndAddToArray = function(_, image, index){
			var slideTo = this.slideHeight * index;
			var header;
			if( obj.opts.thumbHeader ){
				header = $(_).children().children('.upSlide-bannerText').text();
			}
			else {
				header = '';
			}
			var newThumb = $('<div />', { 
				class: this.thumbnailClass + ' upSlide-thumbnail', 
				'data-slideTo': slideTo,
				title: _.children().children('.upSlide-bannerText').text(),
				'data-title': _.attr('data-title')
			})
			.attr(this.thumbnailSlideNumber, index)
			.html( '<span class="upSlide-thumbTitle textOutline">' + header + '</span>' )
			.css({
				'background-image': image,
				'background-size': '100%',
				'background-position': '50%',
				'height': '100px',
				'width': 'auto'
			});
			this.slideThumbnails.push(newThumb);
		};
		
		obj.opts.onSlide(function(){
			alert('hi');
		});

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
					}, obj.opts.delay);
			}
			else {
				clearInterval( this.intervalVar );
			}

		};
		
		this.fadingHeaders = function( ) {
			$(obj).children('li').children().children('.upSlide-bannerText').eq(_.currentSlide).hide().fadeIn(obj.opts.speed);
		};

		this.move = function( dir ) {
			var pos = dir === 'up' ? '-=' + this.slideHeight : '+=' + this.slideHeight;

			if( dir === 'down' && ($(obj).position().top + this.slideHeight) > 0 ) {
				pos = -(this.maxTop - this.slideHeight);
			}
			else if( dir === 'down' && (Math.abs( $(obj).position().top ) ) >= this.maxTop - this.slideHeight ) {
				//this needs to be here to keep the plugin sane ( it acts funny without it, not sure why. #loveProgramming )
			}
			else if( (Math.abs( $(obj).position().top ) ) >= this.maxTop - this.slideHeight ) {
				pos = '0px';
			}
			
			if(dir === 'down' || pos === '0px'){
				if(pos === '0px') {
					_.currentSlide = 0;
					console.log('0px');
				}
				else {
					_.currentSlide -= 1;
					console.log('-1');
				}
				if( _.currentSlide < 0 ){
					_.currentSlide = (_.numberOfSlides - 1);
				}
			}
			else if(dir === 'up'){
				_.currentSlide += 1;
				if( _.currentSlide > _.numberOfSlides ){
					_.currentSlide = 0;
				}
			}
			
			this.moveThumbnailToSlide(_.currentSlide);
			this.moveToSlide(_.currentSlide);

		};

		this.moveToSlide = function(number){
			var pos = $('[' + this.slideNumber + '="' + number + '"]').attr(_.slideOffsetTop);
			$(obj).stop().animate({
				'top': '-' + pos + 'px',
				'opacity': 1
			}, {
				easing: obj.opts.easing,
				duration: obj.opts.speed,
				start: function(){
					_.fadingHeaders();
					_.stop();
				},
				complete: function() {
					if(obj.opts.autoSlide){
						_.start();
					}
				},
				queue: false
			});
		};
		
		this.moveThumbnailToSlide = function(slideNumber){
			var pos = $('[' + this.thumbnailSlideNumber + '="' + slideNumber + '"]').offset().top - this.parentOffsetTop;
			$('.' + this.thumbnailIndicator).stop().animate({
					'top': ( pos - 1 ) + 'px'
				}, {
					easing: obj.opts.thumbIndicator.easing,
					duration: obj.opts.thumbIndicator.speed,
					queue: false
				});
			
		};
		
		var objParentID = $(obj).parent().attr('id');
		this.intervalVar;
		this.parentOffsetTop = $(obj).parent().offset().top;
		this.currentSlide = 0;
		this.numberOfSlides = 0;
		this.thumbnailClass = objParentID + '_thumb';
		this.thumbnailSlideNumber = 'data-slideNumberThumb_' + objParentID;
		this.thumbnailWrapper = 'thumbnailWrapper_' + objParentID;
		this.thumbnailIndicator = 'thumbnailIndicator_' + objParentID;
		this.slideNumber = 'data-slideNumber_' + objParentID;
		this.slideOffsetTop = 'data-offsetTop_' + objParentID;
		this.slides = [];
		this.slideThumbnails = [];
		this.thumbnailHeight;
		this.maxTop = 0;
		this.firstSlideTopPosition = $(obj).children('li:first-child').offset().top;
		
		if ( obj.opts.fullscreen ){
			$(obj).parent().height( $(window).height() );
			$(obj).parent().css( 'width', '100%' );
		}

		this.slideHeight = $(obj).children('li:first-child').height();

		if(obj.opts.thumbnails){
			$(obj).parent().prepend('<div class="upSlide-thumbnailWrapper ' + this.thumbnailWrapper + '"></div>');
		}

		$(obj).children('li').each(function(i, e){
			var color = i === 2 ? 'white' : 'white';
			if(typeof obj.opts.bsColorList[i] === 'undefined'){
				var r = Math.floor(Math.random() * 255) + 1;
				var g = Math.floor(Math.random() * 255) + 1;
				var b = Math.floor(Math.random() * 255) + 1;

				obj.opts.bsColorList[i] = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + obj.opts.headerTransparency + ')';
			}

			$(this).attr(this.slideNumber, i);

			if(obj.opts.thumbnails){
				var thumbImage = $(this).css('background-image');
				_.createThumbnailAndAddToArray($(this), thumbImage, _.numberOfSlides);
				_.numberOfSlides++;
			}

			$(this).children('div').children('p').css({
				'background-color': obj.opts.bsColorList[i],
				'color': color
			});
		});

		for(var i = 0; i < this.slideThumbnails.length; i++){
			$('.' + this.thumbnailWrapper).append(this.slideThumbnails[i]);
		}		

		$(obj).children('li').each(function(i, el){
			_.slides.push(el);
			_.maxTop += $(el).height();
		});

		this.calculateSizes();
		this.createSlides();
		
		
		this.newThumbIndicator;
		if(obj.opts.thumbIndicator.position.side === 'left') {
			var positionValue = obj.opts.thumbIndicator.position.inOrOut === 'out' ? '-' + obj.opts.thumbIndicator.width : '0px';
			
			this.newThumbIndicator = $('<div />', {
				class: this.thumbnailIndicator + ' upSlide-thumbIndicator'
			}).css({
				'background-color': obj.opts.thumbIndicator.backgroundColor,
				'width': obj.opts.thumbIndicator.width,
				'height': this.thumbnailHeight + 'px',
				'left': positionValue
			});
		}
		else {
			var positionValue = obj.opts.thumbIndicator.position.inOrOut === 'out' ? '-' + obj.opts.thumbIndicator.width : '0px';
			this.newThumbIndicator = $('<div />', {
				class: this.thumbnailIndicator + ' upSlide-thumbIndicator'
			}).css({
				'background-color': obj.opts.thumbIndicator.backgroundColor,
				'width': obj.opts.thumbIndicator.width,
				'height': this.thumbnailHeight + 'px',
				'right': positionValue
			});
		}
		$('.' + this.thumbnailWrapper).append(this.newThumbIndicator);

		$('.prev').on('click', function(){
			_.move('down');
		});
		$('.next').on('click', function(){
			_.move('up');
		});

		if(obj.opts.arrowControl){
			$('body').keydown(function(e){
				if(e.keyCode !== 116){
					e.preventDefault();
				}
				if ( e.keyCode === 38){
					_.move('down');
				}
				else if ( e.keyCode === 40){
					_.move('up');
				}
			});
		}

		$('.' + this.thumbnailClass).on('click', function(e){
			e.preventDefault();
			_.currentSlide = parseInt( $(this).attr(_.thumbnailSlideNumber) );
			_.moveThumbnailToSlide(_.currentSlide);
			_.moveToSlide(_.currentSlide);
		});

		$(window).resize(function(){
			$(obj).css({
				'top': '0px'
			});
			_.calculateSizes();
			_.moveThumbnailToSlide(0);
		});

		if(obj.opts.autoSlide){
			this.start();
		}
		
	};
	
	$.fn.upSlide = function( options ){
		return new init( this, options );
	};

})( jQuery );