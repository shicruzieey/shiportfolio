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
});

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
