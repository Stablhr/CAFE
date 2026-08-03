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

    /* Add-to-order buttons (delegated — works for dynamically added cards) */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-add-to-order');
        if (!btn) return;
        var card = btn.closest('.product-card, .rec-card');
        var name = btn.getAttribute('data-name');
        var sel = getCardSelection(card);
        addToCart(name, sel.size, sel.price);
        var originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Added!';
        btn.disabled = true;
        setTimeout(function () {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1200);
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
       AI BARISTA — MOOD RECOMMENDER
    ============================================= */
    var aiMoods = {
        energized:    { label: 'energized',    tags: { energetic: 3, bold: 2, refreshing: 1 } },
        cozy:         { label: 'relaxed and cozy', tags: { cozy: 3, warm: 2, comforting: 2 } },
        social:       { label: 'happy and social', tags: { fun: 3, refreshing: 2, sweet: 1 } },
        focused:      { label: 'focused and productive', tags: { focused: 3, energetic: 2, bold: 1 } },
        winddown:     { label: 'wind-down',    tags: { relaxing: 3, cozy: 2, comforting: 2 } },
        adventurous:  { label: 'adventurous',  tags: { fun: 3, bold: 2, indulgent: 1 } }
    };

    var aiActivities = {
        study:      { label: 'studying or working',     tags: { focused: 3, energetic: 2 } },
        friends:    { label: 'chatting with friends',   tags: { fun: 3, social: 2, sweet: 1 } },
        solo:       { label: 'solo me-time',            tags: { cozy: 2, comforting: 2, indulgent: 1 } },
        date:       { label: 'a date',                  tags: { indulgent: 2, sweet: 2, fun: 1 } },
        rainy:      { label: 'a rainy, chilly day',     tags: { warm: 3, cozy: 2, comforting: 2 } },
        summer:     { label: 'a hot summer day',        tags: { refreshing: 3, cold: 2 } },
        sweettooth: { label: 'a sweet-tooth craving',   tags: { sweet: 3, indulgent: 2, creamy: 1 } }
    };

    var aiProducts = [
        { name: 'Hot Americano', img: 'assets/hotcold_coffee/hot_americano.png', price: 95, cat: 'coffee', tags: ['bold', 'energetic', 'focused', 'warm'] },
        { name: 'Iced Oreo Coffee Latte', img: 'assets/hotcold_coffee/iced_oreo_coffee_latte.png', price: 125, cat: 'coffee', tags: ['indulgent', 'creamy', 'sweet', 'refreshing', 'cold'] },
        { name: 'Cold Brew Coffee', img: 'assets/hotcold_coffee/cold_brew_coffee.png', price: 95, cat: 'coffee', tags: ['bold', 'energetic', 'refreshing', 'cold'] },
        { name: 'Iced Coffee with Milk', img: 'assets/hotcold_coffee/iced_coffee_with_ milk.png', price: 95, cat: 'coffee', tags: ['refreshing', 'creamy', 'light', 'cold'] },
        { name: 'Cookies & Cream', img: 'assets/hotcold_coffee/cookies_n_cream.png', price: 125, cat: 'coffee', tags: ['indulgent', 'sweet', 'creamy', 'fun', 'cold'] },
        { name: 'Taro Frappé', img: 'assets/frappe/taro.png', price: 135, cat: 'frappe', tags: ['refreshing', 'sweet', 'indulgent', 'fun', 'cold'] },
        { name: 'Mango Frappé', img: 'assets/frappe/mango.png', price: 135, cat: 'frappe', tags: ['refreshing', 'fruity', 'fun', 'sweet', 'cold'] },
        { name: 'Dark Chocolate Frappé', img: 'assets/frappe/dark_chocolate.png', price: 135, cat: 'frappe', tags: ['indulgent', 'refreshing', 'fun', 'sweet', 'cold'] },
        { name: 'Red Velvet Frappé', img: 'assets/frappe/red_velvet.png', price: 135, cat: 'frappe', tags: ['indulgent', 'fun', 'sweet', 'refreshing', 'cold'] },
        { name: 'Salted Caramel Frappé', img: 'assets/frappe/salted_caramel.png', price: 135, cat: 'frappe', tags: ['indulgent', 'sweet', 'fun', 'refreshing', 'cold'] },
        { name: 'Strawberry Cheesecake Frappé', img: 'assets/frappe/strawberry_cheesecake.png', price: 135, cat: 'frappe', tags: ['refreshing', 'fruity', 'sweet', 'fun', 'cold'] },
        { name: 'Okinawa Milk Tea', img: 'assets/milk_tea/okinawa.png', price: 115, cat: 'milktea', tags: ['cozy', 'creamy', 'sweet', 'comforting'] },
        { name: 'Wintermelon Milk Tea', img: 'assets/milk_tea/wintermelon.png', price: 115, cat: 'milktea', tags: ['refreshing', 'light', 'sweet', 'cozy'] },
        { name: 'Hazelnut Milk Tea', img: 'assets/milk_tea/hazelnut.png', price: 115, cat: 'milktea', tags: ['cozy', 'creamy', 'sweet', 'comforting'] },
        { name: 'Hokkaido Milk Tea', img: 'assets/milk_tea/hokkaido.png', price: 115, cat: 'milktea', tags: ['creamy', 'sweet', 'cozy', 'comforting'] },
        { name: 'Salted Caramel Milk Tea', img: 'assets/milk_tea/salted_caramel.png', price: 115, cat: 'milktea', tags: ['indulgent', 'sweet', 'cozy', 'creamy'] },
        { name: 'Taro Milk Tea', img: 'assets/milk_tea/taro.jpg', price: 115, cat: 'milktea', tags: ['creamy', 'sweet', 'cozy', 'comforting'] },
        { name: 'Cheesecake Slice', img: 'assets/pastries/cheesecake_slice.png', price: 165, cat: 'pastry', tags: ['indulgent', 'sweet', 'comforting', 'creamy'] },
        { name: 'Muffin', img: 'assets/pastries/muffin.png', price: 95, cat: 'pastry', tags: ['comforting', 'cozy', 'light', 'sweet'] },
        { name: 'Banana Loaf', img: 'assets/pastries/banana_loaf.png', price: 120, cat: 'pastry', tags: ['comforting', 'cozy', 'sweet'] },
        { name: 'Red Velvet Cake Slice', img: 'assets/pastries/red_velvet_cake_slice.png', price: 175, cat: 'pastry', tags: ['indulgent', 'sweet', 'fun', 'creamy'] },
        { name: 'Triple Chocolate Slice', img: 'assets/pastries/tripple_chocolate_slice.png', price: 160, cat: 'pastry', tags: ['indulgent', 'sweet', 'comforting', 'creamy'] }
    ];

    var selectedMood = null;
    var selectedActivity = null;

    function setupAiChips() {
        document.querySelectorAll('.ai-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                var group = this.closest('[data-group]').getAttribute('data-group');
                this.closest('[data-group]').querySelectorAll('.ai-chip').forEach(function (c) {
                    c.classList.remove('active');
                    c.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                if (group === 'mood') selectedMood = this.getAttribute('data-value');
                else selectedActivity = this.getAttribute('data-value');
                updateRecommendButton();
            });
        });
    }

    function updateRecommendButton() {
        var btn = document.getElementById('btnRecommend');
        btn.disabled = selectedMood === null;
    }

    function buildProfile() {
        var profile = {};
        function add(tagMap) {
            for (var tag in tagMap) {
                if (tagMap.hasOwnProperty(tag)) profile[tag] = (profile[tag] || 0) + tagMap[tag];
            }
        }
        if (selectedMood && aiMoods[selectedMood]) add(aiMoods[selectedMood].tags);
        if (selectedActivity && aiActivities[selectedActivity]) add(aiActivities[selectedActivity].tags);
        return profile;
    }

    function scoreProduct(product, profile) {
        var score = 0;
        for (var i = 0; i < product.tags.length; i++) {
            score += profile[product.tags[i]] || 0;
        }
        return score;
    }

    function pickReason(product, profile) {
        var matched = [];
        for (var i = 0; i < product.tags.length; i++) {
            if (profile[product.tags[i]] > 0) matched.push(product.tags[i]);
        }
        var words = matched.length >= 2 ? matched : product.tags.slice(0, 2);
        return 'A ' + words.join(' + ') + ' pick that fits your vibe perfectly.';
    }

    function categoryLabel(cat) {
        return { coffee: 'Coffee', frappe: 'Frappé', milktea: 'Milk Tea', pastry: 'Pastry' }[cat] || '';
    }

    function aiCardHtml(product, reason) {
        return '<div class="col-md-6 col-lg-4">' +
            '<div class="card h-100 rec-card">' +
            '<div class="card-img-top-wrapper">' +
            '<img src="' + product.img + '" class="card-img-top" alt="' + product.name + '">' +
            '<span class="category-badge">' + categoryLabel(product.cat) + '</span>' +
            '</div>' +
            '<div class="card-body d-flex flex-column">' +
            '<h5 class="card-title display-font">' + product.name + '</h5>' +
            '<p class="rec-reason">' + reason + '</p>' +
            '<div class="mt-auto d-flex justify-content-between align-items-center">' +
            '<span class="price-tag">₱' + product.price + '</span>' +
            '<button class="btn btn-accent btn-add-to-order" data-name="' + product.name + '" data-price="' + product.price + '">Add to Order <i class="bi bi-plus-circle ms-1"></i></button>' +
            '</div></div></div></div>';
    }

    function getRecommendations() {
        var profile = buildProfile();
        var ranked = aiProducts.map(function (p) {
            return { product: p, score: scoreProduct(p, profile) };
        }).filter(function (r) { return r.score > 0; })
          .sort(function (a, b) {
              if (b.score !== a.score) return b.score - a.score;
              return aiProducts.indexOf(a.product) - aiProducts.indexOf(b.product);
          });
        return ranked.map(function (r) { return r.product; });
    }

    function showRecommendations() {
        var picks = getRecommendations();
        var vibe = document.getElementById('aiVibeText');
        var cards = document.getElementById('aiRecCards');
        var pairing = document.getElementById('aiPairing');
        var moodLabel = selectedMood ? aiMoods[selectedMood].label : '';
        var actLabel = selectedActivity ? aiActivities[selectedActivity].label : '';

        if (picks.length === 0) {
            var fallback = aiProducts.filter(function (p) { return p.cat === 'frappe' || p.cat === 'pastry'; });
            picks = [fallback[0], fallback[fallback.length - 1]];
            vibe.textContent = 'We couldn\'t pin your exact vibe — but trust the barista\'s specials for a delicious surprise:';
        } else {
            vibe.textContent = 'For a ' + moodLabel + (actLabel ? ' ' + actLabel : '') + ' kind of day, our AI barista recommends:';
        }
        var profile = buildProfile();
        picks = picks.slice(0, 3);
        cards.innerHTML = picks.map(function (p) { return aiCardHtml(p, pickReason(p, profile)); }).join('');

        var drinks = picks.filter(function (p) { return p.cat !== 'pastry'; });
        var pastries = picks.filter(function (p) { return p.cat === 'pastry'; });
        if (drinks.length && pastries.length) {
            pairing.innerHTML =
                '<h6 class="display-font pairing-title"><i class="bi bi-arrow-repeat me-2"></i>Perfect Pairing</h6>' +
                '<div class="d-flex flex-column flex-md-row gap-3 align-items-md-center">' +
                '<div class="pairing-item">' + drinks[0].name + ' — <span class="price-tag">₱' + drinks[0].price + '</span>' +
                '<button class="btn btn-accent btn-sm ms-2 btn-add-to-order" data-name="' + drinks[0].name + '" data-price="' + drinks[0].price + '">Add</button></div>' +
                '<i class="bi bi-plus-lg pairing-plus d-none d-md-inline"></i>' +
                '<div class="pairing-item">' + pastries[0].name + ' — <span class="price-tag">₱' + pastries[0].price + '</span>' +
                '<button class="btn btn-accent btn-sm ms-2 btn-add-to-order" data-name="' + pastries[0].name + '" data-price="' + pastries[0].price + '">Add</button></div>' +
                '</div>';
        } else {
            pairing.innerHTML = '';
        }
    }

    function resetAi() {
        selectedMood = null;
        selectedActivity = null;
        document.querySelectorAll('.ai-chip').forEach(function (c) {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
        });
        document.getElementById('btnRecommend').disabled = true;
        var results = document.getElementById('aiResults');
        results.classList.add('d-none');
        document.getElementById('aiBrewing').classList.remove('d-none');
        document.getElementById('aiOutput').classList.add('d-none');
    }

    var btnRecommend = document.getElementById('btnRecommend');
    if (btnRecommend) {
        btnRecommend.addEventListener('click', function () {
            var results = document.getElementById('aiResults');
            results.classList.remove('d-none');
            var brewing = document.getElementById('aiBrewing');
            var output = document.getElementById('aiOutput');
            brewing.classList.remove('d-none');
            output.classList.add('d-none');
            results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(function () {
                brewing.classList.add('d-none');
                output.classList.remove('d-none');
                output.classList.add('ai-fade-in');
                showRecommendations();
            }, 700);
        });
    }

    var btnResetAi = document.getElementById('btnResetRecommend');
    if (btnResetAi) btnResetAi.addEventListener('click', resetAi);

    setupAiChips();

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
