document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let current = 0;

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    document.querySelector('.carousel-prev')?.addEventListener('click', () => {
        goTo(current === 0 ? slides.length - 1 : current - 1);
    });

    document.querySelector('.carousel-next')?.addEventListener('click', () => {
        goTo(current === slides.length - 1 ? 0 : current + 1);
    });

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
});
