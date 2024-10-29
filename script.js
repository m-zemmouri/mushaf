function loadApp() {
	$('#canvas').fadeIn(1000)

	var flipbook = $('.magazine')

	// Check if the CSS was already loaded

	if (flipbook.width() == 0 || flipbook.height() == 0) {
		setTimeout(loadApp, 10)
		return
	}

	// Create the flipbook

	flipbook.turn({
		// Magazine width

		width: 3826,

		// Magazine height

		height: 2735,

		// Duration in millisecond

		duration: 1000,

		// Enables gradients

		gradients: true,

		// Auto center this flipbook

		autoCenter: true,

		// Elevation from the edge of the flipbook when turning a page

		elevation: 50,

		// The number of pages

		pages: 640,

		// The direction

		direction: 'rtl',

		// Events

		when: {
			turning: function (event, page, view) {
				var book = $(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages')

				// Update the current URI

				Hash.go('page/' + page).update()

				// Show and hide navigation buttons

				disableControls(page)
			},

			turned: function (event, page, view) {
				disableControls(page)

				$(this).turn('center')

				$('#slider').slider('value', getViewNumber($(this), page))

				if (page == 1) {
					$(this).turn('peel', 'br')
				}
			},

			missing: function (event, pages) {
				// Add pages that aren't in the magazine

				for (var i = 0; i < pages.length; i++) addPage(pages[i], $(this))
			},
		},
	})

	// Zoom.js

	$('.magazine-viewport').zoom({
		flipbook: $('.magazine'),

		max: function () {
			return largeMagazineWidth() / $('.magazine').width()
		},

		when: {
			swipeLeft: function () {
				$(this).zoom('flipbook').turn('next')
			},

			swipeRight: function () {
				$(this).zoom('flipbook').turn('previous')
			},

			resize: function (event, scale, page, pageElement) {
				if (scale == 1) loadSmallPage(page, pageElement)
				else loadLargePage(page, pageElement)
			},

			zoomIn: function () {
				$('#slider-bar').hide()
				$('.made').hide()
				$('.magazine').removeClass('animated').addClass('zoom-in')
				$('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out')

				if (!window.escTip && !$.isTouch) {
					escTip = true

					$('<div />', { class: 'exit-message' })
						.html('<div>Press ESC to exit</div>')
						.appendTo($('body'))
						.delay(2000)
						.animate({ opacity: 0 }, 500, function () {
							$(this).remove()
						})
				}
			},

			zoomOut: function () {
				$('#slider-bar').fadeIn()
				$('.exit-message').hide()
				$('.made').fadeIn()
				$('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in')

				setTimeout(function () {
					$('.magazine').addClass('animated').removeClass('zoom-in')
					resizeViewport()
				}, 0)
			},
		},
	})

	// Zoom event

	if ($.isTouch) $('.magazine-viewport').bind('zoom.doubleTap', zoomTo)
	else $('.magazine-viewport').bind('zoom.tap', zoomTo)

	// Using arrow keys to turn the page

	$(document).keydown(function (e) {
		var previous = 39,
			next = 37,
			esc = 27

		switch (e.keyCode) {
			case previous:
				// left arrow
				$('.magazine').turn('previous')
				e.preventDefault()

				break
			case next:
				//right arrow
				$('.magazine').turn('next')
				e.preventDefault()

				break
			case esc:
				$('.magazine-viewport').zoom('zoomOut')
				e.preventDefault()

				break
		}
	})

	// URIs - Format #/page/1

	Hash.on('^page/([0-9]*)$', {
		yep: function (path, parts) {
			var page = parts[1]

			if (page !== undefined) {
				if ($('.magazine').turn('is')) $('.magazine').turn('page', page)
			}
		},
		nop: function (path) {
			if ($('.magazine').turn('is')) $('.magazine').turn('page', 1)
		},
	})

	$(window)
		.resize(function () {
			resizeViewport()
		})
		.bind('orientationchange', function () {
			resizeViewport()
		})

	// Regions

	if ($.isTouch) {
		$('.magazine').bind('touchstart', regionClick)
	} else {
		$('.magazine').click(regionClick)
	}

	// Events for the next button

	$('.next-button')
		.bind($.mouseEvents.over, function () {
			$(this).addClass('next-button-hover')
		})
		.bind($.mouseEvents.out, function () {
			$(this).removeClass('next-button-hover')
		})
		.bind($.mouseEvents.down, function () {
			$(this).addClass('next-button-down')
		})
		.bind($.mouseEvents.up, function () {
			$(this).removeClass('next-button-down')
		})
		.click(function () {
			$('.magazine').turn('next')
		})

	// Events for the next button

	$('.previous-button')
		.bind($.mouseEvents.over, function () {
			$(this).addClass('previous-button-hover')
		})
		.bind($.mouseEvents.out, function () {
			$(this).removeClass('previous-button-hover')
		})
		.bind($.mouseEvents.down, function () {
			$(this).addClass('previous-button-down')
		})
		.bind($.mouseEvents.up, function () {
			$(this).removeClass('previous-button-down')
		})
		.click(function () {
			$('.magazine').turn('previous')
		})

	// Slider

	$('#slider').slider({
		min: 1,
		max: numberOfViews(flipbook),

		start: function (event, ui) {
			if (!window._thumbPreview) {
				_thumbPreview = $('<div />', { class: 'thumbnail' }).html('<div></div>')
				setPreview(ui.value)
				_thumbPreview.appendTo($(ui.handle))
			} else setPreview(ui.value)

			moveBar(false)
		},

		slide: function (event, ui) {
			setPreview(ui.value)
		},

		stop: function () {
			if (window._thumbPreview) _thumbPreview.removeClass('show')

			$('.magazine').turn('page', Math.max(1, $(this).slider('value') * 2 - 2))
		},
	})

	resizeViewport()

	$('.magazine').addClass('animated')
}

// Zoom icon

$('.zoom-icon')
	.bind('mouseover', function () {
		if ($(this).hasClass('zoom-icon-in')) $(this).addClass('zoom-icon-in-hover')

		if ($(this).hasClass('zoom-icon-out')) $(this).addClass('zoom-icon-out-hover')
	})
	.bind('mouseout', function () {
		if ($(this).hasClass('zoom-icon-in')) $(this).removeClass('zoom-icon-in-hover')

		if ($(this).hasClass('zoom-icon-out')) $(this).removeClass('zoom-icon-out-hover')
	})
	.bind('click', function () {
		if ($(this).hasClass('zoom-icon-in')) $('.magazine-viewport').zoom('zoomIn')
		else if ($(this).hasClass('zoom-icon-out')) $('.magazine-viewport').zoom('zoomOut')
	})

$('#canvas').hide()

// Load the HTML4 version if there's not CSS transform

yepnope({
	test: Modernizr.csstransforms,
	yep: ['./lib/turn.min.js'],
	nope: ['./lib/turn.html4.min.js', './css/jquery.ui.html4.css'],
	both: ['./lib/zoom.min.js', './css/jquery.ui.css', './magazine.js', './css/magazine.css', './css/sidenav.css'],
	complete: loadApp,
})

// script.js

const HizbPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590]
const SourahPages = [
	1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267, 282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415, 418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545, 549, 551, 553, 554, 556,
	558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577, 578, 580, 582, 583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 595, 596, 596, 597, 597, 598, 598, 599, 599, 600, 600, 601, 601, 601, 602, 602, 602, 603, 603, 603, 604, 604, 604,
]

