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
var firstPage = 3
const HizbPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590]
const surahs = [
	{ name: 'الفَاتِحَة', page: 1 },
	{ name: 'البَقَرَة', page: 2 },
	{ name: 'آل عِمرَان', page: 50 },
	{ name: 'النِّسَاء', page: 77 },
	{ name: 'المَائدة', page: 106 },
	{ name: 'الأنعَام', page: 128 },
	{ name: 'الأعرَاف', page: 151 },
	{ name: 'الأنفَال', page: 177 },
	{ name: 'التوبَة', page: 187 },
	{ name: 'يُونس', page: 208 },
	{ name: 'هُود', page: 221 },
	{ name: 'يُوسُف', page: 235 },
	{ name: 'الرَّعْد', page: 249 },
	{ name: 'إبراهِيم', page: 255 },
	{ name: 'الحِجْر', page: 262 },
	{ name: 'النَّحْل', page: 267 },
	{ name: 'الإسْرَاء', page: 282 },
	{ name: 'الكهْف', page: 293 },
	{ name: 'مَريَم', page: 305 },
	{ name: 'طه', page: 312 },
	{ name: 'الأنبيَاء', page: 322 },
	{ name: 'الحَج', page: 332 },
	{ name: 'المُؤمنون', page: 342 },
	{ name: 'النُّور', page: 350 },
	{ name: 'الفُرْقان', page: 359 },
	{ name: 'الشُّعَرَاء', page: 367 },
	{ name: 'النَّمْل', page: 377 },
	{ name: 'القَصَص', page: 385 },
	{ name: 'العَنكبوت', page: 396 },
	{ name: 'الرُّوم', page: 404 },
	{ name: 'لقمَان', page: 411 },
	{ name: 'السَّجدَة', page: 415 },
	{ name: 'الأحزَاب', page: 418 },
	{ name: 'سَبَأ', page: 428 },
	{ name: 'فَاطِر', page: 434 },
	{ name: 'يس', page: 440 },
	{ name: 'الصَّافات', page: 446 },
	{ name: 'ص', page: 453 },
	{ name: 'الزُّمَر', page: 458 },
	{ name: 'غَافِر', page: 467 },
	{ name: 'فُصِّلَتْ', page: 477 },
	{ name: 'الشُّورَى', page: 483 },
	{ name: 'الزُّخْرُف', page: 489 },
	{ name: 'الدخَان', page: 496 },
	{ name: 'الجَاثيَة', page: 499 },
	{ name: 'الأحْقاف', page: 502 },
	{ name: 'محَمَّد', page: 507 },
	{ name: 'الفَتْح', page: 511 },
	{ name: 'الحُجرَات', page: 515 },
	{ name: 'ق', page: 518 },
	{ name: 'الذَّاريَات', page: 520 },
	{ name: 'الطُّور', page: 523 },
	{ name: 'النَّجْم', page: 526 },
	{ name: 'القَمَر', page: 528 },
	{ name: 'الرَّحمن', page: 531 },
	{ name: 'الوَاقِعَة', page: 534 },
	{ name: 'الحَديد', page: 537 },
	{ name: 'المجَادلة', page: 542 },
	{ name: 'الحَشر', page: 545 },
	{ name: 'المُمتَحنَة', page: 549 },
	{ name: 'الصَّف', page: 551 },
	{ name: 'الجُمُعَة', page: 553 },
	{ name: 'المنَافِقون', page: 554 },
	{ name: 'التغَابُن', page: 556 },
	{ name: 'الطلَاق', page: 558 },
	{ name: 'التحْريم', page: 560 },
	{ name: 'المُلْك', page: 562 },
	{ name: 'القَلَم', page: 564 },
	{ name: 'الحَاقَّة', page: 566 },
	{ name: 'المعَارج', page: 568 },
	{ name: 'نُوح', page: 570 },
	{ name: 'الجِن', page: 572 },
	{ name: 'المُزَّمِّل', page: 574 },
	{ name: 'المُدَّثِّر', page: 575 },
	{ name: 'القِيَامَة', page: 577 },
	{ name: 'الإنسَان', page: 578 },
	{ name: 'المُرسَلات', page: 580 },
	{ name: 'النَّبَأ', page: 582 },
	{ name: 'النّازعَات', page: 583 },
	{ name: 'عَبَس', page: 585 },
	{ name: 'التَّكوير', page: 586 },
	{ name: 'الانفِطار', page: 587 },
	{ name: 'المطفِّفِين', page: 587 },
	{ name: 'الانْشِقَاق', page: 589 },
	{ name: 'البرُوج', page: 590 },
	{ name: 'الطَّارِق', page: 591 },
	{ name: 'الأَعْلى', page: 591 },
	{ name: 'الغَاشِية', page: 592 },
	{ name: 'الفَجْر', page: 593 },
	{ name: 'البَلَد', page: 594 },
	{ name: 'الشَّمْس', page: 595 },
	{ name: 'الليْل', page: 595 },
	{ name: 'الضُّحَى', page: 596 },
	{ name: 'الشَّرْح', page: 596 },
	{ name: 'التِّين', page: 597 },
	{ name: 'العَلَق', page: 597 },
	{ name: 'القَدْر', page: 598 },
	{ name: 'البَينَة', page: 598 },
	{ name: 'الزلزَلة', page: 599 },
	{ name: 'العَادِيات', page: 599 },
	{ name: 'القَارِعة', page: 600 },
	{ name: 'التَّكَاثر', page: 600 },
	{ name: 'العَصْر', page: 601 },
	{ name: 'الهُمَزَة', page: 601 },
	{ name: 'الفِيل', page: 601 },
	{ name: 'قُرَيْش', page: 602 },
	{ name: 'المَاعُون', page: 602 },
	{ name: 'الكَوْثَر', page: 602 },
	{ name: 'الكَافِرُون', page: 603 },
	{ name: 'النَّصر', page: 603 },
	{ name: 'المَسَد', page: 603 },
	{ name: 'الإخْلَاص', page: 604 },
	{ name: 'الفَلَق', page: 604 },
	{ name: 'النَّاس', page: 604 },
]

// Generate the list items using map and join into a single string
const surahListHTML = surahs
	.map(
		(item, index) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <a href="javascript:goSourah(${index + 1})">${item.name}</a>
    </li>
`
	)
	.join('')

// Insert the generated HTML into the <ul> element
document.getElementById('surahList').innerHTML = surahListHTML

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
	if (event.key === 'Enter')
		goSourah()
})

function goSourah(sourah) {
	if (!sourah) {
		sourah = parseInt(document.getElementById('SourahNumber').value)
	}
	var pageID = surahs[sourah - 1].page
	goPage(pageID)
}

function openNav() {
	document.getElementById('mySidenav').style.width = '250px'
}

function closeNav() {
	document.getElementById('mySidenav').style.width = '0'
}
