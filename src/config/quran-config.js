export const QURAN_CONFIG = {
	PAGES_PATH: '/images/quran-pages',
	TOTAL_PAGES: 604,
	PAGE_FORMAT: 'png', // or whatever format your images are in

	// Function to get the page image path
	getPagePath: (pageNumber) => {
		// // Pad the page number with zeros (001, 002, etc.)
		// const paddedNumber = pageNumber.toString().padStart(3, '0')
		// return `${QURAN_CONFIG.PAGES_PATH}/page${paddedNumber}.${QURAN_CONFIG.PAGE_FORMAT}`

		return `${QURAN_CONFIG.PAGES_PATH}/${pageNumber}.${QURAN_CONFIG.PAGE_FORMAT}`
	},

	// Page dimensions (if you want to maintain aspect ratio)
	PAGE_DIMENSIONS: {
		width: 800,
		height: 1200,
	},
}

// Mapping of page numbers to Juz numbers
export const JUZ_PAGES = {
	1: 1,
	2: 22,
	3: 42,
	// ... add all 30 juz starting pages
}

// Add metadata for each page if needed
export const PAGE_METADATA = {
	1: {
		surahs: ['Al-Fatihah'],
		juz: 1,
		hizb: 1,
	},
	// ... add metadata for other pages
}
