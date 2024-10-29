import React, { useState } from 'react'
import { Menu, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { Button, Card, CardContent, Input } from './ui'
import { surahs, totalPages } from '../data/quran'
import { useQuranPage } from '../hooks/useQuranPage'
import { QURAN_CONFIG } from '../config/quran-config'

const QuranReader = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [isZoomed, setIsZoomed] = useState(false)
	const [isSidenavOpen, setIsSidenavOpen] = useState(false)
	const [searchInput, setSearchInput] = useState('')

	const { loading, error, pageUrl } = useQuranPage(currentPage)

	const goToPage = (pageNum) => {
		if (pageNum >= 1 && pageNum <= QURAN_CONFIG.TOTAL_PAGES) {
			setCurrentPage(pageNum)
			setIsSidenavOpen(false)
		}
	}

	const goToSurah = (surahNum) => {
		if (surahNum >= 1 && surahNum <= surahs.length) {
			goToPage(surahs[surahNum - 1].page)
		}
	}

	// Preload adjacent pages
	React.useEffect(() => {
		const preloadPage = (pageNum) => {
			if (pageNum >= 1 && pageNum <= QURAN_CONFIG.TOTAL_PAGES) {
				const img = new Image()
				img.src = QURAN_CONFIG.getPagePath(pageNum)
			}
		}

		preloadPage(currentPage + 1)
		preloadPage(currentPage - 1)
	}, [currentPage])

	return (
		<>
			{/* Header */}
			<header className='bg-emerald-700 text-white p-4 flex justify-between items-center'>
				<Button variant='ghost' className='text-white hover:bg-emerald-600' onClick={() => setIsSidenavOpen(true)}>
					<Menu className='h-6 w-6' />
				</Button>
				<h1 className='text-xl font-bold'>القرآن الكريم</h1>
				<div className='flex gap-2'>
					<Button variant='ghost' className='text-white hover:bg-emerald-600' onClick={() => setIsZoomed(!isZoomed)}>
						{isZoomed ? <ZoomOut className='h-6 w-6' /> : <ZoomIn className='h-6 w-6' />}
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className='container mx-auto p-4 relative'>
				<div className={`magazine-viewport ${isZoomed ? 'scale-125' : ''} transition-transform duration-300`}>
					<div className='relative'>
						{loading ? (
							<div className='w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg'>
								<Loader className='h-8 w-8 animate-spin text-emerald-700' />
							</div>
						) : error ? (
							<div className='w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg text-red-500'>Failed to load page</div>
						) : (
							<img
								src={pageUrl}
								alt={`Page ${currentPage}`}
								className='w-full rounded-lg shadow-lg'
								style={{
									aspectRatio: `${QURAN_CONFIG.PAGE_DIMENSIONS.width} / ${QURAN_CONFIG.PAGE_DIMENSIONS.height}`,
									objectFit: 'contain',
								}}
							/>
						)}
						<Button variant='ghost' className='absolute left-4 top-1/2 -translate-y-1/2' onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
							<ChevronLeft className='h-8 w-8' />
						</Button>
						<Button variant='ghost' className='absolute right-4 top-1/2 -translate-y-1/2' onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= QURAN_CONFIG.TOTAL_PAGES}>
							<ChevronRight className='h-8 w-8' />
						</Button>
					</div>
				</div>
			</main>

			{/* Sidenav */}
			<div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${isSidenavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
				<div className='p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold'>التنقل</h2>
						<Button variant='ghost' onClick={() => setIsSidenavOpen(false)}>
							✕
						</Button>
					</div>

					<Card className='mb-4'>
						<CardContent>
							<h3 className='text-lg font-semibold mb-2'>الصفحة</h3>
							<Input
								type='number'
								min='1'
								max={QURAN_CONFIG.TOTAL_PAGES}
								placeholder='رقم الصفحة'
								className='text-right'
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										goToPage(parseInt(searchInput))
									}
								}}
							/>
						</CardContent>
					</Card>

					<div className='space-y-2'>
						<h3 className='text-lg font-semibold'>السور</h3>
						<div className='max-h-96 overflow-y-auto'>
							{surahs.map((surah) => (
								<Button key={surah.number} variant='ghost' className='w-full justify-start text-right' onClick={() => goToSurah(surah.number)}>
									{surah.name}
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default QuranReader
