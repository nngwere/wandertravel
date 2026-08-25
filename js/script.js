/* =============================================================
   WANDER TRAVEL AGENCY — Main Script
   ============================================================= */

(function () {
    'use strict';

    // ── Sticky header on scroll ─────────────────────────────────
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Active nav link on scroll ───────────────────────────────
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ── Close mobile nav on link click ─────────────────────────
    const toggler = document.getElementById('toggler');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (toggler) toggler.checked = false;
        });
    });

    // ── Scroll Reveal (IntersectionObserver) ───────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: just show everything
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ── Smooth scroll for all anchor links ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Hero parallax (subtle) ──────────────────────────────────
    const hero = document.querySelector('.home');
    if (hero) {
        window.addEventListener('scroll', () => {
            const offset = window.scrollY;
            hero.style.backgroundPositionY = `calc(center + ${offset * 0.3}px)`;
        }, { passive: true });
    }

    // ── Animate stat counters in hero ───────────────────────────
    const counters = document.querySelectorAll('.hero-stats .num[data-target]');
    let countersStarted = false;

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            requestAnimationFrame(tick);
        });
    };

    // Start counters when hero is in view
    if (counters.length > 0) {
        const heroObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) startCounters();
            },
            { threshold: 0.5 }
        );
        if (hero) heroObserver.observe(hero);
    }

})();
