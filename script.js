document.addEventListener('DOMContentLoaded', function () {

    // ===== Mobile Menu =====
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var nav = document.querySelector('.nav');

    menuBtn.addEventListener('click', function () {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    document.querySelectorAll('.nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // ===== Header scroll effect =====
    var header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        }
    });

    // ===== Leaflet Map =====
    var adelaideCBD = [-34.9285, 138.6007];

    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView(adelaideCBD, 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);

    // Adelaide CBD marker (orange)
    var orangeIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width:14px;height:14px;background:#f5a623;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    L.marker(adelaideCBD, { icon: orangeIcon })
        .addTo(map)
        .bindPopup('<strong>Adelaide CBD</strong>');

    // Service boundary circle (~50km)
    L.circle(adelaideCBD, {
        radius: 50000,
        color: '#2e7d32',
        dashArray: '10, 8',
        fillColor: '#2e7d32',
        fillOpacity: 0.06,
        weight: 2
    }).addTo(map);

    // Serviced suburbs (green markers)
    var greenIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width:12px;height:12px;background:#2e7d32;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    var suburbs = [
        { name: 'Gawler', lat: -34.5966, lng: 138.7449 },
        { name: 'Salisbury', lat: -34.7609, lng: 138.6417 },
        { name: 'Elizabeth', lat: -34.7269, lng: 138.6694 },
        { name: 'Tea Tree Gully', lat: -34.8204, lng: 138.7268 },
        { name: 'Modbury', lat: -34.8326, lng: 138.6844 },
        { name: 'Campbelltown', lat: -34.8699, lng: 138.7230 },
        { name: 'Prospect', lat: -34.8837, lng: 138.5937 },
        { name: 'Unley', lat: -34.9490, lng: 138.5918 },
        { name: 'Norwood', lat: -34.9210, lng: 138.6319 },
        { name: 'Burnside', lat: -34.9370, lng: 138.6610 },
        { name: 'Marion', lat: -35.0134, lng: 138.5561 },
        { name: 'Glenelg', lat: -34.9823, lng: 138.5099 },
        { name: 'Port Adelaide', lat: -34.8471, lng: 138.5003 },
        { name: 'West Torrens', lat: -34.9300, lng: 138.5450 },
        { name: 'Mitcham', lat: -35.0050, lng: 138.6170 },
        { name: 'Happy Valley', lat: -35.0825, lng: 138.5547 },
        { name: 'Morphett Vale', lat: -35.1270, lng: 138.5230 },
        { name: 'Stirling', lat: -35.0027, lng: 138.7170 },
        { name: 'Mount Barker', lat: -35.0682, lng: 138.8586 }
    ];

    suburbs.forEach(function (s) {
        L.marker([s.lat, s.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup('<strong>' + s.name + '</strong>');
    });

    // Find My Location button
    var findBtn = document.getElementById('findLocationBtn');
    var userMarker = null;

    var blueIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width:14px;height:14px;background:#4285f4;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    findBtn.addEventListener('click', function () {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        findBtn.textContent = 'Locating...';

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;

                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                userMarker = L.marker([lat, lng], { icon: blueIcon })
                    .addTo(map)
                    .bindPopup('<strong>Your Location</strong>')
                    .openPopup();

                map.setView([lat, lng], 11);

                var distance = map.distance(adelaideCBD, [lat, lng]);
                if (distance <= 50000) {
                    userMarker.bindPopup('<strong>Your Location</strong><br>Great news! You\'re within our service area.').openPopup();
                } else {
                    userMarker.bindPopup('<strong>Your Location</strong><br>You\'re outside our usual service area. Contact us to discuss!').openPopup();
                }

                findBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> Find My Location';
            },
            function () {
                alert('Unable to retrieve your location. Please check your browser permissions.');
                findBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> Find My Location';
            }
        );
    });

    // ===== Chat Widget =====
    var chatBtn = document.getElementById('chatBtn');
    var chatWindow = document.getElementById('chatWindow');
    var chatClose = document.getElementById('chatClose');
    var chatPrompt = document.getElementById('chatPrompt');
    var chatPromptClose = document.getElementById('chatPromptClose');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var chatMessages = document.getElementById('chatMessages');

    chatBtn.addEventListener('click', function () {
        chatWindow.classList.toggle('active');
        if (chatPrompt) chatPrompt.style.display = 'none';
    });

    chatClose.addEventListener('click', function () {
        chatWindow.classList.remove('active');
    });

    if (chatPromptClose) {
        chatPromptClose.addEventListener('click', function () {
            chatPrompt.style.display = 'none';
        });
    }

    function addMessage(text, type) {
        var msg = document.createElement('div');
        msg.className = 'chat-message ' + type;
        msg.innerHTML = '<p>' + text + '</p>';
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addContactButtons() {
        var btns = document.createElement('div');
        btns.className = 'chat-contact-btns';
        btns.innerHTML = '<a href="tel:0437932116" class="chat-contact-btn chat-contact-call">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
            ' Call 0437 932 116</a>' +
            '<a href="mailto:sakimtbdp@gmail.com?subject=Quote%20Request%20-%20Hutchy%27s%20Lawn%20Mowing" class="chat-contact-btn chat-contact-email">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
            ' Email us</a>';
        chatMessages.appendChild(btns);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    var quickActions = document.getElementById('chatQuickActions');

    var botReplies = {
        quote: 'We\'d love to give you a free quote! The fastest way is to give us a call or send an email with your address and lawn size. We\'ll get back to you within a few hours.',
        services: 'We offer <strong>mowing</strong>, <strong>edging</strong>, and <strong>gardening</strong> services across Adelaide. All jobs include a clean, professional finish. Want a quote for any of these?',
        booking: 'To book a service, just give us a call or shoot us an email with your preferred date and address. We\'ll confirm your booking ASAP!',
        area: 'We service all suburbs within about <strong>50 km of Adelaide CBD</strong>. Not sure if we cover your area? Give us a call and we\'ll let you know!'
    };

    if (quickActions) {
        quickActions.addEventListener('click', function (e) {
            var btn = e.target.closest('.chat-quick-btn');
            if (!btn) return;
            var action = btn.getAttribute('data-action');
            addMessage(btn.textContent, 'user');
            quickActions.style.display = 'none';
            setTimeout(function () {
                addMessage(botReplies[action], 'bot');
                setTimeout(addContactButtons, 500);
            }, 800);
        });
    }

    function getBotReply(text) {
        var t = text.toLowerCase();
        if (t.match(/quote|price|cost|how much|rate/)) return botReplies.quote;
        if (t.match(/book|schedule|appointment|when|available/)) return botReplies.booking;
        if (t.match(/service|mow|edge|garden|trim|what do you/)) return botReplies.services;
        if (t.match(/area|suburb|location|where|cover|adelaide/)) return botReplies.area;
        if (t.match(/thank|thanks|cheers|ta/)) return 'No worries! Feel free to reach out anytime. Have a great day!';
        if (t.match(/hello|hi|hey|g\'?day/)) return 'Hey there! Are you after a quote, or looking to book a service? The quickest way to get sorted is to give us a call or email.';
        return 'Thanks for your message! To get you sorted as quickly as possible, give us a call or send us an email and we\'ll get right back to you.';
    }

    function sendMessage() {
        var text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        if (quickActions) quickActions.style.display = 'none';

        setTimeout(function () {
            addMessage(getBotReply(text), 'bot');
            setTimeout(addContactButtons, 500);
        }, 800);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 68;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

});
