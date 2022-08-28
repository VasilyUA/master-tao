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
