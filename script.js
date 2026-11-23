/* ===================================================================
   EDSON CHINELOS - Landing Page JavaScript
   Theme Toggle, Mobile Menu, Scroll Animations & Interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // ========== DOM ELEMENTS ==========
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // All nav links (desktop + mobile)
    const desktopLinks = document.querySelectorAll('.header__nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    // ========== THEME TOGGLE ==========
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('edson-chinelos-theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('edson-chinelos-theme', theme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        setTheme(next);

        // Re-create icons after theme change for proper rendering
        setTimeout(() => lucide.createIcons(), 50);
    });

    // ========== MOBILE MENU ==========
    const openMobileMenu = () => {
        mobileNav.classList.add('open');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ========== HEADER SCROLL EFFECT ==========
    let lastScroll = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Header background effect
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== ACTIVE NAVIGATION LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Update desktop links
                desktopLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });

                // Update mobile links
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ========== ANIMATED COUNTER (Hero Stats) ==========
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(start + (target - start) * easedProgress);

            element.textContent = current.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Intersection Observer for counters
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    animateCounter(el, target);
                });
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = () => {
        // Add reveal class to elements that should animate
        const selectors = [
            '.service-card',
            '.product-card',
            '.contact__info-card',
            '.contact__form',
            '.about__content',
            '.about__visual-card',
            '.section-header'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('reveal')) {
                    el.classList.add('reveal');
                }
            });
        });
    };

    revealElements();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ========== STAGGERED REVEAL FOR GRIDS ==========
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 100}ms`;
                    child.classList.add('revealed');
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.services__grid, .products__grid, .about__visual').forEach(grid => {
        staggerObserver.observe(grid);
    });

    // ========== CONTACT FORM HANDLING ==========
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <span>Enviando...</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>Mensagem Enviada!</span>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #43a047, #66bb6a)';
                submitBtn.style.opacity = '1';

                // Reset form
                contactForm.reset();

                // Restore button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    lucide.createIcons();
                }, 3000);
            }, 1500);
        });
    }

    // ========== NEWSLETTER FORM ==========
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');

            if (input.value) {
                const originalPlaceholder = input.placeholder;
                input.value = '';
                input.placeholder = '✓ Inscrito com sucesso!';

                setTimeout(() => {
                    input.placeholder = originalPlaceholder;
                }, 3000);
            }
        });
    }

    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== PARALLAX ON HERO (subtle) ==========
    const heroImg = document.querySelector('.hero__bg-img');

    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroImg.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`;
            }
        }, { passive: true });
    }
});
