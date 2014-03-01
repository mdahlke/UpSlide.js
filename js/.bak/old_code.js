this.moveToChildSlide = function(number, animation) {
	if (number === 0) {
		this.moveToSlide(this.currentSlide);
		return;
	}
	var pos = this.slideLookup[number];
	var thisSlide = this.childSlides[this.currentSlide][this.currentChildSlide - 1].element;
	var previousSlide;

//			console.log(number);


	if (this.childSlides[this.currentChildSlide + 1] === 'undefined') {
		previousSlide = this.slides[this.currentSlide].element;
	}
	else {
		//	console.log(this.childSlides[number][this.currentChildSlide].element);
//				console.log(this.childSlides[this.currentSlide][number]);
		previousSlide = this.childSlides[this.currentSlide][number].element;
	}

	if (typeof animation === 'undefined') {
		animation = true;
	}
	else {
		animation = false;
	}
	var duration = animation === false ? 0 : this.opts.speed;

	$('.' + this.slideClass).css({
		zIndex: '-1'
	});

	$(this.slides[this.currentSlide].element).css({
		zIndex: '1'
	});

	$(thisSlide).stop().css({
		display: 'block',
		'left': $(window).width() + $(obj).width() + 'px',
		opacity: 0,
		zIndex: '2'
	}).animate({
		'left': '0px',
		'opacity': 1
	}, {
		easing: _.opts.easing,
		duration: duration,
		start: function() {
			if (_.opts.fadingHeaders) {
				fadeInElement(thisSlide);
			}
			_.stop();
			_.opts.onSlideStart();
		},
		complete: function() {
			if (_.opts.autoSlide) {
				_.start();
			}
			_.slideTracker[_.currentSlide]++;
			_.opts.onSlideComplete();

			$(previousSlide).css({
				display: 'none',
				zIndex: '-1'
			});
		},
		always: function() {
			_.opts.onSlide();
		},
		queue: false
	}).css({
		zIndex: 2

	});
};


	function ChildSlide( obj, appendTo ) {

		console.log(obj);

		var header = $(obj).children('div').children('.upslide-bannerText').text();
		var background = $(obj).css('background');

		var thumbnail = $('<div/>', {
			class: 'upslide-childThumbnail'
		}).css({
			background: background,
			width: '100px',
			height: '100px'
		}).text(header);

		$(appendTo).append(thumbnail);
		console.log(header);
		console.log(background);

	}


	function ChildThumbnail(obj) {

	}

		try {
			if (typeof object[i] !== 'undefined') {
				var ele;
				for (var ii = 0, ll = object[i].length; ii < ll; ii++) {
					ele = object[i][ii].element;
					$(ele).children().children('.upslide-bannerText').css({
						'background-color': attr.headerBackgroundColor
					});
				}
			}
		}
		catch( e ){
			//console.log(e);
		}


		$(obj).push({
			element: $(el)[0],
			background: $(el).css('background'),
			index: i
		});
		if(_.opts.headerHideText && backupText) {
			_.backupText.push( $(el).children().children('.upslide-bannerText').text() );
			$(el).children().children('.upslide-bannerText').text("");
		}

		if( typeof _.thumbnailsObject.backupText === 'undefined' ){
			_.thumbnailsObject[i].backupText = _.backupText[i];
		}



		this.addSlideAttributes = function( slides, object, isChild ){
			var el;
			var slideNumber;

			if( typeof isChild === 'undefined' ){
				isChild = false;
			}

			for (var i = 0, l = slides.length; i < l; i++) {
				if( isChild ){
					slideNumber = i + 1000;
				}
				else {
					slideNumber = i;
				}
				try {
					el = slides[i].element;
					$(el).attr(_.slideNumber, slideNumber)
						.addClass(_.slideClass)
						.css({
						'width': _.slideWidth,
						'height': _.slideHeight + 'px'
					}).children('div').children('.upslide-bannerText').css({
						'background-color': _.opts.headerBackgroundColor[i]
					});


					try {
						if (typeof object[i] !== 'undefined') {
							var ele;
							for (var ii = 0, ll = object[i].length; ii < ll; ii++) {
								ele = object[i][ii].element;
								$(ele).children().children('.upslide-bannerText').css({
									'background-color': _.opts.headerBackgroundColor[i]
								});
							}
						}
					}
					catch( e ){
						//console.log(e);
					}


					object.push({
						element: $(el)[0],
						background: $(el).css('background'),
						index: i
					});
					if(_.opts.headerHideText && backupText) {
						_.backupText.push( $(el).children().children('.upslide-bannerText').text() );
						$(el).children().children('.upslide-bannerText').text("");
					}

					if( typeof _.thumbnailsObject.backupText === 'undefined' ){
						_.thumbnailsObject[i].backupText = _.backupText[i];
					}

				}
				catch( e ){
					//console.log(e.message);
				}
			}
				//console.log(object);
		};


		this.createShow = function(){

			$(this.slides).each( function( i, e ) {
				console.log(e);
			});

		};


		this.createThumbnails = function(){
			for(var i = 0, thumbs = this.thumbnailsObject; i < thumbs.length; i++){
				var thumb = thumbs[i];
				var header;

				if( _.opts.thumbnail.header && typeof $(thumb.element).children().children('.upslide-bannerText').text() !== 'undefined'){
					header = $(thumb.element).children().not('.upslideHorizontal').children('.upslide-bannerText:first-of-type').text();
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
					'data-title': $(thumb.element).attr('data-title')
				})
				.attr(this.thumbnailSlideNumber, thumb.index)
				.prepend( '<p class="upslide-thumbnailTitle textOutline">' + header + '</p>' )
				.css({
					'background': thumb.background,
					'background-size': '100% 100%',
					'background-position': '50%'
				}).height(this.thumbnailHeight);
				$('.' + this.thumbnailWrapperClass).append(newThumb);
			}
		};

		this.createChildThumbnails = function() {
			var childThumbWrapper;
			for( var k in this.childSlidesRelatedToParent ){

				//childThumbWrapper = new ThumbnailWrapper( attr );
				for( var i = 0; i < this.childSlidesRelatedToParent[k].length; i++){
					var newChildThumb = $('<div />', {
						class: this.thumbnailChildClass,
						title: this.childSlidesRelatedToParent[k][i].id,
						'data-title': i
					})
					.attr(this.thumbnailSlideNumber, this.childSlidesRelatedToParent[k][i].id)
					.css({
						'background': $(this.childSlidesRelatedToParent[k][i].element).css('background'),
						'background-size': '100% 100%',
						'background-position': '50%',
						'background-repeat': 'no-repeat',
						float: 'left',
						width: '30%',
						height: '50px',
						zIndex: '9999'
					}).bind(function(){
						_.moveToChild(this);
					});
					$(childThumbWrapper).append( newChildThumb );
					//css({	background: $(this.childSlidesRelatedToParent[k][i]).css('background') });
				}
				$( '[' + this.thumbnailSlideNumber + '=\'' + k + '\']' ).append( childThumbWrapper );

			}


		};

				var header;
				if( _.opts.thumbnail.header && typeof $(thumb.element).children().children('.upslide-bannerText').text() !== 'undefined'){
					header = $(thumb.element).children().not('.upslideHorizontal').children('.upslide-bannerText:first-of-type').text();
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
					'data-title': $(thumb.element).attr('data-title')
				})
				.attr(this.thumbnailSlideNumber, thumb.index)
				.prepend( '<p class="upslide-thumbnailTitle textOutline">' + header + '</p>' )
				.css({
					'background': thumb.background,
					'background-size': '100% 100%',
					'background-position': '50%'
				}).height(this.thumbnailHeight);

		this.createChildThumbnailWrapper = function() {
			var overflow = this.opts.thumbnail.scrollable === true ? 'auto' : 'hidden';

			if ($('.' + this.thumbnailWrapper).length === 0) {
				$(obj).parent().prepend($('<div />', {
					class: 'upslide-thumbnailWrapper ' + this.thumbnailWrapper
				}).css({
					'width': this.thumbnailWrapperWidth + 'px',
					height: $(obj).height() + 'px',
					'overflow': overflow
				}).css(_.opts.thumbnail.position, '0px'));
			}
			else {
				var overflow = this.opts.thumbnail.scrollable === true ? 'auto' : 'hidden';
				$('.' + this.thumbnailWrapper).css({
					'width': this.thumbnailWrapperWidth + 'px',
					'overflow': overflow
				});
			}
		};

		this.resizePlugin = function(){
			this.calculateSizes();

			if(this.opts.thumbnail.show){
				this.createThumbnailWrapper();
			}

			this.startTheCreationProcess();
			this.createSlides();


			if(this.opts.thumbnail.show){
				this.createThumbnails();
				//this.createChildThumbnails();
				this.createIndicator();
			}
		};