const QuranPages = Array.from({ length: 604 }, (_, i) => `pages/page${i + 1}.jpg`)
var input = document.getElementById('PageNumber')

// Execute a function when the user releases a key on the keyboard
input.addEventListener('keyup', function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		goPage()
	}
})

function goPage(pageID) {
	if (!pageID) {
		pageID = parseInt(document.getElementById('PageNumber').value)
	}
	pageID = pageID + firstPage
	window.location.hash = href = '#page/' + pageID
	closeNav()
	document.getElementById('PageNumber').value = ''
	document.getElementById('HizbNumber').value = ''
	document.getElementById('SourahNumber').value = ''
}

var input = document.getElementById('HizbNumber')

// Execute a function when the user releases a key on the keyboard
input.addEventListener('keyup', function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		goHizb()
	}
})

function goHizb(hizb) {
	if (!hizb) {
		hizb = parseInt(document.getElementById('HizbNumber').value)
	}
	var pageID = HizbPages[hizb - 1]
	goPage(pageID)
}
var input = document.getElementById('SourahNumber')

// Execute a function when the user releases a key on the keyboard
input.addEventListener('keyup', function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		goSourah()
	}
})

function goSourah(sourah) {
	if (!sourah) {
		sourah = parseInt(document.getElementById('SourahNumber').value)
	}
	var pageID = SourahPages[sourah - 1]
	goPage(pageID)
}

function openNav() {
	document.getElementById('mySidenav').style.width = '250px'
}

function closeNav() {
	document.getElementById('mySidenav').style.width = '0'
}
