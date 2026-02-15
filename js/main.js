/* ========================================
   NOAVARI HOOSH - AI Company Website
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            // Trigger hero animations
            document.querySelectorAll('.hero-section [data-animate]').forEach(el => {
                el.classList.add('animate');
            });
        }, 800);
    });

    // ==================== PARTICLES BACKGROUND ====================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 58, 237, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 58, 237, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navAnchors = document.querySelectorAll('.nav-links a');

    // Scroll effect
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;

        // Back to top button
        updateBackToTop();
        // Update active nav link
        updateActiveNav();
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu on link click
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close mobile menu on overlay click
    navLinks.addEventListener('click', (e) => {
        if (e.target === navLinks) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // ==================== LOGIN / REGISTER MODAL ====================
    const API_BASE = window.API_BASE || 'http://localhost:3000';
    const loginTriggers = document.querySelectorAll('.login-trigger');
    const loginModal = document.getElementById('loginModal');
    const loginModalOverlay = document.getElementById('loginModalOverlay');
    const loginModalClose = document.getElementById('loginModalClose');
    const loginForm = document.getElementById('loginForm');
    const loginFormError = document.getElementById('loginFormError');
    const registerModal = document.getElementById('registerModal');
    const registerModalOverlay = document.getElementById('registerModalOverlay');
    const registerModalClose = document.getElementById('registerModalClose');
    const registerForm = document.getElementById('registerForm');
    const registerFormError = document.getElementById('registerFormError');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    function openLoginModal() {
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
        document.body.classList.add('no-scroll');
        loginModal.setAttribute('aria-hidden', 'false');
    }
    function closeLoginModal() {
        loginModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        loginModal.setAttribute('aria-hidden', 'true');
    }
    function openRegisterModal() {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
        document.body.classList.add('no-scroll');
        registerModal.setAttribute('aria-hidden', 'false');
    }
    function closeRegisterModal() {
        registerModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        registerModal.setAttribute('aria-hidden', 'true');
    }

    loginTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isLoggedIn()) {
                logout();
            } else {
                openLoginModal();
            }
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    loginModalOverlay && loginModalOverlay.addEventListener('click', closeLoginModal);
    loginModalClose && loginModalClose.addEventListener('click', closeLoginModal);
    registerModalOverlay && registerModalOverlay.addEventListener('click', closeRegisterModal);
    registerModalClose && registerModalClose.addEventListener('click', closeRegisterModal);
    showRegisterBtn && showRegisterBtn.addEventListener('click', () => { closeLoginModal(); openRegisterModal(); });
    showLoginBtn && showLoginBtn.addEventListener('click', () => { closeRegisterModal(); openLoginModal(); });

    function isLoggedIn() {
        return !!localStorage.getItem('authToken');
    }
    function setLoginState(loggedIn, userName) {
        loginTriggers.forEach(btn => {
            btn.textContent = loggedIn ? 'خروج' : 'ورود';
            if (loggedIn) btn.classList.add('logged-in');
            else btn.classList.remove('logged-in');
        });
    }
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        setLoginState(false);
    }
    setLoginState(isLoggedIn());

    loginForm && loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginFormError.textContent = '';
        loginForm.querySelectorAll('.form-group input').forEach(i => { i.classList.remove('error'); });
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
            loginFormError.textContent = 'لطفاً ایمیل و رمز عبور را وارد کنید.';
            return;
        }
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const origHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ورود...';
        submitBtn.disabled = true;
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                if (data.user && data.user.name) localStorage.setItem('userName', data.user.name);
                setLoginState(true, data.user && data.user.name);
                closeLoginModal();
                loginForm.reset();
            } else {
                loginFormError.textContent = data.message || 'ایمیل یا رمز عبور اشتباه است.';
            }
        } catch (err) {
            loginFormError.textContent = 'اتصال به سرور برقرار نشد. سرور را اجرا کنید.';
        }
        submitBtn.innerHTML = origHtml;
        submitBtn.disabled = false;
    });

    registerForm && registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerFormError.textContent = '';
        registerForm.querySelectorAll('.form-group input').forEach(i => { i.classList.remove('error'); });
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        if (!name || !email || !password) {
            registerFormError.textContent = 'همه فیلدها را پر کنید.';
            return;
        }
        if (password.length < 6) {
            registerFormError.textContent = 'رمز عبور حداقل ۶ کاراکتر باشد.';
            return;
        }
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const origHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت‌نام...';
        submitBtn.disabled = true;
        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                if (data.user && data.user.name) localStorage.setItem('userName', data.user.name);
                setLoginState(true);
                closeRegisterModal();
                registerForm.reset();
            } else {
                registerFormError.textContent = data.message || 'ثبت‌نام انجام نشد.';
            }
        } catch (err) {
            registerFormError.textContent = 'اتصال به سرور برقرار نشد.';
        }
        submitBtn.innerHTML = origHtml;
        submitBtn.disabled = false;
    });

    // Active nav link on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, parseInt(delay));
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        // Don't observe hero elements as they're triggered after preloader
        if (!el.closest('.hero-section')) {
            animateOnScroll.observe(el);
        }
    });

    // ==================== COUNTER ANIMATION ====================
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = toPersianNumber(current);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = toPersianNumber(target);
            }
        }

        requestAnimationFrame(updateCount);
    }

    function toPersianNumber(num) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
    }

    // ==================== PORTFOLIO FILTER ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // ==================== LIGHTBOX ====================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const zoomBtns = document.querySelectorAll('.portfolio-zoom');

    // باز کردن لایت‌باکس با کلیک روی دکمه ذره‌بین
    zoomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');

            lightboxImg.src = img;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });

    // باز شدن عکس‌ها روی موبایل با لمس خود تصویر (نه فقط آیکون)
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    portfolioImages.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            // اگر روی لینک جداگانه کلیک شده، همان رفتار پیش‌فرض را نگه داریم
            if (e.target.closest('.portfolio-link')) return;

            const zoomBtn = wrapper.querySelector('.portfolio-zoom');
            if (zoomBtn) {
                zoomBtn.click();
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ==================== BLOG SEARCH & CATEGORIES ====================
    const blogSearch = document.getElementById('blogSearch');
    const catBtns = document.querySelectorAll('.cat-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const featuredPost = document.querySelector('.featured-post');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'all';

    // Category filter
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterBlog();
        });
    });

    // Search
    blogSearch.addEventListener('input', () => {
        filterBlog();
    });

    function filterBlog() {
        const searchTerm = blogSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        // Filter blog cards
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-blog-category');

            const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Filter featured post
        if (featuredPost) {
            const fTitle = featuredPost.querySelector('h3').textContent.toLowerCase();
            const fDesc = featuredPost.querySelector('.featured-content p').textContent.toLowerCase();
            const fCategory = featuredPost.getAttribute('data-blog-category');

            const matchesSearch = !searchTerm || fTitle.includes(searchTerm) || fDesc.includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || fCategory === currentCategory;

            if (matchesSearch && matchesCategory) {
                featuredPost.classList.remove('hidden');
                visibleCount++;
            } else {
                featuredPost.classList.add('hidden');
            }
        }

        // Show/hide no results message
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.style.animation = 'reveal-up 0.5s ease forwards';
            }, 1500);
        }
    });

    function validateForm() {
        let isValid = true;

        // Clear previous errors
        contactForm.querySelectorAll('.form-error').forEach(err => err.textContent = '');
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Name
        const name = document.getElementById('name');
        if (name.value.trim().length < 2) {
            showError(name, 'لطفاً نام خود را وارد کنید');
            isValid = false;
        }

        // Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, 'لطفاً ایمیل معتبر وارد کنید');
            isValid = false;
        }

        // Subject
        const subject = document.getElementById('subject');
        if (!subject.value) {
            showError(subject, 'لطفاً موضوع را انتخاب کنید');
            isValid = false;
        }

        // Message
        const message = document.getElementById('message');
        if (message.value.trim().length < 10) {
            showError(message, 'پیام باید حداقل ۱۰ کاراکتر باشد');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorSpan = input.parentElement.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = message;
    }

    // Remove error on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorSpan = field.parentElement.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    // ==================== NEWSLETTER ====================
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('button');

        if (input.value.trim()) {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            input.value = '';

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-arrow-left"></i>';
                btn.style.background = '';
            }, 3000);
        }
    });

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== SMOOTH SCROLL FOR ANCHORS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==================== DYNAMIC YEAR ====================
    // Already set to 1404 (Persian calendar)

    // ==================== IMAGE LAZY LOADING FALLBACK ====================
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
    }

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // ==================== PERFORMANCE: PAUSE PARTICLES WHEN NOT VISIBLE ====================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animateParticles();
        }
    });

});
