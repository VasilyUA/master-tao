//selecting all required elements
const dropArea = document.getElementById('drag-area');
const dragText = document.getElementById('drag-area-header');
const input = document.getElementById('drag-area-input');

dropArea.onclick = () => {
	input.click(); //if user click on the button then the input also clicked
};

input.addEventListener('change', function () {
	//getting user select file and [0] this means if user select multiple files then we'll select only the first one
	const file = this.files[0];
	dropArea.classList.add('active');
	showFile(file); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener('dragover', (event) => {
	event.preventDefault(); //preventing from default behaviour
	//   dropArea.classList.add("active");
	dragText.textContent = 'Загружено фото товара';
});

//If user leave dragged File from DropArea
dropArea.addEventListener('dragleave', () => {
	//   dropArea.classList.remove("active");
	dragText.textContent = 'Загрузить фото товара';
});

//If user drop File on DropArea
dropArea.addEventListener('drop', (event) => {
	event.preventDefault(); //preventing from default behaviour
	//getting user select file and [0] this means if user select multiple files then we'll select only the first one
	const file = event.dataTransfer.files[0];
	showFile(file); //calling function
});

function showFile(file) {
	let fileType = file.type;
	let validExtensions = ['image/jpeg'];
	if (validExtensions.includes(fileType)) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let fileURL = fileReader.result;
			let w = window.open('about:blank');
			let image = new Image();
			image.src = fileURL;
			w.document.write(image.outerHTML);
		};
		fileReader.readAsDataURL(file);
	} else {
		dragText.textContent = 'Це не тип jpeg';
	}
}
;
const carouselSlide = document.querySelector('[data-slider-element="carousel-slide"]');
const carouselIndicators = document.querySelector('[data-slider-element="carousel-indicators"]');
const carouselInner = document.querySelector('[data-slider-element="carousel-inner"]');
const carouselItemActive = document.querySelector('[data-slider-element="carousel-item-active"]');
const carouselItem = document.querySelectorAll('[data-slider-element="carousel-item"]');

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
;
// Check duplicate id in html
const idsElement = document.querySelectorAll('[id]');
const duplicates = [];
idsElement.forEach(({ id }) => {
	if (duplicates.includes(id)) {
		console.warn(`Duplicate id: ${id}`);
	} else {
		duplicates.push(id);
	}
});

// support format webp for browsers
function support_format_webp() {
	const elem = document.createElement('canvas');

	const isWebP = !!(elem.getContext && elem.getContext('2d'));
	if (isWebP) return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0; // was able or not to get WebP representation
	else return false; // very old browser like IE 8, canvas not supported
}

const isSuport = support_format_webp();
const className = isSuport ? 'webp' : 'no-webp';
document.documentElement.classList.add(className);
;
