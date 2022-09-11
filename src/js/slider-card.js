const items = document.querySelectorAll('#delivery_options_slider_cards .carousel-item');
const our_services_slider_cards = document.querySelectorAll('#our_services_slider_cards .carousel-item');

craeteCarousel(items);
craeteCarousel(our_services_slider_cards);

function craeteCarousel(params) {
	params.forEach((el) => {
		const minPerSlide = 3;
		let next = el.nextElementSibling;
		for (let i = 1; i < minPerSlide; i++) {
			if (!next) {
				// wrap carousel by using first child
				next = params[0];
			}
			let cloneChild = next.cloneNode(true);
			el.appendChild(cloneChild.children[0]);
			next = next.nextElementSibling;
		}
	});
}
