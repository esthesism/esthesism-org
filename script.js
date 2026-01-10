// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');

            // Save preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navLinks.contains(event.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Smooth scroll with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('#nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navHeight = document.querySelector('#nav').offsetHeight;

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Audio Player
(function() {
    'use strict';

    // Audio files
    const audioFiles = {
        female: 'audio/esthesism-female.mp3',
        male: 'audio/esthesism-male.mp3'
    };

    // Player state
    const state = {
        voice: 'female',
        rate: 1.0,
        rates: [0.75, 1.0, 1.25, 1.5, 2.0],
        rateIndex: 1
    };

    // DOM Elements
    const player = document.getElementById('audio-player');
    const audio = document.getElementById('audio-element');
    const audioSource = document.getElementById('audio-source');
    const playBtn = document.querySelector('.audio-play-btn');
    const voiceBtn = document.querySelector('.audio-voice-btn');
    const voiceValue = document.querySelector('.audio-voice-value');
    const speedBtn = document.querySelector('.audio-speed-btn');
    const speedValue = document.querySelector('.audio-speed-value');
    const progressFill = document.querySelector('.audio-progress-fill');
    const progressBar = document.querySelector('.audio-progress-bar');
    const timeDisplay = document.querySelector('.audio-time');
    const audioToggle = document.querySelector('.audio-toggle');

    // Load saved preferences
    const savedVoice = localStorage.getItem('audioVoice');
    if (savedVoice && audioFiles[savedVoice]) {
        state.voice = savedVoice;
        audioSource.src = audioFiles[savedVoice];
        voiceValue.textContent = savedVoice === 'female' ? 'Female' : 'Male';
        audio.load();
    }

    const savedRate = localStorage.getItem('audioRate');
    if (savedRate) {
        const rateIndex = state.rates.indexOf(parseFloat(savedRate));
        if (rateIndex !== -1) {
            state.rateIndex = rateIndex;
            state.rate = parseFloat(savedRate);
            audio.playbackRate = state.rate;
            speedValue.textContent = state.rate + 'x';
        }
    }

    // Format time as M:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + secs.toString().padStart(2, '0');
    }

    // Update time display
    function updateTimeDisplay() {
        const current = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);
        timeDisplay.textContent = current + ' / ' + duration;
    }

    // Update progress bar
    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
        }
        updateTimeDisplay();
    }

    // Play/Pause toggle
    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            player.classList.add('playing');
        } else {
            audio.pause();
            player.classList.remove('playing');
        }
    });

    // Voice toggle
    voiceBtn.addEventListener('click', function() {
        const currentTime = audio.currentTime;
        const wasPlaying = !audio.paused;

        state.voice = state.voice === 'female' ? 'male' : 'female';
        voiceValue.textContent = state.voice === 'female' ? 'Female' : 'Male';
        audioSource.src = audioFiles[state.voice];
        localStorage.setItem('audioVoice', state.voice);

        audio.load();
        audio.currentTime = currentTime;
        audio.playbackRate = state.rate;

        if (wasPlaying) {
            audio.play();
        }
    });

    // Speed toggle
    speedBtn.addEventListener('click', function() {
        state.rateIndex = (state.rateIndex + 1) % state.rates.length;
        state.rate = state.rates[state.rateIndex];
        audio.playbackRate = state.rate;
        speedValue.textContent = state.rate + 'x';
        localStorage.setItem('audioRate', state.rate.toString());
    });

    // Progress bar seeking
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        audio.currentTime = clickPosition * audio.duration;
    });

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('loadedmetadata', function() {
        updateTimeDisplay();
        audio.playbackRate = state.rate;
    });

    audio.addEventListener('ended', function() {
        player.classList.remove('playing');
        progressFill.style.width = '0%';
        audio.currentTime = 0;
        updateTimeDisplay();
    });

    audio.addEventListener('play', function() {
        player.classList.add('playing');
    });

    audio.addEventListener('pause', function() {
        player.classList.remove('playing');
    });

    // Toggle player visibility
    audioToggle.addEventListener('click', function() {
        const isHidden = player.classList.toggle('hidden');
        audioToggle.classList.toggle('off', isHidden);

        if (isHidden) {
            audio.pause();
        }

        localStorage.setItem('audioPlayerHidden', isHidden ? 'true' : 'false');
    });

    // Check if player was hidden
    if (localStorage.getItem('audioPlayerHidden') === 'true') {
        player.classList.add('hidden');
        audioToggle.classList.add('off');
    }

})();
