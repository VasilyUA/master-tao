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
