const carouselSlide = document.querySelector('[slider-element="carousel-slide"]');
const carouselIndicators = document.querySelector('[slider-element="carousel-indicators"]');
const carouselInner = document.querySelector('[slider-element="carousel-inner"]');
const carouselItemActive = document.querySelector('[slider-element="carousel-item-active"]');
const carouselItem = document.querySelectorAll('[slider-element="carousel-item"]');

function resize() {
	if (window.innerWidth <= 991) {
		carouselSlide.className = 'carousel slide';
		carouselIndicators.className = 'carousel-indicators element_carousel-indicators prospects__carousel-indicators';
		carouselInner.className = 'carousel-inner';
		carouselItemActive.className = 'carousel-item active';
		carouselItem.forEach((item) => {
			item.className = 'carousel-item';
		});
	} else {
		carouselSlide.className = '';
		carouselIndicators.className = 'd-none';
		carouselInner.className = 'mt-3 p-3 row row-cols-1 row-cols-lg-4 g-5';
		carouselItemActive.className = 'col';
		carouselItem.forEach((item) => {
			item.className = 'col';
		});
	}
}
resize();
window.addEventListener('resize', resize, true);
