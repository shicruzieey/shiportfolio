function switchImage(thumb) {
    document.getElementById('hero-img').src = thumb.src;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}
