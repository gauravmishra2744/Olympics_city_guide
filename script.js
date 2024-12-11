 // Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
  
    // Check for saved user preference, if any, on load of the website
    if (localStorage.getItem('dark-mode') === 'enabled') {
      body.classList.add('dark-mode');
    }
  
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
      } else {
        localStorage.setItem('dark-mode', 'disabled');
      }
    });
  
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 1000,
      once: true
    });
  
    // Initialize Swiper Sliders
    const swiperOptions = {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    };
  
    const swipers = document.querySelectorAll('.swiper-container');
    swipers.forEach(swiper => new Swiper(swiper, swiperOptions));
  
    // Initialize Magnific Popup for Modals
    $('.open-modal').magnificPopup({
      type: 'inline',
      midClick: true,
      callbacks: {
        open: function() {
          gsap.fromTo('.mfp-content .modal', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' });
        },
        close: function() {
          gsap.to('.mfp-content .modal', { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
      }
    });
  
    // Itinerary Planner
    const itineraryForm = document.getElementById('itinerary-form');
    const itineraryResult = document.getElementById('itinerary-result');
  
    itineraryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const arrival = document.getElementById('arrival').value;
      const departure = document.getElementById('departure').value;
      const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
  
      let resultHTML = `<h3>Your Itinerary</h3>
                        <p><strong>Arrival Date:</strong> ${arrival}</p>
                        <p><strong>Departure Date:</strong> ${departure}</p>
                        <p><strong>Interests:</strong> ${interests.join(', ')}</p>
                        <h4>Recommended Activities:</h4>
                        <ul>`;
  
      interests.forEach(interest => {
        switch(interest) {
          case 'places':
            resultHTML += `<li>Visit Central Park and other beautiful places.</li>`;
            break;
          case 'hotels':
            resultHTML += `<li>Stay at Grand Olympic Hotel for luxury experience.</li>`;
            break;
          case 'restaurants':
            resultHTML += `<li>Dine at Gourmet Delight for exquisite cuisine.</li>`;
            break;
          case 'events':
            resultHTML += `<li>Attend Olympic Fireworks and other exciting events.</li>`;
            break;
          default:
            break;
        }
      });
  
      resultHTML += `</ul>`;
  
      itineraryResult.innerHTML = resultHTML;
      itineraryResult.style.display = 'block';
    });
  
    // Initialize Google Maps
    function initMap() {
      const olympicsCity = { lat: 40.7128, lng: -74.0060 }; // Example coordinates (New York City)
      const map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 12,
        center: olympicsCity,
        styles: [
          // Dark mode map styles
          {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
              { "invert_lightness": true },
              { "saturation": 10 },
              { "lightness": 30 },
              { "gamma": 0.5 }
            ]
          }
        ]
      });
  
      // Add markers for places, hotels, restaurants, and events
      const locations = [
        { position: { lat: 40.785091, lng: -73.968285 }, title: "Central Park" },
        { position: { lat: 40.758896, lng: -73.985130 }, title: "Grand Olympic Hotel" },
        { position: { lat: 40.761432, lng: -73.977621 }, title: "Gourmet Delight" },
        { position: { lat: 40.712776, lng: -74.005974 }, title: "Olympic Fireworks" },
        // Add more locations as needed
      ];
  
      locations.forEach(loc => {
        new google.maps.Marker({
          position: loc.position,
          map: map,
          title: loc.title
        });
      });
    }
  
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
  });
  // script.js

 // Open and Close Chat Widget
document.getElementById('open-chat').addEventListener('click', () => {
  document.getElementById('chat-widget').style.display = 'flex';
  document.getElementById('open-chat').style.display = 'none';
});

document.getElementById('close-chat').addEventListener('click', () => {
  document.getElementById('chat-widget').style.display = 'none';
  document.getElementById('open-chat').style.display = 'block';
});

// Send Message
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim();
  if (userInput === '') return;

  appendMessage('You', userInput);
  document.getElementById('user-input').value = '';

  // Send to back-end
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userInput })
  });

  const data = await response.json();
  appendMessage('ChatGPT', data.reply);
}

function appendMessage(sender, message) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

