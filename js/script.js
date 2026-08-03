(function () {
    'use strict';

    var cartBadge    = document.getElementById('cartBadge');
    var cartItems    = document.getElementById('cartItems');
    var cartEmpty    = document.getElementById('cartEmpty');
    var cartSummary  = document.getElementById('cartSummary');
    var cartSubtotal = document.getElementById('cartSubtotal');
    var cartTotal    = document.getElementById('cartTotal');
    var btnClear     = document.getElementById('btnClearCart');
    var btnCheckout  = document.getElementById('btnCheckout');
    var contactForm  = document.getElementById('contactForm');
    var charCount    = document.getElementById('charCount');
    var formSuccess  = document.getElementById('formSuccess');
    var backToTopBtn = document.getElementById('backToTop');

    var cart = [];

    var productImages = {
        'Hot Americano': 'assets/hotcold_coffee/hot_americano.png',
        'Iced Oreo Coffee Latte': 'assets/hotcold_coffee/iced_oreo_coffee_latte.png',
        'Cold Brew Coffee': 'assets/hotcold_coffee/cold_brew_coffee.png',
        'Iced Coffee with Milk': 'assets/hotcold_coffee/iced_coffee_with_ milk.png',
        'Cookies & Cream': 'assets/hotcold_coffee/cookies_n_cream.png',
        'Taro Frappé': 'assets/frappe/taro.png',
        'Mango Frappé': 'assets/frappe/mango.png',
        'Dark Chocolate Frappé': 'assets/frappe/dark_chocolate.png',
        'Red Velvet Frappé': 'assets/frappe/red_velvet.png',
        'Salted Caramel Frappé': 'assets/frappe/salted_caramel.png',
        'Strawberry Cheesecake Frappé': 'assets/frappe/strawberry_cheesecake.png',
        'Okinawa Milk Tea': 'assets/milk_tea/okinawa.png',
        'Wintermelon Milk Tea': 'assets/milk_tea/wintermelon.png',
        'Hazelnut Milk Tea': 'assets/milk_tea/hazelnut.png',
        'Hokkaido Milk Tea': 'assets/milk_tea/hokkaido.png',
        'Salted Caramel Milk Tea': 'assets/milk_tea/salted_caramel.png',
        'Taro Milk Tea': 'assets/milk_tea/taro.jpg',
        'Cheesecake Slice': 'assets/pastries/cheesecake_slice.png',
        'Muffin': 'assets/pastries/muffin.png',
        'Banana Loaf': 'assets/pastries/banana_loaf.png',
        'Red Velvet Cake Slice': 'assets/pastries/red_velvet_cake_slice.png',
        'Triple Chocolate Slice': 'assets/pastries/tripple_chocolate_slice.png'
    };

    function getCardSelection(card) {
        var sizeGroup = card.querySelector('.btn-group[data-size-prices]');
        var size = 'Regular';
        var price = 0;
        if (sizeGroup) {
            var checked = sizeGroup.querySelector('input:checked');
            if (checked) {
                size = checked.value;
                var prices = JSON.parse(sizeGroup.getAttribute('data-size-prices'));
                price = prices[size] || 0;
            }
        } else {
            price = parseInt(card.querySelector('.btn-add-to-order').getAttribute('data-price'), 10);
        }
        return { size: size, price: price };
    }

    function addToCart(name, size, price) {
        var key = name + ' (' + size + ')';
        var existing = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].key === key) { existing = cart[i]; break; }
        }
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ key: key, name: name, size: size, price: price, qty: 1 });
        }
        renderCart();
        bumpBadge();
    }

    function updateQty(key, delta) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].key === key) {
                cart[i].qty += delta;
                if (cart[i].qty <= 0) { removeFromCart(key); return; }
                break;
            }
        }
        renderCart();
    }

    function removeFromCart(key) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].key === key) { cart.splice(i, 1); break; }
        }
        renderCart();
    }

    function clearCart() {
        cart.length = 0;
        renderCart();
    }

    function getTotal() {
        var sum = 0;
        for (var i = 0; i < cart.length; i++) { sum += cart[i].price * cart[i].qty; }
        return sum;
    }

    function renderCart() {
        var totalItems = 0;
        for (var i = 0; i < cart.length; i++) totalItems += cart[i].qty;
        cartBadge.textContent = totalItems;

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
            var ex = cartItems.querySelectorAll('.cart-item');
            for (var j = 0; j < ex.length; j++) ex[j].remove();
            return;
        }

        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';

        var html = '';
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var img = productImages[item.name] || 'assets/hotcold_coffee/hot_americano.png';
            html += '<div class="cart-item">';
            html += '<img src="' + img + '" alt="' + item.name + '" class="cart-item-img">';
            html += '<div class="cart-item-info">';
            html += '<div class="cart-item-name">' + item.name + '</div>';
            html += '<div class="cart-item-detail">' + item.size + ' &middot; &#8369;' + item.price + '</div>';
            html += '<div class="cart-item-controls">';
            html += '<button class="btn-qty" data-key="' + item.key + '" data-action="minus">&minus;</button>';
            html += '<span class="qty-value">' + item.qty + '</span>';
            html += '<button class="btn-qty" data-key="' + item.key + '" data-action="plus">+</button>';
            html += '</div></div>';
            html += '<button class="cart-item-remove" data-key="' + item.key + '" data-action="remove" aria-label="Remove">';
            html += '<i class="bi bi-trash3"></i></button></div>';
        }

        var exItems = cartItems.querySelectorAll('.cart-item');
        for (var j = 0; j < exItems.length; j++) exItems[j].remove();
        cartEmpty.insertAdjacentHTML('afterend', html);

        var total = getTotal();
        cartSubtotal.textContent = '\u20B1' + total;
        cartTotal.textContent = '\u20B1' + total;
    }

    function bumpBadge() {
        cartBadge.classList.remove('bump');
        void cartBadge.offsetWidth;
        cartBadge.classList.add('bump');
    }

    /* Cart event delegation */
    cartItems.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var key = btn.getAttribute('data-key');
        var action = btn.getAttribute('data-action');
        if (action === 'plus') updateQty(key, 1);
        else if (action === 'minus') updateQty(key, -1);
        else if (action === 'remove') removeFromCart(key);
    });

    if (btnClear) btnClear.addEventListener('click', clearCart);

    if (btnCheckout) {
        btnCheckout.addEventListener('click', function () {
            if (cart.length === 0) return;
            var offcanvasEl = document.getElementById('cartOffcanvas');
            var inst = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (inst) inst.hide();
            var toastEl = document.getElementById('checkoutToast');
            var toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
            clearCart();
        });
    }

    /* Add-to-order buttons */
    document.querySelectorAll('.btn-add-to-order').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var card = this.closest('.product-card');
            var name = this.getAttribute('data-name');
            var sel = getCardSelection(card);
            addToCart(name, sel.size, sel.price);
            var originalText = this.innerHTML;
            var self = this;
            self.innerHTML = '<i class="bi bi-check-lg me-1"></i> Added!';
            self.disabled = true;
            setTimeout(function () {
                self.innerHTML = originalText;
                self.disabled = false;
            }, 1200);
        });
    });

    /* Size selector updates price */
    document.querySelectorAll('.btn-group[data-size-prices]').forEach(function (group) {
        group.addEventListener('change', function () {
            var card = this.closest('.product-card');
            var prices = JSON.parse(this.getAttribute('data-size-prices'));
            var checked = this.querySelector('input:checked');
            if (checked && prices[checked.value] !== undefined) {
                var priceTag = card.querySelector('.price-tag');
                if (priceTag) priceTag.textContent = '\u20B1' + prices[checked.value];
                var addBtn = card.querySelector('.btn-add-to-order');
                if (addBtn) addBtn.setAttribute('data-price', prices[checked.value]);
            }
        });
    });

    /* =============================================
       PRODUCT FILTERING
    ============================================= */
    function updateFilterCounts() {
        var counts = {};
        document.querySelectorAll('.product-card').forEach(function (card) {
            var cat = card.getAttribute('data-category');
            counts[cat] = (counts[cat] || 0) + 1;
        });
        document.querySelectorAll('.pill-count').forEach(function (el) {
            var cat = el.getAttribute('data-count');
            el.textContent = cat === 'all' ? Object.values(counts).reduce(function (a, b) { return a + b; }, 0) : (counts[cat] || 0);
        });
    }

    function setActiveFilter(filter) {
        document.querySelectorAll('.filter-pill').forEach(function (b) {
            var isActive = b.getAttribute('data-filter') === filter;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        document.querySelectorAll('.dropdown-item[data-filter]').forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-filter') === filter);
        });
    }

    function applyFilter(filter) {
        setActiveFilter(filter);
        var shownIndex = 0;
        document.querySelectorAll('.product-card').forEach(function (card) {
            var cat = card.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
                card.classList.remove('hidden-card');
                card.classList.remove('animated-in');
                card.classList.add('filter-in');
                var self = card;
                setTimeout(function () { self.classList.add('animated-in'); }, shownIndex * 60);
                shownIndex++;
            } else {
                card.classList.remove('filter-in', 'animated-in');
                card.classList.add('hidden-card');
            }
        });
    }

    document.querySelectorAll('.filter-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyFilter(this.getAttribute('data-filter'));
        });
    });

    document.querySelectorAll('.dropdown-item[data-filter]').forEach(function (item) {
        item.addEventListener('click', function () {
            applyFilter(this.getAttribute('data-filter'));
        });
    });

    updateFilterCounts();
    setActiveFilter('all');

    /* =============================================
       SMOOTH SCROLL
    ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                var navCollapse = document.querySelector('.navbar-collapse');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    var toggler = document.querySelector('.navbar-toggler');
                    if (toggler) toggler.click();
                }
            }
        });
    });

    /* =============================================
       SCROLL ANIMATIONS (IntersectionObserver)
    ============================================= */
    var animElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        animElements.forEach(function (el) { observer.observe(el); });
    } else {
        animElements.forEach(function (el) { el.classList.add('animated'); });
    }

    /* =============================================
       ACTIVE NAV HIGHLIGHTING
    ============================================= */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function highlightNav() {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();

    /* =============================================
       NAVBAR SCROLL EFFECT
    ============================================= */
    var mainNav = document.getElementById('mainNav');
    function onNavScroll() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onNavScroll);
    onNavScroll();

    /* =============================================
       BACK TO TOP
    ============================================= */
    function toggleBackToTop() {
        if (window.scrollY > window.innerHeight * 0.5) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', toggleBackToTop);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       FORM VALIDATION & CHARACTER COUNTER
    ============================================= */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (contactForm.checkValidity()) {
                contactForm.style.display = 'none';
                formSuccess.classList.remove('d-none');
                formSuccess.classList.add('show');
                setTimeout(function () {
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
            contactForm.classList.add('was-validated');
        });
    }

    var msgField = document.getElementById('contactMessage');
    if (msgField && charCount) {
        msgField.addEventListener('input', function () {
            charCount.textContent = this.value.length;
        });
    }

})();
