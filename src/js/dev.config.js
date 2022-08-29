const idsElement = document.querySelectorAll('[id]');

const duplicates = [];
idsElement.forEach(({ id }) => {
	if (duplicates.includes(id)) {
		console.warn(`Duplicate id: ${id}`);
	} else {
		duplicates.push(id);
	}
});
