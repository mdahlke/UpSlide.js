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

	$.fn.upSlide = function (options) {
		var _ = this;
		var interval;
		this.opts = $.extend({
			speed: 2000,
			delay: 3000,
			bsColorList: [],
			thumbnails: true,
			fadingHeaders: false,
			headerTransparency: 1,
			fullscreen: false,
			autoSlide: true,
			arrowControl: false,
			thumbIndidcator: {
				'speed': 1000,
				'easing': 'easeOutQuart',
				'backgroundColor': 'white',
				'width': '2px'
			},
			onSlide: function() { return false; }
		}, options);

		
		
		this.createslides = function(){
			for(i = 0; i < this.slides.length; i++) {
				$(this.slides[i]).attr({
					'data-slideNumber': i
				});
				$(this.slides[i]).css({
					'width': $(this).width() + 'px',
					'float': 'left',
					'overflow': 'hidden'
				});
			}
		};
		
		this.createThumbnailAndAddToArray = function(_, image, index){
			var slideTo = this.slideHeight * index;
			
			var newThumb = $('<div />', { 
				class: 'slideThumb', 
				'data-slideTo': slideTo,
				'data-slideNumber': index,
				title: _.children().children('.bannerText').text(),
				'data-title': _.attr('data-title')
			})
			.html( '<span class="thumbTitle textOutline">' + _.children().children('.bannerText').text() + '</span>' )
			.css({
				'background-image': image,
				'background-size': '100%',
				'background-position': '50%',
				'height': '100px',
				'width': 'auto'
			});
			this.slideThumbnails.push(newThumb);
		};
		
		this.opts.onSlide(function(){
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
				interval = setInterval(
					function(){
						_.move( "up" );
					}, this.opts.delay);
			}
			else {
				clearInterval( interval );
			}

		};
		
		this.fadingHeaders = function( _ ) {
			$(_).children('li').children('.index-bannerText').hide().fadeIn(_.opts.speed);
		};

		this.move = function( dir ) {
			var pos = dir === 'up' ? '-=' + this.slideHeight : '+=' + this.slideHeight;

			if( dir === 'down' && ($(this).position().top + this.slideHeight) > 0 ) {
				pos = -(this.maxTop - this.slideHeight);
			}
			else if( dir === 'down' && (Math.abs( $(this).position().top ) ) >= this.maxTop - this.slideHeight ) {
				
			}
			else if( (Math.abs( $(this).position().top ) ) >= this.maxTop - this.slideHeight ) {
				pos = '0px';
			}
			
			if(dir === 'down' || pos === '0px'){
				if(pos === '0px') {
					_.currentSlide = 0;
				}
				else {
					_.currentSlide -= 1;
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
			var pos = $('[data-slideNumber="' + number + '"]').attr('data-slideTo');
			$(_).animate({
				'top': '-' + pos + 'px',
				'opacity': 1
			}, {
				easing: _.opts.thumbIndidcator.easing,
				duration: _.opts.speed,
				start: function(){
					_.fadingHeaders( _ );
					_.stop();
				},
				complete: function() {
					if(_.opts.autoSlide){
						_.start();
					}
				},
				queue: false
			});
		};
		
		this.moveThumbnailToSlide = function(slideNumber){
			var pos = $('[data-slideNumber="' + slideNumber + '"]').offset().top;
			$('.thumbIndicator').stop().animate({
					'top': ( pos - 1 ) + 'px'
				}, {
					easing: _.opts.thumbIndidcator.easing,
					duration: _.opts.thumbIndidcator.speed,
					queue: false
				});
			
		};
		
		this.init = function() {
			this.currentSlide = 0;
			this.numberOfSlides = 0;
			this.slides = [];
			this.slideThumbnails = [];
			this.maxTop = 0;
			this.borderSize = parseInt( $( this ).children().children(':first-child').css('border-bottom-width').slice(0,-2) ) === 0 ? 5 : 0;
			this.firstSlideTopPosition = $(this).children('li:first-child').offset().top;
			var slideThumbnails = [];

			if ( this.opts.fullscreen ){
				$(this).parent().height( $(window).height() );
				$(this).parent().css( 'width', '100%' );
			}
			
			this.slideHeight = $(_).children('li:first-child').height();
			
			if(_.opts.thumbnails){
				_.parent().prepend('<div class="thumbnailWrapper"></div>');
			}
			
			this.children('li').each(function(i, e){
				var color = i === 2 ? 'white' : 'white';
				if(typeof _.opts.bsColorList[i] === 'undefined'){
					var r = Math.floor(Math.random() * 255) + 1;
					var g = Math.floor(Math.random() * 255) + 1;
					var b = Math.floor(Math.random() * 255) + 1;

					_.opts.bsColorList[i] = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + _.opts.headerTransparency + ')';
				}

				if(_.opts.thumbnails){
					var thumbImage = $(this).css('background-image');
					_.createThumbnailAndAddToArray($(this), thumbImage, _.numberOfSlides);
					_.numberOfSlides++;
				}

				$(this).children('div').children('p').css({
					'background-color': _.opts.bsColorList[i],
					'color': color
				});
			});
			
			var thumbnailHeight = ( this.slideHeight / this.numberOfSlides ) - ( this.borderSize );

			
			for(var i = 0; i < this.slideThumbnails.length; i++){
				$('.thumbnailWrapper').append(this.slideThumbnails[i]);
			}		

			this.children('li').each(function(i, el){
				_.slides.push(el);
				_.maxTop += $(el).height();
			});


			$('.slideThumb').css({
				'background-size': 'cover',
				'height': thumbnailHeight + 'px'
			});


			var thumbIndicator = $('<div />', {
					class: 'thumbIndicator'
				}).css({
					'background-color': _.opts.thumbIndidcator.backgroundColor,
					'width': _.opts.thumbIndidcator.width,
					'height': thumbnailHeight + 'px'
				});

			$('.thumbnailWrapper').append(thumbIndicator);

			$('.prev').on('click', function(){
				_.move('down');
			});
			$('.next').on('click', function(){
				_.move('up');
			});
			
			if(this.opts.arrowControl){
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

			$('.slideThumb').on('click', function(e){
				e.preventDefault();
				var __ = $(this);
				_.currentSlide = parseInt( __.attr('data-slideNumber') );
				
				$('.thumbIndicator').stop(true).animate({
					'top': ( __.offset().top - 1 ) + 'px'
				}, {
					start: function(){
						_.moveToSlide( __.attr('data-slideNumber') );
					},
					easing: 'easeOutBounce',
					duration: _.opts.thumbIndidcator.speed,
					queue: false
				});


			});

			if(this.opts.autoSlide){
				this.start();
			}
		};
		
		this.init();

	};

})( jQuery );