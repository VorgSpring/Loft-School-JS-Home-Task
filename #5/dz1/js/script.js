document.addEventListener('click', function (event) {
    if (event.target.classList.contains('items__title')) {
        event.target.classList.toggle('items__title--active');
    }
});
