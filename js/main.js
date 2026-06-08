/**
 * Claire Cruz Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initMobileMenu();
    initScrollReveal();
    initThemeToggle();
    initGalleryCarousel();
    initGalleryLightbox();
});

/**
 * Theme Toggle Functionality (persisted in localStorage)
 */
function initThemeToggle() {
    const toggleButtons = document.querySelectorAll('#theme-toggle');

    // Default is light — apply dark only if stored
    const stored = localStorage.getItem('portfolio-theme');
    if (stored === 'dark') {
        document.documentElement.classList.remove('light-theme');
    } else {
        document.documentElement.classList.add('light-theme');
    }

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-theme');
            localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
        });
    });
}

/**
 * Mobile Navigation Menu Toggle and Link Actions
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle menu visibility
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside of navigation area
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Close menu when a navigation link is clicked (useful on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.12 // Trigger when 12% of element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep layout responsive
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * View More Projects Toggle
 */
document.addEventListener('DOMContentLoaded', () => {
    const viewMoreBtn = document.querySelector('.btn-view-more');
    const hiddenProjects = document.querySelectorAll('.project-hidden');

    if (!viewMoreBtn || hiddenProjects.length === 0) return;

    viewMoreBtn.addEventListener('click', () => {
        const isHidden = hiddenProjects[0].style.display === 'none';
        hiddenProjects.forEach(p => {
            p.style.display = isHidden ? 'block' : 'none';
            if (isHidden) p.classList.add('active');
        });
        viewMoreBtn.textContent = isHidden ? 'View Less' : 'View More';
    });
});

/**
 * Gallery Carousel
 */
function initGalleryCarousel() {
    const track = document.getElementById('gallery-carousel-track');
    if (!track) return;

    const isMobile = () => window.innerWidth <= 768;
    let current = 0;

    function buildSlides() {
        const allImgs = Array.from(track.querySelectorAll('.carousel-slide img'));
        const perSlide = isMobile() ? 2 : 3;
        track.innerHTML = '';

        for (let i = 0; i < allImgs.length; i += perSlide) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            allImgs.slice(i, i + perSlide).forEach(img => slide.appendChild(img.cloneNode(true)));
            track.appendChild(slide);
        }

        const dotsContainer = document.querySelector('.gallery-dots');
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

    function goTo(index) {
        const slides = track.querySelectorAll('.carousel-slide');
        current = Math.max(0, Math.min(index, slides.length - 1));
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.gallery-dots .carousel-dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );
    }

    document.querySelector('.gallery-prev-btn')?.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carousel-slide');
        goTo(current === 0 ? slides.length - 1 : current - 1);
    });

    document.querySelector('.gallery-next-btn')?.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carousel-slide');
        goTo(current === slides.length - 1 ? 0 : current + 1);
    });

    track.addEventListener('touchstart', e => { track._startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
        const diff = track._startX - e.changedTouches[0].clientX;
        const slides = track.querySelectorAll('.carousel-slide');
        if (Math.abs(diff) > 50) {
            diff > 0
                ? goTo(current === slides.length - 1 ? 0 : current + 1)
                : goTo(current === 0 ? slides.length - 1 : current - 1);
        }
    });

    buildSlides();
    window.addEventListener('resize', buildSlides);
}

/**
 * Certificates View More Toggle
 */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.cert-view-more');
    const hidden = document.querySelectorAll('.cert-hidden');
    if (!btn || !hidden.length) return;

    btn.addEventListener('click', () => {
        const isHidden = hidden[0].style.display === 'none';
        hidden.forEach(el => el.style.display = isHidden ? 'flex' : 'none');
        btn.textContent = isHidden ? 'View Less' : 'View More';
    });
});

/**
 * Gallery Lightbox
 */
function initGalleryLightbox() {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.innerHTML = `
        <div id="lightbox-inner">
            <button id="lightbox-close">&#10005;</button>
            <img id="lightbox-img" src="" alt="">
        </div>`;
    document.body.appendChild(overlay);

    // Open on image click
    document.querySelectorAll('.gallery-section .carousel-slide img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            document.getElementById('lightbox-img').src = img.src;
            overlay.classList.add('active');
        });
    });

    // Close on button or overlay click
    overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.id === 'lightbox-close') {
            overlay.classList.remove('active');
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') overlay.classList.remove('active');
    });
}
