document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const getPerSlide = () => {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        return 3;
    };

    function buildSlides() {
        // Collect all images across all slides
        const allImgs = Array.from(track.querySelectorAll('.carousel-slide img'));
        const perSlide = getPerSlide();

        // Clear track
        track.innerHTML = '';

        // Rebuild slides
        for (let i = 0; i < allImgs.length; i += perSlide) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            allImgs.slice(i, i + perSlide).forEach(img => slide.appendChild(img.cloneNode(true)));
            track.appendChild(slide);
        }

        // Rebuild dots
        const dotsContainer = document.querySelector('.carousel-dots');
        if (dotsContainer) {
            const slides = track.querySelectorAll('.carousel-slide');
            dotsContainer.innerHTML = Array.from(slides).map((_, i) =>
                `<span class="carousel-dot${i === 0 ? ' active' : ''}"></span>`
            ).join('');
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) =>
                dot.addEventListener('click', () => goTo(i))
            );
        }

        goTo(0);
    }

    let current = 0;

    function goTo(index) {
        const slides = track.querySelectorAll('.carousel-slide');
        current = Math.max(0, Math.min(index, slides.length - 1));
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );
    }

    document.querySelector('.carousel-prev')?.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carousel-slide');
        goTo(current === 0 ? slides.length - 1 : current - 1);
    });

    document.querySelector('.carousel-next')?.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carousel-slide');
        goTo(current === slides.length - 1 ? 0 : current + 1);
    });

    // Add swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        const slides = track.querySelectorAll('.carousel-slide');
        if (Math.abs(diff) > 50) {
            diff > 0
                ? goTo(current === slides.length - 1 ? 0 : current + 1)
                : goTo(current === 0 ? slides.length - 1 : current - 1);
        }
    });

    buildSlides();
    window.addEventListener('resize', buildSlides);
    initThemeToggle();
    initLightbox();
});

/**
 * Theme Toggle Functionality (persisted in localStorage)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const stored = localStorage.getItem('portfolio-theme');
    if (stored === 'dark') {
        document.documentElement.classList.remove('light-theme');
    } else {
        document.documentElement.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });
}

/**
 * Lightbox Modal for Full View Images
 */
function initLightbox() {
    // 1. Dynamically inject lightbox markup
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.id = 'lightbox-modal';
    modal.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img" src="" alt="Enlarged project image">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('#lightbox-img');
    const closeBtn = modal.querySelector('.lightbox-close');

    // 2. Delegate click listener on track (since slides are dynamically rebuilt on resize)
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    track.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            modalImg.src = e.target.src;
            modalImg.alt = e.target.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    });

    // 3. Modal close bindings
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
