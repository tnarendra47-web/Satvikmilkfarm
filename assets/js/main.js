/***************************************************
==================== JS INDEX ======================
	Preloader activation
	Mobile Menu Js
	Sidebar Toggle
	Sidebar cart
	Body overlay Js
	Search form Js
	Sticky Header Js
	Data Css js
	Nice Select Js
	Hero active  Js
	Hero active Js-2
	Masonary Js
	MagnificPopup
	Wow Js
	Show Login Toggle Js
	Show Coupon Toggle Js
	Create An Account Toggle Js
	Shipping Box Toggle Js
	Counter Js
	Parallax Js
	InHover Active Js
	Gallery active js
	Testimonial Slider Js
	Product Slider Js
	Brand Slider Js
	Drop-btn js
	Cart count js
	Wishlist count js
****************************************************/

(function ($) {
	"use strict";
	var windowOn = $(window);

	//Preloader activation
	$(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut(500);
    });

	// Mobile Menu Js
	$('#mobile-menu').meanmenu({
		meanMenuContainer: '.mobile-menu',
		meanScreenWidth: "991",
		meanExpand: ['<i class="fal fa-plus"></i>'],
	});

	// Sidebar Toggle
	$(".offcanvas__close,.offcanvas-overlay").on("click", function () {
		$(".offcanvas__info").removeClass("info-open");
		$(".offcanvas-overlay").removeClass("overlay-open");
	});
	$(".side-toggle").on("click", function () {
		$(".offcanvas__info").addClass("info-open");
		$(".offcanvas-overlay").addClass("overlay-open");
	});

	// Sidebar cart
	$(".cartmini__close,.offcanvas-overlay").on("click", function () {
		$(".shoping__sidebar").removeClass("cart-open");
		$(".offcanvas-overlay").removeClass("overlay-open");
	});
	$(".shoping__toggle").on("click", function () {
		$(".shoping__sidebar").addClass("cart-open");
		$(".offcanvas-overlay").addClass("overlay-open");
	});
	
	// Body overlay Js
	$(".body-overlay").on("click", function () {
		$(".offcanvas__area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
	});

	// Search form Js
	$(".search-toggle").on("click", function () {
		$(".bd-search__box").toggleClass("search__open");
	});
	$("body > *:not(header)").on("click", function () {
		$(".bd-search__box").removeClass("search__open");
	});

	// Sticky Header Js
	windowOn.on('scroll', function () {
		var scroll = $(window).scrollTop();
		if (scroll < 100) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});

	// Data Css js
	$("[data-background").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});
	
	$("[data-width]").each(function () {
		$(this).css("width", $(this).attr("data-width"));
	});

	$("[data-bg-color]").each(function () {
        $(this).css("background-color", $(this).attr("data-bg-color"));
    });

	// Nice Select Js
	$('select').niceSelect();

	//  Hero active Js
	if (jQuery(".hero__active").length > 0) {
		let sliderActive1 = ".hero__active";
		let sliderInit1 = new Swiper(sliderActive1, {
			// Optional parameters
			slidesPerView: 1,
			slidesPerColumn: 1,
			paginationClickable: true,
			loop: true,
			effect: 'fade',
			autoplay: {
				delay: 5000,
			},
			// If we need pagination
			pagination: {
				el: ".banner-pagination-1",
				// dynamicBullets: true,
				clickable: true,
			},
			// Navigation arrows
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			a11y: false,
		});

		function animated_swiper(selector, init) {
			let animated = function animated() {
				$(selector + " [data-animation]").each(function () {
					let anim = $(this).data("animation");
					let delay = $(this).data("delay");
					let duration = $(this).data("duration");

					$(this)
						.removeClass("anim" + anim)
						.addClass(anim + " animated")
						.css({
							webkitAnimationDelay: delay,
							animationDelay: delay,
							webkitAnimationDuration: duration,
							animationDuration: duration,
						})
						.one(
							"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
							function () {
								$(this).removeClass(anim + " animated");
							}
						);
				});
			};
			animated();
			// Make animated when slide change
			init.on("slideChange", function () {
				$(sliderActive1 + " [data-animation]").removeClass("animated");
			});
			init.on("slideChange", animated);
		}

		animated_swiper(sliderActive1, sliderInit1);
	}

	// Hero active Js-2
	if (jQuery(".hero__active-2").length > 0) {
		let sliderActive1 = ".hero__active-2";
		let sliderInit1 = new Swiper(sliderActive1, {
			// Optional parameters
			slidesPerView: 1,
			slidesPerColumn: 1,
			paginationClickable: true,
			loop: true,
			effect: 'fade',

			autoplay: {
				delay: 5000,
			},

			// If we need pagination
			pagination: {
				el: ".banner-pagination-2",
				// dynamicBullets: true,
				clickable: true,
			},

			// Navigation arrows
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},

			a11y: false,
		});

		function animated_swiper(selector, init) {
			let animated = function animated() {
				$(selector + " [data-animation]").each(function () {
					let anim = $(this).data("animation");
					let delay = $(this).data("delay");
					let duration = $(this).data("duration");

					$(this)
						.removeClass("anim" + anim)
						.addClass(anim + " animated")
						.css({
							webkitAnimationDelay: delay,
							animationDelay: delay,
							webkitAnimationDuration: duration,
							animationDuration: duration,
						})
						.one(
							"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
							function () {
								$(this).removeClass(anim + " animated");
							}
						);
				});
			};
			animated();
			// Make animated when slide change
			init.on("slideChange", function () {
				$(sliderActive1 + " [data-animation]").removeClass("animated");
			});
			init.on("slideChange", animated);
		}

		animated_swiper(sliderActive1, sliderInit1);
	}

	// Masonary Js
	$('.grid').imagesLoaded(function () {
		// init Isotope
		var $grid = $('.grid').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-item',
			}
		});

		// filter items on button click
		$('.bd-gallery__button').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});

		//for menu active class
		$('.bd-gallery__button button').on('click', function (event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

	});

	// MagnificPopup image view
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});

	// MagnificPopup video view
	$(".popup-video").magnificPopup({
		type: "iframe",
	});

	//  Wow Js
	new WOW().init();

	//  Counter Js
	$('.counter').counterUp({
		delay: 10,
		time: 1000
	});

	//  Parallax Js
	if ($('.scene').length > 0) {
		$('.scene').parallax({
			scalarX: 10.0,
			scalarY: 15.0,
		});
	};

	//  InHover Active Js
	$('.hover__active').on('mouseenter', function () {
		$(this).addClass('active').parent().siblings().find('.hover__active').removeClass('active');
	});

	// Gallery active js
	var gallery = new Swiper('.bd-gallery-active', {
		slidesPerView: 4,
		spaceBetween: 30,
		slideToClickedSlide: true,
		loop: true,
		autoplay: {
			delay: 3000,
		},
		pagination: {
			el: ".team-pagination",
			clickable: true,
			renderBullet: function (index, className) {
			  return '<span class="' + className + '">' + '<button>'+(index + 1)+'</button>' + "</span>";
			},
		},
		navigation: {
			nextEl: ".gallery-button-next",
			prevEl: ".gallery-button-prev",
		},
		speed: 800,
		breakpoints: {
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 4,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 2,
			},
		},
	});

	// Testimonial Slider Js
	var swiper = new Swiper(".testimonial-nav", {
		spaceBetween: 0,
		slidesPerView: 3,
		freeMode: true,
		centeredSlides: true,
		loop: true,
		allowTouchMove: true,
		allowSlideNext: true,
		allowSlidePrev: true,
		observer:true,
		observeParents:true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		autoplay: {
			delay: 3000,
		},
		breakpoints: {
			'1200': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 3,
			},
			'570': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		});
		var swiper2 = new Swiper(".testimonial-slide", {
		spaceBetween: 10,
		autoplay: {
			delay: 3000,
		},
		navigation: {
		nextEl: ".testimonial-button-next",
		prevEl: ".testimonial-button-prev",
		},
		thumbs: {
			swiper: swiper,
		},
	});

	// Product Slider Js
	var produc = new Swiper('.product__active', {
		slidesPerView: 5,
		spaceBetween: 30,
		slideToClickedSlide: true,
		loop: true,
		autoplay: {
			delay: 3000,
		},
		pagination: {
			el: ".product-pagination",
			clickable: true,
			renderBullet: function (index, className) {
			  return '<span class="' + className + '">' + '<button>'+(index + 1)+'</button>' + "</span>";
			},
		},
		navigation: {
		nextEl: ".product-button-next",
          prevEl: ".product-button-prev",
        },
		speed: 1000,
		breakpoints: {
			'1400': {
				slidesPerView: 5,
			},
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'480': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 2,
			},
		},
	});

	// Brand Slider Js
	var brand = new Swiper('.bd-brand-active', {
		slidesPerView: 6,
		spaceBetween: 30,
		loop: true,
		autoplay: {
				delay: 3000,
			},
		navigation: {
          nextEl: ".brand-button-next",
          prevEl: ".brand-button-prev",
        },
		breakpoints: {
			'1400': {
				slidesPerView: 6,
			},
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'480': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	// Cart Quantity Js
	$(".cart-minus").click(function () {
		var $input = $(this).parent().find("input");
		var count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
		return false;
	});

	$(".cart-plus").click(function () {
		var $input = $(this).parent().find("input");
		$input.val(parseInt($input.val()) + 1);
		$input.change();
		return false;
	});

    // Drop-btn js
    $(".btn-dropdown__link").on("click", function () {
        $(this).siblings("").toggleClass("open");
        $(this).parent("").toggleClass("open");
    });
	
	// Cart count js
	var cartCountValue = 0;
	var cartCount = $('.cart-count');
	$(cartCount).text(cartCountValue);
	$('.cart-btn').on('click', function() {
		var cartBtn = this;
		var cartCountPosition = $(cartCount).offset();
		var btnPosition = $(this).offset();
		var leftPos =
		cartCountPosition.left < btnPosition.left
			? btnPosition.left - (btnPosition.left - cartCountPosition.left)
			: cartCountPosition.left;
		var topPos =
		cartCountPosition.top < btnPosition.top
			? cartCountPosition.top
			: cartCountPosition.top;
		$(cartBtn)
		.append("<span class='count'>0</span>");
		
		$(cartBtn).find(".count").each(function(i,count){
		$(count).offset({
			left: leftPos,
			top: topPos
		})
		.animate(
			{
			opacity: 0
			},
			800,
			function() {
			$(this).remove();
			cartCountValue++;
			$(cartCount).text(cartCountValue);
			}
		);
		}); 
	});

	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	$('.cart-btn').on('click', function () {
		$(".added-to-cart").slideToggle("slow").delay(1500).slideToggle("slow");
	});


	// Wishlist count js
	var wishlistCountValue = 0;
	var wishlistCount = $('.wishlist-count');
	$(wishlistCount).text(wishlistCountValue);
	$('.wishlist-btn').on('click', function() {
		var wishlistBtn = this;
		var wishlistCountPosition = $(wishlistCount).offset();
		var btnPosition = $(this).offset();
		var leftPos =
		wishlistCountPosition.left < btnPosition.left
			? btnPosition.left - (btnPosition.left - wishlistCountPosition.left)
			: wishlistCountPosition.left;
		var topPos =
		wishlistCountPosition.top < btnPosition.top
			? wishlistCountPosition.top
			: wishlistCountPosition.top;
		$(wishlistBtn)
		.append("<span class='count'>0</span>");
		
		$(wishlistBtn).find(".count").each(function(i,count){
		$(count).offset({
			left: leftPos,
			top: topPos
		})
		.animate(
			{
			opacity: 0
			},
			800,
			function() {
			$(this).remove();
			wishlistCountValue++;
			$(wishlistCount).text(wishlistCountValue);
			}
		);
		}); 
	});

	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	$('.wishlist-btn').on('click', function () {
		$(".added-to-wishlist").slideToggle("slow").delay(1500).slideToggle("slow");
	});



})(jQuery);